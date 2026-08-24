import React, { useState, useMemo } from 'react';
import { EventItem, CommunityUpdate, DigitalPass, CommunityClub, UserProfile } from '../types';
import { 
  Ticket, 
  Users, 
  Calendar, 
  CalendarPlus,
  Clock, 
  MapPin, 
  CheckCircle2, 
  Download,
  ShieldCheck,
  HeartHandshake,
  FileCheck,
  Compass,
  LogOut,
  Copy,
  Search,
  LayoutGrid,
  List,
  Navigation,
  ExternalLink,
  X,
  Sparkles,
  QrCode,
  Maximize2,
  Share2,
  Building2,
  GraduationCap,
  BadgeCheck,
  Info,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentDashboardViewProps {
  events: EventItem[];
  passes?: DigitalPass[];
  clubs?: CommunityClub[];
  updates?: CommunityUpdate[];
  userProfile?: UserProfile | null;
  onSelectEvent?: (event: EventItem) => void;
  onViewPassModal?: (pass: DigitalPass) => void;
  onViewEventDetail?: (event: EventItem) => void;
  onBrowseMoreEvents?: () => void;
  onLogout?: () => void;
  onToggleSave?: (eventId: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({
  events = [],
  passes = [],
  clubs = [],
  updates = [],
  userProfile,
  onSelectEvent,
  onViewPassModal,
  onViewEventDetail,
  onBrowseMoreEvents,
  onLogout,
  onToggleSave,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState<string | null>(null);
  const [downloadingPassId, setDownloadingPassId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [directionsPass, setDirectionsPass] = useState<DigitalPass | null>(null);

  // Authenticated student session details
  const studentName = userProfile?.name || 'Siddhi Lawte';
  const studentCollege = userProfile?.college || 'MET Bhujbal Knowledge City, Adgaon, Nashik';
  const studentPrn = userProfile?.prn || userProfile?.studentId || '22BCE104';
  const studentDept = userProfile?.department || 'Computer Engineering';
  const studentEmail = userProfile?.email || 'siddhi.lawte@met.edu.in';

  // Strict binding of passes to current student session (PRN, studentId, email, or myPasses roster)
  const studentPasses = useMemo(() => {
    return passes.filter((p) => {
      // Direct PRN/ID match
      if (p.studentPrn && p.studentPrn.toLowerCase() === studentPrn.toLowerCase()) return true;
      if (p.collegeId && p.collegeId.toLowerCase() === studentPrn.toLowerCase()) return true;
      // Email match
      if (studentEmail && p.studentEmail && p.studentEmail.toLowerCase() === studentEmail.toLowerCase()) return true;
      // My Passes IDs stored in profile
      if (userProfile?.myPasses && userProfile.myPasses.includes(p.ticketId)) return true;
      // Attendee Name fallback match if single student mode
      if (p.attendeeName && p.attendeeName.toLowerCase() === studentName.toLowerCase()) return true;
      return false;
    });
  }, [passes, studentPrn, studentEmail, studentName, userProfile]);

  // Filtered passes based on search, category, and status filters
  const filteredPasses = useMemo(() => {
    return studentPasses.filter((pass) => {
      // Search query filter
      const matchesSearch = 
        searchQuery.trim() === '' ||
        pass.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pass.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pass.category && pass.category.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category filter
      let matchesCategory = true;
      if (selectedCategoryFilter !== 'All') {
        const cat = (pass.category || '').toLowerCase();
        if (selectedCategoryFilter === 'Hackathons') {
          matchesCategory = cat.includes('hackathon') || pass.eventTitle.toLowerCase().includes('hackathon') || pass.eventTitle.toLowerCase().includes('techsprint');
        } else if (selectedCategoryFilter === 'College Fests') {
          matchesCategory = cat.includes('fest') || cat.includes('cultural') || pass.eventTitle.toLowerCase().includes('fest') || pass.eventTitle.toLowerCase().includes('concert');
        } else if (selectedCategoryFilter === 'NGO Drives') {
          matchesCategory = cat.includes('ngo') || cat.includes('volunteer') || cat.includes('social') || pass.eventTitle.toLowerCase().includes('clean') || pass.eventTitle.toLowerCase().includes('drive');
        } else if (selectedCategoryFilter === 'Workshops') {
          matchesCategory = cat.includes('workshop') || cat.includes('design') || cat.includes('ui/ux') || pass.eventTitle.toLowerCase().includes('code');
        }
      }

      // Status filter
      let matchesStatus = true;
      if (selectedStatusFilter !== 'All') {
        if (selectedStatusFilter === 'Active') {
          matchesStatus = pass.status === 'Valid';
        } else if (selectedStatusFilter === 'Redeemed') {
          matchesStatus = pass.status === 'Redeemed';
        }
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [studentPasses, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  // Registered events for timeline
  const registeredEvents = useMemo(() => {
    return events.filter(
      (e) => e.isRegistered || studentPasses.some((p) => p.eventId === e.id || p.ticketId === e.ticketId)
    );
  }, [events, studentPasses]);

  const displayTimelineEvents = registeredEvents.length > 0 ? registeredEvents : events.slice(0, 3);

  // Social Impact Stats
  const targetSocialHours = 20;
  const completedSocialHours = 16;
  const progressPercent = Math.min(100, Math.round((completedSocialHours / targetSocialHours) * 100));

  const handleCopyTicket = (ticketId: string) => {
    navigator.clipboard?.writeText(ticketId);
    setCopiedId(ticketId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadPass = (pass: DigitalPass) => {
    setDownloadingPassId(pass.ticketId);
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#7C6BA6', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // fallback
    }

    setTimeout(() => {
      setDownloadingPassId(null);
      const textData = `=========================================================\n` +
        `YOUTHCONNECT OFFICIAL DIGITAL ENTRY PASS\n` +
        `SPPU Campus Verified Access Token\n` +
        `=========================================================\n` +
        `EVENT DETAILS:\n` +
        `Event: ${pass.eventTitle}\n` +
        `Category: ${pass.category || 'Collegiate Event'}\n` +
        `Date: ${pass.date}\n` +
        `Reporting Time: ${pass.reportingTime || pass.time}\n` +
        `Venue: ${pass.venue}\n` +
        `Lab / Gate Allotment: ${pass.labAllotment || 'Main Entrance Desk'}\n` +
        `Host Institute: ${pass.collegeName || studentCollege}\n` +
        `---------------------------------------------------------\n` +
        `STUDENT IDENTIFICATION:\n` +
        `Attendee Name: ${pass.attendeeName}\n` +
        `Student PRN / ID: ${pass.collegeId || pass.studentPrn}\n` +
        `Registered Email: ${pass.studentEmail || studentEmail}\n` +
        `Department: ${pass.department}\n` +
        `Access Tier: ${pass.tier}\n` +
        `---------------------------------------------------------\n` +
        `VERIFICATION METADATA:\n` +
        `Ticket ID: ${pass.ticketId}\n` +
        `Security Hash: ${pass.hash || `PASS-2026-${pass.eventId}-${pass.collegeId}`}\n` +
        `Verification Status: ${pass.status} (Valid)\n` +
        `Issued At: ${pass.issuedAt}\n` +
        `=========================================================\n` +
        `NOTICE: Present this pass along with your physical College ID\n` +
        `card at the campus checkpoint gate for fast-track entry.\n` +
        `=========================================================\n`;

      const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `YouthConnect_Pass_${pass.ticketId}_${studentPrn}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 600);
  };

  const handleDownloadCertificate = (certName: string) => {
    setDownloadingCert(certName);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7C6BA6', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // fallback
    }

    setTimeout(() => {
      setDownloadingCert(null);
      const content = `=========================================================\n` +
        `YOUTHCONNECT VERIFIED SOCIAL IMPACT CERTIFICATE\n` +
        `=========================================================\n` +
        `Candidate: ${studentName}\n` +
        `PRN: ${studentPrn}\n` +
        `Institution: ${studentCollege}\n` +
        `Department: ${studentDept}\n` +
        `Drive: ${certName}\n` +
        `Verified Community Hours: 8.0 Hours\n` +
        `Impact Verification ID: SPPU-NGO-2026-88492\n` +
        `Accreditation: NGO Council for Youth & Social Development\n` +
        `Issued on: April 2026\n` +
        `=========================================================\n`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Certificate_${certName.replace(/\s+/g, '_')}_${studentPrn}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 800);
  };

  // Helper to format ISO date time string for Google Calendar render template (YYYYMMDDTHHmmssZ)
  const getGoogleCalendarUrl = (pass: DigitalPass) => {
    const passId = pass.ticketId || 'TKT-2026-PASS';
    const prn = pass.collegeId || pass.studentPrn || studentPrn;
    const venue = pass.venue || 'Campus Auditorium, Nashik';
    const eventTitle = pass.eventTitle || 'Campus Collegiate Event';

    // Parse date & time to create reliable start/end ISO timestamps
    let startIso = '';
    let endIso = '';

    try {
      // Attempt parsing date string (e.g., "15 Dec 2026" or "Tomorrow • 10:00 AM" or "Dec 15, 2026")
      const parsedDate = new Date(pass.date);
      if (!isNaN(parsedDate.getTime())) {
        const start = new Date(parsedDate);
        // Default start to 09:00 AM if not parseable
        start.setHours(9, 0, 0, 0);
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000); // 4 hour duration
        startIso = start.toISOString().replace(/-|:|\.\d\d\d/g, '');
        endIso = end.toISOString().replace(/-|:|\.\d\d\d/g, '');
      } else {
        // Fallback standard future date format (20261215T090000Z/20261215T130000Z)
        startIso = '20261215T090000Z';
        endIso = '20261215T130000Z';
      }
    } catch {
      startIso = '20261215T090000Z';
      endIso = '20261215T130000Z';
    }

    const details = `Registered Pass ID: ${passId}\nPRN: ${prn}\nVenue: ${venue}\n\nManaged via YouthConnect`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      eventTitle
    )}&dates=${startIso}/${endIso}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(venue)}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-7 text-white animate-in fade-in duration-300 font-serif">
      
      {/* 1. Student Identity Header Banner */}
      <section 
        id="student-dashboard-header"
        className="rounded-3xl bg-white/[0.14] backdrop-blur-2xl border border-white/40 border-t-white/70 border-l-white/60 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 font-serif"
      >
        <div className="relative z-10 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-300/60 text-emerald-200 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-sm font-serif backdrop-blur-md">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-300" />
              SPPU Verified Student
            </span>
            <span className="text-xs text-purple-200 font-serif bg-white/15 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
              PRN: <span className="text-white font-bold font-mono">{studentPrn}</span>
            </span>
            <span className="text-xs text-purple-300 font-serif">• {studentDept}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif drop-shadow-md">
            Welcome back, {studentName.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-stone-200 max-w-2xl font-serif leading-relaxed">
            {studentCollege} • You have <span className="font-bold text-pink-300">{studentPasses.length} active registered pass{studentPasses.length !== 1 ? 'es' : ''}</span> linked to PRN <span className="font-mono font-semibold text-white">{studentPrn}</span>.
          </p>
        </div>

        {/* Header Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
          {onBrowseMoreEvents && (
            <button
              onClick={onBrowseMoreEvents}
              id="student-browse-events-btn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold shadow-[0_0_20px_rgba(236,72,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-pink-200/50 active:scale-95 transition-all cursor-pointer font-serif"
            >
              <Compass className="w-4 h-4 text-pink-100" />
              <span>Explore More Events</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              id="student-logout-btn"
              className="inline-flex items-center gap-1.5 bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 hover:text-white border border-rose-300/40 px-3.5 py-2 rounded-2xl text-xs font-medium transition-colors cursor-pointer font-serif backdrop-blur-md"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. DEDICATED "MY REGISTERED PASSES & TICKETS" ROSTER */}
      <section 
        id="student-registered-passes-section"
        className="rounded-3xl bg-white/[0.14] backdrop-blur-2xl border border-white/40 border-t-white/70 border-l-white/60 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] space-y-6 font-serif"
      >
        {/* Section Top Bar: Title, Count, Filters, Search & View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 text-pink-200 flex items-center justify-center border border-white/40 shadow-[0_0_15px_rgba(236,72,153,0.3)] backdrop-blur-md">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-serif drop-shadow-sm">
                  My Registered Passes & Tickets
                </h2>
                <span className="text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-500 px-3 py-0.5 rounded-full font-mono shadow-[0_0_12px_rgba(236,72,153,0.4)] border border-pink-300/40">
                  {studentPasses.length}
                </span>
              </div>
              <p className="text-xs text-purple-200 font-serif mt-0.5">
                Digital verified entry passes for PRN <span className="font-mono font-semibold text-white">{studentPrn}</span> ({studentName})
              </p>
            </div>
          </div>

          {/* Search Bar & View Mode Toggle */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[220px] flex-1 sm:flex-none">
              <Search className="w-3.5 h-3.5 text-pink-300 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event, pass ID, venue..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-white/15 border border-white/35 rounded-2xl text-white placeholder-stone-300 focus:outline-none focus:border-pink-300 font-serif transition-colors backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-pink-300 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Layout Toggle (Grid vs List) */}
            <div className="flex items-center bg-white/15 p-1 rounded-2xl border border-white/35 shrink-0 backdrop-blur-md">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm border border-white/30'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  layoutMode === 'list'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-sm border border-white/30'
                    : 'text-stone-300 hover:text-white'
                }`}
                title="Compact List View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Category & Status Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['All', 'Hackathons', 'College Fests', 'NGO Drives', 'Workshops'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap font-serif backdrop-blur-md ${
                  selectedCategoryFilter === cat
                    ? 'bg-gradient-to-r from-[#8B7CB6] to-pink-500 text-white font-semibold shadow-[0_0_15px_rgba(236,72,153,0.35)] border border-pink-200/50'
                    : 'bg-white/10 text-stone-200 hover:bg-white/20 hover:text-white border border-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-purple-200 font-serif text-[11px]">Status:</span>
            {['All', 'Active', 'Redeemed'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer font-serif backdrop-blur-md ${
                  selectedStatusFilter === st
                    ? 'bg-gradient-to-r from-[#8B7CB6] to-pink-500 text-white font-semibold shadow-xs border border-pink-200/50'
                    : 'bg-white/10 text-stone-200 hover:bg-white/20 border border-white/30'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* PASS CARDS CONTENT AREA */}
        {filteredPasses.length === 0 ? (
          /* Empty State */
          <div 
            id="student-passes-empty-state"
            className="rounded-3xl bg-white/[0.08] border border-white/25 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3 font-serif backdrop-blur-xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/40 text-pink-200 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]">
              <Ticket className="w-7 h-7" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="text-base font-bold text-white font-serif drop-shadow-sm">
                No active passes found for PRN <span className="font-mono text-pink-300">{studentPrn}</span>
              </h3>
              <p className="text-xs text-purple-200 font-serif leading-relaxed">
                Browse the Explore Feed to register for upcoming campus hackathons, cultural fests, NGO drives, and tech workshops.
              </p>
            </div>
            {onBrowseMoreEvents && (
              <button
                onClick={onBrowseMoreEvents}
                className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-[#8B7CB6] to-pink-500 text-white px-5 py-2.5 rounded-2xl text-xs font-semibold shadow-[0_0_20px_rgba(236,72,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-pink-200/50 active:scale-95 transition-all cursor-pointer font-serif"
              >
                <Compass className="w-4 h-4 text-pink-100" />
                <span>Browse Campus Events</span>
              </button>
            )}
          </div>
        ) : (
          /* Render Pass Cards in Grid or List Layout */
          <div className={
            layoutMode === 'grid'
              ? 'grid grid-cols-1 lg:grid-cols-2 gap-5 font-serif'
              : 'space-y-4 font-serif'
          }>
            {filteredPasses.map((pass) => {
              const categoryTag = pass.category || (
                pass.eventTitle.toLowerCase().includes('hackathon') || pass.eventTitle.toLowerCase().includes('techsprint') 
                  ? 'HACKATHON' 
                  : pass.eventTitle.toLowerCase().includes('fest') || pass.eventTitle.toLowerCase().includes('concert')
                  ? 'COLLEGE FEST'
                  : pass.eventTitle.toLowerCase().includes('clean') || pass.eventTitle.toLowerCase().includes('ngo')
                  ? 'NGO DRIVE'
                  : 'WORKSHOP'
              );

              const reportingTime = pass.reportingTime || `${pass.time} (Gate 1 Reporting)`;
              const labAllotment = pass.labAllotment || 'Main Auditorium Hall A & Desk 2';
              const hostCollege = pass.collegeName || studentCollege;
              const qrPayload = encodeURIComponent(
                `${pass.ticketId} | ${pass.eventTitle} | ${pass.attendeeName} | ${pass.collegeId} | ${pass.hash || `PASS-2026-${pass.eventId}-${pass.collegeId}`}`
              );

              return (
                <article
                  key={pass.ticketId}
                  id={`student-pass-card-${pass.ticketId}`}
                  className="rounded-3xl bg-white/[0.14] backdrop-blur-2xl border border-white/35 border-t-white/70 border-l-white/60 hover:border-pink-300/80 shadow-[0_12px_36px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] hover:shadow-[0_20px_50px_rgba(236,72,153,0.25)] hover:-translate-y-1 transition-all duration-200 flex flex-col relative overflow-hidden group font-serif animate-in fade-in duration-200"
                >
                  {/* Header Strip: Category, Tier & Status Indicator */}
                  <div className="bg-white/10 px-5 py-3 border-b border-white/20 flex items-center justify-between gap-2 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-300/50 text-pink-200 text-[10px] font-bold uppercase tracking-wider font-mono shadow-xs">
                        {categoryTag}
                      </span>
                      <span className="text-[11px] font-semibold text-stone-200 uppercase tracking-wide">
                        {pass.tier}
                      </span>
                    </div>

                    {/* Dynamic Status Indicator */}
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold font-serif backdrop-blur-md ${
                        pass.status === 'Valid'
                          ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-300/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                          : pass.status === 'Redeemed'
                          ? 'bg-purple-500/25 text-purple-200 border border-purple-300/50'
                          : 'bg-white/10 text-stone-200 border border-white/20'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          pass.status === 'Valid' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-pink-400'
                        }`} />
                        {pass.status === 'Valid' ? 'Confirmed / Active' : pass.status}
                      </span>
                    </div>
                  </div>

                  {/* Main Ticket Body: QR Code + Metadata */}
                  <div className="p-5 flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-1">
                    
                    {/* Entry Verification: Functional Digital QR Code Preview */}
                    <div className="flex flex-col items-center shrink-0 bg-white/10 p-3 rounded-2xl border border-white/30 shadow-md backdrop-blur-md">
                      <div 
                        onClick={() => onViewPassModal && onViewPassModal(pass)}
                        className="w-28 h-28 sm:w-32 sm:h-32 bg-white p-2 rounded-2xl flex items-center justify-center border border-white/50 shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
                        title="Click to enlarge pass QR"
                      >
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrPayload}`}
                          alt="Entry QR Pass"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Ticket ID with Instant Copy */}
                      <div className="mt-2 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-xl border border-white/30 shadow-xs">
                        <span className="font-mono text-[10px] font-bold text-pink-200">
                          {pass.ticketId}
                        </span>
                        <button
                          onClick={() => handleCopyTicket(pass.ticketId)}
                          className="p-0.5 text-purple-200 hover:text-white cursor-pointer hover:scale-110 active:scale-90 transition-transform"
                          title="Copy Pass ID"
                        >
                          {copiedId === pass.ticketId ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      {/* Subtle Divider Line */}
                      <div className="w-full border-t border-white/20 my-2.5" />

                      {/* Add to Google Calendar Action Button */}
                      <a
                        href={getGoogleCalendarUrl(pass)}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`add-calendar-btn-${pass.ticketId}`}
                        className="border border-white/40 text-white hover:bg-white/20 text-xs font-serif px-3 py-2 rounded-xl flex items-center justify-center gap-2 transition-all w-full shadow-sm cursor-pointer text-center select-none backdrop-blur-md"
                        title="Add this registered event to Google Calendar"
                      >
                        <CalendarPlus className="w-3.5 h-3.5 shrink-0 text-pink-300" />
                        <span className="whitespace-nowrap font-medium text-[11px]">Google Calendar</span>
                      </a>
                    </div>

                    {/* Ticket Metadata Details */}
                    <div className="flex-1 w-full space-y-2.5 text-left">
                      <div>
                        <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-pink-300 leading-snug font-serif transition-colors duration-200 drop-shadow-sm">
                          {pass.eventTitle}
                        </h3>
                        <p className="text-[11px] text-purple-200 font-medium mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 shrink-0 text-pink-300" />
                          <span className="truncate">{hostCollege}</span>
                        </p>
                      </div>

                      {/* Event Metadata Grid: Date, Reporting Time, Venue, Lab Allotment */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-200 bg-black/25 p-3 rounded-2xl border border-white/20 backdrop-blur-md">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                          <span className="font-medium truncate">{pass.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                          <span className="font-medium truncate">{reportingTime}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:col-span-2">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate">{pass.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:col-span-2 text-[11px] text-purple-200 border-t border-white/15 pt-1.5">
                          <Layers className="w-3.5 h-3.5 text-pink-300 shrink-0" />
                          <span className="truncate font-medium">Allotment: <strong className="text-white">{labAllotment}</strong></span>
                        </div>
                      </div>

                      {/* Student Identification Information */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-300 px-1">
                        <div>
                          <span className="text-purple-300 block text-[9px] uppercase font-semibold">Registered Student</span>
                          <span className="font-bold text-white">{pass.attendeeName}</span>
                        </div>
                        <div>
                          <span className="text-purple-300 block text-[9px] uppercase font-semibold">PRN / Student ID</span>
                          <span className="font-mono font-bold text-pink-300">{pass.collegeId || pass.studentPrn}</span>
                        </div>
                        <div>
                          <span className="text-purple-300 block text-[9px] uppercase font-semibold">Department</span>
                          <span className="font-medium text-stone-200">{pass.department}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls Footer Bar */}
                  <div className="bg-white/10 px-5 py-3 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 backdrop-blur-md">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-300 flex items-center gap-1 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        Gate Checkpoint Ready
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Enlarge Pass / Show QR Modal */}
                      {onViewPassModal && (
                        <button
                          onClick={() => onViewPassModal(pass)}
                          className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/35 text-xs font-medium flex items-center gap-1 transition-all duration-200 cursor-pointer backdrop-blur-md"
                          title="Open Full Pass Preview"
                        >
                          <Maximize2 className="w-3 h-3 text-pink-300" />
                          <span>Enlarge</span>
                        </button>
                      )}

                      {/* View Venue Directions & Lab Route Modal */}
                      <button
                        onClick={() => setDirectionsPass(pass)}
                        className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/35 text-xs font-medium flex items-center gap-1 transition-all duration-200 cursor-pointer backdrop-blur-md"
                        title="View Campus Gate & Lab Route"
                      >
                        <Navigation className="w-3 h-3 text-rose-400" />
                        <span>Directions</span>
                      </button>

                      {/* Download Pass */}
                      <button
                        onClick={() => handleDownloadPass(pass)}
                        disabled={downloadingPassId === pass.ticketId}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#8B7CB6] to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-[0_0_15px_rgba(236,72,153,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-pink-200/50 transition-all duration-200 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>{downloadingPassId === pass.ticketId ? 'Saving...' : 'Download Pass'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. LOWER SECTION: Two Columns (Campus Schedule Timeline + Social Volunteering Credits) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT 7 COLS: Chronological Campus Event Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-3xl bg-white/[0.14] backdrop-blur-2xl border border-white/40 border-t-white/70 border-l-white/60 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-pink-200 flex items-center justify-center border border-white/40 shadow-[0_0_15px_rgba(236,72,153,0.3)] backdrop-blur-md">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-serif drop-shadow-sm">
                    Campus Schedule & Timeline
                  </h2>
                  <p className="text-xs text-purple-200 font-serif">Registered and upcoming milestones</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {displayTimelineEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3.5 rounded-2xl border border-white/25 hover:border-pink-300/60 bg-black/20 hover:bg-black/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-serif backdrop-blur-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/40 flex flex-col items-center justify-center shrink-0 shadow-xs">
                      <span className="text-[9px] font-bold uppercase text-pink-300 font-serif">{evt.date.month}</span>
                      <span className="text-base font-bold text-white leading-none font-serif">{evt.date.day}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/25 text-pink-200 border border-pink-300/40 font-serif">
                          {evt.category}
                        </span>
                        <span className="text-[11px] text-purple-200 font-serif">{evt.date.time || '10:00 AM'}</span>
                      </div>
                      <h4 
                        onClick={() => onViewEventDetail && onViewEventDetail(evt)}
                        className="text-sm font-bold text-white mt-0.5 hover:text-pink-300 cursor-pointer transition-colors font-serif drop-shadow-sm"
                      >
                        {evt.title}
                      </h4>
                      <p className="text-xs text-stone-300 flex items-center gap-1 mt-0.5 font-serif">
                        <MapPin className="w-3 h-3 text-rose-400" />
                        <span className="truncate">{evt.venue}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => {
                        if (onViewEventDetail) onViewEventDetail(evt);
                        else if (onSelectEvent) onSelectEvent(evt);
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-white/40 hover:border-pink-300 bg-white/15 hover:bg-white/25 text-xs font-semibold text-white transition-colors cursor-pointer font-serif backdrop-blur-md"
                    >
                      View Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT 5 COLS: Volunteering Hours, Certificates & Community Clubs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Social Impact & Volunteering Hours */}
          <section className="rounded-3xl bg-white/[0.14] backdrop-blur-2xl border border-white/40 border-t-white/70 border-l-white/60 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] font-serif">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-300/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif drop-shadow-sm">Social Credit Hours</h3>
                  <p className="text-xs text-purple-200 font-serif">SPPU NSS & NGO Volunteering Progress</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-200 bg-emerald-500/25 px-2.5 py-0.5 rounded-full border border-emerald-300/50 font-serif">
                {progressPercent}% Met
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs text-stone-200 font-serif">
                <span>Completed: <strong className="text-white">{completedSocialHours} hrs</strong></span>
                <span>Target: <strong>{targetSocialHours} hrs</strong></span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/40 border border-white/20 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_10px_#34d399]" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Verified Certificate Card */}
            <div className="p-3.5 rounded-2xl bg-black/25 border border-white/20 space-y-2 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-pink-300" />
                  <span className="text-xs font-bold text-white font-serif">Godavari Cleanathon Drive</span>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-emerald-500/25 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300/40">
                  +8.0 hrs
                </span>
              </div>
              <p className="text-xs text-purple-200 font-serif">
                Issued by Nashik Youth Environmental Foundation • Verified by SPPU
              </p>
              <button
                onClick={() => handleDownloadCertificate('Godavari Cleanathon Drive')}
                disabled={downloadingCert === 'Godavari Cleanathon Drive'}
                className="w-full mt-1 py-2 rounded-xl bg-white/20 hover:bg-white/30 border border-white/40 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer font-serif backdrop-blur-md"
              >
                <Download className="w-3.5 h-3.5 text-pink-200" />
                <span>{downloadingCert ? 'Downloading Verified Certificate...' : 'Download Verified Certificate (TXT)'}</span>
              </button>
            </div>
          </section>

          {/* Campus Community Clubs */}
          <section className="rounded-3xl bg-white/[0.14] backdrop-blur-2xl border border-white/40 border-t-white/70 border-l-white/60 p-5 sm:p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] font-serif">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-pink-200 flex items-center justify-center border border-white/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-serif drop-shadow-sm">Joined Student Clubs</h3>
                  <p className="text-xs text-purple-200 font-serif">Community chapters in Nashik</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {(clubs.length > 0 ? clubs.slice(0, 2) : [
                { id: 'c1', name: 'Nashik Coders Hub', category: 'Technology', membersCount: 1420, college: 'KKWIEER Campus' },
                { id: 'c2', name: 'Robotics Society', category: 'Hardware', membersCount: 860, college: 'KKWIEER Campus' }
              ]).map((club: any) => (
                <div
                  key={club.id}
                  className="p-3 rounded-2xl border border-white/20 bg-black/25 flex items-center justify-between font-serif backdrop-blur-md"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {club.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white font-serif">{club.name}</h4>
                      <p className="text-[11px] text-purple-200 font-serif">{club.category} • {club.college || 'Nashik'}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-pink-200 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-300/40 font-serif">
                    Active Member
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 4. VENUE DIRECTIONS & LAB ROUTE MODAL */}
      {directionsPass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-in fade-in duration-200 font-serif">
          <div className="bg-[#181126]/90 rounded-3xl w-full max-w-lg overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/30 border-t-white/60 flex flex-col relative animate-in zoom-in-95 duration-200 backdrop-blur-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8B7CB6] via-purple-600 to-pink-600 p-5 text-white flex items-center justify-between font-serif">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/25 flex items-center justify-center border border-white/40 shadow-xs">
                  <Navigation className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-wider uppercase bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">
                    CAMPUS ROUTE & ALLOTMENT
                  </span>
                  <h3 className="text-sm font-bold font-serif mt-0.5 text-white">
                    Venue Directions & Check-in Route
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setDirectionsPass(null)}
                className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 font-serif text-xs text-stone-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-pink-300 tracking-wider">EVENT VENUE</span>
                <h4 className="text-base font-bold text-white mt-0.5 font-serif drop-shadow-sm">{directionsPass.eventTitle}</h4>
                <p className="text-purple-200 mt-1 flex items-start gap-1.5 font-medium">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{directionsPass.venue}</span>
                </p>
              </div>

              {/* Lab & Gate Allotment Highlights */}
              <div className="bg-black/35 p-4 rounded-2xl border border-white/20 grid grid-cols-2 gap-3.5 backdrop-blur-md">
                <div>
                  <span className="text-[10px] text-purple-300 uppercase font-semibold block">Designated Check-in Gate</span>
                  <span className="font-bold text-white mt-0.5 block">Gate 1 (Main Campus Arch)</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-300 uppercase font-semibold block">Lab / Hall Allotment</span>
                  <span className="font-bold text-white mt-0.5 block">{directionsPass.labAllotment || 'CS Lab 304 & Auditorium Terminal'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-300 uppercase font-semibold block">Reporting Time</span>
                  <span className="font-bold text-pink-300 mt-0.5 block">{directionsPass.reportingTime || `${directionsPass.time} Sharp`}</span>
                </div>
                <div>
                  <span className="text-[10px] text-purple-300 uppercase font-semibold block">Entry Requirement</span>
                  <span className="font-bold text-emerald-300 mt-0.5 block">Physical College ID + Pass</span>
                </div>
              </div>

              {/* Transit & Parking Guidance */}
              <div className="space-y-1.5 text-stone-200 bg-black/35 p-3.5 rounded-2xl border border-white/20 backdrop-blur-md">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-pink-300" />
                  Transit & Parking Advice
                </p>
                <p className="text-[11px] leading-relaxed text-purple-200">
                  • City bus lines stop directly outside the college main gate (Routes 12, 18, 24).
                  <br />
                  • Dedicated two-wheeler student parking available behind Block C.
                  <br />
                  • Fast-track QR verification lanes open 45 minutes prior to scheduled start.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-2.5">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directionsPass.venue)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 text-white rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(236,72,153,0.35)] border border-pink-200/50 transition-all cursor-pointer font-serif"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
                <button
                  onClick={() => setDirectionsPass(null)}
                  className="px-5 py-2.5 bg-white/15 border border-white/30 hover:bg-white/25 text-white rounded-2xl font-medium text-xs transition-colors cursor-pointer font-serif backdrop-blur-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
