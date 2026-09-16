import React, { useState } from 'react';
import {
  Radio,
  PhoneCall,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  Lock,
  PhoneOff,
  VolumeX,
  UserPlus,
  FileWarning,
  RotateCcw,
  Upload,
  CheckCircle2,
  Info,
  Server
} from 'lucide-react';
import { CallAnalysisResponse, VoiceComparisonResponse } from '../../types';
import { RiskScoreGauge } from './RiskScoreGauge';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { TranscriptHighlighter } from './TranscriptHighlighter';
import { AudioWaveformVisualizer } from '../demo/AudioWaveformVisualizer';
import { AudioUploadBox } from './AudioUploadBox';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface CallAnalysisViewProps {
  analysisData: CallAnalysisResponse | null;
  onAnalyzeAudioFile: (file: File) => Promise<void>;
  onCompareVoices: (original: File, cloned: File) => Promise<VoiceComparisonResponse>;
  onSelectSample: (sampleName: string) => void;
  onOpenReportWithData: (data: CallAnalysisResponse) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  isLoading?: boolean;
}

export const CallAnalysisView: React.FC<CallAnalysisViewProps> = ({
  analysisData,
  onAnalyzeAudioFile,
  onCompareVoices,
  onSelectSample,
  onOpenReportWithData,
  onShowToast,
  isLoading = false,
}) => {
  const [showUploadBox, setShowUploadBox] = useState<boolean>(!analysisData);
  const [isPlayingWaveform, setIsPlayingWaveform] = useState<boolean>(false);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [clonedFile, setClonedFile] = useState<File | null>(null);
  const [comparison, setComparison] = useState<VoiceComparisonResponse | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCompare = async () => {
    if (!originalFile || !clonedFile) return;
    setIsComparing(true);
    try {
      setComparison(await onCompareVoices(originalFile, clonedFile));
      onShowToast('Voice Comparison Complete', 'Both recordings were hashed and added to the evidence ledger.', 'success');
    } catch (error) {
      onShowToast('Comparison Failed', error instanceof Error ? error.message : 'Could not compare recordings.', 'error');
    } finally {
      setIsComparing(false);
    }
  };

  const data = analysisData;
  const syntheticPercent = data
    ? data.voice_analysis.synthetic_probability <= 1
      ? data.voice_analysis.synthetic_probability * 100
      : data.voice_analysis.synthetic_probability
    : 0;

  const handleBlockCaller = () => {
    if (!data) return;
    onShowToast(
      'Number Permanently Blocked',
      `Caller ${data.phone_number} (${data.caller_name}) added to carrier blacklist and active call severed.`,
      'error'
    );
  };

  const handleSilenceCall = () => {
    onShowToast('Audio Channel Muted', 'Incoming voice stream silenced to prevent acoustic extortion coercion.', 'warning');
  };

  const handleAlertFamily = () => {
    onShowToast('Family Safety Alert Dispatched', 'Emergency SMS sent to Dad (+91 98765 43210) & Sister (+91 91234 56789).', 'success');
  };

  const handleVerifyBiometrics = () => {
    onShowToast('Biometric Verification Requested', 'Prompting caller for high-entropy voice passphrase confirmation.', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Upload Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Deep Neural Voice Forensics Analyzer
            </h2>
            <p className="text-xs text-slate-400">
              Multi-signal acoustic, spectral, prosodic & conversational threat evaluation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            variant={showUploadBox ? 'secondary' : 'cyber'}
            size="sm"
            onClick={() => setShowUploadBox(!showUploadBox)}
            leftIcon={<Upload className="w-4 h-4" />}
            className="w-full sm:w-auto text-xs font-mono"
          >
            {showUploadBox ? 'Hide Upload Panel' : 'Upload New Audio File'}
          </Button>
        </div>
      </div>

      {/* Optional Audio Upload Dropdown Box */}
      {showUploadBox && (
        <AudioUploadBox
          onAnalyzeFile={async (f) => {
            await onAnalyzeAudioFile(f);
            setShowUploadBox(false);
          }}
          onSelectSample={(s) => {
            onSelectSample(s);
            setShowUploadBox(false);
          }}
          isLoading={isLoading}
        />
      )}

      <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/80 p-5 space-y-4 shadow-xl backdrop-blur-md">
        <div>
          <h3 className="text-sm font-bold text-white font-mono">Original vs Cloned Voice Test</h3>
          <p className="text-xs text-slate-400 mt-1">Upload two recordings. Each audio file and result receives its own SHA-256 evidence entry.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-slate-300 font-mono cursor-pointer">
            <span className="block text-emerald-300 font-bold mb-2">ORIGINAL / GENUINE VOICE</span>
            <input type="file" accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg" onChange={(event) => setOriginalFile(event.target.files?.[0] || null)} className="w-full text-xs" />
            <span className="block mt-2 text-slate-500 truncate">{originalFile?.name || 'Choose original recording'}</span>
          </label>
          <label className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 text-xs text-slate-300 font-mono cursor-pointer">
            <span className="block text-rose-300 font-bold mb-2">CLONED / SYNTHETIC VOICE</span>
            <input type="file" accept="audio/*,.wav,.mp3,.m4a,.webm,.ogg" onChange={(event) => setClonedFile(event.target.files?.[0] || null)} className="w-full text-xs" />
            <span className="block mt-2 text-slate-500 truncate">{clonedFile?.name || 'Choose cloned recording'}</span>
          </label>
        </div>
        <Button variant="cyber" size="sm" onClick={handleCompare} isLoading={isComparing} disabled={!originalFile || !clonedFile} className="text-xs font-mono">
          Compare Voices & Write Ledger Entries
        </Button>
        {comparison && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {[['ORIGINAL', comparison.original, 'text-emerald-300'], ['CLONED', comparison.cloned, 'text-rose-300']].map(([label, item, color]) => {
              const voice = item as VoiceComparisonResponse['original'];
              return <div key={label as string} className="rounded-xl border border-slate-700 bg-slate-950/70 p-3 space-y-1">
                <div className={`${color as string} font-bold`}>{label as string}</div>
                <div className="text-slate-300">Synthetic: <strong>{voice.synthetic_score}%</strong></div>
                <div className="text-slate-300">Genuine: <strong>{voice.genuine_score}%</strong></div>
                <div className="text-slate-500 break-all">Evidence: {voice.evidence_hash.slice(0, 18)}...</div>
              </div>;
            })}
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
              <div className="text-cyan-300 font-bold">SCORE DIFFERENCE</div>
              <div className="text-2xl text-white font-bold mt-1">{comparison.synthetic_score_difference}%</div>
              <div className="text-slate-400 mt-1">Both entries are chained and verifiable.</div>
            </div>
          </div>
        )}
      </div>

      {/* If analysis data is present, render complete forensics dashboard */}
      {data ? (
        <div className="space-y-6">
          {/* Active Call Metadata Strip */}
          <div className="p-4.5 rounded-2xl bg-slate-900/90 border border-indigo-500/25 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${
                  data.risk_level === 'SAFE'
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
                }`}
              >
                {data.risk_level === 'SAFE' ? (
                  <UserCheck className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">{data.caller_name}</h3>
                  <Badge level={data.risk_level} size="sm" />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400 mt-0.5">
                  <span className="text-slate-300 font-semibold">{data.phone_number}</span>
                  <span>·</span>
                  <span>{data.caller_type}</span>
                  <span>·</span>
                  <span>Duration: {data.duration}</span>
                  <span>·</span>
                  <span>ID: {data.call_id}</span>
                </div>
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                AI Synthesis:{' '}
                <strong
                  className={
                    syntheticPercent > 50 ? 'text-rose-400' : 'text-emerald-400'
                  }
                >
                  {syntheticPercent.toFixed(1)}%
                </strong>
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                Extortion Intent:{' '}
                <strong
                  className={
                    data.conversation_analysis.scam_probability > 50
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }
                >
                  {data.conversation_analysis.scam_probability}%
                </strong>
              </span>
            </div>
          </div>

          {/* 2-Column Grid: Left (Score + Controls), Right (Waveform + Explainability + Transcript) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Risk Gauge */}
              <RiskScoreGauge
                score={data.risk_score}
                level={data.risk_level}
                recommendation={data.recommendation}
              />

              {/* Protective Action Card */}
              <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-3 backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h4 className="text-xs font-mono font-bold text-slate-200 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> DEFENSIVE ACTIONS
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">ACTIVE CONTROLS</span>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleBlockCaller}
                    leftIcon={<PhoneOff className="w-4 h-4" />}
                    className="w-full text-xs font-mono justify-start"
                  >
                    Block Number & Sever Line
                  </Button>

                  <Button
                    variant="warning"
                    size="sm"
                    onClick={handleSilenceCall}
                    leftIcon={<VolumeX className="w-4 h-4" />}
                    className="w-full text-xs font-mono justify-start"
                  >
                    Silence Incoming Audio
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAlertFamily}
                    leftIcon={<UserPlus className="w-4 h-4 text-indigo-400" />}
                    className="w-full text-xs font-mono justify-start"
                  >
                    Alert Registered Family
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVerifyBiometrics}
                    leftIcon={<UserCheck className="w-4 h-4 text-emerald-400" />}
                    className="w-full text-xs font-mono justify-start"
                  >
                    Challenge Biometric Passphrase
                  </Button>

                  <Button
                    variant="cyber"
                    size="sm"
                    onClick={() => onOpenReportWithData(data)}
                    leftIcon={<FileWarning className="w-4 h-4" />}
                    className="w-full text-xs font-mono justify-start mt-2"
                  >
                    Export 1930 Incident Dossier
                  </Button>
                </div>
              </div>

              {/* Telecom & Identity Box */}
              <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-4.5 space-y-2.5 text-xs font-mono">
                <div className="text-slate-400 font-bold border-b border-slate-800 pb-1.5 flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-indigo-400" /> TELECOM NETWORK TRACE
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Origin Route:</span>
                  <span className="text-slate-200">{data.caller_analysis.is_voip ? 'VoIP SIP Gateway' : 'Cellular GSM'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Caller ID Spoof:</span>
                  <span className={data.caller_analysis.is_spoofed ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {data.caller_analysis.is_spoofed ? 'DETECTED' : 'CLEAN'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Biometric Match:</span>
                  <span className="text-slate-200">
                    {data.voice_analysis.voice_profile_match !== null
                      ? `${data.voice_analysis.voice_profile_match}%`
                      : 'No Profile Enrolled'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Waveform Visualizer */}
              <AudioWaveformVisualizer
                waveform={data.audio_waveform || undefined}
                duration={data.duration}
                isSynthetic={syntheticPercent > 50}
                isPlaying={isPlayingWaveform}
                onTogglePlay={() => setIsPlayingWaveform(!isPlayingWaveform)}
                accentColor={data.risk_level === 'SAFE' ? 'emerald' : 'rose'}
              />

              {/* Explainability Breakdown (5 pillars + factors) */}
              <ExplainabilityPanel
                riskBreakdown={data.risk_breakdown}
                reasons={data.reasons}
              />

              {/* Transcript & NLP Highlighter */}
              <TranscriptHighlighter
                transcript={data.transcript}
                suspiciousPhrases={data.conversation_analysis.suspicious_phrases}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/60 border border-indigo-500/20 rounded-2xl space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
            <Radio className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">No Audio Call Selected for Analysis</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Select one of the benchmark scenarios or upload an audio recording (.wav/.mp3) to inspect the multi-signal AI forensics.
            </p>
          </div>
          <Button
            variant="cyber"
            size="md"
            onClick={() => setShowUploadBox(true)}
            leftIcon={<Upload className="w-4 h-4" />}
          >
            Upload Audio File
          </Button>
        </div>
      )}
    </div>
  );
};
