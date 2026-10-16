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

# 3. Persistent Australian Voice IDs
MICK_VOICE_ID = 'voice_lepxbd2f37gg'   # "Mick The Rocket" (en-AU, enthusiastic gravelly footy commentator)
GAZZA_VOICE_ID = 'voice_xuyxtq26tqmg'  # "Gazza Shemmell" (en-AU, deadpan Queensland tactical analyst)

# 4. Round 10 Script with strictly verified acoustic tags (<laugh>, <chuckle>, <gasp>, <sigh>)
# and natural punctuation (... and -) for pauses instead of literal <short pause>.
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome back to The Wrap, your weekly hit of touch footy gold for Point Takeaway at Redlands Touch Association! Mick here with Gazza, and oh boy... Round 10 was an absolute turkey shoot! Field 5 down at Cleveland Showgrounds, and fair dinkum, we turned up to find the Screws only had four blokes! <laugh> Four! So the gaffer Graeme and the boys agreed to a gentlemen's agreement, played five-on-five on a full-sized paddock, and dished out an almighty 13 to 4 shellacking! <laugh> You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "A proper open-field track meet, Mick. Playing five-on-five meant the defensive gaps weren't just big, they were like the Grand Canyon. We had eleven troops ready to roll, with only Adrian missing on a family holiday to Thailand, which meant our sub bench was practically overflowing. And it was a massive night for our flyer Reece, finally back on the paddock after six months on the sidelines with injury. ... Cam got the party started early, finding his brother Matt slicing straight through a yawning gap to make it 1-nil."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, incredulous",
        "text": "Haha! Screws managed to snag an equalizer shortly after to make it 1-all, but then the fireworks kicked off! Jayden puts on the turbo jets, slices the line, but gets cruelly called back for a phantom touch before the dot down. <gasp> But twenty seconds later, Jayden dishes a sweet pill to Dylan in the corner to make it 2-1! And then Mitch, <chuckle> Mitch puts on a clinic, running sideways across the entire park, dodging five blokes, and crashing over for 3-1! You couldn't catch him with a lasso, mate!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "Mitch's vision in space was exceptional. Peter then got in on the act, sneaking right through the middle after Jayden earned six more to push it out to 4-1. Screws pulled one back in the corner for 4-2, before Joely probed the line, spotted Reece on his return, and fed him an absolute gift for 5-2. ... Then Mitch pulled off a gorgeous one-two give-and-go with Jayden through the ruck to make it 6-2."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, laughing, fast-paced",
        "text": "Stone the crows Gazza, and then the ref produces a comedy special right on halftime! <laugh> Matt pulls off a textbook tag on their runner, the bloke just ignores it, keeps running, grounds the ball, and the ref gives the try for 6-3! Haha! The sideline was yelling out, but into the sheds we went with a healthy three-try buffer! And mate, whatever Graeme said at halftime, Dylan took it personally!"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, amused, deadpan",
        "text": "Dylan came out of the sheds like a startled gazelle, Mick. Screws had first ball in the second half, turned it over, and Dylan scooped it up from our own tryline and ran seventy meters untouched down the touchline to make it 7-3. <chuckle> Screws managed to strike back to 7-4, and to their credit they were playing smart footy, but five-on-five touch footy is brutal on the lungs and they were blowing like draft horses."
    },
    {
        "speaker": "Mick",
        "style": "chuckling, spirited, emphatic",
        "text": "They were completely out of puff, Gazza! And that's when Peter turned on the razzle-dazzle! <gasp> He gets the ball, pulls off an ankle-breaking double step that sent two defenders into next week, and waltzed over for 8-4! Then Mack started rucking like a man possessed, laying a platform for Jayden to dish to Joely to make it 9-4! But Gazza — talk to me about Dylan's hat-trick try!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "<chuckle> The showboat of the season, Mick. Graeme noted it officially in the team dispatches. Dylan gets the ball on the outside, waves and shows the ball to the Screws defender as he cruises past, and dots it down for 10-4. Graeme literally wrote in his notes, quote, I say, over and out. <laugh> Ruthless disrespect from Dylan, you've got to love it."
    },
    {
        "speaker": "Mick",
        "style": "laughing, animated, hyped",
        "text": "<laugh> 'I say, over and out!' That is legendary from the gaffer Graeme! And we weren't done yet! Cam, Peter, and Jayden marched us fifty meters upfield, dished to Mitch on the burst, and he streaks away for his hat-trick to blow it out to 11-4! Then Peter and Reece trade sweet passes before Matt feeds Mitch again for his fourth try of the night to make it 12-4! Four tries for Mitch, you beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "Four tries for Mitch, but the play of the night came in defence right after. Screws broke through our line against the run of play, their winger thought he was home, and Mack turned on the jetpack, chased him down from twenty meters back, and pulled off a miraculous diving tag right on our tryline. ... Pure hustle from Mack."
    },
    {
        "speaker": "Mick",
        "style": "excited, competitive, pumped",
        "text": "Diving tag of the year, mate! And then to put the icing on the cake, Matt steps, jumps, draws two defenders, and feeds Dylan for his fourth try of the evening to seal the 13 to 4 rout right on the final hooter! <laugh> Four tries for Dylan, four tries for Mitch, ten different try assists, and a glorious night at the Showgrounds!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, respectful, smiling",
        "text": "A dominant, highly entertaining victory. And the gaffer Graeme summed up the evening with trademark serenity: ... The Full time siren sounded to end an enjoyable night out. FT 13-4. When you put thirteen past an opponent and leave the park with a plus nine differential, that is certainly an enjoyable night out."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "<sigh> Too right, Gazza! That thirteen-try explosion set the stage for our Round 11 masterclass against the Centurions, and sets us right up for the top-of-the-table double header! What a team, what a club! Up the Point Takeaway!"
    }
]

def synthesize_round10_wrap():
    print('🏉 === THE WRAP: ROUND 10 RE-SYNTHESIS (PRIMARY GEMINI 3.8 FLASH TTS) === 🏉')
    print(f'🎙️ Host A (Mick): {MICK_VOICE_ID}')
    print(f'🎙️ Host B (Gazza): {GAZZA_VOICE_ID}')
    print(f'📝 Turns to synthesize: {len(SCRIPT_TURNS)}')

    # Verify no accidental illegal tags
    for i, t in enumerate(SCRIPT_TURNS):
        import re
        bad_tags = re.findall(r'<(?!(?:laugh|chuckle|gasp|sigh)>)[^>]+>', t['text'])
        if bad_tags:
            print(f'⚠️ Warning turn {i} has suspicious tags:', bad_tags)

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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-10.wav')
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

    # Round 10 Metadata
    round10_metadata = {
        'id': 'the-wrap-round-10',
        'round': 'Round 10',
        'date': '2026-10-07',
        'title': 'The Wrap: 5-on-5 Field Day, 4-Try Feasts & The Showboat Special',
        'matchId': '2026-10-07-round-10',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-10.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-10.json'), 'w', encoding='utf-8') as f:
        json.dump(round10_metadata, f, indent=2)

    # Update theWrapEpisodes.json maintaining both Round 11 and Round 10
    episodes_path = os.path.join('src', 'data', 'theWrapEpisodes.json')
    episodes = []
    if os.path.exists(episodes_path):
        try:
            with open(episodes_path, 'r', encoding='utf-8') as f:
                episodes = json.load(f)
        except Exception:
            episodes = []

    filtered_episodes = [e for e in episodes if e.get('id') != 'the-wrap-round-10']
    filtered_episodes.append(round10_metadata)
    filtered_episodes.sort(key=lambda e: e.get('date', ''), reverse=True)

    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump(filtered_episodes, f, indent=2)

    print('✅ Updated src/data/theWrapEpisodes.json with clean Round 10 transcript!')

if __name__ == '__main__':
    synthesize_round10_wrap()
