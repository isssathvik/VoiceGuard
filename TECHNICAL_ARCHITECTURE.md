# VoiceGuard - Technical Architecture Document

## System Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Mobile App)                     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │  Flutter UI    │  │ Local Audio    │  │  Secure        │        │
│  │  Components    │  │  Processing    │  │  Storage       │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────┐        │
│  │         TensorFlow Lite Edge Models (On-Device)         │        │
│  │  • Quick Detection Model (< 100ms latency)              │        │
│  │  • Acoustic Feature Extraction                          │        │
│  │  • Privacy-preserving local inference                   │        │
│  └─────────────────────────────────────────────────────────┘        │
└────────────────────────────────┬─────────────────────────────────────┘
                                  │
                       Encrypted WebSocket (TLS 1.3)
                                  │
┌────────────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY & LOAD BALANCER                      │
│                    (NGINX / AWS Application Load Balancer)            │
└────────────────────────────────┬─────────────────────────────────────┘
                                  │
       ┌──────────────────────────┴──────────────────────────┐
       │                                                       │
┌──────▼─────────────────┐                    ┌──────────────▼──────────┐
│  Real-Time Processing  │                    │   Batch Processing      │
│      Service           │                    │      Service            │
│  (Node.js + WebRTC)    │                    │   (Python + PyTorch)    │
│                        │                    │                         │
│  • Stream handling     │                    │  • Deep model inference │
│  • Feature buffering   │                    │  • Historical analysis  │
│  • Quick alerts        │                    │  • Model training       │
└────────────┬───────────┘                    └────────────┬────────────┘
             │                                              │
             └──────────────────┬──────────────────────────┘
                                │
┌───────────────────────────────▼───────────────────────────────────────┐
│                      AI DETECTION ENGINE CLUSTER                      │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                    Detection Pipeline                           │  │
│  │                                                                  │  │
│  │  [Audio Stream] → [Preprocessing] → [Feature Extraction]       │  │
│  │                          ↓                                       │  │
│  │              ┌───────────┴───────────┐                         │  │
│  │              │   Ensemble Models     │                         │  │
│  │              │                       │                         │  │
│  │    ┌─────────┴──────────┬───────────┴────────┐               │  │
│  │    │                    │                     │               │  │
│  │  ┌─▼──────────┐  ┌──────▼─────┐  ┌──────────▼──┐           │  │
│  │  │ Acoustic   │  │  Prosodic  │  │   Neural    │           │  │
│  │  │  Analyzer  │  │  Analyzer  │  │  Classifier │           │  │
│  │  │  (Rule-    │  │  (Pattern  │  │  (CNN+RNN)  │           │  │
│  │  │   based)   │  │   based)   │  │             │           │  │
│  │  └─────┬──────┘  └──────┬─────┘  └──────┬──────┘           │  │
│  │        │                │                │                   │  │
│  │        └────────┬───────┴────────┬───────┘                   │  │
│  │                 ▼                ▼                            │  │
│  │          ┌──────────────────────────┐                        │  │
│  │          │  Weighted Voting System  │                        │  │
│  │          │  (Confidence Aggregation)│                        │  │
│  │          └──────────┬───────────────┘                        │  │
│  │                     ▼                                         │  │
│  │          ┌──────────────────────┐                            │  │
│  │          │  Risk Score (0-100)  │                            │  │
│  │          │  + Threat Level      │                            │  │
│  │          └──────────────────────┘                            │  │
│  └────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬──────────────────────────────────────┘
                                  │
┌─────────────────────────────────▼────────────────────────────────────┐
│                         DATA & STORAGE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │
│  │  PostgreSQL  │  │   MongoDB    │  │   Redis      │  │  AWS S3 │ │
│  │  (Metadata)  │  │  (Features)  │  │  (Cache)     │  │ (Audio) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────┘ │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Mobile Application (Flutter)

#### Call Interception System
```dart
// Android: CallScreeningService
// iOS: CallKit Integration

class VoiceGuardCallHandler {
  StreamSubscription? _audioSubscription;
  TfliteModel? _edgeModel;
  
  Future<void> initializeCallMonitoring() async {
    // Load TensorFlow Lite model
    _edgeModel = await loadTfliteModel('voice_detector_lite.tflite');
    
    // Set up audio stream listener
    _audioSubscription = AudioStream.microphone.listen((audioChunk) {
      processAudioChunk(audioChunk);
    });
  }
  
  Future<void> processAudioChunk(Uint8List audioData) async {
    // Extract features locally
    final features = await extractMFCC(audioData);
    
    // Quick on-device inference
    final quickResult = await _edgeModel.predict(features);
    
    if (quickResult.confidence > 0.7) {
      // Send to cloud for deep analysis
      await sendToCloudAnalysis(audioData, features);
      showAlert(quickResult);
    }
  }
}
```

#### Real-time Audio Streaming
```dart
class AudioStreamProcessor {
  WebSocket? _wsConnection;
  
  Future<void> connectToBackend() async {
    _wsConnection = await WebSocket.connect(
      'wss://api.voiceguard.com/stream',
      headers: {'Authorization': 'Bearer $token'}
    );
    
    _wsConnection.listen((message) {
      final result = DetectionResult.fromJson(message);
      handleDetectionResult(result);
    });
  }
  
  Future<void> streamAudio(Stream<Uint8List> audioStream) async {
    await for (final chunk in audioStream) {
      // Compress and encrypt
      final compressed = await compressAudio(chunk);
      final encrypted = await encrypt(compressed);
      
      // Send to backend
      _wsConnection?.add(encrypted);
    }
  }
}
```

---

### 2. Backend API (Node.js + Express)

#### Real-Time Stream Handler
```javascript
// server.js
const express = require('express');
const WebSocket = require('ws');
const { AudioProcessor } = require('./processors/audio');
const { AIDetector } = require('./ai/detector');

const app = express();
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws, req) => {
  const userId = authenticateUser(req);
  const audioBuffer = new AudioBuffer();
  
  ws.on('message', async (encryptedChunk) => {
    // Decrypt incoming audio
    const audioChunk = await decrypt(encryptedChunk);
    
    // Buffer for processing
    audioBuffer.add(audioChunk);
    
    // Process when buffer reaches threshold (3 seconds)
    if (audioBuffer.duration >= 3000) {
      const result = await processAudioBuffer(audioBuffer, userId);
      
      // Send result back to client
      ws.send(JSON.stringify({
        type: 'DETECTION_RESULT',
        confidence: result.confidence,
        isFake: result.isFake,
        riskLevel: result.riskLevel,
        features: result.detectedFeatures
      }));
      
      // Clear buffer
      audioBuffer.clear();
    }
  });
});

async function processAudioBuffer(buffer, userId) {
  // Extract features
  const features = await AudioProcessor.extractFeatures(buffer.data);
  
  // Send to AI detection engine
  const detection = await AIDetector.analyze(features, userId);
  
  // Store in database
  await saveAnalysisResult(userId, detection);
  
  return detection;
}
```

#### Feature Extraction Service
```javascript
// processors/audio.js
const librosa = require('librosa-js');
const { MFCC, Spectrogram } = require('audio-features');

class AudioProcessor {
  static async extractFeatures(audioData) {
    const sampleRate = 16000;
    
    return {
      // Mel-Frequency Cepstral Coefficients
      mfcc: await MFCC.extract(audioData, {
        numCoeffs: 13,
        sampleRate,
        windowSize: 0.025,
        hopSize: 0.010
      }),
      
      // Spectral features
      spectralCentroid: await this.getSpectralCentroid(audioData),
      spectralRolloff: await this.getSpectralRolloff(audioData),
      zeroCrossingRate: await this.getZeroCrossingRate(audioData),
      
      // Prosodic features
      pitch: await this.extractPitch(audioData, sampleRate),
      energy: await this.getEnergy(audioData),
      
      // Voice quality
      jitter: await this.calculateJitter(audioData),
      shimmer: await this.calculateShimmer(audioData),
      
      // Temporal features
      speechRate: await this.estimateSpeechRate(audioData),
      pausePattern: await this.analyzePauses(audioData)
    };
  }
  
  static async getSpectralCentroid(audio) {
    const spectrum = await Spectrogram.compute(audio);
    const freqBins = spectrum.frequencies;
    const magnitudes = spectrum.magnitudes;
    
    const weightedSum = freqBins.reduce((sum, freq, i) => 
      sum + (freq * magnitudes[i]), 0
    );
    const totalMag = magnitudes.reduce((sum, mag) => sum + mag, 0);
    
    return weightedSum / totalMag;
  }
}

module.exports = { AudioProcessor };
```

---

### 3. AI Detection Engine (Python + PyTorch)

#### Multi-Model Ensemble System
```python
# ai_detector.py
import torch
import torch.nn as nn
import torchaudio
import numpy as np
from transformers import Wav2Vec2Model, HubertModel

class VoiceGuardDetector:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Load pre-trained models
        self.wav2vec = Wav2Vec2Model.from_pretrained('facebook/wav2vec2-base')
        self.hubert = HubertModel.from_pretrained('facebook/hubert-base-ls960')
        
        # Custom CNN classifier
        self.cnn_classifier = self._build_cnn_classifier()
        
        # RNN for temporal analysis
        self.rnn_classifier = self._build_rnn_classifier()
        
        # Load trained weights
        self._load_checkpoint()
        
        # Move to device
        self._models_to_device()
    
    def _build_cnn_classifier(self):
        return nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Flatten(),
            nn.Linear(64 * 32 * 32, 256),
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(256, 2)  # Real vs Fake
        )
    
    def _build_rnn_classifier(self):
        return nn.Sequential(
            nn.LSTM(input_size=768, hidden_size=256, num_layers=2, 
                    batch_first=True, bidirectional=True),
            nn.Linear(512, 2)
        )
    
    async def analyze(self, audio_features, user_context=None):
        """
        Main detection pipeline
        """
        results = {}
        
        # 1. Acoustic Analysis (Rule-based)
        acoustic_score = self.acoustic_analyzer(audio_features)
        results['acoustic'] = acoustic_score
        
        # 2. Prosodic Analysis
        prosodic_score = self.prosodic_analyzer(audio_features)
        results['prosodic'] = prosodic_score
        
        # 3. Deep Learning Models
        cnn_score = await self.cnn_detection(audio_features)
        results['cnn'] = cnn_score
        
        rnn_score = await self.rnn_detection(audio_features)
        results['rnn'] = rnn_score
        
        wav2vec_score = await self.wav2vec_detection(audio_features)
        results['wav2vec'] = wav2vec_score
        
        # 4. Ensemble voting with confidence weighting
        final_score = self.weighted_ensemble(results)
        
        # 5. Determine risk level
        risk_level = self.calculate_risk_level(final_score)
        
        return {
            'is_fake': final_score > 0.5,
            'confidence': final_score,
            'risk_level': risk_level,
            'model_breakdown': results,
            'detected_artifacts': self.identify_artifacts(results)
        }
    
    def acoustic_analyzer(self, features):
        """
        Rule-based acoustic analysis for common AI artifacts
        """
        score = 0.0
        artifacts = []
        
        # Check spectral irregularities
        if self.has_spectral_irregularity(features['spectral']):
            score += 0.3
            artifacts.append('spectral_irregularity')
        
        # Check unnatural phase coherence
        if self.has_phase_artifact(features['phase']):
            score += 0.25
            artifacts.append('phase_artifact')
        
        # Check noise floor (AI voices often too clean)
        if self.has_unnatural_noise_floor(features['noise']):
            score += 0.2
            artifacts.append('unnatural_noise')
        
        # Check formant abnormalities
        if self.has_formant_issues(features['formants']):
            score += 0.25
            artifacts.append('formant_issue')
        
        return min(score, 1.0)
    
    def prosodic_analyzer(self, features):
        """
        Analyze speech rhythm and intonation patterns
        """
        score = 0.0
        
        # Pitch contour naturalness
        pitch_score = self.analyze_pitch_naturalness(features['pitch'])
        score += pitch_score * 0.4
        
        # Speech rhythm consistency
        rhythm_score = self.analyze_rhythm(features['rhythm'])
        score += rhythm_score * 0.3
        
        # Pause pattern analysis
        pause_score = self.analyze_pauses(features['pauses'])
        score += pause_score * 0.3
        
        return score
    
    async def cnn_detection(self, features):
        """
        CNN-based spectral analysis
        """
        # Convert features to spectrogram image
        spectrogram = self.features_to_spectrogram(features)
        
        # Forward pass
        with torch.no_grad():
            tensor = torch.tensor(spectrogram).unsqueeze(0).unsqueeze(0)
            tensor = tensor.to(self.device)
            output = self.cnn_classifier(tensor)
            prob = torch.softmax(output, dim=1)
            
        return prob[0][1].item()  # Probability of fake
    
    async def rnn_detection(self, features):
        """
        RNN for temporal pattern analysis
        """
        # Extract temporal embeddings
        temporal_features = self.extract_temporal_embeddings(features)
        
        with torch.no_grad():
            tensor = torch.tensor(temporal_features).unsqueeze(0)
            tensor = tensor.to(self.device)
            
            # LSTM forward
            lstm_out, _ = self.rnn_classifier[0](tensor)
            output = self.rnn_classifier[1](lstm_out[:, -1, :])
            prob = torch.softmax(output, dim=1)
            
        return prob[0][1].item()
    
    async def wav2vec_detection(self, features):
        """
        Use Wav2Vec2 embeddings for detection
        """
        # Get Wav2Vec2 representations
        with torch.no_grad():
            embeddings = self.wav2vec(features['raw_audio'])
            
        # Custom classifier on top
        # (Trained to detect synthetic patterns in embeddings)
        detection_score = self.embedding_classifier(embeddings)
        
        return detection_score
    
    def weighted_ensemble(self, results):
        """
        Combine multiple model predictions with learned weights
        """
        weights = {
            'acoustic': 0.15,
            'prosodic': 0.15,
            'cnn': 0.25,
            'rnn': 0.20,
            'wav2vec': 0.25
        }
        
        final_score = sum(
            results[model] * weight 
            for model, weight in weights.items()
        )
        
        return final_score
    
    def calculate_risk_level(self, confidence):
        """
        Map confidence to risk levels
        """
        if confidence >= 0.9:
            return 'CRITICAL'
        elif confidence >= 0.7:
            return 'HIGH'
        elif confidence >= 0.5:
            return 'MEDIUM'
        else:
            return 'LOW'
```

#### Attack Signature Database
```python
# signatures.py
class AttackSignatureDB:
    """
    Database of known AI voice generation artifacts
    """
    
    KNOWN_SIGNATURES = {
        'elevenlabs': {
            'spectral_peak': 8000,  # Hz
            'phase_artifact': 'consistent_offset',
            'prosody_marker': 'rapid_pitch_transitions'
        },
        'resemble_ai': {
            'noise_floor': -60,  # dB
            'formant_spacing': 'irregular',
            'breath_pattern': 'absent'
        },
        'google_tts': {
            'pitch_range': 'limited',
            'emotion_consistency': 'flat',
            'prosody_pattern': 'predictable'
        },
        'deepfake_generic': {
            'high_freq_rolloff': 7500,  # Hz
            'temporal_consistency': 'low',
            'micro_pause': 'absent'
        }
    }
    
    def match_signature(self, features):
        """
        Attempt to identify specific AI voice generator
        """
        matches = []
        
        for generator, signature in self.KNOWN_SIGNATURES.items():
            match_score = self.calculate_similarity(features, signature)
            if match_score > 0.7:
                matches.append({
                    'generator': generator,
                    'confidence': match_score
                })
        
        return matches
```

---

### 4. Database Schema

#### PostgreSQL (Relational Data)
```sql
-- Users and authentication
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    subscription_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Call analysis records
CREATE TABLE call_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    caller_number VARCHAR(20),
    caller_name VARCHAR(255),
    call_duration INTEGER, -- seconds
    call_timestamp TIMESTAMP NOT NULL,
    
    -- Detection results
    is_fake BOOLEAN,
    confidence_score DECIMAL(5,4), -- 0.0000 to 1.0000
    risk_level VARCHAR(20), -- LOW, MEDIUM, HIGH, CRITICAL
    
    -- Model breakdown
    acoustic_score DECIMAL(5,4),
    prosodic_score DECIMAL(5,4),
    cnn_score DECIMAL(5,4),
    rnn_score DECIMAL(5,4),
    wav2vec_score DECIMAL(5,4),
    
    -- Recording and reporting
    has_recording BOOLEAN DEFAULT false,
    recording_url TEXT,
    is_reported BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_call_user ON call_analyses(user_id);
CREATE INDEX idx_call_timestamp ON call_analyses(call_timestamp);
CREATE INDEX idx_fake_calls ON call_analyses(is_fake, risk_level);

-- Trusted contacts
CREATE TABLE trusted_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    contact_number VARCHAR(20),
    contact_name VARCHAR(255),
    trust_score INTEGER DEFAULT 100, -- 0-100
    voice_profile_id UUID, -- Reference to voice biometric
    last_verified TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Incident reports
CREATE TABLE incident_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    call_analysis_id UUID REFERENCES call_analyses(id),
    user_id UUID REFERENCES users(id),
    
    report_type VARCHAR(50), -- voice_cloning, phishing, fraud, etc.
    description TEXT,
    severity VARCHAR(20),
    
    shared_with_authorities BOOLEAN DEFAULT false,
    shared_with_community BOOLEAN DEFAULT false,
    
    status VARCHAR(50) DEFAULT 'open', -- open, investigating, resolved
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### MongoDB (Feature Vectors & Audio Metadata)
```javascript
// audio_features collection
{
  _id: ObjectId("..."),
  call_analysis_id: "uuid-from-postgres",
  user_id: "uuid",
  
  // Raw feature vectors
  features: {
    mfcc: [[Array of 13 coefficients per frame]],
    spectral_centroid: [Array],
    spectral_rolloff: [Array],
    zero_crossing_rate: [Array],
    pitch: [Array],
    energy: [Array],
    jitter: Number,
    shimmer: Number
  },
  
  // Embeddings from deep models
  embeddings: {
    wav2vec2: [768-dim vector],
    hubert: [768-dim vector]
  },
  
  // Detected artifacts
  artifacts: [
    { type: "spectral_irregularity", confidence: 0.85 },
    { type: "unnatural_noise", confidence: 0.72 }
  ],
  
  timestamp: ISODate("2026-09-04T05:30:00Z")
}

// voice_profiles collection (for trusted contacts)
{
  _id: ObjectId("..."),
  user_id: "uuid",
  contact_id: "uuid",
  
  // Voice biometric template
  voice_template: {
    pitch_mean: Number,
    pitch_std: Number,
    formants: [Array of formant frequencies],
    speaking_rate: Number,
    voice_quality_metrics: {}
  },
  
  // Historical embeddings for comparison
  embedding_history: [
    { date: ISODate(), embedding: [768-dim], call_id: "uuid" }
  ],
  
  last_updated: ISODate()
}
```

---

### 5. Security Architecture

#### Authentication & Authorization
```javascript
// JWT-based authentication
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthService {
  static async register(email, password) {
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = await db.users.create({
      email,
      password_hash: hashedPassword
    });
    
    return this.generateTokens(user);
  }
  
  static async login(email, password) {
    const user = await db.users.findByEmail(email);
    
    if (!user || !await bcrypt.compare(password, user.password_hash)) {
      throw new Error('Invalid credentials');
    }
    
    return this.generateTokens(user);
  }
  
  static generateTokens(user) {
    const accessToken = jwt.sign(
      { userId: user.id, tier: user.subscription_tier },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
}
```

#### End-to-End Encryption
```javascript
// Hybrid encryption: RSA + AES
const crypto = require('crypto');

class EncryptionService {
  // Generate key pair for user
  static generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
  }
  
  // Encrypt audio data
  static encryptAudio(audioBuffer, publicKey) {
    // Generate random AES key
    const aesKey = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    
    // Encrypt audio with AES
    const cipher = crypto.createCipheriv('aes-256-gcm', aesKey, iv);
    const encrypted = Buffer.concat([
      cipher.update(audioBuffer),
      cipher.final()
    ]);
    const authTag = cipher.getAuthTag();
    
    // Encrypt AES key with RSA public key
    const encryptedKey = crypto.publicEncrypt(publicKey, aesKey);
    
    return {
      encryptedData: encrypted,
      encryptedKey: encryptedKey,
      iv: iv,
      authTag: authTag
    };
  }
  
  // Decrypt audio data
  static decryptAudio(encrypted, privateKey) {
    // Decrypt AES key with RSA private key
    const aesKey = crypto.privateDecrypt(privateKey, encrypted.encryptedKey);
    
    // Decrypt audio with AES
    const decipher = crypto.createDecipheriv('aes-256-gcm', aesKey, encrypted.iv);
    decipher.setAuthTag(encrypted.authTag);
    
    return Buffer.concat([
      decipher.update(encrypted.encryptedData),
      decipher.final()
    ]);
  }
}
```

---

## Performance Optimization

### Edge Computing Strategy
- **Initial Detection**: On-device TF Lite model (< 100ms)
- **Deep Analysis**: Cloud-based ensemble (< 3 seconds)
- **Caching**: Redis for frequently analyzed contacts
- **Load Balancing**: Distribute AI inference across GPU clusters

### Scalability
- **Horizontal Scaling**: Kubernetes auto-scaling for API servers
- **Database Sharding**: Partition by user_id for PostgreSQL
- **Message Queue**: Redis pub/sub for real-time notifications
- **CDN**: CloudFront for static assets and cached results

---

## Deployment Architecture

```
Production Environment (AWS)

┌─────────────────────────────────────────────────────────┐
│  Route 53 (DNS) → CloudFront (CDN) → WAF                │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Application Load Balancer (Multi-AZ)                   │
└──────────────────────┬──────────────────────────────────┘
                       │
       ┌───────────────┴───────────────┐
       │                               │
┌──────▼──────────┐          ┌─────────▼────────┐
│  ECS Cluster    │          │  ECS Cluster     │
│  (API Servers)  │          │  (AI Workers)    │
│                 │          │                  │
│  Node.js        │          │  Python+PyTorch  │
│  Auto-scaling   │          │  GPU instances   │
└─────────────────┘          └──────────────────┘
       │                               │
       └───────────────┬───────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│  Data Layer                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ RDS          │  │ DocumentDB   │  │ ElastiCache  │ │
│  │ (PostgreSQL) │  │ (MongoDB)    │  │ (Redis)      │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │ S3           │  │ SageMaker    │                   │
│  │ (Recordings) │  │ (ML Training)│                   │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

---

**Next Steps**: Implement core detection models and mobile app prototype.
