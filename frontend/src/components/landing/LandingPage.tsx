import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Award,
  Radio,
  FileWarning,
  Cpu,
  PhoneCall,
  Lock,
  ArrowRight,
  Globe2,
  FileCheck,
  Sliders,
  CheckCircle2,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import { Button } from '../common/Button';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onLaunchTour: () => void;
  onLaunchFakeDemo: () => void;
  onLaunchSafeDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchDashboard,
  onLaunchTour,
  onLaunchFakeDemo,
  onLaunchSafeDemo,
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/40 selection:text-white">
      {/* Background Cyber Glow & Grid Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#94a3b815_1px,transparent_1px),linear-gradient(to_bottom,#94a3b815_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-700/70 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-400 via-cyan-500 to-slate-200 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-sky-300" />
              </div>
            </div>
            <div>
              <span className="font-mono font-bold text-base tracking-wider text-white">
                VOICE<span className="text-sky-300">GUARD</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-200 border border-sky-400/20">
                AI DEFENSE EDITION
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={onLaunchTour}
              leftIcon={<Compass className="w-4 h-4 text-cyan-400" />}
              className="text-xs font-mono hidden md:flex"
            >
              Product Presentation Tour
            </Button>
            <Button
              variant="cyber"
              size="sm"
              onClick={onLaunchDashboard}
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="text-xs font-mono"
            >
              Launch Defense Console
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 z-10">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-200 text-xs font-mono shadow-inner shadow-sky-500/10">
            <Sparkles className="w-3.5 h-3.5 text-sky-300 animate-spin" />
            <span>AI Citizen Cybersecurity Initiative</span>
          </div>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-mono leading-tight">
              Real-Time AI Defense Against{' '}
              <span className="bg-gradient-to-r from-sky-300 via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                Voice Clones & "Digital Arrest"
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-slate-400 font-sans max-w-3xl mx-auto leading-relaxed">
              Sub-second multi-signal Explainable AI (XAI) engine that inspects incoming voice streams, flags deepfake acoustic artifacts, severs extortion calls, and auto-files dossiers with the 1930 Cyber Helpline.
            </p>
          </div>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="cyber"
              size="lg"
              onClick={onLaunchDashboard}
              rightIcon={<ArrowRight className="w-5 h-5" />}
              className="font-mono text-sm px-8 shadow-xl shadow-cyan-500/20"
            >
              Enter Defense Console
            </Button>

            <Button
              variant="danger"
              size="lg"
              onClick={onLaunchFakeDemo}
              leftIcon={<ShieldAlert className="w-5 h-5" />}
              className="font-mono text-sm px-6 shadow-xl shadow-rose-600/20"
            >
              Simulate 94/100 Scam Intercept
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={onLaunchSafeDemo}
              leftIcon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
              className="font-mono text-sm px-6"
            >
              Test Genuine Verified Call
            </Button>
          </div>

          {/* Live Telemetry KPI Strip */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/75 border border-slate-700/70 backdrop-blur-md shadow-2xl font-mono text-left">
              <div className="p-3 border-r border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase">Detection Latency</div>
                <div className="text-xl sm:text-2xl font-bold text-cyan-400">184 ms</div>
                <div className="text-[10px] text-slate-400 font-sans">Sub-second edge turnaround</div>
              </div>

              <div className="p-3 md:border-r border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase">Neural Accuracy</div>
                <div className="text-xl sm:text-2xl font-bold text-emerald-400">98.4%</div>
                <div className="text-[10px] text-slate-400 font-sans">RawNet2 + RoBERTa ensemble</div>
              </div>

              <div className="p-3 border-r border-slate-800/80">
                <div className="text-[11px] text-slate-400 uppercase">Scams Thwarted</div>
                <div className="text-xl sm:text-2xl font-bold text-rose-400">39 / 42</div>
                <div className="text-[10px] text-slate-400 font-sans">92.8% protection efficiency</div>
              </div>

              <div className="p-3">
                <div className="text-[11px] text-slate-400 uppercase">Citizen Wealth Protected</div>
                <div className="text-xl sm:text-2xl font-bold text-amber-400">₹8.75 Lakhs</div>
                <div className="text-[10px] text-slate-400 font-sans">1930 Cyber dossiers dispatched</div>
              </div>
            </div>
          </div>
        </section>

        {/* 5-Pillar Architecture Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="text-center space-y-3 mb-12">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              MULTI-SIGNAL EXPLAINABLE AI (XAI) ARCHITECTURE
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-mono text-white">
              Why VoiceGuard Outperforms Traditional Caller ID
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto font-sans">
              Traditional databases rely on static spam numbers easily bypassed by VoIP spoofing. VoiceGuard inspects acoustic physics, semantic NLP intent, and biometric vectors simultaneously.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 font-mono text-xs">
            {/* Pillar 1 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                35%
              </div>
              <h3 className="font-bold text-white text-sm">AI Voice Synthesis Detection</h3>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                RawNet2 spectral FFT analyzes unnatural prosody pitch jitter (&lt;0.02) and phase discontinuity in real-time.
              </p>
              <div className="text-[10px] text-cyan-400">Target: ElevenLabs & VALL-E</div>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                25%
              </div>
              <h3 className="font-bold text-white text-sm">Extortion Intent (NLP)</h3>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                Real-time ASR spots fake police coercion, CBI warrants, "Digital Arrest" demands, and isolation commands.
              </p>
              <div className="text-[10px] text-cyan-400">Target: Impersonation Scams</div>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                20%
              </div>
              <h3 className="font-bold text-white text-sm">Financial Urgency Pressure</h3>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                Flags immediate OTP demands, KYC account freeze threats, and mule UPI destination addresses.
              </p>
              <div className="text-[10px] text-cyan-400">Target: Banking & OTP Frauds</div>
            </div>

            {/* Pillar 4 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                12%
              </div>
              <h3 className="font-bold text-white text-sm">512-d Biometric Verification</h3>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                ECAPA-TDNN speaker vector cosine distance ensures family voices match enrolled biometric fingerprints.
              </p>
              <div className="text-[10px] text-cyan-400">Target: Kidnapping Ransom Calls</div>
            </div>

            {/* Pillar 5 */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/20 space-y-3 shadow-lg hover:border-cyan-500/40 transition-all">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                8%
              </div>
              <h3 className="font-bold text-white text-sm">Telecom SIP Gateway</h3>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                Inspects virtual VoIP PBX trunks, international routing proxies, and caller ID spoofing markers.
              </p>
              <div className="text-[10px] text-cyan-400">Target: International Robocalls</div>
            </div>

            <div className="md:col-span-3 p-5 rounded-2xl bg-gradient-to-br from-sky-500/10 via-slate-900 to-slate-900 border border-sky-400/20 space-y-3 shadow-lg hover:border-sky-400/40 transition-all">
              <div className="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-300 flex items-center justify-center font-bold">
                Chain
              </div>
              <h3 className="font-bold text-white text-sm">Blockchain Evidence Ledger</h3>
              <p className="text-slate-400 font-sans text-[11px] leading-relaxed">
                Every suspicious call, transcript hash, and incident report is cryptographically sealed into a tamper-evident blockchain ledger for legal-proof integrity and audit readiness.
              </p>
              <div className="text-[10px] text-sky-300">Immutable · Hash-anchored · Court-ready evidence</div>
            </div>
          </div>
        </section>

        {/* 4-Stage Defense Workflow */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-900">
          <div className="bg-slate-900/80 border border-slate-700/70 rounded-3xl p-8 backdrop-blur-md shadow-[0_18px_50px_rgba(15,23,42,0.7)] space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                AUTONOMOUS MITIGATION PIPELINE
              </span>
              <h2 className="text-xl sm:text-3xl font-bold font-mono text-white">
                How VoiceGuard Intercepts Fraud in 4 Steps
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
              <div className="space-y-2 text-left">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-500/40">
                  1
                </div>
                <h4 className="font-bold text-white text-sm">Real-Time Ingestion</h4>
                <p className="text-slate-400 font-sans text-[11px]">
                  Audio stream is captured at SIP trunk or on-device edge with zero cloud biometric storage.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/40">
                  2
                </div>
                <h4 className="font-bold text-white text-sm">184ms Multi-Signal DSP</h4>
                <p className="text-slate-400 font-sans text-[11px]">
                  5 neural modules synthesize spectral FFT, NLP intent, and biometric distance into 0-100 risk score.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold border border-amber-500/40">
                  3
                </div>
                <h4 className="font-bold text-white text-sm">Autonomous Line Sever</h4>
                <p className="text-slate-400 font-sans text-[11px]">
                  If risk exceeds 75/100, carrier SIP bridge severs connection to protect vulnerable citizens.
                </p>
              </div>

              <div className="space-y-2 text-left">
                <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold border border-rose-500/40">
                  4
                </div>
                <h4 className="font-bold text-white text-sm">1930 Cyber Dossier Filing</h4>
                <p className="text-slate-400 font-sans text-[11px]">
                  Generates forensic JSON report with audio waveforms & ASR transcripts dispatched to police.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 z-10 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>VOICEGUARD · AI SECURITY PLATFORM</span>
          </div>

          <div className="text-center sm:text-right">
            <span>Aligned with Indian Cybercrime Coordination Centre (I4C) & 1930 Helpline</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
