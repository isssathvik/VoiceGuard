import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'outline' | 'ghost' | 'cyber';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-400 hover:to-cyan-500 text-slate-950 shadow-lg shadow-sky-500/20 border border-sky-300/40 hover:shadow-sky-400/40';
      case 'cyber':
        return 'bg-gradient-to-r from-slate-700 via-sky-600 to-cyan-600 hover:from-slate-600 hover:via-sky-500 hover:to-cyan-500 text-white shadow-lg shadow-sky-500/20 border border-sky-400/30 hover:border-sky-300';
      case 'secondary':
        return 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-100 border border-slate-600/80 shadow-sm';
      case 'danger':
        return 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/25 border border-rose-400/30';
      case 'warning':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-lg shadow-amber-500/25 border border-amber-300/40';
      case 'success':
        return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 border border-emerald-300/40';
      case 'outline':
        return 'bg-transparent hover:bg-slate-800/60 text-slate-200 border border-slate-600/80 hover:border-sky-400/40';
      case 'ghost':
        return 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-slate-100 border border-transparent';
      default:
        return 'bg-sky-500 text-slate-950';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-lg font-medium';
      case 'lg':
        return 'px-6 py-3 text-base rounded-xl font-semibold';
      case 'md':
      default:
        return 'px-4 py-2 text-sm rounded-lg font-medium';
    }
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-sans transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
