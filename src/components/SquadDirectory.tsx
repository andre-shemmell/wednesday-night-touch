import React, { useState } from 'react';
import { Search, ShieldAlert, UserCheck } from 'lucide-react';
import { INITIAL_PLAYERS } from '../data/players';
import { MatchReport } from '../types/match';

interface SquadDirectoryProps {
  currentMatch?: MatchReport;
  onSelectPlayer?: (name: string) => void;
}

export const SquadDirectory: React.FC<SquadDirectoryProps> = ({
  currentMatch,
  onSelectPlayer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const missingSet = new Set(currentMatch?.squadMissing?.map(n => n.toLowerCase()) || []);
  const presentSet = new Set(currentMatch?.squadPresent?.map(n => n.toLowerCase()) || []);

  const filteredPlayers = INITIAL_PLAYERS.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.roleDescription?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = selectedTag ? p.tags?.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(
    new Set(INITIAL_PLAYERS.flatMap(p => p.tags || []))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Chakra_Petch']">
              THE SQUAD ROSTER
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {INITIAL_PLAYERS.length} blokes across all ages, legends & weekly warriors
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search players, nicknames..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-turf-500"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-slate-700/60">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              selectedTag === null
                ? 'bg-turf-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Blokes
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-turf-600 text-white'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlayers.map(player => {
          const isMissing = missingSet.has(player.name.toLowerCase());
          const isPresent = presentSet.has(player.name.toLowerCase());

          return (
            <div
              key={player.id}
              onClick={() => onSelectPlayer?.(player.name)}
              className="group relative bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/70 hover:border-turf-500/40 shadow-lg transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl border border-slate-700 shadow-inner group-hover:scale-110 transition-transform">
                      {player.avatarEmoji || '🏉'}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-white group-hover:text-turf-300 transition-colors font-['Chakra_Petch']">
                        {player.name}
                      </h3>
                      {player.nickname && (
                        <p className="text-xs text-amber-400 font-medium">
                          "{player.nickname}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status badge for latest match */}
                  {isMissing && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <ShieldAlert className="w-3 h-3" />
                      Casualty
                    </span>
                  )}
                  {isPresent && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-turf-500/20 text-turf-300 border border-turf-500/30">
                      <UserCheck className="w-3 h-3" />
                      Played
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                  {player.roleDescription}
                </p>
              </div>

              {/* Tags footer */}
              {player.tags && (
                <div className="flex flex-wrap gap-1 mt-4 pt-3 border-t border-slate-700/50">
                  {player.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
