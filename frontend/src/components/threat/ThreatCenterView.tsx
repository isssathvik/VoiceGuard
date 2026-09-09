import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Radio,
  FileWarning,
  ExternalLink,
  Shield,
  Search,
  Filter,
  CheckCircle,
  Globe,
  Bell
} from 'lucide-react';
import { ThreatIntel } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface ThreatCenterViewProps {
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
}

export const ThreatCenterView: React.FC<ThreatCenterViewProps> = ({ onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const threats: ThreatIntel[] = [
    {
      id: 1,
      threat_name: 'CBI & Supreme Court "Digital Arrest" Coercion Wave',
      category: 'Digital Arrest / Authority Impersonation',
      severity: 'CRITICAL',
      affected_regions: ['Delhi NCR', 'Bengaluru', 'Mumbai', 'Hyderabad', 'Pune'],
      reported_cases: 1420,
      description:
        'Scammers impersonate police/CBI officers over Skype/WhatsApp/Cellular, claiming victims Aadhaar/SIM is linked to money laundering. Victims are forced into continuous video isolation under threat of immediate physical arrest.',
      acoustic_signatures: ['SIP VoIP Trunks', 'Background police wireless audio effects', 'Synthetic Hindi speech model'],
      defense_guidelines: [
        'No law enforcement agency in India has the legal concept of "Digital Arrest" under the Bharatiya Nagarik Suraksha Sanhita (BNSS).',
        'Sever call immediately and report to National Cyber Helpline 1930.',
        'VoiceGuard automatically classifies authority coercion keywords and alerts family members.',
      ],
      last_updated: '10 mins ago',
    },
    {
      id: 2,
      threat_name: 'AI-Cloned Family Member Kidnapping & Emergency Ransom',
      category: 'AI Voice Cloning / Emotional Extortion',
      severity: 'CRITICAL',
      affected_regions: ['National (Urban Centers)', 'Tier 1 & Tier 2 Cities'],
      reported_cases: 680,
      description:
        'Attackers scrape 3-5 seconds of audio from social media (Instagram reels, YouTube) to train real-time voice clones of children or siblings. They call parents claiming the relative is hospitalized or detained, demanding urgent UPI transfer within 15 minutes.',
      acoustic_signatures: [
        'ElevenLabs Multilingual v2 phase artifacts',
        'Flatline prosody pitch jitter < 0.02',
        'Synthetic crying noise overlay',
      ],
      defense_guidelines: [
        'Ask the caller for your pre-enrolled family security passphrase (e.g. "What is our pet name?").',
        'Call the family member back directly on their verified personal GSM cellular number.',
        'Rely on VoiceGuard biometric vector comparison to flag low similarity (< 85%).',
      ],
      last_updated: '2 hours ago',
    },
    {
      id: 3,
      threat_name: 'State Bank of India (SBI) YONO Account Freeze Scare',
      category: 'Financial / Credential Harvesting',
      severity: 'HIGH',
      affected_regions: ['All India (Pan-India)'],
      reported_cases: 3100,
      description:
        'Automated IVR robocall spoofing official SBI/HDFC sender IDs, claiming bank account or debit card will be frozen within 2 hours due to un-updated KYC. Prompts user to key in 6-digit OTP.',
      acoustic_signatures: ['Pre-recorded IVR synthesizer', 'Caller ID Spoofing (PRI line injection)'],
      defense_guidelines: [
        'Banks never ask for OTP, CVV, or NetBanking passwords over automated calls.',
        'Check official bank branch directly.',
        'VoiceGuard detects OTP harvesting phrases and terminates call.',
      ],
      last_updated: '5 hours ago',
    },
    {
      id: 4,
      threat_name: 'FedEx / DHL Customs Contraband Parcel Scam',
      category: 'Customs & Narcotics Impersonation',
      severity: 'HIGH',
      affected_regions: ['Chennai', 'Kolkata', 'Ahmedabad', 'Jaipur'],
      reported_cases: 890,
      description:
        'Callers claim a courier parcel addressed to the victim containing fake passports, narcotics, or MDMA was seized by Mumbai Customs. Threatens Narcotics Control Bureau (NCB) warrant unless clearance fee is wired.',
      acoustic_signatures: ['VoIP Softphone PBX', 'Scripted legal threat templates'],
      defense_guidelines: [
        'Customs departments never demand online UPI settlement over phone calls.',
        'Do not transfer money into any "safe verification account".',
      ],
      last_updated: '1 day ago',
    },
  ];

  const filteredThreats = threats.filter(
    (t) =>
      t.threat_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              National Threat Intelligence & Cyber Cell Advisories
            </h2>
            <p className="text-xs text-slate-400">
              Real-time threat feeds synced with 1930 Cyber Helpline & Indian Cybercrime Coordination Centre (I4C)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
          </span>
          <span className="text-xs font-mono font-bold text-rose-400">4 ACTIVE CAMPAIGNS</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/20 p-3 rounded-2xl backdrop-blur-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search threat advisories, keywords, scam vectors, or acoustic signatures..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
        />
      </div>

      {/* Threat Advisories Cards */}
      <div className="space-y-5">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 space-y-4 backdrop-blur-md shadow-xl hover:border-indigo-500/40 transition-all"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-white font-mono tracking-tight">
                    {threat.threat_name}
                  </h3>
                  <Badge level={threat.severity} size="sm" />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="text-cyan-400">{threat.category}</span>
                  <span>·</span>
                  <span>Reported: {threat.reported_cases.toLocaleString()} cases</span>
                  <span>·</span>
                  <span>Updated {threat.last_updated}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  SEVERITY: {threat.severity}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {threat.description}
            </p>

            {/* Regions & Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[11px] font-bold block">
                  AFFECTED REGIONS / HOTSPOTS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {threat.affected_regions.map((region, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="text-slate-400 text-[11px] font-bold block">
                  ACOUSTIC & DSP SIGNATURES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {threat.acoustic_signatures.map((sig, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 text-[11px]"
                    >
                      {sig}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Defense Guidelines */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/20 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> RECOMMENDED DEFENSIVE ACTIONS FOR CITIZENS
              </div>
              <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside font-sans leading-relaxed">
                {threat.defense_guidelines.map((guide, idx) => (
                  <li key={idx}>{guide}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
