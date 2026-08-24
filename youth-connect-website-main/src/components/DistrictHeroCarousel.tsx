import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Calendar, 
  MapPin, 
  Ticket, 
  Info, 
  Heart,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { EventItem } from '../types';

interface DistrictHeroCarouselProps {
  items: EventItem[];
  onBookNow: (event: EventItem) => void;
  onViewDetails: (event: EventItem) => void;
  onToggleSave?: (eventId: string) => void;
}

export const DistrictHeroCarousel: React.FC<DistrictHeroCarouselProps> = ({
  items,
  onBookNow,
  onViewDetails,
  onToggleSave = (_id: string) => {},
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = items.length;

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => clearInterval(timer);
  }, [total, isPaused]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const isFree = currentItem.fee === 0;
  const posterSrc = currentItem.posterUrl || currentItem.bannerUrl;

  return (
    <section 
      id="campus-hero-showcase"
      className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 select-none animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Dark Cosmic Glass Surface */}
      <div className="group/hero relative w-full rounded-3xl overflow-hidden bg-slate-900/40 backdrop-blur-2xl border border-white/15 border-t-white/30 border-l-white/20 shadow-[0_15px_45px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(59,130,246,0.15)] p-5 sm:p-7 md:p-8 text-white transition-all duration-300">
        
        {/* Subtle decorative cosmic glow in background */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10 group-hover/hero:bg-blue-500/25 transition-all duration-500" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
          
          {/* LEFT: Student Event Metadata & Call-To-Action */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-3.5 text-left order-2 md:order-1">
            
            {/* Tag Badges: Category, Formats, Rating */}
            <div className="flex flex-wrap items-center gap-2">
              {currentItem.isHot && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="font-serif">Campus Trending</span>
                </span>
              )}

              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-wider font-serif">
                {currentItem.category || currentItem.districtTab}
              </span>

              {currentItem.formats && currentItem.formats.map((fmt) => (
                <span 
                  key={fmt}
                  className="px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/15 text-slate-200 text-[11px] font-medium font-serif"
                >
                  {fmt}
                </span>
              ))}

              {currentItem.rating && (
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current text-cyan-400" />
                  <span className="font-serif">{currentItem.rating}</span>
                  {currentItem.votesCount && (
                    <span className="text-[10px] text-slate-400 font-serif">
                      ({currentItem.votesCount})
                    </span>
                  )}
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-3.5xl font-bold text-white font-serif tracking-tight leading-tight line-clamp-2 group-hover/hero:text-blue-300 transition-colors drop-shadow-md">
                {currentItem.title}
              </h2>
              {currentItem.genres && currentItem.genres.length > 0 && (
                <p className="text-xs sm:text-sm font-medium text-indigo-300 mt-1 font-serif">
                  {currentItem.genres.join(' • ')} {currentItem.languages ? `• ${currentItem.languages.join(', ')}` : ''}
                </p>
              )}
            </div>

            {/* Concise Description */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3 max-w-xl font-serif">
              {currentItem.description}
            </p>

            {/* Date & Location Venue */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-slate-200 font-medium pt-0.5">
              <span className="flex items-center gap-1.5 text-cyan-300 font-semibold font-serif">
                <Calendar className="w-4 h-4 text-cyan-400" />
                {currentItem.date.fullDate || `${currentItem.date.month} ${currentItem.date.day}`}
              </span>
              <span className="flex items-center gap-1.5 text-slate-300 font-serif">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="truncate max-w-[280px]">{currentItem.area || currentItem.venue}</span>
              </span>
            </div>

            {/* Pricing Tag & CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-bold text-white font-serif leading-none">
                  {isFree ? 'FREE ENTRY' : `₹${currentItem.fee}`}
                </span>
                <span className="text-[10px] text-slate-400 font-serif">
                  {currentItem.feeLabel || (isFree ? 'Kit & Certificate Included' : 'Entry Pass')}
                </span>
              </div>

              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => onBookNow(currentItem)}
                id="hero-book-now-btn"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-semibold text-xs sm:text-sm tracking-wide rounded-xl px-6 py-2.5 shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/50 transition-all duration-200 flex items-center gap-2 cursor-pointer font-serif"
              >
                <Ticket className="w-4 h-4 text-cyan-200" />
                <span>{currentItem.isRegistered ? 'View My Pass' : 'Register / Claim Pass'}</span>
              </button>

              <button
                type="button"
                onClick={() => onViewDetails(currentItem)}
                className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-medium text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer font-serif shadow-sm backdrop-blur-md"
              >
                <Info className="w-4 h-4 text-indigo-300" />
                <span>View Details</span>
              </button>
            </div>
          </div>

          {/* RIGHT: High Resolution Poster Card (3:4 Ratio) */}
          <div className="md:col-span-5 flex items-center justify-center relative order-1 md:order-2">
            <div 
              onClick={() => onViewDetails(currentItem)}
              className="relative w-full max-w-[250px] sm:max-w-[270px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/20 hover:border-blue-400/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.4)] group/poster cursor-pointer transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1"
            >
              <img
                key={currentItem.id}
                src={posterSrc}
                alt={currentItem.title}
                className="w-full h-full object-cover group-hover/poster:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Poster Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

              {/* Floating Bookmark Button on Poster */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(currentItem.id);
                }}
                className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all z-20 cursor-pointer hover:scale-110 active:scale-90 duration-200 ${
                  currentItem.isSaved
                    ? 'bg-blue-600/80 border-blue-400 text-cyan-200 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                    : 'bg-slate-950/60 border-white/20 text-white hover:bg-slate-900/80'
                }`}
                title="Save Event"
              >
                <Heart className={`w-3.5 h-3.5 ${currentItem.isSaved ? 'fill-current text-cyan-300' : ''}`} />
              </button>

              {/* Bottom Organizer Badge on Poster */}
              <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between text-left bg-slate-950/70 backdrop-blur-md p-2 rounded-xl border border-white/15">
                <div className="flex items-center gap-2">
                  <img
                    src={currentItem.organizer.avatarUrl}
                    alt={currentItem.organizer.name}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-cyan-400"
                  />
                  <span className="text-[11px] font-semibold text-white truncate max-w-[130px] font-serif">
                    {currentItem.organizer.name}
                  </span>
                </div>
                {currentItem.organizer.isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Left & Right Chevron Navigation */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 hover:text-white text-slate-200 border border-white/20 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/80 hover:bg-blue-600 hover:text-white text-slate-200 border border-white/20 shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-3.5">
        {items.map((it, idx) => (
          <button
            key={it.id}
            type="button"
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentIndex
                ? 'w-8 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_0_8px_#3b82f6]'
                : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
