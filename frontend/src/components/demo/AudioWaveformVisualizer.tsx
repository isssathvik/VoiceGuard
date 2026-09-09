import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, ShieldAlert, Sparkles } from 'lucide-react';

interface AudioWaveformProps {
  waveform?: number[];
  duration?: string;
  isSynthetic?: boolean;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  accentColor?: 'emerald' | 'rose' | 'indigo' | 'cyan' | 'amber';
  height?: number;
  highlightAnomalies?: boolean;
}

export const AudioWaveformVisualizer: React.FC<AudioWaveformProps> = ({
  waveform = [],
  duration = '00:42',
  isSynthetic = false,
  isPlaying: externalIsPlaying,
  onTogglePlay: externalOnTogglePlay,
  accentColor = 'indigo',
  height = 96,
  highlightAnomalies = true,
}) => {
  const [internalPlaying, setInternalPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animFrameRef = useRef<number | null>(null);

  const isPlaying = externalIsPlaying !== undefined ? externalIsPlaying : internalPlaying;

  // Generate 48 realistic amplitude bars if none provided
  const bars =
    waveform && waveform.length > 0
      ? waveform
      : Array.from({ length: 48 }, (_, i) => {
          if (isSynthetic) {
            // Robotic unnatural repetitive rhythm
            return Math.sin(i * 0.5) * 0.35 + 0.55 + (i % 4 === 0 ? 0.25 : 0);
          } else {
            // Natural human prosodic variance
            return Math.abs(Math.sin(i * 0.3) * Math.cos(i * 0.7)) * 0.7 + 0.25;
          }
        });

  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now() - progress * 10000;
      const animate = (now: number) => {
        const elapsed = (now - startTime) % 10000;
        setProgress(elapsed / 10000);
        animFrameRef.current = requestAnimationFrame(animate);
      };
      animFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const handleToggle = () => {
    if (externalOnTogglePlay) {
      externalOnTogglePlay();
    } else {
      setInternalPlaying(!internalPlaying);
    }
  };

  const handleReset = () => {
    setProgress(0);
    if (externalIsPlaying === undefined) setInternalPlaying(false);
  };

  const getBarColor = (index: number, val: number) => {
    const isPast = index / bars.length <= progress;

    if (isSynthetic && highlightAnomalies && (index > 15 && index < 25 || index > 35 && index < 42)) {
      // Highlight spectral anomaly glitch
      return isPast
        ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
        : 'bg-rose-700/60 border-t-2 border-rose-400';
    }

    if (accentColor === 'emerald') {
      return isPast ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]' : 'bg-emerald-950/80 hover:bg-emerald-800/60';
    }
    if (accentColor === 'rose') {
      return isPast ? 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.6)]' : 'bg-rose-950/80 hover:bg-rose-800/60';
    }
    if (accentColor === 'cyan') {
      return isPast ? 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]' : 'bg-cyan-950/80 hover:bg-cyan-800/60';
    }
    return isPast ? 'bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.6)]' : 'bg-indigo-950/80 hover:bg-indigo-800/60';
  };

  return (
    <div className="bg-slate-950/80 border border-indigo-500/20 rounded-2xl p-4.5 backdrop-blur-md shadow-xl space-y-3">
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
          <span className="font-mono text-slate-300 font-semibold tracking-wide">
            SPECTRAL WAVEFORM & PROSODY STREAM
          </span>
          {isSynthetic && (
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> SYNTHETIC ARTIFACTS
            </span>
          )}
        </div>
        <div className="font-mono text-slate-400 text-xs">
          {Math.floor(progress * 42)}s / {duration}
        </div>
      </div>

      {/* Waveform Bar Canvas */}
      <div
        className="relative flex items-end justify-between gap-1 px-2 py-3 bg-slate-900/90 rounded-xl border border-slate-800 overflow-hidden cursor-pointer"
        style={{ height: `${height}px` }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          setProgress(Math.max(0, Math.min(1, clickX / rect.width)));
        }}
      >
        {/* Playhead line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-10 pointer-events-none transition-all duration-75"
          style={{ left: `${progress * 100}%` }}
        />

        {/* Amplitude Bars */}
        {bars.map((val, idx) => {
          const barHeight = Math.max(8, val * (height - 24));
          return (
            <div
              key={idx}
              className={`flex-1 rounded-full transition-all duration-100 ${getBarColor(idx, val)}`}
              style={{
                height: `${isPlaying ? barHeight * (0.8 + Math.random() * 0.35) : barHeight}px`,
              }}
            />
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            title="Replay from start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Feature Tags */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span className="hidden sm:inline">SAMPLE RATE: <strong className="text-slate-200">16kHz PCM</strong></span>
          <span className="hidden md:inline">· CHANNELS: <strong className="text-slate-200">1 (Mono)</strong></span>
        </div>
      </div>
    </div>
  );
};
