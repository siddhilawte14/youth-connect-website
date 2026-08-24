import React, { useState } from 'react';
import { EventItem, AuditLog, CommunityClub } from '../types';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Filter, 
  Building, 
  Activity, 
  DollarSign, 
  Users, 
  Lock, 
  FileText,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

interface AdminPortalViewProps {
  events?: EventItem[];
  clubs?: CommunityClub[];
  auditLogs?: AuditLog[];
  onApproveEvent?: (eventId: string) => void;
  onRejectEvent?: (eventId: string) => void;
  onToggleClubVerification?: (clubId: string) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  events = [],
  clubs = [],
  auditLogs = [],
  onApproveEvent = (_eventId: string) => {},
  onRejectEvent = (_eventId: string) => {},
  onToggleClubVerification = (_clubId: string) => {},
}) => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'clubs' | 'audit' | 'analytics'>('approvals');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>('All');

  // Moderation events
  const pendingEvents = events.filter((e) => statusFilter === 'All' || e.status === statusFilter);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-[#0b1c30] text-white p-6 sm:p-8 rounded-3xl border border-[#3b82f6]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0058be]/40 border border-[#0058be] text-xs font-bold text-blue-200 font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>SUPER ADMIN & CAMPUS MODERATION CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-headline">
            Nashik District Student Oversight
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
            Audit college events, approve campus partner chapters, review UPI payment escrow clearances, and monitor active gate check-ins across Nashik.
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10">
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-gray-300 uppercase font-bold block">Total Events</span>
            <span className="text-xl font-bold text-white font-headline">{events.length}</span>
            <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">8 Colleges Active</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
            <span className="text-[10px] text-gray-300 uppercase font-bold block">Escrow Cleared</span>
            <span className="text-xl font-bold text-emerald-400 font-headline">₹3,45,200</span>
            <span className="text-[10px] text-gray-300 font-medium block mt-0.5">0 Disputes</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-gray-300 uppercase font-bold block">Student Passes</span>
            <span className="text-xl font-bold text-blue-300 font-headline">1,840+</span>
            <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">99.4% Scanned</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-[#c2c6d6]/60 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'approvals'
              ? 'bg-[#0058be] text-white shadow-xs'
              : 'text-[#424754] hover:bg-[#f8f9ff]'
          }`}
        >
          Event Moderation & Status ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'clubs'
              ? 'bg-[#0058be] text-white shadow-xs'
              : 'text-[#424754] hover:bg-[#f8f9ff]'
          }`}
        >
          Club Verification Badges ({clubs.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#0058be] text-white shadow-xs'
              : 'text-[#424754] hover:bg-[#f8f9ff]'
          }`}
        >
          System Audit Trail & Security Logs
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-[#0058be] text-white shadow-xs'
              : 'text-[#424754] hover:bg-[#f8f9ff]'
          }`}
        >
          District Performance Analytics
        </button>
      </div>

      {/* TAB 1: Event Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-[#c2c6d6]/60">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#727785]" />
              <input
                type="text"
                placeholder="Search event title or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-[#727785] font-bold">Filter:</span>
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1 text-xs rounded-lg font-bold ${
                  statusFilter === 'All' ? 'bg-[#0058be] text-white' : 'bg-gray-100 text-[#424754]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Published')}
                className={`px-3 py-1 text-xs rounded-lg font-bold ${
                  statusFilter === 'Published' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-[#424754]'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('Draft')}
                className={`px-3 py-1 text-xs rounded-lg font-bold ${
                  statusFilter === 'Draft' ? 'bg-amber-600 text-white' : 'bg-gray-100 text-[#424754]'
                }`}
              >
                Draft / Review
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#c2c6d6]/60 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f8f9ff] text-[#727785] font-bold border-b border-[#e5eeff]">
                  <tr>
                    <th className="p-4">Event & Category</th>
                    <th className="p-4">Organizer & Venue</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Registrations / Capacity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5eeff] text-[#424754]">
                  {pendingEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-[#f8f9ff]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.bannerUrl}
                            alt={ev.title}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <span className="font-bold text-[#0b1c30] text-xs block">
                              {ev.title}
                            </span>
                            <span className="text-[10px] text-[#0058be] font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                              {ev.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-[#0b1c30] block">{ev.organizer.name}</span>
                        <span className="text-[11px] text-[#727785]">{ev.venue}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-[#0b1c30] block">{ev.date.fullDate}</span>
                        <span className="text-[10px] text-[#727785]">{ev.date.time}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold">
                        {ev.registeredCount} / {ev.capacity} ({Math.round((ev.registeredCount / ev.capacity) * 100)}%)
                      </td>
                      <td className="p-4">
                        {ev.status === 'Published' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Live & Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-bold text-[10px] border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> In Review
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ev.status !== 'Published' ? (
                            <button
                              onClick={() => onApproveEvent(ev.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => onRejectEvent(ev.id)}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Unpublish
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Club Verification Badges */}
      {activeTab === 'clubs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-[#c2c6d6]/60 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                  />
                  <button
                    onClick={() => onToggleClubVerification(c.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                      c.isVerified
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {c.isVerified ? 'Verified Chapter' : 'Mark Verified'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-[#0b1c30] font-headline">{c.name}</h4>
                <p className="text-xs text-[#0058be] font-semibold mt-0.5">{c.college}</p>
                <p className="text-xs text-[#424754] mt-2 line-clamp-2">{c.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#e5eeff] flex justify-between items-center text-xs text-[#727785]">
                <span className="font-bold text-[#0b1c30]">{c.membersCount.toLocaleString()} Students</span>
                <span className="text-[11px]">{c.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#c2c6d6]/60 overflow-hidden shadow-xs">
          <div className="p-4 bg-[#f8f9ff] border-b border-[#e5eeff] flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#0b1c30] font-headline">
              Real-time Administrative Operations Trail
            </h3>
            <span className="text-[11px] font-mono text-[#0058be]">Immutable Audit Log v1.0</span>
          </div>

          <div className="divide-y divide-[#e5eeff]">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#f8f9ff]/50">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    log.status === 'Success' ? 'bg-emerald-100 text-emerald-800' :
                    log.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-[#0058be]'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-[#0b1c30] block">{log.action}</span>
                    <span className="text-[11px] text-[#727785]">
                      Actor: <span className="font-semibold text-[#0058be]">{log.actor}</span> • Target: {log.target}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-[#727785] block">{log.timestamp}</span>
                  <span className="text-[10px] font-bold text-emerald-700">SHA-256 Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: District Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d6]/60 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0b1c30] font-headline flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0058be]" />
              Top College Engagement Metrics
            </h3>
            <div className="space-y-3 text-xs">
              {[
                { college: 'KKWIEER Panchavati', count: 1240, percent: '88%' },
                { college: 'Sandip Foundation Mahiravani', count: 960, percent: '76%' },
                { college: 'MET Bhujbal Knowledge City Adgaon', count: 820, percent: '68%' },
                { college: 'NDMVP KBTCOE Gangapur Road', count: 640, percent: '54%' },
                { college: 'R.H. Sapat College of Engineering', count: 480, percent: '42%' },
              ].map((item) => (
                <div key={item.college} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-[#0b1c30]">{item.college}</span>
                    <span className="font-bold text-[#0058be]">{item.count} check-ins</span>
                  </div>
                  <div className="w-full bg-[#e5eeff] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0058be] h-full rounded-full" style={{ width: item.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#c2c6d6]/60 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-[#0b1c30] font-headline flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              UPI & Payment Gateway Escrow Ledger
            </h3>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex justify-between">
                <span className="text-[#727785]">Gross Platform Registrations:</span>
                <span className="font-bold text-[#0b1c30]">₹4,12,800</span>
              </div>
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex justify-between">
                <span className="text-[#727785]">Zero-Commission Campus Subsidy:</span>
                <span className="font-bold text-emerald-600">- ₹0.00 (100% Retained by Clubs)</span>
              </div>
              <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] flex justify-between">
                <span className="text-[#727785]">Instant UPI Payouts Settled:</span>
                <span className="font-bold text-[#0058be]">98.2%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                🛡️ All payments are processed through Razorpay & BHIM UPI auto-verification protocols.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
