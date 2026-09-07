import React, { useState } from 'react';
import { BookOpen, MessageSquare, Copy, Check } from 'lucide-react';
import { MatchReport } from '../types/match';

interface MatchReportProps {
  match: MatchReport;
  selectedPlayerFilter?: string | null;
  onClearFilter?: () => void;
}

export const MatchReportView: React.FC<MatchReportProps> = ({
  match,
  selectedPlayerFilter,
  onClearFilter,
}) => {
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [copied, setCopied] = useState(false);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(match.rawSmsText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight player names in paragraph
  const renderParagraph = (text: string, idx: number) => {
    // If a filter is active, highlight paragraphs containing the player
    const isFiltered = selectedPlayerFilter
      ? text.toLowerCase().includes(selectedPlayerFilter.toLowerCase())
      : false;

    return (
      <p
        key={idx}
        className={`leading-relaxed text-base sm:text-lg transition-all ${
          selectedPlayerFilter && isFiltered
            ? 'p-3 bg-turf-950/40 border-l-4 border-turf-400 rounded-r-xl text-white font-medium shadow-sm'
            : selectedPlayerFilter && !isFiltered
            ? 'opacity-40 text-slate-400'
            : 'text-slate-200'
        }`}
      >
        {text}
      </p>
    );
  };

  return (
    <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-turf-400" />
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            The Full Match Chronicle
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {selectedPlayerFilter && (
            <div className="flex items-center gap-2 bg-turf-900/60 px-2.5 py-1 rounded-lg border border-turf-600/40 text-xs text-turf-300">
              <span>Filtering: <strong>{selectedPlayerFilter}</strong></span>
              <button
                onClick={onClearFilter}
                className="text-slate-400 hover:text-white font-bold ml-1"
              >
                ×
              </button>
            </div>
          )}

          <div className="bg-slate-900 p-1 rounded-xl flex items-center border border-slate-700">
            <button
              onClick={() => setViewMode('formatted')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'formatted'
                  ? 'bg-turf-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Story Mode
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                viewMode === 'raw'
                  ? 'bg-turf-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3 h-3" />
              <span>Original SMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6">
        {viewMode === 'formatted' ? (
          <div className="space-y-4">
            {match.storyParagraphs && match.storyParagraphs.length > 0 ? (
              match.storyParagraphs.map((p, i) => renderParagraph(p, i))
            ) : (
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {match.rawSmsText}
              </p>
            )}
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={handleCopyRaw}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-600/50 flex items-center gap-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-turf-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-turf-800">
              {match.rawSmsText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
