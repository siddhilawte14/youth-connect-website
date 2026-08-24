import React from 'react';
import { MainTab } from '../types';

interface FooterProps {
  onSelectTab?: (tab: MainTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-[#07080c] border-t border-white/10 w-full py-10 mt-auto text-gray-400">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 md:px-14 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#004bb1] via-[#0066ff] to-[#38bdf8] text-white flex items-center justify-center font-black text-xs font-headline shadow-md">
            YC
          </div>
          <div>
            <span className="font-extrabold text-sm text-white font-headline block">
              YouthConnect
            </span>
            <span className="text-[10px] text-gray-400 block -mt-0.5">
              Collegiate Events Discovery & Passes
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-300">
          <button 
            type="button"
            onClick={() => onSelectTab && onSelectTab('discovery')} 
            className="hover:text-[#38bdf8] transition-colors"
          >
            Explore Events
          </button>
          <button 
            type="button"
            onClick={() => onSelectTab && onSelectTab('communities')} 
            className="hover:text-[#38bdf8] transition-colors"
          >
            Campus Clubs
          </button>
          <button 
            type="button"
            onClick={() => onSelectTab && onSelectTab('my_events')} 
            className="hover:text-[#38bdf8] transition-colors"
          >
            My Passes
          </button>
          <a href="#campuses" onClick={(e) => e.preventDefault()} className="hover:text-[#38bdf8] transition-colors">
            Nashik Region
          </a>
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#38bdf8] transition-colors">
            Privacy Policy
          </a>
        </div>

        <div className="text-xs text-gray-400">
          © 2024–2026 YouthConnect • Made for students in Nashik & Maharashtra
        </div>
      </div>
    </footer>
  );
};
