import React from 'react';
import {
  Shield,
  Radio,
  Play,
  PhoneCall,
  PhoneOff,
  Zap,
  CheckCircle,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Button } from '../common/Button';

interface ActiveMonitoringCardProps {
  onStartSafeDemo: () => void;
  onStartFakeDemo: () => void;
  onStartWorkflow: () => void;
  onNavigateToAnalysis: () => void;
  protectionActive?: boolean;
}

export const ActiveMonitoringCard: React.FC<ActiveMonitoringCardProps> = ({
  onStartSafeDemo,
  onStartFakeDemo,
  onStartWorkflow,
  onNavigateToAnalysis,
  protectionActive = true,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 backdrop-blur-md shadow-2xl">
      {/* Background Decorative Rings */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-80 h-80 rounded-full border border-cyan-500/10 pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-56 h-56 rounded-full border border-indigo-500/15 pointer-events-none" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-32 h-32 rounded-full border border-cyan-400/20 pointer-events-none animate-pulse" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Section: Status & Description */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              REAL-TIME CALL INTERCEPTION ACTIVE
            </span>
            <span className="text-xs font-mono text-slate-400">· Edge DSP & NLP Engine</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Zero-Trust Acoustic & Deepfake Guardian
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Every incoming cellular or VoIP voice stream is filtered in milliseconds.
              If synthetic voice cloning, digital arrest coercion, or unauthorized OTP extraction is detected, VoiceGuard auto-severs the line and notifies registered guardians.
            </p>
          </div>

          {/* Mini Status Metrics */}
          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>4 Biometric Profiles Active</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>VoIP Gateway Filter: On</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>1930 Auto-Dossier Ready</span>
            </div>
          </div>
        </div>

        {/* Right Section: Quick Interactive Launchers */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
          <Button
            variant="danger"
            size="md"
            onClick={onStartFakeDemo}
            leftIcon={<PhoneOff className="w-4 h-4 text-white animate-bounce" />}
            className="w-full justify-center text-xs font-mono shadow-lg shadow-rose-600/30"
          >
            Launch Fake Call Interception Demo
          </Button>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2 w-full">
            <Button
              variant="success"
              size="sm"
              onClick={onStartSafeDemo}
              leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
              className="text-xs font-mono justify-center"
            >
              Safe Call Demo
            </Button>

            <Button
              variant="cyber"
              size="sm"
              onClick={onStartWorkflow}
              leftIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-300" />}
              className="text-xs font-mono justify-center"
            >
              SIH Presentation Tour
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
