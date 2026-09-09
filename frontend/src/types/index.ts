export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SuspiciousPhrase {
  phrase: string;
  reason: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
}

export interface RiskBreakdown {
  ai_voice_indicators: number;
  conversation_behavior: number;
  financial_request: number;
  caller_reputation: number;
  call_metadata: number;
}

export interface RiskFactor {
  factor: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
}

export interface VoiceAnalysisResult {
  synthetic_probability: number;
  genuine_probability: number;
  prosody_anomaly_detected: boolean;
  spectral_artifacts_detected: boolean;
  abnormal_pauses: boolean;
  voice_profile_match: number | null;
  pitch_consistency: number;
}

export interface ConversationAnalysisResult {
  scam_probability: number;
  detected_intents: string[];
  suspicious_phrases: SuspiciousPhrase[];
  urgency_detected: boolean;
  otp_requested: boolean;
  financial_demands: boolean;
  threatening_language: boolean;
}

export interface CallerAnalysisResult {
  caller_name: string;
  phone_number: string;
  caller_type: string;
  is_known_contact: boolean;
  trust_level: string;
  is_voip: boolean;
  is_spoofed: boolean;
  identity_mismatch: boolean;
  identity_mismatch_reason: string | null;
}

export interface CallAnalysisResponse {
  call_id: string;
  caller_name: string;
  phone_number: string;
  caller_type: string;
  timestamp: string;
  duration: string;
  risk_score: number;
  risk_level: RiskLevel;
  ai_voice_probability: number;
  scam_probability: number;
  threats: string[];
  reasons: RiskFactor[];
  risk_breakdown: RiskBreakdown;
  voice_analysis: VoiceAnalysisResult;
  conversation_analysis: ConversationAnalysisResult;
  caller_analysis: CallerAnalysisResult;
  recommendation: 'ACCEPT' | 'VERIFY' | 'WARN' | 'BLOCK' | 'BLOCK / REPORT' | string;
  transcript?: string | null;
  audio_waveform?: number[] | null;
}

export interface Contact {
  id: number;
  name: string;
  phone_number: string;
  relationship: string;
  trust_level?: string;
  voice_profile_enrolled?: boolean;
  voice_enrolled?: boolean;
  voice_threshold?: number;
  emergency_alert?: boolean;
  voice_sample_name?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface ContactCreateInput {
  name: string;
  phone_number: string;
  relationship: string;
  trust_level?: string;
  voice_profile_enrolled?: boolean;
  voice_enrolled?: boolean;
  voice_threshold?: number;
  emergency_alert?: boolean;
  notes?: string;
}

export interface CallRecord {
  id: string;
  call_id?: string;
  caller_name: string;
  phone_number: string;
  caller_type: string;
  timestamp: string;
  duration: string;
  risk_score: number;
  risk_level: RiskLevel;
  threats: string[];
  action_taken: string;
  synthetic_prob?: number;
  scam_prob?: number;
  is_voip?: boolean;
  recommendation?: string;
  transcript?: string;
  analysis_details?: any;
}

export interface IncidentReport {
  id?: number;
  report_id: string;
  call_id?: string | null;
  caller_number: string;
  caller_name?: string;
  threat_type: string;
  amount_demanded?: number;
  demanded_upi_or_account?: string;
  description: string;
  transcript?: string;
  risk_score?: number;
  status: 'SUBMITTED' | 'UNDER_INVESTIGATION' | 'RESOLVED' | 'CLOSED' | string;
  created_at?: string;
}

export interface ReportItem {
  report_id: string;
  call_id?: string | null;
  caller_name: string;
  phone_number: string;
  threat_categories: string[];
  description: string;
  risk_score: number;
  evidence_status: string;
  status: string;
  created_at: string;
}

export interface ReportCreateInput {
  call_id?: string;
  caller_name: string;
  phone_number: string;
  threat_categories: string[];
  description: string;
  risk_score?: number;
  audio_evidence_attached?: boolean;
}

export interface ThreatIntel {
  id: number;
  threat_name: string;
  category: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affected_regions: string[];
  reported_cases: number;
  description: string;
  acoustic_signatures: string[];
  defense_guidelines: string[];
  last_updated: string;
}

export interface SystemStats {
  total_calls_analyzed: number;
  scam_calls_detected: number;
  safe_calls: number;
  scams_prevented: number;
  money_saved_inr: number;
  avg_detection_latency_ms: number;
  protection_status: string;
  last_threat_detected: string;
}

export interface ThreatDistributionItem {
  threat_name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface RiskTrendItem {
  date: string;
  avg_risk: number;
  call_count: number;
  blocked_count: number;
}

export interface StatisticsData {
  total_calls_analyzed: number;
  safe_calls: number;
  suspicious_calls: number;
  blocked_calls: number;
  avg_risk_score: number;
  threats_detected: number;
  detection_accuracy: number;
  avg_latency_ms: number;
  threat_distribution: ThreatDistributionItem[];
  risk_trend: RiskTrendItem[];
}

export interface ProtectionActionResponse {
  success: boolean;
  action: string;
  message: string;
  phone_number: string;
  timestamp: string;
  status: string;
}

export interface SystemSettings {
  ai_detection_enabled: boolean;
  real_time_protection: boolean;
  auto_call_recording: boolean;
  threat_notifications: boolean;
  trusted_contact_alerts: boolean;
  high_risk_call_blocking: boolean;
  sensitivity_level: string;
  local_edge_processing: boolean;
  data_retention_days: number;
  voice_profile_storage: boolean;
}
