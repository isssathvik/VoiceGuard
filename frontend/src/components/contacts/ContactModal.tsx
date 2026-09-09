import React, { useState } from 'react';
import {
  Mic,
  CheckCircle2,
} from 'lucide-react';
import type { Contact } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => void;
  contact?: Contact | null;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  onSave,
  contact,
}) => {
  const [name, setName] = useState(contact?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(contact?.phone_number || '');
  const [relationship, setRelationship] = useState(contact?.relationship || 'Family');
  const [voiceEnrolled, setVoiceEnrolled] = useState<boolean>(contact?.voice_enrolled ?? false);
  const [voiceThreshold, setVoiceThreshold] = useState<number>(contact?.voice_threshold || 85);
  const [emergencyAlert, setEmergencyAlert] = useState<boolean>(contact?.emergency_alert ?? true);
  const [notes, setNotes] = useState(contact?.notes || '');
  const [isRecording, setIsRecording] = useState(false);

  React.useEffect(() => {
    if (contact) {
      setName(contact.name);
      setPhoneNumber(contact.phone_number);
      setRelationship(contact.relationship);
      setVoiceEnrolled(Boolean(contact.voice_enrolled || contact.voice_profile_enrolled));
      setVoiceThreshold(contact.voice_threshold || 85);
      setEmergencyAlert(contact.emergency_alert !== undefined ? contact.emergency_alert : true);
      setNotes(contact.notes || '');
    } else {
      setName('');
      setPhoneNumber('');
      setRelationship('Family');
      setVoiceEnrolled(false);
      setVoiceThreshold(85);
      setEmergencyAlert(true);
      setNotes('');
    }
  }, [contact, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(contact ? { id: contact.id } : {}),
      name,
      phone_number: phoneNumber,
      relationship,
      voice_enrolled: voiceEnrolled,
      voice_threshold: voiceThreshold,
      emergency_alert: emergencyAlert,
      notes,
    });
    onClose();
  };

  const handleSimulateVoiceRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setVoiceEnrolled(true);
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contact ? 'Edit Trusted Voice Profile' : 'Enroll New Trusted Contact'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {/* Full Name */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Contact Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ramesh Sharma (Dad)"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans text-sm"
          />
        </div>

        {/* Phone Number & Relationship */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Phone Number</label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Relationship</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs"
            >
              <option value="Family">Family Member</option>
              <option value="Parent">Parent</option>
              <option value="Sibling">Sibling</option>
              <option value="Child">Child</option>
              <option value="Bank Manager">Bank Manager / Financial</option>
              <option value="Lawyer">Legal Counsel</option>
              <option value="Colleague">Work / Associate</option>
            </select>
          </div>
        </div>

        {/* Biometric Voice Enrollment Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-200 font-bold flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-cyan-400" /> Biometric Voice Embedding
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                voiceEnrolled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {voiceEnrolled ? 'EMBEDDING ENROLLED' : 'NOT ENROLLED'}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
            Enroll 10 seconds of high-fidelity audio to generate a 512-dim neural speaker embedding. VoiceGuard uses this to verify the caller is not an AI voice clone.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button
              type="button"
              variant={voiceEnrolled ? 'secondary' : 'cyber'}
              size="sm"
              onClick={handleSimulateVoiceRecording}
              isLoading={isRecording}
              leftIcon={<Mic className="w-3.5 h-3.5" />}
              className="text-xs font-mono"
            >
              {isRecording
                ? 'Sampling Acoustic Spectrum...'
                : voiceEnrolled
                ? 'Re-Sample Voice Biometrics'
                : 'Sample Voice Biometrics (10s)'}
            </Button>

            {voiceEnrolled && (
              <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 512-d Vector Synced
              </span>
            )}
          </div>
        </div>

        {/* Emergency Alert & Threshold */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-bold">Guardian SOS Broadcast</div>
              <div className="text-[11px] text-slate-400 font-sans">
                Automatically send emergency SMS/WhatsApp alert to this contact if extortion threat is detected
              </div>
            </div>
            <input
              type="checkbox"
              checked={emergencyAlert}
              onChange={(e) => setEmergencyAlert(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-300">Biometric Similarity Threshold</span>
              <span className="text-cyan-400 font-bold">{voiceThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={voiceThreshold}
              onChange={(e) => setVoiceThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-slate-300 font-bold mb-1">Notes / Security Passphrase</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Verified voice in person, family secret word is 'Mango'"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans text-xs"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="cyber" size="sm">
            Save Voice Profile
          </Button>
        </div>
      </form>
    </Modal>
  );
};
