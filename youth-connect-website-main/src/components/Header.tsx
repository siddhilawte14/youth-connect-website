import React, { useState, useEffect } from 'react';
import { MainTab, Role, UserProfile, CampusNavTab } from '../types';
import { YouthConnectLogo } from './YouthConnectLogo';
import { 
  MapPin, 
  Search, 
  ChevronDown, 
  User, 
  GraduationCap, 
  Ticket, 
  SlidersHorizontal,
  LogOut,
  LayoutDashboard,
  Building2,
  Lock,
  Sparkles,
  Users,
  Compass,
  ArrowLeft,
  BadgeCheck
} from 'lucide-react';

export const CAMPUS_NAV_TABS: CampusNavTab[] = [
  'Explore',
  'Hackathons',
  'College Fests',
  'NGO Drives',
  'Workshops',
  'Campus Clubs',
  'My Passes'
];

export type CurrentPage = 'landing' | 'explore' | 'student_dashboard' | 'organizer_dashboard' | 'communities' | 'my_passes';

interface HeaderProps {
  currentPage?: CurrentPage;
  activeTab?: MainTab;
  currentTab?: MainTab;
  setActiveTab?: (tab: MainTab) => void;
  setCurrentTab?: (tab: MainTab) => void;
  activeDistrictTab?: CampusNavTab;
  onSelectDistrictTab?: (tab: CampusNavTab) => void;
  role?: Role;
  activeRole?: Role;
  currentRole?: Role;
  setActiveRole?: (role: Role) => void;
  setRole?: (role: Role) => void;
  userProfile?: UserProfile | null;
  currentLocation?: string;
  onOpenLocationModal?: () => void;
  onOpenSearchModal?: () => void;
  onOpenAuthModal?: (targetEvent?: any, defaultRole?: 'student' | 'organizer') => void;
  onOpenLoginPortal?: (targetRole?: Role) => void;
  onLogout?: () => void;
  onOpenCreateEvent?: () => void;
  onCreateEvent?: () => void;
  onOpenGateScanner?: () => void;
  registeredCount?: number;
  registeredPassesCount?: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenFilters?: () => void;
  activeFiltersCount?: number;
  onNavigateHome?: () => void;
  onNavigateToPage?: (page: CurrentPage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage = 'landing',
  activeTab: propActiveTab,
  currentTab: propCurrentTab,
  setActiveTab: propSetActiveTab,
  setCurrentTab: propSetCurrentTab,
  activeDistrictTab = 'Explore',
  onSelectDistrictTab,
  userProfile,
  currentLocation = 'Nashik',
  onOpenLocationModal = () => {},
  onOpenSearchModal = () => {},
  onOpenAuthModal,
  onOpenLoginPortal,
  onLogout,
  registeredCount = 0,
  registeredPassesCount = 0,
  onOpenFilters,
  activeFiltersCount = 0,
  onNavigateHome,
  onNavigateToPage,
}) => {
  const currentTab = propActiveTab || propCurrentTab || 'discovery';
  const setCurrentTab = propSetActiveTab || propSetCurrentTab || (() => {});
  const displayRegisteredCount = registeredCount || registeredPassesCount || 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tab: CampusNavTab) => {
    if (tab === 'Campus Clubs' || tab === 'Clubs') {
      if (onNavigateToPage) {
        onNavigateToPage('communities');
      } else {
        setCurrentTab('communities');
      }
      return;
    }
    if (tab === 'My Passes') {
      if (!userProfile?.isLoggedIn) {
        if (onOpenAuthModal) onOpenAuthModal(undefined, 'student');
        return;
      }
      if (onNavigateToPage) {
        onNavigateToPage('student_dashboard');
      } else {
        setCurrentTab('student_dashboard');
      }
      return;
    }
    if (onSelectDistrictTab) {
      onSelectDistrictTab(tab);
    }
    if (onNavigateToPage) {
      onNavigateToPage('explore');
    } else if (currentTab !== 'discovery') {
      setCurrentTab('discovery');
    }
  };

  const handleOpenStudentLogin = () => {
    if (onOpenAuthModal) {
      onOpenAuthModal(undefined, 'student');
    } else if (onOpenLoginPortal) {
      onOpenLoginPortal('student');
    }
  };

  const handleOpenOrganizerLogin = () => {
    // Security Guard: Active student sessions cannot trigger Organizer Portal
    if (userProfile?.isLoggedIn && userProfile.role === 'student') {
      return;
    }
    if (onOpenAuthModal) {
      onOpenAuthModal(undefined, 'organizer');
    } else if (onOpenLoginPortal) {
      onOpenLoginPortal('organizer');
    }
  };

  const currentUserAvatar = userProfile?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const currentUserName = userProfile?.name || 'Siddhi Lawte';
  const studentPrn = userProfile?.prn || userProfile?.studentId || '22BCE104';
  const studentCollege = userProfile?.college || 'MET Bhujbal Knowledge City';
  const isStudentSession = Boolean(userProfile?.isLoggedIn && userProfile?.role === 'student');
  const isOrganizerSession = Boolean(userProfile?.isLoggedIn && userProfile?.role === 'organizer');
  const isGuestSession = !userProfile?.isLoggedIn;

  // -------------------------------------------------------------
  // 1. ISOLATED STUDENT DASHBOARD TOP NAVIGATION
  // -------------------------------------------------------------
  if (currentPage === 'student_dashboard') {
    return (
      <header 
        id="campus-student-header"
        className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 transition-all duration-300 pointer-events-none"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 border-t-white/25 border-l-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(59,130,246,0.15)] flex items-center justify-between gap-3 sm:gap-4 text-white font-serif pointer-events-auto">
          
          {/* LEFT: Logo + Campus Badge */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              onClick={() => {
                if (onNavigateToPage) onNavigateToPage('explore');
                else if (onNavigateHome) onNavigateHome();
              }}
              className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-none cursor-pointer shrink-0"
              aria-label="YouthConnect Home"
            >
              <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-blue-600/20 border border-blue-400/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform text-white shrink-0">
                <YouthConnectLogo className="w-full h-full text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-[0_0_8px_#22d3ee]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base sm:text-lg md:text-xl tracking-tight text-white font-serif leading-tight whitespace-nowrap drop-shadow-md">
                  Youth<span className="text-blue-400">Connect</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold tracking-widest text-indigo-300 uppercase -mt-0.5 whitespace-nowrap">
                  STUDENT CAMPUS HUB
                </span>
              </div>
            </button>

            {/* Campus Verification Badge */}
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold tracking-wide shadow-sm backdrop-blur-md">
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>SPPU Campus Verified</span>
            </span>
          </div>

          {/* CENTER: Direct Link "← Back to Explore" */}
          <div className="flex items-center">
            <button
              onClick={() => {
                if (onNavigateToPage) onNavigateToPage('explore');
                else if (onNavigateHome) onNavigateHome();
              }}
              id="student-header-back-explore"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-white border border-white/20 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)] active:scale-95 cursor-pointer font-serif backdrop-blur-md"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
              <span>Back to Explore</span>
            </button>
          </div>

          {/* RIGHT: Student Profile Info + Log Out Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Student Profile Info Pill (Name, Campus) */}
            <div className="flex items-center gap-2 bg-white/[0.06] border border-white/15 pl-2 pr-3 py-1 rounded-full shadow-sm backdrop-blur-md">
              <img
                src={currentUserAvatar}
                alt={currentUserName}
                className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400 shrink-0"
              />
              <div className="flex flex-col text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white max-w-[85px] sm:max-w-[130px] truncate font-serif">
                    {currentUserName}
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 px-1.5 py-0.2 rounded font-serif">
                    Student
                  </span>
                </div>
                <span className="text-[9px] text-indigo-200 max-w-[120px] sm:max-w-[170px] truncate hidden md:inline font-serif">
                  {studentCollege}
                </span>
              </div>
            </div>

            {/* Strict Log Out Action */}
            {onLogout && (
              <button
                onClick={onLogout}
                id="student-header-logout-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 transition-colors cursor-pointer font-serif shrink-0 shadow-sm active:scale-95 backdrop-blur-md"
                title="Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5 text-red-300" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }

  // -------------------------------------------------------------
  // 2. PUBLIC / EXPLORE FEED TOP NAVIGATION
  // -------------------------------------------------------------
  return (
    <header 
      id="campus-main-header"
      className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 transition-all duration-300 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 border-t-white/25 border-l-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(59,130,246,0.15)] flex items-center justify-between gap-2 sm:gap-4 text-white font-serif pointer-events-auto">
        
        {/* LEFT: Logo with serif typography + Location Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => {
              if (onNavigateHome) {
                onNavigateHome();
              } else {
                if (onSelectDistrictTab) onSelectDistrictTab('Explore');
                setCurrentTab('discovery');
              }
            }}
            className="flex items-center gap-2 sm:gap-2.5 group text-left focus:outline-none cursor-pointer shrink-0"
            aria-label="YouthConnect Home"
          >
            <div className="relative w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-xl bg-blue-600/20 border border-blue-400/40 p-1 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.35)] group-hover:scale-105 transition-transform text-white shrink-0">
              <YouthConnectLogo className="w-full h-full text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 border border-slate-900 shadow-[0_0_8px_#22d3ee]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg md:text-xl tracking-tight text-white font-serif leading-tight whitespace-nowrap drop-shadow-md">
                Youth<span className="text-blue-400">Connect</span>
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold tracking-widest text-indigo-300 uppercase -mt-0.5 hidden sm:block whitespace-nowrap">
                STUDENT CAMPUS HUB
              </span>
            </div>
          </button>

          {/* Location Selector Pill */}
          <button
            onClick={onOpenLocationModal}
            id="campus-location-pill"
            className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer shrink-0 backdrop-blur-md"
            title="Select City"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="font-serif font-medium text-slate-200 text-[11px] sm:text-xs whitespace-nowrap">
              {currentLocation || 'Nashik'}
            </span>
            <ChevronDown className="w-3 h-3 text-indigo-300 shrink-0" />
          </button>
        </div>

        {/* CENTER: Active Explore Campus Events Capsule Tab with Neon Glow */}
        <nav 
          id="campus-horizontal-nav"
          className="hidden md:flex items-center justify-center shrink-0"
        >
          <button
            type="button"
            onClick={() => {
              if (onSelectDistrictTab) onSelectDistrictTab('Explore');
              if (onNavigateToPage) onNavigateToPage('explore');
              else setCurrentTab('discovery');
            }}
            id="header-explore-campus-events-tab"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs tracking-wide shadow-[0_0_15px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-400/50 transition-all font-serif cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4 text-cyan-200" />
            <span className="drop-shadow-sm">Explore Campus Events</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
          </button>
        </nav>

        {/* RIGHT: Search + User Profile / Login */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Compact Search Trigger Bar */}
          <button
            onClick={onOpenSearchModal}
            id="campus-search-bar"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs text-slate-300 hover:text-white hover:border-blue-400/40 transition-all shadow-sm cursor-pointer shrink-0 backdrop-blur-md"
            title="Search Hackathons, NGO Drives, Fests..."
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden xl:inline text-slate-200 text-xs font-serif whitespace-nowrap">
              Search events...
            </span>
            <kbd className="hidden xl:inline-block px-1.5 py-0.2 text-[9px] font-mono text-indigo-300 bg-white/10 rounded border border-white/15">
              ⌘K
            </kbd>
          </button>

          {/* Filter Trigger Button */}
          {onOpenFilters && (
            <button
              onClick={onOpenFilters}
              className={`p-1.5 rounded-full border transition-all relative cursor-pointer shrink-0 backdrop-blur-md ${
                activeFiltersCount > 0
                  ? 'bg-blue-600/30 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/15 text-slate-300 hover:text-white hover:border-blue-400/40'
              }`}
              title="Filters & Mode"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-300" />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[8px] font-bold flex items-center justify-center shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          )}

          {/* ========================================================= */}
          {/* TOP-RIGHT CONTROLS: CONDITIONAL RENDERING BY ROLE */}
          {/* ========================================================= */}

          {/* CASE 1: UNRECOGNIZED / GUEST USER (!userProfile?.isLoggedIn) */}
          {isGuestSession && (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Student Login Button */}
              <button
                onClick={handleOpenStudentLogin}
                id="header-sign-in-student"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-400/50 transition-all whitespace-nowrap cursor-pointer font-serif shrink-0"
              >
                <GraduationCap className="w-3.5 h-3.5 text-cyan-200" />
                <span>Student Login</span>
              </button>
            </div>
          )}

          {/* CASE 2: AUTHENTICATED STUDENT SESSION (role === 'student') */}
          {isStudentSession && (
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Quick-Link: My Passes / Student Dashboard */}
              <button
                onClick={() => {
                  if (onNavigateToPage) onNavigateToPage('student_dashboard');
                  else setCurrentTab('student_dashboard');
                }}
                id="header-student-passes-btn"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 transition-all shadow-[0_0_15px_rgba(59,130,246,0.25)] cursor-pointer font-serif whitespace-nowrap active:scale-95 shrink-0 backdrop-blur-md"
                title="View My Passes & Student Dashboard"
              >
                <Ticket className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">My Passes</span>
                {displayRegisteredCount > 0 && (
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full shadow-xs">
                    {displayRegisteredCount}
                  </span>
                )}
              </button>

              {/* Student Profile Badge with Name & Campus */}
              <div
                onClick={() => {
                  if (onNavigateToPage) onNavigateToPage('student_dashboard');
                  else setCurrentTab('student_dashboard');
                }}
                id="header-student-profile-badge"
                className="flex items-center gap-1.5 sm:gap-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 pl-1.5 pr-2.5 sm:pr-3 py-1 rounded-full shadow-sm transition-colors cursor-pointer text-left shrink-0 backdrop-blur-md"
                title={`${currentUserName} (${studentCollege}) - Open Dashboard`}
              >
                <img
                  src={currentUserAvatar}
                  alt={currentUserName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400 shrink-0"
                />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white max-w-[85px] sm:max-w-[120px] truncate font-serif">
                    {currentUserName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-500/20 border border-cyan-400/40 px-1.5 py-0.2 rounded shrink-0">
                    Student
                  </span>
                </div>
              </div>

              {/* Strict Student Log Out Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  id="header-student-logout-btn"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 transition-colors cursor-pointer font-serif shrink-0 shadow-sm active:scale-95 backdrop-blur-md"
                  title="Log Out of Student Session"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-300" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              )}
            </div>
          )}

          {/* CASE 3: AUTHENTICATED ORGANIZER SESSION (role === 'organizer') */}
          {isOrganizerSession && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  if (onNavigateToPage) onNavigateToPage('organizer_dashboard');
                }}
                id="header-organizer-hub-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/50 cursor-pointer font-serif shrink-0 whitespace-nowrap"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-200" />
                <span className="hidden sm:inline">Organizer Hub</span>
              </button>

              {/* Organizer Profile Badge */}
              <div className="flex items-center gap-1.5 bg-white/[0.06] border border-white/15 pl-1.5 pr-3 py-1 rounded-full text-xs font-serif shrink-0">
                <img
                  src={currentUserAvatar}
                  alt={currentUserName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-indigo-400"
                />
                <span className="text-xs font-medium text-slate-200 max-w-[90px] truncate font-serif">
                  {currentUserName.split(' ')[0]}
                </span>
              </div>

              {/* Organizer Log Out */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  id="header-organizer-logout-btn"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-300 bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 transition-colors cursor-pointer font-serif shrink-0 shadow-sm active:scale-95"
                  title="Sign Out of Organizer Hub"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-300" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
