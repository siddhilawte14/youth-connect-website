import React, { useState, useRef } from 'react';
import { EventItem, EventCategory } from '../types';
import { 
  X, 
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
  Send,
  Building2,
  Sparkles,
  Image as ImageIcon,
  Globe,
  Upload,
  UploadCloud,
  Trash2,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (newEvent: EventItem) => void;
}

const PRESET_BANNERS = [
  {
    label: 'Hackathon & AI',
    url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Cultural Fest',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'NGO Volunteer',
    url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Tech Workshop',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
  }
];

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreateEvent,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'location' | 'schedule' | 'banner'>('basic');

  // 1. Event Basic Info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Hackathon');
  const [hostingChapter, setHostingChapter] = useState('ACM Student Chapter / MET BKC');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('AI, Hackathon, Coding, Nashik');

  // 2. Location & Mode
  const [mode, setMode] = useState<'In-Person' | 'Online' | 'Hybrid'>('In-Person');
  const [city, setCity] = useState<'Nashik' | 'Pune'>('Nashik');
  const [exactVenue, setExactVenue] = useState('Auditorium & Computing Labs 301-304');
  const [collegeCampus, setCollegeCampus] = useState('MET Bhujbal Knowledge City, Adgaon');

  // 3. Schedule & Capacity
  const [startDate, setStartDate] = useState('2026-11-20');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endDate, setEndDate] = useState('2026-11-21');
  const [endTime, setEndTime] = useState('05:00 PM');
  const [capacity, setCapacity] = useState<number>(350);
  const [isPaid, setIsPaid] = useState(false);
  const [feeAmount, setFeeAmount] = useState<number>(150);

  // 4. Banner Asset with Device File Upload & 16:9 Aspect Ratio
  const [bannerImage, setBannerImage] = useState<string>(PRESET_BANNERS[0].url);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  // File Upload Handlers
  const processImageFile = (file: File) => {
    setUploadError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }

    // Validate size (max 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setUploadError('Image size exceeds 5MB limit. Please upload a smaller file.');
      return;
    }

    // Read file via FileReader as Data URL (Base64)
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setBannerImage(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBannerImage('');
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePublishOrDraft = (status: 'Published' | 'Draft' = 'Published') => {
    if (!title.trim()) {
      setErrorMessage('Please provide an Event Title before publishing.');
      setActiveTab('basic');
      return;
    }

    // Parse Month and Day from startDate
    let monthStr = 'NOV';
    let dayStr = '20';
    let fullDateStr = 'Nov 20-21, 2026';

    try {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        monthStr = d.toLocaleString('default', { month: 'short' }).toUpperCase();
        dayStr = String(d.getDate()).padStart(2, '0');
        fullDateStr = `${monthStr} ${dayStr}, 2026`;
      }
    } catch {
      // fallback
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const finalBanner = bannerImage.trim() || PRESET_BANNERS[0].url;

    const newEvent: EventItem = {
      id: `evt-org-${Date.now()}`,
      title: title.trim(),
      category,
      tags: tags.length > 0 ? tags : [category, city, mode],
      date: {
        month: monthStr,
        day: dayStr,
        fullDate: fullDateStr,
        time: `${startTime} - ${endTime}`,
      },
      venue: `${exactVenue}, ${collegeCampus}, ${city}`,
      area: `${city} Central`,
      fee: isPaid ? feeAmount : 0,
      feeLabel: isPaid && feeAmount > 0 ? `₹${feeAmount} Pass` : 'Free Entry',
      isHot: true,
      status: status,
      bannerUrl: finalBanner,
      organizer: {
        name: hostingChapter,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        isVerified: true,
        type: 'College Club',
        contactEmail: 'organizer.chapter@campus.edu.in',
      },
      description: description.trim() || `Join us for ${title}, organized by ${hostingChapter}. Experience cutting-edge problem tracks, mentor guidance, verified digital attendance passes, and collegiate social credits.`,
      capacity: Number(capacity) || 200,
      registeredCount: 0,
      views: 12,
      conversionRate: '0%',
      isRegistered: false,
      departmentEligible: 'All Engineering, Diploma, Science & Management Students',
      eligibility: `Open to all verified college students across ${city} and regional districts.`,
      registrationDeadline: `${monthStr} ${Math.max(1, Number(dayStr) - 2)}, 2026`,
      rules: [
        'Physical College ID card is mandatory at the security gate.',
        'Present the dynamic YouthConnect QR pass from your smartphone upon entry.',
        'Bring your own laptop, hardware kits, and chargers for coding rounds.'
      ],
    };

    onCreateEvent(newEvent);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#10B981', '#F59E0B']
      });
    } catch {
      // safe fallback
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200/90 overflow-hidden font-serif text-stone-900">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#8B7CB6] flex items-center justify-center border border-purple-200 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-50 text-[#7C6BA6] border border-purple-200">
                  Organizer Event Studio
                </span>
                <span className="text-xs text-stone-500">• Command Center</span>
              </div>
              <h2 className="text-xl font-bold text-stone-900 mt-0.5">
                Create New Campus Event
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Strip */}
        <div className="flex bg-stone-50 px-5 sm:px-6 border-b border-stone-200 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'basic', label: '1. Event Info' },
            { id: 'location', label: '2. Location & Mode' },
            { id: 'schedule', label: '3. Schedule & Capacity' },
            { id: 'banner', label: '4. Banner Artwork' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setErrorMessage(''); setActiveTab(tab.id as any); }}
              className={`py-3 px-4 border-b-2 transition-all cursor-pointer whitespace-nowrap font-serif ${
                activeTab === tab.id
                  ? 'border-[#8B7CB6] text-[#7C6BA6] font-bold bg-white'
                  : 'border-transparent text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-xs text-stone-700 space-y-5 font-serif bg-white">
          
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: Event Basic Info */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Event Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => { setTitle(e.target.value); setErrorMessage(''); }}
                  placeholder="e.g. Nashik AI & Web3 Sprint 2026 / Avishkar Tech Fest"
                  className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="Cultural">Cultural Fest</option>
                    <option value="NGO Drives">NGO Volunteer Drive</option>
                    <option value="Workshop">Tech Workshop</option>
                    <option value="Competitions">Competitions & Contests</option>
                    <option value="Technology">Technology Summit</option>
                    <option value="Sports">Sports & E-Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Hosting College / Student Chapter *
                  </label>
                  <input
                    type="text"
                    value={hostingChapter}
                    onChange={(e) => setHostingChapter(e.target.value)}
                    placeholder="ACM Student Chapter / MET BKC"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Event Description & Problem Tracks
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Outline key problem statements, mentorship perks, certified participation credentials, food/stay accommodations, and prize pool..."
                  className="w-full bg-white border border-stone-300 rounded-xl p-3.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Discovery Search Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="AI, Web3, Hackathon, Coding, Nashik, Cash Prize"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Location & Mode */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              
              {/* Event Mode Selection */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Event Mode *
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['In-Person', 'Online', 'Hybrid'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        mode === m
                          ? 'bg-purple-50 border-[#8B7CB6] text-[#7C6BA6] font-bold shadow-xs'
                          : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span className="block text-sm">{m}</span>
                      <span className="text-[10px] text-stone-500 mt-0.5 block">
                        {m === 'In-Person' && 'Campus Venue'}
                        {m === 'Online' && 'Virtual Stream'}
                        {m === 'Hybrid' && 'Physical + Online'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    City / District *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value as any)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  >
                    <option value="Nashik">Nashik District</option>
                    <option value="Pune">Pune Metropolitan</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Hosting College Campus *
                  </label>
                  <input
                    type="text"
                    value={collegeCampus}
                    onChange={(e) => setCollegeCampus(e.target.value)}
                    placeholder="MET Bhujbal Knowledge City / KKWIEER / Sandip Univ"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1.5">
                  Exact Venue / Hall / Lab Number *
                </label>
                <input
                  type="text"
                  value={exactVenue}
                  onChange={(e) => setExactVenue(e.target.value)}
                  placeholder="Main Auditorium, Ground Floor & Computing Labs 301-304"
                  className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Schedule & Capacity */}
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Start Time *
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    End Time
                  </label>
                  <input
                    type="text"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    placeholder="05:00 PM"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Total Seat Limit / Capacity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    placeholder="350"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1.5">
                    Ticketing Type *
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      onClick={() => setIsPaid(false)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        !isPaid
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      Free Entry
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsPaid(true)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        isPaid
                          ? 'bg-[#8B7CB6] text-white border-[#7C6BA6] shadow-xs'
                          : 'bg-stone-50 text-stone-600 border-stone-200'
                      }`}
                    >
                      Paid Pass (₹)
                    </button>
                  </div>
                </div>
              </div>

              {isPaid && (
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 animate-in fade-in duration-200">
                  <label className="block font-semibold text-[#7C6BA6] mb-1">
                    Pass Registration Fee (INR ₹) *
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-stone-900">₹</span>
                    <input
                      type="number"
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(Number(e.target.value))}
                      placeholder="150"
                      className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:outline-none focus:border-[#8B7CB6] font-serif shadow-xs"
                    />
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: Banner Artwork with 16:9 Aspect Ratio File Upload Dropzone */}
          {activeTab === 'banner' && (
            <div className="space-y-5">
              
              {/* Hidden Native File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp, image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#8B7CB6]" />
                    <span>Event Artwork & Poster (Fixed 16:9 Aspect Ratio) *</span>
                  </label>
                  <span className="text-[11px] text-stone-500">
                    High-res landscape view for Hero Carousel & Explore Cards
                  </span>
                </div>

                {uploadError && (
                  <div className="p-3 mb-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Main 16:9 Aspect Ratio Container */}
                {bannerImage ? (
                  /* Uploaded Image Active Preview Container with Fixed 16:9 Aspect Ratio */
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-stone-300 bg-stone-900 group shadow-md transition-all">
                    <img
                      src={bannerImage}
                      alt="Event Banner Preview"
                      className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay for Typography Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Aspect Ratio Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-stone-200 pointer-events-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Fixed 16:9 Landscape Banner</span>
                    </div>

                    {/* Bottom Live Mockup Details */}
                    <div className="absolute bottom-3.5 left-4 right-4 pointer-events-none">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#8B7CB6] text-white shadow-xs">
                          {category}
                        </span>
                        <span className="text-[11px] text-stone-300">
                          {startDate} • {mode}
                        </span>
                      </div>
                      <h4 className="text-white font-bold text-base tracking-tight truncate drop-shadow-md">
                        {title || 'Your Event Headline'}
                      </h4>
                      <p className="text-xs text-stone-300 truncate mt-0.5">
                        {exactVenue}, {collegeCampus}
                      </p>
                    </div>

                    {/* Hover Action Overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[3px]">
                      <button
                        type="button"
                        onClick={handleTriggerFileInput}
                        className="px-4 py-2 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer font-serif"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace Image</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform hover:scale-105 active:scale-95 cursor-pointer font-serif"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Dropzone Empty State with Fixed 16:9 Ratio */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleTriggerFileInput}
                    className={`relative aspect-video w-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden group p-6 text-center ${
                      isDragging
                        ? 'border-[#8B7CB6] bg-purple-50 scale-[1.01]'
                        : 'border-stone-300 hover:border-[#8B7CB6] bg-stone-50 hover:bg-purple-50/40'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 group-hover:bg-purple-100 border border-purple-200 flex items-center justify-center text-[#8B7CB6] group-hover:scale-110 transition-all duration-200 mb-3 shadow-xs">
                      <UploadCloud className="w-7 h-7" />
                    </div>

                    <span className="text-sm font-bold text-stone-900 group-hover:text-[#7C6BA6] transition-colors">
                      Click to upload or drag and drop
                    </span>
                    <p className="text-xs text-stone-500 mt-1 max-w-sm">
                      Upload high-resolution event artwork, speaker posters, or banner graphics from your device.
                    </p>

                    <div className="mt-3.5 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-stone-200 text-[11px] font-semibold text-stone-700 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B7CB6]" />
                      <span>Fixed Ratio 16:9 • PNG, JPG, or WebP up to 5MB</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Starter Presets Strip */}
              <div className="pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-semibold text-stone-700">
                    Or choose a 16:9 verified campus preset:
                  </span>
                  <span className="text-[11px] text-stone-500">Instant One-Click Apply</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_BANNERS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => { setBannerImage(preset.url); setUploadError(null); }}
                      className={`rounded-2xl overflow-hidden border transition-all text-left group cursor-pointer ${
                        bannerImage === preset.url
                          ? 'border-[#8B7CB6] ring-2 ring-[#8B7CB6] shadow-sm'
                          : 'border-stone-200 opacity-80 hover:opacity-100 hover:border-stone-400'
                      }`}
                    >
                      <div className="aspect-video w-full overflow-hidden bg-stone-100">
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-2 bg-stone-50 text-[11px] font-semibold text-stone-900 truncate flex items-center justify-between">
                        <span>{preset.label}</span>
                        {bannerImage === preset.url && (
                          <CheckCircle2 className="w-3 h-3 text-[#8B7CB6] shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between font-serif">
          
          <div>
            {activeTab !== 'basic' && (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'banner') setActiveTab('schedule');
                  else if (activeTab === 'schedule') setActiveTab('location');
                  else if (activeTab === 'location') setActiveTab('basic');
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer font-serif"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 font-serif">
            {activeTab !== 'banner' ? (
              <button
                type="button"
                onClick={() => {
                  if (activeTab === 'basic') {
                    if (!title.trim()) {
                      setErrorMessage('Please enter an Event Title to continue.');
                      return;
                    }
                    setActiveTab('location');
                  } else if (activeTab === 'location') {
                    setActiveTab('schedule');
                  } else if (activeTab === 'schedule') {
                    setActiveTab('banner');
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer font-serif"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handlePublishOrDraft('Draft')}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer font-serif"
                >
                  Save Draft
                </button>

                <button
                  type="button"
                  onClick={() => handlePublishOrDraft('Published')}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all hover:scale-102 active:scale-98 cursor-pointer font-serif"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Event to YouthConnect</span>
                </button>
              </>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
