import React, { useState, useEffect } from 'react';
import { 
  Role, 
  EventItem, 
  DigitalPass, 
  CommunityClub, 
  CommunityUpdate, 
  AuditLog,
  UserProfile
} from './types';
import { 
  MOCK_EVENTS, 
  MOCK_PASSES, 
  MOCK_CLUBS, 
  MOCK_UPDATES, 
  MOCK_ORGANIZER_STATS, 
  MOCK_AUDIT_LOGS 
} from './data/mockData';

// Layouts & Views
import { StudentLayout } from './layouts/StudentLayout';
import { StudentHomeView } from './components/StudentHomeView';
import { CommunitiesView } from './components/CommunitiesView';
import { MyEventsView } from './components/MyEventsView';
import { StudentDashboardView } from './components/StudentDashboardView';
import { RegistrationFlowView } from './components/RegistrationFlowView';
import { OrganizerDashboardView } from './components/OrganizerDashboardView';
import { AdminPortalView } from './components/AdminPortalView';
import { LoginPortalView } from './components/LoginPortalView';
import { OrganizerLoginPage } from './pages/auth/OrganizerLoginPage';

// Modals
import { CreateEventModal } from './components/CreateEventModal';
import { GateScannerModal } from './components/GateScannerModal';
import { PassDetailModal } from './components/PassDetailModal';
import { EventDetailModal } from './components/EventDetailModal';
import { BroadcastModal } from './components/BroadcastModal';

// Icons for Organizer Shell
import { 
  LayoutDashboard, 
  PlusCircle, 
  QrCode, 
  Radio, 
  LogOut, 
  Compass, 
  ShieldCheck, 
  ArrowLeft,
  Lock
} from 'lucide-react';

export default function App() {
  // 1. Current Route & Role State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem('nashik_user_role') as Role) || 'student';
  });

  const [studentTab, setStudentTab] = useState<'explore' | 'communities' | 'my_tickets' | 'profile'>('explore');

  const [currentLocation, setCurrentLocation] = useState<string>(() => {
    return localStorage.getItem('nashik_location') || 'Nashik';
  });

  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nashik_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return null; // Default to unauthenticated guest browsing
  });

  const [targetLoginRole, setTargetLoginRole] = useState<Role>('student');
  const [authRedirectPath, setAuthRedirectPath] = useState<string | null>(null);

  // Core Data
  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('nashik_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });

  const [passes, setPasses] = useState<Record<string, DigitalPass>>(() => {
    const saved = localStorage.getItem('nashik_passes');
    return saved ? JSON.parse(saved) : MOCK_PASSES;
  });

  const [clubs, setClubs] = useState<CommunityClub[]>(() => {
    const saved = localStorage.getItem('nashik_clubs');
    return saved ? JSON.parse(saved) : MOCK_CLUBS;
  });

  const [updates, setUpdates] = useState<CommunityUpdate[]>(() => {
    const saved = localStorage.getItem('nashik_updates');
    return saved ? JSON.parse(saved) : MOCK_UPDATES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('nashik_audit_logs');
    return saved ? JSON.parse(saved) : MOCK_AUDIT_LOGS;
  });

  // Modal States
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isGateScannerOpen, setIsGateScannerOpen] = useState(false);
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [selectedPassForDetail, setSelectedPassForDetail] = useState<DigitalPass | null>(null);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [selectedEventForReg, setSelectedEventForReg] = useState<EventItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Sync route navigation to window.history
  const navigateTo = (path: string) => {
    try {
      window.history.pushState({}, '', path);
    } catch (e) {
      // safe fallback in sandboxes
    }
    setCurrentPath(path);
  };

  // Browser back/forward navigation & deep-linking support
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      resolvePathState(path);
    };

    const resolvePathState = (path: string) => {
      if (path.startsWith('/events/')) {
        const eventId = path.replace('/events/', '');
        const ev = events.find(e => e.id === eventId);
        if (ev) {
          setSelectedEventForDetail(ev);
        }
      } else if (path.startsWith('/register/')) {
        const eventId = path.replace('/register/', '');
        const ev = events.find(e => e.id === eventId);
        if (ev) {
          setSelectedEventForReg(ev);
        }
      } else if (path === '/communities') {
        setStudentTab('communities');
      } else if (path === '/explore' || path === '/') {
        setStudentTab('explore');
      }
    };

    resolvePathState(currentPath);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('nashik_user_role', role);
  }, [role]);

  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('nashik_user_profile', JSON.stringify(userProfile));
    } else {
      localStorage.removeItem('nashik_user_profile');
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('nashik_location', currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    localStorage.setItem('nashik_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('nashik_passes', JSON.stringify(passes));
  }, [passes]);

  useEffect(() => {
    localStorage.setItem('nashik_clubs', JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem('nashik_updates', JSON.stringify(updates));
  }, [updates]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth Handlers
  const handleOpenLoginPortal = (targetRole?: Role, redirectUrl?: string) => {
    setTargetLoginRole(targetRole || 'student');
    if (redirectUrl) {
      setAuthRedirectPath(redirectUrl);
    }
    navigateTo('/login');
  };

  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    setRole(profile.role);
    showToast(`Welcome, ${profile.name}! Signed in as ${profile.role.toUpperCase()}`);

    if (profile.role === 'organizer') {
      navigateTo('/organizer/dashboard');
    } else if (profile.role === 'admin') {
      navigateTo('/admin/portal');
    } else {
      if (authRedirectPath) {
        const dest = authRedirectPath;
        setAuthRedirectPath(null);
        navigateTo(dest);
        if (dest.startsWith('/register/')) {
          const eventId = dest.replace('/register/', '');
          const ev = events.find(e => e.id === eventId);
          if (ev) setSelectedEventForReg(ev);
        }
      } else {
        navigateTo('/explore');
        setStudentTab('explore');
      }
    }
  };

  const handleLogout = () => {
    setUserProfile(null);
    setRole('student');
    navigateTo('/explore');
    setStudentTab('explore');
    showToast('Signed out successfully.');
  };

  // Event Registration with Contextual Authentication Check
  const handleSelectEventForRegistration = (event: EventItem) => {
    if (!userProfile) {
      showToast('Please sign in to register for passes & claim tickets.');
      setSelectedEventForReg(event);
      handleOpenLoginPortal('student', `/register/${event.id}`);
      return;
    }
    setSelectedEventForReg(event);
    navigateTo(`/register/${event.id}`);
  };

  // Open-Access Event Detail Modal
  const handleSelectEventForDetail = (event: EventItem) => {
    setSelectedEventForDetail(event);
    navigateTo(`/events/${event.id}`);
  };

  // Toggle Save with Authentication Check
  const handleToggleSaveEvent = (eventId: string) => {
    if (!userProfile) {
      showToast('Please sign in to save and bookmark events.');
      handleOpenLoginPortal('student', currentPath);
      return;
    }
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isSaved: !e.isSaved } : e))
    );
    const ev = events.find((e) => e.id === eventId);
    showToast(ev?.isSaved ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleCompleteRegistration = (newPass: DigitalPass) => {
    setPasses((prev) => ({
      ...prev,
      [newPass.ticketId]: newPass,
    }));

    setEvents((prev) =>
      prev.map((e) =>
        e.id === newPass.eventId
          ? {
              ...e,
              isRegistered: true,
              registeredCount: e.registeredCount + 1,
              ticketId: newPass.ticketId,
            }
          : e
      )
    );

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action: `Ticket Issued: ${newPass.ticketId}`,
      actor: newPass.attendeeName,
      target: newPass.eventTitle,
      timestamp: 'Just now',
      status: 'Success',
    };
    setAuditLogs((prev) => [newLog, ...prev]);

    showToast(`🎉 Registration Confirmed! Ticket ${newPass.ticketId} issued.`);
    setStudentTab('my_tickets');
    navigateTo('/explore');
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
    showToast(`Event "${newEvent.title}" listed successfully!`);
    setIsCreateEventOpen(false);
  };

  const handleRedeemPass = (ticketId: string) => {
    const targetPass = passes[ticketId];
    if (!targetPass) {
      showToast('Error: Pass ID not found in database');
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
    showToast(`Pass ${ticketId} redeemed! Check-in verified.`);
  };

  const handleJoinClub = (clubId: string) => {
    if (!userProfile) {
      showToast('Please sign in to join student circles.');
      handleOpenLoginPortal('student', '/communities');
      return;
    }
    const club = clubs.find((c) => c.id === clubId);
    showToast(`Joined ${club?.name || 'Club'} community!`);
  };

  const handlePostUpdate = (text: string, clubName: string) => {
    const newUpdate: CommunityUpdate = {
      id: `up-${Date.now()}`,
      clubName,
      clubIcon: '🚀',
      clubColor: 'bg-blue-600',
      text,
      timeAgo: 'Just now'
    };
    setUpdates((prev) => [newUpdate, ...prev]);
    showToast('Community update posted.');
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
      actor: userProfile?.name || 'Event Organizer',
      target: `${broadcast.recipientCount} Attendees`,
      timestamp: 'Just now',
      status: 'Info',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Broadcast sent to ${broadcast.recipientCount} attendees!`);
    setIsBroadcastOpen(false);
  };

  const registeredPassList: DigitalPass[] = Object.values(passes);

  // ==========================================
  // ROUTE RESOLUTION
  // ==========================================
  const isOrganizerRoute = currentPath.startsWith('/organizer');
  const isOrganizerLoginRoute = currentPath === '/organizer/login';
  const isAdminRoute = currentPath.startsWith('/admin');
  const isLoginRoute = currentPath.startsWith('/login');
  const isRegisterRoute = currentPath.startsWith('/register');

  // Strict Organizer Route Guard
  const isOrganizerAuthorized = role === 'organizer' && userProfile?.role === 'organizer';

  return (
    <>
      {/* 0. DEDICATED ORGANIZER LOGIN ROUTE */}
      {isOrganizerLoginRoute && (
        <OrganizerLoginPage
          onSuccessRedirect={(path) => {
            const orgProfile: UserProfile = {
              id: `org_${Date.now()}`,
              name: 'TechSprint Lead Organizer',
              email: 'organizers@techsprint2026.org',
              role: 'organizer',
              college: 'K. K. Wagh Institute of Engineering (KKWIEER)',
              department: 'Student Affairs & Technical Council',
              clubName: 'TechSprint & Collegiate Hackathons Council',
              avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
            };
            handleLoginSuccess(orgProfile);
            navigateTo(path);
          }}
          onNavigateToStudent={() => {
            navigateTo('/explore');
            setStudentTab('explore');
          }}
        />
      )}

      {/* 1. AUTH LOGIN PORTAL ROUTE */}
      {isLoginRoute && !isOrganizerLoginRoute && (
        <div className="min-h-screen bg-[#07080c] flex flex-col justify-center">
          <LoginPortalView
            initialRole={targetLoginRole}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => {
              navigateTo('/explore');
              setStudentTab('explore');
            }}
          />
        </div>
      )}

      {/* 2. REGISTRATION & CHECKOUT ROUTE */}
      {isRegisterRoute && (
        <div className="min-h-screen bg-[#fafbfd] text-[#0b1c30] flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => {
                navigateTo('/explore');
                setStudentTab('explore');
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0066ff] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Explore</span>
            </button>
            <span className="text-xs font-bold text-gray-500">Pass Registration</span>
          </div>

          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
            <RegistrationFlowView
              selectedEvent={selectedEventForReg}
              events={events}
              onCompleteRegistration={handleCompleteRegistration}
              onViewMyEvents={() => {
                setStudentTab('my_tickets');
                navigateTo('/explore');
              }}
              onBackToDiscovery={() => {
                navigateTo('/explore');
                setStudentTab('explore');
              }}
            />
          </div>
        </div>
      )}

      {/* 3. STRICTLY GUARDED ORGANIZER ROUTES (/organizer/*) */}
      {isOrganizerRoute && !isOrganizerLoginRoute && (
        <div className="min-h-screen bg-[#07080c] text-white flex flex-col">
          {!isOrganizerAuthorized ? (
            /* Protected Route Guard Fallback */
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#07080c]">
              <div className="max-w-md w-full bg-[#12141d] border border-red-500/30 rounded-3xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Organizer Access Required</h2>
                <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                  The Organizer Workspace (`{currentPath}`) is strictly restricted to verified club leads and event organizers.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      navigateTo('/organizer/login');
                    }}
                    className="w-full bg-[#0066ff] hover:bg-[#0055d6] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20"
                  >
                    Login as Organizer
                  </button>
                  <button
                    onClick={() => {
                      navigateTo('/explore');
                      setStudentTab('explore');
                    }}
                    className="w-full bg-white/10 hover:bg-white/15 text-gray-300 font-bold text-xs py-2.5 rounded-xl transition-all"
                  >
                    Return to Open Explore
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Authorized Organizer Management Workspace */
            <div className="flex-1 flex flex-col">
              {/* Organizer Top Workspace Bar */}
              <header className="bg-[#12141d]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0066ff] text-white flex items-center justify-center font-black text-xs">
                      ORG
                    </div>
                    <div>
                      <h1 className="text-sm font-bold text-white leading-tight">Organizer Hub</h1>
                      <p className="text-[10px] text-gray-400">{userProfile?.clubName || 'YouthConnect Organizer Chapter'}</p>
                    </div>
                  </div>

                  {/* Organizer Internal Navigation Links */}
                  <nav className="hidden lg:flex items-center gap-1 ml-6 border-l border-white/10 pl-6">
                    <button
                      onClick={() => navigateTo('/organizer/dashboard')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        currentPath === '/organizer/dashboard'
                          ? 'bg-[#0066ff] text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </button>

                    <button
                      onClick={() => setIsCreateEventOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Host Event</span>
                    </button>

                    <button
                      onClick={() => setIsGateScannerOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>QR Gate Scanner</span>
                    </button>

                    <button
                      onClick={() => setIsBroadcastOpen(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 text-gray-400 hover:text-white hover:bg-white/5"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Broadcasts</span>
                    </button>
                  </nav>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      navigateTo('/explore');
                      setStudentTab('explore');
                      showToast('Viewing Open Student Explore');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-200 font-bold border border-white/10 transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span className="hidden sm:inline">Open</span> Student View
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/50 text-red-400 border border-red-500/20 text-xs transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </header>

              {/* Organizer Content View */}
              <main className="flex-1 max-w-[1360px] w-full mx-auto px-4 sm:px-6 py-6">
                <OrganizerDashboardView
                  events={events}
                  stats={MOCK_ORGANIZER_STATS}
                  onOpenCreateEvent={() => setIsCreateEventOpen(true)}
                  onOpenGateScanner={() => setIsGateScannerOpen(true)}
                  onOpenBroadcastModal={() => setIsBroadcastOpen(true)}
                  onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
                />
              </main>
            </div>
          )}
        </div>
      )}

      {/* 4. PROTECTED ADMIN ROUTE (/admin/*) */}
      {isAdminRoute && (
        <div className="min-h-screen bg-[#fafbfd] text-[#0b1c30] flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0058be]" />
              <span className="font-bold text-sm">Super Admin Moderation Portal</span>
            </div>
            <button
              onClick={() => {
                navigateTo('/explore');
                setStudentTab('explore');
              }}
              className="text-xs font-bold text-[#0058be] hover:underline"
            >
              Exit to Student Portal
            </button>
          </div>
          <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6 flex-1 w-full">
            <AdminPortalView
              events={events}
              clubs={clubs}
              auditLogs={auditLogs}
              onApproveEvent={(id) => {
                setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'Published' } : e));
                showToast('Event Approved');
              }}
              onRejectEvent={(id) => {
                setEvents(prev => prev.map(e => e.id === id ? { ...e, status: 'Draft' } : e));
                showToast('Event Rejected');
              }}
              onToggleClubVerification={(id) => {
                setClubs(prev => prev.map(c => c.id === id ? { ...c, isVerified: !c.isVerified } : c));
                showToast('Club verification updated');
              }}
            />
          </div>
        </div>
      )}

      {/* 5. OPEN-ACCESS DISCOVERY & STUDENT CONSUMER ROUTE (Root `/`, `/explore`, `/communities`, `/events/:id`) */}
      {!isLoginRoute && !isRegisterRoute && !isOrganizerRoute && !isAdminRoute && (
        <StudentLayout
          currentTab={studentTab}
          setCurrentTab={(tab) => {
            setStudentTab(tab);
            if (tab === 'communities') {
              navigateTo('/communities');
            } else {
              navigateTo('/explore');
            }
          }}
          userProfile={userProfile}
          currentLocation={currentLocation}
          setCurrentLocation={(loc) => {
            setCurrentLocation(loc);
            showToast(`Location set to ${loc}`);
          }}
          events={events}
          clubs={clubs}
          passes={passes}
          onSelectEvent={handleSelectEventForRegistration}
          onOpenLoginPortal={handleOpenLoginPortal}
          onLogout={handleLogout}
        >
          {/* Student Sub-Views */}
          {studentTab === 'explore' && (
            <StudentHomeView
              events={events}
              clubs={clubs}
              currentLocation={currentLocation}
              searchQuery={globalSearchQuery}
              setSearchQuery={setGlobalSearchQuery}
              onSelectEvent={handleSelectEventForRegistration}
              onViewEventDetail={handleSelectEventForDetail}
              onToggleSave={handleToggleSaveEvent}
              onOpenCommunities={() => {
                setStudentTab('communities');
                navigateTo('/communities');
              }}
              onViewTicket={(ticketId) => {
                const pass = passes[ticketId];
                if (pass) setSelectedPassForDetail(pass);
              }}
            />
          )}

          {studentTab === 'communities' && (
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6">
              <CommunitiesView
                clubs={clubs}
                updates={updates}
                events={events}
                onSelectEvent={handleSelectEventForRegistration}
                onJoinClub={handleJoinClub}
                onPostUpdate={handlePostUpdate}
              />
            </div>
          )}

          {studentTab === 'my_tickets' && (
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6">
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
                  onExploreEvents={() => {
                    setStudentTab('explore');
                    navigateTo('/explore');
                  }}
                  onSelectEvent={handleSelectEventForRegistration}
                  onViewEventDetail={handleSelectEventForDetail}
                  onToggleSave={handleToggleSaveEvent}
                />
              ) : (
                <div className="p-12 text-center bg-[#12141d] rounded-3xl border border-white/10 my-8">
                  <h3 className="text-xl font-bold text-white mb-2">Sign In to View Passes</h3>
                  <p className="text-xs text-gray-400 mb-6">Your confirmed event passes and QR tickets are saved to your account.</p>
                  <button
                    onClick={() => handleOpenLoginPortal('student', '/explore')}
                    className="px-6 py-2.5 rounded-xl bg-[#0066ff] text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                  >
                    Sign In as Student
                  </button>
                </div>
              )}
            </div>
          )}

          {studentTab === 'profile' && (
            <div className="max-w-[1360px] mx-auto px-4 sm:px-6 py-6">
              {userProfile ? (
                <StudentDashboardView
                  events={events}
                  passes={registeredPassList}
                  clubs={clubs}
                  updates={updates}
                  onSelectEvent={handleSelectEventForRegistration}
                  onViewEventDetail={handleSelectEventForDetail}
                  onViewTicket={(ticketId) => {
                    const pass = passes[ticketId];
                    if (pass) setSelectedPassForDetail(pass);
                  }}
                  onToggleSave={handleToggleSaveEvent}
                  onExploreMore={() => {
                    setStudentTab('explore');
                    navigateTo('/explore');
                  }}
                  onOpenMyEvents={() => setStudentTab('my_tickets')}
                />
              ) : (
                <div className="p-12 text-center bg-[#12141d] rounded-3xl border border-white/10 my-8">
                  <h3 className="text-xl font-bold text-white mb-2">Student Account</h3>
                  <p className="text-xs text-gray-400 mb-6">Sign in with your PRN or student email to access campus activity.</p>
                  <button
                    onClick={() => handleOpenLoginPortal('student', '/explore')}
                    className="px-6 py-2.5 rounded-xl bg-[#0066ff] text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                  >
                    Sign In as Student
                  </button>
                </div>
              )}
            </div>
          )}
        </StudentLayout>
      )}

      {/* Global Modals */}
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
        onClose={() => {
          setSelectedEventForDetail(null);
          if (currentPath.startsWith('/events/')) {
            navigateTo('/explore');
          }
        }}
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

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-4 py-3 rounded-2xl shadow-2xl border border-blue-500/40 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
