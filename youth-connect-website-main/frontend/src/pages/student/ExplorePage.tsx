import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Flame, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  Heart, 
  Info, 
  Play, 
  Ticket, 
  Calendar, 
  ShieldCheck, 
  Users, 
  X, 
  SlidersHorizontal,
  Building2,
  CheckCircle2,
  Layers,
  ArrowRight
} from 'lucide-react';
import { EventItem, CommunityClub } from '../../types';

export interface ExplorePageProps {
  events?: EventItem[];
  clubs?: CommunityClub[];
  currentLocation?: string;
  onOpenLocationModal?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSelectEvent?: (event: EventItem) => void;
  onSelectEventForRegistration?: (event: EventItem) => void;
  onViewEventDetail?: (event: EventItem) => void;
  onToggleSave?: (eventId: string) => void;
  onToggleSaveEvent?: (eventId: string) => void;
  onOpenCommunities?: () => void;
  onViewTicket?: (ticketId: string) => void;
}

// ----------------------------------------------------
// Reusable Non-Wrapping 2:3 Vertical Poster Rail
// ----------------------------------------------------
interface ContentRailProps {
  title: string;
  subtitle?: string;
  events: EventItem[];
  onSelectEvent: (event: EventItem) => void;
  onToggleSave: (eventId: string) => void;
  icon?: React.ElementType;
}

const ContentRail: React.FC<ContentRailProps> = ({
  title,
  subtitle,
  events,
  onSelectEvent,
  onToggleSave,
  icon: Icon
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(updateScrollState, 350);
    }
  };

  if (!events || events.length === 0) return null;

  return (
    <section className="relative group/rail my-6 sm:my-10">
      {/* Rail Header */}
      <div className="flex items-end justify-between px-4 sm:px-10 md:px-14 mb-3.5">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#0066ff] shadow-sm">
              <Icon className="w-5 h-5 shrink-0" />
            </div>
          )}
          <div>
            <h3 className="text-lg sm:text-2xl font-black font-headline text-white tracking-tight flex items-center gap-2">
              <span>{title}</span>
              <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover/rail:opacity-100 transition-opacity" />
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-400 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Rail Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-30 w-12 sm:w-16 bg-gradient-to-r from-[#0f1015] via-[#0f1015]/80 to-transparent flex items-center justify-center text-white opacity-0 group-hover/rail:opacity-100 transition-opacity hover:from-[#0f1015]/95 focus:outline-none"
            aria-label="Scroll left"
          >
            <div className="p-2.5 rounded-full bg-black/80 border border-white/20 hover:scale-110 transition-transform shadow-xl">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Right Arrow Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-30 w-12 sm:w-16 bg-gradient-to-l from-[#0f1015] via-[#0f1015]/80 to-transparent flex items-center justify-center text-white opacity-0 group-hover/rail:opacity-100 transition-opacity hover:from-[#0f1015]/95 focus:outline-none"
            aria-label="Scroll right"
          >
            <div className="p-2.5 rounded-full bg-black/80 border border-white/20 hover:scale-110 transition-transform shadow-xl">
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        )}

        {/* Non-wrapping Posters Track */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex items-stretch gap-3.5 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-10 md:px-14 py-4"
        >
          {events.map((evt) => {
            const isFree = evt.fee === 0;

            return (
              <div
                key={evt.id}
                onMouseEnter={() => setHoveredId(evt.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectEvent(evt)}
                className="relative shrink-0 w-[145px] sm:w-[195px] md:w-[230px] aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group/card transition-all duration-300 transform hover:scale-[1.04] hover:z-20 hover:shadow-[0_20px_40px_rgba(0,102,255,0.25)] border border-white/10 hover:border-[#0066ff]/80 bg-[#151722]"
              >
                {/* 2:3 Vertical Artwork */}
                <img
                  src={evt.bannerUrl}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Top Badges: Category & Pricing */}
                <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                  <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-extrabold uppercase text-white tracking-wider border border-white/10">
                    {evt.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-md ${
                    isFree 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-[#0066ff] text-white'
                  }`}>
                    {isFree ? 'FREE' : `₹${evt.fee}`}
                  </span>
                </div>

                {/* Dark Gradient Overlay for legible metadata */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/90 to-transparent p-3 sm:p-4 pt-10 flex flex-col justify-end">
                  {/* Date & Venue */}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-semibold mb-1 truncate">
                    <Calendar className="w-3 h-3 text-[#38bdf8] shrink-0" />
                    <span>{evt.date.month} {evt.date.day}</span>
                    <span>•</span>
                    <span className="truncate text-gray-300">{evt.area || evt.venue}</span>
                  </div>

                  {/* Title */}
                  <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-sm group-hover/card:text-[#38bdf8] transition-colors">
                    {evt.title}
                  </h4>

                  {/* Hover Expansion Controls */}
                  <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between opacity-95 group-hover/card:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(evt);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-black text-[10px] font-black flex items-center gap-1 shadow-md transition-colors"
                    >
                      <Play className="w-2.5 h-2.5 fill-black" />
                      <span>{evt.isRegistered ? 'View Pass' : 'Register'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleSave(evt.id);
                      }}
                      className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                        evt.isSaved
                          ? 'bg-red-500 text-white'
                          : 'bg-white/20 hover:bg-white/35 text-white'
                      }`}
                      title="Bookmark"
                    >
                      <Heart className={`w-3 h-3 ${evt.isSaved ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ----------------------------------------------------
// Main Streaming-Style Explore Page Component
// ----------------------------------------------------
export const ExplorePage: React.FC<ExplorePageProps> = ({
  events = [],
  clubs = [],
  currentLocation = 'Nashik',
  onOpenLocationModal = () => {},
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSelectEvent,
  onSelectEventForRegistration,
  onViewEventDetail,
  onToggleSave,
  onToggleSaveEvent,
  onOpenCommunities = () => {},
  onViewTicket = (_ticketId: string) => {},
}) => {
  const handleSelectEvent = onSelectEvent || onSelectEventForRegistration || (() => {});
  const handleViewDetail = onViewEventDetail || handleSelectEvent;
  const handleToggleSave = onToggleSave || onToggleSaveEvent || (() => {});

  // Local or external search query state
  const [internalSearch, setInternalSearch] = useState('');
  const activeSearchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
  const handleUpdateSearch = (q: string) => {
    if (externalSetSearchQuery) {
      externalSetSearchQuery(q);
    }
    setInternalSearch(q);
  };

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [heroIndex, setHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Published events
  const publishedEvents = useMemo(() => {
    return events.filter((evt) => evt.status === 'Published');
  }, [events]);

  // Dynamic filter based on search input and category chip
  const filteredEvents = useMemo(() => {
    return publishedEvents.filter((evt) => {
      // Category filter matching
      const matchesCategory = 
        selectedCategoryFilter === 'All' ||
        (selectedCategoryFilter === 'Hackathons' && (evt.category === 'Hackathon' || evt.tags.some(t => t.toLowerCase().includes('hackathon') || t.toLowerCase().includes('code')))) ||
        (selectedCategoryFilter === 'Workshops' && (evt.category === 'Workshop' || evt.category === 'Technology' || evt.tags.some(t => t.toLowerCase().includes('workshop')))) ||
        (selectedCategoryFilter === 'NGO Drives' && (evt.category === 'Volunteering' || evt.tags.some(t => t.toLowerCase().includes('ngo') || t.toLowerCase().includes('volunteer') || t.toLowerCase().includes('social')))) ||
        (selectedCategoryFilter === 'Cultural' && (evt.category === 'Cultural' || evt.tags.some(t => t.toLowerCase().includes('cultural') || t.toLowerCase().includes('music') || t.toLowerCase().includes('dance')))) ||
        (selectedCategoryFilter === 'Trending' && (evt.isHot || evt.registeredCount > 100)) ||
        (selectedCategoryFilter === 'Competitions' && (evt.category === 'Competition' || evt.category === 'Sports' || evt.category === 'Gaming'));

      // Search Query matching
      if (!activeSearchQuery.trim()) return matchesCategory;

      const q = activeSearchQuery.toLowerCase();
      const matchesQuery = 
        evt.title.toLowerCase().includes(q) ||
        evt.description.toLowerCase().includes(q) ||
        evt.category.toLowerCase().includes(q) ||
        evt.venue.toLowerCase().includes(q) ||
        (evt.area && evt.area.toLowerCase().includes(q)) ||
        evt.organizer.name.toLowerCase().includes(q) ||
        (evt.tags && evt.tags.some(t => t.toLowerCase().includes(q)));

      return matchesCategory && matchesQuery;
    });
  }, [publishedEvents, selectedCategoryFilter, activeSearchQuery]);

  // Filtered hero items
  const heroEvents = useMemo(() => {
    return publishedEvents
      .filter((e) => e.isHot || e.category === 'Hackathon' || e.category === 'Technology' || e.category === 'Cultural')
      .slice(0, 6);
  }, [publishedEvents]);

  const activeHero = heroEvents[heroIndex % (heroEvents.length || 1)] || publishedEvents[0];

  // Auto-slide hero carousel
  useEffect(() => {
    if (isPaused || heroEvents.length <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroEvents.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, heroEvents.length]);

  // Rails classification based on filtered dataset or full published
  const isSearchActive = activeSearchQuery.trim().length > 0;

  const trendingNashik = filteredEvents.slice(0, 8);
  const happeningThisWeek = filteredEvents.filter(e => e.capacity - e.registeredCount < 65 || e.isHot).slice(0, 8);
  const hackathons = filteredEvents.filter(e => e.category === 'Hackathon' || e.tags.includes('Hackathon') || e.tags.includes('Coding'));
  const volunteerDrives = filteredEvents.filter(e => e.category === 'Volunteering' || e.tags.includes('Volunteering') || e.tags.includes('NGO') || e.tags.includes('Environment'));
  const workshops = filteredEvents.filter(e => e.category === 'Workshop' || e.tags.includes('Workshop') || e.category === 'Technology');
  const culturalFests = filteredEvents.filter(e => e.category === 'Cultural' || e.tags.includes('Cultural') || e.tags.includes('Music'));

  const categoryPills = [
    'All',
    'Hackathons',
    'Workshops',
    'NGO Drives',
    'Cultural',
    'Trending',
    'Competitions'
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f1015] text-white selection:bg-[#0066ff] selection:text-white pb-12">
      {/* 1. TOP HERO (75 - 85vh) CINEMATIC EVENT ARTWORK */}
      {activeHero && !isSearchActive && (
        <section
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[75vh] sm:h-[82vh] md:h-[86vh] overflow-hidden bg-[#0f1015] flex items-end pb-12 sm:pb-16"
        >
          {/* Full-width Cinematic Artwork */}
          <div className="absolute inset-0">
            <img
              key={activeHero.id}
              src={activeHero.bannerUrl}
              alt={activeHero.title}
              className="w-full h-full object-cover object-center transform scale-105 animate-in fade-in duration-700"
            />

            {/* Dark Gradient Overlays */}
            {/* Top Fade */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1015]/90 via-[#0f1015]/30 to-transparent h-40" />

            {/* Bottom Fade to Rails */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/75 to-transparent" />

            {/* Left Vignette for High Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1015] via-[#0f1015]/80 to-transparent sm:w-3/4" />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-10 md:px-14">
            <div className="max-w-2xl sm:max-w-3xl space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-[#0066ff] text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/30">
                  {activeHero.category}
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-gray-200 border border-white/15 text-xs font-bold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#38bdf8]" />
                  <span>{activeHero.area || activeHero.venue}</span>
                </span>
                {activeHero.isHot && (
                  <span className="px-3 py-1 rounded-lg bg-amber-500 text-black text-xs font-black flex items-center gap-1 shadow-md">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    <span>Trending #{heroIndex + 1} in Nashik</span>
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-headline tracking-tight text-white leading-[1.08] drop-shadow-2xl">
                {activeHero.title}
              </h1>

              {/* Event Details Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-semibold text-gray-300">
                <div className="flex items-center gap-1.5 text-[#38bdf8]">
                  <Calendar className="w-4 h-4" />
                  <span>{activeHero.date.fullDate || `${activeHero.date.month} ${activeHero.date.day}, 2026`}</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Clock className="w-4 h-4 text-[#38bdf8]" />
                  <span>{activeHero.date.time}</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                  <span className="text-white">{activeHero.venue}</span>
                </div>
                <div className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-white font-extrabold text-xs">
                  {activeHero.fee === 0 ? 'FREE ENTRY' : `PASS: ₹${activeHero.fee}`}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm md:text-base text-gray-300 font-normal leading-relaxed line-clamp-2 max-w-xl drop-shadow-md">
                {activeHero.description}
              </p>

              {/* Interactive CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleViewDetail(activeHero)}
                  className="px-6 sm:px-8 py-3.5 rounded-xl bg-white hover:bg-gray-200 text-black font-black text-xs sm:text-sm shadow-2xl active:scale-95 transition-all flex items-center gap-2.5"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>{activeHero.isRegistered ? 'View Digital Pass' : 'Register Now'}</span>
                </button>

                <button
                  onClick={() => handleViewDetail(activeHero)}
                  className="px-5 sm:px-6 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/20 text-white font-bold text-xs sm:text-sm active:scale-95 transition-all flex items-center gap-2"
                >
                  <Info className="w-4 h-4" />
                  <span>More Info</span>
                </button>

                <button
                  onClick={() => handleToggleSave(activeHero.id)}
                  className={`p-3.5 rounded-xl border backdrop-blur-md transition-all ${
                    activeHero.isSaved
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-black/50 hover:bg-black/70 text-white border-white/20'
                  }`}
                  title="Bookmark event"
                >
                  <Heart className={`w-4 h-4 ${activeHero.isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Slide Controls */}
          {heroEvents.length > 1 && (
            <div className="absolute right-4 sm:right-10 md:right-14 bottom-12 sm:bottom-16 z-20 flex items-center gap-3">
              <button
                onClick={() => setHeroIndex((prev) => (prev - 1 + heroEvents.length) % heroEvents.length)}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md hover:scale-105 transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div className="flex items-center gap-1.5">
                {heroEvents.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === heroIndex % heroEvents.length
                        ? 'w-6 bg-[#0066ff]'
                        : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setHeroIndex((prev) => (prev + 1) % heroEvents.length)}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white backdrop-blur-md hover:scale-105 transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      )}

      {/* 2. PROMINENT SEARCH & FILTER BAR (High Visibility below Hero) */}
      <section className={`relative z-30 max-w-[1440px] mx-auto px-4 sm:px-10 md:px-14 ${isSearchActive ? 'pt-24 sm:pt-28 mb-8' : '-mt-8 sm:-mt-10 mb-6'}`}>
        <div className="bg-[#12141d]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-black/80 space-y-4">
          {/* Main Input Row */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input Box */}
            <div className="relative flex-1 group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#0066ff] transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="explore-search-input"
                type="text"
                value={activeSearchQuery}
                onChange={(e) => handleUpdateSearch(e.target.value)}
                placeholder="Search hackathons, workshops, NGO drives, tech fests, clubs in Nashik..."
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 focus:bg-[#1a1d29] border border-white/10 focus:border-[#0066ff] text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/40 transition-all font-medium"
              />
              {activeSearchQuery && (
                <button
                  type="button"
                  onClick={() => handleUpdateSearch('')}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition-colors"
                  title="Clear search query"
                >
                  <div className="p-1 rounded-full bg-white/10 hover:bg-white/20">
                    <X className="w-3.5 h-3.5" />
                  </div>
                </button>
              )}
            </div>

            {/* Location & Results Counter Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenLocationModal}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-bold text-gray-200 hover:text-white transition-colors group"
                title="Change Campus Location"
              >
                <MapPin className="w-4 h-4 text-[#0066ff] group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate max-w-[130px]">{currentLocation}</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </button>

              <div className="px-4 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-gray-300 flex items-center gap-1.5 shrink-0">
                <Layers className="w-4 h-4 text-[#38bdf8]" />
                <span>{filteredEvents.length} {filteredEvents.length === 1 ? 'Event' : 'Events'}</span>
              </div>
            </div>
          </div>

          {/* Quick-Filter Category Chips Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-xs font-bold text-gray-400 mr-1 hidden sm:inline shrink-0">
              Quick Filter:
            </span>
            {categoryPills.map((cat) => {
              const isSelected = selectedCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0066ff] text-white shadow-lg shadow-blue-500/25 scale-105 border border-[#0066ff]'
                      : 'bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white border border-white/10'
                  }`}
                >
                  {cat === 'Hackathons' && <span>💻</span>}
                  {cat === 'Workshops' && <span>🛠️</span>}
                  {cat === 'NGO Drives' && <span>🌱</span>}
                  {cat === 'Cultural' && <span>🎭</span>}
                  {cat === 'Trending' && <span>🔥</span>}
                  {cat === 'Competitions' && <span>🏆</span>}
                  <span>{cat}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. INSTANT SEARCH RESULTS VIEW (When actively searching) */}
      {isSearchActive ? (
        <main className="max-w-[1440px] mx-auto px-4 sm:px-10 md:px-14 py-4 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-headline text-white flex items-center gap-2">
                <span>Search Results for "{activeSearchQuery}"</span>
                <span className="text-sm font-normal text-gray-400">({filteredEvents.length} found)</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Showing matching hackathons, workshops, fests, and campus initiatives in {currentLocation}
              </p>
            </div>
            <button
              onClick={() => {
                handleUpdateSearch('');
                setSelectedCategoryFilter('All');
              }}
              className="text-xs font-bold text-[#38bdf8] hover:underline flex items-center gap-1"
            >
              <span>Reset Search</span>
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
              {filteredEvents.map((evt) => {
                const isFree = evt.fee === 0;
                return (
                  <div
                    key={evt.id}
                    onClick={() => handleViewDetail(evt)}
                    className="relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer group/card transition-all duration-300 transform hover:scale-[1.04] hover:z-20 hover:shadow-[0_20px_40px_rgba(0,102,255,0.25)] border border-white/10 hover:border-[#0066ff]/80 bg-[#151722]"
                  >
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none z-10">
                      <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[10px] font-extrabold uppercase text-white tracking-wider border border-white/10">
                        {evt.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase shadow-md ${
                        isFree ? 'bg-emerald-500 text-white' : 'bg-[#0066ff] text-white'
                      }`}>
                        {isFree ? 'FREE' : `₹${evt.fee}`}
                      </span>
                    </div>

                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/90 to-transparent p-3 sm:p-4 pt-10 flex flex-col justify-end">
                      <div className="flex items-center gap-1 text-[10px] text-gray-300 font-semibold mb-1 truncate">
                        <Calendar className="w-3 h-3 text-[#38bdf8] shrink-0" />
                        <span>{evt.date.month} {evt.date.day}</span>
                        <span>•</span>
                        <span className="truncate text-gray-300">{evt.area || evt.venue}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight line-clamp-2 drop-shadow-sm group-hover/card:text-[#38bdf8] transition-colors">
                        {evt.title}
                      </h4>

                      <div className="mt-2.5 pt-2 border-t border-white/15 flex items-center justify-between opacity-95 group-hover/card:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectEvent(evt);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-gray-200 text-black text-[10px] font-black flex items-center gap-1 shadow-md transition-colors"
                        >
                          <Play className="w-2.5 h-2.5 fill-black" />
                          <span>{evt.isRegistered ? 'Pass' : 'Register'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSave(evt.id);
                          }}
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                            evt.isSaved ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/35 text-white'
                          }`}
                          title="Bookmark"
                        >
                          <Heart className={`w-3 h-3 ${evt.isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center bg-[#151722] rounded-3xl border border-white/10 my-6">
              <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">No events match "{activeSearchQuery}"</h3>
              <p className="text-xs text-gray-400 mb-4 max-w-md mx-auto">
                Try searching for broader keywords like "hackathon", "workshop", "music", or switch your category filter.
              </p>
              <button
                onClick={() => {
                  handleUpdateSearch('');
                  setSelectedCategoryFilter('All');
                }}
                className="px-5 py-2 rounded-xl bg-[#0066ff] hover:bg-[#0055d6] text-white text-xs font-bold shadow-lg shadow-blue-500/20"
              >
                Show All Campus Events
              </button>
            </div>
          )}
        </main>
      ) : (
        /* 4. NETFLIX-STYLE STREAMING CONTENT RAILS */
        <main className="max-w-[1440px] mx-auto space-y-4 sm:space-y-6">
          {/* Rail 1: Trending in Nashik */}
          <ContentRail
            title={`🔥 Trending in ${currentLocation}`}
            subtitle="Flagship fests, hackathons, and highest student registrations"
            events={trendingNashik}
            onSelectEvent={handleViewDetail}
            onToggleSave={handleToggleSave}
            icon={Flame}
          />

          {/* Rail 2: Happening This Week */}
          {happeningThisWeek.length > 0 && (
            <ContentRail
              title="⚡ Happening This Week"
              subtitle="Closing registrations & passes starting soon across Nashik colleges"
              events={happeningThisWeek}
              onSelectEvent={handleViewDetail}
              onToggleSave={handleToggleSave}
              icon={Clock}
            />
          )}

          {/* Rail 3: Hackathons */}
          {hackathons.length > 0 && (
            <ContentRail
              title="💻 Hackathons & Coding Sprints"
              subtitle="24h dev jams, cash prize pools, mentor sessions, and demo days"
              events={hackathons}
              onSelectEvent={handleViewDetail}
              onToggleSave={handleToggleSave}
              icon={Sparkles}
            />
          )}

          {/* Rail 4: NGO Volunteer Drives */}
          {volunteerDrives.length > 0 && (
            <ContentRail
              title="🌱 NGO Volunteer Drives & Social Impact"
              subtitle="Environmental cleanup, social empowerment, and community certificates"
              events={volunteerDrives}
              onSelectEvent={handleViewDetail}
              onToggleSave={handleToggleSave}
              icon={Users}
            />
          )}

          {/* Rail 5: Certified Workshops */}
          {workshops.length > 0 && (
            <ContentRail
              title="🛠️ Certified Tech Workshops"
              subtitle="Hands-on AI/ML, Cloud Systems, UI/UX, and IoT engineering"
              events={workshops}
              onSelectEvent={handleViewDetail}
              onToggleSave={handleToggleSave}
              icon={Calendar}
            />
          )}

          {/* Rail 6: Cultural Fests */}
          {culturalFests.length > 0 && (
            <ContentRail
              title="🎭 Cultural Fests & Live Concerts"
              subtitle="Music, dance, photography walks, drama fests, and campus evenings"
              events={culturalFests}
              onSelectEvent={handleViewDetail}
              onToggleSave={handleToggleSave}
              icon={Flame}
            />
          )}

          {/* Communities Section */}
          {clubs.length > 0 && (
            <section className="px-4 sm:px-10 md:px-14 my-10">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg sm:text-2xl font-black font-headline text-white tracking-tight flex items-center gap-2">
                    <span>🏛️ Campus Chapters & Clubs</span>
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Join active developer clubs, technical councils, and student circles
                  </p>
                </div>

                <button
                  onClick={onOpenCommunities}
                  className="text-xs font-bold text-[#38bdf8] hover:underline flex items-center gap-1"
                >
                  <span>View All Clubs</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.slice(0, 3).map((club) => (
                  <div
                    key={club.id}
                    onClick={onOpenCommunities}
                    className="bg-[#151722] hover:bg-[#1c1f2e] border border-white/10 hover:border-[#0066ff]/60 rounded-2xl p-4 transition-all duration-200 cursor-pointer flex items-center gap-4 group shadow-md"
                  >
                    <img
                      src={club.logoUrl}
                      alt={club.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-white/10 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate group-hover:text-[#38bdf8] transition-colors">
                          {club.name}
                        </h4>
                        {club.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-[#0066ff] shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate mt-0.5">{club.college}</p>
                      <div className="flex items-center gap-2 mt-2 text-[11px] text-gray-400">
                        <span>👥 {club.membersCount} Members</span>
                        <span>•</span>
                        <span className="text-[#38bdf8]">Join Circle →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
};

export default ExplorePage;
