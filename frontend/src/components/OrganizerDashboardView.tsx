import React, { useState } from 'react';
import { EventItem, OrganizerStats } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  BarChart3, 
  Mail, 
  PlusCircle, 
  Download, 
  QrCode, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Activity,
  Layers
} from 'lucide-react';

interface OrganizerDashboardViewProps {
  events: EventItem[];
  stats?: OrganizerStats;
  onOpenCreateEvent?: () => void;
  onOpenBroadcastModal?: () => void;
  onOpenGateScanner?: () => void;
  onPublishDraft?: (eventId: string) => void;
  onSelectEventForRegistration?: (event: EventItem) => void;
  onSelectEvent?: (event: EventItem) => void;
}

export const OrganizerDashboardView: React.FC<OrganizerDashboardViewProps> = ({
  events,
  stats = {
    totalViews: '24.5k',
    totalViewsGrowth: '+18.2%',
    totalRegistrations: 1420,
    registrationsGrowth: '+24.5%',
    engagementRate: '68.4%',
    engagementGrowth: '+5.1%',
    revenueGenerated: 184500,
  },
  onOpenCreateEvent = () => {},
  onOpenBroadcastModal = () => {},
  onOpenGateScanner = () => {},
  onPublishDraft = (_eventId: string) => {},
  onSelectEventForRegistration,
  onSelectEvent,
}) => {
  const handleSelectEvent = onSelectEvent || onSelectEventForRegistration || (() => {});
  const [activeTab, setActiveTab] = useState<'Published' | 'Draft'>('Published');

  const publishedEvents = events.filter((e) => e.status === 'Published');
  const draftEvents = events.filter((e) => e.status === 'Draft');

  const currentDisplayList = activeTab === 'Published' ? publishedEvents : draftEvents;

  const handleExportCSV = (event: EventItem) => {
    const csvContent = `TicketID,AttendeeName,CollegeID,Department,Event,Amount,Status\n` +
      `TKT-8492-XYS,Rahul Sharma,21BCE045,Computer Science,${event.title},${event.fee},Verified\n` +
      `TKT-8493-ABC,Pooja Patil,22BIT012,Information Technology,${event.title},${event.fee},Verified\n` +
      `TKT-8494-DEF,Amit Kulkarni,20BME088,Mechanical Engineering,${event.title},${event.fee},Verified\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${event.id}-attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 mb-20 md:mb-0">
      {/* Header Section (Exact match of Image 13) */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0b1c30] tracking-tight font-headline">
            Organizer Dashboard
          </h1>
          <p className="text-sm sm:text-base text-[#424754] mt-1">
            Manage your events, track engagement, and analyze ticket performance.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="org-btn-gate-scanner"
            onClick={onOpenGateScanner}
            className="border border-[#c2c6d6] hover:bg-[#eff4ff] text-[#0058be] font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <QrCode className="w-4 h-4" />
            Gate Scanner
          </button>

          <button
            id="org-btn-broadcast"
            onClick={onOpenBroadcastModal}
            className="border border-[#c2c6d6] hover:bg-gray-50 text-[#0b1c30] font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4 text-[#727785]" />
            Email Broadcast
          </button>

          <button
            id="org-btn-create-event"
            onClick={onOpenCreateEvent}
            className="bg-[#0058be] hover:bg-[#2563EB] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create Event
          </button>
        </div>
      </header>

      {/* KPI Metrics Row (3 Cards with visual charts from Image 13) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Metric 1: Total Views */}
        <div className="bg-white rounded-2xl p-6 border border-[#c2c6d6]/60 shadow-[0_4px_12px_rgba(59,130,246,0.08)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#727785] block mb-1">
              Total Views
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0b1c30] font-headline">
                {stats.totalViews}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {stats.totalViewsGrowth}
              </span>
            </div>
            <span className="text-[11px] text-[#727785] block mt-1">vs last month</span>
          </div>

          {/* Mini Bar Chart Mockup (Matching Image 13) */}
          <div className="flex items-end gap-1.5 h-12 pt-4 mt-2">
            {[40, 65, 45, 80, 55, 90, 70, 95, 85, 100].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className={`flex-1 rounded-xs transition-all ${
                  i >= 7 ? 'bg-[#0058be]' : 'bg-[#adc6ff]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Metric 2: Registrations */}
        <div className="bg-white rounded-2xl p-6 border border-[#c2c6d6]/60 shadow-[0_4px_12px_rgba(59,130,246,0.08)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#727785] block mb-1">
              Registrations
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0b1c30] font-headline">
                {stats.totalRegistrations.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {stats.registrationsGrowth}
              </span>
            </div>
            <span className="text-[11px] text-[#727785] block mt-1">vs last month</span>
          </div>

          {/* Mini Line Wave / Trend Path */}
          <div className="h-12 pt-4 mt-2 flex items-center">
            <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 30" fill="none">
              <path
                d="M0 25 Q 15 5, 30 18 T 60 12 T 80 8 T 100 2"
                stroke="#00855b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M0 25 Q 15 5, 30 18 T 60 12 T 80 8 T 100 2 L 100 30 L 0 30 Z"
                fill="url(#greenGrad)"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00855b" />
                  <stop offset="100%" stopColor="#00855b" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Metric 3: Avg. Engagement & Revenue */}
        <div className="bg-white rounded-2xl p-6 border border-[#c2c6d6]/60 shadow-[0_4px_12px_rgba(59,130,246,0.08)] flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-[#727785] block mb-1">
              Avg. Engagement
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#0b1c30] font-headline">
                {stats.engagementRate}
              </span>
              <span className="text-xs font-bold text-[#93000a] bg-[#ffdad6] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <TrendingDown className="w-3 h-3" /> {stats.engagementGrowth}
              </span>
            </div>
            <span className="text-[11px] text-[#727785] block mt-1">vs last month</span>
          </div>

          {/* Radial progress ring illustration */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs">
              <span className="text-[#727785] block text-[10px]">REVENUE GENERATED</span>
              <span className="text-base font-bold text-[#0b1c30]">
                ₹{stats.revenueGenerated.toLocaleString()}
              </span>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#ffe0d3"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#fd761a"
                  strokeDasharray="75, 100"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-[#9d4300]">75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Events Performance Section (Exact match of Image 13) */}
      <section className="bg-white rounded-2xl border border-[#c2c6d6]/60 shadow-[0_4px_12px_rgba(59,130,246,0.08)] overflow-hidden">
        {/* Section Header with Published / Drafts Tabs */}
        <div className="p-6 border-b border-[#e5eeff] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0b1c30] font-headline">
              Active Events Performance
            </h2>
            <p className="text-xs text-[#727785] mt-0.5">
              Live registration counters and attendee export options
            </p>
          </div>

          <div className="flex bg-[#eff4ff] p-1 rounded-xl border border-[#c2c6d6]/60 text-xs">
            <button
              id="org-tab-published"
              onClick={() => setActiveTab('Published')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'Published'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-[#424754] hover:text-[#0058be]'
              }`}
            >
              Published ({publishedEvents.length})
            </button>
            <button
              id="org-tab-drafts"
              onClick={() => setActiveTab('Draft')}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                activeTab === 'Draft'
                  ? 'bg-white text-[#0058be] shadow-xs'
                  : 'text-[#424754] hover:text-[#0058be]'
              }`}
            >
              Drafts ({draftEvents.length})
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9ff] border-b border-[#c2c6d6]/60 text-[#727785] font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Event Name</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Capacity</th>
                <th className="py-3.5 px-4">Registrations</th>
                <th className="py-3.5 px-4">Conversion</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5eeff]">
              {currentDisplayList.map((evt) => {
                const percentage = Math.min(100, Math.round((evt.registeredCount / evt.capacity) * 100));
                return (
                  <tr key={evt.id} className="hover:bg-[#f8f9ff]/70 transition-colors">
                    {/* Event Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="w-10 h-10 rounded-lg object-cover border border-[#c2c6d6]"
                        />
                        <div>
                          <span className="font-bold text-[#0b1c30] text-sm block font-headline">
                            {evt.title}
                          </span>
                          <span className="text-[11px] text-[#727785]">
                            {evt.date.fullDate} • {evt.venue}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {evt.status === 'Published' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00855b] bg-[#f5fff6] border border-[#4edea3]/40 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#424754] bg-[#eff4ff] border border-[#c2c6d6] px-2.5 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      )}
                    </td>

                    {/* Capacity */}
                    <td className="py-4 px-4 text-[#0b1c30] font-semibold">
                      {evt.capacity} seats
                    </td>

                    {/* Registrations with Progress Bar */}
                    <td className="py-4 px-4">
                      <div className="w-36">
                        <div className="flex justify-between text-[11px] font-semibold mb-1">
                          <span className="text-[#0b1c30]">{evt.registeredCount}</span>
                          <span className="text-[#727785]">{percentage}%</span>
                        </div>
                        <div className="w-full bg-[#eff4ff] rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-[#0058be] h-full rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Conversion */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-[#0058be]">
                        {evt.conversionRate}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {evt.status === 'Draft' ? (
                          <button
                            onClick={() => onPublishDraft(evt.id)}
                            className="bg-[#0058be] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#2563EB]"
                          >
                            Publish
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleExportCSV(evt)}
                              className="p-1.5 hover:bg-[#eff4ff] text-[#0058be] rounded-lg transition-colors"
                              title="Export Attendees CSV"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleSelectEvent(evt)}
                              className="text-xs font-bold text-[#0058be] hover:underline px-2 py-1"
                            >
                              Manage
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
