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

# 4. Round 15 Script with Native Expression Tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# Listener Backchannels (|...|), and natural punctuation (... and -) for timing.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome to a massive, history-making edition of The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and oh boy... after last week's washout, we rocked up to Field 3 at Cleveland Showgrounds and stone the crows! The pitch wasn't just dry... it was mowed and manicured like a pristine green bowling green carpet! <laugh> And what did the boys do on that carpet? A twelve-to-one slaughter of The Well Hungarians to seal the Minor Premiership! <laugh> You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "An absolute clinic on the green carpet, Mick. |fair dinkum| We started the match with just two on the bench. Adrian, Mitch, Mack, Dylan, Joely, Cam, Matt, and Peter were the early arrivals. But then the cavalry pulled into the car park... Reece, BJ, and look who decided to grace us with his presence... BJ's old man, Nev! Straight back from his three-week Scandinavian adventure chasing the Northern Lights. Graeme noted from the dugout that Nev looked pretty much the same as when he left, although he could probably do with a haircut. <chuckle> Eleven troops locked in, with only Jayden missing."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, incredulous",
        "text": "Haha! Welcome home Nev, get ya hair cut mate! But strewth Gazza, the boys were firing from the opening whistle! Joely dishes to Peter, Peter thinks fast, pops it right back inside, and Joely strolls over for 1-nil! And then Mitch, mate... Mitch pulls out a double-dummy that sent half the Hungarian team sliding towards the canteen! <laugh> Dummies to brother Mack, dummies again, and walks it over for 2-nil! You couldn't buy a ticket to that show!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "Mitch had them seeing ghosts. Matt then stepped into first receiver and delivered a lovely ball close to the line for Joely to nab his double for 3-nil. Then Reece turned on the turbochargers, broke the line, and found Matt in support, who made no mistake to push it out to 4-nil. And Matt was in sublime form, Mick. Moments later he threw a peach of a reverse inside pass to Mack, who took it right to the line for 5-nil. Pure team synergy."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "Absolute poetry! And then Cam decided he wanted a slice of the pie! <gasp> The Hungarians try to spin it wide, Cam reads it like the morning paper, snaffles the intercept, and casually strolls forty meters to the tryline for 6-nil into the sheds! |you beauty!| And Gazza, how about Mitch literally rolling over on the turf in defence to stop their runner?"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, amused, deadpan",
        "text": "<chuckle> A tactical barrel-roll, Mick. Full marks for commitment. But if the Hungarians thought the second half would bring relief, Reece came out and shredded them immediately. He tore through their middle, fed Mitch on the burst, and Mitch iced his double for 7-nil. Dylan was producing massive midfield tags, and then came the comedy highlight of the night. The Hungarians stepped two meters over the mark to play the ball, and all eleven Point Takeaway blokes screamed in unison, 'OVER THE MARK!' <laugh> The referee actually listened and blew the whistle for a penalty to us. Beautiful to witness."
    },
    {
        "speaker": "Mick",
        "style": "chuckling, spirited, emphatic",
        "text": "Haha! If you don't ask, you don't get, Gazza! And off that tap, Cam and Joely put on a masterclass! Cam throws a no-look reverse pass behind his back, Joely latches onto it and crashes over for a sensational hat-trick to make it 8-nil! <gasp> Three tries for Joely! Then Reece decides he's having a go... dummy, dummy again, step, and dots it down for 9-nil! They were completely bamboozled!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "Reece made it look effortless. And the Hungarians were in total disarray. Coming out of their own red zone, their playmaker threw a pass straight to Cam! He couldn't believe his luck... snatched it and ran sixty meters the length of the paddock to blow it out to 10-nil. |bloody oath!| And then, desperate to clear their line, they launched another long bomb straight into Mitch's breadbasket, and Mitch sprinted seventy meters untouched to complete his own blistering hat-trick for 11-nil!"
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "<laugh> Hat-tricks for Joely, hat-tricks for Mitch, and Cam bagging a double off two runaway intercepts! And the official scorebook ended up twelve to one because in the final ten seconds, the Hungarians threw a desperation pass to a bloke who wasn't even in the play area, and somehow he held on for their only try! Graeme just shook his head and said, quote, Oh, ok, well done them! Haha!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "A twelve-to-one demolition. And Graeme delivered the ultimate praise in the post-match summary: This game was one of our best ever. Every player did what was needed to beat this team. We can now go into the finals program with great confidence. Absolutely marvellous. ... And Mick, have a look at the final regular season ladder."
    },
    {
        "speaker": "Mick",
        "style": "excited, competitive, pumped",
        "text": "Strewth Gazza, feast your eyes on that table! Point Takeaway finishes outright FIRST on twenty-five competition points with a colossal plus twenty-eight differential! Minor Premiers of the Redlands Wednesday Seniors! <laugh> Sixty-six tries scored across the season! The ultimate prize is in sight!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, anticipatory, big match build-up",
        "text": "Which brings us to next Wednesday night, the eleventh of November, down at Cleveland Showgrounds. It is Finals Week One. The Major Semi-Final... 1 versus 4... Point Takeaway taking on Hunt and Kill. Win that, and the boys earn a direct ticket straight into the Grand Final. It doesn't get any bigger than this."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Major Semi-Final fever, legends! Get down to Point Takeaway for your pre-game burgers, pack the grandstand at the Showgrounds next Wednesday, and let's bring home the silverware! Up the Point Takeaway!"
    }
]

def synthesize_round15_wrap():
    print('🏉 === THE WRAP: ROUND 15 MINOR PREMIERSHIP SPECIAL (12-1 VS HUNGARIANS) === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-15.wav')
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
        'id': 'the-wrap-round-15',
        'round': 'Round 15',
        'date': '2026-11-04',
        'title': 'The Wrap: The 12-1 Green Carpet Demolition, Nev\'s Return & Minor Premiership Glory!',
        'matchId': '2026-11-04-round-15',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-15.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-15.json'), 'w', encoding='utf-8') as f:
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

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-round-15']
    filtered_episodes.append(metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Round 15 special!')

if __name__ == '__main__':
    synthesize_round15_wrap()
