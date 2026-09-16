import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Radio,
  Play,
  Flame,
  LayoutDashboard,
  Cpu,
  Users,
  History,
  BarChart3,
  FileWarning,
  Settings,
  Sparkles,
  Zap,
  Globe,
  Headphones
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSafeDemo: () => void;
  onOpenFakeDemo: () => void;
  onOpenSIHDemo: () => void;
  onOpenScenarioModal: () => void;
  onGoToLanding: () => void;
  totalCalls?: number;
  blockedCalls?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  onOpenSafeDemo,
  onOpenFakeDemo,
  onOpenSIHDemo,
  onOpenScenarioModal,
  onGoToLanding,
  totalCalls = 1420,
  blockedCalls = 312,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analysis', label: 'Live Call Analysis', icon: Radio, badge: 'AI' },
    { id: 'contacts', label: 'Voice Profiles', icon: Users, badge: null },
    { id: 'history', label: 'Call Forensics', icon: History, badge: null },
    { id: 'threats', label: 'Threat Center', icon: Flame, badge: 'LIVE' },
    { id: 'reports', label: 'Incident Reports', icon: FileWarning, badge: null },
    { id: 'statistics', label: 'Analytics & Trends', icon: BarChart3, badge: null },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="w-72 bg-slate-950/90 border-r border-slate-700/70 flex flex-col h-screen select-none relative z-30 backdrop-blur-xl">
      {/* Top Header / Branding */}
      <div className="p-5 border-b border-slate-700/80">
        <div
          onClick={onGoToLanding}
          className="flex items-center gap-3 cursor-pointer group transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-slate-200 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-sky-300 group-hover:text-cyan-200 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-50 via-sky-200 to-cyan-300 tracking-wider font-mono text-base">
                VOICEGUARD
              </span>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-bold bg-sky-500/15 text-sky-200 border border-sky-400/30 rounded">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight">AI Voice Scam Shield</p>
          </div>
        </div>

        {/* Live Active Defense Indicator */}
        <div className="mt-4 flex items-center justify-between px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold tracking-wide">Shield Active</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-300 font-bold">99.8% Acc</span>
        </div>
      </div>

      {/* Scrollable Center: Demos + Navigation */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* DEMO CONTROLS SECTION */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300/70 font-bold flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-cyan-400" /> Evaluation Demos
            </span>
            <button
              onClick={onOpenScenarioModal}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium hover:underline"
            >
              All Scenarios
            </button>
          </div>

          <div className="space-y-2">
            {/* Guided Demo Mode */}
            <button
              onClick={onOpenSIHDemo}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-800 border border-sky-500/30 hover:border-sky-400/60 text-sky-100 hover:text-white shadow-md shadow-sky-950/30 group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    Guided Product Demo <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-1 rounded">2 min</span>
                  </div>
                  <div className="text-[10px] text-cyan-300/70">Interactive Presentation</div>
                </div>
              </div>
              <Play className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/30 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Fake Call AI Deepfake Demo */}
            <button
              onClick={onOpenFakeDemo}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-rose-950/60 to-red-950/60 border border-rose-500/30 hover:border-rose-400/60 text-rose-200 hover:text-white group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-300 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight flex items-center gap-1">
                    Fake Call Demo <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  </div>
                  <div className="text-[10px] text-rose-300/70">AI Clone + Extortion (94)</div>
                </div>
              </div>
              <Play className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Safe Call Genuine Demo */}
            <button
              onClick={onOpenSafeDemo}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-emerald-950/60 to-teal-950/60 border border-emerald-500/30 hover:border-emerald-400/60 text-emerald-200 hover:text-white group transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Safe Call Demo</div>
                  <div className="text-[10px] text-emerald-300/70">Dad (Verified Mobile - 03)</div>
                </div>
              </div>
              <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/30 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* MAIN NAVIGATION */}
        <div>
          <div className="px-2 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Core Modules
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/12 to-slate-700/80 text-white border border-sky-400/30 shadow-sm shadow-sky-900/40'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-mono font-bold rounded ${
                        item.badge === 'LIVE'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Status & System Info */}
      <div className="p-3.5 border-t border-indigo-900/30 bg-slate-950/70">
        <div className="bg-slate-900/80 rounded-xl p-2.5 border border-indigo-500/15 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3 h-3 text-indigo-400" /> Edge Engine
            </span>
            <span className="text-emerald-400 font-mono font-semibold text-[10px]">LOCAL ON-DEVICE</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800 text-[10px]">
            <div>
              <div className="text-slate-400">Total Scanned</div>
              <div className="font-mono font-bold text-slate-200">{totalCalls.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400">Threats Neutralized</div>
              <div className="font-mono font-bold text-rose-400">{blockedCalls.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="mt-2 text-center">
          <p className="text-[10px] font-mono text-slate-400">
            VoiceGuard v2.4-Neural · DEFENSE-2024
          </p>
        </div>
      </div>
    </aside>
  );
};
