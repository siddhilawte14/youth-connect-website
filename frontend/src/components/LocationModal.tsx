import React, { useState } from 'react';
import { MapPin, Check, Search, X, Sparkles, Navigation } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

interface CityOption {
  name: string;
  region: string;
  status: 'active' | 'coming_soon';
  eventsCount: number;
  campuses: string[];
}

const CITIES: CityOption[] = [
  {
    name: 'Nashik',
    region: 'Maharashtra',
    status: 'active',
    eventsCount: 16,
    campuses: ['KKWIEER', 'NDMVPS KBTCOE', 'Sandip Univ', 'MET BKC', 'BYK / RYK']
  },
  {
    name: 'Pune',
    region: 'Maharashtra',
    status: 'coming_soon',
    eventsCount: 28,
    campuses: ['COEP Tech', 'PICT', 'MIT-WPU', 'VIT Pune', 'Symbiosis']
  },
  {
    name: 'Mumbai',
    region: 'Maharashtra',
    status: 'coming_soon',
    eventsCount: 35,
    campuses: ['VJTI', 'SPIT', 'IIT Bombay', 'DJ Sanghvi', 'NMIMS']
  },
  {
    name: 'Chhatrapati Sambhajinagar',
    region: 'Maharashtra',
    status: 'coming_soon',
    eventsCount: 8,
    campuses: ['GECA', 'JNEC', 'Dr. BAMU', 'MIT Aurangabad']
  },
  {
    name: 'Nagpur',
    region: 'Maharashtra',
    status: 'coming_soon',
    eventsCount: 12,
    campuses: ['VNIT', 'RCOEM', 'YCCE', 'GHRCE']
  },
  {
    name: 'Kolhapur',
    region: 'Maharashtra',
    status: 'coming_soon',
    eventsCount: 6,
    campuses: ['KIT', 'DY Patil', 'Shivaji Univ']
  }
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.campuses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0e1017] text-white rounded-3xl w-full max-w-lg shadow-2xl border border-white/15 overflow-hidden">
        {/* Header */}
        <div className="bg-[#141722] border-b border-white/10 p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#0066ff] text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base text-white font-headline">
                Select Your Campus Region
              </h3>
              <p className="text-xs text-gray-400">
                Discover student events & communities near your college
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-white/10 bg-[#0e1017]">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, region, or college campus..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-[#0066ff]"
            />
          </div>
        </div>

        {/* Cities List */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2.5">
          {filteredCities.map((city) => {
            const isSelected = currentLocation.toLowerCase() === city.name.toLowerCase();
            const isActive = city.status === 'active';

            return (
              <div
                key={city.name}
                onClick={() => {
                  if (isActive) {
                    onSelectLocation(city.name);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-blue-950/40 border-[#0066ff] shadow-md'
                    : isActive
                    ? 'bg-[#141722] hover:bg-[#1a1e2e] border-white/10 cursor-pointer'
                    : 'bg-[#141722]/50 border-white/5 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{city.name}</h4>
                    <span className="text-[10px] text-gray-400 font-medium">({city.region})</span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase">
                        Live Market
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-[10px] font-medium">
                        Expanding Soon
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#0066ff] text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Campuses preview */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {city.campuses.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-gray-300"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141722] border-t border-white/10 text-center">
          <p className="text-xs text-gray-400">
            Currently optimized for students across <strong className="text-white">Nashik District & SPPU affiliated colleges</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
