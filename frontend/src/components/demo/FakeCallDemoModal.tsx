import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  PhoneOff,
  VolumeX,
  UserPlus,
  FileWarning,
  AlertOctagon,
  ArrowRight,
  Radio,
  Cpu,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer';
import { CallAnalysisResponse } from '../../types';

interface FakeCallDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewForensics: (data: CallAnalysisResponse) => void;
  onOpenReportWithData: (data: CallAnalysisResponse) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const FakeCallDemoModal: React.FC<FakeCallDemoModalProps> = ({
  isOpen,
  onClose,
  onViewForensics,
  onOpenReportWithData,
  onShowToast,
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [isAutoSimulating, setIsAutoSimulating] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const mockFakeData: CallAnalysisResponse = {
    call_id: 'FAKE-CALL-994',
    caller_name: 'Inspector Vijay Rathore (Fake)',
    phone_number: '+1 (800) 555-0199',
    caller_type: 'SUSPECTED_SCAMMER_VOIP',
    timestamp: new Date().toISOString(),
    duration: '01:14',
    risk_score: 94,
    risk_level: 'CRITICAL',
    ai_voice_probability: 94.2,
    scam_probability: 96.5,
    threats: [
      'AI-Cloned Deepfake Voice (ElevenLabs/VALL-E clone artifact signature)',
      'Digital Arrest / Police Extortion Coercion',
      'Urgent UPI / Bank Transfer Demand (50,000 INR)',
      'High-Risk International VoIP Gateway Routing',
    ],
    reasons: [
      {
        factor: 'Synthetic Acoustic Artifacts Detected',
        severity: 'CRITICAL',
        description:
          'Spectral phase discontinuities, abnormally flat pitch jitter (0.012 vs human 0.08+), and robotic cadence match modern neural voice synthesizers.',
      },
      {
        factor: 'Digital Arrest Threat Pattern Detected',
        severity: 'CRITICAL',
        description:
          'Extortion script detected: Claiming immediate arrest warrant, forbidding hanging up, and demanding immediate financial transfer to unfreeze account.',
      },
      {
        factor: 'Spoofed Caller ID & VoIP Origin',
        severity: 'HIGH',
        description:
          'Caller ID claims Central Police Station but originates from an untrusted overseas SIP VoIP trunk (Twilio proxy).',
      },
      {
        factor: 'High Emotional Pressure & OTP Demand',
        severity: 'HIGH',
        description:
          'Semantic NLP model detected extreme urgency coercion ("arrest within 20 minutes") designed to induce cognitive overload.',
      },
    ],
    risk_breakdown: {
      ai_voice_indicators: 35,
      conversation_behavior: 25,
      financial_request: 20,
      caller_reputation: 10,
      call_metadata: 4,
    },
    voice_analysis: {
      synthetic_probability: 94.2,
      genuine_probability: 5.8,
      prosody_anomaly_detected: true,
      spectral_artifacts_detected: true,
      abnormal_pauses: true,
      voice_profile_match: 14.2,
      pitch_consistency: 98.9,
    },
    conversation_analysis: {
      scam_probability: 96.5,
      detected_intents: ['GOVERNMENT_IMPERSONATION', 'FINANCIAL_EXTORTION', 'URGENCY_COERCION'],
      suspicious_phrases: [
        {
          phrase: 'digital arrest under cyber cell order',
          reason: 'Fictitious legal authority coercion (No Indian law permits digital arrest)',
          severity: 'CRITICAL',
          category: 'Impersonation',
        },
        {
          phrase: 'send 50,000 INR immediately to avoid jail',
          reason: 'Direct financial extortion demand with arrest threat',
          severity: 'CRITICAL',
          category: 'Extortion',
        },
        {
          phrase: 'do not disconnect or your bank account will be seized',
          reason: 'Coercive isolation tactic preventing victim from verifying with family',
          severity: 'HIGH',
          category: 'Urgency',
        },
      ],
      urgency_detected: true,
      otp_requested: true,
      financial_demands: true,
      threatening_language: true,
    },
    caller_analysis: {
      caller_name: 'Inspector Vijay Rathore (Spoofed)',
      phone_number: '+1 (800) 555-0199',
      caller_type: 'UNKNOWN_VOIP',
      is_known_contact: false,
      trust_level: 'UNTRUSTED',
      is_voip: true,
      is_spoofed: true,
      identity_mismatch: true,
      identity_mismatch_reason: 'Caller claimed to be Delhi Police Cyber Cell but originated from US VoIP Server',
    },
    recommendation: 'BLOCK / REPORT',
    transcript:
      "This is Inspector Vijay Rathore from Central Cyber Police Headquarters. You are placed under immediate digital arrest under cyber cell order for money laundering. Do not disconnect or your bank account will be seized. To clear your name, you must send 50,000 INR immediately to our verification escrow account within 20 minutes!",
  };

  // 4-Stage Auto progression
  useEffect(() => {
    if (!isOpen) {
      setCurrentStage(1);
      return;
    }

    if (isAutoSimulating) {
      const timers = [
        setTimeout(() => setCurrentStage(2), 1200),
        setTimeout(() => setCurrentStage(3), 2800),
        setTimeout(() => setCurrentStage(4), 4400),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [isOpen, isAutoSimulating]);

  const handleBlockCaller = () => {
    onShowToast('Threat Neutralized', 'Caller +1 (800) 555-0199 blocked at carrier level and severed.', 'error');
    onClose();
  };

  const handleSilenceAudio = () => {
    onShowToast('Audio Silenced', 'Incoming audio stream muted to prevent extortion coercion.', 'warning');
  };

  const handleAlertFamily = () => {
    onShowToast('Family Alert Sent', 'Emergency SMS + WhatsApp sent to Dad & Sister regarding active scam attempt.', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Fake Call Live Interception Demo <Badge level="CRITICAL" size="sm" />
            </h3>
            <p className="text-xs text-rose-400 font-medium">4-Stage AI Multi-Signal Detection</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 4-Stage Pipeline Tracker */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-indigo-500/20">
          <div className="flex items-center justify-between text-[11px] font-mono mb-2">
            <span className="text-slate-400">ANALYSIS STAGES:</span>
            <span className="text-cyan-400 font-bold">
              {currentStage === 4 ? 'STAGE 4/4 COMPLETED · CRITICAL THREAT CONFIRMED' : `STAGE ${currentStage}/4 PROCESSING...`}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Call Intercept', icon: Radio },
              { num: 2, label: 'Acoustic Scan', icon: Cpu },
              { num: 3, label: 'Semantic NLP', icon: Flame },
              { num: 4, label: 'Threat Block', icon: ShieldAlert },
            ].map((step) => {
              const isDone = currentStage >= step.num;
              const isCurrent = currentStage === step.num;
              const StepIcon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`p-2 rounded-lg border text-center transition-all duration-300 ${
                    isDone
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200 shadow-sm shadow-rose-900/30'
                      : 'bg-slate-900/50 border-slate-800 text-slate-500'
                  } ${isCurrent ? 'ring-1 ring-rose-400 scale-[1.02]' : ''}`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-0.5">
                    <StepIcon className={`w-3.5 h-3.5 ${isDone ? 'text-rose-400' : 'text-slate-600'}`} />
                    <span className="text-xs font-mono font-bold">{step.num}</span>
                  </div>
                  <div className="text-[10px] truncate">{step.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Threat Header Card */}
        <div className="p-4.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900/90 to-slate-900/90 border border-rose-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400 animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-white">Inspector Vijay Rathore (Fake)</h4>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/30 text-rose-300 border border-rose-500/50 rounded animate-pulse">
                  DIGITAL ARREST SCAM
                </span>
              </div>
              <p className="text-xs font-mono text-rose-300/80">
                +1 (800) 555-0199 · Spoofed VoIP Proxy Trunk (US Origin)
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4">
            <div className="text-[11px] font-mono text-rose-300">VOICE RISK SCORE</div>
            <div className="text-4xl font-extrabold font-mono text-rose-400 animate-pulse">
              94<span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
        </div>

        {/* Audio Waveform with Glitch Highlights */}
        <AudioWaveformVisualizer
          waveform={[0.85, 0.9, 0.4, 0.88, 0.95, 0.35, 0.92, 0.88, 0.45, 0.9, 0.94, 0.3, 0.95, 0.92, 0.4, 0.98, 0.95, 0.35, 0.92, 0.9, 0.45, 0.94, 0.96, 0.3, 0.88, 0.92, 0.4, 0.95, 0.9, 0.35, 0.92, 0.94, 0.4, 0.9, 0.95, 0.35, 0.92, 0.9, 0.45, 0.95, 0.92, 0.3]}
          duration="01:14"
          isSynthetic={true}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          accentColor="rose"
        />

        {/* Highlighted Transcript Box */}
        <div className="bg-slate-950/80 border border-rose-500/30 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <FileWarning className="w-3.5 h-3.5" /> EXTORTION INTENT & KEYWORD DETECTION
            </span>
            <span className="text-rose-300 text-[11px]">3 Critical Phrases Flagged</span>
          </div>

          <div className="text-sm text-slate-200 leading-relaxed bg-slate-900/70 p-3.5 rounded-lg border border-slate-800">
            This is Inspector Vijay Rathore from Central Cyber Police Headquarters. You are placed under immediate{' '}
            <span className="bg-rose-500/30 text-rose-200 border-b-2 border-rose-500 px-1 py-0.5 rounded font-semibold cursor-help" title="Fictitious legal authority coercion">
              digital arrest under cyber cell order
            </span>{' '}
            for money laundering.{' '}
            <span className="bg-amber-500/30 text-amber-200 border-b-2 border-amber-500 px-1 py-0.5 rounded font-semibold cursor-help" title="Coercive isolation tactic">
              Do not disconnect or your bank account will be seized
            </span>
            . To clear your name, you must{' '}
            <span className="bg-rose-500/30 text-rose-200 border-b-2 border-rose-500 px-1 py-0.5 rounded font-semibold cursor-help" title="Direct financial extortion demand">
              send 50,000 INR immediately
            </span>{' '}
            to our verification escrow account within 20 minutes!
          </div>
        </div>

        {/* Multi-Signal Breakdown (4 items) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/20">
            <div className="text-[10px] font-mono text-slate-400">AI VOICE CLONE</div>
            <div className="text-sm font-bold text-rose-400 font-mono">94.2% SYNTHETIC</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Phase discontinuity & unnatural robotic pitch flatline.</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/20">
            <div className="text-[10px] font-mono text-slate-400">CALLER ORIGIN</div>
            <div className="text-sm font-bold text-rose-400 font-mono">SPOOFED VOIP</div>
            <p className="text-[10px] text-slate-400 mt-0.5">SIP Gateway proxy from international IP trunk.</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/20">
            <div className="text-[10px] font-mono text-slate-400">THREAT VECTOR</div>
            <div className="text-sm font-bold text-rose-400 font-mono">DIGITAL ARREST</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Fictitious authority arrest & intimidation.</p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/20">
            <div className="text-[10px] font-mono text-slate-400">FINANCIAL DEMAND</div>
            <div className="text-sm font-bold text-rose-400 font-mono">50,000 INR</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Immediate coercion with 20min timeout.</p>
          </div>
        </div>

        {/* Emergency Protection Actions */}
        <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-rose-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" /> RECOMMENDED DEFENSIVE ACTIONS
            </span>
            <span className="text-[11px] font-mono text-rose-400 font-semibold">ACTION REQUIRED</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant="danger"
              size="sm"
              onClick={handleBlockCaller}
              leftIcon={<PhoneOff className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Block & Sever Line
            </Button>

            <Button
              variant="warning"
              size="sm"
              onClick={handleSilenceAudio}
              leftIcon={<VolumeX className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Silence Audio
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleAlertFamily}
              leftIcon={<UserPlus className="w-3.5 h-3.5 text-indigo-400" />}
              className="text-xs"
            >
              Alert Family
            </Button>

            <Button
              variant="cyber"
              size="sm"
              onClick={() => {
                onClose();
                onOpenReportWithData(mockFakeData);
              }}
              leftIcon={<FileWarning className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Generate Dossier
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onClose();
              onViewForensics(mockFakeData);
            }}
            leftIcon={<ChevronRight className="w-4 h-4" />}
          >
            Inspect Full Multi-Signal Forensics
          </Button>

          <Button variant="secondary" size="sm" onClick={onClose}>
            Dismiss Demo
          </Button>
        </div>
      </div>
    </Modal>
  );
};
