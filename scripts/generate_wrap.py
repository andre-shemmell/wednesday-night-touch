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

# 1. Primary API Key
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

# 3. Persistent Australian Voice IDs (under new key project)
MICK_VOICE_ID = 'voice_5sz1py2m7szz'   # "Mick The Rocket" (en-AU, enthusiastic gravelly footy commentator)
GAZZA_VOICE_ID = 'voice_aurrcyu83jaj'  # "Gazza Shemmell" (en-AU, deadpan Queensland tactical analyst)

# 4. Rescripted Dialogue with Native Gemini 3.8 Expression Tags & Australian Phrasing
SCRIPT_TURNS = [
    {
        "speaker": "Mick",
        "style": "excited and high energy",
        "text": "G'day legends and welcome to The Wrap, your weekly dose of touch footy gold for Point Takeaway down at Redlands Touch Association! Mick here, and oh boy, <short pause> Round 11 was an absolute pearler! Cleveland Showgrounds turned on a bit of pre-game drizzle, had all eleven of us huddled under the rusty tin roof, and then right on kickoff <sighs> the skies cleared, the turf gripped, and the boys dished out a proper 7 to 2 shellacking to the Redlands Centurions! <laugh> You beauty!"
    },
    {
        "speaker": "Gazza",
        "style": "calm, dry wit, deadpan",
        "text": "A clinical performance, Mick. Particularly impressive considering our mate Nev decided looking at green skies in Norway for the Northern Lights was more important than freezing his backside off in Cleveland. <chuckle> So without Nev, the gaffer Graeme had eleven troops locked and loaded: Cam, Matt, BJ, Jayden, Reece, Mitch, Mack, Adrian, Joely, Dylan, and Peter. Though I must say, <short pause> minute one had a few blokes coughing up their tuckshop pies when Centurions crossed immediately to make it nil-one."
    },
    {
        "speaker": "Mick",
        "style": "laughing, hyped up, incredulous",
        "text": "<laughter> Stone the crows Gazza, talk about a wake-up call! <gasp> And then Peter produces the play of the century by getting penalised for colliding straight into his own teammate! <laugh> The ref didn't know what to blow, the sideline was in stitches, and Peter looked like he'd just tackled a ghost! <chuckle> But fair dinkum, once that cobweb cleared, Jayden sliced straight through the line and fed Joely for a cool-headed dot down to level it 1-all!"
    },
    {
        "speaker": "Gazza",
        "style": "analytical, admiring, measured",
        "text": "Pure class from Joely. Then Cam stepped up into first receiver and delivered an absolute tracer bullet pass out wide to Mack, who crashed over right in the corner to make it 2-1. Centurions managed to scramble back to 2-all shortly after, despite Mack nearly dislocating a shoulder pulling off a heroic diving tag. <pant> But Peter quickly made amends for his friendly fire incident, dishing a sweet pill to Reece to regain the lead at 3-2."
    },
    {
        "speaker": "Mick",
        "style": "enthusiastic, fast-paced, vivid",
        "text": "And right before the halftime hooter, Jayden and Dylan put on an absolute clinic through the middle! Give and go, draw and pass, slicing them to ribbons like a hot knife through butter to send us into the sheds up 4-2! <chuckle> The banter at the break was sensational, and whatever Graeme put in the water bottles worked wonders because Mitch came straight out of the sheds and scored an outrageous solo try to blow it out to 5-2!"
    },
    {
        "speaker": "Gazza",
        "style": "dry humor, amused, deadpan",
        "text": "Mitch made five blokes look like parking cones on that run, Mick. <snicker> Sublime individual try. But then, the match official decided he wanted his own headline with the rare Cleveland double soft send-off. Mack gets sent for a walk to cool his heels on the sideline, and twenty seconds later Joely gets marched off right behind him. The sideline yelled out asking what for, and the ref deadpan replied, quote, it is a referee thing. <short pause> Tactical genius at work right there."
    },
    {
        "speaker": "Mick",
        "style": "chuckling, spirited, emphatic",
        "text": "<cackle> Bloody oath, a referee thing! I'm going to use that at work on Monday! But playing down numbers didn't bother the lads one bit. We get a tap penalty, the sideline literally screams out, no, don't do it! And Reece completely ignores the call, flicks on the turbo afterburners, burns their entire backline, and slams it down for 6-2! <laugh> You can't coach speed like that, mate!"
    },
    {
        "speaker": "Gazza",
        "style": "relaxed, appreciative, smooth Queensland drawl",
        "text": "Reece doesn't take advice from the cheap seats, Mick, he just takes tries. <chuckle> Then Adrian produced an ankle-breaker in the middle of the paddock that sent two Centurions defenders sliding halfway to the Redlands clubhouse. <gasp> And to put the cherry on the cake, Cam, who simply never stops digging into the contest, chased down a loose ball, beat the cover defence, and sealed the emphatic 7-2 win right on the hooter."
    },
    {
        "speaker": "Mick",
        "style": "warm, proud, respectful",
        "text": "What a win! <sigh> And the gaffer Graeme was absolutely purring on the sideline after the match! He gave his official post-match appraisal to the group: <short pause> We played near to our best tonight. And it is good. Great to watch. When Graeme drops praise like that, you know the boys earned their post-game frothies!"
    },
    {
        "speaker": "Gazza",
        "style": "authoritative, structured, footy analyst",
        "text": "High praise indeed from the gaffer Graeme. Now, let's have a squiz at the other division results around Redlands. The Touchers took care of business against United, winning 8 to 2. Second-placed Hunt and Kill took down the Screws 6 to 2. And Bonsai kept themselves right in the hunt with an 8 to 3 victory over The Well Hungarians."
    },
    {
        "speaker": "Mick",
        "style": "excited, competitive, pumped",
        "text": "Strewth, that sets up a wild ladder! Have a squiz at this: <short pause> The Touchers sit in first on 17 points, Hunt and Kill sit second on 17 points, and right up their clobber in third spot is Point Takeaway on 16 points with a plus 11 differential! And check this stat Gazza: <gasp> we've got the outright best attack in the entire competition with 47 tries scored! Bonsai are right on our tail in fourth on 16 points as well!"
    },
    {
        "speaker": "Gazza",
        "style": "tactical, anticipatory, big match build-up",
        "text": "Which brings us to next week, Wednesday the twenty-first of October on Field 6. It's the mother of all assignments. A double header against the top two teams on the ladder. <short pause> Game one taps off at quarter past eight Brisvegas time against number two Hunt and Kill. Then thirty minutes later, on the same field at quarter to nine, we back it up against the ladder leaders, The Touchers."
    },
    {
        "speaker": "Mick",
        "style": "rousing, passionate, call to arms",
        "text": "Stone the crows! Back-to-back grudge matches against first and second! If the Point Takeaway machine clicks like it did against Centurions, we blow this minor premiership wide open! <laughter> Get your strapping tape ready, hydrate up, and we'll see all the faithful down at Cleveland Showgrounds on Wednesday night. Up the Point Takeaway!"
    }
]

def synthesize_multi_speaker_wrap():
    print('🏉 === THE WRAP: PRODUCTION GEMINI 3.8 FLASH TTS (PRIMARY MODEL + EXPRESSION TAGS) === 🏉')
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

    wav_path = os.path.join(audio_dir, 'the-wrap-round-11.wav')
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
    print(f'🎙️ Synthesized natively with primary model: {used_model}')

    # Save metadata
    metadata = {
        'id': 'the-wrap-round-11',
        'round': 'Round 11',
        'date': '2026-10-14',
        'title': 'The Wrap: Round 11 Clinic, Northern Lights & Double Header Fever',
        'matchId': '2026-10-14-round-11',
        'isAudioReady': True,
        'modelUsed': used_model,
        'durationSeconds': duration_sec,
        'formattedDuration': formatted_duration,
        'audioUrl': '/audio/the-wrap-round-11.wav',
        'stagedNative': True,
        'hosts': [
            { 'name': 'Mick "The Rocket" Ryan', 'voice': MICK_VOICE_ID, 'role': 'Colour Commentator' },
            { 'name': 'Gazza Shemmell', 'voice': GAZZA_VOICE_ID, 'role': 'Tactical Analyst' }
        ],
        'transcript': SCRIPT_TURNS,
        'updatedAt': datetime.now(timezone.utc).isoformat()
    }

    with open(os.path.join(audio_dir, 'the-wrap-round-11.json'), 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2)

    episodes_path = os.path.join('src', 'data', 'theWrapEpisodes.json')
    with open(episodes_path, 'w', encoding='utf-8') as f:
        json.dump([metadata], f, indent=2)

    print('✅ Updated episode metadata and transcript!')

if __name__ == '__main__':
    synthesize_multi_speaker_wrap()
