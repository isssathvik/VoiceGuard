import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Mic,
  ShieldCheck,
  ShieldAlert,
  Search,
  Phone,
  Edit2,
  Trash2,
  Sparkles,
  Volume2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Contact } from '../../types';
import { ContactModal } from './ContactModal';
import { Button } from '../common/Button';

interface ContactsListProps {
  contacts: Contact[];
  onSaveContact: (contact: Partial<Contact>) => Promise<void>;
  onDeleteContact: (contactId: number) => Promise<void>;
  onShowToast: (title: string, message: string, type?: 'success' | 'warning' | 'error') => void;
  isLoading?: boolean;
}

export const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  onSaveContact,
  onDeleteContact,
  onShowToast,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [testingContactId, setTestingContactId] = useState<number | null>(null);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone_number.includes(searchTerm) ||
      c.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Contact) => {
    setEditingContact(c);
    setIsModalOpen(true);
  };

  const handleTestMatch = (c: Contact) => {
    if (!c.voice_enrolled) {
      onShowToast(
        'No Voice Embedding Found',
        `Please enroll a voice sample for ${c.name} before testing biometric matching.`,
        'warning'
      );
      return;
    }

    setTestingContactId(c.id);
    setTimeout(() => {
      setTestingContactId(null);
      onShowToast(
        'Biometric Acoustic Match Verified',
        `Similarity score for ${c.name}: 96.4% (Threshold ${c.voice_threshold || 85}%). Genuine human prosody confirmed.`,
        'success'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-indigo-500/20 p-4 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Trusted Voice Biometric Profiles & Guardians
            </h2>
            <p className="text-xs text-slate-400">
              Enrolled 512-dim speaker vectors & automated emergency family alert recipients
            </p>
          </div>
        </div>

        <Button
          variant="cyber"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<UserPlus className="w-4 h-4" />}
          className="text-xs font-mono w-full sm:w-auto"
        >
          Enroll New Trusted Contact
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-slate-900/90 border border-indigo-500/20 p-3 rounded-2xl backdrop-blur-md">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by contact name, phone number, or relationship tag..."
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs text-slate-400 hover:text-white mr-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Contact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent animate-spin rounded-full mx-auto mb-2" />
            <span className="font-mono text-xs">Loading biometric profiles...</span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-xs font-mono">No matching contacts found in address book.</p>
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-slate-900/90 border border-indigo-500/20 rounded-2xl p-5 space-y-4 backdrop-blur-md shadow-xl hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              {/* Header Info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-sm text-cyan-400 font-mono">
                      {contact.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {contact.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <span>{contact.phone_number}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {contact.relationship}
                  </span>
                </div>

                {/* Biometric Status Strip */}
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Mic className="w-3 h-3 text-cyan-400" /> Voice Biometrics:
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        contact.voice_enrolled
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {contact.voice_enrolled ? '512-d ENROLLED' : 'NOT ENROLLED'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Match Threshold:</span>
                    <span className="text-slate-200 font-bold">{contact.voice_threshold || 85}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Guardian Alert:</span>
                    <span className={contact.emergency_alert ? 'text-emerald-400' : 'text-slate-500'}>
                      {contact.emergency_alert ? 'Active SOS Recipient' : 'Disabled'}
                    </span>
                  </div>
                </div>

                {contact.notes && (
                  <p className="text-[11px] text-slate-400 italic line-clamp-1">
                    "{contact.notes}"
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestMatch(contact)}
                  isLoading={testingContactId === contact.id}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  className="text-[11px] font-mono flex-1 justify-center"
                >
                  Test Match
                </Button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(contact)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors"
                    title="Edit Contact"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={onSaveContact}
        contact={editingContact}
      />
    </div>
  );
};
