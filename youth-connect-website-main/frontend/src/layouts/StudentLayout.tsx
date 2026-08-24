import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Search, 
  Ticket, 
  Users, 
  User, 
  ChevronDown, 
  LogOut,
  Bell,
  LogIn,
  Building2,
  Sparkles
} from 'lucide-react';
import { UserProfile, EventItem, CommunityClub, DigitalPass } from '../types';
import { LocationModal } from '../components/LocationModal';
import { SearchModal } from '../components/SearchModal';
import { Footer } from '../components/Footer';

export interface StudentLayoutProps {
  currentTab: 'explore' | 'communities' | 'my_tickets' | 'profile';
  setCurrentTab: (tab: 'explore' | 'communities' | 'my_tickets' | 'profile') => void;
  userProfile: UserProfile | null;
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  events: EventItem[];
  clubs: CommunityClub[];
  passes: Record<string, DigitalPass>;
  onSelectEvent: (event: EventItem) => void;
  onSelectClub?: (club: CommunityClub) => void;
  onOpenLoginPortal: (targetRole?: 'student' | 'organizer' | 'admin', redirectUrl?: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  currentTab,
  setCurrentTab,
  userProfile,
  currentLocation,
  setCurrentLocation,
  events,
  clubs,
  passes,
  onSelectEvent,
  onSelectClub,
  onOpenLoginPortal,
  onLogout,
  children,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const registeredPassList = Object.values(passes || {});
  const displayRegisteredCount = registeredPassList.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (/ or Cmd+K to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !isSearchModalOpen) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen]);

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOqDjXuGHls-fFzwgw8U2QnO0Hrf_XlK1-_hWeTZzI1aBJ9SSKnkdXqQ3OzFJKo2PUFaS6K58-AZHpVFCeRENDahFHH359O6KMTKEIHD40RLEsjDWeBrIGrdCsF9u0j-Nr48RZY_wgyXqdXhRdhttQKwEnN_fjSJU0-e_wnw5K4G2HdNG92sSEzsZVt7bJuw1PSrfIW0u1GVSp-5IQOS_EAfbRjW-Qxe0zK2TUzHKnpeqqkpG29bD';
  const currentUserAvatar = userProfile?.avatarUrl || defaultAvatar;
  const currentUserName = userProfile?.name || 'Student';
  const currentUserSub = userProfile?.college || 'Nashik Campus Network';

  const notifications = [
    { id: '1', title: 'TechSprint in 3 Days!', desc: 'Keep your digital pass ready for entrance.', time: '10m ago' },
    { id: '2', title: 'New Hackathon Live', desc: 'UI/UX Design Challenge opened registrations.', time: '1h ago' },
    { id: '3', title: 'Nashik Coders Hub', desc: 'New coding workshop announced for Sunday.', time: '3h ago' },
  ];

  const handleOrganisationLoginClick = () => {
    try {
      window.history.pushState({}, '', '/organizer/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (e) {
      window.location.href = '/organizer/login';
    }
  };

  return (
    <div className={`min-h-screen ${currentTab === 'explore' ? 'bg-[#07080c] text-white' : 'bg-[#fafbfd] text-[#0b1c30]'} flex flex-col font-body selection:bg-[#0066ff] selection:text-white`}>
      {/* Student Navigation Header - Explore, Communities, Location, Search, Organisation Portal, Sign In/Profile */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#07080c]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl py-3' 
            : 'bg-gradient-to-b from-[#07080c]/90 via-[#07080c]/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 md:px-14 flex items-center justify-between gap-4">
          {/* LEFT: Brand Logo + Clean Student Nav */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* Logo */}
            <button
              onClick={() => setCurrentTab('explore')}
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
                  Student Campus Hub
                </p>
              </div>
            </button>

            {/* Clean Student Navigation: Explore, Communities, (My Passes if Logged In) */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                id="nav-student-explore"
                onClick={() => setCurrentTab('explore')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentTab === 'explore'
                    ? 'text-white font-extrabold border-b-2 border-[#0066ff]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Explore
              </button>

              <button
                id="nav-student-communities"
                onClick={() => setCurrentTab('communities')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  currentTab === 'communities'
                    ? 'text-white font-extrabold border-b-2 border-[#0066ff]'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Communities
              </button>

              {userProfile && (
                <button
                  id="nav-student-mytickets"
                  onClick={() => setCurrentTab('my_tickets')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    currentTab === 'my_tickets'
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
              )}
            </nav>
          </div>

          {/* RIGHT: Location, Search, Organisation Portal, Notifications, Sign In / Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Location Selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-bold text-gray-200 transition-colors group"
              title="Select Campus Region"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0066ff] group-hover:scale-110 transition-transform" />
              <span className="truncate max-w-[80px] sm:max-w-none">{currentLocation}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Quick Search Shortcut Trigger */}
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-gray-300 transition-colors"
              title="Quick Search Events & Clubs"
            >
              <Search className="w-4 h-4 text-gray-200" />
              <span className="hidden lg:inline text-xs font-medium pr-1 text-gray-300">Quick Find</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono text-gray-300 bg-white/10 rounded border border-white/20">
                /
              </kbd>
            </button>

            {/* Dedicated "Sign In as Organisation" Action Button */}
            <button
              id="nav-btn-organisation-portal"
              onClick={handleOrganisationLoginClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all shadow-sm group active:scale-95"
              title="Host campus events, manage registrations, scan passes & broadcast"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-6 transition-transform" />
              <span>Sign In as Organisation</span>
            </button>

            {userProfile ? (
              <>
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

                {/* Logged-In Student Profile Dropdown */}
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
                      <span className="block text-[10px] text-gray-400">
                        Student
                      </span>
                    </div>
                    <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
                  </button>

                  {showProfileMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-64 bg-[#12141d] rounded-2xl shadow-2xl border border-white/15 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-left text-white"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
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
                            <span className="inline-block mt-0.5 text-[9px] font-bold uppercase bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/40">
                              Student Pass
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <button
                          onClick={() => {
                            setCurrentTab('my_tickets');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center justify-between text-gray-200 transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Ticket className="w-4 h-4 text-[#0066ff]" />
                            <span>My Passes</span>
                          </span>
                          {displayRegisteredCount > 0 && (
                            <span className="bg-[#0066ff] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {displayRegisteredCount}
                            </span>
                          )}
                        </button>

                        <button
                          onClick={() => {
                            setCurrentTab('profile');
                            setShowProfileMenu(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-white/10 flex items-center gap-2 text-gray-200 transition-colors"
                        >
                          <User className="w-4 h-4 text-[#0066ff]" />
                          <span>Student Profile</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            handleOrganisationLoginClick();
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-amber-500/10 text-amber-300 font-bold flex items-center gap-2 transition-colors sm:hidden"
                        >
                          <Building2 className="w-4 h-4 text-amber-400" />
                          <span>Sign In as Organisation</span>
                        </button>

                        <div className="border-t border-white/10 my-1" />

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
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Unauthenticated / Guest View: Sign In Button */
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenLoginPortal('student')}
                  className="px-4 py-2 rounded-xl bg-[#0066ff] hover:bg-[#0055d6] text-white text-xs font-bold shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full pb-20 md:pb-8 pt-0">
        {children}
      </main>

      {/* Location Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onSelectLocation={(loc) => setCurrentLocation(loc)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        events={events}
        clubs={clubs}
        onSelectEvent={(evt) => onSelectEvent(evt)}
        onSelectCategory={(_cat) => {
          setCurrentTab('explore');
        }}
        onSelectClub={(club) => {
          if (onSelectClub) onSelectClub(club);
          setCurrentTab('communities');
        }}
      />

      {/* Student Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#07080c]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2">
        <div className={`grid ${userProfile ? 'grid-cols-4' : 'grid-cols-4'} items-center gap-1`}>
          <button
            id="mobile-nav-explore"
            onClick={() => setCurrentTab('explore')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'explore' ? 'text-[#38bdf8] font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Explore</span>
          </button>

          <button
            id="mobile-nav-communities"
            onClick={() => setCurrentTab('communities')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'communities' ? 'text-[#38bdf8] font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Clubs</span>
          </button>

          {userProfile ? (
            <>
              <button
                id="mobile-nav-mytickets"
                onClick={() => setCurrentTab('my_tickets')}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                  currentTab === 'my_tickets' ? 'text-[#38bdf8] font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Ticket className="w-5 h-5" />
                {displayRegisteredCount > 0 && (
                  <span className="absolute top-0 right-5 w-4 h-4 rounded-full bg-[#0066ff] text-white text-[9px] font-black flex items-center justify-center">
                    {displayRegisteredCount}
                  </span>
                )}
                <span className="text-[10px] mt-0.5">Passes</span>
              </button>

              <button
                id="mobile-nav-profile"
                onClick={() => setCurrentTab('profile')}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  currentTab === 'profile' ? 'text-[#38bdf8] font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="mobile-nav-org-login"
                onClick={handleOrganisationLoginClick}
                className="flex flex-col items-center justify-center py-1 rounded-xl transition-all text-amber-400 hover:text-amber-300"
                title="Sign In as Organisation"
              >
                <Building2 className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-bold">Organisers</span>
              </button>

              <button
                id="mobile-nav-login"
                onClick={() => onOpenLoginPortal('student')}
                className="flex flex-col items-center justify-center py-1 rounded-xl transition-all text-[#38bdf8]"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-bold">Sign In</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      <Footer onSelectTab={(tab) => {
        if (tab === 'communities') setCurrentTab('communities');
        else if (tab === 'my_events') setCurrentTab('my_tickets');
        else setCurrentTab('explore');
      }} />
    </div>
  );
};

export default StudentLayout;
