import React, { useState } from 'react';
import { 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  X,
  Compass
} from 'lucide-react';
import { Role, UserProfile } from '../types';

interface LoginPortalViewProps {
  initialRole?: Role;
  onLoginSuccess: (profile: UserProfile) => void;
  onCancel: () => void;
}

const NASHIK_COLLEGES = [
  'K. K. Wagh Institute of Engineering (KKWIEER)',
  'NDMVP’s KBT College of Engineering',
  'MET’s Institute of Engineering (MET BKC)',
  'Sandip University / SITRC Nashik',
  'Guru Gobind Singh College of Engineering',
  'Government Polytechnic Nashik',
  'Cummins College of Engineering for Women'
];

export const LoginPortalView: React.FC<LoginPortalViewProps> = ({
  initialRole = 'student',
  onLoginSuccess,
  onCancel
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Student Fields
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [emailOrPrn, setEmailOrPrn] = useState('21BCE045');
  const [college, setCollege] = useState(NASHIK_COLLEGES[0]);
  const [department, setDepartment] = useState('Computer Engineering');
  const [password, setPassword] = useState('password123');

  // Organizer Fields
  const [clubName, setClubName] = useState('TechSprint Organizing Committee');
  const [orgEmail, setOrgEmail] = useState('organizers@techsprint2026.org');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      if (selectedRole === 'organizer') {
        const email = orgEmail.trim().toLowerCase();
        // Check if student format was entered into organizer login
        const isStudentFormat = /^\d{2}[a-z]{3}\d{3}$/i.test(email) || 
          email.includes('student') || 
          (email.endsWith('.edu.in') && !email.includes('lead') && !email.includes('org') && !email.includes('council') && !email.includes('club'));

        if (isStudentFormat && !email.includes('organizer')) {
          setErrorMessage('Account does not have organizer permissions. Please sign in through the Student Portal or use an authorized Organizer email.');
          return;
        }

        onLoginSuccess({
          id: `org_${Date.now()}`,
          name: clubName || 'TechSprint Lead',
          email: orgEmail || 'lead@techsprint2026.org',
          role: 'organizer',
          college: college,
          department: 'Organizer Chapter',
          clubName: clubName,
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        });
      } else if (selectedRole === 'student') {
        onLoginSuccess({
          id: `usr_${Date.now()}`,
          name: fullName || 'Rahul Sharma',
          email: emailOrPrn.includes('@') ? emailOrPrn : `${emailOrPrn.toLowerCase()}@kkwieer.edu.in`,
          role: 'student',
          college: college,
          department: department,
          prn: emailOrPrn.toUpperCase() || '21BCE045',
          avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOqDjXuGHls-fFzwgw8U2QnO0Hrf_XlK1-_hWeTZzI1aBJ9SSKnkdXqQ3OzFJKo2PUFaS6K58-AZHpVFCeRENDahFHH359O6KMTKEIHD40RLEsjDWeBrIGrdCsF9u0j-Nr48RZY_wgyXqdXhRdhttQKwEnN_fjSJU0-e_wnw5K4G2HdNG92sSEzsZVt7bJuw1PSrfIW0u1GVSp-5IQOS_EAfbRjW-Qxe0zK2TUzHKnpeqqkpG29bD',
        });
      } else {
        onLoginSuccess({
          id: `admin_${Date.now()}`,
          name: 'Nashik Campus Admin',
          email: 'admin@youthconnect.in',
          role: 'admin',
          college: 'District Council',
          department: 'Platform Operations',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        });
      }
    }, 350);
  };

  const handleDemoStudent = (name: string, prn: string, col: string, dept: string) => {
    setFullName(name);
    setEmailOrPrn(prn);
    setCollege(col);
    setDepartment(dept);
    setSelectedRole('student');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#07080c] sm:bg-[#fafbfd]">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-[#c2c6d6]/60 overflow-hidden flex flex-col">
        {/* Top Header with Logo */}
        <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-[#f8f9ff] to-white border-b border-[#e2e7f3] relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-[#0058be] text-white flex items-center justify-center font-black text-lg mx-auto shadow-md mb-3">
            YC
          </div>

          <h2 className="text-2xl font-black text-[#0b1c30] font-headline tracking-tight">
            {authMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
          {/* Role Title & Subtitle */}
          <p className="text-xs text-[#727785] mt-1">
            {selectedRole === 'organizer' 
              ? 'Access organizer tools, check-in scanner, and event management' 
              : 'Access digital event passes, tickets, and campus clubs'}
          </p>

          {/* Show role selector tabs ONLY if initialRole is not explicitly student/organizer */}
          {!initialRole && (
            <div className="mt-5 grid grid-cols-2 p-1 bg-[#f4f6fb] rounded-2xl border border-[#e2e7f3] text-xs font-bold">
              <button
                type="button"
                onClick={() => { setSelectedRole('student'); setErrorMessage(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'student'
                    ? 'bg-white text-[#0058be] shadow-xs'
                    : 'text-[#727785] hover:text-[#0b1c30]'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => { setSelectedRole('organizer'); setErrorMessage(null); }}
                className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === 'organizer'
                    ? 'bg-white text-[#0058be] shadow-xs'
                    : 'text-[#727785] hover:text-[#0b1c30]'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Organizer / Club</span>
              </button>
            </div>
          )}
        </div>

        {/* Actionable Error Box */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-left">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-800">Access Denied</h4>
                <p className="text-[11px] text-red-700 mt-0.5 leading-relaxed">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('student');
                    setErrorMessage(null);
                  }}
                  className="mt-2 text-[11px] font-bold text-[#0058be] hover:underline inline-flex items-center gap-1"
                >
                  <Compass className="w-3 h-3" />
                  <span>Switch to Student Login</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4">
          {/* Quick 1-Click Demo Profiles */}
          <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200/80 text-xs">
            <div className="flex items-center justify-between text-[11px] font-bold text-[#0058be] mb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Fast Demo Login:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedRole === 'student' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleDemoStudent('Rahul Sharma', '21BCE045', NASHIK_COLLEGES[0], 'Computer Science')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-100 text-[#0b1c30] text-[11px] font-bold border border-blue-200"
                  >
                    Rahul (KKWIEER)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoStudent('Siddhi Lawte', '22BCE104', 'MET’s Institute of Engineering (MET BKC)', 'Computer Engineering')}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-[#0b1c30] text-[11px] font-bold border border-purple-200"
                  >
                    Siddhi (MET BKC)
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('organizer');
                    setClubName('TechSprint Organizing Committee');
                    setOrgEmail('organizers@techsprint2026.org');
                    setErrorMessage(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-[11px] font-bold border border-emerald-300"
                >
                  TechSprint Lead (Org)
                </button>
              )}
            </div>
          </div>

          {authMode === 'signup' && selectedRole === 'student' && (
            <div>
              <label className="block text-xs font-bold text-[#0b1c30] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
              />
            </div>
          )}

          {selectedRole === 'student' ? (
            <>
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">College PRN / Student Email</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#727785] absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={emailOrPrn}
                    onChange={(e) => setEmailOrPrn(e.target.value)}
                    placeholder="21BCE045 or student@college.edu.in"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">College Campus</label>
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2.5 text-xs text-[#0b1c30]"
                >
                  {NASHIK_COLLEGES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">Club / Chapter Name</label>
                <input
                  type="text"
                  required
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="e.g. TechSprint Organizing Committee"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0b1c30] mb-1">Organizer Email</label>
                <input
                  type="email"
                  required
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="organizers@techsprint2026.org"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3.5 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                />
              </div>
            </>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#0b1c30]">Password</label>
              <button
                type="button"
                className="text-[11px] text-[#0058be] font-bold hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#727785] absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-[#727785] hover:text-[#0b1c30]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-[#0058be] hover:bg-[#004bb0] text-white text-xs font-black tracking-wide shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{selectedRole === 'organizer' ? 'Enter Organizer Hub' : 'Continue to YouthConnect'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switch */}
        <div className="bg-[#f8f9ff] border-t border-[#e2e7f3] p-4 text-center text-xs text-[#727785]">
          {authMode === 'signin' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-[#0058be] font-bold hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-[#0058be] font-bold hover:underline"
              >
                Sign in
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
