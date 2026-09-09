from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
import json
import uuid
from datetime import datetime

from database.connection import get_db
from database.models import ContactModel, CallRecordModel
from models.schemas import (
    AnalyzeCallRequest,
    AnalyzeTranscriptRequest,
    CallAnalysisResponse,
    ConversationAnalysisResult
)
from ml.voice_analyzer import VoiceAnalyzer
from ml.conversation_analyzer import ConversationAnalyzer
from ml.caller_analyzer import CallerAnalyzer
from ml.risk_engine import RiskEngine
from ml.threat_classifier import ThreatClassifier
from utils.audio_processor import AudioProcessor
from utils.helpers import generate_call_id, format_timestamp

router = APIRouter(prefix="/api", tags=["Analysis"])

@router.post("/analyze-call", response_model=CallAnalysisResponse)
def analyze_call(request: AnalyzeCallRequest, db: Session = Depends(get_db)):
    """
    Run complete VoiceGuard Multi-Signal Analysis Pipeline on a call request or demo scenario.
    """
    # 1. Check if caller is in known contacts
    contact = db.query(ContactModel).filter(ContactModel.phone_number == request.phone_number).first()
    is_known = contact is not None

    caller_name = contact.name if contact else (request.caller_name or "Unknown Caller")

    # 2. Voice Analysis Layer
    voice_res = VoiceAnalyzer.analyze_audio_features(
        scenario=request.scenario,
        is_known_contact=is_known
    )

    # 3. Conversation & Intent Analysis Layer
    conv_res = ConversationAnalyzer.analyze_transcript(
        transcript=request.transcript,
        scenario=request.scenario
    )

    # 4. Caller & Telecom Identity Analysis Layer
    caller_res = CallerAnalyzer.analyze_caller(
        caller_name=caller_name,
        phone_number=request.phone_number,
        caller_type=request.caller_type or "Unknown",
        scenario=request.scenario,
        is_known_contact=is_known,
        transcript=request.transcript
    )

    # 5. Risk Engine Calculation (Explainable Multi-Signal Weighted Formula)
    risk_score, risk_level, breakdown, reasons, recommendation = RiskEngine.calculate(
        voice=voice_res,
        conversation=conv_res,
        caller=caller_res,
        scenario=request.scenario
    )

    # 6. Threat Classification
    threats = ThreatClassifier.classify(
        voice=voice_res,
        conversation=conv_res,
        caller=caller_res,
        explicit_threats=request.threat_types
    )

    # 7. Generate Waveform preview
    waveform = AudioProcessor.generate_waveform_data(is_synthetic=(voice_res.synthetic_probability > 0.6))

    call_id = generate_call_id()
    now_str = format_timestamp()

    response = CallAnalysisResponse(
        call_id=call_id,
        caller_name=caller_res.caller_name,
        phone_number=caller_res.phone_number,
        caller_type=caller_res.caller_type,
        timestamp=now_str,
        duration=request.duration or "2m 34s",
        risk_score=risk_score,
        risk_level=risk_level,
        ai_voice_probability=voice_res.synthetic_probability,
        scam_probability=conv_res.scam_probability,
        threats=threats,
        reasons=reasons,
        risk_breakdown=breakdown,
        voice_analysis=voice_res,
        conversation_analysis=conv_res,
        caller_analysis=caller_res,
        recommendation=recommendation,
        transcript=request.transcript,
        audio_waveform=waveform
    )

    # Save to Call History DB
    try:
        record = CallRecordModel(
            id=call_id,
            caller_name=caller_res.caller_name,
            phone_number=caller_res.phone_number,
            caller_type=caller_res.caller_type,
            timestamp=datetime.utcnow(),
            duration=request.duration or "2m 34s",
            risk_score=risk_score,
            risk_level=risk_level,
            threats_json=json.dumps(threats),
            action_taken="Blocked" if risk_score >= 80 else ("Warned" if risk_score >= 40 else "Allowed"),
            transcript=request.transcript,
            analysis_json=json.dumps(response.dict())
        )
        db.add(record)
        db.commit()
    except Exception as e:
        db.rollback()

    return response

@router.post("/analyze-audio")
async def analyze_audio(
    file: UploadFile = File(...),
    caller_name: Optional[str] = Form("Unknown Caller"),
    phone_number: Optional[str] = Form("+1 555 0123"),
    db: Session = Depends(get_db)
):
    """
    Process uploaded real or sample audio file (.wav, .mp3, .m4a, .webm).
    Extracts metadata, computes acoustic features, and returns explainable threat analysis.
    """
    if not AudioProcessor.is_allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format '{file.filename}'. Allowed formats: .wav, .mp3, .m4a, .webm, .ogg"
        )

    file_bytes = await file.read()
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded audio file is empty.")

    # Save audio file temporarily for analysis
    import tempfile
    import os

    # Create temp file with proper extension
    suffix = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
        tmp_file.write(file_bytes)
        temp_audio_path = tmp_file.name

    try:
        audio_meta = AudioProcessor.get_audio_metadata(file.filename, len(file_bytes))

        # Check contacts
        contact = db.query(ContactModel).filter(ContactModel.phone_number == phone_number).first()
        is_known = contact is not None
        c_name = contact.name if contact else caller_name

        # REAL AUDIO ANALYSIS - Pass the actual file path!
        voice_res = VoiceAnalyzer.analyze_audio_features(
            audio_path=temp_audio_path,
            scenario=None,  # Don't force a scenario - let the analyzer decide
            is_known_contact=is_known
        )

        # Generate a generic transcript for analysis (in production, this would be from speech-to-text)
        transcript = "[Audio analysis only - transcript not available for uploaded file]"

        # Let conversation analyzer work without forced scenario
        conv_res = ConversationAnalyzer.analyze_transcript(transcript=transcript, scenario=None)

        caller_res = CallerAnalyzer.analyze_caller(
            caller_name=c_name,
            phone_number=phone_number,
            caller_type="Unknown",  # Don't assume VoIP or Family
            scenario=None,  # Let analyzer determine based on features
            is_known_contact=is_known,
            transcript=transcript
        )

        risk_score, risk_level, breakdown, reasons, recommendation = RiskEngine.calculate(
            voice=voice_res,
            conversation=conv_res,
            caller=caller_res,
            scenario=None  # Calculate based on actual analysis, not forced scenario
        )

        threats = ThreatClassifier.classify(
            voice=voice_res,
            conversation=conv_res,
            caller=caller_res
        )

        waveform = AudioProcessor.generate_waveform_data(is_synthetic=(voice_res.synthetic_probability > 0.6))
        call_id = generate_call_id()

        analysis_res = CallAnalysisResponse(
            call_id=call_id,
            caller_name=caller_res.caller_name,
            phone_number=caller_res.phone_number,
            caller_type=caller_res.caller_type,
            timestamp=format_timestamp(),
            duration=audio_meta["duration"],
            risk_score=risk_score,
            risk_level=risk_level,
            ai_voice_probability=voice_res.synthetic_probability,
            scam_probability=conv_res.scam_probability,
            threats=threats,
            reasons=reasons,
            risk_breakdown=breakdown,
            voice_analysis=voice_res,
            conversation_analysis=conv_res,
            caller_analysis=caller_res,
            recommendation=recommendation,
            transcript=transcript,
            audio_waveform=waveform
        )

        return {
            "file_info": audio_meta,
            "filename": file.filename,
            "analysis": analysis_res
        }

    finally:
        # Clean up temp file
        try:
            os.unlink(temp_audio_path)
        except:
            pass

@router.post("/analyze-transcript", response_model=ConversationAnalysisResult)
def analyze_transcript(request: AnalyzeTranscriptRequest):
    """
    Dedicated endpoint to analyze custom or live text conversation for scam keywords and intent.
    """
    return ConversationAnalyzer.analyze_transcript(transcript=request.transcript)
