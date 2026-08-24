import React from 'react';
import { MainTab, CampusNavTab } from '../types';
import { YouthConnectLogo } from './YouthConnectLogo';

interface FooterProps {
  onSelectTab?: (tab: MainTab) => void;
  onSelectDistrictTab?: (tab: CampusNavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onSelectDistrictTab }) => {
  return (
    <footer className="glass-panel-3d bg-white/[0.06] backdrop-blur-3xl border-t border-white/20 w-full py-8 mt-auto text-stone-200 font-serif">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-white/20 border border-white/40 text-white flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(236,72,153,0.3)] backdrop-blur-md">
            <YouthConnectLogo className="w-full h-full text-white" />
          </div>
          <div className="text-left">
            <span className="font-bold text-base text-white font-serif block drop-shadow-sm">
              Youth<span className="text-pink-300">Connect</span>
            </span>
            <span className="text-[10px] font-semibold text-purple-200 uppercase tracking-wider block -mt-0.5 font-serif">
              COLLEGIATE STUDENT HUB • NASHIK & PUNE
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-5 sm:gap-7 text-xs font-medium text-stone-300 font-serif">
          <button 
            type="button"
            onClick={() => {
              if (onSelectDistrictTab) onSelectDistrictTab('Hackathons');
              if (onSelectTab) onSelectTab('discovery');
            }} 
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            Hackathons & Sprints
          </button>
          <button 
            type="button"
            onClick={() => {
              if (onSelectDistrictTab) onSelectDistrictTab('College Fests');
              if (onSelectTab) onSelectTab('discovery');
            }} 
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            College Fests
          </button>
          <button 
            type="button"
            onClick={() => {
              if (onSelectDistrictTab) onSelectDistrictTab('NGO Drives');
              if (onSelectTab) onSelectTab('discovery');
            }} 
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            NGO Drives
          </button>
          <button 
            type="button"
            onClick={() => {
              if (onSelectDistrictTab) onSelectDistrictTab('Workshops');
              if (onSelectTab) onSelectTab('discovery');
            }} 
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            Workshops
          </button>
          <button 
            type="button"
            onClick={() => onSelectTab && onSelectTab('communities')} 
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            Campus Clubs
          </button>
          <button 
            type="button"
            onClick={() => onSelectTab && onSelectTab('my_events')} 
            className="hover:text-pink-300 transition-colors cursor-pointer"
          >
            My Digital Passes
          </button>
        </div>

        {/* Copyright */}
        <div className="text-xs text-purple-200 font-medium flex items-center gap-1 font-serif">
          <span>© 2026 YouthConnect</span>
          <span>•</span>
          <span>Built for Collegiate Innovators</span>
        </div>
      </div>
    </footer>
  );
};
