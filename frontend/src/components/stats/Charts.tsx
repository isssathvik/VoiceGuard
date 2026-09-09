import React from 'react';
import {
  BarChart3,
  PieChart,
  Activity,
  Flame,
  Zap,
  ShieldAlert,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const ThreatDistributionChart: React.FC = () => {
  const data = [
    { label: 'AI Voice Clone & Synthesis', percent: 42, count: 18, color: 'bg-rose-500', text: 'text-rose-400' },
    { label: 'Fake Police "Digital Arrest"', percent: 31, count: 13, color: 'bg-orange-500', text: 'text-orange-400' },
    { label: 'Urgent OTP & Bank Scare', percent: 18, count: 8, color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Kidnapping & Extortion Cry', percent: 9, count: 3, color: 'bg-indigo-500', text: 'text-indigo-400' },
  ];

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              Threat Vector Distribution
            </h3>
            <p className="text-[11px] text-slate-400">Classified voice fraud attack vectors</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 font-bold">42 TOTAL ATTACKS</span>
      </div>

      {/* Multi-segment Progress Bar */}
      <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{ width: `${item.percent}%` }}
            className={`${item.color} transition-all hover:opacity-80`}
            title={`${item.label}: ${item.percent}%`}
          />
        ))}
      </div>

      {/* List breakdown */}
      <div className="space-y-2.5 pt-1">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-slate-300 font-sans">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-400">{item.count} calls</span>
              <strong className={item.text}>{item.percent}%</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LatencyBenchmarkChart: React.FC = () => {
  const pipelineStages = [
    { stage: 'Acoustic DSP & Spectrogram FFT', latency: 34, max: 100, target: '< 50ms', desc: 'RawNet2 spectral artifact extraction' },
    { stage: 'Real-time ASR & NLP Intent Classifier', latency: 88, max: 150, target: '< 100ms', desc: 'DistilRoBERTa token keyword spotting' },
    { stage: 'Biometric Speaker Vector Verification', latency: 28, max: 80, target: '< 40ms', desc: 'ECAPA-TDNN 512-d cosine similarity' },
    { stage: 'Telecom Routing & Gateway Heuristics', latency: 14, max: 40, target: '< 20ms', desc: 'SIP trunk & number spoof check' },
    { stage: 'Multi-Signal Weighted Risk Synthesis', latency: 19, max: 50, target: '< 25ms', desc: 'Formula-based XAI score attribution' },
  ];

  const totalLatency = pipelineStages.reduce((acc, s) => acc + s.latency, 0);

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              Pipeline Inference Benchmarks
            </h3>
            <p className="text-[11px] text-slate-400">Sub-second multi-stage edge latency profiling</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono font-bold text-emerald-400">{totalLatency} ms</div>
          <div className="text-[10px] font-mono text-slate-400">TOTAL TURNAROUND</div>
        </div>
      </div>

      <div className="space-y-3">
        {pipelineStages.map((stage, idx) => {
          const percent = Math.round((stage.latency / stage.max) * 100);

          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{stage.stage}</span>
                <span className="font-mono text-cyan-400 font-bold">{stage.latency} ms</span>
              </div>

              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>{stage.desc}</span>
                <span>Target: {stage.target}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
