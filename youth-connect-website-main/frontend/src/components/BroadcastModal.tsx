import React, { useState } from 'react';
import { EventItem } from '../types';
import { 
  X, 
  Send, 
  Bell, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  CheckCircle2, 
  Users, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  onSendBroadcast: (broadcast: {
    eventId: string;
    channel: string;
    subject: string;
    message: string;
    recipientCount: number;
  }) => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  events,
  onSendBroadcast,
}) => {
  const [selectedEventId, setSelectedEventId] = useState(events[0]?.id || '');
  const [channel, setChannel] = useState<'All' | 'Email' | 'WhatsApp' | 'InApp'>('All');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const recipientCount = currentEvent ? currentEvent.registeredCount : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onSendBroadcast({
      eventId: selectedEventId,
      channel,
      subject: subject || `Update regarding ${currentEvent?.title}`,
      message,
      recipientCount,
    });

    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      onClose();
      setMessage('');
      setSubject('');
    }, 1800);
  };

  const insertQuickTemplate = (type: 'room_change' | 'reporting_time' | 'hackathon_pack') => {
    if (type === 'room_change') {
      setSubject('Venue Room Update: Lab 304');
      setMessage(`Dear Participants, please note that the keynote & briefing for ${currentEvent?.title || 'the event'} will now convene in Auditorium B (Lab 304, 3rd Floor). Please arrive 15 minutes before start.`);
    } else if (type === 'reporting_time') {
      setSubject('Reporting Time & Registration Desk Check-in');
      setMessage(`Reminder: Gate check-in commences promptly at 8:30 AM tomorrow. Please keep your YouthConnect QR pass and College Physical ID card ready for rapid barcode scanning.`);
    } else if (type === 'hackathon_pack') {
      setSubject('Hackathon Problem Statements & Discord Server Link');
      setMessage(`Hackathon tracks & mentor list are now unlocked! Join the official WhatsApp channel & Discord workspace via the attendee portal.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-[#c2c6d6]/60 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-[#0058be] to-[#004294] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Send className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold font-headline">
                Broadcast Announcement
              </h2>
              <p className="text-xs text-white/80">
                Dispatch instant push alerts, WhatsApp notices & emails to registered students
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSent ? (
          <div className="p-10 flex flex-col items-center justify-center text-center animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-lg font-bold text-[#0b1c30] font-headline mb-1">
              Broadcast Dispatched Successfully!
            </h3>
            <p className="text-xs text-[#727785] max-w-xs">
              Sent to <span className="font-bold text-[#0058be]">{recipientCount} registered attendees</span> via {channel === 'All' ? 'WhatsApp, Email & In-App' : channel}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {/* Target Event Selector */}
            <div>
              <label className="text-xs font-bold text-[#0b1c30] block mb-1.5">
                Target Event
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2.5 text-xs font-medium text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
              >
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.title} ({ev.registeredCount} attendees)
                  </option>
                ))}
              </select>
            </div>

            {/* Recipient Count Indicator */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 border border-[#c2c6d6]/40 text-xs">
              <div className="flex items-center gap-2 text-[#0058be] font-bold">
                <Users className="w-4 h-4" />
                <span>Audience Reach:</span>
              </div>
              <span className="font-bold text-[#0b1c30]">
                {recipientCount} confirmed participants
              </span>
            </div>

            {/* Notification Channels */}
            <div>
              <label className="text-xs font-bold text-[#0b1c30] block mb-1.5">
                Dispatch Channels
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'All', label: 'All Channels', icon: Bell },
                  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'Email', label: 'Email blast', icon: Mail },
                  { id: 'InApp', label: 'In-App Alert', icon: Smartphone },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = channel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChannel(item.id as any)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'border-[#0058be] bg-[#eff4ff] text-[#0058be] shadow-xs'
                          : 'border-[#c2c6d6]/60 bg-white text-[#424754] hover:bg-[#f8f9ff]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-center">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Templates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#0b1c30]">
                  Quick Fill Templates
                </label>
                <span className="text-[10px] text-[#727785] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#0058be]" /> Instant autofill
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => insertQuickTemplate('reporting_time')}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-[#0058be] text-[#424754] text-[11px] font-medium border border-gray-200 transition-colors"
                >
                  ⏰ Reporting Time
                </button>
                <button
                  type="button"
                  onClick={() => insertQuickTemplate('room_change')}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-[#0058be] text-[#424754] text-[11px] font-medium border border-gray-200 transition-colors"
                >
                  📍 Hall / Lab Update
                </button>
                <button
                  type="button"
                  onClick={() => insertQuickTemplate('hackathon_pack')}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-[#0058be] text-[#424754] text-[11px] font-medium border border-gray-200 transition-colors"
                >
                  💻 Problem Statements
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-bold text-[#0b1c30] block mb-1">
                Announcement Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Crucial Update: Schedule & Seating Allotment"
                className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-bold text-[#0b1c30] block mb-1">
                Message Content
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement details, instructions, or links here..."
                className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl p-3 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be] resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-2 pt-2 border-t border-[#e5eeff]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#c2c6d6] text-xs font-bold text-[#424754] hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim()}
                className="flex-1 py-2.5 bg-[#0058be] hover:bg-[#004bb0] disabled:bg-gray-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                Send Broadcast to {recipientCount} Attendees
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
