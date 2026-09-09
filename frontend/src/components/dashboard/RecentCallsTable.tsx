import React from 'react';
import {
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Search,
  ArrowRight,
  User,
  Clock,
  ExternalLink,
  Filter,
  FileWarning
} from 'lucide-react';
import { CallRecord, CallAnalysisResponse } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface RecentCallsTableProps {
  calls: CallRecord[];
  onSelectCall: (call: CallRecord) => void;
  onOpenAnalysisWithData?: (data: CallAnalysisResponse) => void;
  onOpenReportWithCall?: (call: CallRecord) => void;
  onViewAll?: () => void;
  isLoading?: boolean;
}

export const RecentCallsTable: React.FC<RecentCallsTableProps> = ({
  calls,
  onSelectCall,
  onOpenReportWithCall,
  onViewAll,
  isLoading = false,
}) => {
  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl flex flex-col">
      {/* Table Header */}
      <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> Recent Call Interceptions & Telemetry
          </h3>
          <p className="text-xs text-slate-400">
            Real-time forensic logs processed by VoiceGuard neural pipeline
          </p>
        </div>

        {onViewAll && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAll}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            View Full Call Archive
          </Button>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider text-[10px]">
            <tr>
              <th className="py-3 px-4">Caller Identity</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Threat Vectors</th>
              <th className="py-3 px-4">Action Taken</th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4 text-right">Forensic Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    <span>Loading call telemetry records...</span>
                  </div>
                </td>
              </tr>
            ) : calls.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No call records captured yet. Run a live demo or upload audio to generate forensic logs.
                </td>
              </tr>
            ) : (
              calls.slice(0, 5).map((call) => {
                const isSafe = call.risk_level === 'SAFE';

                return (
                  <tr
                    key={call.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectCall(call)}
                  >
                    {/* Caller Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
                            isSafe
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {isSafe ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <ShieldAlert className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-white font-sans text-xs group-hover:text-cyan-300 transition-colors">
                            {call.caller_name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {call.phone_number} · {call.duration}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Risk Level & Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <Badge level={call.risk_level} size="sm" />
                        <span
                          className={`font-bold ${
                            call.risk_score > 70
                              ? 'text-rose-400'
                              : call.risk_score > 40
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {call.risk_score}/100
                        </span>
                      </div>
                    </td>

                    {/* Threat Vectors */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        {(call.synthetic_prob ?? 0) > 50 ? (
                          <div className="text-rose-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            AI Voice Clone ({call.synthetic_prob}%)
                          </div>
                        ) : null}
                        {(call.scam_prob ?? 0) > 50 ? (
                          <div className="text-amber-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Extortion Demand ({call.scam_prob}%)
                          </div>
                        ) : null}
                        {(call.synthetic_prob ?? 0) <= 50 && (call.scam_prob ?? 0) <= 50 && (
                          <div className="text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Genuine GSM Stream
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action Taken */}
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                        {call.action_taken || 'Logged & Monitored'}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {call.timestamp}
                    </td>

                    {/* Forensic Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onSelectCall(call)}
                          className="text-[10px] px-2 py-1 font-mono"
                        >
                          Inspect
                        </Button>
                        {!isSafe && onOpenReportWithCall && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onOpenReportWithCall(call)}
                            className="text-[10px] px-2 py-1 font-mono"
                            leftIcon={<FileWarning className="w-3 h-3" />}
                          >
                            1930
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
