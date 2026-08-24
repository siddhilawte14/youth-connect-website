import React, { useState, useEffect } from 'react';
import { MainTab, Role, UserProfile } from '../types';
import { 
  Compass, 
  MapPin, 
  Search, 
  Ticket, 
  Users, 
  LayoutDashboard, 
  ShieldCheck, 
  Bell, 
  ChevronDown, 
  LogOut, 
  User, 
  Sparkles, 
  Calendar, 
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Menu,
  X,
  Layers,
  PlusCircle,
  QrCode
} from 'lucide-react';

interface HeaderProps {
  activeTab?: MainTab;
  currentTab?: MainTab;
  setActiveTab?: (tab: MainTab) => void;
  setCurrentTab?: (tab: MainTab) => void;
  role?: Role;
  activeRole?: Role;
  currentRole?: Role;
  setActiveRole?: (role: Role) => void;
  setRole?: (role: Role) => void;
  userProfile?: UserProfile | null;
  currentLocation?: string;
  onOpenLocationModal?: () => void;
  onOpenSearchModal?: () => void;
  onOpenLoginPortal?: (targetRole?: Role) => void;
  onLogout?: () => void;
  onOpenCreateEvent?: () => void;
  onCreateEvent?: () => void;
  onOpenGateScanner?: () => void;
  onOpenScanner?: () => void;
  registeredCount?: number;
  registeredPassesCount?: number;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab: propActiveTab,
  currentTab: propCurrentTab,
  setActiveTab: propSetActiveTab,
  setCurrentTab: propSetCurrentTab,
  role: propRole,
  activeRole: propActiveRole,
  currentRole: propCurrentRole,
  setActiveRole: propSetActiveRole,
  setRole: propSetRole,
  userProfile,
  currentLocation = 'Nashik',
  onOpenLocationModal = () => {},
  onOpenSearchModal = () => {},
  onOpenLoginPortal,
  onLogout,
  onOpenCreateEvent,
  onCreateEvent,
  onOpenGateScanner,
  onOpenScanner,
  registeredCount = 0,
  registeredPassesCount = 0,
  searchQuery = '',
  setSearchQuery,
}) => {
  const currentTab = propActiveTab || propCurrentTab || 'discovery';
  const setCurrentTab = propSetActiveTab || propSetCurrentTab || (() => {});
  const activeRole = propActiveRole || propCurrentRole || propRole || 'student';
  const setActiveRole = propSetActiveRole || propSetRole || (() => {});
  const handleOpenScanner = onOpenGateScanner || onOpenScanner || (() => {});
  const handleOpenCreateEvent = onOpenCreateEvent || onCreateEvent || (() => {});
  const displayRegisteredCount = registeredCount || registeredPassesCount || 0;

  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const notifications = [
    { id: '1', title: 'TechSprint in 3 Days!', desc: 'Keep your digital pass ready for entrance.', time: '10m ago', unread: true },
    { id: '2', title: 'New Hackathon Live', desc: 'UI/UX Design Challenge opened registrations.', time: '1h ago', unread: true },
    { id: '3', title: 'Nashik Coders Hub', desc: 'New coding workshop announced for Sunday.', time: '3h ago', unread: false },
  ];

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOqDjXuGHls-fFzwgw8U2QnO0Hrf_XlK1-_hWeTZzI1aBJ9SSKnkdXqQ3OzFJKo2PUFaS6K58-AZHpVFCeRENDahFHH359O6KMTKEIHD40RLEsjDWeBrIGrdCsF9u0j-Nr48RZY_wgyXqdXhRdhttQKwEnN_fjSJU0-e_wnw5K4G2HdNG92sSEzsZVt7bJuw1PSrfIW0u1GVSp-5IQOS_EAfbRjW-Qxe0zK2TUzHKnpeqqkpG29bD';
  const currentUserAvatar = userProfile?.avatarUrl || defaultAvatar;
  const currentUserName = userProfile?.name || 'Rahul Sharma';
  const currentUserSub = userProfile?.college || 'KKWIEER Student';

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#07080c]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' 
          : 'bg-gradient-to-b from-[#07080c]/90 via-[#07080c]/40 to-transparent py-4'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between gap-4">
        {/* LEFT: Brand Logo + Primary Nav */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Logo */}
          <button
            onClick={() => setCurrentTab('discovery')}
            className="flex items-center gap-2.5 group text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#004bb1] via-[#0066ff] to-[#38bdf8] text-white flex items-center justify-center font-black text-sm tracking-tight shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
              YC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-white tracking-tight font-headline group-hover:text-[#38bdf8] transition-colors">
                  YouthConnect
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider hidden sm:block">
                Streaming Student Events
              </p>
            </div>
          </button>

          {/* Main Horizontal Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('discovery')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentTab === 'discovery'
                  ? 'text-white font-extrabold border-b-2 border-[#0066ff]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => setCurrentTab('student_dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentTab === 'student_dashboard'
                  ? 'text-white font-extrabold border-b-2 border-[#0066ff]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Student Hub
            </button>

            <button
              onClick={() => setCurrentTab('communities')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                currentTab === 'communities'
                  ? 'text-white font-extrabold border-b-2 border-[#0066ff]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Communities
            </button>

            <button
              onClick={() => setCurrentTab('my_events')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                currentTab === 'my_events'
                  ? 'text-white font-extrabold border-b-2 border-[#0066ff]'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <span>My Passes</span>
              {displayRegisteredCount > 0 && (
                <span className="bg-[#0066ff] text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                  {displayRegisteredCount}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* RIGHT: Location, Search, Notifications, Profile (NO HOST EVENT IN STUDENT VIEW) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Location Selector */}
          <button
            onClick={onOpenLocationModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-gray-200 transition-colors group"
            title="Change Location"
          >
            <MapPin className="w-3.5 h-3.5 text-[#0066ff] group-hover:scale-110 transition-transform" />
            <span className="truncate max-w-[80px] sm:max-w-none">{currentLocation}</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {/* Search Trigger with / Keyboard Shortcut */}
          <button
            onClick={onOpenSearchModal}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-gray-300 transition-colors"
            title="Search Events, Clubs, and Opportunities"
          >
            <Search className="w-4 h-4 text-gray-200" />
            <span className="hidden lg:inline text-xs font-medium pr-1 text-gray-300">Search...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono text-gray-300 bg-white/10 rounded border border-white/20">
              /
            </kbd>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-gray-200 relative transition-colors"
              title="Campus Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#0066ff] ring-2 ring-[#07080c]" />
            </button>

            {showNotifications && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-[#12141d] rounded-2xl shadow-2xl border border-white/15 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-left text-white"
                onMouseLeave={() => setShowNotifications(false)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                  <span className="font-bold text-xs text-white">Campus Alerts</span>
                  <span className="text-[10px] text-[#38bdf8] font-bold cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs transition-colors">
                      <div className="flex justify-between font-bold text-white">
                        <span>{n.title}</span>
                        <span className="text-[10px] text-gray-400 font-normal">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-300 mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* If the user is an Organizer or Admin, show their workspace jump */}
          {activeRole === 'organizer' && (
            <button
              onClick={handleOpenCreateEvent}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0066ff] hover:bg-[#0055d6] text-white text-xs font-bold shadow-lg transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Host Event</span>
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
            >
              <img
                src={currentUserAvatar}
                alt={currentUserName}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#0066ff]/40"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-white leading-none">
                  {currentUserName.split(' ')[0]}
                </span>
                <span className="block text-[10px] text-gray-400 capitalize">
                  {activeRole}
                </span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#12141d] rounded-2xl shadow-2xl border border-white/15 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-left text-white"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                {/* User Card */}
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={currentUserAvatar}
                      alt={currentUserName}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-xs text-white truncate">{currentUserName}</h4>
                      <p className="text-[10px] text-gray-400 truncate">{currentUserSub}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase bg-[#0066ff]/30 text-[#38bdf8] px-1.5 py-0.2 rounded border border-[#0066ff]/40">
                        {activeRole} Account
                      </span>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => {
                      setCurrentTab('my_events');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center justify-between text-gray-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Ticket className="w-4 h-4 text-[#0066ff]" />
                      <span>My Passes & Tickets</span>
                    </span>
                    {displayRegisteredCount > 0 && (
                      <span className="bg-[#0066ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {displayRegisteredCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('student_dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center gap-2 text-gray-200 transition-colors"
                  >
                    <User className="w-4 h-4 text-[#0066ff]" />
                    <span>Student Profile & History</span>
                  </button>

                  {/* Switch to Organizer Workspace or Login Portal */}
                  <div className="border-t border-white/10 my-1" />

                  <button
                    onClick={() => {
                      setCurrentTab('organizer_dashboard');
                      setActiveRole('organizer');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center gap-2 text-gray-300 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                    <span>Organizer Workspace</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onOpenLoginPortal) onOpenLoginPortal('student');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-blue-900/30 text-[#38bdf8] font-bold flex items-center gap-2 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Switch Role / Login</span>
                  </button>

                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-red-950/40 text-red-400 font-bold flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
