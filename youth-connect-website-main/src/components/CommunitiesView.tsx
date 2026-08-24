import React, { useState } from 'react';
import { CommunityClub, CommunityUpdate, EventItem } from '../types';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  MessageSquare, 
  PlusCircle, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ThumbsUp, 
  Share2,
  Building
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
  const colleges = [
    'All Colleges',
    'MET Bhujbal Knowledge City, Adgaon, Nashik',
    'KKWIEER (K. K. Wagh Institute of Engineering Education and Research), Nashik',
    "NDMVP's KBT College of Engineering, Nashik",
    'COEP Technological University, Pune'
  ];

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
    <div className="w-full space-y-8 animate-in fade-in duration-200 text-stone-900 font-serif">
      {/* Hero Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 text-stone-900 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold mb-3 text-[#7C6BA6] font-serif">
            <Users className="w-3.5 h-3.5" />
            <span>Collegiate Student Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2 leading-tight tracking-tight text-stone-900">
            Connect with Premier Student Clubs & Chapters
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-serif">
            Discover peer communities across MET Bhujbal Knowledge City, KKWIEER, NDMVP KBTCOE, and COEP. Join active discussion channels, collaborate on hackathons, and share opportunities.
          </p>
        </div>
      </div>

      {/* Main Grid: Left Directory & Right Community Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Clubs Directory */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3 font-serif">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search clubs e.g. Coders, Robotics, Debate, MET..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] transition-colors font-serif"
                />
              </div>
              <select
                value={selectedCollege}
                onChange={(e) => setSelectedCollege(e.target.value)}
                className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#8B7CB6] transition-colors font-serif max-w-[200px] truncate"
              >
                {colleges.map((col) => (
                  <option key={col} value={col} className="bg-white text-stone-900">
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer font-serif ${
                    selectedCategory === cat
                      ? 'bg-[#8B7CB6] text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200 hover:text-stone-900'
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
                  className="bg-white rounded-2xl border border-stone-200 hover:border-[#8B7CB6] p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group font-serif animate-in fade-in duration-200"
                >
                  <div>
                    {/* Club Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={club.logoUrl}
                        alt={club.name}
                        className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-sm text-stone-900 font-serif truncate group-hover:text-[#7C6BA6] transition-colors duration-200">
                            {club.name}
                          </h3>
                          {club.isVerified && (
                            <span title="Verified Campus Chapter" className="inline-flex">
                              <ShieldCheck className="w-4 h-4 text-[#7C6BA6] shrink-0" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1 mt-0.5 font-serif">
                          <Building className="w-3 h-3 text-[#7C6BA6]" />
                          <span className="truncate">{club.college}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4 font-serif">
                      {club.description}
                    </p>

                    {/* Stats and activity */}
                    <div className="bg-stone-50 rounded-xl p-2.5 mb-4 text-[11px] text-stone-600 flex items-center justify-between border border-stone-200 font-serif">
                      <span className="flex items-center gap-1 font-semibold text-stone-800">
                        <Users className="w-3.5 h-3.5 text-[#8B7CB6]" />
                        {club.membersCount.toLocaleString()} members
                      </span>
                      <span className="truncate max-w-[130px] text-right font-medium text-amber-700">
                        🔥 {club.recentActivity}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-stone-100 font-serif">
                    <button
                      onClick={() => handleJoin(club.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                        isJoined
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs'
                          : 'bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white shadow-xs'
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
                      className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-emerald-300 transition-all duration-200 font-serif"
                      title="Join WhatsApp Discussion Group"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Channel</span>
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
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs font-serif">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#8B7CB6]" />
              <h3 className="text-sm font-bold text-stone-900 font-serif">
                Post to Student Wall
              </h3>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3 font-serif">
              <div>
                <label className="text-[11px] font-semibold text-stone-700 block mb-1 font-serif">
                  Post on behalf of:
                </label>
                <select
                  value={selectedPostingClub}
                  onChange={(e) => setSelectedPostingClub(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-900 focus:outline-none focus:border-[#8B7CB6] transition-colors font-serif truncate"
                >
                  {clubs.map((c) => (
                    <option key={c.id} value={c.name} className="bg-white text-stone-900">
                      {c.name}
                    </option>
                  ))}
                  <option value="Student Contributor (Siddhi Lawte)" className="bg-white text-stone-900">
                    Student Contributor (Siddhi Lawte)
                  </option>
                </select>
              </div>

              <textarea
                rows={3}
                required
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Share club updates, call for hackathon teammates, or workshop announcements..."
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] resize-none transition-colors font-serif"
              />

              {postSuccess && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in font-serif">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Your update is now live on the student wall!
                </div>
              )}

              <button
                type="submit"
                disabled={!newPostContent.trim()}
                className="w-full py-2 bg-[#8B7CB6] hover:bg-[#7C6BA6] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer font-serif"
              >
                <Send className="w-3.5 h-3.5" />
                Publish Update
              </button>
            </form>
          </div>

          {/* Live Activity Wall */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs font-serif">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Campus Feed
              </h3>
              <span className="text-[10px] text-stone-500 font-mono">Nashik & Pune</span>
            </div>

            <div className="space-y-3.5">
              {updates.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2 hover:border-[#8B7CB6] transition-colors font-serif"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 text-[11px] flex items-center gap-1.5 font-serif">
                      <span className="text-sm">{item.clubIcon}</span>
                      {item.clubName}
                    </span>
                    <span className="text-[10px] text-stone-500 font-serif">{item.timeAgo}</span>
                  </div>
                  <p className="text-stone-700 leading-relaxed font-serif">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-stone-500 font-serif">
                    <button className="flex items-center gap-1 hover:text-[#7C6BA6] transition-colors cursor-pointer">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Cheer</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-[#7C6BA6] transition-colors cursor-pointer">
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
