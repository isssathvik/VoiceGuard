from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
import json

from database.connection import get_db
from database.models import CallRecordModel
from models.schemas import CallRecordResponse

router = APIRouter(prefix="/api/calls", tags=["Calls"])

@router.get("", response_model=List[CallRecordResponse])
def get_calls(
    filter_type: Optional[str] = Query(None, description="All, Safe, Suspicious, Critical"),
    sort_by: Optional[str] = Query("date", description="date, risk, caller"),
    db: Session = Depends(get_db)
):
    query = db.query(CallRecordModel)

    if filter_type and filter_type.lower() != "all":
        if filter_type.lower() == "safe":
            query = query.filter(CallRecordModel.risk_score <= 40)
        elif filter_type.lower() == "suspicious":
            query = query.filter(CallRecordModel.risk_score > 40, CallRecordModel.risk_score < 80)
        elif filter_type.lower() == "critical":
            query = query.filter(CallRecordModel.risk_score >= 80)

    if sort_by == "risk":
        query = query.order_by(desc(CallRecordModel.risk_score))
    elif sort_by == "caller":
        query = query.order_by(CallRecordModel.caller_name)
    else:
        query = query.order_by(desc(CallRecordModel.timestamp))

    records = query.all()

    result = []
    for r in records:
        result.append(
            CallRecordResponse(
                id=r.id,
                caller_name=r.caller_name,
                phone_number=r.phone_number,
                caller_type=r.caller_type,
                timestamp=r.timestamp.strftime("%b %d, %Y %I:%M %p"),
                duration=r.duration,
                risk_score=r.risk_score,
                risk_level=r.risk_level,
                threats=r.threats,
                action_taken=r.action_taken,
                analysis_details=r.analysis_details
            )
        )
    return result

@router.get("/{call_id}")
def get_call_by_id(call_id: str, db: Session = Depends(get_db)):
    record = db.query(CallRecordModel).filter(CallRecordModel.id == call_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Call record not found.")

    return {
        "id": record.id,
        "caller_name": record.caller_name,
        "phone_number": record.phone_number,
        "caller_type": record.caller_type,
        "timestamp": record.timestamp.strftime("%b %d, %Y %I:%M %p"),
        "duration": record.duration,
        "risk_score": record.risk_score,
        "risk_level": record.risk_level,
        "threats": record.threats,
        "action_taken": record.action_taken,
        "transcript": record.transcript,
        "analysis_details": record.analysis_details
    }
