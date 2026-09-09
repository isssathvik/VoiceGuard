import sys
import os
import librosa
import numpy as np
import pandas as pd
import joblib


def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000, mono=True)

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=20
    )

    spectral_centroid = librosa.feature.spectral_centroid(
        y=audio,
        sr=sr
    )

    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=audio,
        sr=sr
    )

    zero_crossing_rate = librosa.feature.zero_crossing_rate(audio)

    features = np.concatenate([
        np.mean(mfcc, axis=1),
        np.mean(spectral_centroid, axis=1),
        np.mean(spectral_bandwidth, axis=1),
        np.mean(zero_crossing_rate, axis=1)
    ])

    return features


# Check command-line argument
if len(sys.argv) < 2:
    print("Usage: python detect_voice.py <audio_file>")
    sys.exit(1)

audio_file = sys.argv[1]

# Check files
if not os.path.exists(audio_file):
    print(f"Audio file not found: {audio_file}")
    sys.exit(1)

if not os.path.exists("voiceguard_model.pkl"):
    print("Model not found: voiceguard_model.pkl")
    sys.exit(1)


# Load trained model
model = joblib.load("voiceguard_model.pkl")

# Extract features
features = extract_features(audio_file)

# Put features into DataFrame
X = pd.DataFrame(
    [features],
    columns=[f"feature_{i+1}" for i in range(23)]
)

# Predict
prediction = model.predict(X)[0]
probabilities = model.predict_proba(X)[0]

confidence = probabilities[prediction] * 100

if prediction == 0:
    result = "REAL VOICE"
else:
    result = "AI-CLONED VOICE"


print("\n==============================")
print("       VOICEGUARD ANALYSIS")
print("==============================")
print(f"File       : {audio_file}")
print(f"Prediction : {result}")
print(f"Confidence : {confidence:.2f}%")
print("==============================")