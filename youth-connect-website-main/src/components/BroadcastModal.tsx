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
  Loader2,
  Radio,
  Clock,
  MapPin,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [channel, setChannel] = useState<'All Channels' | 'WhatsApp' | 'Email Blast' | 'In-App Alert'>('All Channels');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const currentEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const recipientCount = currentEvent ? (currentEvent.attendees?.length ?? currentEvent.registeredCount) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);

    // 1-second simulated dispatch loading spinner
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7C6BA6', '#8B7CB6', '#10B981']
        });
      } catch (err) {
        // fallback
      }

      onSendBroadcast({
        eventId: selectedEventId || (events[0]?.id ?? ''),
        channel,
        subject: subject || `Update regarding ${currentEvent?.title}`,
        message,
        recipientCount,
      });

      // Smooth auto-dismiss
      setTimeout(() => {
        setIsSent(false);
        onClose();
        setMessage('');
        setSubject('');
      }, 1800);
    }, 1000);
  };

  const insertQuickTemplate = (type: 'reporting_time' | 'hall_update' | 'problem_statements') => {
    if (type === 'reporting_time') {
      setSubject(`Reporting Time & Gate Protocol - ${currentEvent?.title || 'Event'}`);
      setMessage(
        `Mandatory Reporting Notice for ${currentEvent?.title || 'the upcoming event'}:\n` +
        `• Reporting Time: 8:30 AM Sharp (Keynote starts at 9:15 AM)\n` +
        `• Venue Check-in: ${currentEvent?.venue || 'Main College Auditorium'}\n` +
        `• Gate Requirements: Valid Physical College ID Card + YouthConnect Dynamic QR Gate Pass (downloadable via My Passes).\n` +
        `Please arrive early to ensure swift barcode scanning and badge pickup.`
      );
    } else if (type === 'hall_update') {
      setSubject(`Hall / Lab Allotment & Seating Guide - ${currentEvent?.title || 'Event'}`);
      setMessage(
        `Seating and Lab Allocations for ${currentEvent?.title || 'the event'}:\n` +
        `• Track A (Software & AI): Computing Lab 304 & 305 (3rd Floor, West Wing)\n` +
        `• Track B (Hardware / Robotics): Central Mechanical Workshop & Mechatronics Lab\n` +
        `• General Briefing & High-Tea: Ground Floor Central Atrium\n` +
        `High-speed campus Wi-Fi credentials will be displayed on registration badges.`
      );
    } else if (type === 'problem_statements') {
      setSubject(`Problem Statements Released & Submission Guidelines - ${currentEvent?.title || 'Hackathon'}`);
      setMessage(
        `The official challenge statements for ${currentEvent?.title || 'the hackathon'} are now live!\n` +
        `• Submission Portal: https://youthconnect-nashik.dev/submit\n` +
        `• Deadline: 4:00 PM Sharp\n` +
        `• Discord Support & Mentorship Desk: Channels #track-ai, #track-web3, and #mentor-help are open.\n` +
        `Good luck to all teams!`
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div className="relative bg-white text-stone-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Accent */}
        <div className="h-1.5 w-full bg-[#8B7CB6]" />

        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-[#8B7CB6] shadow-xs">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Organizer Broadcast Center
              </h2>
              <p className="text-[11px] text-stone-500 font-serif">
                Multi-channel push notification & email dispatch engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSent ? (
          <div className="p-8 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200 font-serif">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 font-serif mb-1">
              Broadcast Dispatched Successfully!
            </h3>
            <p className="text-xs text-stone-600 max-w-sm font-serif">
              Delivered to <span className="font-semibold text-[#7C6BA6]">{recipientCount} registered attendees</span> via <span className="font-semibold text-stone-900">{channel}</span>.
            </p>
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-center gap-2 font-serif">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Broadcast recorded in audit trail with 100% deliverability</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3.5 font-serif">
            {/* Target Event Selector & Live Audience Reach */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-7">
                <label className="text-xs font-semibold text-stone-800 block mb-1 font-serif">
                  Target Event
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                >
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.attendees?.length ?? ev.registeredCount} attendees)
                    </option>
                  ))}
                </select>
              </div>

              {/* Live Audience Reach Badge */}
              <div className="sm:col-span-5">
                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#7C6BA6] text-xs font-semibold font-serif">
                    <Users className="w-3.5 h-3.5 text-[#8B7CB6]" />
                    <span>Audience:</span>
                  </div>
                  <span className="font-semibold text-stone-900 text-xs bg-white px-2 py-0.5 rounded-lg border border-purple-200 font-serif shadow-xs">
                    {recipientCount} Attendees
                  </span>
                </div>
              </div>
            </div>

            {/* Dispatch Channels (Pill Buttons) */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1 font-serif">
                Dispatch Channels
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'All Channels', label: 'All Channels', icon: Bell },
                  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'Email Blast', label: 'Email Blast', icon: Mail },
                  { id: 'In-App Alert', label: 'In-App Alert', icon: Smartphone },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = channel === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChannel(item.id as any)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all cursor-pointer font-serif ${
                        isSelected
                          ? 'border-[#8B7CB6] bg-purple-50 text-[#7C6BA6] font-semibold shadow-xs'
                          : 'border-stone-200 bg-white text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#8B7CB6]' : 'text-stone-400'}`} />
                      <span className="text-center truncate w-full">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Fill Templates */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-800 font-serif">
                  Quick Fill Templates
                </label>
                <span className="text-[10px] text-[#7C6BA6] flex items-center gap-1 font-serif font-medium">
                  <Sparkles className="w-3 h-3 text-[#8B7CB6]" /> 1-Click Fill
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 font-serif">
                <button
                  type="button"
                  onClick={() => insertQuickTemplate('reporting_time')}
                  className="px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-purple-50 text-stone-700 text-xs font-medium border border-stone-200 hover:border-[#8B7CB6] flex items-center gap-1 transition-colors cursor-pointer font-serif"
                >
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>Reporting Time</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertQuickTemplate('hall_update')}
                  className="px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-purple-50 text-stone-700 text-xs font-medium border border-stone-200 hover:border-[#8B7CB6] flex items-center gap-1 transition-colors cursor-pointer font-serif"
                >
                  <MapPin className="w-3 h-3 text-[#8B7CB6]" />
                  <span>Hall / Lab Update</span>
                </button>
                <button
                  type="button"
                  onClick={() => insertQuickTemplate('problem_statements')}
                  className="px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-purple-50 text-stone-700 text-xs font-medium border border-stone-200 hover:border-[#8B7CB6] flex items-center gap-1 transition-colors cursor-pointer font-serif"
                >
                  <FileCode className="w-3 h-3 text-emerald-600" />
                  <span>Problem Statements</span>
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1 font-serif">
                Announcement Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Crucial Update: Schedule & Seating Allotment"
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
              />
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1 font-serif">
                Message Content <span className="text-[#8B7CB6]">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement details, instructions, or links here..."
                className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] resize-none font-serif leading-relaxed shadow-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-2.5 pt-2 border-t border-stone-200 font-serif">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors cursor-pointer font-serif"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isSending}
                className="flex-1 py-2 bg-[#8B7CB6] hover:bg-[#7C6BA6] disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 disabled:cursor-not-allowed cursor-pointer font-serif"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching Broadcast...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch to {recipientCount} Attendees</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
