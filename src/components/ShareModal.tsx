import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Share2 } from 'lucide-react';
import { MatchReport } from '../types/match';

interface ShareModalProps {
  match: MatchReport;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ match, onClose }) => {
  const [copied, setCopied] = useState(false);

  const scorersSummary = match.tryScorers.map(t => `${t.player} (${t.count})`).join(', ');
  const casualtiesSummary = match.casualtyWard.map(c => `${c.player}${c.isSelfInflicted ? ' (5 stitches 😂)' : ''}`).join(', ');

  const shareText = `🏉 WEDNESDAY NIGHT TOUCH • ${match.round}
🏆 RESULT: ${match.score.outcome.toUpperCase()} ${match.score.us} - ${match.score.them} (HT ${match.score.halfTimeUs}-${match.score.halfTimeThem})

💬 Graeme's Verdict:
"${match.dadQuote}"

🏉 Tries: ${scorersSummary || 'None'}
🚑 Casualty Ward: ${casualtiesSummary || 'None'}
${match.awards?.momentOfTheMatch ? `⭐ Moment of the Match: ${match.awards.momentOfTheMatch}\n` : ''}
Read full match dispatch on the club site!`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Wednesday Night Touch: ${match.round}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-turf-600/20 text-turf-400 flex items-center justify-center border border-turf-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-['Chakra_Petch']">
              Share Match Dispatch
            </h3>
            <p className="text-xs text-slate-400">
              Formatted for family & team WhatsApp/SMS groups
            </p>
          </div>
        </div>

        {/* Text Preview Box */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto select-all leading-relaxed">
          {shareText}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-turf-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Summary Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Send to WhatsApp</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="col-span-2 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-turf-600 hover:bg-turf-500 text-white font-bold text-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share via Phone Menu (SMS / AirDrop)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
