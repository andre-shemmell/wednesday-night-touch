import React from 'react';
import { Quote, ThumbsUp } from 'lucide-react';

interface DadQuoteProps {
  quote: string;
}

export const DadQuote: React.FC<DadQuoteProps> = ({ quote }) => {
  if (!quote) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800/80 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
      <div className="absolute top-4 right-4 text-amber-500/15 select-none pointer-events-none">
        <Quote className="w-24 h-24" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold tracking-wider text-amber-400 uppercase mb-3">
          <ThumbsUp className="w-4 h-4 text-amber-400" />
          <span>Graeme's Post-Match Summing Up</span>
        </div>

        <blockquote className="text-lg sm:text-2xl font-serif italic text-slate-100 leading-relaxed">
          "{quote}"
        </blockquote>

        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-700/50">
          <span className="font-semibold text-turf-400">
            — Graeme (The Gaffer / Match Reporter)
          </span>
          <span className="italic text-slate-400">
            Wednesday Night Touch Footy Dispatch
          </span>
        </div>
      </div>
    </div>
  );
};
