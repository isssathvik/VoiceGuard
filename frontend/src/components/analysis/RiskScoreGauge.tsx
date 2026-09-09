import React from 'react';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RiskLevel } from '../../types';
import { Badge } from '../common/Badge';

interface RiskScoreGaugeProps {
  score: number;
  level: RiskLevel;
  recommendation: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskScoreGauge: React.FC<RiskScoreGaugeProps> = ({
  score,
  level,
  recommendation,
  size = 'md',
}) => {
  const normalizedScore = Math.min(100, Math.max(0, score));

  // Determine stroke color
  const getGaugeColor = () => {
    if (normalizedScore <= 20) return '#10b981'; // Emerald
    if (normalizedScore <= 45) return '#06b6d4'; // Cyan
    if (normalizedScore <= 70) return '#f59e0b'; // Amber
    if (normalizedScore <= 85) return '#f97316'; // Orange
    return '#f43f5e'; // Rose
  };

  const color = getGaugeColor();
  const radius = 64;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Arc calculation for 240-degree gauge
  const arcLength = circumference * (240 / 360);
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden backdrop-blur-md shadow-xl">
      {/* Background radial glow */}
      <div
        className="absolute w-40 h-40 rounded-full blur-3xl opacity-20 -top-10 -left-10 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold mb-2">
        VOICE RISK SCORE
      </div>

      {/* SVG Circular Arc */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-[210deg]" viewBox="0 0 160 160">
          {/* Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${color}88)`,
            }}
          />
        </svg>

        {/* Center Score Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
          <span
            className="text-4xl font-extrabold font-mono tracking-tighter"
            style={{ color }}
          >
            {normalizedScore}
          </span>
          <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
            OUT OF 100
          </span>
        </div>
      </div>

      {/* Risk Level Badge & Action */}
      <div className="mt-1 space-y-2 w-full">
        <div className="flex items-center justify-center gap-2">
          <Badge level={level} size="md" />
        </div>

        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
          <span className="text-slate-400 block text-[10px] uppercase">RECOMMENDED ACTION</span>
          <span
            className="font-extrabold text-sm tracking-wide"
            style={{ color }}
          >
            {recommendation || 'ACCEPT'}
          </span>
        </div>
      </div>
    </div>
  );
};
