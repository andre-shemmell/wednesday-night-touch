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

# 4. Round 14 Washout & Sponsor Ad Script with Native Expression Tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# Listener Backchannels (|...|), and natural punctuation (... and -) for timing.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome to a special wet weather edition of The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and strewth... <sigh> mother nature has broken our collective hearts tonight! Cleveland Showgrounds has copped days of torrential Queensland rain, the council threw the padlock on the gates, and Round 14 against The Well Hungarians was officially called off due to waterlogged fields! <sigh> An absolute heartbreaker for the faithful!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "A bitter pill to swallow, Mick. |fair dinkum| When you're sitting outright first on the ladder on twenty-two points after destroying the top two teams in last week's double header, all the boys wanted was to run out and put another clinic on the paddock. But looking at Field 3 tonight, you'd need a snorkel and a tinny just to reach the tryline. Sensible decision from the association... nobody wants blown hamstrings or ruined turf right before the finals."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "Haha! A tinny with an outboard motor, mate! But Graeme summed up the team vibe in the group dispatches: Tonight's games were cancelled due to wet fields. We have had a lot of rain lately. So everyone is disappointed. <sigh> You could feel the collective groan from Cleveland all the way to Brisbane! But Gazza, the gaffer dropped a juicy tactical prediction right after!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "He certainly did. Graeme noted: I am only guessing, but we may need to play a double header next week. ... And think about that, Mick. With only one regular season week left before finals, the association will likely double up the schedule next Wednesday, the fourth of November. That means Point Takeaway backing up to play both The Well Hungarians and second-placed Bonsai on the same night."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "Another double header! |bloody oath!| Bring it on, I say! We swept Hunt and Kill and The Touchers back-to-back in fifty minutes without breaking a sweat, so if the comp wants to throw fifty more minutes at the ladder leaders next week, the boys will be licking their chops! <laugh> But speaking of licking your chops, Gazza... no footy tonight means the troops need feeding!"
    },
    {
        "speaker": "Gazza",
        "style": "warm, authoritative, commercial announcer",
        "text": "And that brings us to the most important part of tonight's broadcast, Mick. A massive shoutout to the legends who put the jerseys on our backs and fuel our club culture... our proud major sponsor, The Point Takeaway!"
    },
    {
        "speaker": "Mick",
        "style": "passionate, hyped, energetic",
        "text": "The Point Takeaway! You beauty! |spot on| While the footy fields are under water, their fryers are sizzling hot, mate! We are talking golden, crispy battered fish that melts in your mouth, fresh sea salt, and a mountain of hot chips buried under a proper Queensland blizzard of chicken salt! <laugh> Extra yellow, legends, that is how you do it!"
    },
    {
        "speaker": "Gazza",
        "style": "appreciative, smooth Queensland drawl",
        "text": "Don't forget the burgers, Mick. The famous Point Takeaway Burger with the Lot... thick beef patty, melted cheese, bacon, egg, beetroot, pineapple, and grilled onions on a toasted bun so big you have to tackle it with two hands. Graeme, Cam, and the boys swear by them for post-match recovery."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "Haha! It's bigger than Mack's wingspan, Gazza! And you've got to grab a paper bag of those crunchy homemade potato scallops and a tub of tartare! And wash it all down with a thick, frosty chocolate or lime milkshake! Pure bliss on a rainy Wednesday night!"
    },
    {
        "speaker": "Gazza",
        "style": "respectful, smiling, local pride",
        "text": "Whether it's raining cats and dogs or sunny on the bay, Point Takeaway has the goods to feed the whole family. Best fish and chips in the Redlands, top-shelf burgers, and friendly service with a smile. Support the local legends who support the ladder leaders."
    },
    {
        "speaker": "Mick",
        "style": "excited, emotional, pumped",
        "text": "Head into Point Takeaway tonight, tell 'em Mick and Gazza sent you, and grab yourself a feast fit for champions! |you beauty!| And Gazza, what's the plan for the squad between now and next Wednesday?"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, smiling",
        "text": "Hydrate, stretch, enjoy the hot chips, and prepare for a marathon double header. If the fixtures lock in as expected for next Wednesday, we take on The Well Hungarians followed immediately by Bonsai to seal the minor premiership. The destiny of this season is in our hands."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Too right, Gazza! Enjoy the wet weather rest, get into Point Takeaway for dinner, and get ready for a blockbuster double header next Wednesday night down at the Showgrounds! Up the Point Takeaway!"
    }
]

def synthesize_round14_wrap():
    print('🏉 === THE WRAP: ROUND 14 WASHOUT & POINT TAKEAWAY SPONSOR SPECIAL === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-14-washout.wav')
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
        'id': 'the-wrap-round-14-washout',
        'round': 'Round 14',
        'date': '2026-10-28',
        'title': 'The Wrap: The Cleveland Washout, Double Header Rumours & The Point Takeaway Fish & Chips Special!',
        'matchId': '2026-10-28-round-14',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-14-washout.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-14-washout.json'), 'w', encoding='utf-8') as f:
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

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-round-14-washout']
    filtered_episodes.append(metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Round 14 Washout special!')

if __name__ == '__main__':
    synthesize_round14_wrap()
