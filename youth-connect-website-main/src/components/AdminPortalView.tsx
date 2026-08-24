import React, { useState } from 'react';
import { EventItem, AuditLog, CommunityClub } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Activity, 
  DollarSign, 
  Lock, 
  TrendingUp
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
  const pendingEvents = events.filter((e) => {
    const matchesStatus = statusFilter === 'All' || e.status === statusFilter;
    const matchesSearch = !searchTerm || e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.venue.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-200 text-stone-700 font-serif">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-stone-100 via-stone-50 to-purple-50/40 text-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden font-serif">
        <div className="relative z-10 space-y-2 font-serif">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 border border-purple-200 text-xs font-semibold text-[#7C6BA6] font-serif">
            <Lock className="w-3.5 h-3.5" />
            <span>CAMPUS MODERATION CONSOLE</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
            District Campus Oversight
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl font-serif">
            Audit college events, approve campus partner chapters, review UPI payment escrow clearances, and monitor active gate check-ins across Nashik & Pune.
          </p>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 relative z-10 font-serif">
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs font-serif">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block font-serif">Total Events</span>
            <span className="text-xl font-bold text-stone-900 font-serif">{events.length}</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5 font-serif">Active Chapters</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs font-serif">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block font-serif">Escrow Cleared</span>
            <span className="text-xl font-bold text-emerald-600 font-serif">₹3,45,200</span>
            <span className="text-[10px] text-stone-500 font-medium block mt-0.5 font-serif">0 Disputes</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs col-span-2 sm:col-span-1 font-serif">
            <span className="text-[10px] text-stone-500 uppercase font-semibold block font-serif">Student Passes</span>
            <span className="text-xl font-bold text-[#7C6BA6] font-serif">1,840+</span>
            <span className="text-[10px] text-emerald-600 font-medium block mt-0.5 font-serif">99.4% Scanned</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap gap-1.5 font-serif">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-serif ${
            activeTab === 'approvals'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Event Moderation ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('clubs')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-serif ${
            activeTab === 'clubs'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Club Verification Badges ({clubs.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-serif ${
            activeTab === 'audit'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Audit Trail & Security Logs
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer font-serif ${
            activeTab === 'analytics'
              ? 'bg-[#8B7CB6] text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          District Performance Analytics
        </button>
      </div>

      {/* TAB 1: Event Approvals */}
      {activeTab === 'approvals' && (
        <div className="space-y-4 font-serif">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-white p-4 rounded-2xl border border-stone-200 font-serif shadow-xs">
            <div className="relative w-full sm:w-72 font-serif">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="Search event title or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto font-serif">
              <span className="text-xs text-stone-600 font-semibold font-serif">Filter:</span>
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer font-serif ${
                  statusFilter === 'All' ? 'bg-[#8B7CB6] text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Published')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer font-serif ${
                  statusFilter === 'Published' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setStatusFilter('Draft')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer font-serif ${
                  statusFilter === 'Draft' ? 'bg-amber-600 text-white shadow-xs' : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200'
                }`}
              >
                Draft / Review
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs font-serif">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-serif">
                <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200 font-serif">
                  <tr>
                    <th className="p-4">Event & Category</th>
                    <th className="p-4">Organizer & Venue</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Registrations / Capacity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-stone-700 font-serif">
                  {pendingEvents.map((ev) => (
                    <tr key={ev.id} className="hover:bg-stone-50 transition-colors font-serif">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={ev.bannerUrl}
                            alt={ev.title}
                            className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                          />
                          <div>
                            <span className="font-bold text-stone-900 text-xs block font-serif">
                              {ev.title}
                            </span>
                            <span className="text-[10px] text-[#7C6BA6] font-semibold bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200 font-serif">
                              {ev.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-serif">
                        <span className="font-semibold text-stone-900 block font-serif">{ev.organizer.name}</span>
                        <span className="text-[11px] text-stone-500 font-serif">{ev.venue}</span>
                      </td>
                      <td className="p-4 font-serif">
                        <span className="font-medium text-stone-900 block font-serif">{ev.date.fullDate}</span>
                        <span className="text-[10px] text-stone-500 font-serif">{ev.date.time}</span>
                      </td>
                      <td className="p-4 font-mono font-semibold text-stone-700">
                        {ev.registeredCount} / {ev.capacity} ({Math.round((ev.registeredCount / ev.capacity) * 100)}%)
                      </td>
                      <td className="p-4 font-serif">
                        {ev.status === 'Published' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold text-[10px] border border-emerald-200 font-serif">
                            <CheckCircle2 className="w-3 h-3" /> Live & Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold text-[10px] border border-amber-200 font-serif">
                            <AlertTriangle className="w-3 h-3" /> In Review
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-serif">
                        <div className="flex items-center justify-end gap-1.5">
                          {ev.status !== 'Published' ? (
                            <button
                              onClick={() => onApproveEvent(ev.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer font-serif shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => onRejectEvent(ev.id)}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold text-[11px] flex items-center gap-1 transition-all cursor-pointer font-serif shadow-xs"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-serif">
          {clubs.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between font-serif"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <img
                    src={c.logoUrl}
                    alt={c.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                  />
                  <button
                    onClick={() => onToggleClubVerification(c.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors flex items-center gap-1 cursor-pointer font-serif ${
                      c.isVerified
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-emerald-300 hover:text-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {c.isVerified ? 'Verified Chapter' : 'Mark Verified'}
                  </button>
                </div>
                <h4 className="font-bold text-sm text-stone-900 font-serif">{c.name}</h4>
                <p className="text-xs text-[#7C6BA6] font-semibold mt-0.5 font-serif">{c.college}</p>
                <p className="text-xs text-stone-600 mt-2 line-clamp-2 font-serif">{c.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex justify-between items-center text-xs text-stone-500 font-serif">
                <span className="font-semibold text-stone-800 font-serif">{c.membersCount.toLocaleString()} Students</span>
                <span className="text-[11px] font-serif text-stone-500">{c.category}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs font-serif">
          <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between font-serif">
            <h3 className="font-bold text-xs text-stone-900 font-serif">
              Administrative Operations Trail
            </h3>
            <span className="text-[11px] font-mono text-[#7C6BA6]">Audit Log v1.0</span>
          </div>

          <div className="divide-y divide-stone-200 font-serif">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-stone-50 font-serif">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    log.status === 'Success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                    log.status === 'Warning' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                    'bg-purple-50 text-[#7C6BA6] border border-purple-200'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="font-serif">
                    <span className="font-semibold text-stone-900 block font-serif">{log.action}</span>
                    <span className="text-[11px] text-stone-500 font-serif">
                      Actor: <span className="font-semibold text-[#7C6BA6]">{log.actor}</span> • Target: {log.target}
                    </span>
                  </div>
                </div>
                <div className="text-right font-serif">
                  <span className="text-[11px] font-mono text-stone-500 block">{log.timestamp}</span>
                  <span className="text-[10px] font-semibold text-emerald-600 font-serif">SHA-256 Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: District Analytics */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-serif">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 font-serif">
            <h3 className="font-bold text-sm text-stone-900 font-serif flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#7C6BA6]" />
              Top College Engagement Metrics
            </h3>
            <div className="space-y-3 text-xs font-serif">
              {[
                { college: 'KKWIEER, Nashik', count: 1240, percent: '88%' },
                { college: 'MET Bhujbal Knowledge City, Adgaon, Nashik', count: 960, percent: '76%' },
                { college: "NDMVP's KBT College of Engineering, Nashik", count: 820, percent: '68%' },
                { college: 'COEP Technological University, Pune', count: 640, percent: '54%' },
              ].map((item) => (
                <div key={item.college} className="space-y-1 font-serif">
                  <div className="flex justify-between text-xs font-serif">
                    <span className="font-medium text-stone-700 font-serif">{item.college}</span>
                    <span className="font-semibold text-[#7C6BA6] font-serif">{item.count} check-ins</span>
                  </div>
                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                    <div className="bg-[#8B7CB6] h-full rounded-full" style={{ width: item.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 font-serif">
            <h3 className="font-bold text-sm text-stone-900 font-serif flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              UPI & Payment Gateway Escrow Ledger
            </h3>
            <div className="space-y-2 text-xs font-serif">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between font-serif">
                <span className="text-stone-600 font-serif">Gross Platform Registrations:</span>
                <span className="font-bold text-stone-900 font-serif">₹4,12,800</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between font-serif">
                <span className="text-stone-600 font-serif">Zero-Commission Campus Subsidy:</span>
                <span className="font-semibold text-emerald-600 font-serif">- ₹0.00 (100% Retained by Clubs)</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between font-serif">
                <span className="text-stone-600 font-serif">Instant UPI Payouts Settled:</span>
                <span className="font-semibold text-[#7C6BA6] font-serif">98.2%</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[11px] font-medium font-serif">
                All payments are processed through Razorpay & BHIM UPI auto-verification protocols.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
