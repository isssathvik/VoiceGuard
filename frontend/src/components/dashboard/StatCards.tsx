import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  PhoneCall,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Clock
} from 'lucide-react';
import { SystemStats } from '../../types';

interface StatCardsProps {
  stats: SystemStats | null;
  isLoading?: boolean;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, isLoading = false }) => {
  const defaultStats: SystemStats = {
    total_calls_analyzed: 148,
    scam_calls_detected: 42,
    safe_calls: 106,
    scams_prevented: 39,
    money_saved_inr: 875000,
    avg_detection_latency_ms: 184,
    protection_status: 'ACTIVE_GUARD',
    last_threat_detected: '4 mins ago (Fake Police Digital Arrest)',
  };

  const s = stats || defaultStats;

  const cards = [
    {
      label: 'Calls Analyzed',
      value: s.total_calls_analyzed.toLocaleString(),
      subtext: `${s.safe_calls} verified genuine (71.6%)`,
      icon: PhoneCall,
      color: 'from-blue-500/20 to-indigo-500/10 border-indigo-500/30 text-cyan-400',
      badge: '+12% today',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      label: 'Threats Intercepted',
      value: s.scam_calls_detected.toLocaleString(),
      subtext: `${s.scams_prevented} severed in real-time`,
      icon: ShieldAlert,
      color: 'from-rose-500/20 to-red-500/10 border-rose-500/30 text-rose-400',
      badge: '92.8% Defense Rate',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      label: 'Estimated Loss Averted',
      value: `₹${(s.money_saved_inr / 100000).toFixed(2)} Lakhs`,
      subtext: `₹${s.money_saved_inr.toLocaleString()} extortion prevented`,
      icon: Flame,
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
      badge: 'Cumulative 2026',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      label: 'Neural Inference Latency',
      value: `${s.avg_detection_latency_ms} ms`,
      subtext: 'Real-time multi-signal edge execution',
      icon: Zap,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badge: '< 200ms Target',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.color} bg-slate-900/90 border p-5 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02]`}
          >
            {/* Ambient Corner Glow */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-500/5 blur-2xl pointer-events-none" />

            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-xs font-mono font-medium text-slate-400 tracking-wider uppercase">
                  {card.label}
                </span>
                <div className="text-2xl font-bold font-mono text-white tracking-tight">
                  {isLoading ? (
                    <div className="h-8 w-24 bg-slate-800 animate-pulse rounded" />
                  ) : (
                    card.value
                  )}
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-center">
                <IconComponent className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <span className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {card.subtext}
              </span>
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${card.badgeColor}`}
              >
                {card.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
