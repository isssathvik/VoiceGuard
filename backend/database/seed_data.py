from datetime import datetime, timedelta
import json
from .connection import SessionLocal, Base, engine
from .models import ContactModel, CallRecordModel, ReportModel, BlockedNumberModel, SettingModel
from utils.helpers import generate_report_id

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded
        if db.query(ContactModel).count() > 0:
            return

        # 1. Seed Contacts
        contacts = [
            ContactModel(
                name="Dad",
                phone_number="+91 98765 43210",
                relationship="Family",
                trust_level="Trusted",
                voice_profile_enrolled=True,
                voice_sample_name="dad_voice_profile_v2.wav",
                notes="Primary emergency contact. Voice fingerprint calibrated."
            ),
            ContactModel(
                name="Mom",
                phone_number="+91 98765 43211",
                relationship="Family",
                trust_level="Trusted",
                voice_profile_enrolled=True,
                voice_sample_name="mom_voice_profile_v1.wav",
                notes="Family contact. Voice fingerprint calibrated."
            ),
            ContactModel(
                name="Priya (Sister)",
                phone_number="+91 98765 43212",
                relationship="Family",
                trust_level="Trusted",
                voice_profile_enrolled=True,
                voice_sample_name="priya_voice_profile_v1.wav",
                notes="Family contact."
            ),
            ContactModel(
                name="SBI Branch Manager",
                phone_number="+91 22 2274 0000",
                relationship="Bank",
                trust_level="Trusted",
                voice_profile_enrolled=False,
                voice_sample_name=None,
                notes="Verified official branch tele-banking desk."
            ),
            ContactModel(
                name="Rohit (Office Colleague)",
                phone_number="+91 98111 22334",
                relationship="Work",
                trust_level="Normal",
                voice_profile_enrolled=True,
                voice_sample_name="rohit_sample.wav",
                notes="Team lead on Security Ops."
            )
        ]
        db.add_all(contacts)
        db.commit()

        # 2. Seed Call Records
        now = datetime.utcnow()
        call_records = [
            CallRecordModel(
                id="CALL-89214A",
                caller_name="Dad - Mobile",
                phone_number="+91 98765 43210",
                caller_type="Family",
                timestamp=now - timedelta(minutes=18),
                duration="1m 45s",
                risk_score=3,
                risk_level="SAFE",
                threats_json=json.dumps([]),
                action_taken="Allowed",
                transcript="Caller: Hey beta, reaching home by 7 PM tonight. Let's have dinner together.",
                analysis_json=json.dumps({
                    "ai_voice_probability": 0.03,
                    "scam_probability": 0.02,
                    "risk_score": 3,
                    "risk_level": "SAFE",
                    "recommendation": "ACCEPT",
                    "threats": []
                })
            ),
            CallRecordModel(
                id="CALL-91048B",
                caller_name="Unknown Caller",
                phone_number="+1 555 0123",
                caller_type="VoIP",
                timestamp=now - timedelta(hours=2, minutes=15),
                duration="2m 34s",
                risk_score=94,
                risk_level="CRITICAL",
                threats_json=json.dumps(["Voice Cloning", "Financial Fraud", "OTP Theft", "Social Engineering", "Caller Spoofing"]),
                action_taken="Blocked",
                transcript="Caller: Your bank account has been compromised. Give me the OTP immediately. If you don't provide it in the next two minutes your account will be blocked.",
                analysis_json=json.dumps({
                    "ai_voice_probability": 0.94,
                    "scam_probability": 0.97,
                    "risk_score": 94,
                    "risk_level": "CRITICAL",
                    "recommendation": "BLOCK / REPORT",
                    "threats": ["Voice Cloning", "Financial Fraud", "OTP Theft", "Social Engineering", "Caller Spoofing"]
                })
            ),
            CallRecordModel(
                id="CALL-77312C",
                caller_name="Bank Support (Spoofed)",
                phone_number="+91 1800 11 2211",
                caller_type="Financial",
                timestamp=now - timedelta(hours=6, minutes=40),
                duration="3m 12s",
                risk_score=87,
                risk_level="HIGH",
                threats_json=json.dumps(["Financial Fraud", "Government Impersonation", "Urgency Manipulation"]),
                action_taken="Blocked",
                transcript="Caller: Calling from Central Fraud Cell. Suspicious transaction of Rs 1,45,000 detected. Verify your UPI PIN immediately.",
                analysis_json=json.dumps({
                    "ai_voice_probability": 0.88,
                    "scam_probability": 0.92,
                    "risk_score": 87,
                    "risk_level": "HIGH",
                    "recommendation": "BLOCK",
                    "threats": ["Financial Fraud", "Government Impersonation", "Urgency Manipulation"]
                })
            ),
            CallRecordModel(
                id="CALL-65431D",
                caller_name="Mom",
                phone_number="+91 98765 43211",
                caller_type="Family",
                timestamp=now - timedelta(days=1, hours=3),
                duration="4m 10s",
                risk_score=2,
                risk_level="SAFE",
                threats_json=json.dumps([]),
                action_taken="Allowed",
                transcript="Caller: Remember to pick up the groceries on your way back.",
                analysis_json=json.dumps({
                    "ai_voice_probability": 0.02,
                    "scam_probability": 0.01,
                    "risk_score": 2,
                    "risk_level": "SAFE",
                    "recommendation": "ACCEPT",
                    "threats": []
                })
            ),
            CallRecordModel(
                id="CALL-54321E",
                caller_name="Amazon Delivery",
                phone_number="+91 98220 11223",
                caller_type="Business",
                timestamp=now - timedelta(days=1, hours=8),
                duration="0m 45s",
                risk_score=12,
                risk_level="SAFE",
                threats_json=json.dumps([]),
                action_taken="Allowed",
                transcript="Caller: Sir, I am at the gate with your package.",
                analysis_json=json.dumps({
                    "ai_voice_probability": 0.08,
                    "scam_probability": 0.05,
                    "risk_score": 12,
                    "risk_level": "SAFE",
                    "recommendation": "ACCEPT",
                    "threats": []
                })
            ),
            CallRecordModel(
                id="CALL-43210F",
                caller_name="Telecom KYC Desk (Robo)",
                phone_number="+91 79900 88776",
                caller_type="VoIP",
                timestamp=now - timedelta(days=2, hours=1),
                duration="1m 20s",
                risk_score=78,
                risk_level="HIGH",
                threats_json=json.dumps(["Phishing", "Social Engineering"]),
                action_taken="Warned",
                transcript="Caller: Your SIM card will be deactivated in 2 hours due to pending Aadhaar biometric KYC. Press 9 to connect with verification officer.",
                analysis_json=json.dumps({
                    "ai_voice_probability": 0.79,
                    "scam_probability": 0.81,
                    "risk_score": 78,
                    "risk_level": "HIGH",
                    "recommendation": "BLOCK",
                    "threats": ["Phishing", "Social Engineering"]
                })
            )
        ]
        db.add_all(call_records)
        db.commit()

        # 3. Seed Reports
        reports = [
            ReportModel(
                report_id="VG-20260904-48291",
                call_id="CALL-91048B",
                caller_name="Unknown Caller",
                phone_number="+1 555 0123",
                threat_categories_json=json.dumps(["Voice Cloning", "Financial Fraud", "OTP Theft"]),
                description="Claimed to be bank manager, asked for OTP to verify suspicious transaction with synthesized urgent voice.",
                risk_score=94,
                evidence_status="Audio Waveform & Transcript Attached",
                status="SUBMITTED_TO_CYBER_CELL"
            ),
            ReportModel(
                report_id="VG-20260903-19342",
                call_id="CALL-77312C",
                caller_name="Bank Support (Spoofed)",
                phone_number="+91 1800 11 2211",
                threat_categories_json=json.dumps(["Financial Fraud", "Government Impersonation"]),
                description="Impersonated central fraud wing officer demanding immediate UPI PIN verification.",
                risk_score=87,
                evidence_status="VoIP Trunk Route Logged",
                status="ACTIONED_BLOCKED"
            )
        ]
        db.add_all(reports)
        db.commit()

        # 4. Seed Blocked Numbers
        blocked = [
            BlockedNumberModel(
                phone_number="+1 555 0123",
                caller_name="Unknown Caller (AI Voice)",
                reason="Critical Voice Cloning & OTP Theft scam"
            ),
            BlockedNumberModel(
                phone_number="+91 79900 88776",
                caller_name="Fake KYC Bot",
                reason="SIM deactivation extortion scam"
            )
        ]
        db.add_all(blocked)
        db.commit()

        # 5. Seed Default Settings
        settings = [
            SettingModel(key="ai_detection_enabled", value="true"),
            SettingModel(key="real_time_protection", value="true"),
            SettingModel(key="auto_call_recording", value="false"),
            SettingModel(key="threat_notifications", value="true"),
            SettingModel(key="trusted_contact_alerts", value="true"),
            SettingModel(key="high_risk_call_blocking", value="true"),
            SettingModel(key="sensitivity_level", value="High"),
            SettingModel(key="local_edge_processing", value="true"),
            SettingModel(key="data_retention_days", value="30"),
            SettingModel(key="voice_profile_storage", value="true")
        ]
        db.add_all(settings)
        db.commit()

    finally:
        db.close()
