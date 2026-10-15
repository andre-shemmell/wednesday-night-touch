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

// 3. Load Episode Script
const episodesPath = path.join('src', 'data', 'theWrapEpisodes.json');
let script = [];
let episodeMeta = {};

if (fs.existsSync(episodesPath)) {
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

if (!script.length) {
  console.error('No script found. Please generate or provide transcript.');
  process.exit(1);
}

// 4. Build Multi-Speaker Parts with speechMetadata
// Gemini 3.8 Flash TTS native multi-speaker staging requires:
// speechMetadata: { speaker: "Mick" } on each text part
const parts = script.map(turn => ({
  text: turn.text,
  speechMetadata: {
    speaker: turn.speaker
  }
}));

console.log(`🎭 Staged dialogue prepared (${parts.length} parts)`);

// 5. Multi-Speaker TTS Staging Config
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

// 6. Gemini TTS Models Hierarchy
// Production primary: gemini-3.8-flash-tts
// Secondary / testing fallback: gemini-3.8-flash-lite-tts
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

// 7. Execution Pipeline
async function runSingleRequestMultiSpeakerStaging() {
  console.log('🏉 === THE WRAP: PRODUCTION 3.8 FLASH TTS STAGING PIPELINE === 🏉');
  console.log(`🎯 Target: ${ttsModels[0]} (Production Primary) | Fallback: ${ttsModels[1]}`);

  let audioBuffer = null;
  let usedModel = null;
  let responseMimeType = null;

  for (const model of ttsModels) {
    console.log(`\n🎙️ Synthesizing complete 13-turn episode with: ${model}...`);
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
      ...episodeMeta,
      isAudioReady: true,
      modelUsed: usedModel,
      durationSeconds: durationSec,
      formattedDuration: formattedDuration,
      audioUrl: '/audio/the-wrap-round-11.wav',
      stagedNative: true,
      updatedAt: new Date().toISOString()
    };

    fs.writeFileSync(path.join(audioDir, 'the-wrap-round-11.json'), JSON.stringify(metadata, null, 2));
    fs.writeFileSync(episodesPath, JSON.stringify([metadata], null, 2));
    console.log('✅ Updated episode metadata with isAudioReady: true!');
  } else {
    console.log('\n🛑 Could not complete synthesis across available models.');
  }
}

runSingleRequestMultiSpeakerStaging().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
