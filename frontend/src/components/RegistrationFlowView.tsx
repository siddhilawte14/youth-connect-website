import React, { useState } from 'react';
import { EventItem, DigitalPass } from '../types';
import { 
  User, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  Download, 
  AlertCircle, 
  Clock, 
  ArrowLeft, 
  Sparkles,
  CreditCard,
  Printer,
  CalendarPlus,
  Share2,
  Ticket
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationFlowViewProps {
  event?: EventItem;
  selectedEvent?: EventItem | null;
  events?: EventItem[];
  onBack?: () => void;
  onBackToDiscovery?: () => void;
  onRegistrationComplete?: (newPass: DigitalPass) => void;
  onCompleteRegistration?: (newPass: DigitalPass) => void;
  onViewMyEvents?: () => void;
}

export const RegistrationFlowView: React.FC<RegistrationFlowViewProps> = ({
  event: propEvent,
  selectedEvent,
  events = [],
  onBack,
  onBackToDiscovery,
  onRegistrationComplete,
  onCompleteRegistration,
  onViewMyEvents,
}) => {
  // Resolve target event safely with fallback
  const event: EventItem = selectedEvent || propEvent || events[0] || {
    id: 'evt-techsprint-2026',
    title: 'TechSprint Nashik Hackathon 2026',
    category: 'Technology',
    tags: ['Hackathon', 'Coding', 'Nashik'],
    date: {
      month: 'DEC',
      day: '15',
      fullDate: 'Dec 15, 2024',
      time: '10:00 AM - 4:00 PM',
    },
    venue: 'KKWIEER Campus, Nashik',
    area: 'Panchavati',
    fee: 150,
    feeLabel: 'Pass: ₹150',
    status: 'Published',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    organizer: { name: 'Nashik Student Chapter', isVerified: true },
    description: 'Premier regional hackathon and code sprint for collegiate developers in Nashik.',
    capacity: 200,
    registeredCount: 140,
    views: 1200,
    conversionRate: '12%',
  };

  const handleBack = onBack || onBackToDiscovery || (() => {});
  const handleComplete = onCompleteRegistration || onRegistrationComplete || (() => {});

  // Form State
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [collegeId, setCollegeId] = useState('21BCE045');
  const [department, setDepartment] = useState('Computer Science');
  const [teamName, setTeamName] = useState('ByteCraft Nashik');

  // Payment simulation state
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'pending'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const registrationFee = event.fee > 0 ? event.fee : 0;
  const platformFee = 0;
  const totalAmount = registrationFee;

  const ticketNumber = event.ticketId || `TKT-${Math.floor(1000 + Math.random() * 9000)}-${event.category.substring(0, 3).toUpperCase()}`;

  const handlePay = (simulatedState: 'success' | 'failed' | 'pending' = 'success') => {
    if (!fullName.trim() || !collegeId.trim()) {
      setPaymentStatus('failed');
      setErrorMessage('Please fill in your Full Name and College ID.');
      return;
    }

    setPaymentStatus('processing');
    setTimeout(() => {
      if (simulatedState === 'success') {
        setPaymentStatus('success');
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });

        const newPass: DigitalPass = {
          ticketId: ticketNumber,
          eventId: event.id,
          eventTitle: event.title,
          venue: event.venue,
          date: event.date.fullDate,
          time: event.date.time.split('-')[0].trim() || '09:00 AM',
          tier: event.fee > 0 ? 'VIP ACCESS' : 'STANDARD PASS',
          attendeeName: fullName,
          collegeId: collegeId,
          department: department || 'Engineering',
          teamName: teamName,
          qrCodeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFq60ErKFLT51rke9lWUdS1Pnm8Nn-xLr_tYgLLdxom0R3x8ewc33THepzmWmoYN5dfL6wKFFT6oDBMfRIXweZpnS-NmDRcxCv6yNPuv8xHOqWVFNkesF9kQ1HsiV_VcDSvet2P7EPKAvBTABA19DH0s-_VMGMO87npPgsLiB1K--qgHfBEwvr5q9B7aancYomT3HVnZjYoCH7rsDozCsyQeKPUbs6VYGwr9WB4AVvsxEwGtGvEbFr',
          status: 'Valid',
          amountPaid: totalAmount,
          issuedAt: new Date().toISOString(),
        };

        handleComplete(newPass);
      } else if (simulatedState === 'failed') {
        setPaymentStatus('failed');
        setErrorMessage('UPI transaction declined by bank server. Please retry.');
      } else {
        setPaymentStatus('pending');
        setErrorMessage('Awaiting bank confirmation callback. We will notify you once verified.');
      }
    }, 900);
  };

  const handlePrintOrDownload = () => {
    window.print();
  };

  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 mb-20 md:mb-0">
      {/* Top back navigation */}
      <button
        id="reg-back-button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0058be] hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </button>

      {/* Header Section (Exact match of Image 7) */}
      <div className="mb-8 text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0058be] tracking-tight font-headline">
          {event.title}
        </h1>
        <p className="text-sm sm:text-base text-[#424754] mt-1">
          Complete your registration to secure your spot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Registration Flow (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Step 1: Attendee Details */}
          <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(59,130,246,0.08)] border border-[#c2c6d6]/60">
            <div className="flex items-center gap-2.5 mb-6 border-b border-[#e5eeff] pb-3">
              <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#0058be] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-[#0b1c30] font-headline">
                1. Attendee Details
              </h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handlePay('success'); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-fullname" className="block text-xs font-bold text-[#0b1c30] mb-1">
                    Full Name
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-white border border-[#c2c6d6] rounded-xl px-4 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="reg-collegeid" className="block text-xs font-bold text-[#0b1c30] mb-1">
                    College ID / Roll No
                  </label>
                  <input
                    id="reg-collegeid"
                    type="text"
                    value={collegeId}
                    onChange={(e) => setCollegeId(e.target.value)}
                    placeholder="e.g. 21BCE045"
                    className="w-full bg-white border border-[#c2c6d6] rounded-xl px-4 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-dept" className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Department
                </label>
                <select
                  id="reg-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-white border border-[#c2c6d6] rounded-xl px-4 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be]"
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Event Specific Field */}
              <div>
                <label htmlFor="reg-team" className="block text-xs font-bold text-[#0b1c30] mb-1">
                  Team Name (For Hackathon Only)
                </label>
                <input
                  id="reg-team"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Optional"
                  className="w-full bg-white border border-[#c2c6d6] rounded-xl px-4 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be]"
                />
              </div>
            </form>
          </section>

          {/* Step 2: Secure Payment Section */}
          <section className="bg-white rounded-2xl p-6 shadow-[0_4px_12px_rgba(59,130,246,0.08)] border border-[#c2c6d6]/60 relative overflow-hidden">
            {/* Subtle background checker pattern */}
            <div 
              className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{
                backgroundImage: 'repeating-linear-gradient(45deg, #0058be 25%, transparent 25%, transparent 75%, #0058be 75%, #0058be)',
                backgroundSize: '20px 20px'
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-6 border-b border-[#e5eeff] pb-3">
                <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#0058be] flex items-center justify-center">
                  <Wallet className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-[#0b1c30] font-headline">
                  2. Secure Payment
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                <div className="flex-1 w-full">
                  <div className="bg-[#e5eeff]/70 p-4 rounded-xl mb-4 border border-[#c2c6d6]/40">
                    <div className="flex justify-between items-center mb-2 text-xs text-[#424754]">
                      <span>Registration Fee</span>
                      <span className="font-bold text-sm text-[#0b1c30]">
                        ₹{registrationFee.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-2 text-xs text-[#424754]">
                      <span>Platform Fee (100% discount)</span>
                      <span className="text-emerald-700 line-through font-medium">
                        ₹{platformFee.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-[#c2c6d6] pt-3 mt-2 flex justify-between items-center">
                      <span className="text-sm font-bold text-[#0b1c30]">Total Amount</span>
                      <span className="text-xl font-extrabold text-[#0058be] font-headline">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#424754] mb-4 flex items-center gap-1.5 font-medium">
                    <Lock className="w-3.5 h-3.5 text-[#0058be]" /> Safe & Secure UPI Payment
                  </p>
                </div>

                {/* QR Box & Button */}
                <div className="w-full md:w-auto flex flex-col items-center gap-3">
                  <div className="bg-white p-2 rounded-xl border border-[#c2c6d6] shadow-xs inline-block">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAzYLwMduTkXO6t9JALJ9nxmXEtdh1U6kZe5zPypJtYnmp-IzLlFth5mt782yBUjYf0LQ0fbVNAyEgoHrVHJQZECUB6E_-nAVQP43nUFovlRkjXes-h2ghWKlfVTr6f2z4Z3TmGWlDZ37Ki-zClrlOXlbdRdoCNWPNMbwMt2KnHC7Wq0WuwZLYYMcqsvovQ9JCaCAcsZqApyGkshz11DAQMcDrizlFdo-BG0NWQGS3b3ANTfjxhZf3x"
                      alt="UPI QR Code"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>

                  <button
                    id="btn-pay-upi"
                    onClick={() => handlePay('success')}
                    disabled={paymentStatus === 'processing'}
                    className="w-full bg-[#0058be] hover:bg-[#2563EB] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    <CreditCard className="w-4 h-4" />
                    {paymentStatus === 'processing'
                      ? 'Verifying Payment...'
                      : totalAmount > 0 ? `Pay ₹${totalAmount} via UPI` : 'Confirm Free Registration'}
                  </button>
                </div>
              </div>

              {/* Edge Case Simulation Chips */}
              <div className="mt-6 pt-4 border-t border-[#e5eeff] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[11px] text-[#727785] font-semibold mr-1">Simulate Edge States:</span>
                <button
                  onClick={() => handlePay('failed')}
                  className="flex items-center gap-1 text-[#93000a] bg-[#ffdad6] hover:bg-red-200 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                >
                  <AlertCircle className="w-3 h-3" /> Payment Failed (Simulated)
                </button>
                <button
                  onClick={() => handlePay('pending')}
                  className="flex items-center gap-1 text-[#9d4300] bg-[#ffdbca] hover:bg-orange-200 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors"
                >
                  <Clock className="w-3 h-3" /> Pending (Simulated)
                </button>
              </div>

              {/* Error or Pending Toast */}
              {paymentStatus === 'failed' && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage || 'Payment transaction failed. Please retry.'}</span>
                </div>
              )}

              {paymentStatus === 'pending' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 animate-in fade-in">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{errorMessage || 'Payment pending reconciliation.'}</span>
                </div>
              )}
            </div>
          </section>

          {/* Step 3: Success State */}
          {paymentStatus === 'success' && (
            <section className="bg-[#f5fff6] border border-[#4edea3] rounded-2xl p-6 shadow-[0_4px_12px_rgba(78,222,163,0.15)] animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#00855b] text-white rounded-full shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl font-bold text-[#00855b] mb-1 font-headline">
                    You're registered!
                  </h2>
                  <p className="text-xs sm:text-sm text-[#424754]">
                    Your registration & gate pass are confirmed. You can present this QR pass at the entry counter on event day.
                  </p>

                  {/* Actions: Add to Google Calendar, Share, View My Passes */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <button
                      onClick={() => {
                        const title = encodeURIComponent(event.title);
                        const location = encodeURIComponent(event.venue);
                        const details = encodeURIComponent(event.description + '\n\nRegistered via YouthConnect Platform');
                        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
                        window.open(url, '_blank');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs shadow-2xs transition-colors"
                    >
                      <CalendarPlus className="w-4 h-4 text-emerald-700" />
                      <span>Add to Google Calendar</span>
                    </button>

                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: `I'm attending ${event.title}!`,
                            text: `Join me at ${event.title} in ${event.venue} on YouthConnect!`,
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          navigator.clipboard?.writeText(window.location.href);
                          alert('Event link copied to clipboard!');
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-[#424754] border border-[#c2c6d6] font-bold text-xs shadow-2xs transition-colors"
                    >
                      <Share2 className="w-4 h-4 text-[#727785]" />
                      <span>Share Event</span>
                    </button>

                    {onViewMyEvents && (
                      <button
                        onClick={onViewMyEvents}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0058be] hover:bg-[#004bb0] text-white font-bold text-xs shadow-2xs transition-colors"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>View My Passes</span>
                      </button>
                    )}

                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#424754] font-semibold text-xs transition-colors"
                    >
                      <span>Explore More Events</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Digital Pass Highlight (5 Cols) (Exact match of Image 7) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="bg-[#eff4ff] p-5 sm:p-6 rounded-2xl border border-[#c2c6d6]/60 shadow-[0_12px_32px_rgba(0,0,0,0.08)] flex flex-col items-center">
            <h3 className="text-xs font-bold text-[#424754] uppercase tracking-wider mb-4 self-start">
              Your Digital Pass
            </h3>

            {/* The Digital Pass Ticket */}
            <div id="digital-ticket-pass" className="w-full max-w-[320px] bg-white rounded-2xl shadow-[0_6px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col border border-[#c2c6d6]/40">
              {/* Ticket Header (Blue) */}
              <div className="bg-[#0058be] p-5 text-white flex flex-col items-center relative text-center">
                {/* Subtle overlay dots */}
                <div 
                  className="absolute inset-0 opacity-10" 
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                  }}
                />

                <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full mb-3 backdrop-blur-xs relative z-10 border border-white/30 tracking-wider">
                  {event.fee > 0 ? 'VIP ACCESS' : 'GENERAL ACCESS'}
                </span>

                <h4 className="text-lg font-bold mb-1 relative z-10 font-headline leading-tight">
                  {event.title}
                </h4>
                <p className="text-xs opacity-90 relative z-10 font-medium">
                  {event.venue}
                </p>

                <div className="mt-4 w-full flex justify-between text-[11px] relative z-10 pt-2 border-t border-white/20 font-medium">
                  <div className="text-left">
                    <span className="block opacity-75 text-[9px] uppercase tracking-wider">DATE</span>
                    <span>{event.date.fullDate}</span>
                  </div>
                  <div className="text-right">
                    <span className="block opacity-75 text-[9px] uppercase tracking-wider">TIME</span>
                    <span>{event.date.time.split('-')[0].trim()}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Body (Attendee Details) */}
              <div className="bg-white p-5 ticket-border-dashed relative">
                {/* Cutout circles on sides for authentic ticket effect */}
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#eff4ff] rounded-full" />
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#eff4ff] rounded-full" />

                <div className="grid grid-cols-2 gap-3 mb-2 text-xs">
                  <div>
                    <span className="block text-[10px] font-semibold text-[#727785] uppercase">NAME</span>
                    <span className="block text-sm font-bold text-[#0b1c30] truncate">
                      {fullName || 'Rahul Sharma'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-[#727785] uppercase">ID</span>
                    <span className="block text-sm font-bold text-[#0b1c30]">
                      {collegeId || '21BCE045'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] font-semibold text-[#727785] uppercase">DEPARTMENT</span>
                    <span className="block text-xs font-bold text-[#0b1c30]">
                      {department || 'Computer Science'}
                    </span>
                  </div>
                  {teamName && (
                    <div className="col-span-2">
                      <span className="block text-[10px] font-semibold text-[#727785] uppercase">TEAM</span>
                      <span className="block text-xs font-bold text-[#0058be]">
                        {teamName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Footer (QR Code) */}
              <div className="bg-white p-5 flex flex-col items-center relative">
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#eff4ff] rounded-full" />
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#eff4ff] rounded-full" />

                <span className="text-[10px] font-bold text-[#727785] mb-2 tracking-wider">
                  SCAN AT ENTRY
                </span>

                <div className="bg-white p-1.5 border border-[#c2c6d6] rounded-xl inline-block shadow-2xs">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFq60ErKFLT51rke9lWUdS1Pnm8Nn-xLr_tYgLLdxom0R3x8ewc33THepzmWmoYN5dfL6wKFFT6oDBMfRIXweZpnS-NmDRcxCv6yNPuv8xHOqWVFNkesF9kQ1HsiV_VcDSvet2P7EPKAvBTABA19DH0s-_VMGMO87npPgsLiB1K--qgHfBEwvr5q9B7aancYomT3HVnZjYoCH7rsDozCsyQeKPUbs6VYGwr9WB4AVvsxEwGtGvEbFr"
                    alt="Ticket QR Code"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                <span className="text-xs font-mono font-bold text-[#424754] mt-3 tracking-[0.2em]">
                  {ticketNumber}
                </span>
              </div>
            </div>

            {/* Download Action Button */}
            <button
              id="btn-download-pass-pdf"
              onClick={handlePrintOrDownload}
              className="mt-6 w-full bg-white hover:bg-gray-50 border border-[#0058be] text-[#0058be] font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Pass PDF
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
