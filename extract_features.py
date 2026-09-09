import librosa
import numpy as np
import os

def extract_features(file_path):
    audio, sr = librosa.load(file_path, sr=16000, mono=True)

    # MFCC features
    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=sr,
        n_mfcc=20
    )

    # Additional spectral features
    spectral_centroid = librosa.feature.spectral_centroid(
        y=audio,
        sr=sr
    )

    spectral_bandwidth = librosa.feature.spectral_bandwidth(
        y=audio,
        sr=sr
    )

    zero_crossing_rate = librosa.feature.zero_crossing_rate(audio)

    # Average each feature across time
    features = np.concatenate([
        np.mean(mfcc, axis=1),
        np.mean(spectral_centroid, axis=1),
        np.mean(spectral_bandwidth, axis=1),
        np.mean(zero_crossing_rate, axis=1)
    ])

    return features


files = {
    "REAL": "audio/original_1.wav",
    "AI_CLONED": "audio/cloned_1.wav"
}

for label, file_path in files.items():
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue

    features = extract_features(file_path)

    print(f"\n{label}")
    print(f"File: {file_path}")
    print(f"Feature count: {len(features)}")
    print(f"First 10 features: {features[:10]}")

print("\nFeature extraction test completed successfully.")