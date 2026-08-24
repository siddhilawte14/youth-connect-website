import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Role } from '../types';

export interface AuthContextType {
  user: UserProfile | null;
  role: Role;
  isAuthenticated: boolean;
  loginAsOrganizer: (credentials: { email: string; password?: string; accessKey?: string }) => Promise<{ success: boolean; error?: string }>;
  loginAsStudent: (credentials: { emailOrPrn: string; name?: string; college?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  setUserProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nashik_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse auth user profile', e);
      }
    }
    return null;
  });

  const [role, setRole] = useState<Role>(() => {
    const savedRole = localStorage.getItem('nashik_user_role') as Role;
    if (savedRole === 'organizer' || savedRole === 'admin' || savedRole === 'student') {
      return savedRole;
    }
    return 'student';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('nashik_user_profile', JSON.stringify(user));
      localStorage.setItem('nashik_user_role', user.role);
      setRole(user.role);
    } else {
      localStorage.removeItem('nashik_user_profile');
      localStorage.setItem('nashik_user_role', 'student');
      setRole('student');
    }
  }, [user]);

  const loginAsOrganizer = async (credentials: { email: string; password?: string; accessKey?: string }): Promise<{ success: boolean; error?: string }> => {
    const email = credentials.email.trim().toLowerCase();

    // Check if a student PRN/email attempts organizer login
    const isStudentFormat = /^\d{2}[a-z]{3}\d{3}$/i.test(email) || 
      email.includes('student') || 
      (email.endsWith('.edu.in') && !email.includes('lead') && !email.includes('org') && !email.includes('council') && !email.includes('club'));

    if (isStudentFormat && !credentials.accessKey && !email.includes('organizer')) {
      return {
        success: false,
        error: 'Account does not have organizer permissions. Please sign in through the Student Portal or use an authorized Organizer access key.'
      };
    }

    // Verified Organizer profile creation
    const organizerProfile: UserProfile = {
      id: `org_${Date.now()}`,
      name: email.includes('tech') ? 'TechSprint Lead Organizer' : 'Nashik Collegiate Lead',
      email: email,
      role: 'organizer',
      college: 'KKWIEER (K. K. Wagh Institute of Engineering Education and Research), Nashik',
      department: 'Student Affairs & Technical Council',
      clubName: 'TechSprint & Collegiate Hackathons Council',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    };

    setUser(organizerProfile);
    setRole('organizer');
    localStorage.setItem('nashik_user_profile', JSON.stringify(organizerProfile));
    localStorage.setItem('nashik_user_role', 'organizer');

    return { success: true };
  };

  const loginAsStudent = async (credentials: { emailOrPrn: string; name?: string; college?: string }): Promise<{ success: boolean; error?: string }> => {
    const prn = credentials.emailOrPrn.trim().toUpperCase();
    const studentProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      name: credentials.name || 'Rahul Sharma',
      email: credentials.emailOrPrn.includes('@') ? credentials.emailOrPrn : `${prn.toLowerCase()}@met.edu.in`,
      role: 'student',
      college: credentials.college || 'MET Bhujbal Knowledge City, Adgaon, Nashik',
      studentId: prn || '21BCE045',
      branch: 'Computer Science',
      year: '3rd Year',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOqDjXuGHls-fFzwgw8U2QnO0Hrf_XlK1-_hWeTZzI1aBJ9SSKnkdXqQ3OzFJKo2PUFaS6K58-AZHpVFCeRENDahFHH359O6KMTKEIHD40RLEsjDWeBrIGrdCsF9u0j-Nr48RZY_wgyXqdXhRdhttQKwEnN_fjSJU0-e_wnw5K4G2HdNG92sSEzsZVt7bJuw1PSrfIW0u1GVSp-5IQOS_EAfbRjW-Qxe0zK2TUzHKnpeqqkpG29bD'
    };

    setUser(studentProfile);
    setRole('student');
    localStorage.setItem('nashik_user_profile', JSON.stringify(studentProfile));
    localStorage.setItem('nashik_user_role', 'student');

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setRole('student');
    localStorage.removeItem('nashik_user_profile');
    localStorage.setItem('nashik_user_role', 'student');
  };

  const setUserProfile = (profile: UserProfile | null) => {
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthenticated: !!user,
      loginAsOrganizer,
      loginAsStudent,
      logout,
      setUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
