import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Tag, 
  TrendingUp, 
  CheckCircle2, 
  Flame,
  Play
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
    'Hackathons',
    'Workshops near me',
    'College fests',
    'Coding competitions',
    'Volunteer opportunities',
    'Events this weekend',
    'KKWIEER',
    'Sandip Foundation'
  ];

  const categories = [
    'Hackathon',
    'Technology',
    'Workshop',
    'Cultural',
    'Competitions',
    'Volunteering',
    'Meetup',
    'Career'
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
    <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#0e1017] text-white rounded-3xl w-full max-w-2xl shadow-2xl border border-white/15 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-[#141722]">
          <Search className="w-6 h-6 text-[#0066ff] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, fests, hackathons, or clubs in Nashik..."
            className="w-full text-base sm:text-lg text-white placeholder-gray-400 bg-transparent focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg bg-white/10 text-xs text-gray-300 font-bold hover:bg-white/20 transition-colors shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* If there is a search query */}
          {query.trim() ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                <span>EVENTS ({filteredEvents.length})</span>
                {filteredEvents.length > 0 && <span>Click to explore</span>}
              </div>

              {filteredEvents.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No events found matching "{query}". Try another keyword or browse categories below.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredEvents.map((evt) => (
                    <div
                      key={evt.id}
                      onClick={() => {
                        onClose();
                        onSelectEvent(evt);
                      }}
                      className="p-3 bg-[#141722] hover:bg-[#1a1e2d] border border-white/10 hover:border-[#0066ff]/40 rounded-2xl flex items-center gap-3 cursor-pointer transition-all group"
                    >
                      <img
                        src={evt.bannerUrl}
                        alt={evt.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-[#38bdf8] bg-blue-950/70 border border-blue-500/30 px-1.5 py-0.2 rounded">
                            {evt.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium truncate">
                            {evt.date.fullDate} • {evt.venue}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-white truncate group-hover:text-[#38bdf8] transition-colors mt-0.5">
                          {evt.title}
                        </h4>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {evt.description}
                        </p>
                      </div>
                      <span className="text-xs font-black text-white shrink-0 px-2 py-1 bg-white/10 rounded-lg">
                        {evt.fee === 0 ? 'FREE' : `₹${evt.fee}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Clubs section */}
              {filteredClubs.length > 0 && (
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <span className="text-xs text-gray-400 font-bold block">COLLEGIATE CLUBS</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredClubs.map((club) => (
                      <div
                        key={club.id}
                        onClick={() => {
                          onClose();
                          onSelectClub(club);
                        }}
                        className="p-3 bg-[#141722] hover:bg-[#1a1e2d] border border-white/10 rounded-2xl flex items-center gap-2.5 cursor-pointer transition-colors"
                      >
                        <img
                          src={club.logoUrl}
                          alt={club.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div className="overflow-hidden">
                          <h5 className="font-bold text-xs text-white truncate">{club.name}</h5>
                          <p className="text-[10px] text-gray-400 truncate">{club.college}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Default Search State: Suggestions & Categories */
            <div className="space-y-6">
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0066ff]" />
                  <span>TRENDING SEARCHES IN NASHIK</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSuggestions.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#0066ff] hover:text-white border border-white/10 text-xs text-gray-300 font-medium transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Categories Grid */}
              <div>
                <span className="text-xs font-bold text-gray-400 block mb-2.5">EXPLORE BY CATEGORY</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onClose();
                        onSelectCategory(cat);
                      }}
                      className="p-3 rounded-2xl bg-[#141722] hover:bg-[#1f2438] border border-white/10 text-left font-bold text-xs text-white flex items-center justify-between transition-colors group"
                    >
                      <span>{cat}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#38bdf8] group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
