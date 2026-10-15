import fs from 'fs';
import path from 'path';

// 1. Load API Key
const envFile = fs.readFileSync('.env', 'utf8');
const apiKeyMatch = envFile.match(/GEMINI_API_KEY=([^\s]+)/);
if (!apiKeyMatch) {
  console.error('ERROR: GEMINI_API_KEY not found in .env');
  process.exit(1);
}
const apiKey = apiKeyMatch[1];

// 2. Ensure Audio Directory Exists
const audioDir = path.join('public', 'audio');
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

// 3. Load Match Data
const matchesData = JSON.parse(fs.readFileSync('src/data/matches.json', 'utf8'));
const round11Match = matchesData.find(m => m.id === '2026-10-14-round-11' || m.round === 'Round 11');

// 4. Full Thinking Scriptwriter LLM (Gemini 3.8 Flash with Maximum Reasoning Effort)
async function generateScriptWithFullThinking() {
  console.log('🧠 === SCRIPTWRITER LLM: GEMINI 3.8 FLASH FULL THINKING / MAX EFFORT === 🧠');
  console.log('🎯 Strategy: Deep chain-of-thought analysis for comedic timing, natural banter, and authentic Aussie cadence.');

  const scriptwriterPrompt = `You are an elite Australian sports comedy writer and podcast producer for "The Wrap", the official weekly recap podcast for Point Takeaway touch football team at Redlands Touch Association in Cleveland, Queensland.

TASK:
Write an authentic, hilarious, fast-paced dual-speaker podcast script reviewing Round 11 (Point Takeaway 7 - 2 Redlands Centurions), other division results, the ladder standings, and next week's massive double header.

HOSTS:
1. "Mick" (Voice: Fenrir): Colour commentator, enthusiastic ex-touch winger. High energy, loud, loves laughing, shouting "You beauty!", getting hyped about line breaks, and making fun of referee blunders.
2. "Gazza" (Voice: Charon): Tactical analyst, dry Aussie wit, deadpan cadence, team whisperer, smooth broad Queensland drawl.

CRITICAL RULES:
1. ZERO BRACKETED STAGE DIRECTIONS OR PARENTHETICALS:
   The TTS model reads aloud whatever text is provided. You MUST NEVER include tags like [excited], [laughing], (chuckles), or [broad Aussie accent].
   All emotion, laughter, and cadence MUST be expressed naturally through spoken words ("Haha", "Oh mate", "Strewth Gazza!", "Bloody oath mate", "Stone the crows!").
2. TEAM MANAGER NAME:
   The registered team manager and gaffer is GRAEME. Always refer to him as "Graeme" or "the gaffer Graeme". NEVER refer to him as "Dad".
3. PERSISTENT AUSTRALIAN ACCENT & COLLOQUIAL VERNACULAR THROUGHOUT:
   Maintain authentic Queensland Australian cadence and slang from start to finish:
   - "G'day", "fair dinkum", "you beauty", "bonza", "strewth", "stone the crows", "bloody oath", "have a squiz at the ladder", "right up their clobber", "in the sheds", "on the hooter", "quarter past eight Brisvegas time".
4. MATCH HIGHLIGHTS TO COVER (Round 11: 7-2 Win vs Redlands Centurions):
   - Pre-game drizzle at Cleveland Showgrounds, boys sheltering under the tin roof, skies clearing right on kickoff.
   - Nev absent from playing because he is flying off to see the Northern Lights.
   - The team ready: Cam, Matt, BJ, Jayden, Reece, Mitch, Mack, Adrian, Joely, Dylan, and Peter.
   - Centurions shock opening try in minute 1 (0-1).
   - Peter's mystery collision penalty running into his own teammate.
   - Jayden line break; Joely calm equalizer (1-1).
   - Cam bullet pass to Mack crashing over (2-1).
   - Centurions level at 2-2; Mack's heroic tag.
   - Peter dishing to Reece for 3-2.
   - Jayden and Dylan give-and-go through the middle for 4-2 into halftime.
   - Mitch solo try for 5-2 straight out of the sheds.
   - The double soft send-offs: Mack sent off to cool down, followed by Joely ("It's a referee thing!").
   - Reece tap penalty afterburners for 6-2 ("No, don't do it!").
   - Adrian's ankle-breaking step in the middle.
   - Cam never stops trying—seals the game with a try for 7-2.
   - Graeme's official post-match appraisal: "We played near to our best tonight. And it is good. Great to watch."
5. DIVISION RESULTS & LADDER STANDINGS:
   - The Touchers 8 - 2 United
   - Hunt and Kill 6 - 2 Screws
   - Bonsai 8 - 3 The Well Hungarians
   - Ladder: Touchers 1st (17pts), Hunt and Kill 2nd (17pts), Point Takeaway 3rd (16pts, +11 diff, league-best attack with 47 tries scored!), Bonsai 4th (16pts).
6. NEXT WEEK'S DOUBLE HEADER PREVIEW:
   - Wednesday 21 October on Field 6:
   - Game 1 at 8:15 PM Brisvegas time vs #2 Hunt and Kill!
   - Game 2 at 8:45 PM Brisvegas time vs #1 The Touchers!
   - Back-to-back grudge matches against the top two to blow the minor premiership wide open.

FORMAT:
Return a JSON array of 12-14 objects with "speaker" ('Mick' or 'Gazza') and "text".`;

  // Thinking Ladder: Maximum Effort First
  const thinkingConfigs = [
    { thinkingLevel: 'high' },
    { thinkingBudget: 24576 },
    { thinkingBudget: 16384 },
    { thinkingBudget: 8192 },
    { thinkingBudget: 4096 }
  ];

  let rawScript = null;

  for (const tConfig of thinkingConfigs) {
    const configLabel = tConfig.thinkingLevel ? `thinkingLevel: '${tConfig.thinkingLevel}'` : `thinkingBudget: ${tConfig.thinkingBudget}`;
    console.log(`⏳ Attempting script generation with ${configLabel}...`);

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: scriptwriterPrompt }] }],
          generationConfig: {
            thinkingConfig: tConfig,
            responseMimeType: 'application/json',
            responseSchema: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  speaker: { type: 'STRING' },
                  text: { type: 'STRING' }
                },
                required: ['speaker', 'text']
              }
            }
          }
        })
      });

      const data = await res.json();
      if (data.error) {
        console.warn(`  ⚠️ Spiked demand with ${configLabel}: ${data.error.message?.substring(0, 80)}...`);
        console.log('  ⏳ Waiting 10s before trying next thinking configuration...');
        await new Promise(r => setTimeout(r, 10000));
        continue;
      }

      const textPart = data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text;
      if (textPart) {
        const parsed = JSON.parse(textPart);
        if (Array.isArray(parsed) && parsed.length >= 10) {
          console.log(`✨ FULL THINKING SUCCESS! Generated ${parsed.length} turns using ${configLabel}`);
          rawScript = parsed;
          break;
        }
      }
    } catch (err) {
      console.warn(`  Exception on ${configLabel}:`, err.message);
      await new Promise(r => setTimeout(r, 10000));
    }
  }

  if (!rawScript) {
    throw new Error('Failed to generate script with full thinking LLM');
  }

  // Safety filter: strip any accidental brackets from LLM output
  return rawScript.map(turn => ({
    speaker: turn.speaker,
    text: turn.text.replace(/\[[^\]]+\]\s*/g, '').replace(/\([^)]+\)\s*/g, '').trim()
  }));
}

// 5. Load or Generate Script
const shouldRegenerate = process.argv.includes('--regenerate') || process.argv.includes('--write-script');
const episodesPath = path.join('src', 'data', 'theWrapEpisodes.json');
let script = [];
let episodeMeta = {};

if (fs.existsSync(episodesPath) && !shouldRegenerate) {
  try {
    const epList = JSON.parse(fs.readFileSync(episodesPath, 'utf8'));
    if (epList[0]?.transcript?.length) {
      episodeMeta = epList[0];
      script = epList[0].transcript;
      console.log(`📜 Loaded existing ${script.length}-turn script from ${episodesPath}`);
    }
  } catch (err) {
    console.warn('Could not read theWrapEpisodes.json:', err.message);
  }
}

if (!script.length || shouldRegenerate) {
  script = await generateScriptWithFullThinking();
}

// 6. Build Multi-Speaker Parts with speechMetadata
const parts = script.map(turn => ({
  text: turn.text,
  speechMetadata: {
    speaker: turn.speaker
  }
}));

console.log(`🎭 Staged dialogue prepared (${parts.length} parts)`);

// 7. Multi-Speaker TTS Staging Config
const multiSpeakerPayload = {
  contents: [{
    parts: parts
  }],
  generationConfig: {
    responseModalities: ['AUDIO'],
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          {
            speaker: 'Mick',
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Fenrir' }
            }
          },
          {
            speaker: 'Gazza',
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Charon' }
            }
          }
        ]
      }
    }
  }
};

// Target Models: Primary 3.8 Flash TTS -> Fallback 3.8 Flash Lite TTS
const ttsModels = [
  'gemini-3.8-flash-tts',
  'gemini-3.8-flash-lite-tts'
];

// Helper: Standard 44-byte WAV Header (24kHz, 16-bit, Mono)
function buildWavHeader(pcmLength, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
  const header = Buffer.alloc(44);
  const byteRate = sampleRate * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmLength, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmLength, 40);

  return header;
}

// 8. Execution Pipeline
async function runSingleRequestMultiSpeakerStaging() {
  console.log('🏉 === THE WRAP: PRODUCTION 3.8 FLASH TTS STAGING PIPELINE === 🏉');
  console.log(`🎯 Target: ${ttsModels[0]} (Production Primary) | Fallback: ${ttsModels[1]}`);

  let audioBuffer = null;
  let usedModel = null;
  let responseMimeType = null;

  for (const model of ttsModels) {
    console.log(`\n🎙️ Synthesizing complete ${script.length}-turn episode with: ${model}...`);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(multiSpeakerPayload)
      });

      const data = await res.json();

      if (data.error) {
        console.warn(`⚠️ [${model}] Error ${data.error.code}: ${data.error.message?.substring(0, 120)}...`);
        if (data.error.code === 429 || data.error.status === 'RESOURCE_EXHAUSTED') {
          console.log(`🔄 Quota 429 hit on ${model}. Trying fallback model...`);
          continue;
        }
        continue;
      }

      const inline = data.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      if (inline?.data) {
        usedModel = model;
        responseMimeType = inline.mimeType;
        const rawBytes = Buffer.from(inline.data, 'base64');
        console.log(`✨ SUCCESS with ${model}! Raw audio data received: ${(rawBytes.length / (1024 * 1024)).toFixed(2)} MB (${responseMimeType})`);

        if (responseMimeType && responseMimeType.toLowerCase().includes('wav')) {
          audioBuffer = rawBytes;
        } else if (responseMimeType && responseMimeType.toLowerCase().includes('l16')) {
          const header = buildWavHeader(rawBytes.length, 24000, 1, 16);
          audioBuffer = Buffer.concat([header, rawBytes]);
        } else {
          audioBuffer = rawBytes;
        }
        break;
      }
    } catch (err) {
      console.warn(`Exception calling ${model}:`, err.message);
    }
  }

  const outputWavPath = path.join(audioDir, 'the-wrap-round-11.wav');

  if (audioBuffer) {
    fs.writeFileSync(outputWavPath, audioBuffer);

    // Calculate duration from PCM size (total - 44 byte header)
    const pcmLength = Math.max(0, audioBuffer.length - 44);
    const durationSec = parseFloat((pcmLength / 48000).toFixed(1));
    const mins = Math.floor(durationSec / 60);
    const secs = (durationSec % 60).toFixed(0).padStart(2, '0');
    const formattedDuration = `${mins}:${secs}`;

    console.log(`\n🎉 MASTER PRODUCTION RECAP GENERATED!`);
    console.log(`📁 File saved to: ${outputWavPath}`);
    console.log(`⏱️ Duration: ${formattedDuration} (${durationSec}s)`);
    console.log(`📦 Size: ${(audioBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`🎙️ Rendered natively using: ${usedModel}`);

    // Update metadata with isAudioReady: true
    const metadata = {
      id: 'the-wrap-round-11',
      round: 'Round 11',
      date: '2026-10-14',
      title: 'The Wrap: Round 11 Clinic, Northern Lights & Double Header Fever',
      matchId: '2026-10-14-round-11',
      isAudioReady: true,
      modelUsed: usedModel,
      durationSeconds: durationSec,
      formattedDuration: formattedDuration,
      audioUrl: '/audio/the-wrap-round-11.wav',
      stagedNative: true,
      hosts: [
        { name: 'Mick "The Rocket" Ryan', voice: 'Fenrir', role: 'Colour Commentator' },
        { name: 'Gazza Shemmell', voice: 'Charon', role: 'Tactical Analyst' }
      ],
      transcript: script,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(path.join(audioDir, 'the-wrap-round-11.json'), JSON.stringify(metadata, null, 2));
    fs.writeFileSync(episodesPath, JSON.stringify([metadata], null, 2));
    console.log('✅ Updated episode metadata and transcript!');
  } else {
    console.log('\n🛑 Could not complete synthesis across available models.');
  }
}

runSingleRequestMultiSpeakerStaging().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
