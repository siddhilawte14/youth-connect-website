import React from 'react';
import { EventItem, CommunityUpdate, DigitalPass, CommunityClub } from '../types';
import { 
  Ticket, 
  Users, 
  Award, 
  Calendar, 
  Clock, 
  MapPin, 
  Sparkles, 
  Megaphone, 
  Terminal, 
  Cpu, 
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Bell,
  Compass,
  Heart,
  QrCode,
  ShieldCheck
} from 'lucide-react';

interface StudentDashboardViewProps {
  events: EventItem[];
  communityUpdates?: CommunityUpdate[];
  updates?: CommunityUpdate[];
  passes?: DigitalPass[];
  clubs?: CommunityClub[];
  onSelectEventForRegistration?: (event: EventItem) => void;
  onSelectEvent?: (event: EventItem) => void;
  onViewTicket?: (ticketId: string) => void;
  onViewPassModal?: (pass: DigitalPass) => void;
  onViewEventDetail?: (event: EventItem) => void;
  onNavigateToCommunities?: () => void;
  onNavigateToMyEvents?: () => void;
  onExploreMore?: () => void;
  onOpenMyEvents?: () => void;
  onToggleSave?: (eventId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  events = [],
  communityUpdates,
  updates,
  passes = [],
  clubs = [],
  onSelectEventForRegistration,
  onSelectEvent,
  onViewTicket = (_ticketId: string) => {},
  onViewPassModal,
  onViewEventDetail,
  onNavigateToCommunities,
  onNavigateToMyEvents,
  onExploreMore,
  onOpenMyEvents,
  onToggleSave,
}) => {
  const handleSelectEvent = onSelectEvent || onSelectEventForRegistration || (() => {});
  const handleViewDetail = onViewEventDetail || handleSelectEvent;
  const handleGoToCommunities = onNavigateToCommunities || onExploreMore || (() => {});
  const handleGoToMyEvents = onNavigateToMyEvents || onOpenMyEvents || (() => {});

  // Find next upcoming registered event or first event in queue
  const registeredEvent = events.find(e => e.isRegistered || passes.some(p => p.eventId === e.id)) || events.find(e => e.id === 'evt-techsprint-2026') || events[0];
  const nextEventPass = passes.find(p => p.eventId === registeredEvent?.id) || passes[0];
  const nextTicketId = registeredEvent?.ticketId || nextEventPass?.ticketId || 'YC-2026-TK-8891';

  // Recommended list
  const recommendedEvents = events
    .filter(e => e.id !== registeredEvent?.id)
    .slice(0, 3);

  const effectiveUpdates = updates || communityUpdates || [];

  const handleOpenNextPass = () => {
    if (onViewPassModal && nextEventPass) {
      onViewPassModal(nextEventPass);
      return;
    }
    if (nextTicketId) {
      onViewTicket(nextTicketId);
    }
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6">
      {/* Welcome Title */}
      <section className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#c2c6d6]/60 rounded-3xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Student
            </span>
            <span className="text-xs text-[#727785]">• KKWIEER Nashik (Computer Engineering)</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0b1c30] tracking-tight font-headline mt-1">
            Welcome back, Rahul!
          </h1>
          <p className="text-sm text-[#424754]">
            Your Nashik student network is buzzing with 16 upcoming events and 8 active campus clubs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleGoToMyEvents}
            className="inline-flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#0058be] px-4 py-2.5 rounded-xl text-xs font-bold border border-blue-200 transition-colors"
          >
            <Ticket className="w-4 h-4" />
            <span>My Passes ({passes.length > 0 ? passes.length : 1})</span>
          </button>
          <button
            onClick={handleGoToCommunities}
            className="inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004bb1] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Users className="w-4 h-4" />
            <span>Explore Clubs</span>
          </button>
        </div>
      </section>

      {/* Main Grid: 8 Cols Left, 4 Cols Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-8">
          {/* Quick Stats 3-Card Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            {/* Stat 1 */}
            <div 
              onClick={handleGoToMyEvents}
              className="bg-white border border-[#c2c6d6]/60 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.08)] cursor-pointer hover:border-[#0058be]/40 hover:-translate-y-1 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0058be] flex items-center justify-center mb-2 shadow-xs">
                <Ticket className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] font-headline">
                {passes.length > 0 ? passes.length : 1}
              </span>
              <span className="text-xs text-[#424754] text-center font-bold mt-1">
                Active Passes
              </span>
            </div>

            {/* Stat 2 */}
            <div 
              onClick={handleGoToCommunities}
              className="bg-white border border-[#c2c6d6]/60 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.08)] cursor-pointer hover:border-orange-300 hover:-translate-y-1 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#9d4300] flex items-center justify-center mb-2 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] font-headline">
                {clubs.length > 0 ? clubs.length : 8}
              </span>
              <span className="text-xs text-[#424754] text-center font-bold mt-1">
                Campus Clubs
              </span>
            </div>

            {/* Stat 3 */}
            <div 
              onClick={handleGoToMyEvents}
              className="bg-white border border-[#c2c6d6]/60 rounded-3xl p-4 sm:p-5 flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(59,130,246,0.08)] cursor-pointer hover:border-emerald-300 hover:-translate-y-1 transition-all"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00855b] flex items-center justify-center mb-2 shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] font-headline">
                120
              </span>
              <span className="text-xs text-[#424754] text-center font-bold mt-1">
                Activity Points
              </span>
            </div>
          </div>

          {/* "Your Next Event" Hero Card */}
          {registeredEvent && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg sm:text-xl font-bold text-[#0b1c30] font-headline flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#0058be]" />
                  Your Next Confirmed Event
                </h2>
                <span className="text-xs font-bold text-[#0058be] hover:underline cursor-pointer" onClick={handleGoToMyEvents}>
                  View All Passes
                </span>
              </div>

              <div className="bg-white rounded-3xl border border-[#c2c6d6]/60 shadow-[0_4px_16px_rgba(59,130,246,0.08)] overflow-hidden flex flex-col group">
                {/* Header Image with Date Overlay */}
                <div className="h-44 sm:h-56 w-full overflow-hidden relative bg-[#eff4ff]">
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 bg-[#0058be] text-white px-3.5 py-2 rounded-2xl flex flex-col items-center shadow-lg z-10">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">
                      {registeredEvent.date.month}
                    </span>
                    <span className="text-xl font-extrabold leading-none font-headline">
                      {registeredEvent.date.day}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirmed Pass
                  </div>

                  <img
                    src={registeredEvent.bannerUrl}
                    alt={registeredEvent.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="inline-block bg-blue-50 text-[#0058be] text-xs font-bold px-3 py-0.5 rounded-full mb-1.5">
                        {registeredEvent.category}
                      </span>
                      <h3 
                        onClick={() => handleViewDetail(registeredEvent)}
                        className="text-lg sm:text-xl font-bold text-[#0b1c30] font-headline cursor-pointer hover:text-[#0058be] transition-colors"
                      >
                        {registeredEvent.title}
                      </h3>
                    </div>

                    <span className="self-start sm:self-auto bg-[#ffdbca] text-[#9d4300] border border-[#fd761a]/30 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#fd761a] animate-ping" />
                      Starts in 3 days
                    </span>
                  </div>

                  {/* Details list */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-xs text-[#424754]">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#727785]" />
                      <span>{registeredEvent.date.time || '10:00 AM - 4:00 PM'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#727785]" />
                      <span>{registeredEvent.venue}</span>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-3 border-t border-[#e5eeff] flex flex-wrap items-center gap-3">
                    <button
                      id="dashboard-view-ticket-btn"
                      onClick={handleOpenNextPass}
                      className="inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004bb1] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                    >
                      <QrCode className="w-4 h-4" />
                      <span>Show Gate QR Pass</span>
                    </button>

                    <button
                      onClick={() => handleViewDetail(registeredEvent)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#c2c6d6] hover:bg-gray-50 text-xs font-semibold text-[#424754] transition-colors"
                    >
                      <span>Event Guide & Schedule</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* "Recommended for You" Cards */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg sm:text-xl font-bold text-[#0b1c30] font-headline">
                Recommended Opportunities in Nashik
              </h2>
              <button
                onClick={onExploreMore}
                className="text-xs font-bold text-[#0058be] hover:underline flex items-center gap-1"
              >
                <span>Browse All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedEvents.map((evt) => (
                <div
                  key={evt.id}
                  id={`rec-card-${evt.id}`}
                  className="bg-white rounded-3xl border border-[#c2c6d6]/60 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  <div className="h-32 w-full overflow-hidden relative bg-[#eff4ff]">
                    {/* Small Date Badge */}
                    <div className="absolute top-2 left-2 bg-[#0058be] text-white px-2 py-0.5 rounded-lg flex flex-col items-center shadow-xs z-10 scale-90 origin-top-left">
                      <span className="text-[9px] uppercase font-bold">{evt.date.month}</span>
                      <span className="text-sm font-bold leading-none font-headline">{evt.date.day}</span>
                    </div>

                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="self-start bg-blue-50 text-[#0058be] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {evt.category}
                    </span>

                    <h4 
                      onClick={() => handleViewDetail(evt)}
                      className="text-xs sm:text-sm font-bold text-[#0b1c30] line-clamp-2 cursor-pointer group-hover:text-[#0058be] transition-colors font-headline"
                    >
                      {evt.title}
                    </h4>

                    <div className="mt-auto pt-2 text-[11px] text-[#727785] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{evt.venue}</span>
                    </div>

                    <div className="pt-2 border-t border-[#e5eeff] flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0b1c30]">
                        {evt.fee === 0 ? 'FREE' : `₹${evt.fee}`}
                      </span>
                      <button
                        onClick={() => handleSelectEvent(evt)}
                        className="px-3 py-1 rounded-lg bg-[#0058be] hover:bg-[#004bb1] text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column (4 cols) - Community Updates Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <section className="bg-[#eff4ff] border border-[#c2c6d6]/60 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#c2c6d6]/60 pb-3">
              <Megaphone className="w-5 h-5 text-[#0058be]" />
              <h3 className="text-base font-bold text-[#0b1c30] font-headline">
                Campus Club Updates
              </h3>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              {/* Update 1 */}
              <div className="flex gap-3 items-start group cursor-pointer" onClick={handleGoToCommunities}>
                <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0 border border-blue-200 text-[#0058be]">
                  <Terminal className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-[#0b1c30] leading-relaxed group-hover:text-[#0058be] transition-colors">
                    <strong className="text-[#0058be]">Nashik Coders Hub</strong> opened registrations for "Algorithm Optimization Sprint".
                  </p>
                  <span className="text-[10px] text-[#727785] mt-1 font-medium">2 hours ago</span>
                </div>
              </div>

              <div className="w-full h-px bg-[#c2c6d6]/40" />

              {/* Update 2 */}
              <div className="flex gap-3 items-start group cursor-pointer" onClick={handleGoToCommunities}>
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 border border-orange-200 text-[#9d4300]">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-[#0b1c30] leading-relaxed group-hover:text-[#0058be] transition-colors">
                    <strong className="text-[#9d4300]">Robotics Society</strong> published practice arena rules for Robocon 2026.
                  </p>
                  <span className="text-[10px] text-[#727785] mt-1 font-medium">5 hours ago</span>
                </div>
              </div>

              <div className="w-full h-px bg-[#c2c6d6]/40" />

              {/* Update 3 */}
              <div className="flex gap-3 items-start group cursor-pointer" onClick={handleGoToCommunities}>
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 border border-emerald-200 text-[#00855b]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <p className="text-xs text-[#0b1c30] leading-relaxed group-hover:text-[#0058be] transition-colors">
                    <strong className="text-[#00855b]">EcoYouth Nashik</strong> added 40 new volunteer badges for Godavari Cleanathon.
                  </p>
                  <span className="text-[10px] text-[#727785] mt-1 font-medium">1 day ago</span>
                </div>
              </div>
            </div>

            <button
              id="view-all-updates-btn"
              onClick={handleGoToCommunities}
              className="mt-6 pt-3 border-t border-[#c2c6d6]/60 text-center w-full text-xs font-bold text-[#0058be] hover:underline"
            >
              Browse All 8 Campus Clubs
            </button>
          </section>

          {/* Quick Hub Tip Card */}
          <div className="bg-white border border-[#c2c6d6]/60 rounded-3xl p-5 shadow-xs">
            <h4 className="text-xs font-bold text-[#0b1c30] mb-1 flex items-center gap-1.5 font-headline">
              <Sparkles className="w-4 h-4 text-[#fd761a]" />
              Smart Entry Tip
            </h4>
            <p className="text-xs text-[#424754] leading-relaxed">
              Show your digital QR pass from the <strong className="text-[#0058be]">My Passes</strong> tab directly at the venue gate for instant offline check-in without physical printouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
