import React, { useState, useEffect } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  Check, 
  RotateCcw, 
  Sparkles,
  Layers,
  GraduationCap,
  Languages,
  Tag,
  Award
} from 'lucide-react';

export interface FilterCriteria {
  genres: string[];
  languages: string[];
  formats: string[];
  priceRange: 'all' | 'free' | 'under500' | 'premium';
}

interface FilterSlideOverModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterCriteria;
  onApplyFilters: (filters: FilterCriteria) => void;
  onClearFilters: () => void;
  totalMatchingResults: number;
}

export const STUDENT_GENRE_OPTIONS = [
  'Tech',
  'Hackathon',
  'Cultural',
  'Workshop',
  'NGO Volunteer Drives',
  'Social Initiatives',
  'Volunteering',
  'Social Impact',
  'AI',
  'Gaming',
  'Hardware',
  'Drama',
  'Entrepreneurship'
];

export const LANGUAGE_OPTIONS = [
  'English',
  'Marathi',
  'Hindi',
];

export const CAMPUS_FORMAT_OPTIONS = [
  'In-Person (Nashik Campus)',
  'Free Registration',
  'Prize Pool',
  'Certified',
  'Hands-on Lab',
  'Live Stage'
];

export const FilterSlideOverModal: React.FC<FilterSlideOverModalProps> = ({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onClearFilters,
  totalMatchingResults,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  if (!isOpen) return null;

  const toggleItem = (listKey: 'genres' | 'languages' | 'formats', item: string) => {
    setLocalFilters((prev) => {
      const currentList = prev[listKey];
      const exists = currentList.includes(item);
      const updated = exists 
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];
      return { ...prev, [listKey]: updated };
    });
  };

  const hasActiveFilters = 
    localFilters.genres.length > 0 ||
    localFilters.languages.length > 0 ||
    localFilters.formats.length > 0 ||
    localFilters.priceRange !== 'all';

  const totalActiveCount = 
    localFilters.genres.length + 
    localFilters.languages.length + 
    localFilters.formats.length + 
    (localFilters.priceRange !== 'all' ? 1 : 0);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters: FilterCriteria = {
      genres: [],
      languages: [],
      formats: [],
      priceRange: 'all',
    };
    setLocalFilters(emptyFilters);
    onClearFilters();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-serif">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slide-over Drawer */}
      <div 
        id="campus-filter-slideover"
        className="relative w-full max-w-md bg-[#130f1e]/95 backdrop-blur-3xl text-white h-full shadow-[0_0_50px_rgba(0,0,0,0.6)] border-l border-white/20 flex flex-col z-10 animate-in slide-in-from-right duration-300 font-serif"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/15 flex items-center justify-between bg-white/[0.08] backdrop-blur-xl font-serif">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-300/40 flex items-center justify-center text-pink-300 shadow-inner">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-serif">
                <h3 className="text-base font-bold text-white font-serif">
                  Filter Events
                </h3>
                {totalActiveCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-[#8B7CB6] to-pink-500 text-white text-[10px] font-semibold shadow-xs">
                    {totalActiveCount} Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-purple-200 font-medium font-serif">
                Customize your campus discovery feed
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left font-serif">
          
          {/* Price / Fee Range */}
          <div>
            <div className="flex items-center justify-between mb-3 font-serif">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-200 flex items-center gap-1.5 font-serif">
                <Tag className="w-3.5 h-3.5 text-pink-300" />
                <span>Pass & Registration Fee</span>
              </label>
              {localFilters.priceRange !== 'all' && (
                <button
                  type="button"
                  onClick={() => setLocalFilters((p) => ({ ...p, priceRange: 'all' }))}
                  className="text-[10px] text-pink-300 hover:underline font-semibold cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'all', label: 'All Passes' },
                { key: 'free', label: '100% Free' },
                { key: 'under500', label: 'Under ₹200' },
              ].map((tier) => {
                const isSelected = localFilters.priceRange === tier.key;
                return (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => setLocalFilters((p) => ({ ...p, priceRange: tier.key as any }))}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold transition-all border text-center cursor-pointer font-serif ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 border-pink-300/60 text-white shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                        : 'bg-white/10 border-white/20 text-stone-200 hover:bg-white/20 hover:text-white backdrop-blur-md'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Domains & Categories */}
          <div>
            <div className="flex items-center justify-between mb-3 font-serif">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-200 flex items-center gap-1.5 font-serif">
                <Layers className="w-3.5 h-3.5 text-pink-300" />
                <span>Categories & Domains</span>
              </label>
              {localFilters.genres.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLocalFilters((p) => ({ ...p, genres: [] }))}
                  className="text-[10px] text-pink-300 hover:underline font-semibold cursor-pointer"
                >
                  Clear ({localFilters.genres.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {STUDENT_GENRE_OPTIONS.map((genre) => {
                const isSelected = localFilters.genres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleItem('genres', genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 cursor-pointer font-serif ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 border-pink-300/60 text-white font-semibold shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                        : 'bg-white/10 border-white/20 text-stone-200 hover:border-pink-300/50 hover:text-white hover:bg-white/20 backdrop-blur-md'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{genre}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Campus Formats & Perks */}
          <div>
            <div className="flex items-center justify-between mb-3 font-serif">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-200 flex items-center gap-1.5 font-serif">
                <Award className="w-3.5 h-3.5 text-pink-300" />
                <span>Format & Recognition</span>
              </label>
              {localFilters.formats.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLocalFilters((p) => ({ ...p, formats: [] }))}
                  className="text-[10px] text-pink-300 hover:underline font-semibold cursor-pointer"
                >
                  Clear ({localFilters.formats.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {CAMPUS_FORMAT_OPTIONS.map((fmt) => {
                const isSelected = localFilters.formats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => toggleItem('formats', fmt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 cursor-pointer font-serif ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 border-pink-300/60 text-white font-semibold shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                        : 'bg-white/10 border-white/20 text-stone-200 hover:border-pink-300/50 hover:text-white hover:bg-white/20 backdrop-blur-md'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{fmt}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Medium / Languages */}
          <div>
            <div className="flex items-center justify-between mb-3 font-serif">
              <label className="text-xs font-semibold uppercase tracking-wider text-purple-200 flex items-center gap-1.5 font-serif">
                <Languages className="w-3.5 h-3.5 text-pink-300" />
                <span>Session Language</span>
              </label>
              {localFilters.languages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setLocalFilters((p) => ({ ...p, languages: [] }))}
                  className="text-[10px] text-pink-300 hover:underline font-semibold cursor-pointer"
                >
                  Clear ({localFilters.languages.length})
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {LANGUAGE_OPTIONS.map((lang) => {
                const isSelected = localFilters.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleItem('languages', lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border flex items-center gap-1.5 cursor-pointer font-serif ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 border-pink-300/60 text-white font-semibold shadow-[0_0_12px_rgba(236,72,153,0.35)]'
                        : 'bg-white/10 border-white/20 text-stone-200 hover:bg-white/20 hover:text-white backdrop-blur-md'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    <span>{lang}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-white/15 bg-white/[0.08] backdrop-blur-xl flex items-center justify-between gap-3 font-serif">
          <button
            type="button"
            onClick={handleClear}
            disabled={!hasActiveFilters}
            className="px-4 py-2.5 rounded-xl border border-white/20 text-stone-300 hover:text-white hover:bg-white/15 font-semibold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer font-serif"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 px-5 rounded-xl bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 active:scale-[0.98] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.35)] border border-pink-200/50 transition-all cursor-pointer font-serif"
          >
            <span>Show Events</span>
            <span className="px-2 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-bold">
              {totalMatchingResults}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
