import React, { useState } from 'react';
import { Calendar, Trash2, ArrowRight, Search } from 'lucide-react';
import { MatchReport } from '../types/match';

interface MatchArchiveProps {
  matches: MatchReport[];
  selectedMatchId: string;
  onSelectMatch: (match: MatchReport) => void;
  onDeleteMatch?: (id: string) => void;
}

export const MatchArchive: React.FC<MatchArchiveProps> = ({
  matches,
  selectedMatchId,
  onSelectMatch,
  onDeleteMatch,
}) => {
  const [filter, setFilter] = useState<'all' | 'win' | 'loss' | 'draw'>('all');
  const [search, setSearch] = useState('');

  const filtered = matches.filter(m => {
    const matchesOutcome = filter === 'all' ? true : m.score.outcome === filter;
    const matchesSearch =
      m.round.toLowerCase().includes(search.toLowerCase()) ||
      m.dadQuote.toLowerCase().includes(search.toLowerCase()) ||
      m.rawSmsText.toLowerCase().includes(search.toLowerCase()) ||
      m.tryScorers.some(t => t.player.toLowerCase().includes(search.toLowerCase()));
    return matchesOutcome && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Archive Header & Filters */}
      <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch']">
              MATCH ARCHIVE
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Every Wednesday night saga, scoreline, and dad quote in history
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports, players, quotes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-turf-500"
            />
          </div>
        </div>

        {/* Outcome filter buttons */}
        <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-700/60">
          {(['all', 'win', 'loss', 'draw'] as const).map(tab => {
            const label = tab === 'all' ? 'All Matches' : tab === 'loss' ? 'Losses' : `${tab}s`;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  filter === tab
                    ? 'bg-turf-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filtered.map(match => {
          const isSelected = match.id === selectedMatchId;
          const isWin = match.score.outcome === 'win';
          const isDraw = match.score.outcome === 'draw';

          return (
            <div
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className={`group bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-5 border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isSelected
                  ? 'border-turf-500 bg-slate-800 ring-2 ring-turf-500/20'
                  : 'border-slate-700/70 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Result Pill */}
                <div
                  className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-['Chakra_Petch'] font-black shrink-0 ${
                    isWin
                      ? 'bg-turf-500/20 text-turf-400 border border-turf-500/30'
                      : isDraw
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  <span className="text-xs uppercase">{match.score.outcome}</span>
                  <span className="text-base font-black leading-none mt-0.5">
                    {match.score.us}-{match.score.them}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base group-hover:text-turf-300 transition-colors">
                      {match.round} • {match.opponent}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {match.date}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 italic mt-1.5 line-clamp-1">
                    "{match.dadQuote}"
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                    <span>
                      Tries:{' '}
                      {match.tryScorers.map(t => `${t.player} (${t.count})`).join(', ') || 'None'}
                    </span>
                    <span>•</span>
                    <span>Casualties: {match.casualtyWard.length}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                {onDeleteMatch && matches.length > 1 && (
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (confirm(`Delete match report for ${match.round}?`)) {
                        onDeleteMatch(match.id);
                      }
                    }}
                    className="p-2 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition-colors"
                    title="Delete report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="flex items-center gap-1 text-xs font-semibold text-turf-400 group-hover:translate-x-1 transition-transform">
                  <span>View Chronicle</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
