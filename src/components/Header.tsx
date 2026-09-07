import React from 'react';
import { Trophy, Sparkles, Users, FileText, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  currentTab: 'match' | 'squad' | 'ingest' | 'archive';
  setCurrentTab: (tab: 'match' | 'squad' | 'ingest' | 'archive') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  matchesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  isDarkMode,
  setIsDarkMode,
  matchesCount,
}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <div 
            onClick={() => setCurrentTab('match')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-turf-600 to-turf-800 flex items-center justify-center shadow-lg shadow-turf-900/30 text-xl sm:text-2xl border border-turf-500/30 group-hover:scale-105 transition-transform">
              🏉
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Chakra_Petch']">
                  WEDNESDAY NIGHT TOUCH
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold bg-turf-500/20 text-turf-400 rounded-full border border-turf-500/30">
                  EST. FOOTY
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden xs:block">
                Dad's Official Weekly Grassroots Dispatches
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <button
                onClick={() => setCurrentTab('match')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'match'
                    ? 'bg-turf-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>Latest</span>
              </button>

              <button
                onClick={() => setCurrentTab('squad')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'squad'
                    ? 'bg-turf-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Squad</span>
              </button>

              <button
                onClick={() => setCurrentTab('archive')}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  currentTab === 'archive'
                    ? 'bg-turf-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Archive</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-700 rounded-full">
                  {matchesCount}
                </span>
              </button>
            </nav>

            {/* AI Ingest Studio CTA Button */}
            <button
              onClick={() => setCurrentTab('ingest')}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-md ${
                currentTab === 'ingest'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-amber-500/25 ring-2 ring-amber-400'
                  : 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
              title="Add a new SMS match write-up using Gemini AI"
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">AI Ingest</span>
              <span className="sm:hidden">Ingest</span>
            </button>

            {/* Night / Floodlight Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700 transition-colors"
              title={isDarkMode ? 'Floodlights Active (Night Mode)' : 'Day Mode'}
            >
              {isDarkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
