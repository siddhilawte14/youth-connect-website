export type Role = 'student' | 'organizer' | 'tenant_admin' | 'admin';

export type MainTab = 
  | 'discovery'        // Public Discovery & Home
  | 'student_dashboard'// Student Dashboard / Hub
  | 'my_events'        // My Events & Tickets
  | 'registration'     // Registration & Digital Ticket Flow
  | 'organizer_dashboard' // Organizer Dashboard & Analytics
  | 'communities'      // Community Directory (Clubs & NGOs)
  | 'admin_portal'     // Admin Moderation & Audit Logs
  | 'gate_scanner'    // QR Code Gate Verification Flow
  | 'login';           // Dedicated Multi-Role Login Pages

export type EventCategory = 
  | 'Hackathon'
  | 'Technology'
  | 'Workshop'
  | 'Cultural'
  | 'Competitions'
  | 'Fests'
  | 'Sports'
  | 'Entrepreneurship'
  | 'Volunteering'
  | 'NGO Drives'
  | 'Career'
  | 'Academic'
  | 'Meetup'
  | 'Other';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: Role;
  college?: string;
  department?: string;
  prn?: string;
  studentId?: string;
  branch?: string;
  year?: string;
  avatarUrl?: string;
  clubName?: string;
  adminBadgeId?: string;
  gateLocation?: string;
  isLoggedIn?: boolean;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory | string;
  tags: string[];
  date: {
    month: string;
    day: string;
    fullDate: string;
    time: string;
  };
  venue: string;
  area: string; // e.g. "Panchavati", "Gangapur Road", "City Center", "Sandip Foundation", "College Road", "Online"
  fee: number; // 0 for free
  feeLabel: string; // "Free Entry", "Pass: ₹150", "₹499"
  isHot?: boolean;
  status: 'Published' | 'Draft' | 'Completed' | 'Cancelled' | 'Pending Approval' | 'Filling Fast';
  bannerUrl: string;
  organizer: {
    name: string;
    avatarUrl?: string;
    isVerified: boolean;
    type?: 'College Club' | 'Student Committee' | 'Department' | 'NGO' | 'Social Org';
    contactEmail?: string;
  };
  description: string;
  capacity: number;
  registeredCount: number;
  views: number;
  conversionRate: string;
  isRegistered?: boolean;
  isSaved?: boolean;
  ticketId?: string;
  departmentEligible?: string;
  eligibility?: string;
  registrationDeadline?: string;
  whatYouGet?: string[];
  rules?: string[];
  schedule?: { time: string; activity: string }[];
  faqs?: { question: string; answer: string }[];
}

export interface DigitalPass {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  venue: string;
  date: string;
  time: string;
  tier: string; // "VIP ACCESS", "GENERAL PASS", "EARLY BIRD"
  attendeeName: string;
  collegeId: string;
  department: string;
  teamName?: string;
  qrCodeUrl: string;
  status: 'Valid' | 'Redeemed' | 'Cancelled';
  amountPaid: number;
  issuedAt: string;
  redeemedAt?: string;
}

export interface CommunityClub {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  description: string;
  logoUrl: string;
  whatsappLink: string;
  isVerified: boolean;
  college: string;
  recentActivity: string;
  recentActivityTime: string;
}

export interface CommunityUpdate {
  id: string;
  clubName: string;
  clubIcon: string;
  clubColor: string;
  text: string;
  timeAgo: string;
}

export interface OrganizerStats {
  totalViews: string;
  totalViewsGrowth: string;
  totalRegistrations: number;
  registrationsGrowth: string;
  engagementRate: string;
  engagementGrowth: string;
  revenueGenerated: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  status: 'Success' | 'Warning' | 'Info';
}
