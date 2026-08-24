export type Role = 'guest' | 'student' | 'organizer' | 'tenant_admin' | 'admin';

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
  | 'NGO / Social Impact'
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
  myPasses?: string[];
}

export type CampusNavTab = 
  | 'Explore'
  | 'Hackathons'
  | 'College Fests'
  | 'NGO Drives'
  | 'Workshops'
  | 'Clubs'
  | 'Campus Clubs'
  | 'My Passes';

export type DistrictNavTab = CampusNavTab;

export const PREMIER_COLLEGES = [
  'MET Bhujbal Knowledge City, Adgaon, Nashik',
  'KKWIEER (K. K. Wagh Institute of Engineering Education and Research), Nashik',
  "NDMVP's KBT College of Engineering, Nashik",
  'COEP Technological University, Pune'
] as const;

export type PremierCollege = typeof PREMIER_COLLEGES[number];

export interface EventAttendee {
  id: string;
  name: string;
  email: string;
  timestamp: string;
  college?: string;
  department?: string;
  ticketId?: string;
  role?: string;
}

export interface EventItem {
  id: string;
  title: string;
  category: EventCategory | string;
  districtTab?: DistrictNavTab | string;
  tags: string[];
  date: {
    month: string;
    day: string;
    fullDate: string;
    time: string;
  };
  venue: string;
  area: string; // e.g. "Cyber Hub, Gurugram", "College Road, Nashik", "Panchavati", "Bandra"
  city?: string; // "Gurugram", "Nashik", "Mumbai", "Pune", "Delhi NCR"
  fee: number; // 0 for free
  feeLabel: string; // "Free Entry", "Pass: ₹150", "₹499"
  isHot?: boolean;
  status: 'Published' | 'Draft' | 'Completed' | 'Cancelled' | 'Pending Approval' | 'Filling Fast';
  bannerUrl: string;
  posterUrl?: string; // 3:4 poster artwork
  rating?: string; // e.g. "9.4/10", "4.8★"
  votesCount?: string; // e.g. "14.2k votes"
  genres?: string[]; // ["Action", "Comedy", "Tech", "Music", "Food", "Drama"]
  languages?: string[]; // ["English", "Hindi", "Marathi"]
  formats?: string[]; // ["2D", "3D", "IMAX", "Live", "Workshop", "4DX"]
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
  attendees?: EventAttendee[];
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
  category?: string;
  venue: string;
  labAllotment?: string;
  collegeName?: string;
  date: string;
  time: string;
  reportingTime?: string;
  tier: string; // "VIP ACCESS", "GENERAL PASS", "EARLY BIRD", "VIP HACKER PASS"
  attendeeName: string;
  collegeId: string; // Student PRN / ID
  studentPrn?: string;
  studentEmail?: string;
  department: string;
  teamName?: string;
  qrCodeUrl?: string;
  status: 'Valid' | 'Redeemed' | 'Cancelled';
  amountPaid: number;
  issuedAt: string;
  redeemedAt?: string;
  hash?: string;
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
