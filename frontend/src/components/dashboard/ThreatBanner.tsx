import React from 'react';
import { ShieldAlert, AlertTriangle, ArrowRight, Radio, ExternalLink } from 'lucide-react';
import { Button } from '../common/Button';

interface ThreatBannerProps {
  onNavigateToThreatCenter?: () => void;
  threatTitle?: string;
  threatDetails?: string;
  threatLevel?: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

export const ThreatBanner: React.FC<ThreatBannerProps> = ({
  onNavigateToThreatCenter,
  threatTitle = 'CRITICAL ADVISORY: Coordinated "Digital Arrest" Voice Cloning Wave Active in Delhi NCR & Bengaluru',
  threatDetails = 'Scammers are utilizing ElevenLabs v2 voice clone pipelines impersonating CBI & Telecom Department officers demanding immediate video isolation.',
  threatLevel = 'CRITICAL',
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-rose-950/30 border border-rose-500/30 p-4 backdrop-blur-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0 animate-pulse">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
              NATIONAL CYBER CELL ADVISORY 2026
            </span>
            <span className="text-[11px] font-mono text-slate-400">· 1930 Portal Synced</span>
          </div>
          <h4 className="text-sm font-bold text-white font-mono mt-0.5">{threatTitle}</h4>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{threatDetails}</p>
        </div>
      </div>

      {onNavigateToThreatCenter && (
        <Button
          variant="outline"
          size="sm"
          onClick={onNavigateToThreatCenter}
          rightIcon={<ArrowRight className="w-3.5 h-3.5 text-rose-400" />}
          className="shrink-0 text-xs font-mono border-rose-500/40 text-rose-300 hover:bg-rose-500/10 w-full sm:w-auto justify-center"
        >
          View Threat Center
        </Button>
      )}
    </div>
  );
};
