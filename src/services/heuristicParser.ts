import { MatchReport } from '../types/match';

/**
 * Smart Heuristic Parser that runs locally in the browser with 0 external API calls.
 * Extracts scores, casualties, try scorers, highlights, and dad's quotes.
 */
export function parseSmsHeuristic(smsText: string): Partial<MatchReport> {
  const lines = smsText.split('\n').map(l => l.trim()).filter(Boolean);

  // Extract Scores
  let us = 0;
  let them = 0;
  let halfTimeUs = 0;
  let halfTimeThem = 0;

  const ftMatch = smsText.match(/FT\s*(\d+)\s*[-–:]\s*(\d+)/i) || smsText.match(/Full\s*Time\s*[:\s]*(\d+)\s*[-–:]\s*(\d+)/i);
  if (ftMatch) {
    us = parseInt(ftMatch[1], 10);
    them = parseInt(ftMatch[2], 10);
  }

  const htMatch = smsText.match(/HT\s*(\d+)\s*[-–:]\s*(\d+)/i) || smsText.match(/Half\s*Time\s*[:\s]*(\d+)\s*[-–:]\s*(\d+)/i);
  if (htMatch) {
    halfTimeUs = parseInt(htMatch[1], 10);
    halfTimeThem = parseInt(htMatch[2], 10);
  }

  // Extract Dad's Summing Up / Closing Quote
  let dadQuote = '';
  const summingUpIndex = lines.findIndex(l => /summing\s*up/i.test(l));
  if (summingUpIndex !== -1 && summingUpIndex < lines.length - 1) {
    dadQuote = lines.slice(summingUpIndex + 1).join(' ');
  } else {
    // Look for lines near the end
    const lastLines = lines.slice(-3);
    const goodJobLine = lastLines.find(l => /good job|well done|boys|played/i.test(l));
    if (goodJobLine) {
      dadQuote = goodJobLine;
    }
  }

  // Extract Missing / Casualties
  const casualties: Array<{ player: string; reason: string; isSelfInflicted?: boolean }> = [];
  const missingMatch = smsText.match(/missing\s+([^.\n]+)/i);
  if (missingMatch) {
    const rawMissing = missingMatch[1];
    const nameMatch = rawMissing.match(/([A-Z][a-z]+)\s*\(([^)]+)\)/);
    if (nameMatch) {
      casualties.push({
        player: nameMatch[1],
        reason: nameMatch[2],
        isSelfInflicted: /cut|self/i.test(nameMatch[2]),
      });
    }
  }

  // Check additional casualties
  const reCasualty = /([A-Z][a-z]+)\s*\(([^)]+)\)/g;
  let match;
  while ((match = reCasualty.exec(smsText)) !== null) {
    const pName = match[1];
    const reason = match[2];
    if (!casualties.some(c => c.player.toLowerCase() === pName.toLowerCase())) {
      casualties.push({
        player: pName,
        reason: reason,
        isSelfInflicted: /self|cut|stitches/i.test(reason),
      });
    }
  }

  // Detect Try Scorers
  const tryMap = new Map<string, number>();
  const tryPatterns = [
    /([A-Z][a-z]+)\s+(?:and\s+([A-Z][a-z]+)\s+combined.*?put down|went over for|ran through.*?to score|put it down|scored)/gi,
  ];

  for (const pat of tryPatterns) {
    let tryMatch;
    while ((tryMatch = pat.exec(smsText)) !== null) {
      const p1 = tryMatch[1];
      if (p1 && !['We', 'They', 'Then', 'So', 'Seconds', 'Everyone', 'Obviously'].includes(p1)) {
        tryMap.set(p1, (tryMap.get(p1) || 0) + 1);
      }
    }
  }

  // Identify players mentioned
  const commonPlayers = ['Cam', 'Matt', 'Jayden', 'Dylan', 'Joel', 'Mack', 'BJ', 'Adrian', 'Nev', 'Mitch', 'Peter', 'Reece'];
  const squadPresent: string[] = [];
  const squadMissing: string[] = casualties.map(c => c.player);

  for (const player of commonPlayers) {
    const regex = new RegExp(`\\b${player}\\b`, 'i');
    if (regex.test(smsText)) {
      if (!squadMissing.includes(player)) {
        squadPresent.push(player);
      }
    }
  }

  // Extract Ref Controversies
  const controversies: Array<{ title: string; description: string }> = [];
  if (/disallowed/i.test(smsText)) {
    const disallowedSentences = smsText.split(/[.\n]/).filter(s => /disallowed/i.test(s));
    disallowedSentences.forEach((s, idx) => {
      controversies.push({
        title: `Disallowed Try #${idx + 1}`,
        description: s.trim() + '.',
      });
    });
  }

  if (/sent off|send off/i.test(smsText)) {
    controversies.push({
      title: 'Soft Send-Off',
      description: 'Cam tackled without the ball; both players sent to the sin-bin for 2 minutes.',
    });
  }

  // Venue Notes
  let venueNotes = '';
  const parkingMatch = smsText.match(/parking\s+is\s+([^.\n]+)/i);
  if (parkingMatch) {
    venueNotes = `Parking is ${parkingMatch[1].trim()}.`;
  }

  const today = new Date().toISOString().split('T')[0];

  return {
    date: today,
    round: 'Next Round',
    season: '2026',
    teamName: 'Point Takeaway',
    opponent: 'The Opposition',
    score: {
      us,
      them,
      halfTimeUs,
      halfTimeThem,
      outcome: us > them ? 'win' : us < them ? 'loss' : 'draw',
    },
    dadQuote: dadQuote || 'Good job tonight blokes.',
    rawSmsText: smsText,
    storyParagraphs: smsText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean),
    casualtyWard: casualties,
    tryScorers: Array.from(tryMap.entries()).map(([player, count]) => ({
      player,
      count,
    })),
    squadPresent,
    squadMissing,
    controversies,
    venueNotes,
    awards: {
      momentOfTheMatch: /leave/i.test(smsText) ? "Nev's 'A Great Leave'" : undefined,
      quoteOfTheMatch: dadQuote,
    },
  };
}
