import React, { useState } from 'react';
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
    <div className="min-h-screen bg-[#07080c] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-body selection:bg-[#0066ff] selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0066ff]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#38bdf8]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation to Student Explore */}
      <div className="w-full max-w-md flex items-center justify-between mb-6 z-10">
        <button
          onClick={onNavigateToStudent || (() => { window.location.pathname = '/explore'; })}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Explore</span>
        </button>

        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#38bdf8] text-[11px] font-bold">
          Organizer Workspace
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#12141d] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#004bb1] via-[#0066ff] to-[#38bdf8] text-white flex items-center justify-center font-black text-lg mx-auto shadow-lg shadow-blue-500/25 mb-3">
            YC
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-headline">
            Organizer Portal Login
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Access collegiate event creation, attendee check-in scanners, and live broadcasts.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="grid grid-cols-2 p-1 bg-white/5 rounded-2xl border border-white/10 text-xs font-bold mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('credentials'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'credentials'
                ? 'bg-[#0066ff] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Organizer Email</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('accessKey'); setErrorMessage(null); }}
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'accessKey'
                ? 'bg-[#0066ff] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Security Key</span>
          </button>
        </div>

        {/* Actionable Error State if Role/Credentials Invalid */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-left animate-in fade-in duration-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-red-300">Access Denied</h4>
                <p className="text-[11px] text-red-200 mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
                {errorMessage.includes('Account does not have organizer permissions') && (
                  <button
                    type="button"
                    onClick={onNavigateToStudent || (() => { window.location.pathname = '/explore'; })}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-white bg-red-800/80 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
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
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {activeTab === 'credentials' ? (
            <>
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Organizer / Chapter Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="organizer@collegename.org"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Organizer Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/15 focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 text-white rounded-xl pl-10 pr-10 py-2.5 text-xs outline-none transition-all placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-[11px] font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                Official Chapter Access Key
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="YC-ORG-2026-KEY"
                  className="w-full bg-white/5 border border-white/15 focus:border-[#0066ff] focus:ring-2 focus:ring-[#0066ff]/20 text-white rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none transition-all font-mono placeholder:text-gray-500"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">
                Issued by College Student Council or YouthConnect District Lead.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#0066ff] hover:bg-[#0055d6] active:scale-[0.98] text-white font-bold text-xs py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
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
        <div className="mt-6 pt-5 border-t border-white/10 text-left">
          <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block mb-2">
            Quick Test Accounts:
          </span>
          <div className="flex flex-col gap-1.5 text-xs">
            <button
              type="button"
              onClick={handleTestValidOrganizer}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 font-medium text-[11px] flex items-center justify-between transition-colors"
            >
              <span>Valid Organizer (TechSprint Lead)</span>
              <span className="text-[10px] text-gray-400">Click to fill</span>
            </button>
            <button
              type="button"
              onClick={handleTestStudentRejection}
              className="text-left px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-rose-400 font-medium text-[11px] flex items-center justify-between transition-colors"
            >
              <span>Student Account (Tests Rejection Guard)</span>
              <span className="text-[10px] text-gray-400">Click to test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
