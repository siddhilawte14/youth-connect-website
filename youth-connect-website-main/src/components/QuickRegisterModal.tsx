import React, { useState, useEffect } from 'react';
import { EventItem, UserProfile, PREMIER_COLLEGES } from '../types';
import { 
  X, 
  User, 
  Mail, 
  GraduationCap, 
  Building2, 
  Calendar, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  Ticket, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BadgeCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuickRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | null;
  userProfile: UserProfile | null;
  onConfirmRegistration: (event: EventItem, studentData: {
    name: string;
    email: string;
    prn: string;
    college: string;
    department: string;
  }) => void;
}

export const QuickRegisterModal: React.FC<QuickRegisterModalProps> = ({
  isOpen,
  onClose,
  event,
  userProfile,
  onConfirmRegistration,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [prn, setPrn] = useState('22BCE104');
  const [college, setCollege] = useState<string>(PREMIER_COLLEGES[0]);
  const [department, setDepartment] = useState('Computer Engineering');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Sync default user profile data when opened
  useEffect(() => {
    if (isOpen && event) {
      setName(userProfile?.name || 'Siddhi Lawte');
      setEmail(userProfile?.email || 'siddhi.lawte@met.edu.in');
      setPrn(userProfile?.prn || userProfile?.studentId || '22BCE104');
      setCollege(userProfile?.college || PREMIER_COLLEGES[0]);
      setDepartment(userProfile?.department || 'Computer Engineering');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen, event, userProfile]);

  if (!isOpen || !event) return null;

  const currentAttendeeCount = event.attendees ? event.attendees.length : event.registeredCount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const ticketId = `YC-2026-TK-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedTicketId(ticketId);

    // Simulated network registration
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#7C6BA6', '#8B7CB6', '#10B981']
        });
      } catch (err) {
        // fallback
      }

      onConfirmRegistration(event, {
        name: name.trim(),
        email: email.trim(),
        prn: userProfile?.prn || 'STUDENT',
        college: college.trim(),
        department: department.trim(),
      });

      // Smooth auto-dismiss
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div className="relative w-full max-w-lg rounded-3xl bg-white text-stone-900 border border-stone-200/90 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#8B7CB6]" />

        {/* Modal Header */}
        <div className="px-5 pt-5 pb-3 border-b border-stone-200 flex items-start justify-between bg-stone-50 font-serif">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-[#8B7CB6] shadow-xs">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7C6BA6] bg-purple-50 px-2 py-0.2 rounded-full border border-purple-200 font-serif">
                  Instant Registration
                </span>
                <span className="text-[11px] font-medium text-stone-500 font-serif">
                  ⚡ 1-Click Gate Pass
                </span>
              </div>
              <h2 className="text-base font-bold text-stone-900 font-serif mt-0.5 line-clamp-1">
                Register for {event.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Event Quick Snapshot Card */}
        <div className="p-3.5 mx-5 mt-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3 font-serif shadow-xs">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate font-serif">{event.title}</h4>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-stone-500 mt-0.5 font-serif">
              <span className="flex items-center gap-1 text-[#7C6BA6] font-medium">
                <Calendar className="w-3 h-3" />
                {event.date.fullDate || `${event.date.month} ${event.date.day}`}
              </span>
              <span className="flex items-center gap-1 text-stone-500">
                <MapPin className="w-3 h-3 text-rose-500" />
                {event.venue}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0 font-serif">
            <span className="px-2 py-0.5 rounded-lg bg-purple-50 border border-purple-200 text-[#7C6BA6] text-xs font-semibold">
              {event.fee === 0 ? 'FREE ENTRY' : `₹${event.fee}`}
            </span>
            <span className="block text-[10px] text-stone-500 mt-0.5 font-serif">
              {currentAttendeeCount} joined
            </span>
          </div>
        </div>

        {isSuccess ? (
          <div className="p-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-200 font-serif">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-serif">
              Registration Confirmed!
            </h3>
            <p className="text-xs text-stone-600 mt-1 max-w-xs font-serif">
              Welcome aboard, <strong className="text-stone-900">{name}</strong>! Your pass <span className="font-mono text-[#7C6BA6] font-bold">{generatedTicketId}</span> is active in My Passes.
            </p>
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5 font-serif">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SPPU Academic Verified Pass Ready</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 pt-3 flex flex-col gap-3 font-serif">
            {/* Student Name */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1 font-serif">
                Student Full Name <span className="text-[#8B7CB6]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Siddhi Lawte"
                  className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                />
              </div>
            </div>

            {/* Student Email */}
            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1 font-serif">
                Student Email <span className="text-[#8B7CB6]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@college.edu.in"
                  className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                />
              </div>
            </div>

            {/* College & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1 font-serif">
                  College / Institute
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <select
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif cursor-pointer truncate shadow-xs"
                  >
                    {PREMIER_COLLEGES.map((c) => (
                      <option key={c} value={c} className="bg-white text-stone-900">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1 font-serif">
                  Department
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Engg"
                    className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-[#7C6BA6] text-xs flex items-center gap-2 font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7CB6] shrink-0" />
              <span>Instant QR Pass generation and live attendee counter update.</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1 font-serif">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-medium text-stone-700 transition-colors cursor-pointer font-serif"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting || !name.trim() || !email.trim()}
                className="flex-1 py-2 px-4 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer font-serif"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Issuing Digital Pass...</span>
                  </>
                ) : (
                  <>
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Confirm & Get Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
