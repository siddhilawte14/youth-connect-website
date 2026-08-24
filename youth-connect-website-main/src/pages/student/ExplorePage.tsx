import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  SlidersHorizontal, 
  Ticket, 
  Compass, 
  Flame, 
  Calendar,
  X,
  Filter,
  Layers,
  GraduationCap,
  Code,
  Music,
  HeartHandshake,
  Cpu,
  Trophy
} from 'lucide-react';
import { EventItem, CommunityClub, CampusNavTab } from '../../types';
import { DistrictHeroCarousel } from '../../components/DistrictHeroCarousel';
import { DistrictPosterRail } from '../../components/DistrictPosterRail';
import { FilterSlideOverModal, FilterCriteria } from '../../components/FilterSlideOverModal';

export interface ExplorePageProps {
  events?: EventItem[];
  clubs?: CommunityClub[];
  currentLocation?: string;
  onOpenLocationModal?: () => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  activeDistrictTab?: CampusNavTab;
  onSelectDistrictTab?: (tab: CampusNavTab) => void;
  onSelectEvent?: (event: EventItem) => void;
  onSelectEventForRegistration?: (event: EventItem) => void;
  onViewEventDetail?: (event: EventItem) => void;
  onToggleSave?: (eventId: string) => void;
  onToggleSaveEvent?: (eventId: string) => void;
  onOpenCommunities?: () => void;
  onViewTicket?: (ticketId: string) => void;
  onOpenAuthModal?: (targetEvent?: EventItem) => void;
  isFilterOpen?: boolean;
  setIsFilterOpen?: (open: boolean) => void;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  events = [],
  clubs = [],
  currentLocation = 'Nashik',
  onOpenLocationModal = () => {},
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  activeDistrictTab = 'Explore',
  onSelectDistrictTab,
  onSelectEvent,
  onSelectEventForRegistration,
  onViewEventDetail,
  onToggleSave,
  onToggleSaveEvent,
  onOpenCommunities = () => {},
  onViewTicket = (_ticketId: string) => {},
  onOpenAuthModal,
  isFilterOpen: propIsFilterOpen,
  setIsFilterOpen: propSetIsFilterOpen,
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

  // Filter Drawer State
  const [internalFilterOpen, setInternalFilterOpen] = useState(false);
  const isFilterModalOpen = propIsFilterOpen !== undefined ? propIsFilterOpen : internalFilterOpen;
  const setFilterModalOpen = propSetIsFilterOpen || setInternalFilterOpen;

  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    genres: [],
    languages: [],
    formats: [],
    priceRange: 'all',
  });

  // Base published events
  const publishedEvents = useMemo(() => {
    return events.filter((evt) => evt.status === 'Published');
  }, [events]);

  // Tab Filtering & Query Filtering
  const tabFilteredEvents = useMemo(() => {
    if (activeDistrictTab === 'Explore') {
      return publishedEvents;
    }
    return publishedEvents.filter((evt) => {
      if (evt.districtTab === activeDistrictTab) return true;
      if (activeDistrictTab === 'Hackathons' && (evt.category === 'Hackathon' || evt.category === 'Competitions')) return true;
      if (activeDistrictTab === 'College Fests' && (evt.category === 'Cultural' || evt.tags.includes('College Fest'))) return true;
      if (activeDistrictTab === 'NGO Drives' && (evt.category === 'NGO Drives' || evt.category === 'Volunteering' || evt.tags.includes('NGO Drive') || evt.tags.includes('Volunteering') || evt.genres?.includes('Social Impact') || evt.genres?.includes('Volunteering'))) return true;
      if (activeDistrictTab === 'Workshops' && (evt.category === 'Workshop' || evt.category === 'Technology' || evt.category === 'Entrepreneurship')) return true;
      return false;
    });
  }, [publishedEvents, activeDistrictTab]);

  // Apply Multi-Select Criteria (Genre, Language, Format, Price) + Search
  const filteredEvents = useMemo(() => {
    return tabFilteredEvents.filter((evt) => {
      // 1. Genre filter
      if (activeFilters.genres.length > 0) {
        const hasMatchingGenre = 
          evt.genres?.some((g) => activeFilters.genres.includes(g)) ||
          activeFilters.genres.includes(evt.category as string) ||
          (activeFilters.genres.includes('NGO Volunteer Drives') && (evt.category === 'NGO Drives' || evt.category === 'Volunteering' || evt.tags.includes('NGO Drive'))) ||
          (activeFilters.genres.includes('Social Initiatives') && (evt.genres?.includes('Social Impact') || evt.tags.includes('Social Impact')));
        if (!hasMatchingGenre) return false;
      }

      // 2. Language filter
      if (activeFilters.languages.length > 0) {
        const hasMatchingLang = evt.languages?.some((l) => activeFilters.languages.includes(l));
        if (!hasMatchingLang) return false;
      }

      // 3. Format filter
      if (activeFilters.formats.length > 0) {
        const hasMatchingFormat = evt.formats?.some((f) => activeFilters.formats.includes(f));
        if (!hasMatchingFormat) return false;
      }

      // 4. Price range filter
      if (activeFilters.priceRange === 'free' && evt.fee !== 0) return false;
      if (activeFilters.priceRange === 'under500' && (evt.fee === 0 || evt.fee > 200)) return false;

      // 5. Search query matching
      if (activeSearchQuery.trim()) {
        const q = activeSearchQuery.toLowerCase();
        const matches = 
          evt.title.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q) ||
          evt.category.toLowerCase().includes(q) ||
          evt.venue.toLowerCase().includes(q) ||
          (evt.area && evt.area.toLowerCase().includes(q)) ||
          (evt.city && evt.city.toLowerCase().includes(q)) ||
          evt.organizer.name.toLowerCase().includes(q) ||
          (evt.genres && evt.genres.some((g) => g.toLowerCase().includes(q))) ||
          (evt.tags && evt.tags.some((t) => t.toLowerCase().includes(q)));
        if (!matches) return false;
      }

      return true;
    });
  }, [tabFilteredEvents, activeFilters, activeSearchQuery]);

  // Hero Items for Auto-scrolling centered carousel
  const heroItems = useMemo(() => {
    const list = tabFilteredEvents.filter((e) => e.isHot || e.rating || e.fee >= 0);
    return list.length > 0 ? list.slice(0, 5) : publishedEvents.slice(0, 5);
  }, [tabFilteredEvents, publishedEvents]);

  // Rails Curations for Student Platform
  const trendingNow = useMemo(() => {
    return filteredEvents.filter((e) => e.isHot || (e.rating && parseFloat(e.rating) >= 4.8)).slice(0, 8);
  }, [filteredEvents]);

  const hackathonsAndSprints = useMemo(() => {
    return filteredEvents.filter((e) => e.category === 'Hackathon' || e.districtTab === 'Hackathons' || e.tags.includes('Hackathon'));
  }, [filteredEvents]);

  const culturalFestsAndConcerts = useMemo(() => {
    return filteredEvents.filter((e) => e.category === 'Cultural' || e.districtTab === 'College Fests' || e.tags.includes('College Fest'));
  }, [filteredEvents]);

  const ngoAndVolunteering = useMemo(() => {
    return filteredEvents.filter((e) => e.category === 'NGO Drives' || e.category === 'Volunteering' || e.districtTab === 'NGO Drives' || e.tags.includes('NGO Drive') || evtMatchesNGO(e));
  }, [filteredEvents]);

  function evtMatchesNGO(e: EventItem) {
    return e.genres?.includes('Social Impact') || e.genres?.includes('Volunteering') || e.tags?.includes('Volunteering') || e.tags?.includes('NGO Drive') || e.tags?.includes('Environment');
  }

  const technicalWorkshops = useMemo(() => {
    return filteredEvents.filter((e) => e.category === 'Workshop' || e.districtTab === 'Workshops' || e.genres?.includes('Tech') || e.category === 'Entrepreneurship');
  }, [filteredEvents]);

  const sportsAndGaming = useMemo(() => {
    return filteredEvents.filter((e) => e.category === 'Competitions' || e.tags.includes('E-Sports') || e.tags.includes('Robotics'));
  }, [filteredEvents]);

  const activeFiltersCount = 
    activeFilters.genres.length + 
    activeFilters.languages.length + 
    activeFilters.formats.length + 
    (activeFilters.priceRange !== 'all' ? 1 : 0);

  const handleBookNow = (item: EventItem) => {
    if (onOpenAuthModal) {
      onOpenAuthModal(item);
    } else {
      handleSelectEvent(item);
    }
  };

  const QUICK_FILTER_PILLS: { tab: CampusNavTab; label: string; icon: React.ElementType }[] = [
    { tab: 'Explore', label: 'All Events', icon: Compass },
    { tab: 'Hackathons', label: 'Hackathons', icon: Code },
    { tab: 'College Fests', label: 'College Fests', icon: Music },
    { tab: 'NGO Drives', label: 'NGO Drives', icon: HeartHandshake },
    { tab: 'Workshops', label: 'Workshops', icon: Cpu },
  ];

  return (
    <div className="w-full min-h-screen bg-transparent text-white font-serif pt-16 pb-20">
      
      {/* Search Header Bar (If Active Search) */}
      {activeSearchQuery.trim() && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="p-3.5 rounded-2xl glass-panel-3d bg-slate-900/40 backdrop-blur-2xl border border-white/15 shadow-lg flex items-center justify-between font-serif">
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <Search className="w-4 h-4 text-cyan-400" />
              <span>Results for "<strong className="text-white">{activeSearchQuery}</strong>"</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-cyan-300 font-semibold backdrop-blur-md">
                {filteredEvents.length} events found
              </span>
            </div>
            <button
              onClick={() => handleUpdateSearch('')}
              className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 transition-colors font-serif cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. QUICK-FILTER PILL BAR UNDER THE HERO / NAV             */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-2 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 glass-panel-3d bg-slate-900/40 backdrop-blur-2xl border border-white/15 shadow-lg p-2.5 rounded-2xl">
          
          {/* Quick Filter Pill Scroller with Reactive Gradient Masks */}
          <div className="relative flex-1 overflow-hidden">
            {/* Left Edge Gradient Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#070913]/90 to-transparent pointer-events-none z-10 opacity-70" />
            
            {/* Right Edge Gradient Fade */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#070913]/90 to-transparent pointer-events-none z-10 opacity-70" />

            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none [webkit-overflow-scrolling:touch] scroll-smooth py-0.5 px-2 font-serif">
              {QUICK_FILTER_PILLS.map((pill) => {
                const IconComp = pill.icon;
                const isSelected = activeDistrictTab === pill.tab;
                return (
                  <button
                    key={pill.tab}
                    type="button"
                    onClick={() => {
                      if (onSelectDistrictTab) onSelectDistrictTab(pill.tab);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-blue-400/50 font-semibold'
                        : 'bg-white/[0.05] text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-blue-400/40 backdrop-blur-md'
                    }`}
                  >
                    <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : pill.tab === 'NGO Drives' ? 'text-indigo-300' : pill.tab === 'Hackathons' ? 'text-blue-300' : pill.tab === 'Workshops' ? 'text-cyan-300' : 'text-purple-300'}`} />
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Filter Drawer Trigger */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0 font-serif pl-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-medium text-white">{currentLocation} Hub</span>
            </div>

            <button
              onClick={() => setFilterModalOpen(true)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md ${
                activeFiltersCount > 0
                  ? 'bg-blue-600/30 border-blue-400 text-cyan-200 shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                  : 'bg-white/[0.05] hover:bg-white/10 border-white/10 text-slate-300 hover:text-white hover:border-blue-400/40'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-cyan-300" />
              <span>More Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. AUTO-SCROLLING CENTERED HERO SHOWCASE                  */}
      {/* ========================================================= */}
      {!activeSearchQuery.trim() && activeDistrictTab === 'Explore' && (
        <DistrictHeroCarousel
          items={heroItems}
          onBookNow={handleBookNow}
          onViewDetails={handleViewDetail}
          onToggleSave={handleToggleSave}
        />
      )}

      {/* ========================================================= */}
      {/* 3. STUDENT CONTENT RAILS (3:4 RATIO POSTERS)              */}
      {/* ========================================================= */}
      <div className="space-y-3 sm:space-y-4">
        
        {/* Rail 1: Trending Across Nashik Campuses */}
        {activeDistrictTab === 'Explore' && trendingNow.length > 0 && (
          <DistrictPosterRail
            title={`Trending in ${currentLocation} Colleges`}
            subtitle="Flagship hackathons, inter-college fests, and student summits"
            items={trendingNow}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={Flame}
          />
        )}

        {/* Rail 2: Dedicated NGO Volunteer Drives & Social Impact Rail */}
        {(activeDistrictTab === 'Explore' || activeDistrictTab === 'NGO Drives') && ngoAndVolunteering.length > 0 && (
          <DistrictPosterRail
            title="🌱 NGO Volunteer Drives & Social Impact"
            subtitle="Environmental cleanups, social awareness drives, and community service"
            items={ngoAndVolunteering}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={HeartHandshake}
          />
        )}

        {/* Rail 3: Hackathons & Coding Sprints */}
        {(activeDistrictTab === 'Explore' || activeDistrictTab === 'Hackathons') && hackathonsAndSprints.length > 0 && (
          <DistrictPosterRail
            title="Hackathons & AI Coding Sprints"
            subtitle="24h prototype marathons, cash prize pools, and fast-track interviews"
            items={hackathonsAndSprints}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={Code}
          />
        )}

        {/* Rail 4: Inter-College Cultural Fests */}
        {(activeDistrictTab === 'Explore' || activeDistrictTab === 'College Fests') && culturalFestsAndConcerts.length > 0 && (
          <DistrictPosterRail
            title="Inter-College Cultural Fests & Concerts"
            subtitle="Live bands, street plays, dance battles, and grand celebrity nights"
            items={culturalFestsAndConcerts}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={Music}
          />
        )}

        {/* Rail 5: Technical Workshops & Bootcamps */}
        {(activeDistrictTab === 'Explore' || activeDistrictTab === 'Workshops') && technicalWorkshops.length > 0 && (
          <DistrictPosterRail
            title="Hands-On Workshops & Bootcamps"
            subtitle="Generative AI, Web3 labs, robotics, UI/UX sprints, and startup pitch clinics"
            items={technicalWorkshops}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={Cpu}
          />
        )}

        {/* Rail 6: E-Sports & Robotics Competitions */}
        {activeDistrictTab === 'Explore' && sportsAndGaming.length > 0 && (
          <DistrictPosterRail
            title="E-Sports LAN & Robotics Arenas"
            subtitle="Collegiate gaming tournaments, combat robots, and autonomous drone tracks"
            items={sportsAndGaming}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={Trophy}
          />
        )}

        {/* If activeDistrictTab specific view has matching events */}
        {activeDistrictTab !== 'Explore' && filteredEvents.length > 0 && (
          <DistrictPosterRail
            title={`All ${activeDistrictTab} in ${currentLocation}`}
            subtitle={`Explore all verified ${activeDistrictTab.toLowerCase()} entries`}
            items={filteredEvents}
            onSelectItem={handleViewDetail}
            onBookNow={handleBookNow}
            onToggleSave={handleToggleSave}
            icon={Compass}
          />
        )}

        {/* If no events match query */}
        {filteredEvents.length === 0 && (
          <div className="max-w-md mx-auto my-14 p-7 rounded-3xl glass-panel-3d bg-slate-900/40 backdrop-blur-2xl border border-white/15 text-center shadow-2xl font-serif">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-400/40 text-cyan-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white font-serif">
              No Campus Events Match Your Filter
            </h4>
            <p className="text-xs text-slate-300 mt-1 mb-5 font-serif leading-relaxed">
              Try selecting a different campus category or clearing the search query.
            </p>
            <button
              onClick={() => {
                handleUpdateSearch('');
                setActiveFilters({ genres: [], languages: [], formats: [], priceRange: 'all' });
                if (onSelectDistrictTab) onSelectDistrictTab('Explore');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(59,130,246,0.35)] border border-blue-400/50 font-serif cursor-pointer active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Slide-over Multi-Select Filter Modal */}
      <FilterSlideOverModal
        isOpen={isFilterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={activeFilters}
        onApplyFilters={(f) => setActiveFilters(f)}
        onClearFilters={() => setActiveFilters({ genres: [], languages: [], formats: [], priceRange: 'all' })}
        totalMatchingResults={filteredEvents.length}
      />
    </div>
  );
};
