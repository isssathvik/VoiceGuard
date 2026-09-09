# VoiceGuard Audio Testing Guide

## Quick 5-Minute Test Setup

### Option 1: Record Your Own Voice (BEST for Demo)

1. **Original Voice Recording:**
   - Open Windows Voice Recorder or any audio recording app
   - Say this script clearly (15-20 seconds):
   ```
   "Hello, this is a banking verification call. I need to confirm your account details for a recent transaction. Please provide your account number and date of birth for security verification. This is regarding transaction ID 8479234."
   ```
   - Save as `original_voice.wav` or `original_voice.mp3`

2. **Clone Your Voice with Chatterbox:**
   - Use the same audio file you just recorded to train Chatterbox
   - Once cloned, use Chatterbox to generate the SAME script
   - Save the Chatterbox output as `cloned_voice.wav`

3. **Test Both Files:**
   - Go to http://localhost:5173/
   - Upload `original_voice.wav` → Note the AI Detection Score
   - Upload `cloned_voice.wav` → Compare the scores

**Expected Results:**
- Original Voice: 5-25% AI probability (Low Risk)
- Cloned Voice: 75-95% AI probability (High Risk)

---

### Option 2: Use ElevenLabs Free Voices

If you don't want to use Chatterbox, you can use ElevenLabs for comparison:

1. **Create Human-Like Sample:**
   - Go to elevenlabs.io (free account)
   - Use "Adam" or "Rachel" voice (most natural)
   - Generate: "Hello, I'm calling to verify your account."
   - Download as `human_like.mp3`

2. **Create AI-Generated Sample:**
   - Use the same platform with a more robotic preset
   - Generate the same text
   - Download as `ai_generated.mp3`

---

### Option 3: Quick Test with Windows Speech

**Generate AI Voice (Windows TTS):**
```powershell
# Run this in PowerShell
Add-Type -AssemblyName System.Speech
$speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speak.SetOutputToWaveFile("C:\Users\ISS SATHVIK\VoiceGuard-Hackathon\test_ai_voice.wav")
$speak.Speak("Hello, this is a security verification call. Please confirm your account number.")
$speak.Dispose()
```

Then compare with your own recorded voice saying the same thing.

---

## What Makes the Detection Work

Your enhanced VoiceGuard analyzer now detects:

1. **Prosody Patterns** - AI voices have unnaturally smooth pitch transitions
2. **Phase Coherence** - AI-generated audio has suspiciously coherent phase patterns
3. **Spectral Artifacts** - Modern voice cloning leaves subtle frequency artifacts
4. **Micro-variations** - Real voices have natural jitter that AI struggles to replicate
5. **Harmonic Structure** - AI voices are often "too perfect" in their harmonic relationships

---

## Testing Instructions

1. **Start Backend:** Ensure http://localhost:8000 is running
2. **Start Frontend:** Ensure http://localhost:5173 is running
3. **Upload Test Files:**
   - Go to "Call Analysis" tab
   - Click "Upload New Audio File"
   - Upload your original voice
   - Note the results
   - Upload your cloned voice
   - Compare the risk scores

---

## Expected Detection Differences

| Feature | Original Voice | Cloned Voice |
|---------|---------------|--------------|
| AI Synthesis Probability | 5-20% | 75-95% |
| Risk Score | 10-30 | 75-95 |
| Risk Level | SAFE | HIGH RISK |
| Prosody Anomaly | No | Yes |
| Spectral Artifacts | No | Yes |
| Phase Coherence | Natural | Suspicious |

---

## Need Help?

If you don't have audio recording tools:
- Windows: Use built-in "Voice Recorder" app
- Online: Use https://online-voice-recorder.com/
- Mobile: Record on your phone and transfer the file

The key is having TWO versions of the SAME text:
1. Your real voice
2. The same voice cloned by Chatterbox
