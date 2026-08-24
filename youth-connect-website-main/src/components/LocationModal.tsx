import React from 'react';
import { MapPin, Check, X, Sparkles } from 'lucide-react';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: string;
  onSelectLocation: (location: string) => void;
}

interface CityOption {
  name: string;
  state: string;
  isDefault?: boolean;
}

const CITIES: CityOption[] = [
  {
    name: 'Nashik',
    state: 'Maharashtra',
    isDefault: true,
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
  },
];

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div 
        id="campus-location-modal"
        className="bg-white text-stone-900 rounded-3xl w-full max-w-md shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-150 font-serif"
      >
        {/* Header */}
        <div className="bg-stone-50 border-b border-stone-200 p-4 sm:p-5 flex items-center justify-between font-serif">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 text-[#8B7CB6] flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900 font-serif">
                Select City
              </h3>
              <p className="text-xs text-stone-500 font-medium font-serif">
                Choose your active region to explore collegiate events
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cities Selection List */}
        <div className="p-4 space-y-2.5 font-serif">
          {CITIES.map((city) => {
            const isSelected = (currentLocation || 'Nashik').toLowerCase() === city.name.toLowerCase();

            return (
              <button
                key={city.name}
                type="button"
                onClick={() => {
                  onSelectLocation(city.name);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer font-serif flex items-center justify-between ${
                  isSelected
                    ? 'bg-purple-50 border-[#8B7CB6] shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected ? 'bg-[#8B7CB6] text-white' : 'bg-stone-100 text-stone-500'
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900 font-serif">{city.name}</span>
                      {city.isDefault && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-[#7C6BA6] border border-purple-200">
                          Default Hub
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-stone-500 font-serif">{city.state}</span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-[#8B7CB6] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-stone-300 text-transparent flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer info notice */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center gap-2 text-xs text-stone-500 font-serif">
          <Sparkles className="w-3.5 h-3.5 text-[#8B7CB6] shrink-0" />
          <span>Events, hackathons, and passes will filter for the selected city.</span>
        </div>
      </div>
    </div>
  );
};
