import React, { useState } from 'react';
import { YouthConnectLogo } from '../../components/YouthConnectLogo';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Compass,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface OrganizerLoginPageProps {
  onSuccessRedirect?: (path: string) => void;
  onNavigateToStudent?: () => void;
}

export const OrganizerLoginPage: React.FC<OrganizerLoginPageProps> = ({
  onSuccessRedirect,
  onNavigateToStudent
}) => {
  const { loginAsOrganizer } = useAuth();

  const [email, setEmail] = useState('organizers@techsprint2026.org');
  const [password, setPassword] = useState('OrganizerPass#2026');
  const [accessKey, setAccessKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'credentials' | 'accessKey'>('credentials');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const result = await loginAsOrganizer({
        email,
        password,
        accessKey: activeTab === 'accessKey' ? accessKey : undefined
      });

      if (result.success) {
        if (onSuccessRedirect) {
          onSuccessRedirect('/organizer/dashboard');
        } else {
          window.location.pathname = '/organizer/dashboard';
        }
      } else {
        setErrorMessage(result.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during organizer authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestStudentRejection = () => {
    setEmail('21bce045@kkwieer.edu.in');
    setAccessKey('');
    setActiveTab('credentials');
  };

  const handleTestValidOrganizer = () => {
    setEmail('lead@techsprint2026.org');
    setPassword('OrganizerPass#2026');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-serif">
      {/* Background Subtle Violet Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation to Student Explore */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10 font-serif">
        <button
          onClick={onNavigateToStudent || (() => { window.location.pathname = '/explore'; })}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Explore</span>
        </button>

        <span className="px-2.5 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[11px] font-semibold">
          Organizer Workspace
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#13131A] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 z-10 font-serif">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-white/5 text-violet-400 border border-white/15 p-2 flex items-center justify-center mx-auto shadow-inner mb-3">
            <YouthConnectLogo className="w-full h-full text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-serif">
            Organizer Portal Login
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-serif">
            Access collegiate event creation, attendee check-in scanners, and live broadcasts.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-semibold mb-6 font-serif">
          <button
            type="button"
            onClick={() => { setActiveTab('credentials'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'credentials'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Organizer Email</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('accessKey'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'accessKey'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security Key</span>
          </button>
        </div>

        {/* Actionable Error State if Role/Credentials Invalid */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-left animate-in fade-in duration-200 font-serif">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-300">Access Denied</h4>
                <p className="text-[11px] text-rose-300 mt-0.5 leading-relaxed font-serif">
                  {errorMessage}
                </p>
                {errorMessage.includes('Account does not have organizer permissions') && (
                  <button
                    type="button"
                    onClick={onNavigateToStudent || (() => { window.location.pathname = '/explore'; })}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Go to Student Hub</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left font-serif">
          {activeTab === 'credentials' ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-serif">
                  Organizer / Chapter Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@collegename.org"
                    className="w-full bg-[#0B0B0F] border border-white/10 focus:border-violet-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-slate-600 font-serif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-serif">
                  Organizer Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#0B0B0F] border border-white/10 focus:border-violet-500 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none transition-all placeholder:text-slate-600 font-serif"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-serif">
                Official Chapter Access Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="YC-ORG-2026-KEY"
                  className="w-full bg-[#0B0B0F] border border-white/10 focus:border-violet-500 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all font-mono placeholder:text-slate-600 font-serif"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 font-serif">
                Issued by College Student Council or YouthConnect District Lead.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-semibold text-xs py-3 rounded-xl transition-all shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer font-serif"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Organizer Hub</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Pre-fill helpers */}
        <div className="mt-6 pt-5 border-t border-white/10 text-left font-serif">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-2">
            Quick Test Accounts:
          </span>
          <div className="flex flex-col gap-1.5 text-xs">
            <button
              type="button"
              onClick={handleTestValidOrganizer}
              className="text-left px-2.5 py-1.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/20 font-medium text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Valid Organizer (TechSprint Lead)</span>
              <span className="text-[10px] text-slate-400">Click to fill</span>
            </button>
            <button
              type="button"
              onClick={handleTestStudentRejection}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-medium text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>Student Account (Tests Rejection Guard)</span>
              <span className="text-[10px] text-slate-400">Click to test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
