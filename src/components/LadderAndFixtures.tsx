import React from 'react';
import { COMPETITION_DETAILS } from '../data/competition';
import { Trophy, Calendar, MapPin, ExternalLink, Shield, AlertCircle, Clock } from 'lucide-react';

export const LadderAndFixtures: React.FC = () => {
  const { ladder, upcomingFixtures, associationName, competitionName, grade, venueName, venueAddress, teamContactName } = COMPETITION_DETAILS;
  const nextMatch = upcomingFixtures[0];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      {/* Next Match Hero Banner */}
      {nextMatch && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/80 via-slate-900 to-slate-900 border-2 border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Clock className="w-3.5 h-3.5" /> Next Match • {nextMatch.round}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> {grade} • {competitionName.split('2026')[1] || 'Wednesday Mens'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center my-4">
              {/* Point Takeaway */}
              <div className="text-center md:text-left">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">Point Takeaway</div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">The Boys (4th)</div>
                <div className="text-xs text-slate-400 mt-1">2W - 0D - 1L (7 pts)</div>
              </div>

              {/* VS Pill */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 font-black text-lg shadow-inner">
                  VS
                </div>
                <div className="text-xs font-bold text-amber-400 mt-2 text-center uppercase tracking-wide">
                  Top 4 Showdown!
                </div>
              </div>

              {/* Opponent */}
              <div className="text-center md:text-right">
                <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">League Leaders</div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">{nextMatch.opponent} (1st)</div>
                <div className="text-xs text-slate-400 mt-1">2W - 1D - 0L (8 pts)</div>
              </div>
            </div>

            {/* Match Logistics */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">{nextMatch.date}</span> @ <span className="font-bold text-emerald-400">{nextMatch.time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>{nextMatch.field}, {nextMatch.venue}</span>
                </div>
              </div>

              <div className="text-emerald-300 italic font-medium">
                "{nextMatch.notes}"
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Official E/F Grade Ladder */}
      <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">Official E/F Grade Ladder</h3>
              <p className="text-xs text-slate-400">Redlands Touch Association • Spring Season 2 2026</p>
            </div>
          </div>

          <a
            href={COMPETITION_DETAILS.associationPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 px-3 py-1.5 rounded-lg transition-colors font-semibold"
          >
            <span>Live MySideline Table</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400 uppercase tracking-wider text-[11px] font-bold">
                <th className="py-3 px-3">Pos</th>
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-2 text-center">P</th>
                <th className="py-3 px-2 text-center">W</th>
                <th className="py-3 px-2 text-center">D</th>
                <th className="py-3 px-2 text-center">L</th>
                <th className="py-3 px-2 text-center">F</th>
                <th className="py-3 px-2 text-center">A</th>
                <th className="py-3 px-2 text-center">Diff</th>
                <th className="py-3 px-3 text-right font-black text-white">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ladder.map((entry) => {
                const isPt = entry.isPointTakeaway;
                return (
                  <tr
                    key={entry.pos}
                    className={`transition-colors ${
                      isPt
                        ? 'bg-emerald-950/50 hover:bg-emerald-950/70 font-bold text-white border-l-4 border-emerald-500'
                        : 'hover:bg-slate-750 text-slate-300'
                    }`}
                  >
                    <td className="py-3 px-3 font-black">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                        entry.pos <= 4 ? 'bg-slate-700 text-amber-400 font-bold' : 'text-slate-400'
                      }`}>
                        {entry.pos}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{entry.team}</span>
                        {isPt && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider font-extrabold">
                            Our Boys
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center text-slate-400">{entry.played}</td>
                    <td className="py-3 px-2 text-center text-emerald-400 font-semibold">{entry.won}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{entry.drawn}</td>
                    <td className="py-3 px-2 text-center text-rose-400">{entry.lost}</td>
                    <td className="py-3 px-2 text-center text-slate-300">{entry.pointsFor}</td>
                    <td className="py-3 px-2 text-center text-slate-400">{entry.pointsAgainst}</td>
                    <td className={`py-3 px-2 text-center font-bold ${
                      entry.diff > 0 ? 'text-emerald-400' : entry.diff < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      {entry.diff > 0 ? `+${entry.diff}` : entry.diff}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-amber-400 text-base">
                      {entry.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upcoming Fixtures & Venue Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Remaining Fixtures */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center gap-2.5 mb-4">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h4 className="text-base sm:text-lg font-bold text-white">Upcoming Spring Fixtures</h4>
          </div>
          <div className="space-y-3">
            {upcomingFixtures.map((f, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-extrabold text-emerald-400">{f.round}</span>
                  <span className="text-slate-400">{f.date}</span>
                </div>
                <div className="text-sm font-bold text-white flex items-center justify-between">
                  <span>vs {f.opponent}</span>
                  <span className="text-xs text-amber-400 font-semibold">{f.time}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{f.field}, {f.venue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Association & Gaffer Info */}
        <div className="bg-slate-800/80 rounded-3xl border border-slate-700/80 p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Shield className="w-5 h-5 text-emerald-400" />
              <h4 className="text-base sm:text-lg font-bold text-white">Competition Intelligence</h4>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div>
                <span className="text-slate-400 block text-xs">Governing Body & Association:</span>
                <span className="font-semibold text-white">{associationName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Official Home Venue:</span>
                <span className="font-semibold text-white">{venueName}</span>
                <span className="text-slate-400 block text-xs">{venueAddress}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Registered Team Manager & Gaffer:</span>
                <span className="font-bold text-emerald-400">{teamContactName}</span>
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Venue Warning:</strong> Parking is heavily constrained around Long Street showgrounds on match nights — carpool or arrive early!
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
            <a
              href="https://redlandstouch.com.au"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-650 text-center text-xs font-bold text-slate-200 transition-colors"
            >
              Redlands Touch Website
            </a>
            <a
              href="https://www.facebook.com/RedlandsTouch"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 rounded-xl bg-slate-700 hover:bg-slate-650 text-center text-xs font-bold text-slate-200 transition-colors"
            >
              Wet Weather Facebook
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
