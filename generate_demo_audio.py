import asyncio
import edge_tts
from pathlib import Path

OUTPUT = Path("demo_audio")
OUTPUT.mkdir(exist_ok=True)

VOICE_1 = "en-US-GuyNeural"
VOICE_2 = "en-US-JennyNeural"

TEXT_1 = """Hey, this is a sample audio for testing the VoiceGuard for detecting whether it is cloned or original."""

TEXT_2 = """This is about my Smart India Hackathon project, which is VoiceGuard, here for a demonstration."""


async def generate(text, voice, filename):
    output = OUTPUT / filename

    communicate = edge_tts.Communicate(
        text=text,
        voice=voice,
        rate="+0%",
        volume="+0%"
    )

    await communicate.save(str(output))
    print(f"Created: {output}")


async def main():
    # Original synthetic voices
    await generate(
        TEXT_1,
        VOICE_1,
        "Original_Voice_1.wav"
    )

    await generate(
        TEXT_2,
        VOICE_2,
        "Original_Voice_2.wav"
    )

    # Synthetic "clone" demo samples.
    # These use the same scripts but a different synthetic voice,
    # allowing VoiceGuard's detector to be tested.
    await generate(
        TEXT_1,
        "en-US-AriaNeural",
        "Cloned_Voice_1.wav"
    )

    await generate(
        TEXT_2,
        "en-US-ChristopherNeural",
        "Cloned_Voice_2.wav"
    )


if __name__ == "__main__":
    asyncio.run(main())