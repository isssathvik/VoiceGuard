from sqlalchemy import Column, Integer, String, Boolean, Float, Text, DateTime, LargeBinary
from datetime import datetime
import json
from .connection import Base

class ContactModel(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(50), unique=True, nullable=False, index=True)
    relationship = Column(String(50), default="Family")  # Family, Friend, Bank, Work, Other
    trust_level = Column(String(50), default="Trusted")  # Trusted, Normal, Suspicious
    voice_profile_enrolled = Column(Boolean, default=True)
    voice_sample_name = Column(String(100), default="profile_sample.wav")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class CallRecordModel(Base):
    __tablename__ = "call_records"

    id = Column(String(64), primary_key=True, index=True)
    caller_name = Column(String(100), nullable=False)
    phone_number = Column(String(50), nullable=False, index=True)
    caller_type = Column(String(50), default="Unknown")
    timestamp = Column(DateTime, default=datetime.utcnow)
    duration = Column(String(20), default="2m 14s")
    risk_score = Column(Integer, default=0)
    risk_level = Column(String(20), default="SAFE")
    threats_json = Column(Text, default="[]")  # JSON string
    action_taken = Column(String(50), default="Allowed")
    transcript = Column(Text, nullable=True)
    analysis_json = Column(Text, nullable=True)  # Full analysis JSON

    @property
    def threats(self):
        try:
            return json.loads(self.threats_json) if self.threats_json else []
        except Exception:
            return []

    @property
    def analysis_details(self):
        try:
            return json.loads(self.analysis_json) if self.analysis_json else {}
        except Exception:
            return {}


class EvidenceRecordModel(Base):
    __tablename__ = "evidence_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    call_id = Column(String(64), unique=True, nullable=False, index=True)
    audio_filename = Column(String(255), nullable=True)
    audio_data = Column(LargeBinary, nullable=True)
    audio_hash = Column(String(64), nullable=True, index=True)
    result_json = Column(Text, nullable=False)
    result_hash = Column(String(64), nullable=False, index=True)
    previous_hash = Column(String(64), nullable=False)
    evidence_hash = Column(String(64), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class ReportModel(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    report_id = Column(String(64), unique=True, index=True, nullable=False)
    call_id = Column(String(64), nullable=True)
    caller_name = Column(String(100), nullable=False)
    phone_number = Column(String(50), nullable=False)
    threat_categories_json = Column(Text, default="[]")
    description = Column(Text, nullable=False)
    risk_score = Column(Integer, default=94)
    evidence_status = Column(String(50), default="Audio Sample Verified")
    status = Column(String(50), default="SUBMITTED_TO_CYBER_CELL")
    created_at = Column(DateTime, default=datetime.utcnow)

    @property
    def threat_categories(self):
        try:
            return json.loads(self.threat_categories_json) if self.threat_categories_json else []
        except Exception:
            return []

class BlockedNumberModel(Base):
    __tablename__ = "blocked_numbers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    phone_number = Column(String(50), unique=True, index=True, nullable=False)
    caller_name = Column(String(100), default="Unknown Caller")
    reason = Column(String(255), default="Suspicious Voice Scam Activity")
    blocked_at = Column(DateTime, default=datetime.utcnow)

class SettingModel(Base):
    __tablename__ = "settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=False)
