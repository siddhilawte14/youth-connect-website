/**
 * In-memory data store with seed data matching the frontend mockData.ts.
 * Abstracted behind repository interfaces for future DB migration.
 */
import { hashPassword } from '../utils/password.js';
import { signPass, sha256Hash } from '../utils/qrCrypto.js';

// ─── Store Collections ───
const store = {
  users: [],
  events: [],
  passes: {},       // keyed by ticketId
  clubs: [],
  communityUpdates: [],
  auditLogs: [],
  broadcasts: [],
};

export function getStore() { return store; }

// ─── Seed Function ───
export async function seedDatabase() {
  // 1. Seed users
  const studentHash = await hashPassword('password123');
  const organizerHash = await hashPassword('password123');
  const adminHash = await hashPassword('admin123');

  store.users = [
    {
      id: 'usr_seed_student_1',
      name: 'Rahul Sharma',
      email: '21bce045@kkwieer.edu.in',
      passwordHash: studentHash,
      role: 'student',
      college: 'K. K. Wagh Institute of Engineering (KKWIEER)',
      department: 'Computer Science',
      prn: '21BCE045',
      branch: 'Computer Science',
      year: '3rd Year',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyOqDjXuGHls-fFzwgw8U2QnO0Hrf_XlK1-_hWeTZzI1aBJ9SSKnkdXqQ3OzFJKo2PUFaS6K58-AZHpVFCeRENDahFHH359O6KMTKEIHD40RLEsjDWeBrIGrdCsF9u0j-Nr48RZY_wgyXqdXhRdhttQKwEnN_fjSJU0-e_wnw5K4G2HdNG92sSEzsZVt7bJuw1PSrfIW0u1GVSp-5IQOS_EAfbRjW-Qxe0zK2TUzHKnpeqqkpG29bD',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'org_seed_organizer_1',
      name: 'TechSprint Lead Organizer',
      email: 'organizers@techsprint2026.org',
      passwordHash: organizerHash,
      role: 'organizer',
      college: 'K. K. Wagh Institute of Engineering (KKWIEER)',
      department: 'Student Affairs & Technical Council',
      clubName: 'TechSprint & Collegiate Hackathons Council',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'admin_seed_1',
      name: 'Nashik Campus Admin',
      email: 'admin@youthconnect.in',
      passwordHash: adminHash,
      role: 'admin',
      college: 'District Council',
      department: 'Platform Operations',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      createdAt: new Date().toISOString(),
    },
  ];

  // 2. Seed events (exact match of frontend mockData)
  store.events = [
    {
      id: 'evt-codefest-2024', title: 'Nashik CodeFest 2024', category: 'Technology',
      tags: ['Tech', 'Coding', 'Web3'],
      date: { month: 'OCT', day: '12', fullDate: 'Oct 12, 2024', time: '9:00 AM - 6:00 PM' },
      venue: 'KKWIEER Campus, Panchavati', area: 'Panchavati', fee: 0, feeLabel: 'Free Entry',
      isHot: false, status: 'Published',
      bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      organizer: { name: 'KKWIEER Tech Club', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: "Nashik's flagship student hackathon uniting over 400 developers to build real-world software solutions for civic, fintech, and AI challenges.",
      capacity: 400, registeredCount: 388, views: 14200, conversionRate: '8.4%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-symphony-fest', title: 'Symphony Inter-College Fest', category: 'Cultural',
      tags: ['Hot Event', 'Cultural', 'Music', 'Dance'],
      date: { month: 'OCT', day: '15', fullDate: 'Oct 15, 2024', time: '10:00 AM Onwards' },
      venue: 'NDMVPS Campus, Gangapur Road', area: 'Gangapur Road', fee: 150, feeLabel: 'Pass: ₹150',
      isHot: true, status: 'Published',
      bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
      organizer: { name: 'NDMVPS Cultural Council', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Annual cultural extravaganza featuring inter-college battle of the bands, drama competitions, dance showdowns, and celebrity guest performances.',
      capacity: 1500, registeredCount: 1200, views: 22800, conversionRate: '14.6%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-photo-walk', title: 'Urban Photography Walk', category: 'Workshop',
      tags: ['Workshop', 'Creative', 'Heritage'],
      date: { month: 'OCT', day: '18', fullDate: 'Oct 18, 2024', time: '4:00 PM - 7:00 PM' },
      venue: 'Start: Goda Ghat, Panchavati', area: 'Panchavati', fee: 0, feeLabel: 'Limited Seats',
      isHot: false, status: 'Published',
      bannerUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
      organizer: { name: 'Nashik Shutterbugs Collective', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Guided photowalk exploring the architectural heritage, vibrant ghats, and golden hour street portraiture along the Godavari river.',
      capacity: 40, registeredCount: 38, views: 4500, conversionRate: '11.2%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-techsprint-2026', title: 'Nashik TechSprint 2026', category: 'Hackathon',
      tags: ['Technology', 'Hackathon', 'Cash Prize'],
      date: { month: 'OCT', day: '24', fullDate: 'Oct 24, 2024', time: '9:00 AM - 6:00 PM' },
      venue: 'KKWIEER Auditorium, Nashik', area: 'Panchavati', fee: 499, feeLabel: 'Pass: ₹499',
      isHot: true, status: 'Published',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBixJBSkN-Xbj-uDmpeaqkiurzK-lVQ9R86beJUyJt_DXVUP1I2xdeHT039KjEwkP28fXjqtMFlv_0DmUA_kYXLOkl4ur8rcSRR52otNCaFh6DZcU14r56thXRybVj2XYREd40Vp6LJtlrNy2MdIYKdjJeeI-evAKn9Sj_RqGt21VrNVrpg20ZyisWJgB94aaZhVUrP5xSrZUUlniFV4WTZ4w-25mpEHPg8bCUI0of8PhQL9phTMlE',
      organizer: { name: 'Nashik Coders Hub & IEEE', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Premier 24-hour sprint bringing together top student developers, AI researchers, and designers. Build innovative prototypes and pitch to Angel investors.',
      capacity: 500, registeredCount: 420, views: 31000, conversionRate: '9.2%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-design-thinking', title: 'Design Thinking Fundamentals', category: 'Workshop',
      tags: ['Workshop', 'UI/UX', 'Product'],
      date: { month: 'NOV', day: '05', fullDate: 'Nov 05, 2024', time: '2:00 PM - 5:00 PM' },
      venue: 'Digital Space, City Center', area: 'City Center', fee: 0, feeLabel: 'Free Entry',
      isHot: false, status: 'Published',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDITBZupZdnJce2g36B6d7CW-XayZ8rtEUV7J6iL3yIJRGYZmFoEOSRAINqzjXR2XLtTlF-0C0v-5PiXJmTSaodWBhYB2IhVvhfD7eFFlMhD135vo2Jrmff0j7rl6eKdi2ZSJzixewHzS0GTPDwbnIkF7DBORhBQgbmosuT_CKfGJvQVFk64D_5CtC5BMm3WluZYUv9Qne4B5Fl-IaMaHX7h7t4AOtwrTn6cPPxhDNQepLXSROf1h1S',
      organizer: { name: 'Nashik Design Guild', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Hands-on product design workshop learning empathetic research, user journey mapping, and rapid low-fidelity prototyping.',
      capacity: 60, registeredCount: 52, views: 6200, conversionRate: '12.8%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-ai-ml-basics', title: 'Applied AI & Machine Learning Basics', category: 'Workshop',
      tags: ['Workshop', 'AI', 'Python'],
      date: { month: 'NOV', day: '12', fullDate: 'Nov 12, 2024', time: '10:00 AM - 3:00 PM' },
      venue: 'Sandip Foundation, Trimbak Road', area: 'Sandip Foundation', fee: 100, feeLabel: 'Pass: ₹100',
      isHot: false, status: 'Published',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBAcXs3ilPnvU77nzyRbNjR1ITfQ89nzJrByJpSkYeWi-W3YHIL_8Emfa0YU5Ldm5OjerBshhD4QXo8-wicpnmM1GAxUXmS2k1EbTMVKlf2Tk-Kev3gyVEi-smdVsSnPFNt9wqklPh7lMLeCFc9T3bFORA6jXIyuF92SXi9_FPl4oGFQw1yXpYoRbwieIAnAYLjEYdFtPZhOSZxbRAJLrvxBI0vF1r7u6Pj12xB83ZDRiECqvkEX0_',
      organizer: { name: 'Sandip AI Research Lab', avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Practical introduction to building computer vision & NLP models with PyTorch, trained on local datasets.',
      capacity: 120, registeredCount: 94, views: 7800, conversionRate: '10.5%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-open-source-meet', title: 'Nashik Open Source Contributors Meet', category: 'Meetup',
      tags: ['Meetup', 'Git', 'OpenSource'],
      date: { month: 'NOV', day: '18', fullDate: 'Nov 18, 2024', time: '3:00 PM - 6:00 PM' },
      venue: 'Innov8 Coworking, College Road', area: 'College Road', fee: 0, feeLabel: 'Free Entry',
      isHot: false, status: 'Published',
      bannerUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOW-V9jwIh772YwQBDeTdkPlYp5xIu0w6VFe3d2vzOFNUsFDaKYK2U7q73EO4Ff_GX1jHp1hscmDdYl7PuiaFPgtL62x1Bcmo1pPKVhJvJ-KIzp7egctukkPmeEK9VNmzlsaPgzCP_6UgZBTSEPmDIK0URchhz13mK92AnFjhmbAyXqbSAsTo5omKsacDoFLXKzPmA7L1T80LBDXMazXYqEhVKcMcJHYe0aYWlAQZa7B7BRQQo2V1R',
      organizer: { name: 'FOSS Nashik Community', avatarUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Connect with core OSS maintainers, learn how to land your first pull request, and collaborate on community tools.',
      capacity: 80, registeredCount: 65, views: 5400, conversionRate: '13.1%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
    {
      id: 'evt-startup-pitch', title: 'Startup Pitch Night', category: 'Technology',
      tags: ['Startup', 'Pitch', 'Incubator'],
      date: { month: 'DEC', day: '20', fullDate: 'Dec 20, 2024', time: '4:00 PM - 7:30 PM' },
      venue: 'Sandip Innovation Hub', area: 'Sandip Foundation', fee: 0, feeLabel: 'Free Entry',
      isHot: false, status: 'Draft',
      bannerUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80',
      organizer: { name: 'Sandip Innovation Hub', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80', isVerified: true },
      organizerId: 'org_seed_organizer_1',
      description: 'Selected 10 college student founders pitch to venture angels with funding opportunities up to ₹15 Lakhs.',
      capacity: 150, registeredCount: 0, views: 0, conversionRate: '0%',
      isDeleted: false, createdAt: new Date().toISOString(),
    },
  ];

  // 3. Seed passes (matching frontend INITIAL_DIGITAL_PASSES)
  const sig1 = signPass('TKT-8492-XYS', 'evt-techsprint-2026', 'usr_seed_student_1');
  const sig2 = signPass('TKT-3129-DSG', 'evt-design-thinking', 'usr_seed_student_1');

  store.passes = {
    'TKT-8492-XYS': {
      ticketId: 'TKT-8492-XYS', eventId: 'evt-techsprint-2026', eventTitle: 'TechSymposium 2024',
      venue: 'Nashik Hub Main Auditorium', date: 'Oct 24, 2024', time: '09:00 AM',
      tier: 'VIP ACCESS', userId: 'usr_seed_student_1',
      attendeeName: 'Rahul Sharma', collegeId: '21BCE045', department: 'Computer Science',
      teamName: 'ByteCraft Nashik',
      qrCodeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFq60ErKFLT51rke9lWUdS1Pnm8Nn-xLr_tYgLLdxom0R3x8ewc33THepzmWmoYN5dfL6wKFFT6oDBMfRIXweZpnS-NmDRcxCv6yNPuv8xHOqWVFNkesF9kQ1HsiV_VcDSvet2P7EPKAvBTABA19DH0s-_VMGMO87npPgsLiB1K--qgHfBEwvr5q9B7aancYomT3HVnZjYoCH7rsDozCsyQeKPUbs6VYGwr9WB4AVvsxEwGtGvEbFr',
      qrSignature: sig1, status: 'Valid', amountPaid: 499,
      issuedAt: '2024-10-18T10:30:00Z',
    },
    'TKT-3129-DSG': {
      ticketId: 'TKT-3129-DSG', eventId: 'evt-design-thinking', eventTitle: 'Design Thinking Fundamentals',
      venue: 'Digital Space, City Center', date: 'Nov 05, 2024', time: '02:00 PM',
      tier: 'STANDARD PASS', userId: 'usr_seed_student_1',
      attendeeName: 'Rahul Sharma', collegeId: '21BCE045', department: 'Computer Science',
      qrCodeUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFq60ErKFLT51rke9lWUdS1Pnm8Nn-xLr_tYgLLdxom0R3x8ewc33THepzmWmoYN5dfL6wKFFT6oDBMfRIXweZpnS-NmDRcxCv6yNPuv8xHOqWVFNkesF9kQ1HsiV_VcDSvet2P7EPKAvBTABA19DH0s-_VMGMO87npPgsLiB1K--qgHfBEwvr5q9B7aancYomT3HVnZjYoCH7rsDozCsyQeKPUbs6VYGwr9WB4AVvsxEwGtGvEbFr',
      qrSignature: sig2, status: 'Valid', amountPaid: 0,
      issuedAt: '2024-10-19T14:15:00Z',
    },
  };

  // 4. Seed clubs
  store.clubs = [
    { id: 'club-coders-hub', name: 'Nashik Coders Hub', category: 'Technology & Open Source', membersCount: 1420, description: 'Premier student developer community across Nashik engineering colleges.', logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=120&q=80', whatsappLink: 'https://chat.whatsapp.com/demo-nashik-coders', isVerified: true, college: 'City-wide (KKWIEER / NDMVPS / MET)', recentActivity: 'Posted a new challenge: "Algorithm Optimization Mini-Hack"', recentActivityTime: '2 hours ago' },
    { id: 'club-robotics', name: 'Robotics Society', category: 'Hardware & IoT', membersCount: 860, description: 'Building autonomous rovers, drones, and combat bots for Robocon and national robotics competitions.', logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=120&q=80', whatsappLink: 'https://chat.whatsapp.com/demo-nashik-robotics', isVerified: true, college: 'KKWIEER Campus', recentActivity: "Uploaded resources from last week's embedded systems lecture", recentActivityTime: '5 hours ago' },
    { id: 'club-debate', name: 'Debate & Literary Club', category: 'Literature & MUN', membersCount: 540, description: 'Weekly parliamentary debates, Model United Nations training, and youth parliamentary summits in Nashik.', logoUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=120&q=80', whatsappLink: 'https://chat.whatsapp.com/demo-nashik-debate', isVerified: true, college: 'NDMVPS Campus', recentActivity: 'Started a new thread: "Ethics in AI Development"', recentActivityTime: '1 day ago' },
    { id: 'club-rotaract', name: 'Rotaract Club of Nashik Youth', category: 'NGO & Social Impact', membersCount: 1100, description: 'Uniting youth through community service, blood donation drives, Godavari cleaning drives, and educational charity.', logoUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=120&q=80', whatsappLink: 'https://chat.whatsapp.com/demo-rotaract-nashik', isVerified: true, college: 'Inter-College Nashik', recentActivity: 'Announced Godavari River Cleanup Drive for next Sunday', recentActivityTime: '2 days ago' },
    { id: 'club-ecell', name: 'E-Cell KKWIEER', category: 'Entrepreneurship', membersCount: 950, description: 'Fostering the spirit of startup creation with founder talk series, venture pitch deck clinics, and incubation funding.', logoUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=120&q=80', whatsappLink: 'https://chat.whatsapp.com/demo-ecell-kkwieer', isVerified: true, college: 'KKWIEER Campus', recentActivity: 'Published Seed Grant Application guide for student startups', recentActivityTime: '3 days ago' },
  ];

  // 5. Seed community updates
  store.communityUpdates = [
    { id: 'upd-1', clubName: 'Nashik Coders Hub', clubIcon: 'terminal', clubColor: 'text-primary bg-primary-container/30 border-primary/20', text: 'posted a new challenge: "Algorithm Optimization Mini-Hack".', timeAgo: '2 hours ago' },
    { id: 'upd-2', clubName: 'Robotics Society', clubIcon: 'precision_manufacturing', clubColor: 'text-[#9d4300] bg-[#ffdbca]/50 border-[#fd761a]/30', text: "uploaded resources from last week's embedded systems lecture.", timeAgo: '5 hours ago' },
    { id: 'upd-3', clubName: 'Debate Club', clubIcon: 'forum', clubColor: 'text-[#00855b] bg-[#f5fff6] border-[#4edea3]/40', text: 'started a new thread: "Ethics in AI Development".', timeAgo: '1 day ago' },
  ];

  // 6. Seed audit logs
  store.auditLogs = [
    { id: 'aud-101', action: 'Event Published', actor: 'KKWIEER Tech Club', target: 'Nashik TechSprint 2026', timestamp: '2024-10-18 14:32:00', status: 'Success', hash: sha256Hash({ id: 'aud-101', action: 'Event Published', actor: 'KKWIEER Tech Club' }) },
    { id: 'aud-102', action: 'QR Ticket Redeemed', actor: 'Gate Staff #2 (Panchavati)', target: 'Ticket TKT-8492-XYS (Rahul Sharma)', timestamp: '2024-10-18 11:20:15', status: 'Info', hash: sha256Hash({ id: 'aud-102', action: 'QR Ticket Redeemed' }) },
    { id: 'aud-103', action: 'Organizer Verification Approved', actor: 'Admin (System)', target: 'Godavari Cultural Trust', timestamp: '2024-10-17 09:12:44', status: 'Success', hash: sha256Hash({ id: 'aud-103', action: 'Organizer Verification Approved' }) },
    { id: 'aud-104', action: 'Payment Webhook Reconciled', actor: 'UPI Gateway Provider', target: 'Order ₹499.00 - Txn #UPI-984291', timestamp: '2024-10-16 19:40:02', status: 'Success', hash: sha256Hash({ id: 'aud-104', action: 'Payment Webhook Reconciled' }) },
    { id: 'aud-105', action: 'Capacity Threshold Modified', actor: 'NDMVPS Cultural Council', target: 'Symphony Inter-College Fest (1200 -> 1500)', timestamp: '2024-10-15 16:05:22', status: 'Warning', hash: sha256Hash({ id: 'aud-105', action: 'Capacity Threshold Modified' }) },
  ];
}
