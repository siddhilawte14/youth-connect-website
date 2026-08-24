import React, { useState } from 'react';
import { EventItem, DigitalPass } from '../types';
import { 
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
  ShieldCheck,
  X
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
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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
      recipientName: 'Siddhi Lawte',
      role: 'Participant & Hackathon Finalist',
      certificateId: 'YC-CERT-2025-W3-901',
      issuedBy: 'KKWIEER & YouthConnect Maharashtra Chapter',
    },
    {
      id: 'past-2',
      eventName: 'Godavari River Cleanathon & Environmental Drive',
      date: 'Sep 02, 2025',
      venue: 'Goda Ghat, Panchavati',
      recipientName: 'Siddhi Lawte',
      role: 'Volunteer Participant (6 Hrs Service)',
      certificateId: 'YC-CERT-2025-NGO-441',
      issuedBy: 'Nashik Environmental Youth Foundation',
    },
    {
      id: 'past-3',
      eventName: 'Kumbh Tech Hackathon 2025',
      date: 'Nov 20, 2025',
      venue: 'NDMVPS KBTCOE Campus',
      recipientName: 'Siddhi Lawte',
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
    <div className="w-full max-w-[1360px] mx-auto px-4 md:px-8 py-6 mb-20 md:mb-0 text-stone-900 font-serif">
      {/* Header Section */}
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden font-serif">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C6BA6] text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 font-serif">
              <Ticket className="w-3.5 h-3.5" />
              Student Pass Vault
            </span>
            <span className="text-xs text-stone-500 font-serif">• Nashik & Pune</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 font-serif tracking-tight">
            My Events & Passes
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl font-serif">
            Access your active QR entry passes, SPPU verified participation certificates, and bookmarked hackathons.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 font-serif">
          <button
            onClick={onExploreEvents}
            className="inline-flex items-center gap-2 bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer font-serif"
          >
            <Compass className="w-4 h-4" />
            <span>Discover More Events</span>
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-2.5 mb-8 no-scrollbar pb-1 font-serif">
        <button
          id="tab-upcoming-events"
          onClick={() => setActiveTab('upcoming')}
          className={`font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer font-serif ${
            activeTab === 'upcoming'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Upcoming Passes</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold font-mono">
            {allRegisteredEvents.length}
          </span>
        </button>

        <button
          id="tab-past-events"
          onClick={() => setActiveTab('past')}
          className={`font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer font-serif ${
            activeTab === 'past'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-600" />
          <span>Past Events & Certificates</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold font-mono">
            {pastEvents.length}
          </span>
        </button>

        <button
          id="tab-saved-events"
          onClick={() => setActiveTab('saved')}
          className={`font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all whitespace-nowrap flex items-center gap-2.5 cursor-pointer font-serif ${
            activeTab === 'saved'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
          }`}
        >
          <BookmarkCheck className="w-4 h-4 text-rose-500" />
          <span>Saved Bookmarks</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold font-mono">
            {effectiveSavedEvents.length}
          </span>
        </button>
      </div>

      {/* Tab Content 1: Upcoming Registered Events */}
      {activeTab === 'upcoming' && (
        <div>
          {allRegisteredEvents.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center shadow-xs font-serif">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 text-[#8B7CB6] flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-stone-900 font-serif">No Registered Passes Yet</h3>
              <p className="text-xs text-stone-600 mt-1.5 max-w-md mx-auto leading-relaxed font-serif">
                Explore upcoming hackathons, campus workshops, and collegiate fests in Nashik and Pune to reserve your digital entrance pass.
              </p>
              <button
                onClick={onExploreEvents}
                className="mt-5 inline-flex items-center gap-2 bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer font-serif"
              >
                <Compass className="w-4 h-4" />
                Browse Campus Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-serif">
              {allRegisteredEvents.map((evt) => {
                const pass = passes.find(p => p.eventId === evt.id) || (evt.ticketId ? passes.find(p => p.ticketId === evt.ticketId) : null);
                const ticketId = evt.ticketId || pass?.ticketId || 'YC-PASS-LIVE';

                return (
                  <article
                    key={evt.id}
                    id={`my-event-${evt.id}`}
                    className="bg-white rounded-3xl overflow-hidden flex flex-col shadow-xs border border-stone-200 hover:border-[#8B7CB6] hover:shadow-md hover:-translate-y-1 transition-all duration-200 group font-serif animate-in fade-in duration-200"
                  >
                    {/* Top Image Banner with Date Badge & Registered Pill */}
                    <div className="h-[170px] relative w-full bg-stone-100 overflow-hidden">
                      <img
                        src={evt.bannerUrl}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-stone-900 flex flex-col items-center justify-center rounded-xl px-2.5 py-1 shadow-xs border border-stone-200 font-serif">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C6BA6]">{evt.date.month}</span>
                        <span className="text-base font-bold leading-none font-serif text-stone-900">
                          {evt.date.day}
                        </span>
                      </div>

                      {/* Registered Status Badge */}
                      <div className="absolute top-4 right-4 bg-emerald-50/95 backdrop-blur-md text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-emerald-200 font-serif">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Pass Confirmed
                      </div>

                      <div className="absolute bottom-2.5 left-4">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-semibold border border-white/20">
                          Ticket ID: {ticketId}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-5 flex flex-col flex-1 font-serif">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5 font-serif">
                        <span className="bg-purple-50 text-[#7C6BA6] border border-purple-200 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                          {evt.category}
                        </span>
                        {evt.tags && evt.tags.slice(0, 1).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-stone-100 text-stone-600 border border-stone-200 px-2 py-0.5 rounded-full text-[11px] font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 
                        onClick={() => handleViewDetail(evt)}
                        className="text-base font-bold text-stone-900 mb-2 leading-snug font-serif cursor-pointer group-hover:text-[#7C6BA6] transition-colors duration-200"
                      >
                        {evt.title}
                      </h3>

                      {/* Time & Venue */}
                      <div className="space-y-1.5 mb-5 mt-auto text-xs text-stone-500 font-serif">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#8B7CB6] shrink-0" />
                          <span>{evt.date.time || '10:00 AM onwards'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>

                      {/* Button Row */}
                      <div className="flex items-center gap-2 mt-auto pt-3 border-t border-stone-100 font-serif">
                        <button
                          id={`btn-view-ticket-${evt.id}`}
                          onClick={() => handleOpenTicket(ticketId, evt.id)}
                          className="flex-1 bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-semibold text-xs py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-95 cursor-pointer font-serif"
                        >
                          <QrCode className="w-4 h-4" />
                          <span>Show QR Pass</span>
                        </button>

                        <button
                          id={`btn-calendar-${evt.id}`}
                          onClick={() => handleSyncToGoogleCalendar(evt)}
                          className="p-2 bg-stone-50 border border-stone-200 hover:border-[#8B7CB6] hover:bg-stone-100 text-stone-600 hover:text-stone-900 rounded-xl transition-all duration-200 cursor-pointer font-serif"
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
        <div className="space-y-4 font-serif">
          <div className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-xs font-serif">
            <div className="p-5 bg-stone-50 border-b border-stone-200 flex justify-between items-center font-serif">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-serif">
                  Verified Academic & Co-Curricular Participation
                </h3>
                <p className="text-xs text-stone-500 mt-0.5 font-serif">
                  Official certificates verified by SPPU collegiate chapters & organizers
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 font-serif">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Verified Student
              </span>
            </div>

            <div className="divide-y divide-stone-100 font-serif">
              {pastEvents.map((pe) => (
                <div key={pe.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition-colors font-serif">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-semibold uppercase text-[#7C6BA6] bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                        {pe.certificateId}
                      </span>
                      <span className="text-xs text-stone-500 font-serif">{pe.date}</span>
                    </div>
                    <h4 className="text-base font-bold text-stone-900 font-serif">{pe.eventName}</h4>
                    <p className="text-xs text-stone-600 font-serif">{pe.role} • {pe.venue}</p>
                    <p className="text-[11px] text-stone-500 font-serif">Issued by: {pe.issuedBy}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center font-serif">
                    <button
                      onClick={() => {
                        setSelectedCertificate(pe);
                        setDownloadSuccess(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-800 hover:bg-stone-200 text-xs font-semibold shadow-xs transition-colors cursor-pointer font-serif"
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
        <div className="font-serif">
          {effectiveSavedEvents.length === 0 ? (
            <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center shadow-xs font-serif">
              <BookmarkCheck className="w-12 h-12 text-stone-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-900 font-serif">No Saved Events</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto font-serif">
                Bookmark hackathons, bootcamps, and fests from the discovery feed to keep track of upcoming deadlines.
              </p>
              <button
                onClick={onExploreEvents}
                className="mt-5 inline-flex items-center gap-2 bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs cursor-pointer font-serif"
              >
                Browse Events
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-serif">
              {effectiveSavedEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200 hover:border-[#8B7CB6] hover:shadow-md hover:-translate-y-1 transition-all duration-200 shadow-xs flex flex-col group font-serif animate-in fade-in duration-200"
                >
                  <div className="h-44 relative bg-stone-100 overflow-hidden">
                    <img src={evt.bannerUrl} alt={evt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <button
                      onClick={() => handleToggleSave(evt.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-rose-500 hover:bg-rose-50 border border-stone-200 shadow-xs transition-all duration-200 cursor-pointer"
                      title="Remove Bookmark"
                    >
                      <BookmarkCheck className="w-4 h-4 fill-rose-500" />
                    </button>
                    <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md text-[#7C6BA6] text-[10px] font-semibold px-2.5 py-0.5 rounded-md border border-stone-200 font-serif">
                      {evt.category}
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1 font-serif">
                    <h3 
                      onClick={() => handleViewDetail(evt)}
                      className="text-base font-bold text-stone-900 mb-1 font-serif cursor-pointer group-hover:text-[#7C6BA6] transition-colors duration-200"
                    >
                      {evt.title}
                    </h3>
                    <p className="text-xs text-stone-500 mb-4 font-serif">{evt.date.fullDate} • {evt.venue}</p>
                    <div className="mt-auto pt-3 border-t border-stone-100 flex justify-between items-center font-serif">
                      <span className="text-xs font-semibold text-[#7C6BA6]">{evt.feeLabel}</span>
                      <div className="flex gap-2 font-serif">
                        <button
                          onClick={() => handleViewDetail(evt)}
                          className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 hover:border-[#8B7CB6] transition-all duration-200 cursor-pointer font-serif"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => handleSelectEvent(evt)}
                          className="bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 shadow-xs active:scale-95 cursor-pointer font-serif"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden text-stone-900 font-serif">
            {/* Modal Header */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between font-serif">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#8B7CB6]" />
                <h3 className="font-bold text-sm font-serif text-stone-900">Verified Student Certificate</h3>
              </div>
              <button
                onClick={() => setSelectedCertificate(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Canvas Mock */}
            <div className="p-8 bg-stone-50 border-2 border-stone-200 m-4 rounded-2xl text-center relative overflow-hidden shadow-xs font-serif">
              <div className="text-xs font-bold uppercase text-[#7C6BA6] tracking-widest mb-1 font-serif">
                YouthConnect • Collegiate Recognition
              </div>
              <h2 className="text-2xl font-bold text-stone-900 font-serif mb-2">
                Certificate of Participation
              </h2>
              <p className="text-xs text-stone-500 italic mb-3 font-serif">
                This is proudly presented to
              </p>
              <h3 className="text-xl font-bold text-stone-900 font-serif mb-3 border-b border-[#8B7CB6]/40 pb-2 inline-block px-8">
                {selectedCertificate.recipientName}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto mb-4 font-serif">
                for active participation and outstanding contribution in <strong className="text-stone-900">{selectedCertificate.eventName}</strong> held at {selectedCertificate.venue} on {selectedCertificate.date}.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-stone-200 text-left text-[11px] font-serif">
                <div>
                  <span className="text-stone-500 block font-serif">Certificate ID:</span>
                  <span className="font-mono font-semibold text-stone-900">{selectedCertificate.certificateId}</span>
                </div>
                <div className="text-right font-serif">
                  <span className="text-stone-500 block font-serif">Issued Authority:</span>
                  <span className="font-semibold text-[#7C6BA6]">{selectedCertificate.issuedBy}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between font-serif">
              <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 font-serif">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Digitally Verified
              </span>
              <div className="flex items-center gap-2 font-serif">
                {downloadSuccess ? (
                  <span className="text-xs text-emerald-600 font-semibold font-serif animate-in fade-in">
                    ✓ PDF downloaded successfully
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setDownloadSuccess(true);
                      setTimeout(() => setDownloadSuccess(false), 3000);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer font-serif"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Certificate PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
