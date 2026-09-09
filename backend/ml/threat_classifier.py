from typing import List
from models.schemas import (
    VoiceAnalysisResult,
    ConversationAnalysisResult,
    CallerAnalysisResult
)

class ThreatClassifier:
    """
    Classifies threat vectors based on multi-modal detection signals.
    """

    @staticmethod
    def classify(
        voice: VoiceAnalysisResult,
        conversation: ConversationAnalysisResult,
        caller: CallerAnalysisResult,
        explicit_threats: List[str] = None
    ) -> List[str]:
        threats = set(explicit_threats or [])

        # AI Voice Cloning
        if voice.synthetic_probability >= 0.70:
            threats.add("Voice Cloning")

        # OTP Theft
        if conversation.otp_requested:
            threats.add("OTP Theft")

        # Financial Fraud
        if conversation.financial_demands or conversation.otp_requested or "Credential / OTP Harvesting" in conversation.detected_intents:
            threats.add("Financial Fraud")

        # Social Engineering
        if conversation.urgency_detected or conversation.threatening_language or "Panic & Urgency Induction" in conversation.detected_intents:
            threats.add("Social Engineering")

        # Caller Spoofing
        if caller.is_spoofed or caller.is_voip or caller.identity_mismatch:
            threats.add("Caller Spoofing")

        # Government Impersonation
        if "Authority & Legal Extortion" in conversation.detected_intents or any("police" in p.phrase.lower() or "cbi" in p.phrase.lower() for p in conversation.suspicious_phrases):
            threats.add("Government Impersonation")

        # Phishing
        if any(p.category == "PHISHING" for p in conversation.suspicious_phrases):
            threats.add("Phishing")

        # If it's a safe call, empty threats
        if voice.genuine_probability >= 0.90 and len(conversation.suspicious_phrases) == 0 and not caller.is_voip:
            threats.clear()

        return sorted(list(threats))
