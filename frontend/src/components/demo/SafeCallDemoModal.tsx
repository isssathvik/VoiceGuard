import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  Lock,
  Radio,
  FileText,
  Volume2,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';
import { CallAnalysisResponse } from '../../types';

interface SafeCallDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewForensics: (data: CallAnalysisResponse) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const SafeCallDemoModal: React.FC<SafeCallDemoModalProps> = ({
  isOpen,
  onClose,
  onViewForensics,
  onShowToast,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const mockSafeData: CallAnalysisResponse = {
    call_id: 'SAFE-CALL-001',
    caller_name: 'Dad (Mobile)',
    phone_number: '+91 98765 43210',
    caller_type: 'KNOWN_FAMILY_CONTACT',
    timestamp: new Date().toISOString(),
    duration: '00:38',
    risk_score: 3,
    risk_level: 'SAFE',
    ai_voice_probability: 2.1,
    scam_probability: 1.0,
    threats: [],
    reasons: [
      {
        factor: 'Biometric Voice Match Confirmed',
        severity: 'LOW',
        description: '97.8% acoustic alignment with Dad enrolled voice profile. Pitch jitter and natural formant contours verified.',
      },
      {
        factor: 'Verified GSM Network Origin',
        severity: 'LOW',
        description: 'Call originated via trusted cellular carrier (Airtel GSM). Zero VoIP or PBX trunk routing detected.',
      },
      {
        factor: 'Zero Scam Patterns Detected',
        severity: 'LOW',
        description: 'Casual routine conversation regarding train arrival and dinner. No urgency or OTP requests.',
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
      detected_intents: ['CASUAL_UPDATE', 'FAMILY_LOGISTICS'],
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
  };

  const handleAllowCall = () => {
    onShowToast('Call Stream Verified', 'Dad (+91 98765 43210) allowed without restriction.', 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Safe Call Evaluation Demo</h3>
            <p className="text-xs text-emerald-400 font-medium">Verified Genuine Family Contact</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Caller Header Card */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/80 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">Dad (Mobile)</h4>
                <Badge level="SAFE" size="sm" />
              </div>
              <p className="text-xs font-mono text-slate-400">+91 98765 43210 · Airtel GSM Primary SIM</p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            <div className="text-[11px] font-mono text-slate-400">VOICE RISK SCORE</div>
            <div className="text-3xl font-extrabold font-mono text-emerald-400">
              03<span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
        </div>

        {/* Audio Waveform & Speech Stream */}
        <AudioWaveformVisualizer
          waveform={[0.15, 0.45, 0.65, 0.35, 0.75, 0.85, 0.55, 0.25, 0.45, 0.65, 0.8, 0.4, 0.2, 0.6, 0.75, 0.35, 0.45, 0.7, 0.55, 0.3, 0.5, 0.8, 0.6, 0.35, 0.25, 0.5, 0.65, 0.45, 0.3, 0.6, 0.75, 0.45, 0.2, 0.5, 0.65, 0.8, 0.4, 0.3, 0.55, 0.7, 0.45, 0.2]}
          duration="00:38"
          isSynthetic={false}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          accentColor="emerald"
        />

        {/* Live Transcript Box */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              <FileText className="w-3.5 h-3.5 text-emerald-400" /> SPEECH TRANSCRIPT SCAN
            </span>
            <span className="text-emerald-400 font-bold">0 Suspicious Keywords</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-900/50 p-3 rounded-lg border border-slate-800/80">
            "{mockSafeData.transcript}"
          </p>
        </div>

        {/* 3 Explainability Signal Breakdown Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1">
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>VOICE MATCH</span>
              <span className="text-emerald-400 font-bold">97.8%</span>
            </div>
            <div className="text-xs text-slate-200 font-semibold">Enrolled Biometric Match</div>
            <p className="text-[11px] text-slate-400">Natural pitch jitter & harmonic resonance verified.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1">
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>CARRIER ROUTING</span>
              <span className="text-emerald-400 font-bold">LEGIT GSM</span>
            </div>
            <div className="text-xs text-slate-200 font-semibold">Cellular Tower Path</div>
            <p className="text-[11px] text-slate-400">Zero proxy PBX or VoIP spoofing detected.</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/70 border border-emerald-500/20 space-y-1">
            <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>SEMANTIC INTENT</span>
              <span className="text-emerald-400 font-bold">CLEAN</span>
            </div>
            <div className="text-xs text-slate-200 font-semibold">Routine Family Logistics</div>
            <p className="text-[11px] text-slate-400">No emergency pressure, OTP demands or money transfers.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onViewForensics(mockSafeData);
            }}
            leftIcon={<ChevronRight className="w-4 h-4" />}
          >
            Inspect Full Multi-Signal Forensics
          </Button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1 sm:flex-initial"
            >
              Close
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handleAllowCall}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              className="flex-1 sm:flex-initial"
            >
              Allow Call Stream
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
