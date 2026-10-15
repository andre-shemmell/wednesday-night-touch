import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, ChevronDown, ChevronUp, Copy, Check, Sparkles, Mic } from 'lucide-react';
import theWrapEpisodes from '../data/theWrapEpisodes.json';

interface TheWrapPlayerProps {
  round: string;
  matchId: string;
}

export const TheWrapPlayer: React.FC<TheWrapPlayerProps> = ({ round, matchId }) => {
  const episode = theWrapEpisodes.find(
    e => e.round.toLowerCase() === round.toLowerCase() || e.matchId === matchId
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(episode?.durationSeconds || 135);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasAudioError, setHasAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state if episode or match changes
    setIsPlaying(false);
    setCurrentTime(0);
    setHasAudioError(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.pause();
    }
  }, [round, matchId]);

  // Player strictly only appears if an episode exists AND audio is ready
  if (!episode || !episode.isAudioReady) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Playback error:', err);
        setHasAudioError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (audioRef.current) {
      audioRef.current.currentTime = targetTime;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleCopyTranscript = () => {
    const fullText = episode.transcript
      .map(t => `${t.speaker}: ${t.text}`)
      .join('\n\n');
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight expression tags like [excited], [laughing]
  const renderFormattedText = (text: string) => {
    const tagRegex = /(\[[^\]]+\])/g;
    const parts = text.split(tagRegex);

    return parts.map((part, idx) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return (
          <span
            key={idx}
            className="inline-block px-1.5 py-0.5 mx-1 text-[11px] font-bold uppercase tracking-wider rounded bg-amber-500/20 text-amber-300 border border-amber-500/40"
          >
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div id="the-wrap-player" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-7 border border-amber-500/30 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-turf-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-700/60 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-slate-950 shadow-md">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                The Wrap
              </span>
              <span className="text-xs text-slate-400 font-medium">Official Match Recap Podcast</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mt-0.5">
              {episode.title}
            </h3>
          </div>
        </div>

        {/* Co-Hosts Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-amber-500/30 text-amber-200">
            <Mic className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold">Mick</span>
            <span className="text-slate-400 text-[10px]">(Colour)</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-turf-500/30 text-turf-200">
            <Mic className="w-3.5 h-3.5 text-turf-400" />
            <span className="font-bold">Gazza</span>
            <span className="text-slate-400 text-[10px]">(Tactical)</span>
          </div>
        </div>
      </div>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onError={() => setHasAudioError(true)}
        preload="metadata"
      />

      {/* Audio Player Controls */}
      <div className="mt-5 space-y-4 relative z-10">
        <div className="flex items-center gap-4">
          {/* Main Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            title={isPlaying ? 'Pause The Wrap' : 'Play The Wrap'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-current" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-0.5" />
            )}
          </button>

          {/* Progress Bar & Time */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span className="text-amber-400 font-bold">{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
            />
          </div>

          {/* Mute Button */}
          <button
            onClick={toggleMute}
            className="flex-shrink-0 p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {hasAudioError && (
          <p className="text-xs text-red-400 font-medium">Audio playback error. Click play to retry.</p>
        )}
      </div>

      {/* Transcript Accordion Toggle */}
      <div className="mt-4 pt-4 border-t border-slate-700/60 relative z-10 flex items-center justify-between">
        <button
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{showTranscript ? 'Hide Expressive Script & Dialogue' : `Read Dialogue Script (${episode.transcript.length} Turns)`}</span>
          {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showTranscript && (
          <button
            onClick={handleCopyTranscript}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-turf-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Script'}</span>
          </button>
        )}
      </div>

      {/* Expanded Transcript View */}
      {showTranscript && (
        <div className="mt-4 space-y-3.5 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar border-t border-slate-700/40 pt-4">
          {episode.transcript.map((turn, idx) => {
            const isMick = turn.speaker.toLowerCase().includes('mick');
            return (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isMick
                    ? 'bg-amber-950/20 border-amber-500/20 text-slate-100'
                    : 'bg-emerald-950/20 border-emerald-500/20 text-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isMick
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {turn.speaker}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Voice: {isMick ? 'Fenrir' : 'Charon'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Turn {idx + 1}</span>
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-slate-200">
                  {renderFormattedText(turn.text)}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
