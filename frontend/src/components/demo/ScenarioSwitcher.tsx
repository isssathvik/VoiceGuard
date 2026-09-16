import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Building,
  AlertOctagon,
  Flame,
  PhoneCall,
  UserCheck,
  ChevronRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { CallAnalysisResponse } from '../../types';

interface ScenarioSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenarioData: CallAnalysisResponse) => void;
}

export const ScenarioSwitcher: React.FC<ScenarioSwitcherProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
}) => {
  const scenarios: Array<{
    id: string;
    title: string;
    category: string;
    caller: string;
    phone: string;
    riskScore: number;
    riskLevel: 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    icon: any;
    description: string;
    data: CallAnalysisResponse;
  }> = [
    {
      id: 'sc-1',
      title: 'Safe Family Call',
      category: 'Verified Family',
      caller: 'Dad (Mobile)',
      phone: '+91 98765 43210',
      riskScore: 3,
      riskLevel: 'SAFE',
      icon: ShieldCheck,
      description: 'Organic human prosody, enrolled biometric voice match (97.8%), cellular GSM origin, casual train arrival update.',
      data: {
        call_id: 'SCENARIO-01-DAD',
        caller_name: 'Dad (Mobile)',
        phone_number: '+91 98765 43210',
        caller_type: 'KNOWN_CONTACT',
        timestamp: new Date().toISOString(),
        duration: '00:38',
        risk_score: 3,
        risk_level: 'SAFE',
        ai_voice_probability: 2.1,
        scam_probability: 1.0,
        threats: [],
        reasons: [
          {
            factor: 'Biometric Voice Profile Match',
            severity: 'LOW',
            description: '97.8% acoustic harmonic match with Dad enrolled baseline.',
          },
          {
            factor: 'Cellular Carrier Origin',
            severity: 'LOW',
            description: 'Airtel GSM cellular tower routing with zero VoIP proxies.',
          },
        ],
        risk_breakdown: {
          ai_voice_indicators: 2,
          conversation_behavior: 1,
          financial_request: 0,
          caller_reputation: 0,
          call_metadata: 0,
        },
        voice_analysis: {
          synthetic_probability: 2.1,
          genuine_probability: 97.9,
          prosody_anomaly_detected: false,
          spectral_artifacts_detected: false,
          abnormal_pauses: false,
          voice_profile_match: 97.8,
          pitch_consistency: 94.5,
        },
        conversation_analysis: {
          scam_probability: 1.0,
          detected_intents: ['CASUAL_UPDATE'],
          suspicious_phrases: [],
          urgency_detected: false,
          otp_requested: false,
          financial_demands: false,
          threatening_language: false,
        },
        caller_analysis: {
          caller_name: 'Dad (Mobile)',
          phone_number: '+91 98765 43210',
          caller_type: 'KNOWN_CONTACT',
          is_known_contact: true,
          trust_level: 'VERIFIED',
          is_voip: false,
          is_spoofed: false,
          identity_mismatch: false,
          identity_mismatch_reason: null,
        },
        recommendation: 'ACCEPT',
        transcript:
          "Hey beta, I just boarded the train from Delhi. The train is on time and should reach Bangalore by tomorrow evening. Make sure to lock the doors properly at night. See you soon!",
      },
    },
    {
      id: 'sc-2',
      title: 'Digital Arrest / Police Extortion',
      category: 'Deepfake Impersonation',
      caller: 'Inspector Vijay Rathore (Fake)',
      phone: '+1 (800) 555-0199',
      riskScore: 96,
      riskLevel: 'CRITICAL',
      icon: AlertOctagon,
      description: 'ElevenLabs clone signature, fictitious "Digital Arrest" warrant, 50,000 INR extortion demand, international VoIP proxy.',
      data: {
        call_id: 'SCENARIO-02-POLICE',
        caller_name: 'Inspector Vijay Rathore (Fake)',
        phone_number: '+1 (800) 555-0199',
        caller_type: 'UNKNOWN_VOIP',
        timestamp: new Date().toISOString(),
        duration: '01:14',
        risk_score: 96,
        risk_level: 'CRITICAL',
        ai_voice_probability: 95.8,
        scam_probability: 98.2,
        threats: [
          'AI-Cloned Deepfake Voice (Spectral phase discontinuity)',
          'Fictitious Digital Arrest Extortion',
          'Immediate 50,000 INR Transfer Demand',
          'Spoofed US VoIP Gateway',
        ],
        reasons: [
          {
            factor: 'Unnatural Speech Prosody & Synthesis Jitter',
            severity: 'CRITICAL',
            description: 'Flat pitch jitter and phase discontinuities detected matching deep neural voice synthesizers.',
          },
          {
            factor: 'Extortion Script Pattern Flagged',
            severity: 'CRITICAL',
            description: 'Claimed immediate arrest warrant and commanded victim not to disconnect the call.',
          },
        ],
        risk_breakdown: {
          ai_voice_indicators: 35,
          conversation_behavior: 25,
          financial_request: 20,
          caller_reputation: 11,
          call_metadata: 5,
        },
        voice_analysis: {
          synthetic_probability: 95.8,
          genuine_probability: 4.2,
          prosody_anomaly_detected: true,
          spectral_artifacts_detected: true,
          abnormal_pauses: true,
          voice_profile_match: 8.5,
          pitch_consistency: 99.1,
        },
        conversation_analysis: {
          scam_probability: 98.2,
          detected_intents: ['GOVERNMENT_IMPERSONATION', 'FINANCIAL_EXTORTION', 'URGENCY_COERCION'],
          suspicious_phrases: [
            {
              phrase: 'digital arrest under cyber cell order',
              reason: 'Fictitious authority coercion',
              severity: 'CRITICAL',
              category: 'Impersonation',
            },
            {
              phrase: 'send 50,000 INR immediately to avoid jail',
              reason: 'Direct financial extortion demand',
              severity: 'CRITICAL',
              category: 'Extortion',
            },
          ],
          urgency_detected: true,
          otp_requested: true,
          financial_demands: true,
          threatening_language: true,
        },
        caller_analysis: {
          caller_name: 'Inspector Vijay Rathore (Fake)',
          phone_number: '+1 (800) 555-0199',
          caller_type: 'UNKNOWN_VOIP',
          is_known_contact: false,
          trust_level: 'UNTRUSTED',
          is_voip: true,
          is_spoofed: true,
          identity_mismatch: true,
          identity_mismatch_reason: 'Caller claimed Delhi Police but originated from US VoIP Gateway',
        },
        recommendation: 'BLOCK / REPORT',
        transcript:
          "This is Inspector Vijay Rathore from Central Cyber Police Headquarters. You are placed under immediate digital arrest under cyber cell order for money laundering. Do not disconnect or your bank account will be seized. Send 50,000 INR immediately to our verification escrow account to clear your name!",
      },
    },
    {
      id: 'sc-3',
      title: 'Urgent Bank Account Freeze & OTP Theft',
      category: 'Banking Social Engineering',
      caller: 'SBI Security Dept (Spoofed)',
      phone: '+91 22 2282 0000',
      riskScore: 89,
      riskLevel: 'HIGH',
      icon: Flame,
      description: 'Spoofed SBI branch number, urgent account blockage threat, coercive 6-digit OTP extraction attempt.',
      data: {
        call_id: 'SCENARIO-03-BANK',
        caller_name: 'SBI Security Dept (Spoofed)',
        phone_number: '+91 22 2282 0000',
        caller_type: 'SPOOFED_BANK_NUMBER',
        timestamp: new Date().toISOString(),
        duration: '00:52',
        risk_score: 89,
        risk_level: 'HIGH',
        ai_voice_probability: 78.4,
        scam_probability: 94.0,
        threats: [
          'High-Risk Banking Credential & OTP Harvesting',
          'Urgent Account Freeze Coercion',
          'PBX Number Spoofing',
        ],
        reasons: [
          {
            factor: 'OTP Extraction Attempt',
            severity: 'CRITICAL',
            description: 'Detected explicit demand for 6-digit one-time password.',
          },
          {
            factor: 'Caller ID Spoofing',
            severity: 'HIGH',
            description: 'Caller ID displays legitimate SBI number but originating packet lacks valid carrier STIR/SHAKEN certificate.',
          },
        ],
        risk_breakdown: {
          ai_voice_indicators: 28,
          conversation_behavior: 25,
          financial_request: 20,
          caller_reputation: 10,
          call_metadata: 6,
        },
        voice_analysis: {
          synthetic_probability: 78.4,
          genuine_probability: 21.6,
          prosody_anomaly_detected: true,
          spectral_artifacts_detected: false,
          abnormal_pauses: true,
          voice_profile_match: null,
          pitch_consistency: 91.0,
        },
        conversation_analysis: {
          scam_probability: 94.0,
          detected_intents: ['OTP_HARVESTING', 'ACCOUNT_FREEZE_SCARE'],
          suspicious_phrases: [
            {
              phrase: 'read out the 6-digit OTP code',
              reason: 'Direct credential harvesting',
              severity: 'CRITICAL',
              category: 'Credential Theft',
            },
          ],
          urgency_detected: true,
          otp_requested: true,
          financial_demands: true,
          threatening_language: false,
        },
        caller_analysis: {
          caller_name: 'SBI Security Dept (Spoofed)',
          phone_number: '+91 22 2282 0000',
          caller_type: 'SPOOFED_BANK',
          is_known_contact: false,
          trust_level: 'UNTRUSTED',
          is_voip: true,
          is_spoofed: true,
          identity_mismatch: true,
          identity_mismatch_reason: 'Virtual PBX spoof of SBI Mumbai Central landline',
        },
        recommendation: 'BLOCK',
        transcript:
          "Dear customer, your State Bank of India debit card has been blocked due to suspicious transactions. To unfreeze your account instantly, please read out the 6-digit OTP code sent to your registered mobile number right now.",
      },
    },
    {
      id: 'sc-4',
      title: 'AI Cloned Kidnapping / Ransom Scam',
      category: 'Distress AI Cloning',
      caller: 'Sister Priya (Cloned Audio)',
      phone: '+91 91234 56789',
      riskScore: 98,
      riskLevel: 'CRITICAL',
      icon: ShieldAlert,
      description: 'Cloned sister distress cry, sudden male kidnapper taking over phone, ₹2,00,000 ransom demand via crypto/UPI.',
      data: {
        call_id: 'SCENARIO-04-KIDNAP',
        caller_name: 'Priya (Cloned Distress)',
        phone_number: '+91 91234 56789',
        caller_type: 'CLONED_CONTACT_AUDIO',
        timestamp: new Date().toISOString(),
        duration: '00:45',
        risk_score: 98,
        risk_level: 'CRITICAL',
        ai_voice_probability: 98.4,
        scam_probability: 99.1,
        threats: [
          'High-Fidelity Neural Voice Clone (Social media audio source)',
          'Virtual Kidnapping & Extortion Scheme',
          'Violent Threat & Immediate Ransom Transfer',
        ],
        reasons: [
          {
            factor: 'Biometric Voice Inconsistency & Artifacts',
            severity: 'CRITICAL',
            description: 'Voice clone matches superficial timbre of Priya but lacks genuine sub-harmonic micro-jitter and respiratory pauses.',
          },
          {
            factor: 'High-Velocity Ransom Extortion',
            severity: 'CRITICAL',
            description: 'Extreme coercion demanding 2,00,000 INR within 10 minutes.',
          },
        ],
        risk_breakdown: {
          ai_voice_indicators: 35,
          conversation_behavior: 25,
          financial_request: 20,
          caller_reputation: 11,
          call_metadata: 7,
        },
        voice_analysis: {
          synthetic_probability: 98.4,
          genuine_probability: 1.6,
          prosody_anomaly_detected: true,
          spectral_artifacts_detected: true,
          abnormal_pauses: true,
          voice_profile_match: 61.2,
          pitch_consistency: 99.4,
        },
        conversation_analysis: {
          scam_probability: 99.1,
          detected_intents: ['VIRTUAL_KIDNAPPING', 'VIOLENCE_THREAT', 'RANSOM_DEMAND'],
          suspicious_phrases: [
            {
              phrase: 'Bhaiya please save me they have locked me in a room',
              reason: 'Cloned distress trigger phrase',
              severity: 'CRITICAL',
              category: 'Emotional Coercion',
            },
            {
              phrase: 'Transfer 2 Lakhs right now or you will never see her again',
              reason: 'Direct violent ransom extortion',
              severity: 'CRITICAL',
              category: 'Ransom Extortion',
            },
          ],
          urgency_detected: true,
          otp_requested: false,
          financial_demands: true,
          threatening_language: true,
        },
        caller_analysis: {
          caller_name: 'Priya (Cloned Distress)',
          phone_number: '+91 91234 56789',
          caller_type: 'CLONED_AUDIO_INJECTION',
          is_known_contact: true,
          trust_level: 'FLAGGED_CLONE_ATTACK',
          is_voip: true,
          is_spoofed: true,
          identity_mismatch: true,
          identity_mismatch_reason: 'Voice biometric signature failed fundamental harmonic integrity check',
        },
        recommendation: 'BLOCK / REPORT',
        transcript:
          "Bhaiya please save me they have locked me in a room! [Male voice interrupts] Listen carefully, we have your sister in custody. Transfer 2 Lakhs right now to our UPI ID or you will never see her again! Do not call police!",
      },
    },
    {
      id: 'sc-5',
      title: 'Electricity Bill Urgency Disconnection',
      category: 'Utility Scam',
      caller: 'State Electricity Board (Fake)',
      phone: '+91 97110 09988',
      riskScore: 82,
      riskLevel: 'HIGH',
      icon: Zap,
      description: 'Automated robocall claiming electricity will be disconnected tonight unless an APK or ₹15 payment is submitted.',
      data: {
        call_id: 'SCENARIO-05-POWER',
        caller_name: 'State Electricity Board (Fake)',
        phone_number: '+91 97110 09988',
        caller_type: 'UNKNOWN_ROBOCALL',
        timestamp: new Date().toISOString(),
        duration: '00:30',
        risk_score: 82,
        risk_level: 'HIGH',
        ai_voice_probability: 88.0,
        scam_probability: 89.5,
        threats: ['Malicious APK / Remote Access Trojan Bait', 'Utility Disconnection Scare'],
        reasons: [
          {
            factor: 'Robocall Voice Synthesis',
            severity: 'HIGH',
            description: 'TTS synthesis engine with repetitive modulation detected.',
          },
          {
            factor: 'Urgent Night Disconnection Scare',
            severity: 'HIGH',
            description: 'Utility disconnection threat at 9:30 PM requiring immediate phone call to fraud number.',
          },
        ],
        risk_breakdown: {
          ai_voice_indicators: 30,
          conversation_behavior: 22,
          financial_request: 18,
          caller_reputation: 8,
          call_metadata: 4,
        },
        voice_analysis: {
          synthetic_probability: 88.0,
          genuine_probability: 12.0,
          prosody_anomaly_detected: true,
          spectral_artifacts_detected: true,
          abnormal_pauses: false,
          voice_profile_match: null,
          pitch_consistency: 96.0,
        },
        conversation_analysis: {
          scam_probability: 89.5,
          detected_intents: ['UTILITY_SCARE', 'MALWARE_BAIT'],
          suspicious_phrases: [
            {
              phrase: 'electricity power will be disconnected at 9:30 PM tonight',
              reason: 'Utility coercion tactic',
              severity: 'HIGH',
              category: 'Urgency',
            },
          ],
          urgency_detected: true,
          otp_requested: false,
          financial_demands: true,
          threatening_language: false,
        },
        caller_analysis: {
          caller_name: 'State Electricity Board (Fake)',
          phone_number: '+91 97110 09988',
          caller_type: 'UNKNOWN_ROBOCALL',
          is_known_contact: false,
          trust_level: 'UNTRUSTED',
          is_voip: false,
          is_spoofed: false,
          identity_mismatch: false,
          identity_mismatch_reason: null,
        },
        recommendation: 'WARN',
        transcript:
          "Dear consumer, your electricity power will be disconnected at 9:30 PM tonight from electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 9711009988.",
      },
    },
    {
      id: 'sc-6',
      title: 'Legitimate SBI Branch Query',
      category: 'Verified Banking',
      caller: 'SBI Branch Manager (R. Sharma)',
      phone: '+91 80 2558 4001',
      riskScore: 12,
      riskLevel: 'SAFE',
      icon: Building,
      description: 'Legitimate branch officer confirming home branch visit appointment. Zero OTP or credential requests.',
      data: {
        call_id: 'SCENARIO-06-SBI-SAFE',
        caller_name: 'SBI Branch Manager (R. Sharma)',
        phone_number: '+91 80 2558 4001',
        caller_type: 'VERIFIED_BUSINESS',
        timestamp: new Date().toISOString(),
        duration: '00:40',
        risk_score: 12,
        risk_level: 'SAFE',
        ai_voice_probability: 4.5,
        scam_probability: 2.0,
        threats: [],
        reasons: [
          {
            factor: 'Natural Human Speech Dynamics',
            severity: 'LOW',
            description: 'Organic pitch variability, natural respiration, and conversational pauses verified.',
          },
          {
            factor: 'Zero Sensitive Credentials Requested',
            severity: 'LOW',
            description: 'Caller advised visiting the physical branch and explicitly cautioned never to share passwords over phone.',
          },
        ],
        risk_breakdown: {
          ai_voice_indicators: 3,
          conversation_behavior: 2,
          financial_request: 0,
          caller_reputation: 4,
          call_metadata: 3,
        },
        voice_analysis: {
          synthetic_probability: 4.5,
          genuine_probability: 95.5,
          prosody_anomaly_detected: false,
          spectral_artifacts_detected: false,
          abnormal_pauses: false,
          voice_profile_match: null,
          pitch_consistency: 92.3,
        },
        conversation_analysis: {
          scam_probability: 2.0,
          detected_intents: ['BRANCH_APPOINTMENT', 'SECURITY_ADVISORY'],
          suspicious_phrases: [],
          urgency_detected: false,
          otp_requested: false,
          financial_demands: false,
          threatening_language: false,
        },
        caller_analysis: {
          caller_name: 'SBI Branch Manager (R. Sharma)',
          phone_number: '+91 80 2558 4001',
          caller_type: 'VERIFIED_LANDLINE',
          is_known_contact: true,
          trust_level: 'VERIFIED',
          is_voip: false,
          is_spoofed: false,
          identity_mismatch: false,
          identity_mismatch_reason: null,
        },
        recommendation: 'ACCEPT',
        transcript:
          "Hello Mr. Sathvik, this is Ramesh Sharma from SBI Koramangala branch regarding your locker renewal request. Please drop by our branch on Tuesday between 10 AM and 2 PM with your original ID proof. Remember, SBI never asks for your OTP or password over the phone.",
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-cyan-400 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              Evaluation Scenario Library
            </h3>
            <p className="text-xs text-indigo-300 font-medium">
              Select any pre-configured test vector to evaluate VoiceGuard AI
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-300">
          Click on any scenario below to instantly run multi-signal deep analysis, view the acoustic waveform, and inspect explainable AI reasoning.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSafe = sc.riskLevel === 'SAFE';
            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc.data);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.02] flex flex-col justify-between space-y-3 ${
                  isSafe
                    ? 'bg-gradient-to-b from-emerald-950/30 to-slate-900/80 border-emerald-500/30 hover:border-emerald-400/60 shadow-lg shadow-emerald-950/30'
                    : 'bg-gradient-to-b from-rose-950/30 to-slate-900/80 border-rose-500/30 hover:border-rose-400/60 shadow-lg shadow-rose-950/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {sc.category}
                    </span>
                    <Badge level={sc.riskLevel} size="sm" />
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSafe ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {sc.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">{sc.caller} · {sc.phone}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed line-clamp-2">
                    {sc.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="font-mono">
                    <span className="text-slate-400">Score: </span>
                    <strong className={isSafe ? 'text-emerald-400' : 'text-rose-400'}>
                      {sc.riskScore}/100
                    </strong>
                  </div>

                  <span className="flex items-center gap-1 font-mono text-[11px] text-cyan-400 group-hover:translate-x-1 transition-transform">
                    Simulate Scenario <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
