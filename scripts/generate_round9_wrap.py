import os
import sys
import json
import base64
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

# 4. Round 9 Script with verified acoustic tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# listener backchannels (|...|), and natural punctuation (... and -) for timing.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome back to The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and oh boy... Round 9 was a heart-stopping, cardiac-arrest thriller down at Cleveland Showgrounds! First game back after a three-week break while the council had the fields locked down for Showgrounds activities. And fair dinkum, we turned up with eight troops, Nev and BJ sprinting onto the paddock right on the kickoff hooter, and played out an absolute 6-all blockbuster against United! <laugh> You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "A proper war of attrition, Mick. |fair dinkum| Coming off a three-week layoff with zero cardio is tough enough, but we were down to the bare bones. Peter and Reece were still in the casualty ward, Jayden was unavailable, and Adrian was over in Thailand living his best life. So with just two fresh legs on the sub bench, the game fell into an agonizing pattern. The gaffer Graeme dubbed it 'The Catchup'. United would sneak ahead, and we'd have to bust a gut to pull them back."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, incredulous",
        "text": "Haha! Pure catchup footy! But mate, we drew first blood! Cam got busy deep in attack, drew the markers, and Mitch somehow squeezed through a needle-eye gap between two United defenders to dot it down for 1-nil! <laugh> Those defenders were so close they could've checked his pulse, but the ref gave the all clear!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "United hit back quickly when an errant defensive pass bounced off Nev to level it 1-all, and then they crossed again out wide to take the lead at 1-2. But Mitch wasn't having a bar of it. Matt and Joely worked a sweet midfield platform, dished to Mitch on the charge, and he iced his double to square the ledger at 2-all."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "And then came the first controversial call of the night! <gasp> United throws a pass that was at least two meters forward... fair dinkum, it was practically in another postcode, but the ref pays it and they go up 2-3! <laugh> Stone the crows! But you can't keep Cam quiet for long. He pulls out the playmaking magic, feeds his brother Matt slicing into a hole, and Matt slams it down to lock it up at 3-all into the sheds!"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, amused, deadpan",
        "text": "Halftime 3-all was a miracle given our heavy legs, Mick. |bloody oath!| But the second half was pure drama. United crossed early to make it 3-4, but Nev made amends in defence, corralling their winger right into the corner to force a turnover penalty. And off that tap, Joely produced one of the bravest diving tries of the season, crashing through three defenders to level it at 4-all."
    },
    {
        "speaker": "Mick",
        "style": "chuckling, spirited, emphatic",
        "text": "Haha! Classic Joely, fear is not in that bloke's vocabulary! Meanwhile, Dylan was having an absolute field day in defence! <chuckle> He was tagging blokes left, right, and centre... anything that moved in a United jersey got chopped down! But United got lucky again out wide, catching Nev isolated on the wing to snatch a 4-5 lead with ten minutes to go!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "And that set the stage for total chaos in the middle of the paddock. The referee yelled out, quote, play on, while the entire United defence froze thinking there was a stoppage. Joely didn't hesitate for a second... he put his head down, sprinted straight through their offside defenders, and put it down to square it up at 5-all. Tactical awareness at its finest."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "<laugh> Play to the whistle, legends! But mate, United struck right back out wide with two minutes on the clock to make it 5-6! Time ticking away, the legs were screaming, and it looked like we were cooked!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "And that's when Cam stepped up for the play of the match. Graeme wrote in his official match report: when Cam sees the light, anything can happen. Cam took the ball forty meters out, saw the defensive line staggering, and backed himself. He pinned his ears back, sliced straight through three tired defenders, and planted the ball down under the black dot for 6-all right on the siren."
    },
    {
        "speaker": "Mick",
        "style": "excited, competitive, pumped",
        "text": "<gasp> Buzzer beater of the year! <laugh> Pure clutch from Cam! The final hooter blows as the ball hits the turf, and the boys walk away with an epic 6-all draw! What a finish! |you beauty!|"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, smiling",
        "text": "The gaffer Graeme was honest in his post-match summary: A draw. Initial reaction: No way. We played better. But we have to realise that a couple of things happened tonight. One: We were short of players. Two: We were not given the rub of the green. So many referee calls not addressing forward passes and touch-and-passes."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Spot on from the gaffer Graeme! We didn't get the rub of the green, but walking away with a point after three weeks off with eight blokes is pure guts and determination. What a comeback, what a squad! Up the Point Takeaway!"
    }
]

def synthesize_round9_wrap():
    print('🏉 === THE WRAP: ROUND 9 RECAP (PRIMARY GEMINI 3.8 FLASH TTS) === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-9.wav')
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

    # Round 9 Metadata
    round9_metadata = {
        'id': 'the-wrap-round-9',
        'round': 'Round 9',
        'date': '2026-09-30',
        'title': 'The Wrap: The Catchup Thriller, 3-Week Layoff & Cam\'s Siren Equalizer',
        'matchId': '2026-09-30-round-9',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-9.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-9.json'), 'w', encoding='utf-8') as f:
        json.dump(round9_metadata, f, indent=2)

    # Update theWrapEpisodes.json maintaining Round 11, Round 10, and Round 9
    episodes_path = os.path.join('src', 'data', 'theWrapEpisodes.json')
    episodes = []
    if os.path.exists(episodes_path):
        try:
            with open(episodes_path, 'r', encoding='utf-8') as f:
                episodes = json.load(f)
        except Exception:
            episodes = []

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-round-9']
    filtered_episodes.append(round9_metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Round 9!')

if __name__ == '__main__':
    synthesize_round9_wrap()
