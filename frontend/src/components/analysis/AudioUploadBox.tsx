import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileAudio,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Play,
  Volume2
} from 'lucide-react';
import { Button } from '../common/Button';

interface AudioUploadBoxProps {
  onAnalyzeFile: (file: File) => Promise<void>;
  onSelectSample: (sampleName: string) => void;
  isLoading?: boolean;
}

export const AudioUploadBox: React.FC<AudioUploadBoxProps> = ({
  onAnalyzeFile,
  onSelectSample,
  isLoading = false,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleFiles = [
    {
      name: 'Fake_Police_Digital_Arrest.wav',
      label: 'Digital Arrest Threat (96)',
      type: 'SCAM',
      size: '1.4 MB',
      color: 'border-rose-500/30 text-rose-300 hover:border-rose-400',
    },
    {
      name: 'Sister_Cloned_Kidnap_Ransom.mp3',
      label: 'Sister AI Clone Ransom (98)',
      type: 'SCAM',
      size: '980 KB',
      color: 'border-rose-500/30 text-rose-300 hover:border-rose-400',
    },
    {
      name: 'Dad_Genuine_Train_Arrival.wav',
      label: 'Dad Genuine GSM (03)',
      type: 'SAFE',
      size: '1.2 MB',
      color: 'border-emerald-500/30 text-emerald-300 hover:border-emerald-400',
    },
    {
      name: 'SBI_Robocall_OTP_Scare.m4a',
      label: 'SBI Urgent OTP Freeze (89)',
      type: 'SCAM',
      size: '640 KB',
      color: 'border-amber-500/30 text-amber-300 hover:border-amber-400',
    },
  ];

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFileName(file.name);
      onAnalyzeFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFileName(file.name);
      onAnalyzeFile(file);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 space-y-5 backdrop-blur-md shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-cyan-400 flex items-center justify-center">
            <FileAudio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">
              Upload Audio Stream for Acoustic & Spectral Scan
            </h3>
            <p className="text-xs text-slate-400">
              Supports .wav, .mp3, .m4a, .webm (Max 50MB) · Raw audio analyzed on-device
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
          EDGE DSP INGESTION
        </span>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleFileDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          dragOver
            ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
            : 'border-indigo-500/30 bg-slate-950/60 hover:border-indigo-400 hover:bg-slate-950/90'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,.wav,.mp3,.m4a,.webm"
          className="hidden"
          onChange={handleFileSelect}
        />

        <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-indigo-600/20">
          {isLoading ? (
            <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
          ) : (
            <UploadCloud className="w-7 h-7 text-cyan-400" />
          )}
        </div>

        <div>
          <h4 className="text-sm font-bold text-slate-200">
            {selectedFileName
              ? `Selected: ${selectedFileName}`
              : 'Drag & Drop audio recording here, or click to browse'}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            VoiceGuard will extract spectral spectrograms, pitch jitter, and prosodic formants
          </p>
        </div>

        <Button
          variant="cyber"
          size="sm"
          isLoading={isLoading}
          className="mt-2 text-xs font-mono"
        >
          {isLoading ? 'Running Multi-Signal Analysis...' : 'Select Audio File'}
        </Button>
      </div>

      {/* Pre-Loaded Benchmark Audio Samples */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> OR SELECT A PRE-LOADED BENCHMARK AUDIO SAMPLE
          </span>
          <span className="text-[11px]">Instant Deep Scan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {sampleFiles.map((sample, idx) => (
            <button
              key={idx}
              disabled={isLoading}
              onClick={() => onSelectSample(sample.name)}
              className={`p-3 rounded-xl border bg-slate-950/80 text-left transition-all hover:scale-[1.02] flex flex-col justify-between group ${sample.color}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="text-slate-400">{sample.size}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold ${
                      sample.type === 'SAFE'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {sample.type}
                  </span>
                </div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {sample.label}
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-2 group-hover:text-cyan-400">
                <Play className="w-3 h-3 fill-current" />
                <span>Run Test Sample</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
