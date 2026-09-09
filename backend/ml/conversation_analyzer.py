import re
from typing import List, Dict, Any, Optional
from models.schemas import ConversationAnalysisResult, SuspiciousPhrase

class ConversationAnalyzer:
    """
    AI/ML Conversation & NLP Intent Analysis Abstraction Layer.

    In production, this module utilizes fine-tuned RoBERTa / DeBERTa or local LLMs
    to perform semantic intent extraction and social-engineering vulnerability mapping.

    For this prototype, it uses a pattern-driven security taxonomy and semantic
    risk lexicon matching to identify OTP requests, financial coercion, urgency manipulation,
    and impersonation attacks with pinpoint reasoning.
    """

    DANGEROUS_PATTERNS = [
        {
            "pattern": r"(give\s+me\s+the\s+otp|tell\s+me\s+the\s+otp|share\s+the\s+otp|one\s+time\s+password|verify\s+otp|sms\s+code)",
            "reason": "Direct credential and two-factor authentication theft request",
            "severity": "CRITICAL",
            "category": "OTP_REQUEST"
        },
        {
            "pattern": r"(account\s+(?:will\s+be|has\s+been)\s+(?:blocked|suspended|frozen|compromised|closed))",
            "reason": "Psychological intimidation through manufactured account threat",
            "severity": "CRITICAL",
            "category": "URGENCY"
        },
        {
            "pattern": r"(within\s+(?:\d+|two|five|ten)\s+minutes?|immediately|right\s+now|urgent|urgent\s+action\s+required)",
            "reason": "Artificial urgency inducing panic to bypass rational cognitive checks",
            "severity": "HIGH",
            "category": "URGENCY"
        },
        {
            "pattern": r"(transfer\s+(?:the\s+)?money|send\s+(?:rs\.?|inr|\$|\d+)|upi\s+pin|bank\s+manager|customer\s+care|rbi\s+guidelines)",
            "reason": "Unauthorized financial transfer or banking impersonation request",
            "severity": "HIGH",
            "category": "FINANCIAL"
        },
        {
            "pattern": r"(police\s+department|cbi\s+officer|customs\s+department|digital\s+arrest|arrest\s+warrant|money\s+laundering\s+case)",
            "reason": "Government authority impersonation and extortion (Digital Arrest scam)",
            "severity": "CRITICAL",
            "category": "IMPERSONATION"
        },
        {
            "pattern": r"(don\'?t\s+tell\s+anyone|keep\s+this\s+confidential|don\'?t\s+disconnect\s+the\s+call)",
            "reason": "Isolation tactic preventing victim from seeking second opinion",
            "severity": "HIGH",
            "category": "THREAT"
        },
        {
            "pattern": r"(click\s+(?:on\s+)?the\s+link|download\s+(?:anydesk|teamviewer|rustdesk|apk)|install\s+this\s+app)",
            "reason": "Remote access trojan or malware installation vector",
            "severity": "CRITICAL",
            "category": "PHISHING"
        }
    ]

    @classmethod
    def analyze_transcript(
        cls,
        transcript: Optional[str] = None,
        scenario: Optional[str] = None
    ) -> ConversationAnalysisResult:
        if scenario == "safe_family":
            return ConversationAnalysisResult(
                scam_probability=0.02,
                detected_intents=["Casual greeting", "Family coordination", "Routine schedule check"],
                suspicious_phrases=[],
                urgency_detected=False,
                otp_requested=False,
                financial_demands=False,
                threatening_language=False
            )

        # Default text if none supplied but scenario is known
        if not transcript:
            if scenario == "ai_bank_scam":
                transcript = (
                    "Caller: Your bank account has been compromised. "
                    "Caller: Give me the OTP immediately. "
                    "Caller: If you don't provide it in the next two minutes your account will be blocked."
                )
            elif scenario == "govt_impersonation":
                transcript = (
                    "Caller: This is Officer Sharma from Crime Branch. "
                    "Caller: An arrest warrant is issued in a money laundering case. "
                    "Caller: You are in digital arrest. Do not disconnect the call or transfer money to clearance account."
                )
            else:
                transcript = (
                    "Caller: Hello, I am calling from bank technical support. "
                    "We noticed an unauthorized withdrawal. Share the OTP sent to your phone right now to cancel it."
                )

        suspicious_phrases: List[SuspiciousPhrase] = []
        otp_found = False
        urgency_found = False
        financial_found = False
        threat_found = False
        impersonation_found = False

        lower_text = transcript.lower()

        for item in cls.DANGEROUS_PATTERNS:
            matches = re.finditer(item["pattern"], lower_text, re.IGNORECASE)
            for m in matches:
                exact_phrase = transcript[m.start():m.end()]
                suspicious_phrases.append(
                    SuspiciousPhrase(
                        phrase=exact_phrase,
                        reason=item["reason"],
                        severity=item["severity"],
                        category=item["category"]
                    )
                )
                if item["category"] == "OTP_REQUEST":
                    otp_found = True
                elif item["category"] == "URGENCY":
                    urgency_found = True
                elif item["category"] == "FINANCIAL":
                    financial_found = True
                elif item["category"] == "THREAT":
                    threat_found = True
                elif item["category"] == "IMPERSONATION":
                    impersonation_found = True

        # Calculate scam probability based on detected hazards
        scam_prob = 0.05
        intents = []
        if otp_found:
            scam_prob += 0.45
            intents.append("Credential / OTP Harvesting")
        if financial_found:
            scam_prob += 0.25
            intents.append("Unauthorized Financial Demand")
        if urgency_found:
            scam_prob += 0.20
            intents.append("Panic & Urgency Induction")
        if impersonation_found:
            scam_prob += 0.30
            intents.append("Authority & Legal Extortion")
        if threat_found:
            scam_prob += 0.15
            intents.append("Social Isolation Tactic")

        scam_prob = min(0.99, round(scam_prob, 2))
        if len(suspicious_phrases) == 0:
            intents.append("General Conversation")

        return ConversationAnalysisResult(
            scam_probability=scam_prob,
            detected_intents=intents,
            suspicious_phrases=suspicious_phrases,
            urgency_detected=urgency_found,
            otp_requested=otp_found,
            financial_demands=financial_found,
            threatening_language=threat_found or impersonation_found
        )
