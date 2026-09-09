import React from 'react';
import {
  CheckCircle2,
  FileWarning,
  Download,
  Copy,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';
import { IncidentReport } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ReportSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: IncidentReport | null;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  isOpen,
  onClose,
  report,
  onShowToast,
}) => {
  if (!report) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(report.report_id);
    onShowToast('Copied', `Incident ID ${report.report_id} copied to clipboard.`, 'success');
  };

  const handleDownloadDossier = () => {
    const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', jsonContent);
    link.setAttribute('download', `${report.report_id}_Cyber_Dossier.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onShowToast('Dossier Downloaded', `Digital dossier saved for ${report.report_id}`, 'success');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Incident Report Filed with Cyber Cell" size="md">
      <div className="text-center space-y-4 font-mono">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Incident Transmitted to 1930 Cyber Cell
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            A forensic evidence dossier containing spectral timestamps, risk attribution, and transcript has been logged with the National Cyber Crime Reporting Portal.
          </p>
        </div>

        {/* Unique Tracking ID Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block uppercase">NATIONAL INCIDENT TRACKING ID</span>
            <span className="text-base font-bold text-cyan-400 tracking-wider">
              {report.report_id}
            </span>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyId}
            leftIcon={<Copy className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Copy
          </Button>
        </div>

        {/* Quick Details */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-left space-y-1.5 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-400">Suspect Phone:</span>
            <span className="text-slate-200">{report.caller_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Scam Type:</span>
            <span className="text-rose-400 font-bold">{report.threat_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Risk Score Attached:</span>
            <span className="text-slate-200">{report.risk_score || 94}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Status:</span>
            <span className="text-emerald-400 font-bold">SUBMITTED (IN_QUEUE)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Button
            variant="cyber"
            size="sm"
            onClick={handleDownloadDossier}
            leftIcon={<Download className="w-4 h-4" />}
            className="w-full justify-center text-xs"
          >
            Download Official 1930 JSON Dossier
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-full sm:w-auto text-xs"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
