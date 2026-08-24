import React from 'react';
import { Compass, Ticket, Users, LayoutDashboard, User, Home } from 'lucide-react';
import { MainTab, Role } from '../types';

interface MobileBottomNavProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  registeredCount: number;
  role: Role;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  registeredCount,
  role,
  onOpenLogin,
  isLoggedIn,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-stone-200 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] font-serif">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('discovery')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'discovery'
              ? 'text-[#7C6BA6] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {currentTab === 'discovery' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7CB6]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif">Home</span>
        </button>

        {/* 2. Student Hub */}
        <button
          onClick={() => onSelectTab('student_dashboard')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'student_dashboard'
              ? 'text-[#7C6BA6] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {currentTab === 'student_dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7CB6]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif">Hub</span>
        </button>

        {/* 3. My Events / Passes */}
        <button
          onClick={() => onSelectTab('my_events')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative cursor-pointer ${
            currentTab === 'my_events'
              ? 'text-[#7C6BA6] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Ticket className="w-5 h-5" />
            {registeredCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#8B7CB6] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs font-mono">
                {registeredCount}
              </span>
            )}
            {currentTab === 'my_events' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7CB6]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif">My Passes</span>
        </button>

        {/* 4. Communities */}
        <button
          onClick={() => onSelectTab('communities')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'communities'
              ? 'text-[#7C6BA6] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {currentTab === 'communities' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7CB6]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif">Clubs</span>
        </button>

        {/* 5. Profile / Workspace */}
        <button
          onClick={() => {
            if (role === 'organizer') {
              onSelectTab('organizer_dashboard');
            } else if (role === 'admin') {
              onSelectTab('admin_portal');
            } else {
              onSelectTab('student_dashboard');
            }
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer ${
            currentTab === 'student_dashboard' || currentTab === 'organizer_dashboard' || currentTab === 'admin_portal'
              ? 'text-[#7C6BA6] font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <div className="relative">
            {role === 'organizer' ? (
              <LayoutDashboard className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
            {(currentTab === 'student_dashboard' || currentTab === 'organizer_dashboard' || currentTab === 'admin_portal') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B7CB6]" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-serif">
            {role === 'organizer' ? 'Workspace' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};
