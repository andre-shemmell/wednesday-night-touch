import React from 'react';
import { Shield, Award, AlertOctagon, HeartPulse, Sparkles, Footprints } from 'lucide-react';
import { MatchReport } from '../types/match';

interface MatchHighlightsProps {
  match: MatchReport;
  onPlayerClick?: (playerName: string) => void;
}

export const MatchHighlights: React.FC<MatchHighlightsProps> = ({ match, onPlayerClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* 1. Try Scorers */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-turf-400 uppercase tracking-wider mb-4">
          <Award className="w-4 h-4" />
          <span>🏉 Try Scorers ({match.tryScorers.reduce((acc, t) => acc + t.count, 0)})</span>
        </div>

        <div className="space-y-3 flex-1">
          {match.tryScorers.map((scorer, idx) => (
            <div
              key={idx}
              onClick={() => onPlayerClick?.(scorer.player)}
              className="group flex items-start justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-turf-500/40 transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white group-hover:text-turf-300 transition-colors">
                    {scorer.player}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-turf-500/20 text-turf-400 font-bold border border-turf-500/30">
                    {scorer.count} {scorer.count === 1 ? 'Try' : 'Tries'}
                  </span>
                </div>
                {scorer.notes && (
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {scorer.notes}
                  </p>
                )}
              </div>
              <span className="text-xl">🏉</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Defensive Wall & Standouts */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">
          <Shield className="w-4 h-4" />
          <span>🛡️ Defensive Standouts & Tags</span>
        </div>

        <div className="space-y-3 flex-1">
          {match.defensiveHighlights.map((def, idx) => (
            <div
              key={idx}
              onClick={() => onPlayerClick?.(def.player)}
              className="group flex items-start justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <div>
                <span className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {def.player}
                </span>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {def.action}
                </p>
              </div>
              <span className="text-base text-cyan-400">⚡</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. The Casualty Ward */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-400 uppercase tracking-wider mb-4">
          <HeartPulse className="w-4 h-4" />
          <span>🚑 The Casualty Ward & Absences</span>
        </div>

        <div className="space-y-3 flex-1">
          {match.casualtyWard.map((cas, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl bg-slate-900/60 border transition-all ${
                cas.isSelfInflicted
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">{cas.player}</span>
                {cas.isSelfInflicted && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <span>Self-Inflicted</span>
                    <span>😂</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {cas.reason}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Referees & Controversies */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/70 shadow-lg flex flex-col">
        <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider mb-4">
          <AlertOctagon className="w-4 h-4" />
          <span>⚖️ Referee Decisions & Controversies</span>
        </div>

        <div className="space-y-3 flex-1">
          {match.controversies.map((con, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-900/60 border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                  {con.title}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                {con.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Special Awards & Accolades Banner (if present) */}
      {match.awards && (
        <div className="md:col-span-2 bg-gradient-to-r from-turf-950/80 via-slate-900 to-amber-950/40 rounded-2xl p-5 border border-turf-600/30 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4" />
            <span>Honours & Match Superlatives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {match.awards.playerOfTheMatch && (
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">
                  Player of the Match
                </span>
                <p className="text-sm font-bold text-white mt-0.5">
                  {match.awards.playerOfTheMatch}
                </p>
              </div>
            )}
            {match.awards.momentOfTheMatch && (
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5 text-turf-400" />
                  Moment of the Match
                </span>
                <p className="text-sm font-bold text-turf-300 mt-0.5">
                  {match.awards.momentOfTheMatch}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
