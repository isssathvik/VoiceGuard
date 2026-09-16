import librosa
import numpy as np
from typing import Dict, Any, List, Optional
from models.schemas import VoiceAnalysisResult

class VoiceAnalyzer:
    """
    ADVANCED AI Voice Cloning Detection using Multi-Layer Acoustic Analysis

    Detection Strategy:
    1. Spectral Analysis - AI voices have unnatural high-frequency cutoff
    2. Prosody Analysis - Real voices have natural pitch variation
    3. Temporal Consistency - Humans have micro-variations in timing
    4. Phase Coherence - AI generation leaves phase artifacts
    5. Harmonic Structure - Real voices have complex harmonic relationships
    """

    @staticmethod
    def analyze_audio_file(audio_path: str, is_known_contact: bool = False) -> VoiceAnalysisResult:
        """
        Analyze actual audio file with advanced multi-layer detection
        """
        try:
            # Load audio file
            y, sr = librosa.load(audio_path, sr=16000, mono=True)
            y, _ = librosa.effects.trim(y, top_db=35)
            peak = np.max(np.abs(y)) if y.size else 0
            if peak > 0:
                y = librosa.util.normalize(y)
            if y.size < sr * 0.5:
                return VoiceAnalyzer._fallback_analysis(is_known_contact)

            # Run 5-layer detection
            spectral_score = VoiceAnalyzer._analyze_spectral(y, sr)
            prosody_score = VoiceAnalyzer._analyze_prosody(y, sr)
            temporal_score = VoiceAnalyzer._analyze_temporal(y, sr)
            phase_score = VoiceAnalyzer._analyze_phase(y, sr)
            harmonic_score = VoiceAnalyzer._analyze_harmonic(y, sr)

            # Weighted ensemble (higher = more likely REAL)
            # Modern AI voice cloning requires stronger emphasis on prosody and phase
            real_confidence = (
                spectral_score * 0.22 +
                prosody_score * 0.28 +  # Increased - most revealing for modern AI
                temporal_score * 0.20 +
                phase_score * 0.18 +    # Increased - phase artifacts are key
                harmonic_score * 0.12
            )

            # Convert to probabilities
            synthetic_prob = float(np.clip(1.0 - real_confidence, 0.0, 1.0))
            genuine_prob = real_confidence

            # Determine binary flags based on scores
            prosody_anomaly = prosody_score < 0.60
            spectral_artifacts = spectral_score < 0.60
            abnormal_pauses = temporal_score < 0.60

            # Voice profile match (higher for known contacts)
            if is_known_contact:
                voice_match = min(0.98, real_confidence + 0.15)
            else:
                voice_match = real_confidence * 0.85

            # Pitch consistency
            pitch_consistency = prosody_score

            return VoiceAnalysisResult(
                synthetic_probability=round(synthetic_prob, 2),
                genuine_probability=round(genuine_prob, 2),
                prosody_anomaly_detected=prosody_anomaly,
                spectral_artifacts_detected=spectral_artifacts,
                abnormal_pauses=abnormal_pauses,
                voice_profile_match=round(voice_match, 2),
                pitch_consistency=round(pitch_consistency, 2)
            )

        except Exception as e:
            print(f"Error analyzing audio: {e}")
            # Fallback to neutral
            return VoiceAnalyzer._fallback_analysis(is_known_contact)

    @staticmethod
    def _analyze_spectral(y: np.ndarray, sr: int) -> float:
        """
        Layer 1: Spectral Analysis - ENHANCED for Modern Voice Cloning Detection
        Real voices: Natural variation in frequency spectrum with organic imperfections
        AI voices (Chatterbox/ElevenLabs/etc): Too smooth OR overly processed harmonics
        """
        # Compute STFT
        S = np.abs(librosa.stft(y))

        # Check spectral variation
        spectral_std = np.std(S)

        # Modern AI voice cloning (like Chatterbox) is VERY good - stricter thresholds
        # Optimal range for real voice: 0.08-0.25
        if spectral_std < 0.10:
            variation_score = spectral_std / 0.10  # Too smooth = AI
        elif spectral_std > 0.30:
            variation_score = max(0, 1.0 - (spectral_std - 0.30) / 0.25)  # Too varied = AI
        else:
            variation_score = 1.0  # Natural range

        # Check high-frequency content (AI often has cutoff at ~8kHz)
        # Voice cloning tools often compress high frequencies
        freqs = librosa.fft_frequencies(sr=sr)
        high_freq_mask = freqs > 8000
        high_freq_energy = np.mean(S[high_freq_mask, :]) if np.any(high_freq_mask) else 0
        # Real voices have more high-freq energy
        high_freq_score = min(high_freq_energy / 0.008, 1.0)  # Stricter threshold

        # Check spectral centroid variation
        cent = librosa.feature.spectral_centroid(y=y, sr=sr)
        cent_var = np.std(cent)
        # Natural range: 300-800, AI clones often fall outside
        if cent_var < 250:  # Stricter
            centroid_score = cent_var / 250.0
        elif cent_var > 850:
            centroid_score = max(0, 1.0 - (cent_var - 850) / 400.0)
        else:
            centroid_score = 1.0

        # Check spectral flatness (AI voices have unnatural flatness patterns)
        flatness = librosa.feature.spectral_flatness(y=y)
        flatness_var = np.std(flatness)
        # AI clones have MORE uniform flatness
        flatness_score = min(flatness_var / 0.12, 1.0)  # Stricter

        # NEW: Check spectral rolloff consistency
        # AI voices have more consistent rolloff points
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr, roll_percent=0.85)
        rolloff_std = np.std(rolloff)
        # Real voices: more variation in rolloff
        rolloff_score = min(rolloff_std / 800.0, 1.0)

        # NEW: Spectral bandwidth check
        # AI often has narrower, more consistent bandwidth
        bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr)
        bandwidth_var = np.std(bandwidth)
        bandwidth_score = min(bandwidth_var / 600.0, 1.0)

        # Combine with stronger weights on AI-revealing features
        return (variation_score * 0.25 + high_freq_score * 0.25 +
                centroid_score * 0.15 + flatness_score * 0.15 +
                rolloff_score * 0.10 + bandwidth_score * 0.10)

    @staticmethod
    def _analyze_prosody(y: np.ndarray, sr: int) -> float:
        """
        Layer 2: Prosody Analysis - ENHANCED for Voice Cloning Detection
        Real voices: Moderate natural pitch fluctuation with organic micro-variations
        AI voices (Chatterbox/etc): Either too stable OR artificially smooth transitions
        """
        # Extract pitch using librosa's pyin
        f0, voiced_flag, voiced_probs = librosa.pyin(
            y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'), sr=sr
        )

        # Remove unvoiced segments
        f0_clean = f0[~np.isnan(f0)]

        if len(f0_clean) < 10:
            return 0.50  # Not enough pitch data

        # Natural pitch variation
        pitch_std = np.std(f0_clean)
        pitch_mean = np.mean(f0_clean)

        # Modern AI voice cloning has improved - stricter thresholds
        # Real voices: 12-50 Hz std, AI clones are often too stable
        if pitch_std < 10:  # Stricter
            pitch_score = pitch_std / 10.0  # Too stable = AI
        elif pitch_std > 55:  # Stricter upper bound
            pitch_score = max(0, 1.0 - (pitch_std - 55) / 35.0)  # Too varied = AI
        else:
            pitch_score = 1.0

        # Check pitch jitter (micro-variations) - CRITICAL for detecting modern AI
        # Real voices have natural jitter, AI clones are often too smooth
        if len(f0_clean) > 1:
            pitch_diff = np.abs(np.diff(f0_clean))
            jitter = np.mean(pitch_diff) / (pitch_mean + 1e-10)
            # Real human jitter: 0.015-0.04
            if jitter < 0.012:  # Too smooth = likely AI
                jitter_score = jitter / 0.012
            else:
                jitter_score = min(jitter / 0.018, 1.0)
        else:
            jitter_score = 0.5

        # NEW: Pitch contour smoothness - AI has unnaturally smooth transitions
        if len(f0_clean) > 2:
            # Calculate second derivative (acceleration of pitch changes)
            pitch_accel = np.abs(np.diff(np.diff(f0_clean)))
            accel_score = min(np.mean(pitch_accel) / 8.0, 1.0)
        else:
            accel_score = 0.5

        # Energy dynamics
        rms = librosa.feature.rms(y=y)
        energy_var = np.std(rms)
        # Natural range: 0.01-0.08 (stricter)
        if energy_var < 0.009:  # Stricter
            energy_score = energy_var / 0.009
        elif energy_var > 0.09:
            energy_score = max(0, 1.0 - (energy_var - 0.09) / 0.05)
        else:
            energy_score = 1.0

        # NEW: Voice quality shimmer (amplitude variation)
        # Real voices have natural shimmer, AI is often too consistent
        if len(rms[0]) > 1:
            shimmer = np.std(np.diff(rms[0])) / (np.mean(rms[0]) + 1e-10)
            shimmer_score = min(shimmer / 0.08, 1.0)
        else:
            shimmer_score = 0.5

        # Stronger weights on jitter and micro-variations that reveal AI
        return (pitch_score * 0.25 + jitter_score * 0.30 + accel_score * 0.15 +
                energy_score * 0.20 + shimmer_score * 0.10)

    @staticmethod
    def _analyze_temporal(y: np.ndarray, sr: int) -> float:
        """
        Layer 3: Temporal Consistency
        Real voices: Human micro-variations in timing
        AI voices: Robotic consistency
        """
        # Onset detection (syllable/word boundaries)
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        onset_times = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, units='time')

        if len(onset_times) < 3:
            return 0.50

        # Compute inter-onset intervals
        intervals = np.diff(onset_times)

        # Real speech has natural variation in timing
        interval_std = np.std(intervals)
        timing_score = min(interval_std / 0.15, 1.0)

        # Check for micro-variations (look at onset strength changes)
        onset_var = np.std(np.diff(onset_env))
        micro_score = min(onset_var / 1.5, 1.0)

        return (timing_score * 0.6 + micro_score * 0.4)

    @staticmethod
    def _analyze_phase(y: np.ndarray, sr: int) -> float:
        """
        Layer 4: Phase Coherence - ENHANCED for Modern Voice Cloning
        Real voices: Random phase relationships with organic irregularities
        AI voices (Chatterbox/etc): Artificially coherent phase patterns
        """
        # Compute STFT with phase
        D = librosa.stft(y)
        mag, phase = np.abs(D), np.angle(D)

        # Check phase randomness across frequencies
        # AI often has more coherent phase patterns (stricter threshold)
        phase_diff = np.diff(phase, axis=0)
        phase_std = np.std(phase_diff)

        # Higher std = more random = more natural (stricter)
        phase_score = min(phase_std / 1.8, 1.0)  # Stricter from 2.0

        # Instantaneous frequency deviation (real voices vary more)
        if_deviation = np.std(np.diff(phase, axis=1))
        if_score = min(if_deviation / 1.3, 1.0)  # Stricter from 1.5

        # NEW: Phase coherence index
        # AI voices have suspiciously coherent phase across frequency bands
        if phase.shape[0] > 1:
            phase_corr = np.corrcoef(phase[:min(50, phase.shape[0]), :])
            coherence = np.mean(np.abs(phase_corr[np.triu_indices_from(phase_corr, k=1)]))
            # Lower coherence = more natural (real voices are less correlated)
            coherence_score = max(0, 1.0 - coherence / 0.3)
        else:
            coherence_score = 0.5

        return (phase_score * 0.40 + if_score * 0.35 + coherence_score * 0.25)

    @staticmethod
    def _analyze_harmonic(y: np.ndarray, sr: int) -> float:
        """
        Layer 5: Harmonic Structure - ENHANCED for Voice Cloning Detection
        Real voices: Complex natural formants with organic irregularities
        AI voices (Chatterbox/etc): Synthetic harmonic relationships, too "perfect"
        """
        # Extract harmonic and percussive components
        y_harmonic, y_percussive = librosa.effects.hpss(y)

        # Compute harmonic-to-noise ratio
        harmonic_power = np.sum(y_harmonic ** 2)
        noise_power = np.sum(y_percussive ** 2)
        hnr = harmonic_power / (noise_power + 1e-10)

        # Real voices have balanced HNR (not too clean)
        # Modern AI voices often TOO clean (higher HNR) - stricter threshold
        # Natural voice HNR: 5-40, AI clones often 50+
        if hnr > 50:
            hnr_score = max(0, 1.0 - (hnr - 50) / 100.0)
        else:
            hnr_score = min(hnr / 30.0, 1.0)

        # Check formant naturalness via MFCCs
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        mfcc_var = np.mean(np.std(mfcc, axis=1))
        # Real voices: natural MFCC variation (stricter)
        mfcc_score = min(mfcc_var / 45.0, 1.0)

        # Spectral rolloff (frequency below which 85% of energy)
        rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr)
        rolloff_var = np.std(rolloff)
        rolloff_score = min(rolloff_var / 900.0, 1.0)

        # NEW: Zero-crossing rate variation
        # AI voices often have more consistent zero-crossing patterns
        zcr = librosa.feature.zero_crossing_rate(y)
        zcr_var = np.std(zcr)
        zcr_score = min(zcr_var / 0.08, 1.0)

        # NEW: Spectral contrast (difference between peaks and valleys)
        # Real voices have more dynamic spectral contrast
        contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        contrast_var = np.mean(np.std(contrast, axis=1))
        contrast_score = min(contrast_var / 8.0, 1.0)

        return (hnr_score * 0.30 + mfcc_score * 0.25 + rolloff_score * 0.20 +
                zcr_score * 0.15 + contrast_score * 0.10)

    @staticmethod
    def _fallback_analysis(is_known_contact: bool) -> VoiceAnalysisResult:
        """Fallback when audio analysis fails"""
        return VoiceAnalysisResult(
            synthetic_probability=0.50,
            genuine_probability=0.50,
            prosody_anomaly_detected=False,
            spectral_artifacts_detected=False,
            abnormal_pauses=False,
            voice_profile_match=0.85 if is_known_contact else None,
            pitch_consistency=0.70
        )

    @staticmethod
    def analyze_audio_features(
        raw_samples: Optional[List[float]] = None,
        audio_path: Optional[str] = None,
        scenario: Optional[str] = None,
        is_known_contact: bool = False
    ) -> VoiceAnalysisResult:
        """
        Main entry point - supports both file paths and scenarios
        """
        # If audio path provided, use advanced analysis
        if audio_path:
            return VoiceAnalyzer.analyze_audio_file(audio_path, is_known_contact)

        # Fallback to scenario-based (for demo scenarios)
        if scenario == "safe_family" or is_known_contact:
            return VoiceAnalysisResult(
                synthetic_probability=0.03,
                genuine_probability=0.97,
                prosody_anomaly_detected=False,
                spectral_artifacts_detected=False,
                abnormal_pauses=False,
                voice_profile_match=0.98 if is_known_contact else 0.85,
                pitch_consistency=0.92
            )
        elif scenario in ["ai_bank_scam", "fake_call"]:
            return VoiceAnalysisResult(
                synthetic_probability=0.94,
                genuine_probability=0.06,
                prosody_anomaly_detected=True,
                spectral_artifacts_detected=True,
                abnormal_pauses=True,
                voice_profile_match=0.12,
                pitch_consistency=0.61
            )
        elif scenario == "govt_impersonation":
            return VoiceAnalysisResult(
                synthetic_probability=0.88,
                genuine_probability=0.12,
                prosody_anomaly_detected=True,
                spectral_artifacts_detected=True,
                abnormal_pauses=False,
                voice_profile_match=0.08,
                pitch_consistency=0.68
            )

        # Default neutral
        return VoiceAnalyzer._fallback_analysis(is_known_contact)
