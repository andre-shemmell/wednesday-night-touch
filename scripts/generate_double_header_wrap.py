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

# 4. Double Header Script (Round 12 & 13) with Native Expression Tags (<laugh>, <chuckle>, <gasp>, <sigh>),
# Listener Backchannels (|...|), and natural punctuation (... and -) for timing.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome to a special blockbuster edition of The Wrap, your weekly hit of touch footy gold for Point Takeaway down at Redlands Touch Association! Mick here with Gazza, and stone the crows... Wednesday night was the mother of all assignments! A double header! Two twenty-five-minute sprint matches back-to-back on Field 6, no halftime break, slight mist in the air, taking on the top two teams on the competition ladder! <laugh> And what did the Point Takeaway machine do? We knocked off number two Hunt and Kill 3 to 1, and then held the ladder leaders The Touchers to a donut in a 4-nil clean-sheet shutout! <laugh> Top of the ladder, baby! You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "Tactical nirvana, Mick. |fair dinkum| Fifty minutes of footy against the competition heavyweights with zero margin for error. We tapped off game one with nine troops. Matt was absent, our mate Nev was off in Norway chasing the Northern Lights, and BJ was sprinting across the Cleveland car park after running slightly late. That left Cam, Reece, Dylan, Adrian, Mitch, Mack, Jayden, Joely, and Peter to face a physical Hunt and Kill side that was out to live up to its name."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, incredulous",
        "text": "Haha! Stone the crows Gazza, Hunt and Kill tried to set a tone on the very first touch! Peter takes the ball up, and their number 6 slams him straight across the neck! <gasp> High as a kite, Peter waits for the whistle, and the referee yells out, quote, Play on! You've got to laugh! But Joely pulls off a crunching tag to steady the ship, and then the speed machine kicked into gear!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "It was a masterclass in direct running. Cam surged forward and drew the cover, allowing Reece and Jayden to unleash Mitch on a burst. After a quick fumble exchange, Cam, Reece, and Peter worked a sweeping movement, firing a long bullet out wide to Mitch, who scorched down the sideline to open the scoring at 1-nil. Scoring first in a shortened twenty-five-minute match is pure gold."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "Mate, scoring first is everything! And then Peter's mate, their number 6, decides he wants another crack at Peter! <laugh> Whacks him hard again, and this time the ref has no choice but to hand the bloke a soft send-off to cool his jets on the sideline! And we punished them instantly! Cam and Jayden conjure up absolute magic, feed Peter in the hole, and Peter eagerly slams it down for 2-nil! |you beauty!|"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, amused, deadpan",
        "text": "Number 6 returned and sneaked one back from distance for 2-1, but Reece and Jayden were dominating the midfield ruck. Reece sliced through to score for 3-1, and from that point, our defence was an iron wall. Cam was knocking down passes like an Aussie slips fielder, Mitch made a crucial diving tag on our tryline, Dylan tagged everything moving, Joely worked tirelessly, Reece made a massive try-saver, and BJ arrived right on cue, making every single tag a winner."
    },
    {
        "speaker": "Mick",
        "style": "chuckling, spirited, emphatic",
        "text": "Haha! They threw an obvious forward pass right on our line that the linesman completely missed, but Jayden ran wild across the paddock to smother their final raid and lock away a famous 3 to 1 victory! |bloody oath!| But Gazza... the boys only had a ten-minute breather to catch their breath under the mist before facing the outright ladder leaders, The Touchers!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "And The Touchers are a serious touch footy team. Young, tall, fast, and averaging six tries a game. But BJ and Cam came out like men possessed, pressing their playmakers with suffocating line speed. The opening ten minutes was a scoreless war. Mack produced the defensive play of the night out wide, pulling off an acrobatic diving tag right on the chalk to deny a certain Touchers try."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "Diving tag of the year, Gazza! And then Reece steps up, engages the line, and pops a peach to Jayden, who dives over to break the deadlock at 1-nil! And talk to me about Adrian's try right after! <laugh> Mack makes a monstrous run straight through the guts, Dylan feeds Mitch, Mitch hits Adrian at full tilt, and Adrian runs straight over their line for 2-nil! He was absolutely loving life out on the wing!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "Adrian's smile lit up the Showgrounds. Mitch was unstoppable with his long-range bursts, Peter forced a crucial turnover in defence, and Cam took total command. Reece broke the line again for fifty metres, before Cam unleashed an exquisite cutout pass to Dylan, who crossed cleanly for 3-nil. Graeme wrote in his notes, quote, OMG. 3-nil. And only minutes to go. This is marvellous."
    },
    {
        "speaker": "Mick",
        "style": "excited, competitive, pumped",
        "text": "Haha! 'OMG. This is marvellous!' <laugh> Graeme said it best! And Cam wasn't finished! Mitch and Cam carve them up again, Cam splits their line like Moses parting the Red Sea, and dots down for 4-nil right before the final hooter! A 4-nil clean sheet! Holding the top team in the comp scoreless in a twenty-five-minute sprint! Strewth!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, smiling",
        "text": "A complete shutout against the competition leaders. Graeme summed it up with pure footy perfection: We played exceptionally well tonight in both games. And we won both games against the top two teams in our competition. In a word, Sensational. Well played guys. ... And Mick, have a look at the official ladder."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "Have a squiz at that table Gazza! Six points in fifty minutes! Point Takeaway sits outright FIRST on twenty-two points with a plus seventeen goal differential! Best attack, best defence, and top of the tree! Round 14 brings The Well Hungarians next Wednesday, but tonight belongs to the boys! Up the Point Takeaway!"
    }
]

def synthesize_double_header_wrap():
    print('🏉 === THE WRAP: DOUBLE HEADER (ROUND 12 & 13) SPECIAL === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-double-header.wav')
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
        'id': 'the-wrap-double-header',
        'round': 'Double Header (R12 & R13)',
        'date': '2026-10-21',
        'title': 'The Wrap: The Double Header Masterclass, 4-0 Touchers Whitewash & First Place Glory!',
        'matchId': '2026-10-21-round-13',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-double-header.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-double-header.json'), 'w', encoding='utf-8') as f:
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

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-double-header']
    filtered_episodes.append(metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with Double Header special!')

if __name__ == '__main__':
    synthesize_double_header_wrap()
