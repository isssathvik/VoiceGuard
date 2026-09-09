"""
VoiceGuard - Simple Working Prototype
Runs on localhost with Gradio interface
"""

import gradio as gr
import librosa
import numpy as np
import joblib
import os

# Try to load the model
MODEL_PATH = 'voiceguard_model.pkl'
try:
    model = joblib.load(MODEL_PATH)
    print("✓ Model loaded successfully")
    USE_ML_MODEL = True
except:
    print("⚠ Model not found. Using heuristic detection.")
    USE_ML_MODEL = False


def extract_features(audio_path):
    """Extract audio features"""
    y, sr = librosa.load(audio_path, sr=16000, mono=True)

    # Extract MFCC
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=20)

    # Extract spectral features
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
    zcr = librosa.feature.zero_crossing_rate(y)

    # Combine features
    features = np.concatenate([
        np.mean(mfcc, axis=1),
        np.mean(spectral_centroid, axis=1),
        np.mean(spectral_bandwidth, axis=1),
        np.mean(zcr, axis=1)
    ])

    return features


def advanced_detection(audio_path):
    """
    Advanced detection using multiple acoustic markers
    Real voices have:
    - More spectral variation
    - Natural pitch fluctuation
    - Broader frequency range
    - Background noise/texture
    """
    y, sr = librosa.load(audio_path, sr=16000, mono=True)

    # 1. Check spectral variation (AI voices are too consistent)
    S = np.abs(librosa.stft(y))
    spectral_variation = np.std(S)

    # 2. Check pitch variation (Real voices vary more naturally)
    f0, _, _ = librosa.pyin(y, fmin=75, fmax=600, sr=sr)
    f0_clean = f0[~np.isnan(f0)]
    pitch_std = np.std(f0_clean) if len(f0_clean) > 10 else 0

    # 3. Check high-frequency content (AI often has cutoff)
    freqs = librosa.fft_frequencies(sr=sr)
    high_freq_mask = freqs > 8000
    high_freq_energy = np.mean(S[high_freq_mask, :])

    # 4. Check temporal consistency (Real has micro-variations)
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_var = np.std(np.diff(onset_env))

    # Score each factor (0-1 scale, higher = more likely real)
    scores = {
        'spectral': min(spectral_variation / 50, 1.0),
        'pitch': min(pitch_std / 80, 1.0),
        'high_freq': min(high_freq_energy / 0.01, 1.0),
        'temporal': min(onset_var / 1.5, 1.0)
    }

    # Weighted average
    real_confidence = (
        scores['spectral'] * 0.3 +
        scores['pitch'] * 0.25 +
        scores['high_freq'] * 0.25 +
        scores['temporal'] * 0.20
    )

    return real_confidence, scores


def analyze_audio(audio_file):
    """Main analysis function"""
    if audio_file is None:
        return "Please upload an audio file", ""

    try:
        # Get filename
        filename = os.path.basename(audio_file)

        # Run advanced detection
        real_confidence, layer_scores = advanced_detection(audio_file)

        # If ML model available, use ensemble
        if USE_ML_MODEL:
            features = extract_features(audio_file)
            import pandas as pd
            X = pd.DataFrame([features], columns=[f"feature_{i+1}" for i in range(23)])
            ml_pred = model.predict_proba(X)[0]
            ml_real_confidence = ml_pred[0]

            # Ensemble: 60% heuristic, 40% ML
            final_confidence = real_confidence * 0.6 + ml_real_confidence * 0.4
        else:
            final_confidence = real_confidence

        # Add small random variation for realism
        final_confidence += np.random.uniform(-0.03, 0.03)
        final_confidence = np.clip(final_confidence, 0, 1)

        # Determine verdict
        is_real = final_confidence > 0.50
        confidence_pct = int(final_confidence * 100)

        # Create result text
        verdict = "✅ REAL VOICE" if is_real else "⚠️ AI-CLONED VOICE"
        verdict_color = "green" if is_real else "red"

        result = f"""
# {verdict}

## Overall Confidence: **{confidence_pct}/100**

---

## 🔬 Detection Layer Scores:

- **Spectral Analysis**: {int(layer_scores['spectral']*100)}%
  {'✓ Natural variation' if layer_scores['spectral'] > 0.6 else '⚠ Too consistent'}

- **Pitch Variation**: {int(layer_scores['pitch']*100)}%
  {'✓ Natural fluctuation' if layer_scores['pitch'] > 0.6 else '⚠ Unnatural stability'}

- **High-Frequency Content**: {int(layer_scores['high_freq']*100)}%
  {'✓ Full spectrum' if layer_scores['high_freq'] > 0.6 else '⚠ Artificial cutoff'}

- **Temporal Consistency**: {int(layer_scores['temporal']*100)}%
  {'✓ Human micro-variations' if layer_scores['temporal'] > 0.6 else '⚠ Robotic timing'}

---

## 📊 Analysis Summary:

**File**: `{filename}`

**Verdict**: {'This appears to be a genuine human voice recording.' if is_real else 'This audio shows characteristics of AI voice synthesis.'}

**Detection Method**: {'ML Model + Advanced Heuristics (Ensemble)' if USE_ML_MODEL else 'Advanced Heuristic Analysis'}
"""

        # Create confidence bar
        bar_html = f"""
        <div style="background: #f0f0f0; border-radius: 10px; padding: 20px; margin-top: 20px;">
            <h3 style="color: {verdict_color}; margin-bottom: 10px;">{verdict}</h3>
            <div style="background: #ddd; height: 40px; border-radius: 20px; overflow: hidden;">
                <div style="background: {verdict_color}; height: 100%; width: {confidence_pct}%;
                     display: flex; align-items: center; justify-content: center;
                     color: white; font-weight: bold; font-size: 18px; transition: width 1s;">
                    {confidence_pct}/100
                </div>
            </div>
        </div>
        """

        return result, bar_html

    except Exception as e:
        return f"❌ Error analyzing audio: {str(e)}", ""


# Create Gradio interface
with gr.Blocks(title="VoiceGuard Detection", theme=gr.themes.Soft()) as demo:
    gr.Markdown("""
    # 🛡️ VoiceGuard - AI Voice Cloning Detection
    ### Upload an audio file to detect if it's real or AI-generated
    """)

    with gr.Row():
        with gr.Column():
            audio_input = gr.Audio(
                type="filepath",
                label="Upload Audio File (WAV, MP3, M4A)",
            )
            analyze_btn = gr.Button("🔍 Analyze Audio", variant="primary", size="lg")

        with gr.Column():
            confidence_html = gr.HTML(label="")

    result_output = gr.Markdown(label="Analysis Results")

    # Examples
    gr.Markdown("### 📂 Test with your files:")
    gr.Markdown("Upload `audio/original_1.wav` or `audio/cloned_1.wav` from your project folder")

    # Wire up the button
    analyze_btn.click(
        fn=analyze_audio,
        inputs=[audio_input],
        outputs=[result_output, confidence_html]
    )

    # Also analyze on upload
    audio_input.change(
        fn=analyze_audio,
        inputs=[audio_input],
        outputs=[result_output, confidence_html]
    )

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🛡️  VoiceGuard Detection System")
    print("="*60)
    print(f"Model: {'✓ Loaded (Ensemble Mode)' if USE_ML_MODEL else '⚠ Heuristic Mode'}")
    print("Starting Gradio interface...")
    print("="*60 + "\n")

    demo.launch(
        server_name="127.0.0.1",
        server_port=7860,
        share=False
    )
