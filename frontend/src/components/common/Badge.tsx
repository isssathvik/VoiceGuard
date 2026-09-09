import React from 'react';
import { RiskLevel } from '../../types';

interface BadgeProps {
  level?: RiskLevel | string;
  variant?: 'risk' | 'status' | 'outline' | 'solid';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  level = 'SAFE',
  variant = 'risk',
  size = 'md',
  children,
  className = '',
}) => {
  const normalizedLevel = String(level).toUpperCase();

  const getRiskStyles = (lvl: string) => {
    switch (lvl) {
      case 'SAFE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/20';
      case 'LOW':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30 ring-1 ring-blue-500/20';
      case 'MEDIUM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 ring-1 ring-amber-500/20';
      case 'HIGH':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/30 ring-1 ring-orange-500/20';
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 ring-1 ring-rose-500/30 animate-pulse';
      case 'VERIFIED':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 ring-1 ring-indigo-500/20';
      case 'BLOCKED':
        return 'bg-red-950/60 text-red-400 border-red-800/50';
      default:
        return 'bg-slate-800/80 text-slate-300 border-slate-700/50';
    }
  };

  const getSizeStyles = (sz: string) => {
    switch (sz) {
      case 'sm':
        return 'px-2 py-0.5 text-xs font-semibold';
      case 'lg':
        return 'px-3.5 py-1 text-sm font-bold tracking-wide';
      case 'md':
      default:
        return 'px-2.5 py-0.5 text-xs font-semibold';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm backdrop-blur-md uppercase font-mono transition-all duration-200 ${getRiskStyles(
        normalizedLevel
      )} ${getSizeStyles(size)} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children || normalizedLevel}
    </span>
  );
};
