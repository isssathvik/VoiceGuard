from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import librosa
import numpy as np
import joblib
import tempfile
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend requests

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'wav', 'mp3', 'm4a', 'ogg'}
MODEL_PATH = 'voiceguard_model.pkl'

# Load the trained model
try:
    model = joblib.load(MODEL_PATH)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Error loading model: {e}")
    model = None


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_features(file_path):
    """Extract audio features for classification"""
    try:
        # Load audio file
        audio, sr = librosa.load(file_path, sr=16000, mono=True)

        # Extract MFCC features
        mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)

        # Extract spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)
        spectral_bandwidth = librosa.feature.spectral_bandwidth(y=audio, sr=sr)
        spectral_rolloff = librosa.feature.spectral_rolloff(y=audio, sr=sr)

        # Extract zero crossing rate
        zero_crossing_rate = librosa.feature.zero_crossing_rate(audio)

        # Combine all features (mean values)
        features = np.concatenate([
            np.mean(mfcc, axis=1),
            np.mean(spectral_centroid, axis=1),
            np.mean(spectral_bandwidth, axis=1),
            np.mean(zero_crossing_rate, axis=1)
        ])

        # Return features and individual metrics for display
        return {
            'features': features,
            'mfcc_mean': float(np.mean(mfcc)),
            'spectral_centroid': float(np.mean(spectral_centroid)),
            'spectral_bandwidth': float(np.mean(spectral_bandwidth)),
            'spectral_rolloff': float(np.mean(spectral_rolloff)),
            'zero_crossing_rate': float(np.mean(zero_crossing_rate))
        }
    except Exception as e:
        raise Exception(f"Feature extraction failed: {str(e)}")


@app.route('/')
def index():
    """Serve the demo interface"""
    return send_from_directory('.claude/scratch', 'voiceguard-demo.html')


@app.route('/api/analyze', methods=['POST'])
def analyze_audio():
    """Analyze uploaded audio file(s)"""
    if model is None:
        return jsonify({'error': 'Model not loaded. Please ensure voiceguard_model.pkl exists.'}), 500

    if 'files' not in request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    files = request.files.getlist('files')
    results = []

    for file in files:
        if file and allowed_file(file.filename):
            try:
                # Save uploaded file temporarily
                filename = secure_filename(file.filename)
                temp_path = os.path.join(UPLOAD_FOLDER, filename)
                file.save(temp_path)

                # Extract features
                feature_data = extract_features(temp_path)
                features = feature_data['features']

                # Prepare features for prediction (same format as training)
                import pandas as pd
                X = pd.DataFrame(
                    [features],
                    columns=[f"feature_{i+1}" for i in range(23)]
                )

                # Make prediction
                prediction = model.predict(X)[0]
                probabilities = model.predict_proba(X)[0]

                # Calculate confidence
                confidence = float(probabilities[prediction] * 100)
                is_real = (prediction == 0)

                # Prepare result
                result = {
                    'fileName': filename,
                    'fileSize': round(os.path.getsize(temp_path) / 1024, 1),  # KB
                    'isReal': is_real,
                    'prediction': 'REAL VOICE' if is_real else 'AI-CLONED VOICE',
                    'confidence': round(confidence, 1),
                    'features': {
                        'mfccMean': round(feature_data['mfcc_mean'], 4),
                        'spectralCentroid': round(feature_data['spectral_centroid'], 1),
                        'zeroCrossingRate': round(feature_data['zero_crossing_rate'], 4),
                        'spectralRolloff': round(feature_data['spectral_rolloff'], 1)
                    }
                }

                results.append(result)

                # Clean up temporary file
                os.remove(temp_path)

            except Exception as e:
                results.append({
                    'fileName': file.filename,
                    'error': str(e)
                })
        else:
            results.append({
                'fileName': file.filename,
                'error': 'Invalid file type. Supported: WAV, MP3, M4A, OGG'
            })

    return jsonify({'results': results})


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_path': MODEL_PATH
    })


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🛡️  VoiceGuard Detection API Server")
    print("="*60)
    print(f"Model Status: {'✓ Loaded' if model else '✗ Not Found'}")
    print(f"Server: http://localhost:5001")
    print(f"API Endpoint: http://localhost:5001/api/analyze")
    print("="*60 + "\n")

    app.run(debug=True, host='0.0.0.0', port=5001)
