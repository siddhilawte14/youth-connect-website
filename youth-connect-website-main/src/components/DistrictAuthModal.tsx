import React, { useState, useEffect } from 'react';
import { YouthConnectLogo } from './YouthConnectLogo';
import { 
  X, 
  GraduationCap, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Lock, 
  Ticket, 
  Building2,
  Mail,
  User,
  KeyRound,
  IdCard,
  Briefcase,
  QrCode,
  Award,
  Users,
  Eye,
  EyeOff,
  Shield,
  BadgeCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Role, PREMIER_COLLEGES } from '../types';

export { PREMIER_COLLEGES };

interface DistrictAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  targetEventTitle?: string;
  categoryHint?: string;
  defaultRole?: 'student' | 'organizer';
}

export const DistrictAuthModal: React.FC<DistrictAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  targetEventTitle,
  categoryHint,
  defaultRole = 'student',
}) => {
  const [activeTab, setActiveTab] = useState<'student' | 'organizer'>(defaultRole);

  // Student Form State
  const [studentName, setStudentName] = useState('Siddhi Lawte');
  const [studentEmail, setStudentEmail] = useState('siddhi.lawte@met.edu.in');
  const [studentCollege, setStudentCollege] = useState<string>(PREMIER_COLLEGES[0]);
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Organizer Form State
  const [orgId, setOrgId] = useState('organizer.ieee@kkwagh.edu.in');
  const [orgPassword, setOrgPassword] = useState('organizer2026');
  const [showOrgPassword, setShowOrgPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultRole);
      setIsSubmitting(false);
      setErrorMessage('');
      setIsSuccess(false);
      setShowOrgPassword(false);
    }
  }, [isOpen, defaultRole]);

  if (!isOpen) return null;

  // Dynamic domain validation detection
  const isAcademicDomain = studentEmail.toLowerCase().includes('.edu') || 
    studentEmail.toLowerCase().includes('.ac.in') || 
    studentEmail.toLowerCase().includes('@kkwagh') || 
    studentEmail.toLowerCase().includes('@sandip') || 
    studentEmail.toLowerCase().includes('@met');

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentEmail.trim()) {
      setErrorMessage('Please fill in all student credential fields');
      return;
    }
    if (!studentCollege) {
      setErrorMessage('Please select your college / institute');
      return;
    }
    if (!studentEmail.includes('@') || !studentEmail.includes('.')) {
      setErrorMessage('Please enter a valid academic email address');
      return;
    }
    if (!agreedTerms) {
      setErrorMessage('Please accept academic data consent to proceed');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#6D28D9', '#8B5CF6', '#A855F7', '#3B82F6', '#10B981']
        });
      } catch (err) {
        // confetti fallback
      }

      const generatedProfile: UserProfile = {
        id: `usr-std-${Date.now()}`,
        name: studentName.trim(),
        email: studentEmail.trim().toLowerCase(),
        role: 'student' as Role,
        college: studentCollege,
        department: 'Computer Engineering',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        isLoggedIn: true,
      };

      setTimeout(() => {
        onLoginSuccess(generatedProfile);
        onClose();
      }, 800);
    }, 600);
  };

  const handleOrganizerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId.trim()) {
      setErrorMessage('Please enter your Chapter / Organizer Email');
      return;
    }
    if (!orgPassword.trim()) {
      setErrorMessage('Please enter your Security Passkey');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#7C3AED', '#6D28D9', '#8B5CF6', '#10B981']
        });
      } catch (err) {
        // confetti fallback
      }

      const generatedProfile: UserProfile = {
        id: `usr-org-${Date.now()}`,
        name: 'Nashik Tech Committee & IEEE',
        email: orgId,
        role: 'organizer' as Role,
        college: 'KKWIEER Campus',
        clubName: 'Nashik Coders Hub & IEEE Student Branch',
        department: 'Technical Council',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        isLoggedIn: true,
      };

      setTimeout(() => {
        onLoginSuccess(generatedProfile);
        onClose();
      }, 800);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto font-serif">
      <div 
        id="academic-auth-modal"
        className="relative w-full max-w-4xl bg-white text-stone-900 rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col md:flex-row my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Top Minimalist Lilac Strip (Mobile) */}
        <div className="h-1.5 w-full bg-[#8B7CB6] md:hidden" />

        {/* LEFT PANEL: Brand Showcase / Visual Panel (Desktop) */}
        <div className="hidden md:flex md:w-5/12 bg-stone-50 text-stone-900 p-8 flex-col justify-between relative overflow-hidden border-r border-stone-200">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-60 h-60 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-50/70 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-white text-[#8B7CB6] border border-stone-200 flex items-center justify-center p-1.5 shadow-xs">
                <YouthConnectLogo className="w-full h-full text-[#8B7CB6]" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-stone-900 block font-serif">
                  Youth<span className="text-[#8B7CB6]">Connect</span>
                </span>
                <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block font-serif">
                  STUDENT CAMPUS HUB
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-stone-900 font-serif leading-tight mt-6">
              Your Academic Passport to Campus Life.
            </h3>
            <p className="text-xs text-stone-600 mt-2.5 font-normal leading-relaxed font-serif">
              Unified gateway for hackathons, cultural fests, NGO volunteering credits, and collegiate workshops across colleges.
            </p>
          </div>

          {/* Middle Value Proposition Bullets */}
          <div className="relative z-10 my-6 space-y-3 font-serif">
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center shrink-0 border border-purple-100">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">One-Click Digital QR Entry</h4>
                <p className="text-[11px] text-stone-500">Instant passes synced to your academic profile</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Verified NGO Certificates</h4>
                <p className="text-[11px] text-stone-500">Accredited social service hours tracking</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center shrink-0 border border-purple-100">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900">Hackathon Team Matching</h4>
                <p className="text-[11px] text-stone-500">Collegiate technical network & circles</p>
              </div>
            </div>
          </div>

          {/* Bottom Active Institution Trust Pill */}
          <div className="relative z-10 pt-4 border-t border-stone-200">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-medium text-stone-700 font-serif shadow-xs">
              <Building2 className="w-3.5 h-3.5 text-[#8B7CB6]" />
              <span>Trusted by 15+ Nashik Campuses</span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Interactive Form Panel */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between bg-white relative text-stone-900">
          
          {/* Header Row: Title & Close Button */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif tracking-tight">
                  {activeTab === 'student' ? 'Student Verification' : 'Organizer Authentication'}
                </h2>
                <p className="text-xs text-stone-500 mt-0.5 font-serif">
                  {activeTab === 'student'
                    ? 'Enter your student credentials to claim instant passes'
                    : 'Authorized committee passkey access'}
                </p>
              </div>

              {/* Minimalist Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-200 cursor-pointer shrink-0 ml-2"
                aria-label="Close modal"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Event Callout (If opened from pass booking) */}
            {targetEventTitle && (
              <div className="mb-4 p-3 rounded-2xl bg-purple-50 border border-purple-200 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B7CB6] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Ticket className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-semibold text-[#7C6BA6] uppercase tracking-wider block font-serif">
                    Event Pass Checkout
                  </span>
                  <h4 className="text-xs font-bold text-stone-900 truncate font-serif">
                    {targetEventTitle}
                  </h4>
                </div>
              </div>
            )}

            {/* Segmented Tab Switcher with Pill-Slider */}
            <div className="p-1 rounded-2xl bg-stone-100 border border-stone-200 grid grid-cols-2 text-xs font-semibold mb-5 font-serif">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('student');
                  setErrorMessage('');
                }}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-[#8B7CB6] text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Access</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setActiveTab('organizer');
                  setErrorMessage('');
                }}
                className={`py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'organizer'
                    ? 'bg-[#8B7CB6] text-white shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Organizer Portal</span>
              </button>
            </div>
          </div>

          {/* Form Content Body */}
          {!isSuccess ? (
            <div>
              {activeTab === 'student' ? (
                <form onSubmit={handleStudentSubmit} className="space-y-3.5 font-serif">
                  {/* Field 1: Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                      Full Name <span className="text-[#8B7CB6]">*</span>
                    </label>
                    <div className="relative flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-[#8B7CB6] transition-all shadow-xs">
                      <User className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g. Siddhi Lawte"
                        className="w-full px-3 py-2.5 text-xs font-medium text-stone-900 bg-transparent focus:outline-none placeholder-stone-400 font-serif"
                      />
                    </div>
                  </div>

                  {/* Field 2: College Email with Dynamic Domain Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-stone-700 font-serif">
                        College Email ID <span className="text-[#8B7CB6]">*</span>
                      </label>
                      {isAcademicDomain && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-serif">
                          <Check className="w-3 h-3 text-emerald-600" />
                          Academic Domain Verified
                        </span>
                      )}
                    </div>
                    <div className="relative flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-[#8B7CB6] transition-all shadow-xs">
                      <Mail className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
                      <input
                        type="email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="student@kkwagh.edu.in / name@college.ac.in"
                        className="w-full px-3 py-2.5 text-xs font-medium text-stone-900 bg-transparent focus:outline-none placeholder-stone-400 font-serif"
                      />
                    </div>
                  </div>

                  {/* Field 3: Select College / Institute */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                      Select College / Institute <span className="text-[#8B7CB6]">*</span>
                    </label>
                    <div className="relative flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-[#8B7CB6] transition-all shadow-xs">
                      <Building2 className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
                      <select
                        value={studentCollege}
                        onChange={(e) => setStudentCollege(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs font-medium text-stone-900 bg-transparent focus:outline-none truncate cursor-pointer font-serif"
                      >
                        {PREMIER_COLLEGES.map((c) => (
                          <option key={c} value={c} className="bg-white text-stone-900 font-serif">
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms & Security Privacy Guarantee */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2 text-[11px] text-stone-500 cursor-pointer select-none font-serif">
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 rounded border-stone-300 text-[#8B7CB6] focus:ring-[#8B7CB6] cursor-pointer"
                      />
                      <span>
                        I confirm my academic enrollment.
                        <span className="inline-flex items-center gap-1 ml-1 font-semibold text-[#7C6BA6]">
                          <ShieldCheck className="w-3 h-3 text-[#8B7CB6]" />
                          Encrypted & Academic Data Compliant
                        </span>
                      </span>
                    </label>
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 animate-in fade-in font-serif">
                      • {errorMessage}
                    </p>
                  )}

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-3 px-5 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] active:scale-[0.98] text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer font-serif"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying Academic Identity...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Continue to Pass</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOrganizerSubmit} className="space-y-4 font-serif">
                  {/* Security Notice Pill */}
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-stone-700 flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-[#8B7CB6] text-white flex items-center justify-center shrink-0">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-stone-900 font-serif">2FA & Role-Restricted Admin Zone</span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#7C6BA6] uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-purple-200 font-serif">
                      Protected
                    </span>
                  </div>

                  {/* Field 1: Authorized Chapter / Org Email */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                      Authorized Chapter / Org Email <span className="text-[#8B7CB6]">*</span>
                    </label>
                    <div className="relative flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-[#8B7CB6] transition-all shadow-xs">
                      <Shield className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
                      <input
                        type="text"
                        required
                        value={orgId}
                        onChange={(e) => setOrgId(e.target.value)}
                        placeholder="e.g. organizer.ieee@kkwagh.edu.in"
                        className="w-full px-3 py-2.5 text-xs font-medium text-stone-900 bg-transparent focus:outline-none placeholder-stone-400 font-serif"
                      />
                    </div>
                  </div>

                  {/* Field 2: Security Passkey / Token with Eye Toggle */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">
                      Security Passkey / Token <span className="text-[#8B7CB6]">*</span>
                    </label>
                    <div className="relative flex items-center rounded-xl border border-stone-300 bg-white focus-within:border-[#8B7CB6] transition-all shadow-xs">
                      <Lock className="w-4 h-4 text-stone-400 ml-3.5 shrink-0" />
                      <input
                        type={showOrgPassword ? 'text' : 'password'}
                        required
                        value={orgPassword}
                        onChange={(e) => setOrgPassword(e.target.value)}
                        placeholder="Enter committee security passkey"
                        className="w-full px-3 py-2.5 text-xs font-medium text-stone-900 bg-transparent focus:outline-none placeholder-stone-400 font-serif"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOrgPassword(!showOrgPassword)}
                        className="p-2 text-stone-400 hover:text-stone-700 mr-1.5 cursor-pointer"
                        title={showOrgPassword ? 'Hide passkey' : 'Show passkey'}
                      >
                        {showOrgPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[10px] text-stone-500 block mt-0.5 ml-1 font-serif">
                      Enables real-time rosters, CSV export & multi-channel broadcast
                    </span>
                  </div>

                  {errorMessage && (
                    <p className="text-xs font-semibold text-rose-600 mt-1 animate-in fade-in font-serif">
                      • {errorMessage}
                    </p>
                  )}

                  {/* Primary Action Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-3 py-3 px-5 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] active:scale-[0.98] text-white font-semibold text-xs tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 cursor-pointer font-serif"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Authenticating Organizer Session...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 text-white" />
                        <span>Authenticate Organizer Session</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200 font-serif">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mb-4 shadow-sm">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 font-serif">
                {activeTab === 'student' ? 'Academic Identity Verified!' : 'Organizer Session Granted!'}
              </h3>
              <p className="text-xs text-stone-600 mt-1.5 max-w-xs font-serif">
                {activeTab === 'student'
                  ? `Welcome, ${studentName}! Connecting you to campus hackathons & digital passes.`
                  : 'Welcome to the Organizer Hub. Loading real-time management dashboard...'}
              </p>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-serif">
            <span>YouthConnect Nashik Academic Hub</span>
            <span>v2.4 Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};
