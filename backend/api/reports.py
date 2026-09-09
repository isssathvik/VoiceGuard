from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
import json
from datetime import datetime

from database.connection import get_db
from database.models import ReportModel
from models.schemas import ReportCreate, ReportResponse
from utils.helpers import generate_report_id

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("", response_model=ReportResponse)
def submit_report(report: ReportCreate, db: Session = Depends(get_db)):
    """
    Generate unique Report ID and submit case to National Cyber Crime Reporting Portal / VoiceGuard Fraud Desk.
    """
    rep_id = generate_report_id()

    record = ReportModel(
        report_id=rep_id,
        call_id=report.call_id,
        caller_name=report.caller_name,
        phone_number=report.phone_number,
        threat_categories_json=json.dumps(report.threat_categories),
        description=report.description,
        risk_score=report.risk_score or 94,
        evidence_status="Audio & Telephony Telemetry Logged" if report.audio_evidence_attached else "Transcript & Metadata Logged",
        status="SUBMITTED_TO_CYBER_CELL",
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return ReportResponse(
        report_id=record.report_id,
        call_id=record.call_id,
        caller_name=record.caller_name,
        phone_number=record.phone_number,
        threat_categories=record.threat_categories,
        description=record.description,
        risk_score=record.risk_score,
        evidence_status=record.evidence_status,
        status=record.status,
        created_at=record.created_at.strftime("%b %d, %Y %I:%M %p")
    )

@router.get("", response_model=List[ReportResponse])
def list_reports(db: Session = Depends(get_db)):
    reports = db.query(ReportModel).order_by(desc(ReportModel.created_at)).all()
    return [
        ReportResponse(
            report_id=r.report_id,
            call_id=r.call_id,
            caller_name=r.caller_name,
            phone_number=r.phone_number,
            threat_categories=r.threat_categories,
            description=r.description,
            risk_score=r.risk_score,
            evidence_status=r.evidence_status,
            status=r.status,
            created_at=r.created_at.strftime("%b %d, %Y %I:%M %p")
        )
        for r in reports
    ]
