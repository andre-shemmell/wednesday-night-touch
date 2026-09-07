import React, { useState } from 'react';
import { Sparkles, Key, CheckCircle2, AlertCircle, FileText, Download, ArrowRight, RefreshCw, Layers } from 'lucide-react';
import { MatchReport } from '../types/match';
import { parseSmsWithGemini } from '../services/aiParser';
import { parseSmsHeuristic } from '../services/heuristicParser';
import { getStoredApiKey, setStoredApiKey, getStoredModel, setStoredModel } from '../services/storage';
import { Scoreboard } from './Scoreboard';
import { DadQuote } from './DadQuote';
import { MatchHighlights } from './MatchHighlights';

interface SmsIngestStudioProps {
  onPublishMatch: (match: MatchReport) => void;
}

const SAMPLE_SMS = `For tonight's game we were missing Reece (long term injury).
Also Peter (Respiratory problems) and Mitch (Self inflicted cut 😂requiring 5 stitches in his finger).

So we had 9 players but started the game with 6. Cam, Matt and Jayden arriving a few minutes after the start. Parking is a severe problem at the moment at this venue.

We actually started the game well and defended strongly until Mack grabbed a nice intercept at their tryline.

This gave us some attacking momentum and Joel and Dylan combined beautifully to put down our first try. 1-0.

They then retaliated, ran the ball to our line, with Mack and BJ doing their best to keep them out but no. They scored. 1-1.

Joel attacked and threw the ball out wide to Adrian but the ball went behind him and we gave it up.
Joel, as usual, was on fire and made a great tag to stop them in their tracks.
Cam threw a nice cutout pass to his brother, Matt, and we went further forward. This opportunity opened things up for Joel and he went over for our second. 2-1.

They responded but threw a long ball out wide but it was ruled forward. They appeared to be a bit desperate as they threw another good attacking ball wildly and down.
Matt threw a confident strong pass out to BJ and he grabbed it with both hands. Really well.
This great play led to Cam going forward at speed and passing over to Jayden who made no mistake as usual. 3-1.

Of course they responded quickly. But Dylan and Jayden made decisive touches to shut them down.
Joel attacked and threw a fast pass to Dylan and he accepted it.
We looked good.
Then following keen support from Jayden, Cam simply ran through them to score our next try. He made it look easy. 4-1.

Then, Cam got us 6 more. Penalty.
We attacked as Cam passed well to Matt and he looked to go over but was deemed tagged.
Then, as we defended Matt tagged really well. 
Joel and Jayden defending on the line looked to have done enough but no. The referee indicated a try. It must have been a very close thing. 4-2.
Seconds later the half time siren sounded.

HT 4-2.

Obviously we were in a strong position and we earned that.
Adrian got us 6 more as we attacked them.
Joel was looking to score and passed to Dylan and he made no mistake and put it down. 5-2.

Nev made a great tag on the line and came back to make another to totally keep them out.
Matt and Jayden defended well together in the midfield.

Cam ran through them and looked likely to put another one down but was deemed tagged.
Then, on the far right corner, the ball seemed to be dropped by somebody. But, unbelievably a try was given to our opponents.
5-3.

We counter attacked but BJ, Jayden and Adrian were all tagged.

A great run by Nev through the middle gave us good field position. Matt took the ball and went over. Disallowed. Apparently tagged.

Next thing, Cam, without the ball was tackled. Well, both players involved were sent off; a soft send off where they can be replaced. And only need a couple of minutes off and then run back on.

We continued to attack and Dylan, having a wonderful night, put it down, having a clear run to the line. But then, after some discussion between the two referees came the unbelievable decision to disallow the try.

Jayden , Cam and Dylan weren't done. We attacked.
Then after another great tag by Adrian this evening, Mack got the ball and took it up.

Joely, still fired up, made a try saving tag.

We defended once more and Nev stood tall as he "left" (A Great Leave), the ball to allow possession to be ours.

Only a few moments later, the game was over.

FT 5-3.

Summing up.

Everyone played well tonight.
We have a great range of ages of our players. We always did.
But, everyone tonight played like young blokes.
Good job. 👍`;

export const SmsIngestStudio: React.FC<SmsIngestStudioProps> = ({ onPublishMatch }) => {
  const [smsText, setSmsText] = useState('');
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [model, setModel] = useState(getStoredModel());
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Parsed candidate
  const [candidate, setCandidate] = useState<MatchReport | null>(null);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    setStoredApiKey(key);
  };

  const handleSaveModel = (m: string) => {
    setModel(m);
    setStoredModel(m);
  };

  const handleLoadSample = () => {
    setSmsText(SAMPLE_SMS);
    setErrorMsg(null);
  };

  const handleParseWithGemini = async () => {
    if (!smsText.trim()) {
      setErrorMsg('Please paste an SMS match writeup first!');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const parsed = await parseSmsWithGemini(smsText, apiKey, model);
      setCandidate(parsed);
      setSuccessMsg(`Parsed successfully with ${model}! Review and publish below.`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`AI Parsing failed: ${err?.message || err}. You can also use the Instant Heuristic Parser.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleParseHeuristic = () => {
    if (!smsText.trim()) {
      setErrorMsg('Please paste an SMS match writeup first!');
      return;
    }
    setErrorMsg(null);
    const parsedPartial = parseSmsHeuristic(smsText);
    const fullReport: MatchReport = {
      id: `${new Date().toISOString().split('T')[0]}-round-${Math.floor(Math.random() * 100)}`,
      date: parsedPartial.date || new Date().toISOString().split('T')[0],
      round: parsedPartial.round || 'Round 2',
      season: parsedPartial.season || '2026',
      teamName: parsedPartial.teamName || 'Point Takeaway',
      opponent: parsedPartial.opponent || 'The Opposition',
      score: parsedPartial.score || { us: 0, them: 0, halfTimeUs: 0, halfTimeThem: 0, outcome: 'draw' },
      dadQuote: parsedPartial.dadQuote || '',
      headline: 'Wednesday Night Touch Footy Dispatch',
      rawSmsText: smsText,
      storyParagraphs: parsedPartial.storyParagraphs || [smsText],
      tryScorers: parsedPartial.tryScorers || [],
      defensiveHighlights: parsedPartial.defensiveHighlights || [],
      casualtyWard: parsedPartial.casualtyWard || [],
      controversies: parsedPartial.controversies || [],
      venueNotes: parsedPartial.venueNotes,
      squadNotes: parsedPartial.squadNotes,
      squadPresent: parsedPartial.squadPresent || [],
      squadMissing: parsedPartial.squadMissing || [],
      awards: parsedPartial.awards,
    };
    setCandidate(fullReport);
    setSuccessMsg('Heuristic extraction complete! Review and publish below.');
  };

  const handlePublish = () => {
    if (!candidate) return;
    onPublishMatch(candidate);
    setSuccessMsg('🎉 Match published! It is now live in your match center and archive.');
  };

  const handleDownloadJson = () => {
    if (!candidate) return;
    const blob = new Blob([JSON.stringify(candidate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-${candidate.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Studio Header */}
      <div className="bg-gradient-to-br from-amber-500/10 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                GEMINI AI POWERED
              </span>
              <span className="text-xs text-slate-400">Zero manual formatting needed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 font-['Chakra_Petch']">
              SMS INGEST STUDIO
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Paste Graeme's Wednesday night SMS. Gemini Flash parses the scores, try scorers, casualties (5-stitch injuries 😂), referee controversies, and his closing quote into a structured match report.
            </p>
          </div>

          <button
            onClick={handleLoadSample}
            className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Load Tonight's Sample SMS</span>
          </button>
        </div>

        {/* API Key & Model Configuration Accordion */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Google Gemini API Key (Optional / AI Mode)</span>
            </label>
            <input
              type="password"
              placeholder="Paste Google AI Studio key (or leave empty for heuristic)"
              value={apiKey}
              onChange={e => handleSaveApiKey(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Keys are stored locally in your browser only. Free key at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-amber-400 hover:underline">aistudio.google.com</a>.
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Model</span>
            </label>
            <select
              value={model}
              onChange={e => handleSaveModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Optimized for Australian sports jargon & grassroots match summaries.
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-xl">
        <label className="block text-sm font-bold text-white mb-2">
          Graeme's Raw SMS Message:
        </label>
        <textarea
          rows={10}
          value={smsText}
          onChange={e => setSmsText(e.target.value)}
          placeholder="Paste the SMS here (e.g. For tonight's game we were missing Reece... HT 4-2... FT 5-3... Everyone played like young blokes. Good job. 👍)"
          className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-turf-500 font-mono leading-relaxed resize-y"
        />

        {/* Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleParseWithGemini}
              disabled={isProcessing}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini Flash Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Parse with Gemini Flash</span>
                </>
              )}
            </button>

            <button
              onClick={handleParseHeuristic}
              disabled={isProcessing}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-semibold text-sm border border-slate-600 flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-turf-400" />
              <span>Instant Offline Heuristic (Zero Key)</span>
            </button>
          </div>

          {smsText && (
            <button
              onClick={() => { setSmsText(''); setCandidate(null); setErrorMsg(null); }}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear Text
            </button>
          )}
        </div>

        {/* Feedback messages */}
        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-turf-500/20 border border-turf-500/30 text-turf-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-turf-400" />
            <span>{successMsg}</span>
          </div>
        )}
      </div>

      {/* Candidate Editor & Live Preview */}
      {candidate && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <div>
              <span className="text-xs font-bold text-turf-400 uppercase tracking-wider">
                Step 2
              </span>
              <h3 className="text-xl font-bold text-white">
                Review & Publish Match
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Download JSON file for version control"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                onClick={handlePublish}
                className="px-5 py-2 rounded-xl bg-turf-600 hover:bg-turf-500 text-white font-bold text-sm shadow-lg shadow-turf-700/30 flex items-center gap-2 transition-colors"
              >
                <span>Publish Match Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Edit Fields */}
          <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Round</label>
              <input
                type="text"
                value={candidate.round}
                onChange={e => setCandidate({ ...candidate, round: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Date</label>
              <input
                type="date"
                value={candidate.date}
                onChange={e => setCandidate({ ...candidate, date: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Score (Us - Them)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={candidate.score.us}
                  onChange={e => setCandidate({
                    ...candidate,
                    score: { ...candidate.score, us: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
                <span className="text-slate-500">:</span>
                <input
                  type="number"
                  value={candidate.score.them}
                  onChange={e => setCandidate({
                    ...candidate,
                    score: { ...candidate.score, them: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
            </div>
            <div>
              <label className="text-slate-400 font-semibold block mb-1">Half Time (Us - Them)</label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={candidate.score.halfTimeUs}
                  onChange={e => setCandidate({
                    ...candidate,
                    score: { ...candidate.score, halfTimeUs: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
                <span className="text-slate-500">:</span>
                <input
                  type="number"
                  value={candidate.score.halfTimeThem}
                  onChange={e => setCandidate({
                    ...candidate,
                    score: { ...candidate.score, halfTimeThem: parseInt(e.target.value, 10) || 0 }
                  })}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-center"
                />
              </div>
            </div>
          </div>

          {/* Live Preview of Scoreboard, Quote, Highlights */}
          <div className="space-y-6">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Live Preview:
            </div>
            <Scoreboard match={candidate} onShare={() => {}} />
            <DadQuote quote={candidate.dadQuote} />
            <MatchHighlights match={candidate} />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={handlePublish}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-turf-600 to-turf-500 hover:from-turf-500 hover:to-turf-400 text-white font-black text-base shadow-xl shadow-turf-700/40 flex items-center gap-2 transition-all"
            >
              <span>Publish Match To Site</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
