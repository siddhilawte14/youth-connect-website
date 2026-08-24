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
  ShieldCheck, 
  ChevronRight, 
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200 font-serif">
      <div className="bg-[#181126]/90 text-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/30 border-t-white/60 flex flex-col animate-in zoom-in-95 duration-200 font-serif backdrop-blur-2xl">
        {/* Banner with floating actions */}
        <div className="relative h-60 sm:h-64 w-full overflow-hidden shrink-0">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181126] via-black/40 to-transparent" />

          {/* Top Bar Actions */}
          <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 font-serif">
            <span className="bg-gradient-to-r from-[#8B7CB6] to-pink-500 text-white text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-200/40 font-serif backdrop-blur-md">
              {event.category}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/30 cursor-pointer shadow-xs"
                title="Share Event"
              >
                {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
              {onToggleSave && (
                <button
                  onClick={() => onToggleSave(event.id)}
                  className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-colors border border-white/30 cursor-pointer shadow-xs ${
                    event.isSaved ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' : 'bg-black/60 hover:bg-black/80 text-white'
                  }`}
                  title="Bookmark Event"
                >
                  <Heart className="w-4 h-4" fill={event.isSaved ? 'currentColor' : 'none'} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-colors border border-white/30 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Organizer Info */}
          <div className="absolute bottom-4 left-6 right-6 text-white font-serif">
            <div className="flex items-center gap-2 text-xs text-purple-200 mb-1 font-serif">
              <span className="font-semibold text-white drop-shadow-sm">{event.organizer.name}</span>
              {event.organizer.isVerified && (
                <span className="flex items-center gap-1 text-purple-200 text-[10px] bg-black/60 border border-purple-300/40 px-2 py-0.5 rounded-full font-medium font-serif backdrop-blur-md">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> VERIFIED CLUB
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/10 border-b border-white/20 px-6 flex gap-6 text-xs font-semibold text-stone-300 font-serif backdrop-blur-md">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-3 border-b-2 transition-colors cursor-pointer font-serif ${
              activeSection === 'overview'
                ? 'border-pink-400 text-pink-300 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveSection('schedule')}
            className={`py-3 border-b-2 transition-colors cursor-pointer font-serif ${
              activeSection === 'schedule'
                ? 'border-pink-400 text-pink-300 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Timeline & Rounds
          </button>
          <button
            onClick={() => setActiveSection('prizes')}
            className={`py-3 border-b-2 transition-colors cursor-pointer font-serif ${
              activeSection === 'prizes'
                ? 'border-pink-400 text-pink-300 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Prizes & Perks
          </button>
          <button
            onClick={() => setActiveSection('guidelines')}
            className={`py-3 border-b-2 transition-colors cursor-pointer font-serif ${
              activeSection === 'guidelines'
                ? 'border-pink-400 text-pink-300 font-bold'
                : 'border-transparent hover:text-white'
            }`}
          >
            Rules & FAQs
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-stone-200 text-xs space-y-5 font-serif bg-transparent">
          {/* Key Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-serif">
            <div className="bg-black/30 p-3 rounded-2xl border border-white/20 flex items-center gap-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-white/20 text-pink-300 flex items-center justify-center shrink-0 border border-white/30">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block font-medium">DATE</span>
                <span className="font-bold text-white">{event.date.fullDate}</span>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-2xl border border-white/20 flex items-center gap-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-white/20 text-pink-300 flex items-center justify-center shrink-0 border border-white/30">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block font-medium">TIME</span>
                <span className="font-bold text-white">{event.date.time}</span>
              </div>
            </div>

            <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-300/40 flex items-center gap-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/30 text-emerald-200 flex items-center justify-center shrink-0 border border-emerald-300/50">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 block font-medium">ENTRY FEE</span>
                <span className="font-bold text-emerald-200">{event.feeLabel}</span>
              </div>
            </div>

            <div className="bg-black/30 p-3 rounded-2xl border border-white/20 flex items-center gap-2.5 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-xl bg-white/20 text-pink-300 flex items-center justify-center shrink-0 border border-white/30">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-purple-300 block font-medium">ATTENDEES</span>
                <span className="font-bold text-white">
                  {event.registeredCount} / {event.capacity}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Overview */}
          {activeSection === 'overview' && (
            <div className="space-y-4 font-serif">
              <div>
                <h3 className="text-sm font-bold text-white font-serif mb-1 drop-shadow-sm">
                  About the Event
                </h3>
                <p className="leading-relaxed text-stone-300 font-serif">
                  {event.description}
                </p>
              </div>

              {/* Venue Card */}
              <div className="bg-black/30 border border-white/20 rounded-2xl p-4 flex items-start gap-3 shadow-md backdrop-blur-md">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 font-serif">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-xs font-serif">
                      Venue & Location
                    </h4>
                    <span className="text-[10px] bg-pink-500/25 px-2.5 py-0.5 rounded-full text-pink-200 font-semibold border border-pink-300/40 font-serif">
                      Nashik: {event.area}
                    </span>
                  </div>
                  <p className="text-xs text-stone-200 mt-1 font-medium font-serif">
                    {event.venue}
                  </p>
                  <p className="text-[11px] text-purple-200 mt-1 font-serif">
                    Direct transit available from CBS & Nashik Road Railway Station. Dedicated student entry gate at Auditorium.
                  </p>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold text-white mb-1.5 font-serif">Focus Topics & Skills</h4>
                <div className="flex flex-wrap gap-1.5 font-serif">
                  {event.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-xl bg-white/10 text-stone-200 font-medium text-[11px] border border-white/20 backdrop-blur-md"
                    >
                      #{t}
                    </span>
                  ))}
                  {event.departmentEligible && (
                    <span className="px-2.5 py-1 rounded-xl bg-pink-500/20 text-pink-200 font-semibold text-[11px] border border-pink-300/30 backdrop-blur-md">
                      Eligible: {event.departmentEligible}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Section: Schedule */}
          {activeSection === 'schedule' && (
            <div className="space-y-3 font-serif">
              <h3 className="text-sm font-bold text-white font-serif drop-shadow-sm">
                Event Rundown & Milestone Schedule
              </h3>
              <div className="border-l-2 border-white/30 pl-4 space-y-4 my-2 font-serif">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-pink-400 border-2 border-purple-900 shadow-[0_0_8px_#f472b6]" />
                  <span className="text-[10px] font-mono font-semibold text-pink-300">08:30 AM – 09:30 AM</span>
                  <h4 className="font-bold text-white font-serif">Entry Gate Pass Verification & Kit Distribution</h4>
                  <p className="text-stone-300 text-[11px]">Present YouthConnect QR code pass at Main Gate for instant badge issuance.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-pink-400 border-2 border-purple-900 shadow-[0_0_8px_#f472b6]" />
                  <span className="text-[10px] font-mono font-semibold text-pink-300">09:45 AM – 11:00 AM</span>
                  <h4 className="font-bold text-white font-serif">Inaugural Keynote & Briefing Session</h4>
                  <p className="text-stone-300 text-[11px]">Welcome address by Principal, HOD and Industry Experts from Nashik IT Association.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-pink-400 border-2 border-purple-900 shadow-[0_0_8px_#f472b6]" />
                  <span className="text-[10px] font-mono font-semibold text-pink-300">11:15 AM – 04:00 PM</span>
                  <h4 className="font-bold text-white font-serif">Core Challenge / Hands-on Activity</h4>
                  <p className="text-stone-300 text-[11px]">Mentorship rounds with senior engineers, technical review and live project demos.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-purple-900 shadow-[0_0_8px_#34d399]" />
                  <span className="text-[10px] font-mono font-semibold text-emerald-300">04:30 PM – 05:30 PM</span>
                  <h4 className="font-bold text-white font-serif">Grand Finale & Certificate Distribution</h4>
                  <p className="text-stone-300 text-[11px]">Announcement of winners and distribution of verified SPPU activity certificates.</p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Prizes */}
          {activeSection === 'prizes' && (
            <div className="space-y-4 font-serif">
              <div className="bg-amber-500/20 p-4 rounded-2xl border border-amber-300/40 flex items-center gap-3 backdrop-blur-md">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-serif">Total Rewards & Recognition Pool</h4>
                  <p className="text-xs text-amber-200 font-semibold font-serif">₹50,000+ Prize Pool + Internship Offers + Medals</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 font-serif">
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/20 text-center font-serif shadow-sm backdrop-blur-md">
                  <span className="text-xl">🥇</span>
                  <h5 className="font-bold text-white text-xs mt-1">1st Place</h5>
                  <span className="text-xs font-bold text-pink-300">₹25,000 Cash</span>
                  <p className="text-[10px] text-purple-200 mt-0.5">Trophy + incubation</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/20 text-center font-serif shadow-sm backdrop-blur-md">
                  <span className="text-xl">🥈</span>
                  <h5 className="font-bold text-white text-xs mt-1">Runner Up</h5>
                  <span className="text-xs font-bold text-pink-300">₹15,000 Cash</span>
                  <p className="text-[10px] text-purple-200 mt-0.5">Runner trophy</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/20 text-center font-serif shadow-sm backdrop-blur-md">
                  <span className="text-xl">🥉</span>
                  <h5 className="font-bold text-white text-xs mt-1">3rd Place</h5>
                  <span className="text-xs font-bold text-pink-300">₹10,000 Cash</span>
                  <p className="text-[10px] text-purple-200 mt-0.5">Hardware kit</p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-500/20 border border-emerald-300/40 text-emerald-200 text-xs rounded-2xl flex items-center gap-2.5 font-serif backdrop-blur-md">
                <Award className="w-5 h-5 text-emerald-300 shrink-0" />
                <span>All registered participants receive a <strong className="text-white">Verified Digital Participation Certificate</strong> eligible for SPPU credit points.</span>
              </div>
            </div>
          )}

          {/* Section: Guidelines */}
          {activeSection === 'guidelines' && (
            <div className="space-y-2.5 font-serif">
              <h3 className="text-sm font-bold text-white font-serif drop-shadow-sm">
                Participation Rules & FAQs
              </h3>
              <ul className="space-y-2 text-stone-200 font-serif">
                <li className="flex items-start gap-2.5 bg-black/30 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Eligibility:</strong> Open to college students across Maharashtra with a valid College PRN/ID.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-black/30 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Digital Gate Pass:</strong> Entry will strictly be facilitated through the YouthConnect dynamic QR barcode scanner at the venue entrance.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-black/30 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Hardware / Laptop:</strong> Participants in technical rounds should carry their own laptops and extension cords.</span>
                </li>
                <li className="flex items-start gap-2.5 bg-black/30 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Refund Policy:</strong> Free cancellation up to 24 hours before the event start time through My Passes.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Sticky Bottom Registration Bar */}
        <div className="p-4 sm:p-5 bg-white/10 border-t border-white/20 flex items-center justify-between font-serif backdrop-blur-md">
          <div>
            <span className="text-[10px] text-purple-300 block font-medium uppercase font-serif">Registration Status</span>
            <div className="flex items-center gap-2 font-serif">
              <span className="text-sm sm:text-base font-bold text-white">{event.feeLabel}</span>
              {event.fee === 0 && (
                <span className="text-[10px] bg-emerald-500/25 text-emerald-200 font-semibold px-2 py-0.5 rounded-full border border-emerald-300/40">
                  100% Free
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 font-serif">
            {event.isRegistered ? (
              <button
                onClick={() => {
                  onClose();
                  if (onViewTicket && event.ticketId) {
                    onViewTicket(event.ticketId);
                  }
                }}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-medium text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all cursor-pointer font-serif"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>View My Pass ({event.ticketId})</span>
              </button>
            ) : (
              <button
                id="btn-modal-register-now"
                onClick={() => {
                  onClose();
                  onRegisterClick(event);
                }}
                className="px-5 py-2.5 bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 text-white rounded-2xl font-semibold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(236,72,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-pink-200/50 transition-all active:scale-95 cursor-pointer font-serif"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Register Now</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
