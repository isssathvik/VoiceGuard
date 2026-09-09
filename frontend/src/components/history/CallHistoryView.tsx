import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  Download,
  FileWarning,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  Trash2,
  RefreshCw,
  Eye
} from 'lucide-react';
import { CallRecord, RiskLevel } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CallDetailModal } from './CallDetailModal';

interface CallHistoryViewProps {
  calls: CallRecord[];
  onOpenReportWithCall: (call: CallRecord) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
  isLoading?: boolean;
}

export const CallHistoryView: React.FC<CallHistoryViewProps> = ({
  calls,
  onOpenReportWithCall,
  onShowToast,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.caller_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.phone_number.includes(searchTerm) ||
      call.call_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || call.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const handleExportCSV = () => {
    if (calls.length === 0) {
      onShowToast('No Records', 'No call history records available to export.', 'warning');
      return;
    }

    const headers = [
      'Call ID',
      'Caller Name',
      'Phone Number',
      'Risk Level',
      'Risk Score',
      'AI Synthesis Prob (%)',
      'Extortion Prob (%)',
      'Duration',
      'Timestamp',
      'Action Taken',
    ];

    const rows = filteredCalls.map((c) => [
      c.call_id,
      `"${c.caller_name}"`,
      c.phone_number,
      c.risk_level,
      c.risk_score,
      c.synthetic_prob,
      c.scam_prob,
      c.duration,
      `"${c.timestamp}"`,
      `"${c.action_taken || 'Logged'}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VoiceGuard_Call_Forensics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Forensic Log Exported', 'CSV dossier downloaded successfully.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Neural Interception Archive & Telemetry Audit Log
            </h2>
            <p className="text-xs text-slate-400">
              Immutable forensic ledger of all screened cellular and VoIP voice calls
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          leftIcon={<Download className="w-4 h-4 text-cyan-400" />}
          className="text-xs font-mono w-full sm:w-auto"
        >
          Export CSV Forensics Dossier
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90 border border-indigo-500/20 p-3 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-slate-400 ml-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by caller, phone number, or Call ID..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="SAFE">SAFE (0-20)</option>
            <option value="LOW">LOW (21-45)</option>
            <option value="MEDIUM">MEDIUM (46-70)</option>
            <option value="HIGH">HIGH (71-85)</option>
            <option value="CRITICAL">CRITICAL (86-100)</option>
          </select>
        </div>
      </div>

      {/* Full Call History Table */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Call ID & Caller</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Synthesis & Intent</th>
                <th className="py-3 px-4">Duration & Timestamp</th>
                <th className="py-3 px-4">Action Taken</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                      <span>Fetching forensic telemetry archive...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No forensic call logs match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => {
                  const isSafe = call.risk_level === 'SAFE';

                  return (
                    <tr
                      key={call.id}
                      onClick={() => setSelectedCall(call)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* ID & Caller */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
                              isSafe
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            }`}
                          >
                            {isSafe ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-white font-sans text-xs group-hover:text-cyan-300 transition-colors">
                              {call.caller_name}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {call.phone_number} · <span className="text-slate-500">{call.call_id}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Risk Level */}
                      <td className="py-3 px-4">
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

                      {/* AI Voice & Extortion */}
                      <td className="py-3 px-4 text-[11px]">
                        <div className="space-y-0.5">
                          <div>
                            <span className="text-slate-400">AI Clone: </span>
                            <span
                              className={call.synthetic_prob > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}
                            >
                              {call.synthetic_prob}%
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Extortion: </span>
                            <span className={call.scam_prob > 50 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                              {call.scam_prob}%
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Duration & Timestamp */}
                      <td className="py-3 px-4 text-slate-300 text-[11px]">
                        <div>{call.timestamp}</div>
                        <div className="text-slate-500 text-[10px]">{call.duration}</div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                          {call.action_taken || 'Logged'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedCall(call)}
                            className="text-[10px] px-2 py-1"
                          >
                            Dossier
                          </Button>
                          {!isSafe && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => onOpenReportWithCall(call)}
                              leftIcon={<FileWarning className="w-3 h-3" />}
                              className="text-[10px] px-2 py-1"
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

      {/* Detailed Modal */}
      <CallDetailModal
        isOpen={!!selectedCall}
        onClose={() => setSelectedCall(null)}
        call={selectedCall}
        onOpenReportWithCall={onOpenReportWithCall}
      />
    </div>
  );
};
