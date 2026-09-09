import torch
import torchaudio as ta
from chatterbox.tts import ChatterboxTTS

# Use GPU if available, otherwise CPU
if torch.cuda.is_available():
    device = "cuda"
else:
    device = "cpu"

print(f"Using device: {device}")

# Load Chatterbox
model = ChatterboxTTS.from_pretrained(device=device)

# IMPORTANT:
# This is NEW speech, not the same sentence as original_1.wav.
text = (
    "This is a new VoiceGuard test message. "
    "The system is checking whether this speech was produced "
    "by a real speaker or by an artificial voice."
)

# Your original voice recording
reference_audio = "audio/original_1.wav"

# Generate speech using your reference voice
wav = model.generate(
    text,
    audio_prompt_path=reference_audio
)

# Save the generated audio
output_file = "audio/cloned_1.wav"
ta.save(output_file, wav, model.sr)

print(f"Created: {output_file}")