import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

# Load dataset
df = pd.read_csv("voice_dataset.csv")

# Separate features and labels
X = df.drop("label", axis=1)
y = df["label"]

# Train the model
model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

# Save the trained model
joblib.dump(model, "voiceguard_model.pkl")

print("\nVoiceGuard model trained successfully!")
print(f"Training samples: {len(df)}")
print(f"Features used: {X.shape[1]}")
print("Model saved as: voiceguard_model.pkl")