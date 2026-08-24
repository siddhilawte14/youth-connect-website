import React, { useState, useMemo } from 'react';
import { EventItem, OrganizerStats, EventAttendee } from '../types';
import { YouthConnectLogo } from './YouthConnectLogo';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Plus, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search,
  FileSpreadsheet,
  ShieldCheck,
  Radio,
  Activity,
  Send,
  CalendarPlus,
  Mail,
  MessageSquare,
  Bell,
  Play,
  Pause,
  ExternalLink,
  LogOut,
  X,
  UserCheck,
  Building2,
  Calendar,
  MapPin,
  Flame,
  Check,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrganizerDashboardViewProps {
  events: EventItem[];
  stats?: OrganizerStats;
  onOpenCreateEvent?: () => void;
  onOpenBroadcastModal?: () => void;
  onOpenGateScanner?: () => void;
  onPublishDraft?: (eventId: string) => void;
  onSelectEvent?: (event: EventItem) => void;
  onNavigateToStudentExplore?: () => void;
  onLogout?: () => void;
  onUpdateEventStatus?: (eventId: string, isRegistrationPaused: boolean) => void;
}

export const OrganizerDashboardView: React.FC<OrganizerDashboardViewProps> = ({
  events = [],
  stats,
  onOpenCreateEvent = () => {},
  onOpenBroadcastModal,
  onOpenGateScanner = () => {},
  onPublishDraft = () => {},
  onSelectEvent,
  onNavigateToStudentExplore = () => {},
  onLogout = () => {},
  onUpdateEventStatus,
}) => {
  // Local state for chapters
  const [activeChapter, setActiveChapter] = useState('ACM Student Chapter / MET BKC');
  const [showChapterDropdown, setShowChapterDropdown] = useState(false);

  // Local state for event filters and status toggles
  const [eventFilterTab, setEventFilterTab] = useState<'All' | 'Published' | 'Draft' | 'Completed'>('All');
  const [pausedEvents, setPausedEvents] = useState<Record<string, boolean>>({});
  
  // Attendee Roster Modal / Drawer state
  const [activeRosterEventId, setActiveRosterEventId] = useState<string | null>(null);
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [checkedInAttendees, setCheckedInAttendees] = useState<Record<string, boolean>>({
    'att-1': true,
    'att-4': true,
  });

  // Broadcast Center State
  const [broadcastTargetEventId, setBroadcastTargetEventId] = useState<string>(events[0]?.id || 'all');
  const [selectedChannels, setSelectedChannels] = useState<{
    email: boolean;
    whatsapp: boolean;
    push: boolean;
  }>({
    email: true,
    whatsapp: true,
    push: true,
  });
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [includeCalendarSync, setIncludeCalendarSync] = useState(true);
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);
  const [broadcastSentToast, setBroadcastSentToast] = useState<string | null>(null);

  // Dynamic KPI calculations
  const publishedEvents = useMemo(() => events.filter(e => e.status === 'Published'), [events]);
  const draftEvents = useMemo(() => events.filter(e => e.status === 'Draft'), [events]);
  
  const totalRegistrationsCount = useMemo(() => {
    const sum = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);
    return sum > 0 ? sum : 1420;
  }, [events]);

  const totalViewsCalculated = useMemo(() => {
    const sum = events.reduce((acc, curr) => acc + (curr.views || 250), 0);
    return sum > 1000 ? `${(sum / 1000).toFixed(1)}k` : `${sum}`;
  }, [events]);

  // Attendee Mock Datasets per event
  const defaultAttendees: EventAttendee[] = useMemo(() => [
    {
      id: 'att-1',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@kkw.edu.in',
      timestamp: 'Today, 10:24 AM',
      college: 'KKWIEER Nashik',
      department: 'Computer Engineering (PRN: 2022010892)',
      ticketId: 'YC-2026-TK-8891',
      role: 'Hacker Lead',
    },
    {
      id: 'att-2',
      name: 'Pooja Patil',
      email: 'pooja.p@sandip.edu.in',
      timestamp: 'Today, 09:15 AM',
      college: 'Sandip University',
      department: 'Information Technology (PRN: 2023091104)',
      ticketId: 'YC-2026-TK-8892',
      role: 'Participant',
    },
    {
      id: 'att-3',
      name: 'Amit Kulkarni',
      email: 'amit.k@metbkc.edu.in',
      timestamp: 'Yesterday, 04:30 PM',
      college: 'MET Bhujbal Knowledge City',
      department: 'Mechanical Engineering (PRN: 2021045231)',
      ticketId: 'YC-2026-TK-8893',
      role: 'Participant',
    },
    {
      id: 'att-4',
      name: 'Siddhi Lawte',
      email: 'siddhi.lawte@kkw.edu.in',
      timestamp: 'Yesterday, 02:10 PM',
      college: 'KKWIEER Nashik',
      department: 'Computer Engineering (PRN: 2022014589)',
      ticketId: 'YC-2026-TK-8894',
      role: 'Track Lead',
    },
    {
      id: 'att-5',
      name: 'Omkar Deshmukh',
      email: 'omkar.d@kbtcoe.org',
      timestamp: '2 days ago',
      college: 'NDMVP KBT COE',
      department: 'Electronics & Telecom (PRN: 2022033871)',
      ticketId: 'YC-2026-TK-8895',
      role: 'Participant',
    },
    {
      id: 'att-6',
      name: 'Snehal Jagtap',
      email: 'snehal.j@sitrc.edu.in',
      timestamp: '3 days ago',
      college: 'SITRC Nashik',
      department: 'AI & Data Science (PRN: 2023021945)',
      ticketId: 'YC-2026-TK-8896',
      role: 'Participant',
    }
  ], []);

  // Filter events for the roster table
  const displayedEvents = useMemo(() => {
    if (eventFilterTab === 'All') return events;
    if (eventFilterTab === 'Published') return publishedEvents;
    if (eventFilterTab === 'Draft') return draftEvents;
    return events.filter(e => e.status === 'Completed' || e.registeredCount >= e.capacity);
  }, [events, eventFilterTab, publishedEvents, draftEvents]);

  // Selected event for attendee list modal
  const selectedRosterEvent = useMemo(() => {
    return events.find(e => e.id === activeRosterEventId) || null;
  }, [events, activeRosterEventId]);

  // Toggle pause registration
  const handleTogglePause = (eventId: string, title: string) => {
    const newPaused = !pausedEvents[eventId];
    setPausedEvents(prev => ({ ...prev, [eventId]: newPaused }));
    if (onUpdateEventStatus) {
      onUpdateEventStatus(eventId, newPaused);
    }
    setBroadcastSentToast(newPaused ? `Registrations paused for "${title}".` : `Registrations reopened for "${title}".`);
    setTimeout(() => setBroadcastSentToast(null), 3000);
  };

  // CSV Exporter for an event
  const handleExportCSV = (event: EventItem) => {
    let csvContent = `TicketID,AttendeeName,Email,College,DepartmentAndPRN,Event,Role,CheckInStatus\n`;
    const targetAttendees = (event.attendees && event.attendees.length > 0) ? event.attendees : defaultAttendees;
    
    targetAttendees.forEach((att) => {
      const isChecked = checkedInAttendees[att.id] ? 'VERIFIED_CHECKED_IN' : 'PENDING_GATE_SCAN';
      csvContent += `${att.ticketId || 'TKT-AUTO'},"${att.name}","${att.email}","${att.college || 'KKWIEER'}","${att.department || 'N/A'}","${event.title}","${att.role || 'Attendee'}",${isChecked}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_verified_roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setBroadcastSentToast(`Downloaded verified CSV for "${event.title}".`);
    setTimeout(() => setBroadcastSentToast(null), 3000);
  };

  // Toggle manual check-in
  const handleToggleAttendeeCheckIn = (attendeeId: string) => {
    setCheckedInAttendees(prev => ({
      ...prev,
      [attendeeId]: !prev[attendeeId]
    }));
  };

  // Fast broadcast template inserter
  const handleApplyTemplate = (type: 'venue' | 'problems' | 'schedule') => {
    const targetEvt = events.find(e => e.id === broadcastTargetEventId) || events[0];
    const eventName = targetEvt ? targetEvt.title : 'Campus Event';

    if (type === 'venue') {
      setBroadcastSubject(`[URGENT] Venue & Lab Allotment Update: ${eventName}`);
      setBroadcastMessage(
        `Important Venue & Seating Notice for ${eventName}:\n` +
        `• Primary Auditorium: Check-in at Gate 02 (Ground Floor)\n` +
        `• Hackathon Lab Allotment: Labs 301, 302 & 304 (3rd Floor, West Wing)\n` +
        `• Gate Protocol: Carry your physical Student College ID card + YouthConnect QR Pass on mobile.`
      );
    } else if (type === 'problems') {
      setBroadcastSubject(`[LIVE] Problem Statements & Challenge Tracks Released: ${eventName}`);
      setBroadcastMessage(
        `The official challenge statements for ${eventName} are now unlocked!\n` +
        `• Tracks: Track 1 (AI & Agentic Systems), Track 2 (Smart City Logistics), Track 3 (FinTech Security)\n` +
        `• Mentorship Desk: Discord channels and Physical Helpdesk at Lab 304 are open.\n` +
        `• First Review: 12:30 PM.`
      );
    } else if (type === 'schedule') {
      setBroadcastSubject(`[NOTICE] Schedule & Timing Shift: ${eventName}`);
      setBroadcastMessage(
        `Important Schedule Adjustment for ${eventName}:\n` +
        `• Opening Keynote: 09:30 AM (shifted by 30 mins to facilitate inter-college transit)\n` +
        `• Team Reporting & Badge Issuance: 08:30 AM - 09:15 AM\n` +
        `• High-Tea & Networking: 11:30 AM at Central Atrium.`
      );
    }
  };

  // Dispatch Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setIsSendingBroadcast(true);

    const channelNames = [];
    if (selectedChannels.email) channelNames.push('Email');
    if (selectedChannels.whatsapp) channelNames.push('WhatsApp');
    if (selectedChannels.push) channelNames.push('Push Notification');

    setTimeout(() => {
      setIsSendingBroadcast(false);
      
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#10B981', '#38BDF8']
        });
      } catch (err) {
        // safe fallback
      }

      setBroadcastSentToast(
        `Multi-channel broadcast dispatched via ${channelNames.join(', ')} to registered students!`
      );
      setBroadcastSubject('');
      setBroadcastMessage('');

      setTimeout(() => {
        setBroadcastSentToast(null);
      }, 4000);
    }, 1200);
  };

  const activeTargetEvent = events.find(e => e.id === broadcastTargetEventId);
  const audienceCount = broadcastTargetEventId === 'all' 
    ? totalRegistrationsCount 
    : (activeTargetEvent?.registeredCount || 120);

  return (
    <div className="min-h-screen bg-transparent text-stone-900 font-serif selection:bg-[#8B7CB6]/30 selection:text-stone-900">
      
      {/* Toast Notification Alert */}
      {broadcastSentToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-50 text-emerald-900 border border-emerald-300 px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 font-serif">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{broadcastSentToast}</span>
          <button 
            onClick={() => setBroadcastSentToast(null)}
            className="text-emerald-700 hover:text-emerald-900 ml-2 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. DEDICATED TOP NAVBAR (Strict Role Isolation) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Logo + Organizer Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 cursor-pointer" onClick={onNavigateToStudentExplore}>
              <YouthConnectLogo className="w-7 h-7 text-[#8B7CB6]" />
              <span className="font-bold text-lg text-stone-900 tracking-tight hidden sm:inline-block">
                YouthConnect
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7C6BA6] text-[10px] sm:text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B7CB6] shrink-0" />
              <span>Organizer Command Center</span>
            </div>
          </div>

          {/* Right: Active Chapter Identity + Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Chapter Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowChapterDropdown(!showChapterDropdown)}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-stone-200 hover:border-[#8B7CB6] text-xs font-medium text-stone-700 transition-colors cursor-pointer shadow-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-[#8B7CB6]" />
                <span className="max-w-[200px] truncate">{activeChapter}</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {showChapterDropdown && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-stone-200 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[10px] font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200 mb-1">
                    Select Collegiate Chapter
                  </div>
                  {[
                    'ACM Student Chapter / MET BKC',
                    'CSI Student Chapter / KKWIEER',
                    'IEEE Student Branch / Sandip Univ',
                    'Rotaract Youth Club / Nashik'
                  ].map((chap) => (
                    <button
                      key={chap}
                      onClick={() => {
                        setActiveChapter(chap);
                        setShowChapterDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        activeChapter === chap ? 'bg-[#8B7CB6] text-white font-semibold' : 'text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate">{chap}</span>
                      {activeChapter === chap && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Live Portal */}
            <button
              onClick={onNavigateToStudentExplore}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#8B7CB6] text-stone-700 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs"
              title="Return to Student Event Discovery Feed"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#8B7CB6]" />
              <span className="hidden sm:inline">Preview Live Portal</span>
              <span className="sm:hidden">Explore</span>
            </button>

            {/* Sign Out */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs"
              title="Sign out of Organizer Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* PAGE CANVAS: Clean light alabaster canvas */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
        
        {/* ======================================================== */}
        {/* 2. PROMINENT "CREATE EVENT" HERO ACTION BANNER */}
        {/* ======================================================== */}
        <section
          id="hero-create-event-banner"
          onClick={onOpenCreateEvent}
          className="relative bg-white border-2 border-dashed border-[#8B7CB6]/60 hover:border-[#8B7CB6] rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/5 cursor-pointer group overflow-hidden shadow-xs"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-purple-100/60 transition-all duration-500" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 sm:gap-6">
              
              {/* Prominent Circular Plus Icon */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#8B7CB6] group-hover:bg-[#7C6BA6] group-hover:scale-105 text-white p-4 flex items-center justify-center shadow-md transition-all duration-300 shrink-0">
                <Plus className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#7C6BA6] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 font-serif">
                    Primary Organizer Action
                  </span>
                  <span className="text-xs text-stone-500">• Step-by-Step Wizard</span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight group-hover:text-[#7C6BA6] transition-colors font-serif">
                  Publish a New Hackathon, Fest, or NGO Drive
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed font-serif">
                  Configure registration limits, ticketing rules, QR check-ins, and multi-channel student alerts in one place.
                </p>
              </div>
            </div>

            {/* Quick Action Badges Strip */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0 font-serif">
              <span className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Instant Live Listing</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>Secure QR Check-Ins</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-semibold text-stone-700 flex items-center gap-1.5 shadow-xs">
                <Radio className="w-3.5 h-3.5 text-[#8B7CB6]" />
                <span>Multi-Channel Alerts</span>
              </span>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. STREAMLINED ORGANIZER CORE UTILITIES (3 ESSENTIAL MODULES) */}
        {/* ======================================================== */}

        {/* -------------------------------------------------------- */}
        {/* MODULE A: KEY PERFORMANCE METRIC GRID (4 Cards) */}
        {/* -------------------------------------------------------- */}
        <section className="space-y-3 font-serif">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-600 font-serif">
              Key Performance Metrics
            </h2>
            <span className="text-xs text-stone-500 font-serif">Live Telemetry & Check-in Sync</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-serif">
            
            {/* 1. Total Reach & Views */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-[#8B7CB6] shadow-xs transition-all duration-200 flex flex-col justify-between group font-serif">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600 font-serif">Total Reach & Views</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center border border-purple-200 group-hover:scale-105 transition-transform">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-stone-900 tracking-tight font-serif">
                  {stats?.totalViews || totalViewsCalculated}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 font-serif">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-serif">
                    <TrendingUp className="w-3 h-3 text-emerald-600" /> {stats?.totalViewsGrowth || '+22.4%'}
                  </span>
                  <span className="text-[11px] text-stone-500 font-serif">across feeds</span>
                </div>
              </div>
            </div>

            {/* 2. Confirmed Registrations */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-emerald-500 shadow-xs transition-all duration-200 flex flex-col justify-between group font-serif">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600 font-serif">Confirmed Registrations</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 group-hover:scale-105 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-stone-900 tracking-tight font-serif">
                  {totalRegistrationsCount.toLocaleString()}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 font-serif">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-serif">
                    <TrendingUp className="w-3 h-3 text-emerald-600" /> {stats?.registrationsGrowth || '+28.5%'}
                  </span>
                  <span className="text-[11px] text-stone-500 font-serif">student passes</span>
                </div>
              </div>
            </div>

            {/* 3. Live QR Check-In Rate */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-[#8B7CB6] shadow-xs transition-all duration-200 flex flex-col justify-between group font-serif">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600 font-serif">Live QR Check-In Rate</span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center border border-purple-200 group-hover:scale-105 transition-transform">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-stone-900 tracking-tight font-serif">
                  {stats?.engagementRate || '74.2%'}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 font-serif">
                  <span className="text-[11px] font-semibold text-[#7C6BA6] bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-serif">
                    <CheckCircle2 className="w-3 h-3" /> Scanned at Gate
                  </span>
                  <span className="text-[11px] text-stone-500 font-serif">verified</span>
                </div>
              </div>
            </div>

            {/* 4. Active Live Events */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 hover:border-amber-500 shadow-xs transition-all duration-200 flex flex-col justify-between group font-serif">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600 font-serif">Active Live Events</span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-bold text-stone-900 tracking-tight font-serif">
                  {publishedEvents.length}
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 font-serif">
                  <span className="text-[11px] font-semibold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-serif">
                    <Sparkles className="w-3 h-3 text-amber-600" /> {draftEvents.length} drafts ready
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* MODULE B: ACTIVE EVENTS & ATTENDEE MANAGEMENT ROSTER */}
        {/* -------------------------------------------------------- */}
        <section className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden font-serif">
          
          {/* Header & Filter Strip */}
          <div className="p-5 sm:p-6 border-b border-stone-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-stone-50 font-serif">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  Active Events & Attendee Management Roster
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#7C6BA6] text-[10px] font-semibold uppercase tracking-wider border border-purple-200 font-serif">
                  Administrative Control
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-serif">
                Real-time seat quotas, PRN student rosters, dynamic QR verification, and registration locks.
              </p>
            </div>

            {/* Filter Tabs & Gate Scanner Launch */}
            <div className="flex flex-wrap items-center gap-2.5 font-serif">
              <div className="flex bg-white p-1 rounded-xl border border-stone-200 text-xs shadow-xs">
                {(['All', 'Published', 'Draft', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setEventFilterTab(tab)}
                    className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer font-serif ${
                      eventFilterTab === tab
                        ? 'bg-[#8B7CB6] text-white font-semibold shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={onOpenGateScanner}
                className="px-3.5 py-1.5 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-xs cursor-pointer font-serif"
                title="Launch Fullscreen Gate Entry Scanner"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Launch QR Gate Scanner</span>
              </button>
            </div>
          </div>

          {/* Table of Events */}
          <div className="overflow-x-auto font-serif">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Event Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Registered / Capacity</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {displayedEvents.map((evt) => {
                  const percentage = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                  const isPaused = pausedEvents[evt.id] || false;

                  return (
                    <tr key={evt.id} className="hover:bg-stone-50 transition-colors group">
                      
                      {/* Event Name + Thumbnail */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.bannerUrl}
                            alt={evt.title}
                            className="w-11 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-stone-900 text-sm block group-hover:text-[#7C6BA6] transition-colors font-serif">
                              {evt.title}
                            </span>
                            <span className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 font-serif">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="truncate max-w-[220px]">{evt.venue}</span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-purple-50 text-[#7C6BA6] border border-purple-200 font-serif">
                          {evt.category}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4">
                        <div className="text-stone-900 font-medium font-serif">
                          {evt.date.fullDate}
                        </div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 font-serif">
                          <Clock className="w-3 h-3 text-stone-400" />
                          <span>{evt.date.time || '10:00 AM'}</span>
                        </div>
                      </td>

                      {/* Registered / Capacity */}
                      <td className="py-4 px-4 font-serif">
                        <div className="w-36">
                          <div className="flex justify-between text-[11px] font-medium mb-1">
                            <span className="text-stone-900 font-semibold font-serif">
                              {evt.registeredCount} / {evt.capacity}
                            </span>
                            <span className="text-stone-500 font-serif">{percentage}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                percentage >= 90 ? 'bg-amber-500' : 'bg-[#8B7CB6]'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 font-serif">
                        {isPaused ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-serif">
                            <Pause className="w-3 h-3 text-amber-600" /> Paused
                          </span>
                        ) : evt.status === 'Published' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-serif">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Live
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2.5 py-0.5 rounded-full font-serif">
                            <Clock className="w-3 h-3" /> Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right font-serif">
                        <div className="flex items-center justify-end gap-2 font-serif">
                          
                          {/* View Attendee Roster / Scanner */}
                          <button
                            onClick={() => setActiveRosterEventId(evt.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C6BA6] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer font-serif"
                            title="View Attendee List and Manage Gate Check-ins"
                          >
                            <Users className="w-3.5 h-3.5 text-[#8B7CB6]" />
                            <span>Roster</span>
                          </button>

                          {/* Export CSV */}
                          <button
                            onClick={() => handleExportCSV(evt)}
                            className="p-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 transition-colors cursor-pointer shadow-xs"
                            title="Export verified attendee roster to CSV"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit / Pause Registration Toggle */}
                          <button
                            onClick={() => handleTogglePause(evt.id, evt.title)}
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer shadow-xs ${
                              isPaused
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                                : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                            }`}
                            title={isPaused ? 'Resume Registrations' : 'Pause Registrations'}
                          >
                            {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-600" /> : <Pause className="w-3.5 h-3.5 text-amber-600" />}
                          </button>

                          {/* Publish Draft if in draft mode */}
                          {evt.status === 'Draft' && (
                            <button
                              onClick={() => onPublishDraft(evt.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer font-serif"
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* MODULE C: MULTI-CHANNEL BROADCAST CENTER */}
        {/* -------------------------------------------------------- */}
        <section className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6 font-serif">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5 font-serif">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center border border-purple-200">
                  <Radio className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-stone-900 font-serif">
                  Multi-Channel Student Broadcast Center
                </h2>
              </div>
              <p className="text-xs text-stone-600 mt-1 font-serif">
                Instantly dispatch push notifications, WhatsApp updates, and verified email blasts to confirmed attendees.
              </p>
            </div>

            {/* Confirmed Audience Counter */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 font-serif shadow-xs">
              <Users className="w-3.5 h-3.5 text-[#8B7CB6]" />
              <span>Target Audience: <strong className="text-stone-900 font-bold">{audienceCount} Students</strong></span>
            </div>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-5 font-serif">
            
            {/* Target Event Selector & Channel Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-serif">
              
              {/* Target Event Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2 font-serif">
                  Target Event Audience *
                </label>
                <select
                  value={broadcastTargetEventId}
                  onChange={(e) => setBroadcastTargetEventId(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] focus:bg-white font-serif"
                >
                  <option value="all" className="bg-white text-stone-900">
                    📢 All Active Events ({totalRegistrationsCount} Total Students)
                  </option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id} className="bg-white text-stone-900">
                      {e.title} ({e.registeredCount} Registered Students)
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Selector Pills */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-2 font-serif">
                  Dispatch Channels *
                </label>
                <div className="flex flex-wrap items-center gap-2 font-serif">
                  <button
                    type="button"
                    onClick={() => setSelectedChannels(prev => ({ ...prev, email: !prev.email }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer font-serif ${
                      selectedChannels.email
                        ? 'bg-[#8B7CB6] text-white border-[#7C6BA6] shadow-xs font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:text-stone-900'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Blast</span>
                    {selectedChannels.email && <Check className="w-3 h-3 ml-1" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedChannels(prev => ({ ...prev, whatsapp: !prev.whatsapp }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer font-serif ${
                      selectedChannels.whatsapp
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:text-stone-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Broadcast</span>
                    {selectedChannels.whatsapp && <Check className="w-3 h-3 ml-1" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedChannels(prev => ({ ...prev, push: !prev.push }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer font-serif ${
                      selectedChannels.push
                        ? 'bg-[#8B7CB6] text-white border-[#7C6BA6] shadow-xs font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:text-stone-900'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>In-App Push</span>
                    {selectedChannels.push && <Check className="w-3 h-3 ml-1" />}
                  </button>
                </div>
              </div>

            </div>

            {/* Pre-Set Fast Templates Strip */}
            <div className="font-serif">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700 font-serif">
                  Pre-Set Fast Templates:
                </span>
                <span className="text-[11px] text-stone-500 font-serif">Click to auto-populate message</span>
              </div>
              <div className="flex flex-wrap gap-2 font-serif">
                <button
                  type="button"
                  onClick={() => handleApplyTemplate('venue')}
                  className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer font-serif shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  <span>Venue & Lab Allotment Update</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyTemplate('problems')}
                  className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer font-serif shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Problem Statements Release</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyTemplate('schedule')}
                  className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer font-serif shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5 text-[#8B7CB6]" />
                  <span>Schedule / Timing Shift</span>
                </button>
              </div>
            </div>

            {/* Subject Input */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5 font-serif">
                Broadcast Subject Line *
              </label>
              <input
                type="text"
                required
                value={broadcastSubject}
                onChange={(e) => setBroadcastSubject(e.target.value)}
                placeholder="e.g. Mandatory Reporting Protocol & Lab Allotment Notice"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] focus:bg-white font-serif"
              />
            </div>

            {/* Message Body Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1.5 font-serif">
                <label className="text-xs font-semibold text-stone-700 font-serif">
                  Broadcast Message Body *
                </label>
                <span className="text-[11px] text-stone-500 font-mono">
                  {broadcastMessage.length} characters
                </span>
              </div>
              <textarea
                rows={4}
                required
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Write message to all verified ticket holders. You can include links, venue rules, or problem statement links..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] focus:bg-white font-serif"
              />
            </div>

            {/* "Add to Google Calendar" Sync Toggle */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4 font-serif">
              <div className="flex items-center gap-3 font-serif">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center border border-purple-200 shrink-0">
                  <CalendarPlus className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 font-serif">
                    Include "Add to Google Calendar" Sync Link
                  </h4>
                  <p className="text-[11px] text-stone-500 font-serif">
                    Automatically attaches dynamic .ics and Google Calendar 1-click sync link in the dispatch payload.
                  </p>
                </div>
              </div>

              <input
                type="checkbox"
                id="calSyncCheck"
                checked={includeCalendarSync}
                onChange={(e) => setIncludeCalendarSync(e.target.checked)}
                className="w-4 h-4 rounded text-[#8B7CB6] focus:ring-[#8B7CB6] cursor-pointer"
              />
            </div>

            {/* Send Broadcast CTA Button */}
            <button
              type="submit"
              disabled={isSendingBroadcast || !broadcastMessage.trim()}
              className="w-full bg-[#8B7CB6] hover:bg-[#7C6BA6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm py-3.5 rounded-2xl transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] font-serif"
            >
              {isSendingBroadcast ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Dispatching Multi-Channel Alert to {audienceCount} Students...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Broadcast Now ({audienceCount} Recipients)</span>
                </>
              )}
            </button>

          </form>
        </section>

      </main>

      {/* ======================================================== */}
      {/* ATTENDEE ROSTER MODAL (PRN Roster, Verification, CSV) */}
      {/* ======================================================== */}
      {selectedRosterEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden font-serif">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 font-serif">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center border border-purple-200">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    {selectedRosterEvent.title} — Verified Student Roster
                  </h3>
                  <p className="text-xs text-stone-500 font-serif">
                    {selectedRosterEvent.registeredCount} Confirmed Attendees • Venue: {selectedRosterEvent.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-serif">
                <button
                  onClick={() => handleExportCSV(selectedRosterEvent)}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7C6BA6] text-xs font-semibold flex items-center gap-1.5 cursor-pointer font-serif"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
                
                <button
                  onClick={() => setActiveRosterEventId(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Filter Strip */}
            <div className="px-5 py-3 bg-white border-b border-stone-200 flex items-center gap-2.5 font-serif">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                value={attendeeSearchQuery}
                onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                placeholder="Search by student name, college email, or ID..."
                className="w-full bg-transparent text-xs text-stone-900 placeholder-stone-400 focus:outline-none font-serif"
              />
              {attendeeSearchQuery && (
                <button
                  onClick={() => setAttendeeSearchQuery('')}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Attendee Roster Table */}
            <div className="overflow-y-auto flex-1 p-5 font-serif">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">College & Department</th>
                    <th className="py-2.5 px-3">Pass Code</th>
                    <th className="py-2.5 px-3 text-right">Gate Check-In State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {defaultAttendees
                    .filter(att => {
                      const q = attendeeSearchQuery.toLowerCase();
                      return (
                        att.name.toLowerCase().includes(q) ||
                        att.email.toLowerCase().includes(q) ||
                        att.department?.toLowerCase().includes(q) ||
                        att.college?.toLowerCase().includes(q) ||
                        att.ticketId?.toLowerCase().includes(q)
                      );
                    })
                    .map((att) => {
                      const isChecked = checkedInAttendees[att.id] || false;
                      return (
                        <tr key={att.id} className="hover:bg-stone-50 transition-colors font-serif">
                          <td className="py-3 px-3">
                            <span className="font-bold text-stone-900 block font-serif">{att.name}</span>
                            <span className="text-[11px] text-stone-500 font-serif">{att.email}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-stone-800 block font-serif">{att.college}</span>
                            <span className="text-[11px] text-stone-500 font-serif">{att.department}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="font-mono text-[#7C6BA6] bg-purple-50 px-2 py-0.5 rounded border border-purple-200 text-[11px]">
                              {att.ticketId}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-serif">
                            <button
                              onClick={() => handleToggleAttendeeCheckIn(att.id)}
                              className={`px-3 py-1 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer font-serif ${
                                isChecked
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-[#8B7CB6] hover:text-white'
                              }`}
                            >
                              {isChecked ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Admitted</span>
                                </>
                              ) : (
                                <>
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span>Verify & Check In</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between font-serif">
              <span className="text-xs text-stone-500 font-serif">
                Total Admitted: {Object.values(checkedInAttendees).filter(Boolean).length} / {defaultAttendees.length}
              </span>
              <button
                onClick={() => setActiveRosterEventId(null)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold cursor-pointer font-serif"
              >
                Close Roster
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

