import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Bell,
  Radio,
  Key,
  Users,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  PhoneCall,
  Lock
} from 'lucide-react';
import { Button } from '../common/Button';

interface SettingsViewProps {
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onShowToast }) => {
  // Defensive Thresholds
  const [riskThreshold, setRiskThreshold] = useState<number>(75);
  const [autoSeverCall, setAutoSeverCall] = useState<boolean>(true);
  const [autoNotifyGuardians, setAutoNotifyGuardians] = useState<boolean>(true);
  const [autoFileDossier, setAutoFileDossier] = useState<boolean>(true);
  const [inCallAudioWarning, setInCallAudioWarning] = useState<boolean>(true);

  // Pillar Weights
  const [weightAcoustic, setWeightAcoustic] = useState<number>(35);
  const [weightIntent, setWeightIntent] = useState<number>(25);
  const [weightFinancial, setWeightFinancial] = useState<number>(20);
  const [weightBiometric, setWeightBiometric] = useState<number>(12);
  const [weightTelecom, setWeightTelecom] = useState<number>(8);

  // Guardian Phone Contacts
  const [guardianPhones, setGuardianPhones] = useState<string>('+91 98765 43210, +91 91234 56780');
  const [carrierGateway, setCarrierGateway] = useState<string>('Jio-IMS-SIP-Trunk-v4');
  const [apiKey, setApiKey] = useState<string>('vg_live_9f83a2bc7190e8d38402');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onShowToast('Settings Saved', 'Detection thresholds & carrier rules updated successfully.', 'success');
  };

  const handleReset = () => {
    setRiskThreshold(75);
    setAutoSeverCall(true);
    setAutoNotifyGuardians(true);
    setAutoFileDossier(true);
    setInCallAudioWarning(true);
    setWeightAcoustic(35);
    setWeightIntent(25);
    setWeightFinancial(20);
    setWeightBiometric(12);
    setWeightTelecom(8);
    setCarrierGateway('Jio-IMS-SIP-Trunk-v4');
    onShowToast('Reset to Defaults', 'Calibrated baseline rules restored.', 'info');
  };

  const totalWeight = weightAcoustic + weightIntent + weightFinancial + weightBiometric + weightTelecom;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Neural Engine Calibration & Defense Policies
            </h2>
            <p className="text-xs text-slate-400">
              Fine-tune XAI multi-signal risk weights, carrier gateways, and autonomous line severing triggers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            className="text-xs font-mono"
          >
            Reset Defaults
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="w-3.5 h-3.5" />}
            className="text-xs font-mono"
          >
            Save Calibration
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Autonomous Defense Actions */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Autonomous Defense & Interception Actions
            </h3>
          </div>

          <div className="space-y-4">
            {/* Risk Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300 font-bold">
                  Critical Intervention Threshold Score:
                </span>
                <span className="text-cyan-400 font-bold text-sm">{riskThreshold} / 100</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                <span>Aggressive (50 - High sensitivity)</span>
                <span>Balanced Security Standard (75)</span>
                <span>Conservative (95 - Ultra strict)</span>
              </div>
            </div>

            {/* Toggle Toggles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <label className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-bold">Autonomous Call Severing</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Instantly terminate carrier connection when score exceeds threshold.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoSeverCall}
                  onChange={(e) => setAutoSeverCall(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-bold">Emergency Guardian SOS Broadcast</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Send SMS & WhatsApp telemetry alerts to designated family members.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoNotifyGuardians}
                  onChange={(e) => setAutoNotifyGuardians(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-bold">Auto-Draft 1930 Cyber Dossier</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Format forensic snapshot for National Cybercrime Portal submission.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={autoFileDossier}
                  onChange={(e) => setAutoFileDossier(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>

              <label className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700">
                <div className="space-y-0.5">
                  <div className="text-slate-200 font-bold">In-Ear Acoustic Warning Beep</div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    Inject 880Hz alert tone into earphone when coercion keywords trigger.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={inCallAudioWarning}
                  onChange={(e) => setInCallAudioWarning(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: 5-Pillar XAI Multi-Signal Weighting */}
        <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                5-Pillar Multi-Signal XAI Weight Formulation
              </h3>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                totalWeight === 100
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              Total Weight: {totalWeight}% {totalWeight === 100 ? '(Calibrated 1.0)' : '(Must equal 100%)'}
            </span>
          </div>

          <div className="space-y-3">
            {/* Pillar 1: Acoustic */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-200 font-bold">
                  1. AI Voice Clone & Synthetic DSP Artifacts
                </span>
                <span className="text-cyan-400 font-bold">{weightAcoustic}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={weightAcoustic}
                onChange={(e) => setWeightAcoustic(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 font-sans block">
                RawNet2 phase jitter, pitch flatline (&lt;0.02), high-frequency spectral discontinuity.
              </span>
            </div>

            {/* Pillar 2: Intent */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-200 font-bold">
                  2. Coercion & Authority Impersonation (NLP)
                </span>
                <span className="text-cyan-400 font-bold">{weightIntent}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={weightIntent}
                onChange={(e) => setWeightIntent(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 font-sans block">
                Digital Arrest phrases, fake CBI/police legal threats, isolation commands.
              </span>
            </div>

            {/* Pillar 3: Financial */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-200 font-bold">
                  3. Financial Demands & Urgency Pressure
                </span>
                <span className="text-cyan-400 font-bold">{weightFinancial}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={weightFinancial}
                onChange={(e) => setWeightFinancial(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 font-sans block">
                Urgent OTP requests, bank freeze ultimatums, demanded UPI/RTGS money transfers.
              </span>
            </div>

            {/* Pillar 4: Biometric */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-200 font-bold">
                  4. Caller Trust & 512-d Biometric Verification
                </span>
                <span className="text-cyan-400 font-bold">{weightBiometric}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={weightBiometric}
                onChange={(e) => setWeightBiometric(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 font-sans block">
                ECAPA-TDNN embedding similarity comparison against pre-enrolled family voice samples.
              </span>
            </div>

            {/* Pillar 5: Telecom */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-200 font-bold">
                  5. Telecom SIP Gateway & Network Heuristics
                </span>
                <span className="text-cyan-400 font-bold">{weightTelecom}%</span>
              </div>
              <input
                type="range"
                min="2"
                max="25"
                value={weightTelecom}
                onChange={(e) => setWeightTelecom(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-400 font-sans block">
                Virtual VoIP trunk detection, international spoofing proxy headers, PRI injections.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Integrations & Gateway */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          {/* Guardian SMS Numbers */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Emergency Guardian Contacts
              </h3>
            </div>
            <label className="block text-slate-300">
              Designated Emergency Phone Numbers (Comma-separated)
            </label>
            <input
              type="text"
              value={guardianPhones}
              onChange={(e) => setGuardianPhones(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
            <p className="text-[11px] text-slate-400 font-sans">
              SOS telemetry packets and GPS cell-tower coordinates will be dispatched to these numbers during critical extortion calls.
            </p>
          </div>

          {/* Carrier Gateway Routing */}
          <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 backdrop-blur-md shadow-xl space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Carrier SIP Trunk Gateway
              </h3>
            </div>
            <label className="block text-slate-300">
              Active Telecom Carrier Interface
            </label>
            <select
              value={carrierGateway}
              onChange={(e) => setCarrierGateway(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
            >
              <option value="Jio-IMS-SIP-Trunk-v4">Reliance Jio Infocomm IMS SIP Gateway</option>
              <option value="Airtel-VoLTE-Core-Direct">Bharti Airtel VoLTE Core Trunk</option>
              <option value="Vi-Cellular-MSC-Bridge">Vodafone Idea MSC Intercept Bridge</option>
              <option value="BSNL-PRI-National-Gateway">BSNL National Telecom Trunk</option>
            </select>
            <p className="text-[11px] text-slate-400 font-sans">
              Connects directly to carrier SS7 / Diameter network signalling for sub-second line termination.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
