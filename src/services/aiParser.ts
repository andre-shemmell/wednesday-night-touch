import { MatchReport } from '../types/match';
import { parseSmsHeuristic } from './heuristicParser';

const SYSTEM_INSTRUCTION = `You are an expert sports analyst and copywriter specializing in grassroots Australian Wednesday Night Touch Football (Touch Footy).
You will receive raw SMS match reports written by a proud father and team member.
Your job is to parse the SMS into a high-fidelity, structured JSON object matching the MatchReport schema.

Guidelines:
- Maintain the father's warm, humorous, authentic Aussie tone and grassroots jargon ("blokes", "young blokes", "soft send off", "6 more", "disallowed try", "stitches", "A Great Leave").
- Extract exact scores (Halftime HT, Fulltime FT). Determine outcome ('win', 'loss', or 'draw').
- Extract all try scorers and their try counts (Dylan, Cam, Joel, Jayden, etc.).
- Extract all defensive highlights (try-saving tags, intercepts, "A Great Leave", goal-line stands).
- Extract the Casualty Ward: injuries, illnesses, especially hilarious self-inflicted wounds (e.g. Mitch's 5 stitches).
- Extract referee controversies, soft send-offs, and disallowed tries.
- Extract venue / parking conditions (e.g. "severe parking problems").
- Extract the Dad's closing "Summing Up" quote verbatim.
- Suggest a punchy, humorous, celebratory headline.
- Assign fun awards: "Player of the Match", "Moment of the Match" (e.g., "Nev's 'A Great Leave'"), and "Quote of the Match".

Respond strictly with valid JSON conforming to the requested schema.`;

const JSON_SCHEMA = {
  type: 'object',
  properties: {
    headline: { type: 'string' },
    date: { type: 'string', description: 'YYYY-MM-DD format, default to today or extracted date' },
    round: { type: 'string', description: 'e.g. Round 1, Round 2' },
    season: { type: 'string', description: 'e.g. Spring 2026' },
    teamName: { type: 'string', description: 'Team name, e.g. Point Takeaway' },
    opponent: { type: 'string', description: 'Opponent team name' },
    score: {
      type: 'object',
      properties: {
        us: { type: 'number' },
        them: { type: 'number' },
        halfTimeUs: { type: 'number' },
        halfTimeThem: { type: 'number' },
        outcome: { type: 'string', enum: ['win', 'loss', 'draw'] }
      },
      required: ['us', 'them', 'halfTimeUs', 'halfTimeThem', 'outcome']
    },
    dadQuote: { type: 'string', description: "Verbatim Dad's summing up closing quote" },
    storyParagraphs: {
      type: 'array',
      items: { type: 'string' },
      description: 'Clean formatted narrative paragraphs'
    },
    tryScorers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          player: { type: 'string' },
          count: { type: 'number' },
          notes: { type: 'string' }
        },
        required: ['player', 'count']
      }
    },
    defensiveHighlights: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          player: { type: 'string' },
          action: { type: 'string' }
        },
        required: ['player', 'action']
      }
    },
    casualtyWard: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          player: { type: 'string' },
          reason: { type: 'string' },
          isSelfInflicted: { type: 'boolean' }
        },
        required: ['player', 'reason']
      }
    },
    controversies: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' }
        },
        required: ['title', 'description']
      }
    },
    venueNotes: { type: 'string' },
    squadNotes: { type: 'string' },
    squadPresent: { type: 'array', items: { type: 'string' } },
    squadMissing: { type: 'array', items: { type: 'string' } },
    awards: {
      type: 'object',
      properties: {
        playerOfTheMatch: { type: 'string' },
        momentOfTheMatch: { type: 'string' },
        quoteOfTheMatch: { type: 'string' }
      }
    }
  },
  required: ['score', 'dadQuote', 'storyParagraphs', 'tryScorers', 'defensiveHighlights', 'casualtyWard']
};

export async function parseSmsWithGemini(
  rawSms: string,
  apiKey?: string,
  modelName: string = 'gemini-3.8-flash'
): Promise<MatchReport> {
  const smsText = rawSms.replace(/^(?:hey|hi|g'day|hello)\s+[a-zA-Z\u00C0-\u017F]+[,.]?\s*\n*/i, '').trim();
  const activeKey = apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

  if (!activeKey) {
    console.warn('No Gemini API key provided. Falling back to built-in heuristic parser.');
    const heuristic = parseSmsHeuristic(smsText);
    return {
      id: `${new Date().toISOString().split('T')[0]}-round`,
      date: heuristic.date || new Date().toISOString().split('T')[0],
      round: heuristic.round || 'Round 1',
      season: heuristic.season || '2026',
      teamName: heuristic.teamName || 'Point Takeaway',
      opponent: heuristic.opponent || 'The Opposition',
      score: heuristic.score || { us: 0, them: 0, halfTimeUs: 0, halfTimeThem: 0, outcome: 'draw' },
      dadQuote: heuristic.dadQuote || '',
      headline: 'Match Report: Grassroots Wednesday Footy',
      rawSmsText: smsText,
      storyParagraphs: heuristic.storyParagraphs || [smsText],
      tryScorers: heuristic.tryScorers || [],
      defensiveHighlights: heuristic.defensiveHighlights || [],
      casualtyWard: heuristic.casualtyWard || [],
      controversies: heuristic.controversies || [],
      venueNotes: heuristic.venueNotes || '',
      squadNotes: heuristic.squadNotes || '',
      squadPresent: heuristic.squadPresent || [],
      squadMissing: heuristic.squadMissing || [],
      awards: heuristic.awards || {},
    };
  }

  // Call Google Gemini REST API directly with responseSchema & responseMimeType: application/json

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `Here is the Dad's Wednesday night touch footy write-up:\n\n${smsText}\n\n` +
              `Contextual Information for Redlands Touch Association:\n` +
              `- Matches are played on Wednesday nights.\n` +
              `- Most recent match date: Wednesday, 30 September 2026 (Round 9).\n` +
              `- Previous rounds for reference: Round 8 was 2026-09-09, Round 7 was 2026-09-02, Round 6 was 2026-08-26, Round 5 was 2026-08-19.\n` +
              `- Team name is "Point Takeaway".\n` +
              `- Please accurately infer the date (YYYY-MM-DD) and round (e.g. "Round 9") matching the competition schedule.`
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: SYSTEM_INSTRUCTION
        }
      ]
    },
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
      responseSchema: JSON_SCHEMA,
    }
  };

  // Attempt call with automatic retry and fallback: 3.8 Flash -> 3.7 Flash -> 2.5 Flash
  const modelsToTry = [modelName];
  if (!modelsToTry.includes('gemini-3.7-flash')) {
    modelsToTry.push('gemini-3.7-flash');
  }
  if (!modelsToTry.includes('gemini-2.5-flash')) {
    modelsToTry.push('gemini-2.5-flash');
  }

  let lastError: Error | null = null;
  let textOutput: string | null = null;
  let successfulModel = '';

  for (const currentModel of modelsToTry) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${activeKey}`;
    
    // Up to 2 attempts per model (immediate attempt + quick backoff retry)
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (response.status === 503 || response.status === 429) {
          const errBody = await response.text();
          console.warn(`[${currentModel}] attempt ${attempt} got ${response.status} (High Demand): ${errBody}`);
          if (attempt === 1) {
            // Wait 1.5s before retrying this model
            await new Promise(res => setTimeout(res, 1500));
            continue;
          }
          // After attempt 2 on this model, break to fallback model in cascade
          break;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gemini API error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textOutput) {
          successfulModel = currentModel;
          break;
        }
      } catch (err: any) {
        lastError = err;
        if (attempt === 1 && !err.message?.includes('API error (4')) {
          await new Promise(res => setTimeout(res, 1500));
          continue;
        }
      }
    }

    if (textOutput) {
      break;
    }
  }

  if (!textOutput) {
    throw lastError || new Error('Gemini API is currently overloaded across all models. Please try again in a moment or use the Instant Offline Heuristic.');
  }

  console.log(`Successfully generated match report using model: ${successfulModel}`);

  const parsed = JSON.parse(textOutput);

  return {
    id: `${parsed.date || new Date().toISOString().split('T')[0]}-${(parsed.round || 'match').toLowerCase().replace(/\s+/g, '-')}`,
    date: parsed.date || new Date().toISOString().split('T')[0],
    round: parsed.round || 'Round 1',
    season: parsed.season || '2026',
    teamName: parsed.teamName || 'Point Takeaway',
    opponent: parsed.opponent || 'The Opposition',
    score: parsed.score,
    dadQuote: parsed.dadQuote,
    headline: parsed.headline || 'Wednesday Night Touch Footy',
    rawSmsText: smsText,
    storyParagraphs: parsed.storyParagraphs || [],
    tryScorers: parsed.tryScorers || [],
    defensiveHighlights: parsed.defensiveHighlights || [],
    casualtyWard: parsed.casualtyWard || [],
    controversies: parsed.controversies || [],
    venueNotes: parsed.venueNotes,
    squadNotes: parsed.squadNotes,
    squadPresent: parsed.squadPresent || [],
    squadMissing: parsed.squadMissing || [],
    awards: parsed.awards,
  };
}
