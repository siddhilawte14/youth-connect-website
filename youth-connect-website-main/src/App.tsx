import React, { useState, useEffect } from 'react';
import { 
  Role, 
  EventItem, 
  EventAttendee,
  DigitalPass, 
  CommunityClub, 
  CommunityUpdate, 
  AuditLog,
  UserProfile,
  CampusNavTab
} from './types';
import { 
  MOCK_EVENTS, 
  MOCK_PASSES, 
  MOCK_CLUBS, 
  MOCK_UPDATES, 
  MOCK_ORGANIZER_STATS, 
  MOCK_AUDIT_LOGS 
} from './data/mockData';

// View & Page Components
import { LandingHeroView } from './components/LandingHeroView';
import { ExplorePage } from './pages/student/ExplorePage';
import { StudentDashboardView } from './components/StudentDashboardView';
import { OrganizerDashboardView } from './components/OrganizerDashboardView';
import { CommunitiesView } from './components/CommunitiesView';
import { MyEventsView } from './components/MyEventsView';
import { OrganizerLoginPage } from './pages/auth/OrganizerLoginPage';
import { AdminPortalView } from './components/AdminPortalView';

// Navigation & Layout Components
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LocationModal } from './components/LocationModal';
import { SearchModal } from './components/SearchModal';
import { DistrictAuthModal } from './components/DistrictAuthModal';
import { YouthConnectLogo } from './components/YouthConnectLogo';

// Modals
import { CreateEventModal } from './components/CreateEventModal';
import { GateScannerModal } from './components/GateScannerModal';
import { PassDetailModal } from './components/PassDetailModal';
import { EventDetailModal } from './components/EventDetailModal';
import { BroadcastModal } from './components/BroadcastModal';
import { QuickRegisterModal } from './components/QuickRegisterModal';
import { FluidBackground } from './components/FluidBackground';

// Icons
import { 
  Compass, 
  LayoutDashboard, 
  Building2, 
  GraduationCap, 
  Lock, 
  Sparkles, 
  Ticket, 
  PlusCircle, 
  QrCode, 
  Radio, 
  LogOut,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type CurrentPage = 'landing' | 'explore' | 'student_dashboard' | 'organizer_dashboard' | 'communities' | 'my_passes';

export default function App() {
  // 1. Unified State-Driven Routing Machine
  const [currentPage, setCurrentPage] = useState<CurrentPage>(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'explore' || hash === 'student_dashboard' || hash === 'organizer_dashboard' || hash === 'landing') {
      return hash as CurrentPage;
    }
    return 'landing';
  });

  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('youthconnect_role') as Role) || 'student';
  });

  const [districtTab, setDistrictTab] = useState<CampusNavTab>('Explore');
  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    return localStorage.getItem('youthconnect_location') || 'Nashik';
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('youthconnect_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null; // Public open access by default
  });

  // Core Mock Datastores with LocalStorage Persistence
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('youthconnect_events');
    if (!saved) return MOCK_EVENTS;
    try {
      const parsed: EventItem[] = JSON.parse(saved);
      const savedIds = new Set(parsed.map(e => e.id));
      const missing = MOCK_EVENTS.filter(e => !savedIds.has(e.id));
      return missing.length > 0 ? [...parsed, ...missing] : parsed;
    } catch {
      return MOCK_EVENTS;
    }
  });

  const [passes, setPasses] = useState<Record<string, DigitalPass>>(() => {
    const saved = localStorage.getItem('youthconnect_passes');
    return saved ? JSON.parse(saved) : MOCK_PASSES;
  });

  const [clubs, setClubs] = useState<CommunityClub[]>(() => {
    const saved = localStorage.getItem('youthconnect_clubs');
    return saved ? JSON.parse(saved) : MOCK_CLUBS;
  });

  const [updates, setUpdates] = useState<CommunityUpdate[]>(() => {
    const saved = localStorage.getItem('youthconnect_updates');
    return saved ? JSON.parse(saved) : MOCK_UPDATES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('youthconnect_audit_logs');
    return saved ? JSON.parse(saved) : MOCK_AUDIT_LOGS;
  });

  // Modals & Overlay States
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<'student' | 'organizer'>('student');
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [selectedPassForDetail, setSelectedPassForDetail] = useState<DigitalPass | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [quickRegisterEvent, setQuickRegisterEvent] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Sync route state to URL hash for deep linking
  const navigateToPage = (page: CurrentPage) => {
    setCurrentPage(page);
    try {
      window.location.hash = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      // safe fallback
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'explore', 'student_dashboard', 'organizer_dashboard', 'communities', 'my_passes'].includes(hash)) {
        setCurrentPage(hash as CurrentPage);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('youthconnect_role', role);
  }, [role]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('youthconnect_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('youthconnect_user_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('youthconnect_location', currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem('youthconnect_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('youthconnect_passes', JSON.stringify(passes));
  }, [passes]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleOpenStudentLogin = () => {
    setAuthDefaultRole('student');
    setIsAuthModalOpen(true);
  };

  const handleOpenOrganizerLogin = () => {
    if (userProfile?.isLoggedIn && userProfile.role === 'student') {
      showToast('Please Log Out of your Student session first to access the Organizer Passkey Gate.');
      return;
    }
    setAuthDefaultRole('organizer');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setRole(profile.role);
    setIsAuthModalOpen(false);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#7C3AED', '#6D28D9', '#8B5CF6', '#10B981']
      });
    } catch (e) {
      // fallback
    }

    if (profile.role === 'organizer') {
      showToast(`Welcome to Organizer Hub, ${profile.name}!`);
      navigateToPage('organizer_dashboard');
    } else {
      showToast(`Welcome back, ${profile.name}!`);
      navigateToPage('student_dashboard');
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setRole('student');
    showToast('Signed out successfully.');
    navigateToPage('landing');
  };

  // Action-Triggered Registration Flow
  const handleSelectEventForRegistration = (event: EventItem) => {
    setQuickRegisterEvent(event);
  };

  const handleQuickRegisterConfirm = (
    event: EventItem, 
    studentData: { name: string; email: string; prn?: string; college: string; department: string; }
  ) => {
    const effectivePrn = studentData.prn || userProfile?.prn || userProfile?.studentId || '22BCE104';
    const ticketId = `YC-2026-TK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPass: DigitalPass = {
      ticketId: ticketId,
      eventId: event.id,
      eventTitle: event.title,
      category: event.category || 'Workshop',
      venue: event.venue,
      labAllotment: event.category === 'Hackathon' 
        ? 'CS Lab 304 & Auditorium Terminal Hub' 
        : event.category === 'Workshop' 
        ? 'Lab 204 (CS Wing)' 
        : 'Main Stage / Open Arena Gate 1',
      collegeName: studentData.college || userProfile?.college || 'MET Bhujbal Knowledge City, Adgaon, Nashik',
      date: event.date.fullDate || `${event.date.month} ${event.date.day}, 2026`,
      time: event.date.time?.split('-')[0]?.trim() || '09:00 AM',
      reportingTime: `${event.date.time?.split('-')[0]?.trim() || '09:00 AM'} (Gate 1 Reporting)`,
      tier: event.fee > 0 ? 'VIP ACCESS PASS' : 'STUDENT CONFIRMED PASS',
      attendeeName: studentData.name,
      collegeId: effectivePrn,
      studentPrn: effectivePrn,
      studentEmail: studentData.email,
      department: studentData.department || 'Computer Engineering',
      status: 'Valid',
      amountPaid: event.fee,
      issuedAt: new Date().toISOString(),
      hash: `PASS-2026-${event.id}-${effectivePrn}`,
    };

    setPasses((prev) => ({
      ...prev,
      [ticketId]: newPass,
    }));

    const newAttendee: EventAttendee = {
      id: `att-${Date.now()}`,
      name: studentData.name,
      email: studentData.email,
      timestamp: 'Just now',
      college: studentData.college || 'MET Bhujbal Knowledge City, Adgaon, Nashik',
      department: studentData.department || 'Computer Engineering',
      ticketId: ticketId,
      role: 'Standard Attendee',
    };

    setEvents((prev) =>
      prev.map((e) =>
        e.id === event.id
          ? {
              ...e,
              isRegistered: true,
              registeredCount: (e.attendees ? e.attendees.length : e.registeredCount) + 1,
              ticketId: ticketId,
              attendees: [newAttendee, ...(e.attendees || [])],
            }
          : e
      )
    );

    // Update active student profile or create if not logged in
    if (userProfile) {
      setUserProfile((prev) => prev ? {
        ...prev,
        myPasses: [...(prev.myPasses || []), ticketId],
      } : null);
    } else {
      const generatedProfile: UserProfile = {
        id: `usr-std-${Date.now()}`,
        name: studentData.name,
        email: studentData.email,
        role: 'student',
        college: studentData.college,
        department: studentData.department,
        studentId: effectivePrn,
        prn: effectivePrn,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isLoggedIn: true,
        myPasses: [ticketId],
      };
      setUserProfile(generatedProfile);
      setRole('student');
    }

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: `Ticket Issued: ${ticketId} (${studentData.name})`,
      actor: studentData.name,
      target: event.title,
      timestamp: 'Just now',
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    setQuickRegisterEvent(null);
    showToast(`🎉 Pass ${ticketId} issued and linked to PRN ${effectivePrn}!`);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7C6BA6', '#8B7CB6', '#10B981', '#F59E0B']
      });
    } catch (e) {
      // fallback
    }

    // Direct transition to Student Dashboard
    setTimeout(() => {
      navigateToPage('student_dashboard');
    }, 400);
  };

  const handleCreateEvent = (newEvent: EventItem) => {
    setEvents((prev) => [newEvent, ...prev]);
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: `Event Created: ${newEvent.title}`,
      actor: newEvent.organizer.name,
      target: newEvent.venue,
      timestamp: 'Just now',
      status: 'Info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Event "${newEvent.title}" published to campus feed!`);
    setIsCreateEventOpen(false);
  };

  const handleRedeemPass = (ticketId: string) => {
    const targetPass = passes[ticketId];
    if (!targetPass) {
      showToast('Error: Pass ID not found in registry');
      return;
    }
    if (targetPass.status === 'Redeemed') {
      showToast(`Warning: Ticket ${ticketId} has ALREADY been redeemed!`);
      return;
    }

    setPasses((prev) => ({
      ...prev,
      [ticketId]: {
        ...targetPass,
        status: 'Redeemed',
        redeemedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    }));

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: `QR Pass Check-in Redeemed: ${ticketId}`,
      actor: userProfile?.name || 'Gate Scanner',
      target: targetPass.attendeeName,
      timestamp: 'Just now',
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Pass ${ticketId} verified! Gate check-in complete.`);
  };

  const handleSendBroadcast = (broadcast: {
    eventId: string;
    channel: string;
    subject: string;
    message: string;
    recipientCount: number;
  }) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: `Broadcast Dispatched: ${broadcast.subject}`,
      actor: userProfile?.name || 'Campus Organizer',
      target: `${broadcast.recipientCount} Attendees`,
      timestamp: 'Just now',
      status: 'Info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Broadcast delivered to ${broadcast.recipientCount} registered attendees!`);
    setIsBroadcastOpen(false);
  };

  const handleToggleSaveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isSaved: !e.isSaved } : e))
    );
    const ev = events.find((e) => e.id === eventId);
    showToast(ev?.isSaved ? 'Removed from saved events' : 'Saved to your bookmarks');
  };

  const registeredPassList: DigitalPass[] = Object.values(passes);

  return (
    <div className="min-h-screen relative bg-transparent text-stone-900 flex flex-col font-serif selection:bg-[#8B7CB6]/30 selection:text-[#6D5C96]">
      {/* Global Interactive Pastel Fluid Canvas Background */}
      <FluidBackground />
      
      {/* Top Navbar & Role Switcher (Hidden in Dedicated Organizer Command Center) */}
      {!(currentPage === 'organizer_dashboard' && userProfile?.role === 'organizer') && (
        <Header
          currentPage={currentPage}
          currentLocation={currentLocation}
          onOpenLocationModal={() => setIsLocationModalOpen(true)}
          onOpenSearchModal={() => setIsSearchModalOpen(true)}
          onOpenAuthModal={(_evt, defaultRole) => {
            setAuthDefaultRole(defaultRole || 'student');
            setIsAuthModalOpen(true);
          }}
          userProfile={userProfile}
          onLogout={handleLogout}
          registeredPassesCount={registeredPassList.length}
          activeDistrictTab={districtTab}
          onSelectDistrictTab={(tab) => {
            setDistrictTab(tab);
            navigateToPage('explore');
          }}
          onNavigateHome={() => navigateToPage('landing')}
          onNavigateToPage={(page) => navigateToPage(page)}
        />
      )}

      {/* Main View Router */}
      <main className={`flex-1 w-full ${!(currentPage === 'organizer_dashboard' && userProfile?.role === 'organizer') ? 'pt-16 md:pt-20' : ''}`}>
        
        {/* ======================================================== */}
        {/* PAGE 1: LANDING & VALUE PROPOSITION (currentPage === 'landing') */}
        {/* ======================================================== */}
        {currentPage === 'landing' && (
          <LandingHeroView
            onExploreEvents={() => navigateToPage('explore')}
            onOpenStudentLogin={handleOpenStudentLogin}
            onOpenOrganizerLogin={handleOpenOrganizerLogin}
            featuredEvents={events.filter((e) => e.status === 'Published')}
            onSelectEvent={(evt) => {
              setSelectedEventForDetail(evt);
            }}
          />
        )}

        {/* ======================================================== */}
        {/* PAGE 2: PUBLIC EVENT DISCOVERY FEED (currentPage === 'explore') */}
        {/* ======================================================== */}
        {currentPage === 'explore' && (
          <div className="w-full">
            <ExplorePage
              events={events}
              clubs={clubs}
              currentLocation={currentLocation}
              onOpenLocationModal={() => setIsLocationModalOpen(true)}
              searchQuery={globalSearchQuery}
              setSearchQuery={setGlobalSearchQuery}
              activeDistrictTab={districtTab}
              onSelectDistrictTab={(tab) => setDistrictTab(tab)}
              onSelectEvent={handleSelectEventForRegistration}
              onViewEventDetail={(evt) => setSelectedEventForDetail(evt)}
              onToggleSave={handleToggleSaveEvent}
              onOpenCommunities={() => navigateToPage('communities')}
              onViewTicket={(ticketId) => {
                const pass = passes[ticketId] || registeredPassList.find(p => p.ticketId === ticketId);
                if (pass) setSelectedPassForDetail(pass);
              }}
              onOpenAuthModal={(targetEvent) => {
                if (targetEvent) {
                  handleSelectEventForRegistration(targetEvent);
                } else {
                  handleOpenStudentLogin();
                }
              }}
            />
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 3: ROLE-RESTRICTED STUDENT DASHBOARD (currentPage === 'student_dashboard') */}
        {/* ======================================================== */}
        {currentPage === 'student_dashboard' && (
          <div className="w-full py-4">
            {userProfile && userProfile.role === 'student' ? (
              <StudentDashboardView
                events={events}
                passes={registeredPassList}
                clubs={clubs}
                updates={updates}
                userProfile={userProfile}
                onSelectEvent={handleSelectEventForRegistration}
                onViewPassModal={(pass) => setSelectedPassForDetail(pass)}
                onViewEventDetail={(evt) => setSelectedEventForDetail(evt)}
                onBrowseMoreEvents={() => navigateToPage('explore')}
                onLogout={handleLogout}
                onToggleSave={handleToggleSaveEvent}
              />
            ) : (
              /* Access Guard for Student Dashboard */
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50 text-center font-serif">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-[#8B7CB6] flex items-center justify-center mx-auto mb-4 p-2 shadow-xs">
                  <YouthConnectLogo className="w-full h-full text-[#8B7CB6]" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">
                  Student Portal Access
                </h3>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  Sign in with your verified college email to view your digital entry passes, track volunteering social credits, and manage event registrations.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleOpenStudentLogin}
                    className="w-full bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-900/10 active:scale-95 cursor-pointer font-serif"
                  >
                    Sign In with College Credentials
                  </button>
                  <button
                    onClick={() => navigateToPage('explore')}
                    className="w-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer font-serif"
                  >
                    ← Browse Public Events
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGE 4: ROLE-RESTRICTED ORGANIZER HUB (currentPage === 'organizer_dashboard') */}
        {/* ======================================================== */}
        {currentPage === 'organizer_dashboard' && (
          <div className="w-full">
            {userProfile && userProfile.role === 'organizer' ? (
              <OrganizerDashboardView
                events={events}
                stats={MOCK_ORGANIZER_STATS}
                onOpenCreateEvent={() => setIsCreateEventOpen(true)}
                onOpenGateScanner={() => setIsGateScannerOpen(true)}
                onOpenBroadcastModal={() => setIsBroadcastOpen(true)}
                onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
                onNavigateToStudentExplore={() => navigateToPage('explore')}
                onLogout={handleLogout}
              />
            ) : (
              /* Organizer Passkey Gate Guard */
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50 text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center mx-auto mb-4 border border-purple-200/60 shadow-xs">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-serif mb-2">
                  Organizer Passkey Gate
                </h3>
                <p className="text-xs text-stone-600 mb-6 leading-relaxed">
                  The Organizer Hub is restricted to verified campus leads, collegiate technical councils, and registered NGO coordinators.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleOpenOrganizerLogin}
                    className="w-full bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md shadow-purple-900/10 active:scale-95 cursor-pointer flex items-center justify-center gap-2 font-serif"
                  >
                    <Building2 className="w-4 h-4 text-purple-100" />
                    <span>Enter Organizer Credentials</span>
                  </button>
                  <button
                    onClick={() => navigateToPage('explore')}
                    className="w-full bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200 font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer font-serif"
                  >
                    ← Return to Public Explore
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Communities Sub-view */}
        {currentPage === 'communities' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <CommunitiesView
              clubs={clubs}
              updates={updates}
              events={events}
              onSelectEvent={handleSelectEventForRegistration}
              onJoinClub={(clubId) => {
                const c = clubs.find(cl => cl.id === clubId);
                showToast(`Joined ${c?.name || 'Club'} campus circle!`);
              }}
              onPostUpdate={(text, clubName) => {
                const newUp: CommunityUpdate = {
                  id: `up-${Date.now()}`,
                  clubName,
                  clubIcon: '🚀',
                  clubColor: 'bg-[#8B7CB6]',
                  text,
                  timeAgo: 'Just now'
                };
                setUpdates((prev) => [newUp, ...prev]);
                showToast('Update shared with campus network.');
              }}
            />
          </div>
        )}

        {/* My Passes Sub-view */}
        {currentPage === 'my_passes' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {userProfile ? (
              <MyEventsView
                events={events}
                passes={registeredPassList}
                savedEvents={events.filter((e) => e.isSaved)}
                onViewPassModal={(pass) => setSelectedPassForDetail(pass)}
                onViewTicket={(ticketId) => {
                  const pass = passes[ticketId] || registeredPassList.find(p => p.ticketId === ticketId);
                  if (pass) setSelectedPassForDetail(pass);
                }}
                onExploreEvents={() => navigateToPage('explore')}
                onSelectEvent={handleSelectEventForRegistration}
                onViewEventDetail={(evt) => setSelectedEventForDetail(evt)}
                onToggleSave={handleToggleSaveEvent}
              />
            ) : (
              <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-stone-200 shadow-xl shadow-stone-200/50 text-center">
                <Ticket className="w-12 h-12 text-[#8B7CB6] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-serif">My Digital Passes</h3>
                <p className="text-xs text-stone-600 mb-6">Sign in to view your QR passes and event entries.</p>
                <button
                  onClick={handleOpenStudentLogin}
                  className="px-6 py-2.5 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-bold shadow-md shadow-purple-900/10 cursor-pointer font-serif"
                >
                  Student Sign In
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Dialogs */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          showToast(`Campus hub set to ${loc}`);
        }}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        events={events}
        clubs={clubs}
        onSelectEvent={(evt) => {
          setIsSearchModalOpen(false);
          setSelectedEventForDetail(evt);
        }}
        onSelectCategory={(_cat) => {
          setIsSearchModalOpen(false);
          navigateToPage('explore');
        }}
        onSelectClub={(_club) => {
          setIsSearchModalOpen(false);
          navigateToPage('communities');
        }}
      />

      <DistrictAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthSuccess}
        defaultRole={authDefaultRole}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onCreateEvent={handleCreateEvent}
      />

      <GateScannerModal
        isOpen={isGateScannerOpen}
        onClose={() => setIsGateScannerOpen(false)}
        passes={passes}
        onRedeemPass={handleRedeemPass}
      />

      <PassDetailModal
        isOpen={!!selectedPassForDetail}
        onClose={() => setSelectedPassForDetail(null)}
        pass={selectedPassForDetail}
      />

      <EventDetailModal
        isOpen={!!selectedEventForDetail}
        onClose={() => setSelectedEventForDetail(null)}
        event={selectedEventForDetail}
        onRegisterClick={handleSelectEventForRegistration}
        onToggleSave={handleToggleSaveEvent}
        onViewTicket={(ticketId) => {
          setSelectedEventForDetail(null);
          const pass = passes[ticketId];
          if (pass) setSelectedPassForDetail(pass);
        }}
      />

      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        events={events}
        onSendBroadcast={handleSendBroadcast}
      />

      <QuickRegisterModal
        isOpen={!!quickRegisterEvent}
        onClose={() => setQuickRegisterEvent(null)}
        event={quickRegisterEvent}
        userProfile={userProfile}
        onConfirmRegistration={handleQuickRegisterConfirm}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 font-serif">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
