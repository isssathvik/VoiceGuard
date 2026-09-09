import React, { useState } from 'react';
import {
  FileText,
  Search,
  Download,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileWarning,
  ExternalLink,
  Plus
} from 'lucide-react';
import { IncidentReport } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ReportsListViewProps {
  reports: IncidentReport[];
  onNavigateToFileNew: () => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
  isLoading?: boolean;
}

export const ReportsListView: React.FC<ReportsListViewProps> = ({
  reports,
  onNavigateToFileNew,
  onShowToast,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.report_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.caller_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.threat_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.caller_name && r.caller_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDownloadDossier = (report: IncidentReport) => {
    const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `${report.report_id}_1930_CyberDossier.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Dossier Exported', `Forensic JSON saved for ${report.report_id}`, 'success');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" /> RESOLVED
          </span>
        );
      case 'UNDER_INVESTIGATION':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Clock className="w-3 h-3 animate-spin" /> UNDER_INVESTIGATION
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <ShieldCheck className="w-3 h-3" /> SUBMITTED (QUEUED)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              National 1930 Incident Log & Transmission History
            </h2>
            <p className="text-xs text-slate-400">
              Audit trails of structured dossiers transmitted to I4C Cybercrime Reporting Portal
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateToFileNew}
          leftIcon={<Plus className="w-4 h-4" />}
          className="text-xs font-mono"
        >
          File New 1930 Dossier
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
            placeholder="Search report ID, phone number, threat type, or suspect name..."
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 font-bold">Report ID</th>
                <th className="py-3 px-4 font-bold">Suspect Phone / Caller</th>
                <th className="py-3 px-4 font-bold">Threat Vector</th>
                <th className="py-3 px-4 font-bold">Extortion Demanded</th>
                <th className="py-3 px-4 font-bold">Risk Score</th>
                <th className="py-3 px-4 font-bold">Portal Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                    <FileWarning className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    No incident reports found matching filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-cyan-400">
                      {report.report_id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-white font-bold">{report.caller_number}</div>
                      <div className="text-[11px] text-slate-400 font-sans truncate max-w-[180px]">
                        {report.caller_name || 'Unknown'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-slate-200">{report.threat_type}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-amber-400 font-bold">
                        {report.amount_demanded ? `₹${report.amount_demanded.toLocaleString()}` : 'None'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                        {report.risk_score || 94}/100
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(report.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadDossier(report)}
                        leftIcon={<Download className="w-3.5 h-3.5" />}
                        className="text-[11px]"
                      >
                        JSON Dossier
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
