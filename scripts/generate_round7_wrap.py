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

# 3. Universal Dedicated Prebuilt Australian Voices (No key scoping issues!)
MICK_VOICE_ID = 'en-au-csagent-1'  # 36yo Sydney AU male - enthusiastic, engaging, and fun!
GAZZA_VOICE_ID = 'en-au-tutor-5'   # 57yo Sydney AU male - conversational, dry humor, and warm!

# 4. Round 7 Script with Native Expression Tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# Listener Backchannels (|...|), and natural punctuation (... and -) for pauses.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome back to The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and oh boy... Round 7 was an absolute beauty! Cleveland Showgrounds, taking on The Well Hungarians, and the drama started before a single ball was even kicked! <laugh> The car park was an absolute war zone! Cam, Matt, and Jayden were stuck circling around Cleveland like lost tourists, meaning we had to tap off with just six blokes on the paddock! <laugh> You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "Severe parking crisis at the Showgrounds, Mick. |fair dinkum| Half the squad stuck in gridlock, and the casualty ward was already bulging. Mitch was in emergency with five stitches from a self-inflicted kitchen knife wound, Peter was battling respiratory issues, and Reece was still sidelined. But Mack stood tall right on our tryline, snatched a brilliant intercept, and sparked Joel and Dylan to combine for the opening try to make it 1-nil."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, animated",
        "text": "Haha! The Hungarians struck back to 1-all, but right on cue, the cavalry arrives from the car park! Cam, Matt, and Jayden sprint straight onto the paddock without even warming up! <laugh> Cam fires a pinpoint cutout pass to brother Matt, cracking the line wide open for Joely to waltz over for 2-1! And then Matt dishes a sweet pill to BJ, Cam puts on the afterburners, and feeds Jayden who makes no mistake for 3-1! Sliced them to ribbons!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "Textbook touch footy. Then Dylan and Jayden clamped down in defence, shutting down their outside runners. Moments later, Joel spotted Dylan on the fly, Jayden backed up with an inside sweep, and Cam simply walked through their line to make it 4-1. He made three defenders look like traffic cones, Mick. Made it look effortless."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "He was in cruise control! <laugh> The Hungarians sneaked a controversial one right on the halftime siren to peg it back to 4-2, but straight out of the sheds, Adrian earns six more, Joel delivers a crisp pass, and Dylan bags his second try of the night for 5-2! |you beauty!| Dylan was on fire, mate!"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, amused, deadpan",
        "text": "Dylan had a cracking night on the wing. But then, as always in Cleveland, the refereeing took center stage. The Hungarians attacked our right corner, their winger dropped the ball stone cold onto the grass, and the referee unbelievably signaled a try to make it 5-3. <sigh> Graeme in the dugout was in utter disbelief."
    },
    {
        "speaker": "Mick",
        "style": "incredulous, lively, chuckling",
        "text": "<gasp> Stone the crows Gazza! Blatant knock-on, but you've just got to laugh! And then Nev produces a monstrous fifty-meter charge right through the guts! Matt takes the offload, crashes over the line for what should've been 6-3, and the ref disallows it for an imaginary touch! You couldn't write the script, mate!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "And then came the comedy highlight of the second half: the soft send-off. Cam gets tackled completely off the ball by their defender. A brief scuffle ensues, and the referee marches both Cam and their bloke off for a two-minute cooling off period. <chuckle> Then Dylan breaks away for another clean runaway try, only for the two referees to hold a conference and inexplicably call it back. Baffling officiating."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "Haha! Pure comedy! But the lads kept their heads screwed on. Adrian pulls off a massive tackle in the middle, Mack takes the meters, and Joely pulls off a miraculous try-saving tag right on our stripe with two minutes on the clock! |bloody oath!| Huge heart from the boys!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "And then came the tactical masterclass from Nev. Graeme noted it specifically in the match archives. With the Hungarians launching their final desperate raid, the ball bounces loose near our dead-ball line. Nev stands tall and executes, quote, A Great Leave. He leaves the ball perfectly, lets it roll dead, and regains possession for Point Takeaway to seal the game. Pure veteran instinct."
    },
    {
        "speaker": "Mick",
        "style": "excited, competitive, pumped",
        "text": "<laugh> 'A Great Leave!' Only Nev could turn not touching the ball into the defensive play of the century! The final siren sounds, and the boys walk away with a gutsy 5 to 3 triumph over The Well Hungarians! What a win!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, smiling",
        "text": "A thoroughly deserved two points against a tricky opponent. And the gaffer Graeme summed up the team spirit with trademark warmth: Everyone played well tonight. We have a great range of ages of our players. We always did. But, everyone tonight played like young blokes. Good job."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Young blokes at heart, Gazza! From parking mayhem to phantom tries and soft send-offs, this squad just finds a way to get the job done! Up the Point Takeaway!"
    }
]

def synthesize_round7_wrap():
    print('🏉 === THE WRAP: ROUND 7 RECAP (UNIVERSAL EN-AU VOICES + BACKCHANNELS) === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-7.wav')
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

    # Round 7 Metadata
    round7_metadata = {
        'id': 'the-wrap-round-7',
        'round': 'Round 7',
        'date': '2026-09-02',
        'title': 'The Wrap: Parking Chaos, Young Blokes at Heart & The Great Leave',
        'matchId': '2026-09-02-round-7',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-7.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-7.json'), 'w', encoding='utf-8') as f:
        json.dump(round7_metadata, f, indent=2)

    # Update theWrapEpisodes.json maintaining all rounds
    episodes_path = os.path.join('src', 'data', 'theWrapEpisodes.json')
    episodes = []
    if os.path.exists(episodes_path):
        try:
            with open(episodes_path, 'r', encoding='utf-8') as f:
                episodes = json.load(f)
        except Exception:
            episodes = []

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-round-7']
    filtered_episodes.append(round7_metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Round 7!')

if __name__ == '__main__':
    synthesize_round7_wrap()
