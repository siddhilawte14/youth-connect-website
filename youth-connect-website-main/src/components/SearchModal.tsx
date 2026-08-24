import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  Flame,
  Users
} from 'lucide-react';
import { EventItem, CommunityClub } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: EventItem[];
  clubs: CommunityClub[];
  onSelectEvent: (event: EventItem) => void;
  onSelectCategory: (category: string) => void;
  onSelectClub: (club: CommunityClub) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  events,
  clubs,
  onSelectEvent,
  onSelectCategory,
  onSelectClub,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const popularSuggestions = [
    'Nashik TechSprint 2026',
    'Symphony Cultural Fest',
    'Godavari River Cleanup',
    'Generative AI Bootcamp',
    'E-Sports Valorant LAN',
    'RoboQuest Combat Bot',
    'Figma UI/UX Sprint',
    'KKWIEER Campus'
  ];

  const categories = [
    'Hackathon',
    'College Fests',
    'NGO Drives',
    'Workshop',
    'Competitions',
    'AI & Web3',
    'Cultural',
    'Entrepreneurship'
  ];

  const filteredEvents = query.trim() ? events.filter(e => 
    e.title.toLowerCase().includes(query.toLowerCase()) ||
    e.venue.toLowerCase().includes(query.toLowerCase()) ||
    e.description.toLowerCase().includes(query.toLowerCase()) ||
    e.tags.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    e.organizer.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6) : [];

  const filteredClubs = query.trim() ? clubs.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.college.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-150 font-serif">
      <div className="bg-white text-stone-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] font-serif">
        {/* Search Input Bar */}
        <div className="p-3.5 sm:p-4 border-b border-stone-200 flex items-center gap-2.5 bg-stone-50">
          <Search className="w-5 h-5 text-[#8B7CB6] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campus hackathons, fests, workshops, or clubs in Nashik..."
            className="w-full text-sm sm:text-base text-stone-900 placeholder-stone-400 bg-transparent focus:outline-none font-medium font-serif"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-0.5 rounded-lg bg-stone-200 text-[11px] text-stone-700 font-semibold hover:bg-stone-300 transition-colors shrink-0 cursor-pointer font-serif"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 font-serif">
          {/* If there is a search query */}
          {query.trim() ? (
            <div className="space-y-4">
              {filteredEvents.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-[#8B7CB6]" />
                    <span>Campus Events ({filteredEvents.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredEvents.map((evt) => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          onSelectEvent(evt);
                          onClose();
                        }}
                        className="p-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#8B7CB6] transition-all flex items-center justify-between cursor-pointer group font-serif shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={evt.posterUrl || evt.bannerUrl}
                            alt={evt.title}
                            className="w-10 h-10 rounded-xl object-cover shrink-0"
                          />
                          <div className="truncate">
                            <h5 className="font-bold text-xs text-stone-900 group-hover:text-[#7C6BA6] truncate font-serif">
                              {evt.title}
                            </h5>
                            <p className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5 font-serif">
                              <span>{evt.venue}</span>
                              <span>•</span>
                              <span className="text-[#7C6BA6] font-semibold">
                                {evt.fee === 0 ? 'FREE' : `₹${evt.fee}`}
                              </span>
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#7C6BA6] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredClubs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-serif">
                    <Users className="w-3.5 h-3.5 text-[#8B7CB6]" />
                    <span>Campus Clubs ({filteredClubs.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {filteredClubs.map((club) => (
                      <div
                        key={club.id}
                        onClick={() => {
                          onSelectClub(club);
                          onClose();
                        }}
                        className="p-2.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-200 hover:border-[#8B7CB6] transition-all flex items-center justify-between cursor-pointer group font-serif shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={club.logoUrl}
                            alt={club.name}
                            className="w-9 h-9 rounded-xl object-cover"
                          />
                          <div>
                            <h5 className="font-bold text-xs text-stone-900 group-hover:text-[#7C6BA6] font-serif">
                              {club.name}
                            </h5>
                            <p className="text-[11px] text-stone-500 font-serif">{club.college} • {club.membersCount} members</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#7C6BA6] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredEvents.length === 0 && filteredClubs.length === 0 && (
                <div className="text-center py-6 text-stone-400 text-xs font-serif">
                  No campus events or clubs match "{query}". Try a different keyword.
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Popular Searches */}
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1 font-serif">
                  <Flame className="w-3.5 h-3.5 text-[#8B7CB6]" />
                  <span>Trending on Campus</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 font-serif">
                  {popularSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setQuery(s)}
                      className="px-2.5 py-1 rounded-xl bg-stone-50 hover:bg-[#8B7CB6] hover:text-white text-stone-700 text-xs font-medium border border-stone-200 hover:border-[#8B7CB6] transition-all cursor-pointer font-serif"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1 font-serif">
                  <Tag className="w-3.5 h-3.5 text-[#8B7CB6]" />
                  <span>Explore by Category</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-serif">
                  {categories.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        onSelectCategory(c);
                        onClose();
                      }}
                      className="p-2.5 rounded-2xl bg-stone-50 hover:bg-[#8B7CB6] text-stone-700 hover:text-white border border-stone-200 hover:border-[#8B7CB6] text-xs font-medium transition-all text-center cursor-pointer font-serif"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
