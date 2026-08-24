import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  Music, 
  HeartHandshake, 
  Cpu, 
  ShieldCheck, 
  Ticket, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Building2, 
  Flame
} from 'lucide-react';
import { EventItem, CommunityClub } from '../types';

interface LandingPageViewProps {
  events: EventItem[];
  clubs: CommunityClub[];
  currentLocation: string;
  onExploreEvents: () => void;
  onOpenStudentLogin: () => void;
  onOpenOrganizerLogin: () => void;
  onSelectEvent: (event: EventItem) => void;
  onSelectCategory: (category: string) => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  events,
  currentLocation,
  onExploreEvents,
  onOpenStudentLogin,
  onOpenOrganizerLogin,
  onSelectEvent,
  onSelectCategory,
}) => {
  // Highlight top 4 curated events
  const featuredEvents = events.slice(0, 4);

  const pillars = [
    {
      id: 'hackathons',
      title: 'Hackathons & Sprints',
      category: 'Hackathons',
      icon: Terminal,
      bgLight: 'bg-purple-50 border-purple-200 text-[#7C6BA6]',
      desc: 'Compete in 24-48hr inter-college hackathons, win cash prize pools, and get fast-tracked for internships.',
      count: '8 Active Sprints'
    },
    {
      id: 'fests',
      title: 'College Cultural Fests',
      category: 'College Fests',
      icon: Music,
      bgLight: 'bg-purple-50 border-purple-200 text-[#7C6BA6]',
      desc: 'Star nights, band battles, drama fests, and campus concerts with instant digital QR entry passes.',
      count: '14 Flagship Fests'
    },
    {
      id: 'ngo-drives',
      title: 'NGO Volunteering Drives',
      category: 'NGO Drives',
      icon: HeartHandshake,
      bgLight: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      desc: 'Tree plantation, blood donation, and community education drives with certified social service hours.',
      count: '12 Drives Live'
    },
    {
      id: 'workshops',
      title: 'Tech Masterclasses',
      category: 'Workshops',
      icon: Cpu,
      bgLight: 'bg-purple-50 border-purple-200 text-[#7C6BA6]',
      desc: 'Hands-on AI/ML, Cloud DevOps, and Web3 bootcamps led by senior student leads and industry mentors.',
      count: '19 Workshops'
    }
  ];

  const colleges = [
    'MET Bhujbal Knowledge City, Adgaon, Nashik',
    'KKWIEER, Nashik',
    "NDMVP's KBT College of Engineering, Nashik",
    'COEP Technological University, Pune'
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 overflow-hidden font-serif">
      {/* 1. Hero Section */}
      <div className="relative isolate pt-8 pb-16 md:pt-14 md:pb-24 overflow-hidden font-serif">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-serif relative z-10">
          {/* Top Campus Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6 font-serif">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs text-xs font-semibold text-[#7C6BA6] font-serif">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Campus Network • {currentLocation} Active</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-xs font-medium text-stone-700 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CB6]" />
              <span>100% Student Powered</span>
            </div>
          </div>

          {/* Main Hero Headline */}
          <div className="text-center max-w-4xl mx-auto space-y-5 font-serif">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-stone-900 tracking-tight leading-[1.1] font-serif">
              The Campus Hub for <br className="hidden sm:inline" />
              <span className="text-[#8B7CB6]">
                College Fests, Hackathons
              </span>{' '}
              & NGO Drives
            </h1>

            <p className="text-base sm:text-xl text-stone-600 max-w-2xl mx-auto font-normal leading-relaxed font-serif">
              Discover verified campus hackathons, cultural festivals, tech workshops, and social impact drives across Nashik & Pune colleges. Secure passes instantly with digital QR tickets.
            </p>

            {/* CTA Buttons Flow */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 font-serif">
              <button
                type="button"
                onClick={onExploreEvents}
                id="hero-cta-explore-feed"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-semibold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-serif"
              >
                <span>Explore Live Campus Feed</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenStudentLogin}
                id="hero-cta-student-login"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 font-semibold text-sm sm:text-base border border-stone-200 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-serif"
              >
                <Ticket className="w-4 h-4 text-[#8B7CB6]" />
                <span>Join as Student</span>
              </button>

              <button
                type="button"
                onClick={onOpenOrganizerLogin}
                id="hero-cta-organizer-login"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C6BA6] font-semibold text-xs sm:text-sm border border-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer font-serif"
              >
                <Building2 className="w-4 h-4 text-[#8B7CB6]" />
                <span>Organizer Portal Access</span>
              </button>
            </div>

            {/* Quick Micro Stats */}
            <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-3xl mx-auto text-left font-serif">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs font-serif">
                <p className="text-2xl sm:text-3xl font-bold text-[#8B7CB6] font-serif">28+</p>
                <p className="text-xs font-semibold text-stone-500 font-serif">Live Campus Events</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs font-serif">
                <p className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">12,400+</p>
                <p className="text-xs font-semibold text-stone-500 font-serif">Registered Students</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs font-serif">
                <p className="text-2xl sm:text-3xl font-bold text-emerald-700 font-serif">3,500+</p>
                <p className="text-xs font-semibold text-stone-500 font-serif">Volunteer Hours</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs font-serif">
                <p className="text-2xl sm:text-3xl font-bold text-[#8B7CB6] font-serif">45+</p>
                <p className="text-xs font-semibold text-stone-500 font-serif">Clubs & NGOs</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Partner Colleges Bar */}
      <div className="border-y border-stone-200 bg-white py-4 font-serif relative">
        <div className="max-w-7xl mx-auto px-4 text-center font-serif">
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2 font-serif">
            Student Committees & Councils Across Nashik & Pune
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium text-stone-700 font-serif">
            {colleges.map((col, idx) => (
              <span 
                key={idx} 
                className="flex items-center gap-2 py-1.5 px-3.5 rounded-xl bg-stone-50 border border-stone-200 hover:border-[#8B7CB6] hover:bg-stone-100 hover:text-stone-900 transition-all duration-200 cursor-default font-serif"
              >
                <ShieldCheck className="w-4 h-4 text-[#8B7CB6] shrink-0" />
                <span>{col}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Category Pillars Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-serif animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 font-serif">
          <div className="font-serif">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#7C6BA6] bg-purple-50 px-3 py-1 rounded-full border border-purple-200 font-serif">
              Campus Categories
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-2 font-serif">
              Explore By Category
            </h2>
          </div>
          <button
            type="button"
            onClick={onExploreEvents}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C6BA6] hover:text-[#8B7CB6] hover:translate-x-0.5 transition-all duration-200 cursor-pointer font-serif"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                onClick={() => {
                  onSelectCategory(pillar.category);
                  onExploreEvents();
                }}
                className="group relative bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#8B7CB6] hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between font-serif shadow-xs"
              >
                <div className="font-serif">
                  <div className="flex items-center justify-between mb-4 font-serif">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 group-hover:bg-[#8B7CB6] group-hover:text-white flex items-center justify-center text-[#7C6BA6] transition-all duration-300 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border font-serif ${pillar.bgLight}`}>
                      {pillar.count}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-[#7C6BA6] transition-colors font-serif">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 line-clamp-3 leading-relaxed font-serif">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-semibold text-[#7C6BA6] group-hover:text-[#8B7CB6] font-serif">
                  <span>Browse Events</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Spotlight Events Showcase */}
      <section className="bg-white border-y border-stone-200 py-16 font-serif animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-serif">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 font-serif">
            <div className="font-serif">
              <div className="flex items-center gap-2 mb-2 font-serif">
                <Flame className="w-4 h-4 text-[#8B7CB6] fill-[#8B7CB6]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200 font-serif">
                  Campus Spotlight
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-serif">
                Featured Events This Month
              </h2>
            </div>
            <button
              type="button"
              onClick={onExploreEvents}
              className="px-4 py-2 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-semibold transition-all duration-200 shadow-xs active:scale-95 cursor-pointer font-serif"
            >
              Open Full Campus Feed
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-serif">
            {featuredEvents.map((event) => {
              const isFree = event.fee === 0;
              const isNgo = event.category === 'NGO Drives' || event.category === 'NGO / Social Impact';
              return (
                <div
                  key={event.id}
                  onClick={() => onSelectEvent(event)}
                  className="group relative bg-stone-50 rounded-2xl border border-stone-200 hover:border-[#8B7CB6] overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between font-serif"
                >
                  <div className="relative aspect-[16/10] bg-stone-200 overflow-hidden font-serif">
                    <img
                      src={event.posterUrl || event.bannerUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 font-serif">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold uppercase text-white shadow-xs font-serif ${
                        isNgo ? 'bg-emerald-600 border border-emerald-400/30' : 'bg-[#8B7CB6] border border-purple-300'
                      }`}>
                        {isNgo ? 'Volunteer' : event.category}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 font-serif">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase bg-stone-900/80 text-white backdrop-blur-xs border border-stone-700 font-serif">
                        {isFree ? 'Free Entry' : `₹${event.fee}`}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between font-serif bg-white">
                    <div className="font-serif">
                      <h4 className="font-bold text-sm text-stone-900 group-hover:text-[#7C6BA6] transition-colors duration-200 line-clamp-1 font-serif">
                        {event.title}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 font-serif">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 space-y-1.5 text-xs text-stone-500 font-serif">
                      <div className="flex items-center gap-1.5 font-serif">
                        <Calendar className="w-3.5 h-3.5 text-[#8B7CB6]" />
                        <span className="font-serif text-stone-700">{event.date.fullDate || `${event.date.month} ${event.date.day}`}</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-serif">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate font-serif text-stone-700">{event.area || event.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. How It Works: The 3-Step Flow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-serif animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both">
        <div className="text-center max-w-2xl mx-auto mb-12 font-serif">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#7C6BA6] bg-purple-50 px-3 py-1 rounded-full border border-purple-200 font-serif">
            Student Access Pass
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight mt-2 font-serif">
            From Discovery to Entry
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 font-serif">
            No paper forms. Instant digital passes stored in your Student Pass Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif">
          <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#8B7CB6] hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out shadow-xs relative font-serif">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6BA6] border border-purple-200 flex items-center justify-center font-bold text-sm mb-4 font-serif">
              01
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">1. Discover & Filter</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-serif">
              Explore verified events across Hackathons, Fests, and NGO Drives in Nashik & Pune.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-[#8B7CB6] hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out shadow-xs relative font-serif">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C6BA6] border border-purple-200 flex items-center justify-center font-bold text-sm mb-4 font-serif">
              02
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">2. Quick Digital RSVP</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-serif">
              Register in seconds with your college details to generate encrypted QR passes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out shadow-xs relative font-serif">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-sm mb-4 font-serif">
              03
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">3. Fast Gate Check-in</h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed font-serif">
              Present your QR pass at college gates. Organizers scan with the built-in scanner for admission.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Bottom Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 font-serif">
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-stone-900 shadow-xs relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-200 font-serif">
          <div className="space-y-2 text-center md:text-left relative z-10 font-serif">
            <h3 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-stone-900">
              Connect with Campus Life
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-serif">
              Join students across Nashik & Pune discovering hackathons, attending flagship fests, and earning verified social service certificates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10 shrink-0 font-serif">
            <button
              type="button"
              onClick={onExploreEvents}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8B7CB6] text-white font-semibold text-xs sm:text-sm shadow-xs hover:bg-[#7C6BA6] transition-all cursor-pointer font-serif"
            >
              Start Exploring Events
            </button>
            <button
              type="button"
              onClick={onOpenOrganizerLogin}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs sm:text-sm border border-stone-200 transition-all cursor-pointer font-serif"
            >
              Host an Event
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
