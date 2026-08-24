import React from 'react';
import { 
  ArrowRight, 
  Code2, 
  PartyPopper, 
  HeartHandshake, 
  Wrench, 
  QrCode, 
  Award, 
  Users, 
  Mail, 
  FileSpreadsheet, 
  TrendingUp,
  MapPin,
  Calendar,
  Lock,
  Compass,
  Building2,
  GraduationCap
} from 'lucide-react';
import { EventItem } from '../types';

interface LandingHeroViewProps {
  onExploreEvents: () => void;
  onOpenStudentLogin: () => void;
  onOpenOrganizerLogin: () => void;
  featuredEvents: EventItem[];
  onSelectEvent: (event: EventItem) => void;
}

export const LandingHeroView: React.FC<LandingHeroViewProps> = ({
  onExploreEvents,
  onOpenStudentLogin,
  onOpenOrganizerLogin,
  featuredEvents,
  onSelectEvent,
}) => {
  return (
    <div className="w-full bg-transparent text-white overflow-hidden font-serif">
      {/* Ambient Subtle Backdrop */}
      <div className="relative">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-14 pb-12 text-center">
          {/* Micro-Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/25 shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-xl mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-400"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-pink-200 font-serif">
              YouthConnect — Hyperlocal Student Campus Hub
            </span>
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-5.5xl md:text-6xl font-bold tracking-tight text-white font-serif max-w-4xl mx-auto leading-[1.12] drop-shadow-lg">
            Your Campus Life,{' '}
            <span className="bg-gradient-to-r from-pink-300 via-purple-200 to-indigo-300 bg-clip-text text-transparent">
              Unified in One Hub.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-purple-100 max-w-2xl mx-auto font-normal leading-relaxed font-serif drop-shadow-sm">
            Discover collegiate hackathons, cultural fests, certified NGO volunteering drives, and hands-on workshops across colleges with instant digital QR passes & verified credentials.
          </p>

          {/* Primary Action Button */}
          <div className="mt-8 flex items-center justify-center max-w-md mx-auto">
            <button
              onClick={onExploreEvents}
              id="landing-cta-explore-btn"
              className="px-9 py-4 rounded-full text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#8B7CB6] via-purple-500 to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 active:scale-95 transition-all shadow-[0_0_25px_rgba(236,72,153,0.4),inset_0_1px_1px_rgba(255,255,255,0.7)] border border-pink-200/60 flex items-center justify-center gap-2.5 group cursor-pointer font-serif tracking-wide"
            >
              <span>Explore Campus Events</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Stat Pillars Bar */}
          <div className="mt-12 max-w-3.5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl border border-white/30 shadow-2xl">
            <div className="p-2.5 text-center border-r border-white/15 last:border-r-0">
              <span className="block text-2xl sm:text-3xl font-bold text-pink-300 font-serif">50,000+</span>
              <span className="text-xs text-stone-200 font-serif">Verified Students</span>
            </div>
            <div className="p-2.5 text-center sm:border-r border-white/15">
              <span className="block text-2xl sm:text-3xl font-bold text-white font-serif">140+</span>
              <span className="text-xs text-stone-200 font-serif">Hackathons & Fests</span>
            </div>
            <div className="p-2.5 text-center border-r border-white/15 last:border-r-0">
              <span className="block text-2xl sm:text-3xl font-bold text-emerald-300 font-serif">65+</span>
              <span className="text-xs text-stone-200 font-serif">NGO Drives & Credits</span>
            </div>
            <div className="p-2.5 text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-amber-300 font-serif">₹25L+</span>
              <span className="text-xs text-stone-200 font-serif">Prize Pools & Grants</span>
            </div>
          </div>
        </section>

        {/* 4 Core Focus Domain Modules */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-7">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-300 mb-1 font-serif">
              Hyperlocal Discovery Rails
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Curated Exclusively for College Campuses
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Domain 1: Hackathons */}
            <div 
              onClick={onExploreEvents}
              className="p-5 rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl border border-white/25 hover:border-pink-300/60 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-300/40 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
                  <Code2 className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base font-serif group-hover:text-pink-300 transition-colors">
                  Hackathons & Sprints
                </h4>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed font-serif">
                  24h-48h coding hackathons, Web3 & AI tracks, hardware challenges with verified prize pools and internships.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-pink-300 font-serif">
                <span>Browse Hackathons</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 2: Cultural Fests */}
            <div 
              onClick={onExploreEvents}
              className="p-5 rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl border border-white/25 hover:border-pink-300/60 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-300/40 text-rose-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
                  <PartyPopper className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base font-serif group-hover:text-pink-300 transition-colors">
                  College Cultural Fests
                </h4>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed font-serif">
                  Battle of bands, street theatre, dance showcases, inter-collegiate exhibitions, and headline music concerts.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-rose-300 font-serif">
                <span>Browse Fests</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 3: NGO Volunteer Drives */}
            <div 
              onClick={onExploreEvents}
              className="p-5 rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl border border-white/25 hover:border-pink-300/60 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-300/40 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base font-serif group-hover:text-emerald-300 transition-colors">
                  NGO Volunteer Drives
                </h4>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed font-serif">
                  River cleanups, urban plantation, school literacy campaigns with certified community service hours for academic credits.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-emerald-300 font-serif">
                <span>Earn Social Credits</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Domain 4: Tech Workshops */}
            <div 
              onClick={onExploreEvents}
              className="p-5 rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl border border-white/25 hover:border-pink-300/60 shadow-lg hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-300/40 text-purple-300 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-inner">
                  <Wrench className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-base font-serif group-hover:text-purple-300 transition-colors">
                  Hands-on Workshops
                </h4>
                <p className="text-xs text-stone-300 mt-1.5 leading-relaxed font-serif">
                  Hands-on masterclasses on Cloud, IoT, Robotics, Figma to React Code, and career acceleration bootcamps.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-purple-300 font-serif">
                <span>Join Workshops</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* Dual Persona Feature Breakdown Cards */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-pink-300 mb-1 font-serif">
              Built For Two Audiences
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-serif">
              Engineered for Seamless Student Discovery & Organizer Control
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Student Persona Card */}
            <div className="rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl p-6 sm:p-8 border border-white/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-300/40 text-pink-200 text-[11px] font-semibold uppercase tracking-wider font-serif backdrop-blur-md">
                    For Students
                  </span>
                  <span className="text-xs text-purple-200 font-serif">Open Access & Instant Passes</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Never Miss a Fest, Hackathon, or Volunteering Drive
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed font-serif">
                  One verified digital academic identity unlocks passes across all engineering, medical, and arts colleges.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-pink-300 flex items-center justify-center shrink-0 mt-0.5 border border-purple-300/40 shadow-inner">
                      <QrCode className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white font-serif">Dynamic SVG QR Entry Passes</h5>
                      <p className="text-xs text-stone-300 font-serif">Offline-ready digital tickets with gate scanner validation.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-300/40 shadow-inner">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white font-serif">Verified Volunteering Certificates</h5>
                      <p className="text-xs text-stone-300 font-serif">Earn recognized social impact credits and downloadable NGO signed certificates.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0 mt-0.5 border border-purple-300/40 shadow-inner">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white font-serif">Hackathon Team Matching & Campus Circles</h5>
                      <p className="text-xs text-stone-300 font-serif">Connect directly with student developers, designers, and club organizers.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between">
                <button
                  onClick={onExploreEvents}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B7CB6] to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-serif border border-pink-200/40"
                >
                  <Compass className="w-4 h-4" />
                  <span>Start Exploring</span>
                </button>
                <button
                  onClick={onOpenStudentLogin}
                  className="text-xs font-semibold text-pink-300 hover:text-white transition-colors cursor-pointer font-serif"
                >
                  Student Sign In →
                </button>
              </div>
            </div>

            {/* Organizer Persona Card */}
            <div className="rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl p-6 sm:p-8 border border-white/30 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/15 border border-white/25 text-purple-200 text-[11px] font-semibold uppercase tracking-wider font-serif backdrop-blur-md">
                    For Organizers & Clubs
                  </span>
                  <span className="text-xs text-stone-300 font-serif">Passkey Gated Management</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white font-serif">
                  Full Dispatch, Gate Verification & Real-time Analytics
                </h4>
                <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed font-serif">
                  Powerful management suite for collegiate club leads, student councils, and NGO coordinators.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/15 text-stone-200 flex items-center justify-center shrink-0 mt-0.5 border border-white/30 shadow-inner">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white font-serif">Real-Time Attendee Rosters & CSV Export</h5>
                      <p className="text-xs text-stone-300 font-serif">Live registration audit trails with verified student PRNs, colleges, and contact info.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-pink-300 flex items-center justify-center shrink-0 mt-0.5 border border-purple-300/40 shadow-inner">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white font-serif">Multi-Channel Broadcast Dispatcher</h5>
                      <p className="text-xs text-stone-300 font-serif">Instantly blast venue directions, problem statements, and hall allotments to attendees.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-300/40 shadow-inner">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-white font-serif">Live KPI Metrics & Check-in Ratios</h5>
                      <p className="text-xs text-stone-300 font-serif">Real-time conversion curves, gate check-in rates, and engagement analytics.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/15 flex items-center justify-between">
                <button
                  onClick={onOpenOrganizerLogin}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B7CB6] to-pink-500 hover:from-[#7C6BA6] hover:to-pink-600 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer font-serif border border-pink-200/40"
                >
                  <Lock className="w-4 h-4 text-white" />
                  <span>Access Organizer Hub</span>
                </button>
                <span className="text-xs text-stone-300 font-medium font-serif">
                  Passkey Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Live Events Showcase */}
        {featuredEvents.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-pink-300 font-serif">
                  Live on Campuses
                </h3>
                <h4 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                  Trending Events Open for Registration
                </h4>
              </div>
              <button
                onClick={onExploreEvents}
                className="text-xs font-semibold text-pink-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto cursor-pointer font-serif transition-colors"
              >
                <span>View Full Discovery Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="rounded-3xl glass-panel-3d bg-white/[0.12] backdrop-blur-2xl border border-white/30 hover:border-pink-300/70 shadow-xl hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all overflow-hidden flex flex-col group cursor-pointer font-serif"
                >
                  <div className="h-48 w-full overflow-hidden relative bg-black/40">
                    <img
                      src={evt.bannerUrl}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider text-pink-200 shadow-md border border-white/20 font-serif">
                      {evt.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-white shadow-md border border-white/20 font-serif">
                      {evt.fee === 0 ? 'FREE ENTRY' : `₹${evt.fee}`}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-pink-200 mb-1.5 font-serif font-medium">
                        <Calendar className="w-3.5 h-3.5 text-pink-300" />
                        <span>{evt.date.fullDate}</span>
                      </div>
                      <h5 className="font-bold text-white text-base font-serif line-clamp-2 group-hover:text-pink-300 transition-colors">
                        {evt.title}
                      </h5>
                      <div className="flex items-center gap-1 text-xs text-stone-300 mt-2 font-serif">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-white/15 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-purple-200 bg-purple-500/20 border border-purple-300/40 px-2.5 py-0.5 rounded-full font-serif">
                        {evt.registeredCount} Registered
                      </span>
                      <span className="text-xs font-semibold text-stone-200 group-hover:text-pink-300 flex items-center gap-1 font-serif transition-colors">
                        <span>Get Pass</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

