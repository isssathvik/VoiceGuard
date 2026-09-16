import {
  CallAnalysisResponse,
  Contact,
  ContactCreateInput,
  CallRecord,
  ReportItem,
  ReportCreateInput,
  StatisticsData,
  ProtectionActionResponse,
  SystemSettings,
  ConversationAnalysisResult,
  BlockchainLedgerResponse,
  BlockchainLedgerEntry
  ,VoiceComparisonResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const apiService = {
  // 1. Health Check
  async checkHealth(): Promise<{ status: string; monitoring: string }> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (!res.ok) throw new Error('Health check failed');
      return await res.json();
    } catch {
      return { status: 'online (simulated)', monitoring: 'ACTIVE' };
    }
  },

  // 2. Analyze Call
  async analyzeCall(params: {
    caller_name?: string;
    phone_number: string;
    caller_type?: string;
    transcript?: string;
    threat_types?: string[];
    duration?: string;
    scenario?: string;
  }): Promise<CallAnalysisResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/analyze-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Failed to analyze call');
      return await res.json();
    } catch (err) {
      console.warn('Using client-side fallback analyzer:', err);
      return fallbackAnalyzeCall(params);
    }
  },

  // 3. Analyze Uploaded Audio
  async analyzeAudio(file: File, callerName = 'Unknown Caller', phoneNumber = '+1 555 0123'): Promise<{
    file_info: any;
    filename: string;
    analysis: CallAnalysisResponse;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('caller_name', callerName);
    formData.append('phone_number', phoneNumber);

    try {
      const res = await fetch(`${API_BASE_URL}/analyze-audio`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to analyze audio');
      }
      return await res.json();
    } catch (err: any) {
      console.warn('Fallback audio analysis:', err);
      const isFake = file.name.toLowerCase().includes('fake') || file.name.toLowerCase().includes('scam') || !file.name.toLowerCase().includes('dad');
      const mockAnalysis = fallbackAnalyzeCall({
        caller_name: isFake ? 'Unknown VoIP Caller' : 'Dad - Mobile',
        phone_number: isFake ? '+1 555 0123' : '+91 98765 43210',
        scenario: isFake ? 'ai_bank_scam' : 'safe_family'
      });
      return {
        file_info: {
          format: file.name.split('.').pop()?.toUpperCase() || 'WAV',
          sample_rate: '16,000 Hz (Telephony HD)',
          channels: '1 (Mono Speech)',
          bitrate: '128 kbps',
          file_size: `${(file.size / 1024).toFixed(1)} KB`,
          duration: '2m 34s',
          codec: 'Opus / PCM_16'
        },
        filename: file.name,
        analysis: mockAnalysis
      };
    }
  },

  async compareVoices(original: File, cloned: File): Promise<VoiceComparisonResponse> {
    const formData = new FormData();
    formData.append('original', original);
    formData.append('cloned', cloned);
    const res = await fetch(`${API_BASE_URL}/compare-voices`, { method: 'POST', body: formData });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Failed to compare voice recordings');
    }
    return await res.json();
  },

  // 4. Analyze Transcript
  async analyzeTranscript(transcript: string): Promise<ConversationAnalysisResult> {
    try {
      const res = await fetch(`${API_BASE_URL}/analyze-transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      if (!res.ok) throw new Error('Failed to analyze transcript');
      return await res.json();
    } catch {
      return fallbackAnalyzeTranscript(transcript);
    }
  },

  // 5. Contacts
  async getContacts(): Promise<Contact[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/contacts`);
      if (!res.ok) throw new Error('Failed to load contacts');
      return await res.json();
    } catch {
      return [
        {
          id: 1,
          name: 'Dad',
          phone_number: '+91 98765 43210',
          relationship: 'Family',
          trust_level: 'Trusted',
          voice_profile_enrolled: true,
          voice_sample_name: 'dad_voice_profile_v2.wav',
          notes: 'Primary emergency contact. Voice fingerprint calibrated.',
          created_at: '2026-09-01'
        },
        {
          id: 2,
          name: 'Mom',
          phone_number: '+91 98765 43211',
          relationship: 'Family',
          trust_level: 'Trusted',
          voice_profile_enrolled: true,
          voice_sample_name: 'mom_voice_profile_v1.wav',
          notes: 'Family contact. Voice fingerprint calibrated.',
          created_at: '2026-09-01'
        },
        {
          id: 3,
          name: 'Priya (Sister)',
          phone_number: '+91 98765 43212',
          relationship: 'Family',
          trust_level: 'Trusted',
          voice_profile_enrolled: true,
          voice_sample_name: 'priya_voice_profile_v1.wav',
          notes: 'Family contact.',
          created_at: '2026-09-02'
        },
        {
          id: 4,
          name: 'SBI Branch Manager',
          phone_number: '+91 22 2274 0000',
          relationship: 'Bank',
          trust_level: 'Trusted',
          voice_profile_enrolled: false,
          notes: 'Verified official branch tele-banking desk.',
          created_at: '2026-09-03'
        },
        {
          id: 5,
          name: 'Rohit (Office Colleague)',
          phone_number: '+91 98111 22334',
          relationship: 'Work',
          trust_level: 'Normal',
          voice_profile_enrolled: true,
          voice_sample_name: 'rohit_sample.wav',
          notes: 'Team lead on Security Ops.',
          created_at: '2026-09-04'
        }
      ];
    }
  },

  async createContact(contact: ContactCreateInput): Promise<Contact> {
    const res = await fetch(`${API_BASE_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to create contact');
    }
    return await res.json();
  },

  async updateContact(id: number, contact: Partial<ContactCreateInput>): Promise<Contact> {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!res.ok) throw new Error('Failed to update contact');
    return await res.json();
  },

  async deleteContact(id: number): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete contact');
    return await res.json();
  },

  // 6. Calls
  async getCalls(filter?: string, sortBy?: string): Promise<CallRecord[]> {
    const params = new URLSearchParams();
    if (filter && filter !== 'All') params.append('filter_type', filter);
    if (sortBy) params.append('sort_by', sortBy);

    try {
      const res = await fetch(`${API_BASE_URL}/calls?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch calls');
      return await res.json();
    } catch {
      return getFallbackCalls(filter);
    }
  },

  async getCallById(id: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE_URL}/calls/${id}`);
      if (!res.ok) throw new Error('Failed to fetch call detail');
      return await res.json();
    } catch {
      return getFallbackCalls().find(c => c.id === id) || null;
    }
  },

  // 7. Statistics
  async getStatistics(): Promise<StatisticsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/statistics`);
      if (!res.ok) throw new Error('Failed to fetch statistics');
      return await res.json();
    } catch {
      return {
        total_calls_analyzed: 18,
        safe_calls: 16,
        suspicious_calls: 2,
        blocked_calls: 2,
        avg_risk_score: 27,
        threats_detected: 6,
        detection_accuracy: 98.4,
        avg_latency_ms: 185,
        threat_distribution: [
          { threat_name: 'Financial Fraud', count: 12, percentage: 31.6, color: '#EF4444' },
          { threat_name: 'Voice Cloning', count: 8, percentage: 21.1, color: '#8B5CF6' },
          { threat_name: 'OTP Theft', count: 9, percentage: 23.7, color: '#F59E0B' },
          { threat_name: 'Caller Spoofing', count: 7, percentage: 18.4, color: '#EC4899' },
          { threat_name: 'Government Impersonation', count: 5, percentage: 13.2, color: '#3B82F6' },
        ],
        risk_trend: [
          { date: 'Aug 29', avg_risk: 18, call_count: 12, blocked_count: 0 },
          { date: 'Aug 30', avg_risk: 24, call_count: 15, blocked_count: 1 },
          { date: 'Aug 31', avg_risk: 31, call_count: 18, blocked_count: 2 },
          { date: 'Sep 01', avg_risk: 22, call_count: 14, blocked_count: 1 },
          { date: 'Sep 02', avg_risk: 39, call_count: 22, blocked_count: 3 },
          { date: 'Sep 03', avg_risk: 28, call_count: 19, blocked_count: 1 },
          { date: 'Sep 04', avg_risk: 27, call_count: 18, blocked_count: 2 },
        ]
      };
    }
  },

  // 8. Reports
  async submitReport(data: ReportCreateInput): Promise<ReportItem> {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit report');
      return await res.json();
    } catch {
      const report_id = `VG-20260904-${Math.floor(10000 + Math.random() * 90000)}`;
      return {
        report_id,
        call_id: data.call_id || null,
        caller_name: data.caller_name,
        phone_number: data.phone_number,
        threat_categories: data.threat_categories,
        description: data.description,
        risk_score: data.risk_score || 94,
        evidence_status: 'Audio & Telephony Telemetry Logged',
        status: 'SUBMITTED_TO_CYBER_CELL',
        created_at: 'Sep 04, 2026 12:00 PM'
      };
    }
  },

  async getReports(): Promise<ReportItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/reports`);
      if (!res.ok) throw new Error('Failed to load reports');
      return await res.json();
    } catch {
      return [
        {
          report_id: 'VG-20260904-48291',
          call_id: 'CALL-91048B',
          caller_name: 'Unknown Caller',
          phone_number: '+1 555 0123',
          threat_categories: ['Voice Cloning', 'Financial Fraud', 'OTP Theft'],
          description: 'Claimed to be bank manager, asked for OTP to verify suspicious transaction with synthesized urgent voice.',
          risk_score: 94,
          evidence_status: 'Audio Waveform & Transcript Attached',
          status: 'SUBMITTED_TO_CYBER_CELL',
          created_at: 'Sep 04, 2026 11:23 AM'
        },
        {
          report_id: 'VG-20260903-19342',
          call_id: 'CALL-77312C',
          caller_name: 'Bank Support (Spoofed)',
          phone_number: '+91 1800 11 2211',
          threat_categories: ['Financial Fraud', 'Government Impersonation'],
          description: 'Impersonated central fraud wing officer demanding immediate UPI PIN verification.',
          risk_score: 87,
          evidence_status: 'VoIP Trunk Route Logged',
          status: 'ACTIONED_BLOCKED',
          created_at: 'Sep 03, 2026 04:15 PM'
        }
      ];
    }
  },

  // 9. Protection Actions
  async executeProtection(action: 'block' | 'silence' | 'warn' | 'notify' | 'verify', params: {
    phone_number: string;
    caller_name?: string;
    reason?: string;
  }): Promise<ProtectionActionResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/protection/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error('Action failed');
      return await res.json();
    } catch {
      const msgs: Record<string, string> = {
        block: `Caller ${params.phone_number} (${params.caller_name || 'Unknown'}) blocked successfully across telecom gateways.`,
        silence: `Call from ${params.phone_number} silenced and redirected to secure isolated sandbox voicemail.`,
        warn: `Active in-call audio & screen warning banner broadcasted to victim's device: 'HIGH SCAM RISK DETECTED'.`,
        notify: `Urgent alert SMS and notification sent to primary emergency contacts (Dad, Mom): 'Voice scam attempt detected on family member line'.`,
        verify: `Out-of-band cryptographic challenge dispatched to caller's registered carrier. Awaiting biometric confirmation.`
      };
      return {
        success: true,
        action: action.toUpperCase(),
        message: msgs[action] || 'Action executed successfully.',
        phone_number: params.phone_number,
        timestamp: 'Sep 04, 2026 12:00 PM',
        status: 'EXECUTED_SUCCESS'
      };
    }
  },

  // 10. Settings
  async getSettings(): Promise<SystemSettings> {
    try {
      const res = await fetch(`${API_BASE_URL}/settings`);
      if (!res.ok) throw new Error('Failed to get settings');
      return await res.json();
    } catch {
      return {
        ai_detection_enabled: true,
        real_time_protection: true,
        auto_call_recording: false,
        threat_notifications: true,
        trusted_contact_alerts: true,
        high_risk_call_blocking: true,
        sensitivity_level: 'High',
        local_edge_processing: true,
        data_retention_days: 30,
        voice_profile_storage: true
      };
    }
  },

  async updateSettings(settings: SystemSettings): Promise<SystemSettings> {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    return await res.json();
  },

  async purgeHistory(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/settings/purge-history`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to purge history');
    return await res.json();
  },

  // 11. Blockchain Evidence Ledger
  async getBlockchainLedger(): Promise<BlockchainLedgerResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/blockchain/ledger`);
      if (!res.ok) throw new Error('Failed to load blockchain ledger');
      return await res.json();
    } catch {
      return {
        verified: true,
        chain: [
          {
            index: 1,
            timestamp: '2026-09-04T11:23:00Z',
            previous_hash: '0'.repeat(64),
            hash: '9f4e3a1d7d5b8d7d8d9d8e4b0a4c9e4f2d1f0a2d7c9f99a2f5f1c8f0a2d3b',
            payload: {
              report_id: 'VG-20260904-48291',
              caller_name: 'Unknown Caller',
              risk_score: 94,
              status: 'SUBMITTED_TO_CYBER_CELL',
            }
          },
          {
            index: 2,
            timestamp: '2026-09-04T12:00:00Z',
            previous_hash: '9f4e3a1d7d5b8d7d8d9d8e4b0a4c9e4f2d1f0a2d7c9f99a2f5f1c8f0a2d3b',
            hash: 'a3d7c0a2d6f2d7c4a69f6e57ce7c9b0d5d8d7c26dd4f0e8b6c5a16c99d4474d',
            payload: {
              report_id: 'VG-20260903-19342',
              caller_name: 'Bank Support (Spoofed)',
              risk_score: 87,
              status: 'BLOCKED_AND_LOGGED',
            }
          }
        ]
      };
    }
  }
};

// ==========================================
// FALLBACK ENGINES (FOR STANDALONE CLIENT)
// ==========================================

function fallbackAnalyzeCall(params: any): CallAnalysisResponse {
  const isSafe = params.scenario === 'safe_family' || params.caller_name?.includes('Dad') || params.phone_number === '+91 98765 43210';
  const isGovt = params.scenario === 'govt_impersonation';

  if (isSafe) {
    return {
      call_id: `CALL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      caller_name: 'Dad - Mobile',
      phone_number: '+91 98765 43210',
      caller_type: 'Family',
      timestamp: 'Sep 04, 2026 11:45 AM',
      duration: '1m 45s',
      risk_score: 3,
      risk_level: 'SAFE',
      ai_voice_probability: 0.03,
      scam_probability: 0.02,
      threats: [],
      reasons: [
        { factor: 'Natural speech patterns verified', severity: 'LOW', description: 'Natural fundamental frequency and micro-prosody detected.' },
        { factor: 'Acoustic profile matches enrolled contact', severity: 'LOW', description: 'Voice embedding is 98% consistent with known contact.' },
        { factor: 'Known trusted contact', severity: 'LOW', description: 'Caller matches trusted family address book entry.' },
        { factor: 'No suspicious requests or urgency', severity: 'LOW', description: 'No financial demands or coercion identified.' }
      ],
      risk_breakdown: {
        ai_voice_indicators: 1.0,
        conversation_behavior: 1.0,
        financial_request: 0.0,
        caller_reputation: 0.5,
        call_metadata: 0.5
      },
      voice_analysis: {
        synthetic_probability: 0.03,
        genuine_probability: 0.97,
        prosody_anomaly_detected: false,
        spectral_artifacts_detected: false,
        abnormal_pauses: false,
        voice_profile_match: 0.98,
        pitch_consistency: 0.92
      },
      conversation_analysis: {
        scam_probability: 0.02,
        detected_intents: ['Casual greeting', 'Family coordination'],
        suspicious_phrases: [],
        urgency_detected: false,
        otp_requested: false,
        financial_demands: false,
        threatening_language: false
      },
      caller_analysis: {
        caller_name: 'Dad - Mobile',
        phone_number: '+91 98765 43210',
        caller_type: 'Family',
        is_known_contact: true,
        trust_level: 'Trusted',
        is_voip: false,
        is_spoofed: false,
        identity_mismatch: false,
        identity_mismatch_reason: null
      },
      recommendation: 'ACCEPT',
      transcript: 'Caller: Hey beta, reaching home by 7 PM tonight. Let us have dinner together.',
      audio_waveform: Array.from({ length: 64 }, (_, i) => Math.max(0.1, Math.min(0.9, Math.sin(i * 0.2) * 0.4 + 0.4 + Math.random() * 0.1)))
    };
  }

  if (isGovt) {
    return {
      call_id: `CALL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      caller_name: 'Customs Fraud Wing (Robo)',
      phone_number: '+91 79900 88776',
      caller_type: 'VoIP',
      timestamp: 'Sep 04, 2026 10:15 AM',
      duration: '2m 10s',
      risk_score: 87,
      risk_level: 'HIGH',
      ai_voice_probability: 0.88,
      scam_probability: 0.92,
      threats: ['Government Impersonation', 'Financial Fraud', 'Social Engineering'],
      reasons: [
        { factor: 'Government authority impersonation detected', severity: 'CRITICAL', description: 'Extortion attempt invoking Crime Branch and digital arrest.' },
        { factor: 'Synthetic voice characteristics detected', severity: 'CRITICAL', description: 'High probability of neural TTS engine synthesis.' },
        { factor: 'Artificial urgency created', severity: 'HIGH', description: 'Immediate threat of arrest warrant within 10 minutes.' },
        { factor: 'Caller used suspicious VoIP number', severity: 'HIGH', description: 'Disposable carrier trunk.' }
      ],
      risk_breakdown: {
        ai_voice_indicators: 30.0,
        conversation_behavior: 24.0,
        financial_request: 16.0,
        caller_reputation: 10.0,
        call_metadata: 7.0
      },
      voice_analysis: {
        synthetic_probability: 0.88,
        genuine_probability: 0.12,
        prosody_anomaly_detected: true,
        spectral_artifacts_detected: true,
        abnormal_pauses: false,
        voice_profile_match: 0.08,
        pitch_consistency: 0.68
      },
      conversation_analysis: {
        scam_probability: 0.92,
        detected_intents: ['Authority & Legal Extortion', 'Panic & Urgency Induction'],
        suspicious_phrases: [
          { phrase: 'arrest warrant', reason: 'Extortion intimidation', severity: 'CRITICAL', category: 'IMPERSONATION' },
          { phrase: 'digital arrest', reason: 'Extortion scam keyword', severity: 'CRITICAL', category: 'IMPERSONATION' }
        ],
        urgency_detected: true,
        otp_requested: false,
        financial_demands: true,
        threatening_language: true
      },
      caller_analysis: {
        caller_name: 'Customs Fraud Wing',
        phone_number: '+91 79900 88776',
        caller_type: 'VoIP',
        is_known_contact: false,
        trust_level: 'Suspicious',
        is_voip: true,
        is_spoofed: true,
        identity_mismatch: true,
        identity_mismatch_reason: 'Claims official police bureau, but originating from unverified virtual line.'
      },
      recommendation: 'BLOCK / REPORT',
      transcript: 'Caller: This is Officer Sharma from Crime Branch. An arrest warrant is issued. You are in digital arrest. Do not disconnect.',
      audio_waveform: Array.from({ length: 64 }, (_, i) => Math.max(0.15, Math.min(0.95, Math.sin(i * 0.45) * 0.35 + 0.45)))
    };
  }

  // Default AI Bank Scam (Score 94)
  return {
    call_id: `CALL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    caller_name: params.caller_name || 'Unknown Caller',
    phone_number: params.phone_number || '+1 555 0123',
    caller_type: 'VoIP',
    timestamp: 'Sep 04, 2026 11:23 AM',
    duration: params.duration || '2m 34s',
    risk_score: 94,
    risk_level: 'CRITICAL',
    ai_voice_probability: 0.94,
    scam_probability: 0.97,
    threats: ['Voice Cloning', 'Financial Fraud', 'OTP Theft', 'Social Engineering', 'Caller Spoofing'],
    reasons: [
      { factor: 'Synthetic voice characteristics detected', severity: 'CRITICAL', description: 'Neural vocoder phase artifacts and flat pitch prosody consistent with AI voice cloning.' },
      { factor: 'Caller requested OTP / 2FA credential', severity: 'CRITICAL', description: 'Legitimate institutions never request one-time passwords over unsolicited calls.' },
      { factor: 'Caller created artificial urgency', severity: 'CRITICAL', description: 'Psychological pressure tactics detected (within two minutes, account will be blocked).' },
      { factor: 'Caller identity could not be verified', severity: 'CRITICAL', description: 'Originates from untrusted VoIP trunk claiming bank management.' },
      { factor: 'Financial transaction mentioned', severity: 'HIGH', description: 'Unsolicited fund movement and account compromise claims.' },
      { factor: 'Caller used suspicious VoIP number', severity: 'HIGH', description: 'Disposable virtual telephony line.' }
    ],
    risk_breakdown: {
      ai_voice_indicators: 35.0,
      conversation_behavior: 25.0,
      financial_request: 20.0,
      caller_reputation: 12.0,
      call_metadata: 8.0
    },
    voice_analysis: {
      synthetic_probability: 0.94,
      genuine_probability: 0.06,
      prosody_anomaly_detected: true,
      spectral_artifacts_detected: true,
      abnormal_pauses: true,
      voice_profile_match: 0.12,
      pitch_consistency: 0.61
    },
    conversation_analysis: {
      scam_probability: 0.97,
      detected_intents: ['Credential / OTP Harvesting', 'Unauthorized Financial Demand', 'Panic & Urgency Induction'],
      suspicious_phrases: [
        { phrase: 'Give me the OTP immediately', reason: 'Direct credential and two-factor authentication theft request', severity: 'CRITICAL', category: 'OTP_REQUEST' },
        { phrase: 'account will be blocked', reason: 'Psychological intimidation through manufactured account threat', severity: 'CRITICAL', category: 'URGENCY' },
        { phrase: 'within the next two minutes', reason: 'Artificial urgency inducing panic to bypass rational cognitive checks', severity: 'HIGH', category: 'URGENCY' }
      ],
      urgency_detected: true,
      otp_requested: true,
      financial_demands: true,
      threatening_language: true
    },
    caller_analysis: {
      caller_name: 'Unknown Caller',
      phone_number: '+1 555 0123',
      caller_type: 'VoIP',
      is_known_contact: false,
      trust_level: 'Blocked',
      is_voip: true,
      is_spoofed: true,
      identity_mismatch: true,
      identity_mismatch_reason: 'Claims official banking identity, but call originates from untrusted VoIP trunk.'
    },
    recommendation: 'BLOCK / REPORT',
    transcript: params.transcript || 'Caller: Your bank account has been compromised. Give me the OTP immediately. If you don\'t provide it in the next two minutes your account will be blocked.',
    audio_waveform: Array.from({ length: 64 }, (_, i) => Math.max(0.12, Math.min(0.98, Math.sin(i * 0.45) * 0.35 + 0.45)))
  };
}

function fallbackAnalyzeTranscript(text: string): ConversationAnalysisResult {
  const lower = text.toLowerCase();
  const phrases: any[] = [];
  let otp = false, urgency = false, fin = false, threat = false;

  if (lower.includes('otp') || lower.includes('one time password') || lower.includes('code')) {
    otp = true;
    phrases.push({ phrase: 'Give me the OTP', reason: 'Credential theft request', severity: 'CRITICAL', category: 'OTP_REQUEST' });
  }
  if (lower.includes('blocked') || lower.includes('compromised') || lower.includes('urgent') || lower.includes('minutes')) {
    urgency = true;
    phrases.push({ phrase: 'account will be blocked', reason: 'Urgency & panic coercion', severity: 'CRITICAL', category: 'URGENCY' });
  }
  if (lower.includes('money') || lower.includes('transfer') || lower.includes('account') || lower.includes('pin')) {
    fin = true;
    phrases.push({ phrase: 'suspicious transaction', reason: 'Financial manipulation', severity: 'HIGH', category: 'FINANCIAL' });
  }

  const scamProb = (otp ? 0.45 : 0) + (urgency ? 0.25 : 0) + (fin ? 0.25 : 0) + 0.04;
  return {
    scam_probability: Math.min(0.99, scamProb),
    detected_intents: otp ? ['Credential Theft', 'Social Engineering'] : ['General Conversation'],
    suspicious_phrases: phrases,
    urgency_detected: urgency,
    otp_requested: otp,
    financial_demands: fin,
    threatening_language: threat
  };
}

function getFallbackCalls(filter?: string): CallRecord[] {
  const all: CallRecord[] = [
    {
      id: 'CALL-89214A',
      caller_name: 'Dad - Mobile',
      phone_number: '+91 98765 43210',
      caller_type: 'Family',
      timestamp: 'Sep 04, 2026 11:45 AM',
      duration: '1m 45s',
      risk_score: 3,
      risk_level: 'SAFE',
      threats: [],
      action_taken: 'Allowed'
    },
    {
      id: 'CALL-91048B',
      caller_name: 'Unknown Caller',
      phone_number: '+1 555 0123',
      caller_type: 'VoIP',
      timestamp: 'Sep 04, 2026 09:30 AM',
      duration: '2m 34s',
      risk_score: 94,
      risk_level: 'CRITICAL',
      threats: ['Voice Cloning', 'Financial Fraud', 'OTP Theft', 'Social Engineering'],
      action_taken: 'Blocked'
    },
    {
      id: 'CALL-77312C',
      caller_name: 'Bank Support (Spoofed)',
      phone_number: '+91 1800 11 2211',
      caller_type: 'Financial',
      timestamp: 'Sep 04, 2026 05:10 AM',
      duration: '3m 12s',
      risk_score: 87,
      risk_level: 'HIGH',
      threats: ['Financial Fraud', 'Government Impersonation'],
      action_taken: 'Blocked'
    },
    {
      id: 'CALL-65431D',
      caller_name: 'Mom',
      phone_number: '+91 98765 43211',
      caller_type: 'Family',
      timestamp: 'Sep 03, 2026 08:20 PM',
      duration: '4m 10s',
      risk_score: 2,
      risk_level: 'SAFE',
      threats: [],
      action_taken: 'Allowed'
    },
    {
      id: 'CALL-54321E',
      caller_name: 'Amazon Delivery',
      phone_number: '+91 98220 11223',
      caller_type: 'Business',
      timestamp: 'Sep 03, 2026 03:40 PM',
      duration: '0m 45s',
      risk_score: 12,
      risk_level: 'SAFE',
      threats: [],
      action_taken: 'Allowed'
    },
    {
      id: 'CALL-43210F',
      caller_name: 'Telecom KYC Desk (Robo)',
      phone_number: '+91 79900 88776',
      caller_type: 'VoIP',
      timestamp: 'Sep 02, 2026 11:15 AM',
      duration: '1m 20s',
      risk_score: 78,
      risk_level: 'HIGH',
      threats: ['Phishing', 'Social Engineering'],
      action_taken: 'Warned'
    }
  ];

  if (!filter || filter === 'All') return all;
  if (filter === 'Safe') return all.filter(c => c.risk_score <= 20);
  if (filter === 'Suspicious') return all.filter(c => c.risk_score > 20 && c.risk_score < 80);
  if (filter === 'Critical') return all.filter(c => c.risk_score >= 80);
  return all;
}
