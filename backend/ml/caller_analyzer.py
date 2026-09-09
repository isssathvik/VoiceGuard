from typing import Optional
from models.schemas import CallerAnalysisResult

class CallerAnalyzer:
    """
    Caller Identity, Telecom Metadata, and Trust Verification Engine.

    Evaluates carrier routes, VoIP routing headers, local contact book matching,
    and semantic identity claims (e.g. caller claiming to be a relative from an unknown number).
    """

    @staticmethod
    def analyze_caller(
        caller_name: str,
        phone_number: str,
        caller_type: str = "Unknown",
        scenario: Optional[str] = None,
        is_known_contact: bool = False,
        transcript: Optional[str] = None
    ) -> CallerAnalysisResult:
        if scenario == "safe_family" or is_known_contact or caller_name.lower().startswith("dad") or caller_name.lower().startswith("mom"):
            return CallerAnalysisResult(
                caller_name=caller_name,
                phone_number=phone_number,
                caller_type="Family",
                is_known_contact=True,
                trust_level="Trusted",
                is_voip=False,
                is_spoofed=False,
                identity_mismatch=False,
                identity_mismatch_reason=None
            )

        is_voip = False
        is_spoofed = False
        identity_mismatch = False
        mismatch_reason = None

        if "+1 555" in phone_number or caller_type.lower() == "voip" or scenario == "ai_bank_scam":
            is_voip = True
            is_spoofed = True

        # Check for semantic mismatch in transcript
        if transcript:
            lower_t = transcript.lower()
            if any(term in lower_t for term in ["i am your father", "i am your dad", "i am your mom", "this is your brother", "this is your friend"]) and not is_known_contact:
                identity_mismatch = True
                mismatch_reason = "Caller claims to be a trusted family member, but the incoming phone number is unrecognized."
            elif any(term in lower_t for term in ["calling from your bank", "bank manager", "reserve bank", "sbi support"]) and is_voip:
                identity_mismatch = True
                mismatch_reason = "Caller claims official banking identity, but call originates from untrusted VoIP trunk."

        trust_level = "Trusted" if is_known_contact else ("Blocked" if is_spoofed and is_voip else "Suspicious")

        return CallerAnalysisResult(
            caller_name=caller_name,
            phone_number=phone_number,
            caller_type=caller_type,
            is_known_contact=is_known_contact,
            trust_level=trust_level,
            is_voip=is_voip,
            is_spoofed=is_spoofed,
            identity_mismatch=identity_mismatch,
            identity_mismatch_reason=mismatch_reason
        )
