import os
import sys
import json
import struct
from datetime import datetime, timezone

# Configure UTF-8 output on Windows
sys.stdout.reconfigure(encoding='utf-8')

from google import genai
from google.genai import types

# 1. Primary API Key from environment or .env
api_key = os.environ.get('GEMINI_API_KEY')
if not api_key and os.path.exists('.env'):
    with open('.env', 'r', encoding='utf-8') as f:
        for line in f:
            if line.startswith('GEMINI_API_KEY='):
                api_key = line.strip().split('=', 1)[1]
                break

if not api_key:
    raise ValueError('GEMINI_API_KEY not found in environment or .env')

os.environ['GEMINI_API_KEY'] = api_key
client = genai.Client(api_key=api_key)

# 2. Setup Directories
audio_dir = os.path.join('public', 'audio')
os.makedirs(audio_dir, exist_ok=True)

# 3. Universal Dedicated Prebuilt Australian Voices
MICK_VOICE_ID = 'en-au-csagent-1'  # 36yo Sydney AU male - enthusiastic, engaging, and fun!
GAZZA_VOICE_ID = 'en-au-tutor-5'   # 57yo Sydney AU male - conversational, dry humor, and warm!

# 4. Semi-Final Storm Washout Script with Native Expression Tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# Listener Backchannels (|...|), and natural punctuation (... and -) for timing.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome to a thunder-and-lightning edition of The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and stone the crows... Mother Nature dropped an absolute cracker of a storm over the Redlands at half past four this arvo! <gasp> Roads flooded like Venice, lightning bolts slamming down dangerously close to The Point Takeaway shop, and the Semi-Finals? Officially called off! <sigh> No footy tonight, legends!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "Complete shutdown across Cleveland, Mick. |fair dinkum| Technically, the actual turf might have soaked up enough moisture to scrape through, but when Thor himself is throwing lightning bolts two hundred meters from Graeme's front counter, player safety makes cancellation a fairly straightforward decision. As Graeme put it in the official dispatches tonight... No customers for the shop. No Touch Footy. Roads flooded. Pretty boring really."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "Haha! 'Pretty boring really!' You've got to feel for the gaffer Graeme sitting in an empty shop watching rivers flow down the street! Zero customers braving the flash floods and zero footy to watch! <laugh> Mind you, once the storm waters subside tomorrow, every single supporter needs to march straight down to The Point Takeaway and clear out the fryers to make up for it! Give us a hot chips blizzard with extra chicken salt, please!"
    },
    {
        "speaker": "Gazza",
        "style": "warm, appreciative, commercial announcer",
        "text": "Amen to that, Mick. Golden crispy battered fish, a legendary Point Takeaway Burger with the Lot, and hot crunchy potato scallops to cure the Wednesday washout blues. Best feed in the Redlands. ... Now, let's get tactical, because here is the fascinating plot twist of tonight's lightning storm. This cancellation might actually be the biggest tactical stroke of luck of our entire season."
    },
    {
        "speaker": "Mick",
        "style": "incredulous, hyped up, curious",
        "text": "<gasp> Talk to me Gazza! How does getting struck by lightning near the chippy help the boys win the championship?!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, amused, measured",
        "text": "Have a squiz at the availability sheet for tonight's planned 1 versus 4 Semi-Final against Hunt and Kill. We were rolling onto the paddock minus three absolute superstars. ... First, Peter was sidelined in the casualty ward nursing an injury. Second, brother Matt was completely unavailable tonight. And third... brace yourself, Mick... Jayden wasn't running lines because he is getting MARRIED!"
    },
    {
        "speaker": "Mick",
        "style": "ecstatic, laughing, celebratory",
        "text": "<laugh> JAYDEN IS GETTING MARRIED?! <gasp> You beauty! Massive, massive congratulations from Mick, Gazza, and the entire Point Takeaway family to Jayden and the bride! |bloody oath!| Imagine scheduling a wedding during Finals Week 1... and then having Mother Nature personally intervene with a biblical storm so you don't even miss a single minute of touch footy! That is elite-tier planning right there, Jayden!"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, deadpan, smiling",
        "text": "<chuckle> Either elite planning or someone in the Point Takeaway front row has an unusually tight line of communication with the weather bureau. Bottom line is, Graeme summed it up with classic understatement: We had 3 players missing tonight. Peter injured, Jayden getting married, Matt unavailable... So, might be a good thing for us. With no game played, Peter gets another seven days to heal up, Matt clears his schedule, and Jayden returns from confetti duties ready to slice up the finals."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, fast-paced, hyped",
        "text": "Haha! Pure destiny, mate! |you beauty!| Speaking of destiny, Gazza... walk the faithful through what this washout means for next Wednesday, the eighteenth of November!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "Well, because Point Takeaway finished the regular season as outright Minor Premiers... sitting pretty at the top of the table on twenty-five points with that monstrous plus twenty-eight differential after the 12-to-1 demolition last week... skipping the washed-out Semi-Finals leaves only one logical climax. As Graeme reported tonight... Looks likely that our next game will be the Grand Final next Wednesday. One versus two!"
    },
    {
        "speaker": "Mick",
        "style": "pumped up, excited, dramatic",
        "text": "<gasp> ONE VERSUS TWO! THE GRAND FINAL! Point Takeaway versus Bonsai for the entire Wednesday Seniors crown! <laugh> Remember Round 8 when just seven exhausted Point Takeaway blokes fought Bonsai to a 6-8 thriller before vowing revenge? Now, all guns blazing, full squad rested, Jayden glowing in newlywed superpowers, Reece's jetpacks oiled, Cam and Matt telepathic... one forty-minute dance for immortality!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, calm",
        "text": "We haven't had a tougher rival all season than Bonsai. Same twenty-five competition points as us, separated only by our eighteen-point edge in scoring differential. If the Grand Final locks in for next Wednesday night, it will take every drop of discipline, line speed, and clinical touch footy we produced against The Touchers and The Well Hungarians. Rest up tonight, lads, stay out of the floodwater, and get your minds dialed in for Championship Wednesday."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Stay dry, Redlands! Swing past The Point Takeaway this week to fuel the fryers, raise a cold glass to Jayden's wedding, and get strapped up for what shapes as the biggest night of the year next Wednesday... 1 versus 2 for the trophy! Up the Point Takeaway!"
    }
]

def synthesize_sf_washout_wrap():
    print('🏉 === THE WRAP: SEMI-FINAL LIGHTNING WASHOUT & GRAND FINAL PREVIEW === 🏉')
    print(f'🎙️ Host A (Mick): {MICK_VOICE_ID}')
    print(f'🎙️ Host B (Gazza): {GAZZA_VOICE_ID}')
    print(f'📝 Turns to synthesize: {len(SCRIPT_TURNS)}')

    parts = []
    for turn in SCRIPT_TURNS:
        parts.append(
            types.Part(
                text=turn['text'],
                speech_metadata=types.SpeechMetadata(
                    speaker=turn['speaker'],
                    style=turn['style']
                )
            )
        )

    speech_config = types.SpeechConfig(
        multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
                types.SpeakerVoiceConfig(
                    speaker='Mick',
                    voice_config=types.VoiceConfig(voice=MICK_VOICE_ID)
                ),
                types.SpeakerVoiceConfig(
                    speaker='Gazza',
                    voice_config=types.VoiceConfig(voice=GAZZA_VOICE_ID)
                )
            ]
        )
    )

    models_to_try = ['gemini-3.8-flash-tts', 'gemini-3.8-flash-lite-tts']
    audio_data = None
    used_model = None

    for model in models_to_try:
        print(f'\n⏳ Calling {model} with {len(parts)} staged turns...')
        try:
            response = client.models.generate_content(
                model=model,
                contents=[
                    types.Content(
                        role='user',
                        parts=parts
                    )
                ],
                config=types.GenerateContentConfig(
                    response_modalities=['AUDIO'],
                    speech_config=speech_config
                )
            )
            candidate = response.candidates[0]
            inline = candidate.content.parts[0].inline_data
            if inline and inline.data:
                audio_data = inline.data
                used_model = model
                print(f'✨ SUCCESS with {model}! Audio bytes received: {len(audio_data):,} ({inline.mime_type})')
                break
        except Exception as e:
            print(f'⚠️ Error on {model}: {e}')

    if not audio_data:
        raise RuntimeError('Failed to synthesize multi-speaker audio across candidate models')

    wav_path = os.path.join(audio_dir, 'the-wrap-semi-final-washout.wav')
    if audio_data[:4] == b'RIFF':
        final_wav_bytes = audio_data
    else:
        sample_rate = 24000
        channels = 1
        bits = 16
        byte_rate = sample_rate * channels * (bits // 8)
        block_align = channels * (bits // 8)
        data_len = len(audio_data)
        riff_header = struct.pack(
            '<4sI4s4sIHHIIHH4sI',
            b'RIFF',
            36 + data_len,
            b'WAVE',
            b'fmt ',
            16,
            1,
            channels,
            sample_rate,
            byte_rate,
            block_align,
            bits,
            b'data',
            data_len
        )
        final_wav_bytes = riff_header + audio_data

    with open(wav_path, 'wb') as f:
        f.write(final_wav_bytes)

    pcm_length = max(0, len(final_wav_bytes) - 44)
    duration_sec = round(pcm_length / 48000.0, 1)
    mins = int(duration_sec // 60)
    secs = int(duration_sec % 60)
    formatted_duration = f'{mins}:{secs:02d}'

    print(f'\n🎉 MASTER AUDIO READY: {wav_path}')
    print(f'⏱️ Duration: {formatted_duration} ({duration_sec}s)')
    print(f'📦 File size: {len(final_wav_bytes) / (1024 * 1024):.2f} MB')
    print(f'🎙️ Synthesized natively with model: {used_model}')

    # Metadata
    metadata = {
        'id': 'the-wrap-semi-final-washout',
        'round': 'Semi-Final (Washout)',
        'date': '2026-11-11',
        'title': 'The Wrap: Lightning Strikes the Redlands, Wedding Bells for Jayden & Straight to 1 vs 2 Grand Final!',
        'matchId': '2026-11-11-semi-final-washout',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-semi-final-washout.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-semi-final-washout.json'), 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    # Update theWrapEpisodes.json maintaining all rounds
    episodes_path = os.path.join('src', 'data', 'theWrapEpisodes.json')
    episodes = []
    if os.path.exists(episodes_path):
        try:
            with open(episodes_path, 'r', encoding='utf-8') as f:
                episodes = json.load(f)
        except Exception:
            episodes = []

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-semi-final-washout']
    filtered_episodes.append(metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Semi-Final Lightning Washout special!')

if __name__ == '__main__':
    synthesize_sf_washout_wrap()
