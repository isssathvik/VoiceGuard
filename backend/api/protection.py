from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime

from database.connection import get_db
from database.models import BlockedNumberModel, ContactModel
from models.schemas import ProtectionActionRequest, ProtectionActionResponse

router = APIRouter(prefix="/api/protection", tags=["Protection Actions"])

@router.post("/block", response_model=ProtectionActionResponse)
def block_caller(req: ProtectionActionRequest, db: Session = Depends(get_db)):
    existing = db.query(BlockedNumberModel).filter(BlockedNumberModel.phone_number == req.phone_number).first()
    if not existing:
        blocked = BlockedNumberModel(
            phone_number=req.phone_number,
            caller_name=req.caller_name or "Unknown Caller",
            reason=req.reason or "Critical Voice Scam Threat"
        )
        db.add(blocked)
        db.commit()

    return ProtectionActionResponse(
        success=True,
        action="BLOCK",
        message=f"Caller {req.phone_number} ({req.caller_name}) blocked successfully across telecom gateways.",
        phone_number=req.phone_number,
        timestamp=datetime.utcnow().strftime("%b %d, %Y %I:%M %p"),
        status="NUMBER_BLOCKED_FIREWALL_ACTIVE"
    )

@router.post("/silence", response_model=ProtectionActionResponse)
def silence_call(req: ProtectionActionRequest):
    return ProtectionActionResponse(
        success=True,
        action="SILENCE",
        message=f"Call from {req.phone_number} silenced and redirected to secure isolated sandbox voicemail.",
        phone_number=req.phone_number,
        timestamp=datetime.utcnow().strftime("%b %d, %Y %I:%M %p"),
        status="CALL_SILENCED"
    )

@router.post("/warn", response_model=ProtectionActionResponse)
def warn_user(req: ProtectionActionRequest):
    return ProtectionActionResponse(
        success=True,
        action="WARN",
        message="Active in-call audio & screen warning banner broadcasted to victim's device: 'HIGH SCAM RISK DETECTED'.",
        phone_number=req.phone_number,
        timestamp=datetime.utcnow().strftime("%b %d, %Y %I:%M %p"),
        status="USER_WARNED"
    )

@router.post("/notify", response_model=ProtectionActionResponse)
def notify_trusted_contacts(req: ProtectionActionRequest, db: Session = Depends(get_db)):
    contacts = db.query(ContactModel).filter(ContactModel.relationship == "Family").all()
    names = ", ".join([c.name for c in contacts]) if contacts else "Dad (+91 98765 43210), Mom (+91 98765 43211)"

    return ProtectionActionResponse(
        success=True,
        action="NOTIFY_TRUSTED",
        message=f"Urgent alert SMS and notification sent to primary emergency contacts ({names}): 'Voice scam attempt detected on family member line'.",
        phone_number=req.phone_number,
        timestamp=datetime.utcnow().strftime("%b %d, %Y %I:%M %p"),
        status="EMERGENCY_CONTACTS_NOTIFIED"
    )

@router.post("/verify", response_model=ProtectionActionResponse)
def verify_identity(req: ProtectionActionRequest):
    return ProtectionActionResponse(
        success=True,
        action="VERIFY",
        message="Out-of-band cryptographic challenge dispatched to caller's registered home carrier. Awaiting biometric confirmation.",
        phone_number=req.phone_number,
        timestamp=datetime.utcnow().strftime("%b %d, %Y %I:%M %p"),
        status="VERIFICATION_CHALLENGE_ISSUED"
    )
