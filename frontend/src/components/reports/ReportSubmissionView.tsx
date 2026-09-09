import React, { useState, useEffect } from 'react';
import {
  FileWarning,
  Send,
  ShieldAlert,
  Paperclip,
  CheckCircle2,
  DollarSign,
  Phone,
  User,
  AlertTriangle,
  FileText
} from 'lucide-react';
import { IncidentReport, CallAnalysisResponse, CallRecord } from '../../types';
import { Button } from '../common/Button';
import { ReportSuccessModal } from './ReportSuccessModal';

interface ReportSubmissionViewProps {
  initialData?: CallAnalysisResponse | CallRecord | null;
  onSubmitReport: (report: Partial<IncidentReport>) => Promise<IncidentReport>;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
  isLoading?: boolean;
}

export const ReportSubmissionView: React.FC<ReportSubmissionViewProps> = ({
  initialData,
  onSubmitReport,
  onShowToast,
  isLoading = false,
}) => {
  const [callerNumber, setCallerNumber] = useState('');
  const [callerName, setCallerName] = useState('');
  const [threatType, setThreatType] = useState('Digital Arrest / Authority Impersonation');
  const [amountDemanded, setAmountDemanded] = useState('');
  const [upiDemanded, setUpiDemanded] = useState('');
  const [description, setDescription] = useState('');
  const [includeEvidence, setIncludeEvidence] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<IncidentReport | null>(null);

  // Pre-fill fields if launched with initialData
  useEffect(() => {
    if (initialData) {
      const phone = 'phone_number' in initialData ? initialData.phone_number : '';
      const name = 'caller_name' in initialData ? initialData.caller_name : '';
      setCallerNumber(phone);
      setCallerName(name);

      if ('transcript' in initialData && initialData.transcript) {
        setDescription(
          `Voice call received from ${phone} (${name}). AI Engine flagged critical threat vectors. Transcript: "${initialData.transcript}"`
        );
      }
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!callerNumber) {
      onShowToast('Missing Phone Number', 'Please provide suspect phone number.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Partial<IncidentReport> = {
        caller_number: callerNumber,
        caller_name: callerName || 'Unknown Extortionist',
        threat_type: threatType,
        amount_demanded: amountDemanded ? Number(amountDemanded) : 0,
        demanded_upi_or_account: upiDemanded,
        description: description || 'Extortion and intimidation threat attempted over voice call.',
        transcript: initialData && 'transcript' in initialData ? initialData.transcript || '' : '',
        risk_score: initialData && 'risk_score' in initialData ? initialData.risk_score : 92,
        status: 'SUBMITTED',
      };

      const result = await onSubmitReport(payload);
      setSubmittedReport(result);
      onShowToast('Report Submitted', `Incident logged under ID ${result.report_id}`, 'success');
    } catch (err) {
      onShowToast('Submission Failed', 'Error transmitting report to 1930 portal.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <FileWarning className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              National Cyber Crime Reporting Portal (1930) Dossier Filing
            </h2>
            <p className="text-xs text-slate-400">
              Submit structured forensic evidence directly to Indian Cybercrime Coordination Centre (I4C)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
          FORM 1930-A (VOICE EXTORTION)
        </span>
      </div>

      {/* Main Submission Form */}
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5 font-mono text-xs">
          {/* Row 1: Suspect Number & Stated Identity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Suspect Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={callerNumber}
                onChange={(e) => setCallerNumber(e.target.value)}
                placeholder="+91 91234 56789 or +44 VoIP trunk"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Caller Stated Identity / Impersonated Entity
              </label>
              <input
                type="text"
                value={callerName}
                onChange={(e) => setCallerName(e.target.value)}
                placeholder="e.g. Inspector Vikram Rathore / CBI Crime Branch / SBI Official"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-sans"
              />
            </div>
          </div>

          {/* Row 2: Threat Category & Extortion Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Classified Scam / Threat Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={threatType}
                onChange={(e) => setThreatType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-cyan-400 text-xs"
              >
                <option value="Digital Arrest / Authority Impersonation">
                  Fake Police / CBI "Digital Arrest" Coercion
                </option>
                <option value="AI Voice Clone / Family Ransom">
                  AI Deepfake Voice Clone / Family Kidnap Ransom
                </option>
                <option value="Bank Account Freeze / Urgent OTP">
                  Bank / KYC Freeze Threat & OTP Demands
                </option>
                <option value="Customs Parcel / Narcotics Extortion">
                  Customs / FedEx Contraband Parcel Blackmail
                </option>
                <option value="Part-Time Job / Telegram Investment">
                  Part-Time Telegram Task & Prepaid Investment
                </option>
                <option value="Electricity Bill Disconnection">
                  Electricity Bill Power Cut Threat
                </option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">
                Demanded Extortion Amount (₹ INR)
              </label>
              <input
                type="number"
                value={amountDemanded}
                onChange={(e) => setAmountDemanded(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>
          </div>

          {/* Row 3: Demanded Payment Destination */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Demanded UPI ID / Mule Bank Account (if provided by scammer)
            </label>
            <input
              type="text"
              value={upiDemanded}
              onChange={(e) => setUpiDemanded(e.target.value)}
              placeholder="e.g. cbi.clearance.verify@okhdfcbank or 501004928392 (HDFC)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {/* Row 4: Narrative Description */}
          <div>
            <label className="block text-slate-300 font-bold mb-1">
              Incident Narrative & Coercion Sequence
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the scammer stated, how they attempted coercion, duration of the call, and whether any money was transferred..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs font-sans leading-relaxed"
            />
          </div>

          {/* Evidence Attachment Option */}
          <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-cyan-400 flex items-center justify-center">
                <Paperclip className="w-4 h-4" />
              </div>
              <div>
                <div className="text-slate-200 font-bold">
                  Attach AI Forensics & Spectral Telemetry
                </div>
                <div className="text-[11px] text-slate-400 font-sans">
                  Includes voice risk score (94/100), phase artifact metrics, and timestamped transcript in official payload.
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={includeEvidence}
              onChange={(e) => setIncludeEvidence(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button
              type="submit"
              variant="danger"
              size="md"
              isLoading={isSubmitting || isLoading}
              leftIcon={<Send className="w-4 h-4" />}
              className="text-xs font-mono px-6 shadow-lg shadow-rose-600/20"
            >
              Transmit Incident Dossier to 1930 Portal
            </Button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      <ReportSuccessModal
        isOpen={!!submittedReport}
        onClose={() => setSubmittedReport(null)}
        report={submittedReport}
        onShowToast={onShowToast}
      />
    </div>
  );
};
