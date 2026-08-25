import React, { useState } from 'react';
import { EventItem } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  CheckCircle2, 
  Award, 
  Share2, 
  Bookmark, 
  ExternalLink, 
  Building, 
  Layers, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Trophy,
  Play,
  Heart
} from 'lucide-react';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  onRegisterClick?: (event: EventItem) => void;
  onToggleSave?: (eventId: string) => void;
  onViewTicket?: (ticketId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  event,
  onRegisterClick = (_event: EventItem) => {},
  onToggleSave = (_eventId: string) => {},
  onViewTicket = (_ticketId: string) => {},
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'schedule' | 'prizes' | 'guidelines'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !event) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out ${event.title} happening at ${event.venue} on YouthConnect Nashik!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1017] text-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl border border-white/15 flex flex-col animate-in zoom-in-95 duration-200">
        {/* Banner with floating actions */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-black/50 to-transparent" />

          {/* Top Bar Actions */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10">
            <span className="bg-[#0066ff] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
              {event.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/15 shadow-sm"
                title="Share Event"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(event.id)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors border border-white/15 shadow-sm ${
                    event.isSaved ? 'bg-red-500 text-white border-red-500' : 'bg-black/60 hover:bg-black/80 text-white'
                  }`}
                  title="Bookmark Event"
                >
                  <Heart className="w-4 h-4" fill={event.isSaved ? 'currentColor' : 'none'} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/15 shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Organizer Info */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
              <span className="font-semibold text-white">{event.organizer.name}</span>
              {event.organizer.isVerified && (
                <span className="flex items-center gap-0.5 text-[#38bdf8] text-[10px] bg-blue-950/70 border border-blue-400/30 px-1.5 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3 h-3 text-[#0066ff]" /> VERIFIED CLUB
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-3xl font-black font-headline drop-shadow-md text-white">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-[#141722] border-b border-white/10 px-6 flex gap-6 text-xs font-bold text-gray-400">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === 'overview'
                ? 'border-[#0066ff] text-[#38bdf8]'
                : 'border-transparent hover:text-white'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveSection('schedule')}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === 'schedule'
                ? 'border-[#0066ff] text-[#38bdf8]'
                : 'border-transparent hover:text-white'
            }`}
          >
            Timeline & Rounds
          </button>
          <button
            onClick={() => setActiveSection('prizes')}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === 'prizes'
                ? 'border-[#0066ff] text-[#38bdf8]'
                : 'border-transparent hover:text-white'
            }`}
          >
            Prizes & Perks
          </button>
          <button
            onClick={() => setActiveSection('guidelines')}
            className={`py-3 border-b-2 transition-colors ${
              activeSection === 'guidelines'
                ? 'border-[#0066ff] text-[#38bdf8]'
                : 'border-transparent hover:text-white'
            }`}
          >
            Rules & FAQs
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-6 overflow-y-auto flex-1 text-gray-300 text-xs space-y-6">
          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#141722] p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-900/40 text-[#38bdf8] flex items-center justify-center shrink-0 border border-blue-500/20">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">DATE</span>
                <span className="font-bold text-white">{event.date.fullDate}</span>
              </div>
            </div>

            <div className="bg-[#141722] p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-900/40 text-[#38bdf8] flex items-center justify-center shrink-0 border border-blue-500/20">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">TIME</span>
                <span className="font-bold text-white">{event.date.time}</span>
              </div>
            </div>

            <div className="bg-[#141722] p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">ENTRY FEE</span>
                <span className="font-bold text-emerald-400">{event.feeLabel}</span>
              </div>
            </div>

            <div className="bg-[#141722] p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block font-bold">ATTENDEES</span>
                <span className="font-bold text-white">
                  {event.registeredCount} / {event.capacity}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white font-headline mb-1.5">
                  About the Event
                </h3>
                <p className="leading-relaxed text-gray-300">
                  {event.description}
                </p>
              </div>

              {/* Venue Card */}
              <div className="bg-[#141722] border border-[#0066ff]/30 rounded-2xl p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0066ff] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs">
                      Venue & Location
                    </h4>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-[#38bdf8] font-bold border border-white/10">
                      Nashik Region: {event.area}
                    </span>
                  </div>
                  <p className="text-xs text-gray-200 mt-0.5 font-medium">
                    {event.venue}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Direct bus connectivity available from CBS & Nashik Road Railway Station. Dedicated student parking at Gate 2.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold text-white mb-2">Focus Topics & Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {event.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-lg bg-white/10 text-gray-300 font-medium text-[11px] border border-white/10"
                    >
                      #{t}
                    </span>
                  ))}
                  {event.departmentEligible && (
                    <span className="px-2.5 py-1 rounded-lg bg-blue-900/40 text-[#38bdf8] font-bold text-[11px] border border-blue-500/30">
                      Eligible: {event.departmentEligible}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section: Schedule */}
          {activeSection === 'schedule' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white font-headline">
                Event Rundown & Milestone Schedule
              </h3>
              <div className="border-l-2 border-[#0066ff]/40 pl-4 space-y-4 my-2">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0066ff] border-2 border-[#0e1017]" />
                  <span className="text-[10px] font-mono font-bold text-[#38bdf8]">08:30 AM – 09:30 AM</span>
                  <h4 className="font-bold text-white">Entry Gate Pass Verification & Kit Distribution</h4>
                  <p className="text-gray-400 text-[11px]">Present YouthConnect QR code pass at Main Gate Counter 1-4 for instant badge issuance.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0066ff] border-2 border-[#0e1017]" />
                  <span className="text-[10px] font-mono font-bold text-[#38bdf8]">09:45 AM – 11:00 AM</span>
                  <h4 className="font-bold text-white">Inaugural Keynote & Briefing Session</h4>
                  <p className="text-gray-400 text-[11px]">Welcome address by Principal, HOD and Industry Experts from Nashik IT Association (NIMA).</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0066ff] border-2 border-[#0e1017]" />
                  <span className="text-[10px] font-mono font-bold text-[#38bdf8]">11:15 AM – 04:00 PM</span>
                  <h4 className="font-bold text-white">Core Challenge / Hands-on Coding & Prototyping</h4>
                  <p className="text-gray-400 text-[11px]">Mentorship rounds with senior engineers, technical review and live project demos.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#00855b] border-2 border-[#0e1017]" />
                  <span className="text-[10px] font-mono font-bold text-[#4edea3]">04:30 PM – 05:30 PM</span>
                  <h4 className="font-bold text-white">Grand Finale, Prize Ceremony & Certificate Distribution</h4>
                  <p className="text-gray-400 text-[11px]">Announcement of winners, distribution of cash prize cheques and SPPU activity points certificates.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Prizes */}
          {activeSection === 'prizes' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 rounded-2xl border border-amber-500/40 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500 text-black flex items-center justify-center shrink-0 shadow-lg">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Total Rewards & Recognition Pool</h4>
                  <p className="text-xs text-amber-300 font-bold">₹50,000+ Prize Pool + Internship Offers + Medals</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/10 text-center">
                  <span className="text-xl">🥇</span>
                  <h5 className="font-bold text-white mt-1">1st Place</h5>
                  <span className="text-xs font-bold text-[#38bdf8]">₹25,000 Cash</span>
                  <p className="text-[10px] text-gray-400 mt-1">Trophy + incubation</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/10 text-center">
                  <span className="text-xl">🥈</span>
                  <h5 className="font-bold text-white mt-1">Runner Up</h5>
                  <span className="text-xs font-bold text-[#38bdf8]">₹15,000 Cash</span>
                  <p className="text-[10px] text-gray-400 mt-1">Runner trophy</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#141722] border border-white/10 text-center">
                  <span className="text-xl">🥉</span>
                  <h5 className="font-bold text-white mt-1">3rd Place</h5>
                  <span className="text-xs font-bold text-[#38bdf8]">₹10,000 Cash</span>
                  <p className="text-[10px] text-gray-400 mt-1">Hardware kit</p>
                </div>
              </div>

              <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>All registered participants will receive a <strong>Verified Digital Participation Certificate</strong> eligible for SPPU NAAC credit points.</span>
              </div>
            </div>
          )}

          {/* Section: Guidelines */}
          {activeSection === 'guidelines' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white font-headline">
                Participation Rules & FAQs
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2 bg-[#141722] p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Eligibility:</strong> Open to all undergraduate & postgraduate college students across Maharashtra with a valid College PRN/ID.</span>
                </li>
                <li className="flex items-start gap-2 bg-[#141722] p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Gate Pass:</strong> Entry will strictly be facilitated through the YouthConnect dynamic QR barcode scanner at the venue entrance.</span>
                </li>
                <li className="flex items-start gap-2 bg-[#141722] p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Hardware / Laptop:</strong> Participants in technical rounds should carry their own laptops and extension cords. Free Wi-Fi will be provided.</span>
                </li>
                <li className="flex items-start gap-2 bg-[#141722] p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Refund Policy:</strong> Cancellation requests accepted up to 24 hours before the event start time through the My Tickets dashboard.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Bottom Registration Bar */}
        <div className="p-4 sm:p-5 bg-[#141722] border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 block font-bold uppercase">Registration Status</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white">{event.feeLabel}</span>
              {event.fee === 0 && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                  100% Free
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {event.isRegistered ? (
              <button
                onClick={() => {
                  onClose();
                  if (onViewTicket && event.ticketId) {
                    onViewTicket(event.ticketId);
                  }
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                View My Ticket ({event.ticketId})
              </button>
            ) : (
              <button
                id="btn-modal-register-now"
                onClick={() => {
                  onClose();
                  onRegisterClick(event);
                }}
                className="px-6 py-2.5 bg-[#0066ff] hover:bg-[#0055d6] text-white rounded-xl font-black text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Register Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
