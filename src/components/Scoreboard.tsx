import React from 'react';
import confetti from 'canvas-confetti';
import { Share2, Calendar, Sparkles, AlertTriangle } from 'lucide-react';
import { MatchReport } from '../types/match';

interface ScoreboardProps {
  match: MatchReport;
  onShare: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ match, onShare }) => {
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#f59e0b', '#38bdf8', '#ffffff'],
    });
  };

  const isWin = match.score.outcome === 'win';
  const isDraw = match.score.outcome === 'draw';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-800/90 to-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-8">
      {/* Background Stadium Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-turf-500/15 blur-3xl pointer-events-none rounded-full" />

      {/* Top Banner: Round, Date, Share */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-5 border-b border-slate-700/60 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-turf-900/60 text-turf-300 font-bold rounded-lg border border-turf-700/50 uppercase tracking-wider text-xs">
            {match.round} • {match.season}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {match.date}
          </span>
        </div>

        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-600/50 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5 text-turf-400" />
          <span>Share Match</span>
        </button>
      </div>

      {/* Main Scoreboard Display */}
      <div className="py-6 sm:py-8 grid grid-cols-11 items-center gap-2">
        {/* Home Team */}
        <div className="col-span-4 text-center sm:text-right">
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-turf-400 uppercase">
            HOME
          </div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-white tracking-tight mt-1 font-['Chakra_Petch']">
            {match.teamName}
          </h2>
          <div className="text-xs text-slate-400 mt-1 hidden sm:block">
            {match.squadPresent.length} Blokes In Squad
          </div>
        </div>

        {/* The Scores Centerpiece */}
        <div className="col-span-3 text-center flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 sm:gap-4 bg-slate-950/80 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl border border-slate-800 shadow-inner">
            <span className="text-4xl sm:text-6xl font-black tracking-tighter text-white font-['Chakra_Petch']">
              {match.score.us}
            </span>
            <span className="text-xl sm:text-3xl font-bold text-slate-600">:</span>
            <span className="text-4xl sm:text-6xl font-black tracking-tighter text-slate-300 font-['Chakra_Petch']">
              {match.score.them}
            </span>
          </div>

          {/* Half-Time & Result Badge */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[11px] sm:text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              HT {match.score.halfTimeUs} - {match.score.halfTimeThem}
            </span>
            {isWin && (
              <button
                onClick={triggerConfetti}
                className="group text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-turf-500/20 text-turf-300 border border-turf-500/40 hover:bg-turf-500/30 transition-all flex items-center gap-1"
                title="Click for victory celebration!"
              >
                <span>WIN 🏆</span>
                <Sparkles className="w-3 h-3 group-hover:rotate-12 transition-transform text-amber-400" />
              </button>
            )}
            {isDraw && (
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                DRAW 🤝
              </span>
            )}
            {!isWin && !isDraw && (
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                DEFEAT
              </span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div className="col-span-4 text-center sm:text-left">
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
            AWAY
          </div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-slate-200 tracking-tight mt-1 font-['Chakra_Petch']">
            {match.opponent}
          </h2>
          <div className="text-xs text-slate-500 mt-1 hidden sm:block">
            Wednesday Competitors
          </div>
        </div>
      </div>

      {/* Headline banner */}
      {match.headline && (
        <div className="mt-2 text-center pt-4 border-t border-slate-800/80">
          <p className="text-base sm:text-lg font-bold text-slate-200 italic">
            "{match.headline}"
          </p>
        </div>
      )}

      {/* Parking warning footer callout */}
      {match.venueNotes && (
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-amber-300/90 bg-amber-950/30 border border-amber-800/40 py-1.5 px-3 rounded-xl">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{match.venueNotes}</span>
        </div>
      )}
    </div>
  );
};
