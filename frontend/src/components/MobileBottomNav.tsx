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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07080c]/95 backdrop-blur-xl border-t border-white/10 px-2 py-1.5 shadow-[0_-4px_24px_rgba(0,0,0,0.8)]">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
        {/* 1. Home */}
        <button
          onClick={() => onSelectTab('discovery')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'discovery'
              ? 'text-white font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {currentTab === 'discovery' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0066ff] shadow-sm shadow-blue-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* 2. Student Hub */}
        <button
          onClick={() => onSelectTab('student_dashboard')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'student_dashboard'
              ? 'text-white font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="w-5 h-5" />
            {currentTab === 'student_dashboard' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0066ff] shadow-sm shadow-blue-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Hub</span>
        </button>

        {/* 3. My Events / Passes */}
        <button
          onClick={() => onSelectTab('my_events')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all relative ${
            currentTab === 'my_events'
              ? 'text-white font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Ticket className="w-5 h-5" />
            {registeredCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#0066ff] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#07080c] shadow-md">
                {registeredCount}
              </span>
            )}
            {currentTab === 'my_events' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0066ff] shadow-sm shadow-blue-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">My Passes</span>
        </button>

        {/* 4. Communities */}
        <button
          onClick={() => onSelectTab('communities')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'communities'
              ? 'text-white font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5" />
            {currentTab === 'communities' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0066ff] shadow-sm shadow-blue-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Clubs</span>
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
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            currentTab === 'student_dashboard' || currentTab === 'organizer_dashboard' || currentTab === 'admin_portal'
              ? 'text-white font-extrabold'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <div className="relative">
            {role === 'organizer' ? (
              <LayoutDashboard className="w-5 h-5" />
            ) : (
              <User className="w-5 h-5" />
            )}
            {(currentTab === 'student_dashboard' || currentTab === 'organizer_dashboard' || currentTab === 'admin_portal') && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0066ff] shadow-sm shadow-blue-500" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">
            {role === 'organizer' ? 'Workspace' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};
