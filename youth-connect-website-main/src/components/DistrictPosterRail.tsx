import React, { useRef, useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Calendar, 
  MapPin, 
  Ticket, 
  Heart
} from 'lucide-react';
import { EventItem } from '../types';

interface DistrictPosterRailProps {
  title: string;
  subtitle?: string;
  items: EventItem[];
  onSelectItem: (item: EventItem) => void;
  onBookNow: (item: EventItem) => void;
  onToggleSave?: (itemId: string) => void;
  icon?: React.ElementType;
  seeAllAction?: () => void;
}

export const DistrictPosterRail: React.FC<DistrictPosterRailProps> = ({
  title,
  subtitle,
  items,
  onSelectItem,
  onBookNow,
  onToggleSave = (_itemId: string) => {},
  icon: Icon,
  seeAllAction,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);
    }
  };

  React.useEffect(() => {
    checkScroll();
    const handleResize = () => checkScroll();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const handleScroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: dir === 'left' ? -offset : offset,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 350);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 my-6 group/rail font-serif animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-3.5">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-400/40 text-cyan-300 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.25)] backdrop-blur-md">
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div>
            <h3 className="text-base sm:text-xl font-bold text-white tracking-tight flex items-center gap-2 font-serif drop-shadow-md">
              <span>{title}</span>
              <span className="text-xs font-semibold text-cyan-300 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 font-serif backdrop-blur-md">
                {items.length}
              </span>
            </h3>
            {subtitle && (
              <p className="text-xs text-indigo-200 font-normal mt-0.5 font-serif">{subtitle}</p>
            )}
          </div>
        </div>

        {seeAllAction && (
          <button
            type="button"
            onClick={seeAllAction}
            className="text-xs font-medium text-cyan-300 hover:text-white flex items-center gap-1.5 transition-colors font-serif cursor-pointer hover:translate-x-0.5 duration-200"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Rail Carousel Track Wrapper with Reactive Fade Overlays */}
      <div className="relative">
        {/* Left Reactive Edge Gradient Fade Overlay */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-r from-[#070913] via-[#070913]/60 to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Right Reactive Edge Gradient Fade Overlay */}
        <div 
          className={`absolute right-0 top-0 bottom-0 w-12 sm:w-16 bg-gradient-to-l from-[#070913] via-[#070913]/60 to-transparent pointer-events-none z-20 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />

        {/* Floating Left Navigation Chevron */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          disabled={!canScrollLeft}
          className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/60 backdrop-blur-xl text-white border border-white/20 shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-600 hover:border-blue-400 cursor-pointer ${
            canScrollLeft 
              ? 'opacity-0 group-hover/rail:opacity-100 focus:opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Floating Right Navigation Chevron */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          disabled={!canScrollRight}
          className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950/60 backdrop-blur-xl text-white border border-white/20 shadow-[0_8px_25px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-blue-600 hover:border-blue-400 cursor-pointer ${
            canScrollRight 
              ? 'opacity-0 group-hover/rail:opacity-100 focus:opacity-100 pointer-events-auto' 
              : 'opacity-0 pointer-events-none'
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scroll-Snap Track */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none [webkit-overflow-scrolling:touch] py-3 px-1"
        >
          {items.map((item) => {
            const isFree = item.fee === 0;
            const posterSrc = item.posterUrl || item.bannerUrl;
            const isNgoDrive = 
              item.category === 'NGO Drives' || 
              item.category === 'NGO / Social Impact' || 
              item.districtTab === 'NGO Drives' || 
              item.tags?.includes('VOLUNTEER') || 
              item.tags?.includes('NGO Drive') ||
              item.genres?.includes('Social Impact') ||
              item.genres?.includes('Volunteering');

            const highlightTags = item.tags?.filter(t => 
              ['VOLUNTEER', 'CERTIFICATE PROVIDED', 'COMMUNITY HOURS', 'Eco Action', 'Education', 'Urban Forestry', 'Trending', 'Prize Pool'].includes(t)
            ) || [];

            const formattedDate = eventDateDisplay(item);

            return (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group/card relative snap-start shrink-0 w-[200px] sm:w-[235px] md:w-[260px] rounded-3xl bg-slate-900/40 backdrop-blur-2xl border border-white/15 border-t-white/30 border-l-white/20 hover:border-blue-400/60 hover:shadow-[0_15px_40px_rgba(59,130,246,0.3)] shadow-[0_12px_36px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(59,130,246,0.15)] overflow-hidden cursor-pointer flex flex-col transition-all duration-300 ease-out transform-gpu hover:-translate-y-2 hover:scale-[1.02] font-serif"
              >
                {/* 3:4 Aspect Ratio Poster Box with 3D crystal zoom */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-black/40">
                  <img
                    src={posterSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover/card:scale-108 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient atmospheric bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white shadow-md backdrop-blur-md font-serif ${
                      isNgoDrive 
                        ? 'bg-indigo-500/30 border border-indigo-400/60 text-indigo-200 shadow-[0_0_10px_rgba(99,102,241,0.3)]' 
                        : 'bg-blue-500/25 border border-blue-400/50 text-cyan-200 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                    }`}>
                      {isNgoDrive ? '🌱 VOLUNTEER' : (item.category || item.districtTab)}
                    </span>

                    {/* Integrated Date Pill Badge */}
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-slate-200 font-mono text-[10px] font-bold tracking-tight">
                        {formattedDate.toUpperCase()}
                      </span>

                      {/* Bookmark heart with micro-interaction */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item.id);
                        }}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 cursor-pointer ${
                          item.isSaved
                            ? 'bg-blue-600 border border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                            : 'bg-slate-950/70 text-white hover:bg-slate-900 border border-white/20'
                        }`}
                        title={item.isSaved ? 'Remove from saved' : 'Save event'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${item.isSaved ? 'fill-current text-cyan-300' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Highlight pill tags overlaid near top-mid */}
                  {highlightTags.length > 0 && (
                    <div className="absolute top-10 left-2.5 flex flex-wrap gap-1 z-10 max-w-[85%]">
                      {highlightTags.slice(0, 2).map(tag => (
                        <span 
                          key={tag} 
                          className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-cyan-300 border border-cyan-400/30 uppercase tracking-tight font-serif"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom info on Poster */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between text-white font-serif">
                    {item.rating ? (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-cyan-400/30">
                        <Star className="w-3 h-3 fill-current text-cyan-400" />
                        <span>{item.rating}</span>
                      </span>
                    ) : <span />}

                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/30 shadow-sm">
                      {isFree ? 'FREE ENTRY' : `₹${item.fee}`}
                    </span>
                  </div>
                </div>

                {/* Card Meta Content with Translucent Base */}
                <div className="p-3.5 flex flex-col flex-1 justify-between text-left space-y-2.5 bg-slate-950/40 text-slate-300">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1 group-hover/card:text-cyan-300 transition-colors duration-200 font-serif drop-shadow-sm">
                      {item.title}
                    </h4>

                    {/* Tags row */}
                    <div className="flex flex-wrap items-center gap-1 mt-1 font-serif">
                      {item.tags?.includes('CERTIFICATE PROVIDED') && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                          📜 CERTIFIED
                        </span>
                      )}
                      {item.tags?.includes('COMMUNITY HOURS') && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                          ⏱ COMMUNITY HRS
                        </span>
                      )}
                      {item.genres && item.genres.length > 0 && !item.tags?.includes('CERTIFICATE PROVIDED') && (
                        <p className="text-[10px] text-indigo-300 line-clamp-1 font-normal font-serif">
                          {item.genres.slice(0, 2).join(' • ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300 font-serif">
                    <div className="flex items-center gap-1.5 text-cyan-300 font-medium">
                      <Calendar className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                      <span>{formattedDate}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
                      <span className="truncate">{item.area || item.venue}</span>
                    </div>
                  </div>

                  {/* 1-Click Action Glowing Glass Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onBookNow(item);
                    }}
                    className="w-full mt-1 py-2 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-semibold text-xs transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(59,130,246,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] border border-blue-400/50 font-serif cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-cyan-200" />
                    <span>
                      {item.isRegistered 
                        ? 'View Pass →' 
                        : (isNgoDrive ? 'Join Drive →' : (isFree ? 'Register Free →' : 'Get Pass →'))}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

function eventDateDisplay(item: EventItem): string {
  if (item.date?.fullDate) return item.date.fullDate;
  if (item.date?.month && item.date?.day) return `${item.date.month} ${item.date.day}`;
  return 'Upcoming';
}
