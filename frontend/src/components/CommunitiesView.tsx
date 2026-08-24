import React, { useState } from 'react';
import { CommunityClub, CommunityUpdate, EventItem } from '../types';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  MessageSquare, 
  ExternalLink, 
  PlusCircle, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  Share2,
  Building,
  Hash
} from 'lucide-react';

interface CommunitiesViewProps {
  clubs?: CommunityClub[];
  updates?: CommunityUpdate[];
  events?: EventItem[];
  onSelectEvent?: (event: EventItem) => void;
  onSelectEventForRegistration?: (event: EventItem) => void;
  onJoinClub?: (clubId: string) => void;
  onPostUpdate?: (text: string, clubName: string) => void;
}

export const CommunitiesView: React.FC<CommunitiesViewProps> = ({
  clubs = [],
  updates = [],
  events = [],
  onSelectEvent,
  onSelectEventForRegistration,
  onJoinClub = (_clubId: string) => {},
  onPostUpdate = (_text: string, _clubName: string) => {},
}) => {
  const handleSelectEvent = onSelectEvent || onSelectEventForRegistration || (() => {});
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCollege, setSelectedCollege] = useState<string>('All Colleges');
  const [joinedClubIds, setJoinedClubIds] = useState<Set<string>>(new Set(['club-1', 'club-3']));
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPostingClub, setSelectedPostingClub] = useState(clubs[0]?.name || 'KKWIEER Coders Hub');
  const [postSuccess, setPostSuccess] = useState(false);

  const categories = ['All', 'Coding & Dev', 'Robotics & AI', 'Cultural & Arts', 'Debate & MUN', 'Design & UI/UX', 'Social & NGO'];
  const colleges = ['All Colleges', 'KKWIEER Nashik', 'Sandip Foundation', 'MET League of Colleges', 'NDMVP Engineering', 'Gokhale Education Society'];

  const filteredClubs = clubs.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category.toLowerCase().includes(selectedCategory.toLowerCase()) || (selectedCategory === 'Coding & Dev' && c.category === 'Technology');
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()) || c.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = selectedCollege === 'All Colleges' || c.college.includes(selectedCollege) || c.college === selectedCollege;
    return matchesCat && matchesSearch && matchesCollege;
  });

  const handleJoin = (clubId: string) => {
    const next = new Set(joinedClubIds);
    if (next.has(clubId)) {
      next.delete(clubId);
    } else {
      next.add(clubId);
    }
    setJoinedClubIds(next);
    onJoinClub(clubId);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onPostUpdate(newPostContent, selectedPostingClub);
    setNewPostContent('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 2500);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-[#0058be] to-[#004294] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 backdrop-blur-xs text-xs font-bold mb-3">
            <Users className="w-3.5 h-3.5" />
            <span>Nashik Inter-College Student Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline mb-2 leading-tight">
            Connect with 45+ Verified Student Clubs & Chapters
          </h1>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            Discover peer communities across KKWIEER, Sandip, MET, NDMVP and KBTCOE. Join active WhatsApp discussions, collaborate on hackathons, and share opportunities.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Directory & Right Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Clubs Directory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-[#c2c6d6]/60 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727785]" />
                <input
                  type="text"
                  placeholder="Search clubs e.g. Coders, Robotics, Debate, MET..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                />
              </div>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs font-medium text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
              >
                {colleges.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Category pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#0058be] text-white shadow-xs'
                      : 'bg-[#f8f9ff] text-[#424754] border border-[#c2c6d6]/60 hover:bg-[#eef2ff]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Clubs Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClubs.map((club) => {
              const isJoined = joinedClubIds.has(club.id);
              return (
                <div
                  key={club.id}
                  className="bg-white rounded-2xl border border-[#c2c6d6]/60 p-5 shadow-xs hover:shadow-md hover:border-[#0058be]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Club Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-[#0b1c30] font-headline truncate">
                            {club.name}
                          </h3>
                          {club.isVerified && (
                            <ShieldCheck className="w-4 h-4 text-[#0058be] shrink-0" title="Verified Campus Chapter" />
                          )}
                        </div>
                        <span className="text-[11px] text-[#0058be] font-semibold flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          {club.college}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#424754] line-clamp-2 leading-relaxed mb-3">
                      {club.description}
                    </p>

                    {/* Stats and activity */}
                    <div className="bg-[#f8f9ff] rounded-xl p-2.5 mb-3 text-[11px] text-[#727785] flex items-center justify-between border border-[#e5eeff]">
                      <span className="flex items-center gap-1 font-bold text-[#0b1c30]">
                        <Users className="w-3.5 h-3.5 text-[#0058be]" />
                        {club.membersCount.toLocaleString()} members
                      </span>
                      <span className="truncate max-w-[130px] text-right font-medium">
                        🔥 {club.recentActivity}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#e5eeff]">
                    <button
                      onClick={() => handleJoin(club.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isJoined
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-[#0058be] hover:bg-[#004bb0] text-white shadow-xs active:scale-95'
                      }`}
                    >
                      {isJoined ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Joined
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-3.5 h-3.5" />
                          Join Club
                        </>
                      )}
                    </button>
                    <a
                      href={club.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-bold text-xs flex items-center justify-center gap-1 border border-[#25D366]/30 transition-colors"
                      title="Join WhatsApp Discussion Group"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Community Feed & Posting */}
        <div className="space-y-6">
          {/* Create Post Widget */}
          <div className="bg-white rounded-2xl border border-[#c2c6d6]/60 p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#0058be]" />
              <h3 className="text-sm font-bold text-[#0b1c30] font-headline">
                Post to Student Wall
              </h3>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-[#727785] block mb-1">
                  Post on behalf of:
                </label>
                <select
                  value={selectedPostingClub}
                  onChange={(e) => setSelectedPostingClub(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-1.5 text-xs font-medium text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Student Contributor (Rahul Sharma)">
                    Student Contributor (Rahul Sharma)
                  </option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share club updates, call for hackathon teammates, or workshop announcements..."
                className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl p-3 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be] resize-none"
              />

              {postSuccess && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Your update is now live on the Nashik student wall!
                </div>
              )}

              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="w-full py-2 bg-[#0058be] hover:bg-[#004bb0] disabled:bg-gray-300 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Publish Update
              </button>
            </form>
          </div>

          {/* Live Activity Wall */}
          <div className="bg-white rounded-2xl border border-[#c2c6d6]/60 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0b1c30] font-headline flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Campus Feed
              </h3>
              <span className="text-[10px] text-[#727785] font-mono">Nashik Live</span>
            </div>

            <div className="space-y-3.5">
              {updates.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#e5eeff] text-xs space-y-2 hover:border-[#0058be]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#0b1c30] text-[11px] flex items-center gap-1">
                      <span className="text-sm">{item.clubIcon}</span>
                      {item.clubName}
                    </span>
                    <span className="text-[10px] text-[#727785]">{item.timeAgo}</span>
                  </div>
                  <p className="text-[#424754] leading-relaxed">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-[#727785]">
                    <button className="flex items-center gap-1 hover:text-[#0058be] transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Cheer</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#0058be] transition-colors">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
