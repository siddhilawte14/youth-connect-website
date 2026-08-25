import React, { useState } from 'react';
import { EventItem, EventCategory } from '../types';
import { 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Tag, 
  Users, 
  IndianRupee, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  FileText, 
  Eye, 
  Send,
  AlertCircle
} from 'lucide-react';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventItem) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // STEP 1: Basic Information
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Hackathon');
  const [tagsInput, setTagsInput] = useState('AI, Hackathon, Nashik');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80');

  // STEP 2: Schedule & Venue
  const [month, setMonth] = useState('DEC');
  const [day, setDay] = useState('18');
  const [fullDate, setFullDate] = useState('Dec 18, 2026');
  const [time, setTime] = useState('09:00 AM - 05:00 PM');
  const [venue, setVenue] = useState('KKWIEER Auditorium, Panchavati');
  const [area, setArea] = useState('Panchavati');

  // STEP 3: Eligibility
  const [eligibility, setEligibility] = useState('Open to all Engineering & Diploma students across Nashik & Pune');
  const [departmentEligible, setDepartmentEligible] = useState('All Departments (CS/IT/ENTC/Mech/Civil)');

  // STEP 4: Registration
  const [isPaid, setIsPaid] = useState(false);
  const [fee, setFee] = useState<number>(0);
  const [capacity, setCapacity] = useState<number>(300);
  const [registrationDeadline, setRegistrationDeadline] = useState('Dec 15, 2026');
  const [ticketType, setTicketType] = useState('Standard Entry Pass');

  // STEP 5: Additional Information
  const [rules, setRules] = useState('1. College ID card is mandatory at gate.\n2. Carry own laptop & charger for coding rounds.\n3. Dynamic QR code must be presented from YouthConnect app.');
  const [contactEmail, setContactEmail] = useState('techclub@kkwieer.edu.in');
  const [faqs, setFaqs] = useState('Q: Will certificates be provided?\nA: Yes, verified digital certificates will be issued to all checked-in attendees.\n\nQ: Is food provided?\nA: Yes, lunch and refreshment vouchers are included.');

  if (!isOpen) return null;

  const handlePublish = (status: 'Published' | 'Draft' | 'Pending Approval' = 'Published') => {
    if (!title.trim()) {
      setCurrentStep(1);
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const newEvent: EventItem = {
      id: `evt-${Date.now()}`,
      title,
      category,
      tags: tags.length > 0 ? tags : [category],
      date: {
        month: month.toUpperCase(),
        day,
        fullDate: fullDate || `${month} ${day}, 2026`,
        time,
      },
      venue,
      area,
      fee: isPaid ? fee : 0,
      feeLabel: isPaid && fee > 0 ? `Pass: ₹${fee}` : 'Free Entry',
      isHot: true,
      status: status,
      bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      organizer: {
        name: 'Nashik Student Chapter',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        isVerified: true,
        type: 'College Club',
        contactEmail: contactEmail,
      },
      description: description || 'Join us for this premier student event in Nashik featuring mentorship, coding challenges, and verified participation certificates.',
      capacity: Number(capacity) || 100,
      registeredCount: 1,
      views: 45,
      conversionRate: '2.2%',
      isRegistered: false,
      departmentEligible: departmentEligible,
      eligibility: eligibility,
      registrationDeadline: registrationDeadline,
      rules: rules.split('\n').filter(Boolean),
    };

    onCreateEvent(newEvent);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-[#c2c6d6]/60 overflow-hidden">
        {/* Modal Header & Stepper */}
        <div className="bg-[#f8f9ff] border-b border-[#d3e4fe] p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0058be] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Organizer Event Studio
                </span>
                <span className="text-xs text-[#727785]">Step {currentStep} of 6</span>
              </div>
              <h2 className="text-xl font-bold text-[#0b1c30] font-headline mt-1">
                {currentStep === 1 && '1. Basic Information'}
                {currentStep === 2 && '2. Schedule & Venue'}
                {currentStep === 3 && '3. Eligibility & Criteria'}
                {currentStep === 4 && '4. Registration & Tickets'}
                {currentStep === 5 && '5. Additional Info & Guidelines'}
                {currentStep === 6 && '6. Preview & Publish'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-[#727785] hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <button
                key={s}
                onClick={() => setCurrentStep(s as any)}
                className={`h-1.5 rounded-full transition-all ${
                  s === currentStep
                    ? 'bg-[#0058be] ring-2 ring-blue-300'
                    : s < currentStep
                    ? 'bg-emerald-500'
                    : 'bg-gray-200'
                }`}
                title={`Jump to Step ${s}`}
              />
            ))}
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs text-[#424754]">
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1.5">Event Name / Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Nashik AI & Web3 Sprint 2026"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3.5 py-2.5 text-sm text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1.5">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2.5 text-xs text-[#0b1c30]"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Technology">Technology</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Cultural">Cultural & Fests</option>
                    <option value="Competitions">Competitions & Contests</option>
                    <option value="Fests">College Fests</option>
                    <option value="Sports">Sports & Tournaments</option>
                    <option value="Entrepreneurship">Entrepreneurship & Pitch</option>
                    <option value="Volunteering">Volunteering & NGO Drives</option>
                    <option value="Career">Career & Placement Talks</option>
                    <option value="Academic">Academic Seminars</option>
                    <option value="Meetup">Student Meetup</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1.5">Search Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="AI, Coding, Hackathon, KKWIEER"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2.5 text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1.5">Event Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what the event is about, what participants will experience, problem statements, and key highlights..."
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl p-3 text-xs text-[#0b1c30] focus:outline-none focus:border-[#0058be]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1.5">Event Banner URL</label>
                <input
                  type="url"
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                />
                {bannerUrl && (
                  <div className="mt-2 h-28 rounded-xl overflow-hidden border border-gray-200">
                    <img src={bannerUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Schedule & Venue */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Month</label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  >
                    {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Day</label>
                  <input
                    type="text"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    placeholder="18"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Full Date Label</label>
                  <input
                    type="text"
                    value={fullDate}
                    onChange={(e) => setFullDate(e.target.value)}
                    placeholder="Dec 18, 2026"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Time Schedule</label>
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="09:00 AM - 05:00 PM"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Venue Name / Room / Hall *</label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. KKWIEER Main Auditorium, Panchavati"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Nashik Area / Sector</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  >
                    <option value="Panchavati">Panchavati (KKWIEER / MET)</option>
                    <option value="Gangapur Road">Gangapur Road (NDMVPS KBTCOE)</option>
                    <option value="Sandip Foundation">Trimbak Road (Sandip University)</option>
                    <option value="City Center">City Center / Govind Nagar</option>
                    <option value="College Road">College Road (BYK / RYK / HPT)</option>
                    <option value="Online">Online / Hybrid Portal</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Eligibility */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Who Can Participate? *</label>
                <textarea
                  rows={3}
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. Open to all students currently enrolled in undergraduate or diploma programs across Maharashtra."
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl p-3 text-xs text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Department / Branch Restrictions</label>
                <input
                  type="text"
                  value={departmentEligible}
                  onChange={(e) => setDepartmentEligible(e.target.value)}
                  placeholder="e.g. All Engineering Branches / CS & IT Only"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0058be] shrink-0 mt-0.5" />
                <span>YouthConnect verifies student PRN and College ID cards at the gate to maintain fair collegiate participation.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Registration */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Pricing Model</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setIsPaid(false); setFee(0); }}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        !isPaid ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-gray-50 text-[#424754]'
                      }`}
                    >
                      100% Free Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPaid(true)}
                      className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        isPaid ? 'bg-[#0058be] text-white border-[#0058be]' : 'bg-gray-50 text-[#424754]'
                      }`}
                    >
                      Paid Pass (₹)
                    </button>
                  </div>
                </div>

                {isPaid && (
                  <div>
                    <label className="block font-bold text-[#0b1c30] mb-1">Ticket Fee per Attendee (₹)</label>
                    <input
                      type="number"
                      min={1}
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      placeholder="150"
                      className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-[#0b1c30] mb-1">Total Seat Capacity</label>
                  <input
                    type="number"
                    min={10}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    placeholder="300"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#0b1c30] mb-1">Registration Deadline</label>
                  <input
                    type="text"
                    value={registrationDeadline}
                    onChange={(e) => setRegistrationDeadline(e.target.value)}
                    placeholder="Dec 15, 2026 (11:59 PM)"
                    className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Additional Info */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Rules & Guidelines (One per line)</label>
                <textarea
                  rows={3}
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="1. College ID mandatory\n2. Bring laptop..."
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl p-3 text-xs text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Frequently Asked Questions (FAQs)</label>
                <textarea
                  rows={4}
                  value={faqs}
                  onChange={(e) => setFaqs(e.target.value)}
                  placeholder="Q: Will lunch be provided?\nA: Yes, coupons provided..."
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl p-3 text-xs text-[#0b1c30]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#0b1c30] mb-1">Organizer Contact Email</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="contact@club.kkwieer.edu.in"
                  className="w-full bg-[#f8f9ff] border border-[#c2c6d6] rounded-xl px-3 py-2 text-xs text-[#0b1c30]"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Preview & Publish */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 p-3 rounded-xl text-xs text-blue-900">
                <span className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#0058be]" />
                  Verified Organizer Status: Approved
                </span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded text-[#0058be] font-bold border border-blue-200">
                  Instant Publishing Enabled
                </span>
              </div>

              <h4 className="font-bold text-[#0b1c30] text-sm">Live Student Discovery Card Preview:</h4>

              {/* Realistic Event Card Preview */}
              <div className="bg-white rounded-2xl border border-[#c2c6d6] overflow-hidden shadow-md max-w-md mx-auto">
                <div className="relative h-40">
                  <img src={bannerUrl} alt={title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 bg-[#0058be] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {category}
                  </div>
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {isPaid ? `₹${fee}` : 'FREE'}
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-sm text-[#0b1c30]">{title || 'Untitled Event'}</h3>
                  <p className="text-xs text-[#727785] line-clamp-2">{description || 'Event description will appear here...'}</p>
                  <div className="flex justify-between items-center text-[11px] text-[#424754] pt-2 border-t border-gray-100">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#0058be]" /> {fullDate}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#0058be]" /> {area}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#f8f9ff] border-t border-[#d3e4fe] p-4 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#424754] border border-[#c2c6d6] font-bold text-xs shadow-2xs transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => {
                  if (currentStep === 1 && !title.trim()) {
                    alert('Please enter an Event Title to proceed.');
                    return;
                  }
                  setCurrentStep((prev) => (prev + 1) as any);
                }}
                className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#0058be] hover:bg-[#004bb0] text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Continue to Step {currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePublish('Draft')}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#424754] border border-[#c2c6d6] font-bold text-xs transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handlePublish('Published')}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish to YouthConnect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
