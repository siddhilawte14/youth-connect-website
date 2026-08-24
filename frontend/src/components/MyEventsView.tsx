import React, { useState } from 'react';
import { EventItem, DigitalPass } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  BookmarkCheck, 
  CalendarPlus,
  Ticket,
  QrCode,
  Compass,
  Award,
  Download,
  Share2,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MyEventsViewProps {
  events?: EventItem[];
  passes?: DigitalPass[];
  savedEvents?: EventItem[];
  onViewTicket?: (ticketId: string) => void;
  onViewPassModal?: (pass: DigitalPass) => void;
  onSelectEventForRegistration?: (event: EventItem) => void;
  onSelectEvent?: (event: EventItem) => void;
  onViewEventDetail?: (event: EventItem) => void;
  onToggleSaveEvent?: (eventId: string) => void;
  onToggleSave?: (eventId: string) => void;
  onExploreEvents?: () => void;
}

interface CertificateData {
  id: string;
  eventName: string;
  date: string;
  venue: string;
  recipientName: string;
  role: string;
  certificateId: string;
  issuedBy: string;
}

export const MyEventsView: React.FC<MyEventsViewProps> = ({
  events = [],
  passes = [],
  savedEvents: propSavedEvents,
  onViewTicket,
  onViewPassModal,
  onSelectEventForRegistration,
  onSelectEvent,
  onViewEventDetail,
  onToggleSaveEvent,
  onToggleSave,
  onExploreEvents = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);

  const handleSelectEvent = onSelectEvent || onSelectEventForRegistration || (() => {});
  const handleViewDetail = onViewEventDetail || handleSelectEvent;
  const handleToggleSave = onToggleSave || onToggleSaveEvent || (() => {});

  // Construct registered events by combining marked events with passes
  const registeredFromEvents = events.filter((e) => e.isRegistered || passes.some(p => p.eventId === e.id));
  
  // Synthetic events from passes if not already in events list
  const registeredFromPasses = passes
    .filter(p => !registeredFromEvents.some(e => e.id === p.eventId))
    .map(p => ({
      id: p.eventId,
      title: p.eventTitle,
      category: 'Technology',
      tags: ['Pass', p.tier],
      date: {
        month: p.date.split(' ')[0] || 'DEC',
        day: p.date.split(' ')[1]?.replace(',', '') || '15',
        fullDate: p.date,
        time: p.time,
      },
      venue: p.venue,
      area: 'Nashik',
      fee: p.amountPaid,
      feeLabel: p.amountPaid === 0 ? 'Free Entry' : `₹${p.amountPaid}`,
      status: 'Published' as const,
      bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      organizer: { name: 'Nashik Student Chapter', isVerified: true },
      description: `Confirmed registered pass for ${p.attendeeName}`,
      capacity: 200,
      registeredCount: 1,
      views: 100,
      conversionRate: '100%',
      isRegistered: true,
      ticketId: p.ticketId,
    }));

  const allRegisteredEvents = [...registeredFromEvents, ...registeredFromPasses];
  const effectiveSavedEvents = propSavedEvents || events.filter((e) => e.isSaved);

  const handleOpenTicket = (ticketId?: string, eventId?: string) => {
    if (onViewPassModal) {
      const foundPass = passes.find(p => (ticketId && p.ticketId === ticketId) || (eventId && p.eventId === eventId));
      if (foundPass) {
        onViewPassModal(foundPass);
        return;
      }
      if (passes.length > 0) {
        onViewPassModal(passes[0]);
        return;
      }
    }
    if (onViewTicket && ticketId) {
      onViewTicket(ticketId);
    }
  };

  const pastEvents: CertificateData[] = [
    {
      id: 'past-1',
      eventName: 'Nashik Web3 & AI Con 2025',
      date: 'Aug 14, 2025',
      venue: 'KKWIEER Auditorium, Nashik',
      recipientName: 'Rahul Sharma',
      role: 'Participant & Hackathon Finalist',
      certificateId: 'YC-CERT-2025-W3-901',
      issuedBy: 'KKWIEER & YouthConnect Maharashtra Chapter',
    },
    {
      id: 'past-2',
      eventName: 'Godavari River Cleanathon & Environmental Drive',
      date: 'Sep 02, 2025',
      venue: 'Goda Ghat, Panchavati',
      recipientName: 'Rahul Sharma',
      role: 'Volunteer Participant (6 Hrs Service)',
      certificateId: 'YC-CERT-2025-NGO-441',
      issuedBy: 'Nashik Environmental Youth Foundation',
    },
    {
      id: 'past-3',
      eventName: 'Kumbh Tech Hackathon 2025',
      date: 'Nov 20, 2025',
      venue: 'NDMVPS KBTCOE Campus',
      recipientName: 'Rahul Sharma',
      role: '2nd Runner Up - Smart Mobility Track',
      certificateId: 'YC-CERT-2025-KT-112',
      issuedBy: 'NDMVPS Innovation & Entrepreneurship Cell',
    },
  ];

  const handleSyncToGoogleCalendar = (evt: EventItem) => {
    const title = encodeURIComponent(evt.title);
    const location = encodeURIComponent(evt.venue);
    const details = encodeURIComponent(`${evt.description}\n\nRegistered via YouthConnect Platform. Venue: ${evt.venue}`);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 mb-20 md:mb-0">
      {/* Header Section */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-[#c2c6d6]/60 rounded-3xl p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0058be] text-xs font-bold uppercase tracking-wider">
              Student Portal
            </span>
            <span className="text-xs text-[#727785]">• KKWIEER Nashik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] mt-1 font-headline">
            My Events & Passes
          </h1>
          <p className="text-sm text-[#424754] mt-0.5">
            Manage your registered event passes, participation certificates, and saved bookmarks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExploreEvents}
            className="inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004bb1] text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Events</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-[#c2c6d6]/60 mb-8 no-scrollbar pb-1">
        <button
          id="tab-upcoming-events"
          onClick={() => setActiveTab('upcoming')}
          className={`font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'text-[#0058be] bg-blue-50 shadow-xs border border-blue-200'
              : 'text-[#424754] hover:bg-gray-100'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Upcoming Passes</span>
          <span className="px-2 py-0.5 rounded-full bg-[#0058be] text-white text-[11px] font-black">
            {allRegisteredEvents.length}
          </span>
        </button>

        <button
          id="tab-past-events"
          onClick={() => setActiveTab('past')}
          className={`font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'past'
              ? 'text-[#0058be] bg-blue-50 shadow-xs border border-blue-200'
              : 'text-[#424754] hover:bg-gray-100'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Past Events & Certificates</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
            {pastEvents.length}
          </span>
        </button>

        <button
          id="tab-saved-events"
          onClick={() => setActiveTab('saved')}
          className={`font-bold text-xs sm:text-sm px-5 py-3 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'saved'
              ? 'text-[#0058be] bg-blue-50 shadow-xs border border-blue-200'
              : 'text-[#424754] hover:bg-gray-100'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 text-rose-500" />
          <span>Saved Bookmarks</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black">
            {effectiveSavedEvents.length}
          </span>
        </button>
      </div>

      {/* Tab Content 1: Upcoming Registered Events */}
      {activeTab === 'upcoming' && (
        <div>
          {allRegisteredEvents.length === 0 ? (
            <div className="bg-white border border-[#c2c6d6]/80 rounded-3xl p-12 text-center shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0058be] flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Ticket className="w-8 h-8 opacity-80" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30] font-headline">No Registered Passes Yet</h3>
              <p className="text-xs text-[#424754] mt-1 max-w-md mx-auto leading-relaxed">
                Explore upcoming hackathons, campus workshops, and collegiate fests in Nashik to reserve your digital entrance pass.
              </p>
              <button
                onClick={onExploreEvents}
                className="mt-5 inline-flex items-center gap-2 bg-[#0058be] hover:bg-[#004bb1] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all"
              >
                <Compass className="w-4 h-4" />
                Browse Events in Nashik
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allRegisteredEvents.map((evt) => {
                const pass = passes.find(p => p.eventId === evt.id) || (evt.ticketId ? passes.find(p => p.ticketId === evt.ticketId) : null);
                const ticketId = evt.ticketId || pass?.ticketId || 'YC-PASS-LIVE';

                return (
                  <article
                    key={evt.id}
                    id={`my-event-${evt.id}`}
                    className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-[0_4px_16px_rgba(59,130,246,0.08)] border border-[#c2c6d6]/60 hover:border-[#0058be]/40 hover:-translate-y-1 transition-all duration-200"
                  >
                    {/* Top Image Banner with Date Badge & Registered Pill */}
                    <div className="h-[160px] relative w-full bg-[#eff4ff] overflow-hidden">
                      <img
                        src={evt.bannerUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover"
                      />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-[#0058be] text-white flex flex-col items-center justify-center rounded-xl px-3 py-1 shadow-md">
                        <span className="text-[10px] font-bold uppercase">{evt.date.month}</span>
                        <span className="text-lg font-bold leading-none font-headline">
                          {evt.date.day}
                        </span>
                      </div>

                      {/* Registered Status Badge */}
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs text-[#0058be] text-xs font-bold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-blue-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Pass Confirmed
                      </div>

                      <div className="absolute bottom-2 left-4">
                        <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold">
                          Ticket: {ticketId}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <span className="bg-blue-50 text-[#0058be] px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          {evt.category}
                        </span>
                        {evt.tags && evt.tags.slice(0, 1).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-gray-100 text-[#424754] px-2 py-0.5 rounded-full text-[11px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 
                        onClick={() => handleViewDetail(evt)}
                        className="text-base font-bold text-[#0b1c30] mb-2 leading-snug font-headline cursor-pointer hover:text-[#0058be] transition-colors"
                      >
                        {evt.title}
                      </h3>

                      {/* Time & Venue */}
                      <div className="space-y-1.5 mb-5 mt-auto text-xs text-[#424754]">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#727785] shrink-0" />
                          <span>{evt.date.time || '10:00 AM onwards'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#727785] shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>

                      {/* Button Row */}
                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#e5eeff]">
                        <button
                          id={`btn-view-ticket-${evt.id}`}
                          onClick={() => handleOpenTicket(ticketId, evt.id)}
                          className="flex-1 bg-[#0058be] hover:bg-[#004bb1] text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Show QR Pass</span>
                        </button>

                        <button
                          id={`btn-calendar-${evt.id}`}
                          onClick={() => handleSyncToGoogleCalendar(evt)}
                          className="p-2.5 border border-[#c2c6d6] hover:bg-blue-50 hover:border-blue-300 text-[#424754] hover:text-[#0058be] rounded-xl transition-colors"
                          title="Add to Google Calendar"
                        >
                          <CalendarPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Past Events & Certificates */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          <div className="bg-white border border-[#c2c6d6]/60 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-[#c2c6d6]/60 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-[#0b1c30] font-headline">
                  Verified Academic & Co-Curricular Participation
                </h3>
                <p className="text-xs text-[#727785] mt-0.5">
                  Official certificates verified by SPPU collegiate chapters & organizers
                </p>
              </div>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                Verified Student
              </span>
            </div>

            <div className="divide-y divide-[#e5eeff]">
              {pastEvents.map((pe) => (
                <div key={pe.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-blue-50/30 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-[#0058be] bg-blue-100 px-2 py-0.5 rounded">
                        {pe.certificateId}
                      </span>
                      <span className="text-xs text-[#727785]">{pe.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-[#0b1c30] font-headline">{pe.eventName}</h4>
                    <p className="text-xs text-[#424754]">{pe.role} • {pe.venue}</p>
                    <p className="text-[11px] text-[#727785]">Issued by: {pe.issuedBy}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => setSelectedCertificate(pe)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-blue-200 text-[#0058be] hover:bg-blue-50 text-xs font-bold shadow-xs transition-colors"
                    >
                      <Award className="w-4 h-4 text-emerald-600" />
                      <span>View Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Saved Events */}
      {activeTab === 'saved' && (
        <div>
          {effectiveSavedEvents.length === 0 ? (
            <div className="bg-white border border-[#c2c6d6]/80 rounded-3xl p-12 text-center shadow-xs">
              <BookmarkCheck className="w-12 h-12 text-[#727785] mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-[#0b1c30] font-headline">No Saved Events</h3>
              <p className="text-xs text-[#424754] mt-1 max-w-sm mx-auto">
                Bookmark hackathons, bootcamps, and fests from the discovery feed to keep track of upcoming deadlines.
              </p>
              <button
                onClick={onExploreEvents}
                className="mt-4 inline-flex items-center gap-2 bg-[#0058be] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {effectiveSavedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#c2c6d6]/60 shadow-[0_4px_12px_rgba(59,130,246,0.08)] flex flex-col hover:-translate-y-1 transition-transform"
                >
                  <div className="h-40 relative bg-[#eff4ff]">
                    <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleToggleSave(evt.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/95 text-rose-600 hover:bg-rose-50 shadow-md transition-colors"
                      title="Remove Bookmark"
                    >
                      <BookmarkCheck className="w-4 h-4 fill-rose-600" />
                    </button>
                    <span className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {evt.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 
                      onClick={() => handleViewDetail(evt)}
                      className="text-base font-bold text-[#0b1c30] mb-1 font-headline cursor-pointer hover:text-[#0058be] transition-colors"
                    >
                      {evt.title}
                    </h3>
                    <p className="text-xs text-[#727785] mb-3">{evt.date.fullDate} • {evt.venue}</p>
                    <div className="mt-auto pt-3 border-t border-[#e5eeff] flex justify-between items-center">
                      <span className="text-xs font-bold text-[#0b1c30]">{evt.feeLabel}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetail(evt)}
                          className="px-3 py-1.5 rounded-lg border border-[#c2c6d6] text-xs font-semibold text-[#424754] hover:bg-gray-50"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleSelectEvent(evt)}
                          className="bg-[#0058be] hover:bg-[#004bb1] text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-gray-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm font-headline">Verified Student Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Canvas Mock */}
            <div className="p-8 bg-[#fafbfd] border-8 border-double border-amber-600/30 m-4 rounded-2xl text-center relative overflow-hidden">
              <div className="text-xs font-black uppercase text-amber-700 tracking-widest mb-1">
                YouthConnect • Collegiate Recognition
              </div>
              <h2 className="text-2xl font-extrabold text-[#0b1c30] font-headline mb-3">
                Certificate of Participation
              </h2>
              <p className="text-xs text-[#727785] italic mb-4">
                This is proudly presented to
              </p>
              <h3 className="text-xl font-bold text-[#0058be] font-headline mb-2 border-b-2 border-[#0058be]/20 pb-2 inline-block px-8">
                {selectedCertificate.recipientName}
              </h3>
              <p className="text-xs text-[#424754] leading-relaxed max-w-md mx-auto mb-4">
                for active participation and outstanding contribution in <strong className="text-[#0b1c30]">{selectedCertificate.eventName}</strong> held at {selectedCertificate.venue} on {selectedCertificate.date}.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-gray-200 text-left text-[11px]">
                <div>
                  <span className="text-gray-500 block">Certificate ID:</span>
                  <span className="font-mono font-bold text-gray-800">{selectedCertificate.certificateId}</span>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block">Issued Authority:</span>
                  <span className="font-bold text-[#0058be]">{selectedCertificate.issuedBy}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Digitally Verified
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    alert(`Downloading Official PDF Certificate: ${selectedCertificate.certificateId}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0058be] hover:bg-[#004bb1] text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Certificate PDF</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
