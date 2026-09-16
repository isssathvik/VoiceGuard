from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List
import json
import uuid
from datetime import datetime

from database.connection import get_db
from database.models import ContactModel, CallRecordModel, EvidenceRecordModel
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
from utils.blockchain import build_block_hash, hash_bytes, hash_json

router = APIRouter(prefix="/api", tags=["Analysis"])


def _persist_evidence(
    db: Session,
    analysis: CallAnalysisResponse,
    audio_bytes: Optional[bytes] = None,
    audio_filename: Optional[str] = None,
) -> EvidenceRecordModel:
    result_payload = analysis.dict(exclude={"audio_hash", "result_hash", "evidence_hash"})
    record = _persist_evidence_payload(db, analysis.call_id, result_payload, audio_bytes, audio_filename)
    analysis.audio_hash = record.audio_hash
    analysis.result_hash = record.result_hash
    analysis.evidence_hash = record.evidence_hash
    return record


def _persist_evidence_payload(
    db: Session,
    call_id: str,
    result_payload: dict,
    audio_bytes: Optional[bytes] = None,
    audio_filename: Optional[str] = None,
) -> EvidenceRecordModel:
    result_json = json.dumps(result_payload, sort_keys=True, separators=(",", ":"), default=str)
    result_hash = hash_json(result_payload)
    audio_hash = hash_bytes(audio_bytes) if audio_bytes is not None else None
    previous = db.query(EvidenceRecordModel).order_by(EvidenceRecordModel.id.desc()).first()
    previous_hash = previous.evidence_hash if previous else "0" * 64
    evidence_created_at = datetime.utcnow()
    block = {
        "index": (previous.id + 1 if previous else 1),
        "timestamp": evidence_created_at.isoformat(),
        "payload": {
            "call_id": call_id,
            "audio_hash": audio_hash,
            "result_hash": result_hash,
        },
        "previous_hash": previous_hash,
    }
    block["hash"] = build_block_hash(block)
    record = EvidenceRecordModel(
        call_id=call_id,
        audio_filename=audio_filename,
        audio_data=audio_bytes,
        audio_hash=audio_hash,
        result_json=result_json,
        result_hash=result_hash,
        previous_hash=previous_hash,
        evidence_hash=block["hash"],
        created_at=evidence_created_at,
    )
    db.add(record)
    return record

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
        _persist_evidence(db, response)
        record.analysis_json = json.dumps(response.dict())
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

        _persist_evidence(db, analysis_res, file_bytes, file.filename)
        db.commit()

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


@router.post("/compare-voices")
async def compare_voices(
    original: UploadFile = File(...),
    cloned: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Compare two uploaded recordings and persist each result as an evidence record."""
    import tempfile
    import os

    uploads = [(original, "original"), (cloned, "cloned")]
    temp_paths = []
    results = {}
    try:
        for upload, label in uploads:
            if not AudioProcessor.is_allowed_file(upload.filename):
                raise HTTPException(status_code=400, detail=f"Unsupported {label} audio format")
            audio_bytes = await upload.read()
            if not audio_bytes:
                raise HTTPException(status_code=400, detail=f"{label.title()} audio file is empty")
            suffix = os.path.splitext(upload.filename)[1]
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp_file:
                tmp_file.write(audio_bytes)
                temp_paths.append(tmp_file.name)

            voice_result = VoiceAnalyzer.analyze_audio_file(temp_paths[-1])
            synthetic_score = round(voice_result.synthetic_probability * 100, 1)
            genuine_score = round(voice_result.genuine_probability * 100, 1)
            call_id = generate_call_id()
            result_payload = {
                "comparison_role": label,
                "filename": upload.filename,
                "synthetic_probability": synthetic_score,
                "genuine_probability": genuine_score,
                "prosody_anomaly_detected": voice_result.prosody_anomaly_detected,
                "spectral_artifacts_detected": voice_result.spectral_artifacts_detected,
                "abnormal_pauses": voice_result.abnormal_pauses,
                "pitch_consistency": round(voice_result.pitch_consistency * 100, 1),
            }
            evidence = _persist_evidence_payload(db, call_id, result_payload, audio_bytes, upload.filename)
            results[label] = {
                "call_id": call_id,
                "filename": upload.filename,
                "synthetic_score": synthetic_score,
                "genuine_score": genuine_score,
                "audio_hash": evidence.audio_hash,
                "result_hash": evidence.result_hash,
                "evidence_hash": evidence.evidence_hash,
                "features": result_payload,
            }

        db.commit()
        difference = round(abs(results["cloned"]["synthetic_score"] - results["original"]["synthetic_score"]), 1)
        return {
            "original": results["original"],
            "cloned": results["cloned"],
            "synthetic_score_difference": difference,
            "interpretation": "Higher cloned-vs-original separation indicates stronger synthetic acoustic evidence; review the waveform and source quality before making a final decision.",
        }
    finally:
        for path in temp_paths:
            try:
                os.unlink(path)
            except OSError:
                pass

@router.post("/analyze-transcript", response_model=ConversationAnalysisResult)
def analyze_transcript(request: AnalyzeTranscriptRequest):
    """
    Dedicated endpoint to analyze custom or live text conversation for scam keywords and intent.
    """
    return ConversationAnalyzer.analyze_transcript(transcript=request.transcript)
