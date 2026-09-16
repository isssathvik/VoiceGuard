from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ==========================================
# CALL ANALYSIS SCHEMAS
# ==========================================

class SuspiciousPhrase(BaseModel):
    phrase: str
    reason: str
    severity: str = "HIGH"  # CRITICAL, HIGH, MEDIUM, LOW
    category: str  # OTP_REQUEST, FINANCIAL, URGENCY, IMPERSONATION, THREAT

class RiskBreakdown(BaseModel):
    ai_voice_indicators: float = Field(..., description="Weight / Score for voice synthesis markers")
    conversation_behavior: float = Field(..., description="Weight / Score for intent and keywords")
    financial_request: float = Field(..., description="Weight / Score for monetary/OTP demands")
    caller_reputation: float = Field(..., description="Weight / Score for number/VoIP/spoofing")
    call_metadata: float = Field(..., description="Weight / Score for time, duration, origin anomalies")

class RiskFactor(BaseModel):
    factor: str
    severity: str  # CRITICAL, HIGH, MEDIUM, LOW
    description: str

class VoiceAnalysisResult(BaseModel):
    synthetic_probability: float  # 0.0 to 1.0 (e.g. 0.94)
    genuine_probability: float    # 0.0 to 1.0 (e.g. 0.06)
    prosody_anomaly_detected: bool
    spectral_artifacts_detected: bool
    abnormal_pauses: bool
    voice_profile_match: Optional[float] = None  # None if unknown contact
    pitch_consistency: float = 0.85

class ConversationAnalysisResult(BaseModel):
    scam_probability: float
    detected_intents: List[str]
    suspicious_phrases: List[SuspiciousPhrase]
    urgency_detected: bool
    otp_requested: bool
    financial_demands: bool
    threatening_language: bool

class CallerAnalysisResult(BaseModel):
    caller_name: str
    phone_number: str
    caller_type: str  # Family, Unknown, Financial, Government, VoIP, Business
    is_known_contact: bool
    trust_level: str  # Trusted, Unknown, Suspicious, Blocked
    is_voip: bool
    is_spoofed: bool
    identity_mismatch: bool
    identity_mismatch_reason: Optional[str] = None

class CallAnalysisResponse(BaseModel):
    call_id: str
    caller_name: str
    phone_number: str
    caller_type: str
    timestamp: str
    duration: str
    risk_score: int  # 0 to 100
    risk_level: str  # SAFE, LOW, MEDIUM, HIGH, CRITICAL
    ai_voice_probability: float
    scam_probability: float
    threats: List[str]
    reasons: List[RiskFactor]
    risk_breakdown: RiskBreakdown
    voice_analysis: VoiceAnalysisResult
    conversation_analysis: ConversationAnalysisResult
    caller_analysis: CallerAnalysisResult
    recommendation: str  # ACCEPT, VERIFY, WARN, BLOCK, REPORT
    transcript: Optional[str] = None
    audio_waveform: Optional[List[float]] = None
    audio_hash: Optional[str] = None
    result_hash: Optional[str] = None
    evidence_hash: Optional[str] = None

# ==========================================
# REQUEST SCHEMAS
# ==========================================

class AnalyzeCallRequest(BaseModel):
    caller_name: Optional[str] = "Unknown Caller"
    phone_number: str = "+1 555 0123"
    caller_type: Optional[str] = "VoIP"
    transcript: Optional[str] = None
    threat_types: Optional[List[str]] = []
    duration: Optional[str] = "2m 34s"
    scenario: Optional[str] = None  # "safe_family", "ai_bank_scam", "govt_impersonation", etc.

class AnalyzeTranscriptRequest(BaseModel):
    transcript: str
    caller_name: Optional[str] = "Unknown Caller"
    phone_number: Optional[str] = "+1 555 0123"

# ==========================================
# CONTACT SCHEMAS
# ==========================================

class ContactBase(BaseModel):
    name: str
    phone_number: str
    relationship: str  # Family, Friend, Bank, Work, Other
    trust_level: str = "Trusted"  # Trusted, Normal, Suspicious
    voice_profile_enrolled: bool = True
    voice_sample_name: Optional[str] = "profile_sample.wav"
    notes: Optional[str] = None

class ContactCreate(ContactBase):
    pass

class ContactUpdate(BaseModel):
    name: Optional[str] = None
    phone_number: Optional[str] = None
    relationship: Optional[str] = None
    trust_level: Optional[str] = None
    voice_profile_enrolled: Optional[bool] = None
    notes: Optional[str] = None

class ContactResponse(ContactBase):
    id: int
    created_at: str

# ==========================================
# CALL HISTORY SCHEMAS
# ==========================================

class CallRecordResponse(BaseModel):
    id: str
    caller_name: str
    phone_number: str
    caller_type: str
    timestamp: str
    duration: str
    risk_score: int
    risk_level: str
    threats: List[str]
    action_taken: str  # Allowed, Blocked, Warned, Verified, Reported
    analysis_details: Optional[Dict[str, Any]] = None

# ==========================================
# REPORT SCHEMAS
# ==========================================

class ReportCreate(BaseModel):
    call_id: Optional[str] = None
    caller_name: str
    phone_number: str
    threat_categories: List[str]
    description: str
    risk_score: Optional[int] = 94
    audio_evidence_attached: bool = False
    evidence_filename: Optional[str] = None
    incident_date: Optional[str] = None

class ReportResponse(BaseModel):
    report_id: str
    call_id: Optional[str]
    caller_name: str
    phone_number: str
    threat_categories: List[str]
    description: str
    risk_score: int
    evidence_status: str
    status: str
    created_at: str

# ==========================================
# PROTECTION ACTION SCHEMAS
# ==========================================

class ProtectionActionRequest(BaseModel):
    phone_number: str
    caller_name: Optional[str] = "Unknown"
    reason: Optional[str] = "Suspicious AI voice activity"
    call_id: Optional[str] = None

class ProtectionActionResponse(BaseModel):
    success: bool
    action: str  # BLOCK, SILENCE, WARN, NOTIFY_TRUSTED, VERIFY
    message: str
    phone_number: str
    timestamp: str
    status: str

# ==========================================
# STATISTICS SCHEMAS
# ==========================================

class ThreatDistributionItem(BaseModel):
    threat_name: str
    count: int
    percentage: float
    color: str

class RiskTrendItem(BaseModel):
    date: str
    avg_risk: int
    call_count: int
    blocked_count: int

class StatisticsResponse(BaseModel):
    total_calls_analyzed: int
    safe_calls: int
    suspicious_calls: int
    blocked_calls: int
    avg_risk_score: int
    threats_detected: int
    detection_accuracy: float
    avg_latency_ms: int
    threat_distribution: List[ThreatDistributionItem]
    risk_trend: List[RiskTrendItem]

# ==========================================
# SETTINGS SCHEMAS
# ==========================================

class SettingsConfig(BaseModel):
    ai_detection_enabled: bool = True
    real_time_protection: bool = True
    auto_call_recording: bool = False
    threat_notifications: bool = True
    trusted_contact_alerts: bool = True
    high_risk_call_blocking: bool = True
    sensitivity_level: str = "High"  # Normal, High, Aggressive
    local_edge_processing: bool = True
    data_retention_days: int = 30
    voice_profile_storage: bool = True
