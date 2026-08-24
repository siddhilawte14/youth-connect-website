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
  CreditCard,
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
      fullDate: 'Dec 15, 2026',
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
  const [fullName, setFullName] = useState('Siddhi Lawte');
  const [collegeEmail, setCollegeEmail] = useState('siddhi.lawte@met.edu.in');
  const [department, setDepartment] = useState('Computer Science');
  const [teamName, setTeamName] = useState('ByteCraft Nashik');
  const [shareCopied, setShareCopied] = useState(false);

  // Payment simulation state
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed' | 'pending'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const registrationFee = event.fee > 0 ? event.fee : 0;
  const platformFee = 0;
  const totalAmount = registrationFee;

  const ticketNumber = event.ticketId || `TKT-${Math.floor(1000 + Math.random() * 9000)}-${event.category.substring(0, 3).toUpperCase()}`;

  const handlePay = (simulatedState: 'success' | 'failed' | 'pending' = 'success') => {
    if (!fullName.trim() || !collegeEmail.trim()) {
      setPaymentStatus('failed');
      setErrorMessage('Please fill in your Full Name and College Email ID.');
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
          collegeId: collegeEmail,
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
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-8 mb-20 md:mb-0 text-stone-900 font-serif">
      {/* Top back navigation */}
      <button
        id="reg-back-button"
        onClick={handleBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7C6BA6] hover:text-[#8B7CB6] hover:underline mb-4 cursor-pointer font-serif"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Discover
      </button>

      {/* Header Section */}
      <div className="mb-8 text-left font-serif">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-900 tracking-tight font-serif">
          {event.title}
        </h1>
        <p className="text-sm text-stone-600 mt-1 font-serif">
          Complete your registration to secure your spot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Registration Flow (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 font-serif">
          {/* Step 1: Attendee Details */}
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 font-serif">
            <div className="flex items-center gap-2.5 mb-6 border-b border-stone-200 pb-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7C6BA6] flex items-center justify-center border border-purple-200">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-stone-900 font-serif">
                1. Attendee Details
              </h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handlePay('success'); }} className="space-y-4 font-serif">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-serif">
                <div>
                  <label htmlFor="reg-fullname" className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                    Full Name
                  </label>
                  <input
                    id="reg-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Siddhi Lawte"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#8B7CB6] focus:bg-white transition-all font-serif"
                  />
                </div>

                <div>
                  <label htmlFor="reg-collegeemail" className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                    College Email ID
                  </label>
                  <input
                    id="reg-collegeemail"
                    type="email"
                    value={collegeEmail}
                    onChange={(e) => setCollegeEmail(e.target.value)}
                    placeholder="e.g. siddhi.lawte@met.edu.in"
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#8B7CB6] focus:bg-white transition-all font-serif"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-dept" className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                  Department
                </label>
                <select
                  id="reg-dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] focus:bg-white font-serif"
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
                <label htmlFor="reg-team" className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                  Team Name (For Hackathon / Group Activity)
                </label>
                <input
                  id="reg-team"
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Optional team moniker"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#8B7CB6] focus:bg-white font-serif"
                />
              </div>
            </form>
          </section>

          {/* Step 2: Secure Payment Section */}
          <section className="bg-white rounded-2xl p-6 shadow-xs border border-stone-200 relative overflow-hidden font-serif">
            <div className="relative z-10 font-serif">
              <div className="flex items-center gap-2.5 mb-6 border-b border-stone-200 pb-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 text-[#7C6BA6] flex items-center justify-center border border-purple-200">
                  <Wallet className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-stone-900 font-serif">
                  2. Secure Payment
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start justify-between font-serif">
                <div className="flex-1 w-full font-serif">
                  <div className="bg-stone-50 p-4 rounded-xl mb-4 border border-stone-200 font-serif">
                    <div className="flex justify-between items-center mb-2 text-xs text-stone-600 font-serif">
                      <span>Registration Fee</span>
                      <span className="font-bold text-sm text-stone-900 font-serif">
                        ₹{registrationFee.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mb-2 text-xs text-stone-600 font-serif">
                      <span>Platform Fee (Sponsored)</span>
                      <span className="text-emerald-700 line-through font-medium font-serif">
                        ₹{platformFee.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-stone-200 pt-3 mt-2 flex justify-between items-center font-serif">
                      <span className="text-xs font-bold text-stone-900 font-serif">Total Amount</span>
                      <span className="text-lg font-bold text-[#8B7CB6] font-serif">
                        ₹{totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 mb-4 flex items-center gap-1.5 font-medium font-serif">
                    <Lock className="w-3.5 h-3.5 text-[#8B7CB6]" /> Safe & Secure UPI Payment Gateway
                  </p>
                </div>

                {/* QR Box & Button */}
                <div className="w-full md:w-auto flex flex-col items-center gap-3 font-serif">
                  <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-xs inline-block">
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
                    className="w-full bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer font-serif"
                  >
                    <CreditCard className="w-4 h-4" />
                    {paymentStatus === 'processing'
                      ? 'Verifying Payment...'
                      : totalAmount > 0 ? `Pay ₹${totalAmount} via UPI` : 'Confirm Free Registration'}
                  </button>
                </div>
              </div>

              {/* Edge Case Simulation Chips */}
              <div className="mt-6 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-2 text-xs font-serif">
                <span className="text-[11px] text-stone-500 font-semibold mr-1 font-serif">Simulate Gateway States:</span>
                <button
                  onClick={() => handlePay('failed')}
                  className="flex items-center gap-1 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer font-serif"
                >
                  <AlertCircle className="w-3 h-3" /> Payment Failed (Simulated)
                </button>
                <button
                  onClick={() => handlePay('pending')}
                  className="flex items-center gap-1 text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer font-serif"
                >
                  <Clock className="w-3 h-3" /> Pending (Simulated)
                </button>
              </div>

              {/* Error or Pending Toast */}
              {paymentStatus === 'failed' && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2 animate-in fade-in font-serif">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage || 'Payment transaction failed. Please retry.'}</span>
                </div>
              )}

              {paymentStatus === 'pending' && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2 animate-in fade-in font-serif">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>{errorMessage || 'Payment pending reconciliation.'}</span>
                </div>
              )}
            </div>
          </section>

          {/* Step 3: Success State */}
          {paymentStatus === 'success' && (
            <section className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-xs animate-in fade-in duration-300 font-serif">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 text-white font-bold rounded-full shrink-0 shadow-xs">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left font-serif">
                  <h2 className="text-lg font-bold text-emerald-900 mb-1 font-serif">
                    You're registered!
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-serif">
                    Your registration & gate pass are confirmed. You can present this QR pass at the entry counter on event day.
                  </p>

                  {/* Actions: Add to Google Calendar, Share, View My Passes */}
                  <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start font-serif">
                    <button
                      onClick={() => {
                        const title = encodeURIComponent(event.title);
                        const location = encodeURIComponent(event.venue);
                        const details = encodeURIComponent(event.description + '\n\nRegistered via YouthConnect Platform');
                        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
                        window.open(url, '_blank');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 font-semibold text-xs shadow-xs transition-colors cursor-pointer font-serif"
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
                          setShareCopied(true);
                          setTimeout(() => setShareCopied(false), 2500);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-200 font-semibold text-xs shadow-xs transition-colors cursor-pointer font-serif"
                    >
                      <Share2 className="w-4 h-4 text-[#8B7CB6]" />
                      <span>{shareCopied ? 'Link Copied!' : 'Share Event'}</span>
                    </button>

                    {onViewMyEvents && (
                      <button
                        onClick={onViewMyEvents}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer font-serif"
                      >
                        <Ticket className="w-4 h-4" />
                        <span>View My Passes</span>
                      </button>
                    )}

                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs transition-colors cursor-pointer font-serif"
                    >
                      <span>Explore More Events</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Digital Pass Highlight (5 Cols) */}
        <div className="lg:col-span-5 sticky top-20 font-serif">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col items-center font-serif">
            <h3 className="text-xs font-semibold text-[#7C6BA6] uppercase tracking-wider mb-4 self-start font-serif">
              Your Digital Pass
            </h3>

            {/* The Digital Pass Ticket */}
            <div id="digital-ticket-pass" className="w-full max-w-[320px] bg-stone-50 rounded-2xl shadow-xs overflow-hidden flex flex-col border border-stone-200 font-serif">
              {/* Ticket Header */}
              <div className="bg-[#8B7CB6] p-5 text-white flex flex-col items-center relative text-center font-serif">
                <span className="bg-white/20 text-white text-[10px] font-semibold px-3 py-1 rounded-full mb-3 backdrop-blur-xs relative z-10 border border-white/30 tracking-wider font-serif">
                  {event.fee > 0 ? 'VIP ACCESS' : 'GENERAL ACCESS'}
                </span>

                <h4 className="text-base font-bold mb-1 relative z-10 font-serif leading-tight">
                  {event.title}
                </h4>
                <p className="text-xs opacity-90 relative z-10 font-serif">
                  {event.venue}
                </p>

                <div className="mt-4 w-full flex justify-between text-[11px] relative z-10 pt-2 border-t border-white/20 font-serif">
                  <div className="text-left font-serif">
                    <span className="block opacity-75 text-[9px] uppercase tracking-wider">DATE</span>
                    <span>{event.date.fullDate}</span>
                  </div>
                  <div className="text-right font-serif">
                    <span className="block opacity-75 text-[9px] uppercase tracking-wider">TIME</span>
                    <span>{event.date.time.split('-')[0].trim()}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Body (Attendee Details) */}
              <div className="bg-white p-5 relative border-b border-dashed border-stone-300 font-serif">
                {/* Cutout circles on sides for authentic ticket effect */}
                <div className="absolute -left-3 -top-3 w-6 h-6 bg-[#FAF9F6] rounded-full border-r border-stone-200" />
                <div className="absolute -right-3 -top-3 w-6 h-6 bg-[#FAF9F6] rounded-full border-l border-stone-200" />

                <div className="grid grid-cols-2 gap-3 mb-2 text-xs font-serif">
                  <div>
                    <span className="block text-[10px] font-semibold text-stone-500 uppercase">NAME</span>
                    <span className="block text-xs font-bold text-stone-900 truncate font-serif">
                      {fullName || 'Siddhi Lawte'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold text-stone-500 uppercase">EMAIL</span>
                    <span className="block text-xs font-bold text-stone-900 truncate font-serif">
                      {collegeEmail || 'siddhi.lawte@met.edu.in'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="block text-[10px] font-semibold text-stone-500 uppercase">DEPARTMENT</span>
                    <span className="block text-xs font-semibold text-stone-700 font-serif">
                      {department || 'Computer Science'}
                    </span>
                  </div>
                  {teamName && (
                    <div className="col-span-2">
                      <span className="block text-[10px] font-semibold text-stone-500 uppercase">TEAM</span>
                      <span className="block text-xs font-bold text-[#7C6BA6] font-serif">
                        {teamName}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Footer (QR Code) */}
              <div className="bg-white p-5 flex flex-col items-center relative font-serif">
                <span className="text-[10px] font-semibold text-stone-500 mb-2 tracking-wider font-serif">
                  SCAN AT ENTRY
                </span>

                <div className="bg-white p-2 border border-stone-200 rounded-xl inline-block shadow-xs">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFq60ErKFLT51rke9lWUdS1Pnm8Nn-xLr_tYgLLdxom0R3x8ewc33THepzmWmoYN5dfL6wKFFT6oDBMfRIXweZpnS-NmDRcxCv6yNPuv8xHOqWVFNkesF9kQ1HsiV_VcDSvet2P7EPKAvBTABA19DH0s-_VMGMO87npPgsLiB1K--qgHfBEwvr5q9B7aancYomT3HVnZjYoCH7rsDozCsyQeKPUbs6VYGwr9WB4AVvsxEwGtGvEbFr"
                    alt="Ticket QR Code"
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                </div>

                <span className="text-xs font-mono font-bold text-[#7C6BA6] mt-3 tracking-[0.2em]">
                  {ticketNumber}
                </span>
              </div>
            </div>

            {/* Download Action Button */}
            <button
              id="btn-download-pass-pdf"
              onClick={handlePrintOrDownload}
              className="mt-6 w-full bg-stone-50 hover:bg-stone-100 border border-stone-200 text-[#7C6BA6] font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer font-serif"
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

