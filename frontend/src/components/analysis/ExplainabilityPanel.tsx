import React from 'react';
import {
  Sparkles,
  Cpu,
  Flame,
  CreditCard,
  UserCheck,
  Radio,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { RiskBreakdown, RiskFactor } from '../../types';
import { Badge } from '../common/Badge';

interface ExplainabilityPanelProps {
  riskBreakdown?: RiskBreakdown;
  reasons?: RiskFactor[];
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  riskBreakdown = {
    ai_voice_indicators: 0,
    conversation_behavior: 0,
    financial_request: 0,
    caller_reputation: 0,
    call_metadata: 0,
  },
  reasons = [],
}) => {
  const breakdownItems = [
    {
      label: 'AI Voice Synthesis',
      weight: '35% Max',
      value: riskBreakdown.ai_voice_indicators,
      max: 35,
      color: 'bg-rose-500',
      textColor: 'text-rose-400',
      icon: Cpu,
      desc: 'Spectral artifacts, phase discontinuities & pitch flatline',
    },
    {
      label: 'Conversation Extortion',
      weight: '25% Max',
      value: riskBreakdown.conversation_behavior,
      max: 25,
      color: 'bg-orange-500',
      textColor: 'text-orange-400',
      icon: Flame,
      desc: 'Digital arrest, authority intimidation & isolation',
    },
    {
      label: 'Financial & Urgency',
      weight: '20% Max',
      value: riskBreakdown.financial_request,
      max: 20,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      icon: CreditCard,
      desc: 'OTP demands, bank transfers & fast countdown pressure',
    },
    {
      label: 'Caller Trust & Reputation',
      weight: '12% Max',
      value: riskBreakdown.caller_reputation,
      max: 12,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400',
      icon: UserCheck,
      desc: 'Known address book match & biometric voice enrollment',
    },
    {
      label: 'Call Telecom Metadata',
      weight: '8% Max',
      value: riskBreakdown.call_metadata,
      max: 8,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400',
      icon: Radio,
      desc: 'VoIP gateway origin, PBX trunking & number spoofing',
    },
  ];

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-5 backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              Explainable AI (XAI) Multi-Signal Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">Transparent mathematical attribution of risk factors</p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          WEIGHTED SUM (0-100)
        </span>
      </div>

      {/* 5-Pillar Visual Progress Bars */}
      <div className="space-y-3">
        {breakdownItems.map((item, idx) => {
          const ItemIcon = item.icon;
          const percent = Math.min(100, Math.round((item.value / item.max) * 100));

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ItemIcon className={`w-3.5 h-3.5 ${item.textColor}`} />
                  <span className="font-semibold text-slate-200">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({item.weight})</span>
                </div>
                <div className="font-mono text-xs">
                  <strong className={item.textColor}>+{item.value}</strong>
                  <span className="text-slate-400 text-[10px]"> / {item.max} pts</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
                <div
                  className={`h-full ${item.color} transition-all duration-700 rounded-full`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="text-[10px] text-slate-400 pl-5">{item.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Specific Explanatory Risk Factors */}
      {reasons && reasons.length > 0 && (
        <div className="pt-3 border-t border-slate-800 space-y-2.5">
          <div className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" /> Key Evidence & Risk Factors Detected
          </div>

          <div className="space-y-2">
            {reasons.map((reason, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/30 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-200">{reason.factor}</span>
                  <Badge level={reason.severity} size="sm" />
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
