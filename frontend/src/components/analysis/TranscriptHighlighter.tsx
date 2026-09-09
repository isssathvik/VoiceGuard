import React from 'react';
import { FileText, AlertTriangle, ShieldAlert, Sparkles, Tag } from 'lucide-react';
import { SuspiciousPhrase } from '../../types';
import { Badge } from '../common/Badge';

interface TranscriptHighlighterProps {
  transcript?: string | null;
  suspiciousPhrases?: SuspiciousPhrase[];
}

export const TranscriptHighlighter: React.FC<TranscriptHighlighterProps> = ({
  transcript,
  suspiciousPhrases = [],
}) => {
  if (!transcript) {
    return (
      <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-6 text-center text-slate-400 space-y-2">
        <FileText className="w-8 h-8 text-slate-600 mx-auto" />
        <p className="text-xs">No speech transcript available for this audio stream.</p>
      </div>
    );
  }

  // Highlight suspicious phrases dynamically inside the transcript
  const renderHighlightedTranscript = () => {
    if (!suspiciousPhrases || suspiciousPhrases.length === 0) {
      return (
        <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-950/70 p-4 rounded-xl border border-slate-800">
          "{transcript}"
        </p>
      );
    }

    // Split and highlight phrases
    let renderedText: React.ReactNode[] = [transcript];

    suspiciousPhrases.forEach((item, phraseIdx) => {
      const nextRendered: React.ReactNode[] = [];
      const phraseLower = item.phrase.toLowerCase();

      renderedText.forEach((node, nodeIdx) => {
        if (typeof node !== 'string') {
          nextRendered.push(node);
          return;
        }

        const lowerNode = node.toLowerCase();
        let startIndex = 0;
        let foundIndex = lowerNode.indexOf(phraseLower, startIndex);

        if (foundIndex === -1) {
          nextRendered.push(node);
          return;
        }

        while (foundIndex !== -1) {
          if (foundIndex > startIndex) {
            nextRendered.push(node.substring(startIndex, foundIndex));
          }

          const matchedText = node.substring(foundIndex, foundIndex + item.phrase.length);
          const isCritical = item.severity === 'CRITICAL';

          nextRendered.push(
            <span
              key={`match-${phraseIdx}-${nodeIdx}-${foundIndex}`}
              className={`inline-block px-1.5 py-0.5 my-0.5 rounded font-semibold border-b-2 transition-all cursor-help ${
                isCritical
                  ? 'bg-rose-500/25 text-rose-200 border-rose-500 hover:bg-rose-500/40'
                  : 'bg-amber-500/25 text-amber-200 border-amber-500 hover:bg-amber-500/40'
              }`}
              title={`${item.category}: ${item.reason}`}
            >
              {matchedText}
            </span>
          );

          startIndex = foundIndex + item.phrase.length;
          foundIndex = lowerNode.indexOf(phraseLower, startIndex);
        }

        if (startIndex < node.length) {
          nextRendered.push(node.substring(startIndex));
        }
      });

      renderedText = nextRendered;
    });

    return (
      <div className="text-sm text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
        {renderedText}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-cyan-400 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono">
              Live Speech Transcript & NLP Threat Scanner
            </h3>
            <p className="text-[11px] text-slate-400">
              Autonomous keyword spotting & coercion category analysis
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          NLP INTENT ENGINE
        </span>
      </div>

      {/* Rendered Transcript */}
      {renderHighlightedTranscript()}

      {/* Flagged Suspicious Phrase List */}
      {suspiciousPhrases && suspiciousPhrases.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Flagged Threats in Speech Stream
            </span>
            <span className="text-[11px] text-slate-400">{suspiciousPhrases.length} detected</span>
          </div>

          <div className="space-y-2">
            {suspiciousPhrases.map((phrase, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white font-mono">"{phrase.phrase}"</span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {phrase.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{phrase.reason}</p>
                </div>

                <Badge level={phrase.severity} size="sm" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
