import librosa
import numpy as np
import pandas as pd
import os


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


files = [
    ("audio/original_1.wav", 0),
    ("audio/cloned_1.wav", 1)
]

dataset = []

for file_path, label in files:

    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue

    features = extract_features(file_path)

    row = list(features) + [label]
    dataset.append(row)

columns = [f"feature_{i+1}" for i in range(23)]
columns.append("label")

df = pd.DataFrame(dataset, columns=columns)

df.to_csv("voice_dataset.csv", index=False)

print("\nDataset created successfully!")
print(f"Samples: {len(df)}")
print(f"Features per sample: 23")
print("Labels: 0 = REAL, 1 = AI_CLONED")
print("Saved as: voice_dataset.csv")