import React, { useState } from 'react';
import { YouthConnectLogo } from './YouthConnectLogo';
import { 
  GraduationCap, 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  X,
  Compass
} from 'lucide-react';
import { Role, UserProfile, PREMIER_COLLEGES } from '../types';

interface LoginPortalViewProps {
  initialRole?: Role;
  onLoginSuccess: (profile: UserProfile) => void;
  onCancel: () => void;
}

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
  const [fullName, setFullName] = useState('Siddhi Lawte');
  const [studentEmail, setStudentEmail] = useState('siddhi.lawte@met.edu.in');
  const [college, setCollege] = useState<string>(PREMIER_COLLEGES[0]);
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
        const isStudentFormat = email.includes('student') || 
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
          name: fullName || 'Siddhi Lawte',
          email: studentEmail.trim().toLowerCase(),
          role: 'student',
          college: college,
          department: department,
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

  const handleDemoStudent = (name: string, email: string, col: string, dept: string) => {
    setFullName(name);
    setStudentEmail(email);
    setCollege(col);
    setDepartment(dept);
    setSelectedRole('student');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-[#FAF9F6] font-serif">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-sm border border-purple-100/90 overflow-hidden flex flex-col font-serif">
        {/* Top Header with Logo */}
        <div className="p-6 sm:p-8 text-center bg-purple-50/40 border-b border-purple-100/80 relative font-serif">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-purple-100/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-13 h-13 rounded-2xl bg-white border border-stone-200 text-stone-900 p-2 flex items-center justify-center mx-auto shadow-2xs mb-3">
            <YouthConnectLogo className="w-full h-full text-stone-900" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif tracking-tight">
            {authMode === 'signin' ? 'Welcome to YouthConnect' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-stone-600 mt-1 font-serif">
            {selectedRole === 'organizer' 
              ? 'Access organizer tools, check-in scanner, and event management' 
              : 'Access digital event passes, tickets, and campus clubs'}
          </p>

          {/* Role selector tabs */}
          <div className="mt-5 grid grid-cols-2 p-1 bg-purple-50/60 rounded-2xl border border-purple-100 text-xs font-semibold font-serif">
            <button
              type="button"
              onClick={() => { setSelectedRole('student'); setErrorMessage(null); }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-serif ${
                selectedRole === 'student'
                  ? 'bg-white text-[#7C6BA6] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => { setSelectedRole('organizer'); setErrorMessage(null); }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer font-serif ${
                selectedRole === 'organizer'
                  ? 'bg-white text-[#7C6BA6] shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Organizer Passkey</span>
            </button>
          </div>
        </div>

        {/* Actionable Error Box */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-left font-serif">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-800">Access Denied</h4>
                <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">{errorMessage}</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('student');
                    setErrorMessage(null);
                  }}
                  className="mt-2 text-[11px] font-semibold text-[#7C6BA6] hover:underline inline-flex items-center gap-1 cursor-pointer font-serif"
                >
                  <Compass className="w-3 h-3" />
                  <span>Switch to Student Login</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 font-serif">
          {/* Quick 1-Click Demo Profiles */}
          <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 text-xs font-serif">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#7C6BA6] mb-1.5 font-serif">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Fast Demo Login:
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 font-serif">
              <button
                type="button"
                onClick={() => handleDemoStudent('Siddhi Lawte', '21BCE045', PREMIER_COLLEGES[0], 'Computer Science')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-100 text-stone-800 text-[11px] font-medium border border-purple-200/80 shadow-2xs cursor-pointer font-serif"
              >
                Student (Siddhi)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('organizer');
                  setClubName('TechSprint Organizing Committee');
                  setOrgEmail('organizers@techsprint2026.org');
                  setErrorMessage(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#7C6BA6] hover:bg-[#6D5C96] text-white text-[11px] font-medium shadow-2xs cursor-pointer font-serif"
              >
                Organizer (TechSprint)
              </button>
            </div>
          </div>

          {authMode === 'signup' && selectedRole === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Siddhi Lawte"
                className="w-full bg-white border border-purple-200/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C6BA6] transition-all font-serif"
              />
            </div>
          )}

          {selectedRole === 'student' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">College Email ID</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student@college.edu.in / name@college.ac.in"
                    className="w-full bg-white border border-purple-200/80 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C6BA6] transition-all font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">College Campus</label>
                <select
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-white border border-purple-200/80 rounded-xl px-3 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C6BA6] transition-all cursor-pointer font-serif"
                >
                  {PREMIER_COLLEGES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">Club / Chapter Name</label>
                <input
                  type="text"
                  required
                  value={clubName}
                  onChange={(e) => setClubName(e.target.value)}
                  placeholder="e.g. TechSprint Organizing Committee"
                  className="w-full bg-white border border-purple-200/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C6BA6] transition-all font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1 font-serif">Organizer Passkey Email</label>
                <input
                  type="email"
                  required
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  placeholder="organizers@techsprint2026.org"
                  className="w-full bg-white border border-purple-200/80 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C6BA6] transition-all font-serif"
                />
              </div>
            </>
          )}

          <div>
            <div className="flex justify-between items-center mb-1 font-serif">
              <label className="text-xs font-semibold text-stone-700 font-serif">Password / Passkey</label>
              <button
                type="button"
                className="text-[11px] text-[#7C6BA6] font-medium hover:underline cursor-pointer font-serif"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-purple-200/80 rounded-xl pl-10 pr-10 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#7C6BA6] transition-all font-serif"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-2xl bg-[#7C6BA6] hover:bg-[#6D5C96] active:bg-[#5F4E88] text-white text-xs font-semibold tracking-wide shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer font-serif"
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
        <div className="bg-purple-50/30 border-t border-purple-100/80 p-4 text-center text-xs text-stone-600 font-serif">
          {authMode === 'signin' ? (
            <span>
              Don't have an account yet?{' '}
              <button
                onClick={() => setAuthMode('signup')}
                className="text-[#7C6BA6] font-semibold hover:underline cursor-pointer font-serif"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setAuthMode('signin')}
                className="text-[#7C6BA6] font-semibold hover:underline cursor-pointer font-serif"
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
