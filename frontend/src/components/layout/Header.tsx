import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  PlusCircle,
  FileWarning,
  Sparkles,
  Shield,
  Activity,
  Laptop,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenNewAnalysis: () => void;
  onOpenNewReport: () => void;
  onOpenSIHDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenNewAnalysis,
  onOpenNewReport,
  onOpenSIHDemo,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const getViewTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return { title: 'Security Command Center', desc: 'Real-time multi-signal AI voice telemetry & threat defense' };
      case 'analysis':
        return { title: 'Live Call Forensics & Waveform', desc: 'Multi-signal deep acoustic, spectral & semantic analyzer' };
      case 'contacts':
        return { title: 'Verified Voice Profiles', desc: 'Trusted biometric voice enrollment & caller identity registry' };
      case 'history':
        return { title: 'Call Audit Log & Forensics', desc: 'Comprehensive indexed archive of analyzed voice streams' };
      case 'threats':
        return { title: 'Scam Intelligence & Threat Center', desc: 'Active voice clone vectors, extortion campaigns & advisories' };
      case 'reports':
        return { title: 'Incident Reporting & Evidence Dossier', desc: 'Generate tamper-evident fraud dossiers with unique VG-IDs' };
      case 'statistics':
        return { title: 'Threat Analytics & Risk Velocity', desc: 'Acoustic anomaly trends, threat distributions & model metrics' };
      case 'settings':
        return { title: 'Protection & Neural Engine Settings', desc: 'Real-time interception thresholds, privacy & edge policies' };
      default:
        return { title: 'VoiceGuard Security Console', desc: 'Multi-signal AI Voice Scam Shield' };
    }
  };

  const info = getViewTitle();

  return (
    <header className="h-16 bg-slate-950/75 border-b border-slate-700/70 px-6 flex items-center justify-between backdrop-blur-xl z-20 shrink-0">
      {/* View Title */}
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2 font-mono">
            {info.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">{info.desc}</p>
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-3">
        {/* Live Clock & Shield State */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/70 font-mono text-xs">
          <Activity className="w-3.5 h-3.5 text-sky-300 animate-pulse" />
          <span className="text-slate-400">LATENCY:</span>
          <span className="text-emerald-300 font-semibold">18ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200 font-bold">{time || '00:00:00 UTC'}</span>
        </div>

        {/* Protection Mode Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-200 text-xs font-mono font-medium">
          <Lock className="w-3 h-3 text-sky-300" />
          <span>REAL-TIME SHIELD</span>
        </div>

        {/* Quick Action: New Audio Analysis */}
        <Button
          variant="cyber"
          size="sm"
          onClick={onOpenNewAnalysis}
          leftIcon={<PlusCircle className="w-4 h-4" />}
          className="font-mono text-xs"
        >
          Analyze Audio
        </Button>

        {/* Quick Action: Report Incident */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenNewReport}
          leftIcon={<FileWarning className="w-4 h-4 text-amber-400" />}
          className="font-mono text-xs hover:border-amber-500/50 hover:text-amber-300"
        >
          Report Scam
        </Button>

        {/* Quick Action: Guided Product Demo */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenSIHDemo}
          leftIcon={<Sparkles className="w-4 h-4 text-cyan-400" />}
          className="hidden sm:inline-flex font-mono text-xs bg-indigo-950/60 border-indigo-500/30 text-indigo-200 hover:bg-indigo-900/60"
        >
          Product Tour
        </Button>
      </div>
    </header>
  );
};
