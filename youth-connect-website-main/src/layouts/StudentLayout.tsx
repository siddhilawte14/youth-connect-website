import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Search, 
  Ticket, 
  Users, 
  User, 
  LogIn, 
  Building2, 
  Sparkles, 
  GraduationCap
} from 'lucide-react';
import { UserProfile, EventItem, CommunityClub, DigitalPass, CampusNavTab } from '../types';
import { Header } from '../components/Header';
import { LocationModal } from '../components/LocationModal';
import { SearchModal } from '../components/SearchModal';
import { DistrictAuthModal } from '../components/DistrictAuthModal';
import { Footer } from '../components/Footer';

export interface StudentLayoutProps {
  currentTab: 'explore' | 'communities' | 'my_tickets' | 'profile';
  setCurrentTab: (tab: 'explore' | 'communities' | 'my_tickets' | 'profile') => void;
  activeDistrictTab?: CampusNavTab;
  setActiveDistrictTab?: (tab: CampusNavTab) => void;
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
  onAuthSuccess?: (profile: UserProfile) => void;
  onOpenFilters?: () => void;
  activeFiltersCount?: number;
  children: React.ReactNode;
}

export const StudentLayout: React.FC<StudentLayoutProps> = ({
  currentTab,
  setCurrentTab,
  activeDistrictTab = 'Explore',
  setActiveDistrictTab,
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
  onAuthSuccess,
  onOpenFilters,
  activeFiltersCount = 0,
  children,
}) => {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authRoleHint, setAuthRoleHint] = useState<'student' | 'organizer'>('student');

  const registeredPassList = Object.values(passes || {});
  const displayRegisteredCount = registeredPassList.length;

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

  const handleAuthModalSuccess = (profile: UserProfile) => {
    setIsAuthModalOpen(false);
    if (onAuthSuccess) {
      onAuthSuccess(profile);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-body selection:bg-violet-600 selection:text-white">
      {/* YouthConnect Clean Header */}
      <Header
        currentLocation={currentLocation}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenSearchModal={() => setIsSearchModalOpen(true)}
        onOpenAuthModal={(_evt, defaultRole) => {
          setAuthRoleHint(defaultRole || 'student');
          setIsAuthModalOpen(true);
        }}
        onOpenLoginPortal={onOpenLoginPortal}
        userProfile={userProfile}
        onLogout={onLogout}
        registeredPassesCount={displayRegisteredCount}
        activeDistrictTab={activeDistrictTab}
        onSelectDistrictTab={(tab) => {
          if (setActiveDistrictTab) setActiveDistrictTab(tab);
          if (currentTab !== 'explore') setCurrentTab('explore');
        }}
        onOpenFilters={onOpenFilters}
        activeFiltersCount={activeFiltersCount}
      />

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

      {/* Academic Login Modal */}
      <DistrictAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleAuthModalSuccess}
        defaultRole={authRoleHint}
      />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-2 shadow-lg">
        <div className="grid grid-cols-4 items-center gap-1">
          <button
            id="mobile-nav-explore"
            onClick={() => setCurrentTab('explore')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'explore' ? 'text-violet-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-bold">Explore</span>
          </button>

          <button
            id="mobile-nav-communities"
            onClick={() => setCurrentTab('communities')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              currentTab === 'communities' ? 'text-violet-700 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 font-medium">Clubs</span>
          </button>

          {userProfile ? (
            <>
              <button
                id="mobile-nav-mytickets"
                onClick={() => setCurrentTab('my_tickets')}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
                  currentTab === 'my_tickets' ? 'text-violet-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Ticket className="w-5 h-5" />
                {displayRegisteredCount > 0 && (
                  <span className="absolute top-0 right-4 w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center">
                    {displayRegisteredCount}
                  </span>
                )}
                <span className="text-[10px] mt-0.5 font-medium">My Passes</span>
              </button>

              <button
                id="mobile-nav-profile"
                onClick={() => setCurrentTab('profile')}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  currentTab === 'profile' ? 'text-violet-700 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">Profile</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="mobile-nav-org-login"
                onClick={() => {
                  setAuthRoleHint('organizer');
                  setIsAuthModalOpen(true);
                }}
                className="flex flex-col items-center justify-center py-1 rounded-xl transition-all text-slate-700 hover:text-violet-700"
                title="Organizer Portal"
              >
                <Building2 className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-bold">Host</span>
              </button>

              <button
                id="mobile-nav-login"
                onClick={() => {
                  setAuthRoleHint('student');
                  setIsAuthModalOpen(true);
                }}
                className="flex flex-col items-center justify-center py-1 rounded-xl transition-all text-violet-700 font-bold"
              >
                <LogIn className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-bold">Sign In</span>
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Footer */}
      <Footer 
        onSelectTab={(tab) => {
          if (tab === 'communities') setCurrentTab('communities');
          else if (tab === 'my_events') setCurrentTab('my_tickets');
          else setCurrentTab('explore');
        }} 
        onSelectDistrictTab={(tab) => {
          if (setActiveDistrictTab) setActiveDistrictTab(tab);
          setCurrentTab('explore');
        }}
      />
    </div>
  );
};

export default StudentLayout;
