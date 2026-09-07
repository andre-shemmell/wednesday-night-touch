import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Scoreboard } from './components/Scoreboard';
import { DadQuote } from './components/DadQuote';
import { MatchHighlights } from './components/MatchHighlights';
import { MatchReportView } from './components/MatchReport';
import { SquadDirectory } from './components/SquadDirectory';
import { SmsIngestStudio } from './components/SmsIngestStudio';
import { MatchArchive } from './components/MatchArchive';
import { ShareModal } from './components/ShareModal';
import { getSavedMatches, saveMatch, deleteMatch } from './services/storage';
import { MatchReport } from './types/match';
import { ChevronLeft, ChevronRight, HelpCircle, Globe } from 'lucide-react';

export const App: React.FC = () => {
  const [matches, setMatches] = useState<MatchReport[]>([]);
  const [selectedMatchId, setSelectedMatchId] = useState<string>('');
  const [currentTab, setCurrentTab] = useState<'match' | 'squad' | 'ingest' | 'archive'>('match');
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showHostingGuide, setShowHostingGuide] = useState(false);

  // Initialize matches from storage / JSON
  useEffect(() => {
    const loaded = getSavedMatches();
    setMatches(loaded);
    if (loaded.length > 0) {
      setSelectedMatchId(loaded[0].id);
    }
  }, []);

  const activeMatch = matches.find(m => m.id === selectedMatchId) || matches[0];

  const handlePublishNewMatch = (newMatch: MatchReport) => {
    const updated = saveMatch(newMatch);
    setMatches(updated);
    setSelectedMatchId(newMatch.id);
    setCurrentTab('match');
  };

  const handleDeleteMatch = (id: string) => {
    const updated = deleteMatch(id);
    setMatches(updated);
    if (selectedMatchId === id && updated.length > 0) {
      setSelectedMatchId(updated[0].id);
    }
  };

  const handleSelectPlayerFromCard = (playerName: string) => {
    setSelectedPlayerFilter(playerName);
    setCurrentTab('match');
  };

  // Switch to next or previous match in list
  const activeIndex = matches.findIndex(m => m.id === selectedMatchId);
  const hasPrev = activeIndex < matches.length - 1;
  const hasNext = activeIndex > 0;

  const goToPrev = () => {
    if (hasPrev) setSelectedMatchId(matches[activeIndex + 1].id);
  };
  const goToNext = () => {
    if (hasNext) setSelectedMatchId(matches[activeIndex - 1].id);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans']">
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        matchesCount={matches.length}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Match View Tab */}
        {currentTab === 'match' && activeMatch && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Quick Round Navigation if multiple matches exist */}
            {matches.length > 1 && (
              <div className="flex items-center justify-between bg-slate-800/60 p-2 sm:p-3 rounded-2xl border border-slate-700/60 text-xs">
                <button
                  onClick={goToPrev}
                  disabled={!hasPrev}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Older Round</span>
                </button>

                <span className="font-bold text-slate-300">
                  {activeMatch.round} • {activeMatch.date}
                </span>

                <button
                  onClick={goToNext}
                  disabled={!hasNext}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Newer Round</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scoreboard Banner */}
            <Scoreboard
              match={activeMatch}
              onShare={() => setShareModalOpen(true)}
            />

            {/* Dad's Quote of the Week Card */}
            <DadQuote quote={activeMatch.dadQuote} />

            {/* Key Match Highlights (Tries, Defense, Casualties, Ref Room) */}
            <MatchHighlights
              match={activeMatch}
              onPlayerClick={handleSelectPlayerFromCard}
            />

            {/* The Full Chronicle Narrative */}
            <MatchReportView
              match={activeMatch}
              selectedPlayerFilter={selectedPlayerFilter}
              onClearFilter={() => setSelectedPlayerFilter(null)}
            />
          </div>
        )}

        {/* Squad Directory Tab */}
        {currentTab === 'squad' && (
          <SquadDirectory
            currentMatch={activeMatch}
            onSelectPlayer={handleSelectPlayerFromCard}
          />
        )}

        {/* SMS Ingest Studio Tab */}
        {currentTab === 'ingest' && (
          <SmsIngestStudio onPublishMatch={handlePublishNewMatch} />
        )}

        {/* Archive Tab */}
        {currentTab === 'archive' && (
          <MatchArchive
            matches={matches}
            selectedMatchId={selectedMatchId}
            onSelectMatch={match => {
              setSelectedMatchId(match.id);
              setCurrentTab('match');
            }}
            onDeleteMatch={handleDeleteMatch}
          />
        )}
      </main>

      {/* Share Modal Dialog */}
      {shareModalOpen && activeMatch && (
        <ShareModal
          match={activeMatch}
          onClose={() => setShareModalOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🏉</span>
            <span className="font-semibold text-slate-400">Wednesday Night Touch Footy Hub</span>
            <span>•</span>
            <span>Dedicated to Dad's Match Reports</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setShowHostingGuide(!showHostingGuide)}
              className="flex items-center gap-1 hover:text-turf-400 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hosting & Deployment Info</span>
            </button>
          </div>
        </div>

        {/* Hosting Guide Expandable Banner */}
        {showHostingGuide && (
          <div className="mt-6 max-w-2xl mx-auto p-5 bg-slate-900 rounded-2xl border border-slate-700 text-left text-xs text-slate-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white text-sm flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-turf-400" />
                Where to Host (100% Free Forever)
              </span>
              <button
                onClick={() => setShowHostingGuide(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p>
              <strong>1. Vercel (Recommended):</strong> Run <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">npx vercel</code> or link this GitHub repository on vercel.com. It deploys in 10 seconds with free HTTPS, custom domain support, and auto-updates on git push.
            </p>
            <p>
              <strong>2. GitHub Pages:</strong> A GitHub Actions workflow is included in <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">.github/workflows/deploy.yml</code>. Simply push to GitHub and enable Pages in repository settings!
            </p>
          </div>
        )}
      </footer>
    </div>
  );
};
