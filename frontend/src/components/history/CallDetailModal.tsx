import React from 'react';
import {
  PhoneCall,
  UserCheck,
  ShieldAlert,
  Clock,
  Radio,
  FileWarning,
  Volume2,
  FileText,
  Server,
  Download,
  Lock
} from 'lucide-react';
import { CallRecord, CallAnalysisResponse } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { RiskScoreGauge } from '../analysis/RiskScoreGauge';
import { AudioWaveformVisualizer } from '../demo/AudioWaveformVisualizer';
import { ExplainabilityPanel } from '../analysis/ExplainabilityPanel';
import { TranscriptHighlighter } from '../analysis/TranscriptHighlighter';

interface CallDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  call: CallRecord | null;
  onOpenReportWithCall?: (call: CallRecord) => void;
  onAnalyzeFullCall?: (call: CallRecord) => void;
}

export const CallDetailModal: React.FC<CallDetailModalProps> = ({
  isOpen,
  onClose,
  call,
  onOpenReportWithCall,
  onAnalyzeFullCall,
}) => {
  if (!call) return null;

  const isSafe = call.risk_level === 'SAFE';

  // Synthetic breakdown for deep modal inspection if breakdown isn't on call object
  const riskBreakdown = {
    ai_voice_indicators: Math.round((call.synthetic_prob / 100) * 35),
    conversation_behavior: Math.round((call.scam_prob / 100) * 25),
    financial_request: call.risk_score > 70 ? 18 : 0,
    caller_reputation: isSafe ? 2 : 10,
    call_metadata: call.is_voip ? 7 : 1,
  };

  const reasons = [
    ...(call.synthetic_prob > 50
      ? [
          {
            factor: 'Deep Neural Voice Synthesis Artifacts',
            description: `Acoustic spectral scan shows synthetic phase discontinuities with ${call.synthetic_prob}% confidence.`,
            severity: 'CRITICAL' as const,
          },
        ]
      : []),
    ...(call.scam_prob > 50
      ? [
          {
            factor: 'Social Engineering & Coercion Intent',
            description: `Conversational NLP flagged high-pressure coercion phrases matching scam vectors.`,
            severity: 'HIGH' as const,
          },
        ]
      : []),
    ...(call.is_voip
      ? [
          {
            factor: 'Virtual VoIP SIP Gateway Origin',
            description: 'Call routed through non-standard PBX gateway rather than direct cellular tower.',
            severity: 'MEDIUM' as const,
          },
        ]
      : []),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Forensic Audit Dossier: ${call.call_id}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                isSafe
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
              }`}
            >
              {isSafe ? <UserCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{call.caller_name}</h3>
                <Badge level={call.risk_level} size="sm" />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                <span className="text-slate-200">{call.phone_number}</span>
                <span>·</span>
                <span>{call.duration}</span>
                <span>·</span>
                <span>{call.timestamp}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!isSafe && onOpenReportWithCall && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onClose();
                  onOpenReportWithCall(call);
                }}
                leftIcon={<FileWarning className="w-4 h-4" />}
                className="w-full sm:w-auto text-xs font-mono"
              >
                File 1930 Incident Report
              </Button>
            )}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Risk Gauge & Telecom */}
          <div className="lg:col-span-5 space-y-5">
            <RiskScoreGauge
              score={call.risk_score}
              level={call.risk_level}
              recommendation={call.recommendation || (isSafe ? 'ACCEPT' : 'BLOCK & SEVER')}
            />

            {/* Telecom Metadata Strip */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-indigo-400" /> TELECOM NETWORK ROUTING
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Carrier Route:</span>
                <span className="text-slate-200">{call.is_voip ? 'Virtual VoIP Gateway' : 'Cellular GSM Direct'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">AI Synthesis Prob:</span>
                <span className={call.synthetic_prob > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {call.synthetic_prob}%
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Extortion Intent:</span>
                <span className={call.scam_prob > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {call.scam_prob}%
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Waveform, Explainability & Transcript */}
          <div className="lg:col-span-7 space-y-5">
            {/* Waveform visualizer */}
            <AudioWaveformVisualizer
              duration={call.duration}
              isSynthetic={call.synthetic_prob > 50}
              accentColor={isSafe ? 'emerald' : 'rose'}
            />

            {/* Explainability Panel */}
            <ExplainabilityPanel
              riskBreakdown={riskBreakdown}
              reasons={reasons}
            />

            {/* Transcript */}
            <TranscriptHighlighter
              transcript={call.transcript}
              suspiciousPhrases={[]}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
