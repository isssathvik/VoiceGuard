import React from 'react';
import {
  Shield,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Sliders,
  PhoneCall,
  UserCheck,
  FileWarning,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { SystemStats, CallRecord } from '../../types';
import { StatCards } from './StatCards';
import { ActiveMonitoringCard } from './ActiveMonitoringCard';
import { ThreatBanner } from './ThreatBanner';
import { RecentCallsTable } from './RecentCallsTable';
import { Button } from '../common/Button';

interface DashboardViewProps {
  stats: SystemStats | null;
  recentCalls: CallRecord[];
  onSelectCall: (call: CallRecord) => void;
  onOpenReportWithCall: (call: CallRecord) => void;
  onStartSafeDemo: () => void;
  onStartFakeDemo: () => void;
  onStartWorkflow: () => void;
  onNavigateToAnalysis: () => void;
  onNavigateToHistory: () => void;
  onNavigateToThreatCenter: () => void;
  onSelectScenario: (scenarioId: string) => void;
  onRefreshData?: () => void;
  isLoading?: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  recentCalls,
  onSelectCall,
  onOpenReportWithCall,
  onStartSafeDemo,
  onStartFakeDemo,
  onStartWorkflow,
  onNavigateToAnalysis,
  onNavigateToHistory,
  onNavigateToThreatCenter,
  onSelectScenario,
  onRefreshData,
  isLoading = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Active Defense Hero Card */}
      <ActiveMonitoringCard
        onStartSafeDemo={onStartSafeDemo}
        onStartFakeDemo={onStartFakeDemo}
        onStartWorkflow={onStartWorkflow}
        onNavigateToAnalysis={onNavigateToAnalysis}
      />

      {/* Real-Time Cyber Cell Threat Banner */}
      <ThreatBanner onNavigateToThreatCenter={onNavigateToThreatCenter} />

      {/* Core Statistical Metrics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-cyan-400" /> SYSTEM TELEMETRY & DEFENSE IMPACT
          </h3>

          {onRefreshData && (
            <button
              onClick={onRefreshData}
              disabled={isLoading}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          )}
        </div>

        <StatCards stats={stats} isLoading={isLoading} />
      </div>

      {/* Interactive SIH 2026 Evaluation Test Bench */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" /> SIH 2026 Evaluation Scenario Test Bench
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instant multi-signal neural evaluation on live simulated threat vectors
            </p>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 self-start sm:self-auto">
            Live Test Vectors Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Card 1: Safe Family Call */}
          <div
            onClick={() => onSelectScenario('safe_family')}
            className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-400/60 hover:bg-emerald-950/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                03/100 · SAFE
              </span>
              <UserCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 font-mono">
                1. Safe Family Call (Dad)
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                97.8% biometric voice match, natural prosody, GSM cellular tower origin.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-emerald-500/20">
              Run Forensic Test <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 2: Digital Arrest Police Extortion */}
          <div
            onClick={() => onSelectScenario('govt_impersonation')}
            className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-400/60 hover:bg-rose-950/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                96/100 · CRITICAL
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-rose-300 font-mono">
                2. Digital Arrest Extortion
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                ElevenLabs deepfake voice clone, fictitious CBI arrest warrant, ₹50,000 extortion.
              </p>
            </div>
            <div className="text-[10px] font-mono text-rose-400 flex items-center gap-1 pt-1 border-t border-rose-500/20">
              Run Forensic Test <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Card 3: Urgent Bank Account Freeze */}
          <div
            onClick={() => onSelectScenario('ai_bank_scam')}
            className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400/60 hover:bg-amber-950/40 transition-all cursor-pointer group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                89/100 · HIGH RISK
              </span>
              <FileWarning className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white group-hover:text-amber-300 font-mono">
                3. SBI Account Freeze & OTP
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Spoofed landline caller ID, urgent account freeze threat, credential harvesting.
              </p>
            </div>
            <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1 pt-1 border-t border-amber-500/20">
              Run Forensic Test <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Call Interceptions & Telecom Telemetry */}
      <RecentCallsTable
        calls={recentCalls}
        onSelectCall={onSelectCall}
        onOpenReportWithCall={onOpenReportWithCall}
        onViewAll={onNavigateToHistory}
        isLoading={isLoading}
      />
    </div>
  );
};
