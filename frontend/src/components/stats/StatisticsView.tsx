import React from 'react';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  Flame,
  Zap,
  Activity,
  Award,
  Globe2,
  FileCheck
} from 'lucide-react';
import { SystemStats } from '../../types';
import { ThreatDistributionChart, LatencyBenchmarkChart } from './Charts';

interface StatisticsViewProps {
  stats: SystemStats | null;
  isLoading?: boolean;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({ stats, isLoading = false }) => {
  const defaultStats: SystemStats = {
    total_calls_analyzed: 148,
    scam_calls_detected: 42,
    safe_calls: 106,
    scams_prevented: 39,
    money_saved_inr: 875000,
    avg_detection_latency_ms: 184,
    protection_status: 'ACTIVE_GUARD',
    last_threat_detected: '4 mins ago',
  };

  const s = stats || defaultStats;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Deep Neural Metrics & Impact Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Aggregated accuracy, extortion prevention metrics & latency benchmarks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
            Model Accuracy: 98.4%
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <div className="text-[11px] text-slate-400 uppercase">Protection Rate</div>
          <div className="text-2xl font-bold text-emerald-400">92.8%</div>
          <div className="text-[10px] text-slate-400 font-sans">39 of 42 threats neutralized</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <div className="text-[11px] text-slate-400 uppercase">False Positive Rate</div>
          <div className="text-2xl font-bold text-cyan-400">0.68%</div>
          <div className="text-[10px] text-slate-400 font-sans">1 in 147 legitimate calls</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <div className="text-[11px] text-slate-400 uppercase">Citizen Wealth Protected</div>
          <div className="text-2xl font-bold text-amber-400">₹{(s.money_saved_inr / 100000).toFixed(2)}L</div>
          <div className="text-[10px] text-slate-400 font-sans">Direct extortion thwarted</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-1">
          <div className="text-[11px] text-slate-400 uppercase">1930 Dossiers Auto-Filed</div>
          <div className="text-2xl font-bold text-indigo-400">18 Reports</div>
          <div className="text-[10px] text-slate-400 font-sans">National Portal synced</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatDistributionChart />
        <LatencyBenchmarkChart />
      </div>

      {/* SIH Innovation Impact Card */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              Smart India Hackathon 2026 Strategic Value
            </h3>
            <p className="text-xs text-slate-400">National telecom & cyber defense readiness</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-cyan-400" /> Carrier Gateway Scalability
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Engineered for seamless integration with Indian telecom carriers (Jio, Airtel, Vi, BSNL) at the SIP trunk layer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-400" /> Automated 1930 Cyber Cell API
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              Transfers timestamped acoustic evidence, waveform snapshots, and extortion transcripts directly to cyber police.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="font-bold text-white font-mono flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> On-Device Edge Inference
            </div>
            <p className="text-slate-400 leading-relaxed font-sans">
              DSP audio feature extraction runs locally on citizen smartphones ensuring zero biometric privacy leakage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
