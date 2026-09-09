import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Layers,
  Radio,
  FileCheck2,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Play
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface SIHDemoWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchSafeDemo: () => void;
  onLaunchFakeDemo: () => void;
  onNavigateToView: (view: string) => void;
}

export const SIHDemoWorkflowModal: React.FC<SIHDemoWorkflowModalProps> = ({
  isOpen,
  onClose,
  onLaunchSafeDemo,
  onLaunchFakeDemo,
  onNavigateToView,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);

  const steps = [
    {
      step: 1,
      tag: 'THE CRISIS',
      title: 'The AI Voice Cloning & Digital Arrest Epidemic',
      description: 'Generative AI voice clones can copy anyone in 3 seconds. Traditional caller ID and voice similarity fail against modern zero-shot synthesizers.',
    },
    {
      step: 2,
      tag: 'OUR SOLUTION',
      title: '5-Pillar Multi-Signal Explainable AI Engine',
      description: 'VoiceGuard evaluates acoustic micro-prosody, spectral phase artifacts, conversational extortion intent, telecom routing, and caller reputation simultaneously.',
    },
    {
      step: 3,
      tag: 'LIVE INTERCEPTION',
      title: 'Real-time Defense Demonstration',
      description: 'Experience real-time stream analysis comparing a verified family call against an active deepfake digital arrest extortion scam.',
    },
    {
      step: 4,
      tag: 'ECOSYSTEM INTEGRATION',
      title: 'Telecom Blocking & National Cyber Crime Cell Dossier',
      description: 'Automated carrier-level call severance, family emergency alerts, and 1-click evidence dossiers generated for the 1930 National Cyber Crime Portal.',
    },
  ];

  const current = steps[activeStep - 1];

  const handleNext = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Smart India Hackathon Prototype Evaluation Guide
            </h3>
            <p className="text-xs text-cyan-400 font-medium">Interactive Judge Presentation Tour</p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Step Progress Tracker */}
        <div className="flex items-center justify-between px-2">
          {steps.map((s) => (
            <div
              key={s.step}
              onClick={() => setActiveStep(s.step)}
              className={`flex items-center gap-2 cursor-pointer transition-all ${
                activeStep === s.step
                  ? 'text-cyan-400 font-bold scale-105'
                  : activeStep > s.step
                  ? 'text-indigo-300'
                  : 'text-slate-600'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-all ${
                  activeStep === s.step
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : activeStep > s.step
                    ? 'bg-indigo-900/60 text-indigo-300 border-indigo-500/40'
                    : 'bg-slate-900 text-slate-600 border-slate-800'
                }`}
              >
                {activeStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>
              <span className="hidden md:inline text-xs font-mono">{s.tag}</span>
            </div>
          ))}
        </div>

        {/* Step Dynamic Content Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-indigo-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-full">
              STEP {activeStep} OF 4 · {current.tag}
            </span>
            <span className="text-xs font-mono text-slate-400">SIH PROBLEM STATEMENT DEF-04</span>
          </div>

          <div>
            <h4 className="text-xl font-extrabold text-white tracking-tight">{current.title}</h4>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">{current.description}</p>
          </div>

          {/* STEP 1: The Problem Visuals */}
          {activeStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 space-y-1">
                <div className="text-rose-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> 3-Second Audio Clones
                </div>
                <p className="text-xs text-slate-300">
                  Attackers harvest 3 seconds from social media reels to clone a family member's voice with 92% similarity.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                <div className="text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Digital Arrest Scams
                </div>
                <p className="text-xs text-slate-300">
                  Scammers impersonate CBI, Police, and Customs officers on VoIP lines to extort ₹50,000 to ₹10 Lakhs.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                <div className="text-indigo-400 font-mono text-xs font-bold flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" /> Voice Similarity Flaw
                </div>
                <p className="text-xs text-slate-300">
                  Traditional biometrics verify that the voice sounds like the person, which fails because the clone sounds exact!
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: The Multi-Signal Architecture */}
          {activeStep === 2 && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                  <div className="font-mono text-cyan-400 font-bold text-sm">35%</div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-0.5">AI Voice Synthesis</div>
                  <div className="text-[10px] text-slate-400">Prosody & Jitter</div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                  <div className="font-mono text-cyan-400 font-bold text-sm">25%</div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-0.5">Conversation Intent</div>
                  <div className="text-[10px] text-slate-400">NLP Extortion Scan</div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                  <div className="font-mono text-cyan-400 font-bold text-sm">20%</div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-0.5">Financial & Urgency</div>
                  <div className="text-[10px] text-slate-400">OTP / UPI Demand</div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                  <div className="font-mono text-cyan-400 font-bold text-sm">12%</div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-0.5">Caller Reputation</div>
                  <div className="text-[10px] text-slate-400">Trusted Contacts</div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30">
                  <div className="font-mono text-cyan-400 font-bold text-sm">8%</div>
                  <div className="text-[11px] font-semibold text-slate-200 mt-0.5">Call Metadata</div>
                  <div className="text-[10px] text-slate-400">VoIP & PBX Tracing</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                💡 <strong className="text-white">Explainable AI:</strong> Rather than giving an opaque black-box score, VoiceGuard breaks down the exact acoustic and semantic reasons in real-time.
              </p>
            </div>
          )}

          {/* STEP 3: Live Interception Comparison */}
          {activeStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">SAFE SCENARIO</span>
                  <span className="text-xs font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    Score: 03/100
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Dad - Train Arrival Call</h5>
                  <p className="text-xs text-slate-300 mt-1">
                    Organic pitch jitter, genuine carrier GSM routing, zero financial demands.
                  </p>
                </div>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onLaunchSafeDemo();
                  }}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                >
                  Launch Safe Call Demo
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">FAKE SCENARIO</span>
                  <span className="text-xs font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded animate-pulse">
                    Score: 94/100
                  </span>
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">Fake Police - Digital Arrest</h5>
                  <p className="text-xs text-slate-300 mt-1">
                    AI clone artifacts, spoofed VoIP server, 50,000 INR extortion demand.
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onLaunchFakeDemo();
                  }}
                  leftIcon={<Play className="w-3.5 h-3.5" />}
                  className="w-full text-xs"
                >
                  Launch Fake Call Demo
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: Ecosystem & Impact */}
          {activeStep === 4 && (
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20">
                  <div className="text-xs font-bold text-cyan-300 mb-1">1-Click 1930 Dossier</div>
                  <p className="text-xs text-slate-300">
                    Auto-formats verified acoustic evidence with SHA-256 integrity hash for Cyber Crime Portal.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20">
                  <div className="text-xs font-bold text-indigo-300 mb-1">On-Device Edge AI</div>
                  <p className="text-xs text-slate-300">
                    Runs locally on smartphone NPU (ONNX / CoreML) ensuring raw audio never leaves device.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/20">
                  <div className="text-xs font-bold text-emerald-300 mb-1">Emergency Circuit Breaker</div>
                  <p className="text-xs text-slate-300">
                    Instant line severance and automated WhatsApp alert sent to registered family contacts.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={activeStep === 1}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Exit Tour
            </Button>
            <Button
              variant="cyber"
              size="sm"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {activeStep === 4 ? 'Complete Tour & Explore' : 'Next Step'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
