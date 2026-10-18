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

# 4. Round 8 Script with Native Expression Tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# Listener Backchannels (|...|), and natural punctuation (... and -) for pauses.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome back to The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and oh boy... Round 8 was an absolute, certified, heroic epic! Field 5 down at Cleveland Showgrounds, taking on Bonsai, and fair dinkum, our casualty ward looked like the waiting room at Redland Hospital! <laugh> Five superstars missing! Joely with a nail through his foot at work, Mitch with five stitches in his finger, Peter with the flu, Reece on the mend, and Mack in sick bay! <laugh> Just seven blokes left standing! You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "Seven blokes against a squad of ten teenage sprinters, Mick. |fair dinkum| That meant we had exactly one substitute on the bench for the entire fifty minutes. And to make matters more interesting, Bonsai had this overzealous number 11 who was prancing around, teasing our defensive line. Graeme noted officially in the team dispatches, quote, who we no longer like because of his lack of respect for anybody. <chuckle> Needless to say, the boys took that personally."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, animated",
        "text": "Haha! Stone the crows, nobody disrespects the Point Takeaway boys! Bonsai jumped out to an early 2-nil lead, but then Cam took the steering wheel! He draws the markers, fires a peach of a ball to brother Matt, and Matt slices through to get us on the board for 1-2! Then Dylan makes a clutch tag, Jayden unleashes a rampaging Cam, and Cam slams it down for 2-all! Game on!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "The brotherly telepathy between Cam and Matt was firing on all cylinders. Right before the halftime siren, Cam attacking with trademark flair spots Matt on the burst again, Matt dives over for his double, and miraculously, our seven exhausted troops marched into the sheds leading 3-2... A tactical masterclass in slowing down the tempo."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "Leading at the break with one sub against kids half our age, mate! And we came out swinging in the second half! Cam finds an agile Jayden early, and Jayden dots it down to blow the lead out to 4-2! |you beauty!| The sideline was going off! But then, the sheer weight of numbers started taking its toll."
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, slightly sombre, tactical",
        "text": "Bonsai made four substitutions in two minutes and launched a furious counter-attack. Adrian was heroically soldiering on with severe calf muscle spasms, limping on one leg because we had nobody else to put on. Bonsai's young speedsters found space and ran in four straight tries to flip the game on its head at 4-6. It looked like the tank was bone dry."
    },
    {
        "speaker": "Mick",
        "style": "passionate, hyped, energetic",
        "text": "Most teams would've packed their bags and headed for the canteen, Gazza! But not this mob! Cam steps up again, puts the pill right on Matt's chest, and Matt crashes over to complete a sensational brother-combo hat-trick for 5-6! <gasp> And then Jayden, fair dinkum, Jayden runs the most sublime, untouched angle through their entire backline to score an absolute stunner and lock it up at 6-all with two minutes on the clock!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "Six-all with two minutes to play was pure sporting folklore, Mick. BJ was putting on a defensive clinic in the middle, and he produced the hit of the night, planting an absolute bell-ringer of a tag on their cocky number 11 that sent him skidding into the turf. <chuckle> Absolute poetic justice."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "<laugh> Oh, you couldn't wipe the smile off BJ's face! But then Bonsai managed to sneak over for 6-7 with sixty seconds left. We had one final attacking raid to steal a draw, the ball hits the grass, and everyone stops expecting the turnover hooter... but the referee yells, quote, Play On! <gasp> Bonsai scoop it up, sprint seventy meters the length of the paddock, and score on the final siren to make it 6-8!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "An absolute heartbreaker of a finish after fifty minutes of sheer warrior courage. But nobody hung their heads in the sheds. Graeme penned one of the greatest post-match appraisals in club history: <sigh> Wow. With only a couple of minutes to go, we were 6 all. Against a strong young team. And we were missing 5 of our great players. This has to be one of the best ever games by any team ever. So well done."
    },
    {
        "speaker": "Mick",
        "style": "excited, emotional, pumped",
        "text": "One of the best games by any team EVER! |bloody oath!| You can not buy heart like that at the chemist, Gazza! Seven blokes taking ten teenagers right to the wire, Matt bagging a hat-trick, and BJ putting their number 11 in his place! What a match!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, smiling",
        "text": "A legendary defeat that felt like a victory in spirit. When seven blokes dig that deep against overwhelming odds, you see the true character of this footy side. It is the kind of grit that defines a team for the rest of the season. True club culture right there."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Too right, Gazza! Proud of every single bloke who pulled on the jersey that night. Up the Point Takeaway!"
    }
]

def synthesize_round8_wrap():
    print('🏉 === THE WRAP: ROUND 8 RECAP (UNIVERSAL EN-AU VOICES + BACKCHANNELS) === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-8.wav')
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

    # Round 8 Metadata
    round8_metadata = {
        'id': 'the-wrap-round-8',
        'round': 'Round 8',
        'date': '2026-09-09',
        'title': 'The Wrap: The 7-Man Epic, Matt\'s Hat-Trick & The Best Game Ever',
        'matchId': '2026-09-09-round-8',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-8.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-8.json'), 'w', encoding='utf-8') as f:
        json.dump(round8_metadata, f, indent=2)

    # Update theWrapEpisodes.json maintaining all rounds
    episodes_path = os.path.join('src', 'data', 'theWrapEpisodes.json')
    episodes = []
    if os.path.exists(episodes_path):
        try:
            with open(episodes_path, 'r', encoding='utf-8') as f:
                episodes = json.load(f)
        except Exception:
            episodes = []

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-round-8']
    filtered_episodes.append(round8_metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Round 8!')

if __name__ == '__main__':
    synthesize_round8_wrap()
