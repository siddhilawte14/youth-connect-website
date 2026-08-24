import React, { useState } from 'react';
import { DigitalPass } from '../types';
import { 
  X, 
  Download, 
  Share2, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  CalendarPlus
} from 'lucide-react';

interface PassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pass: DigitalPass | null;
}

export const PassDetailModal: React.FC<PassDetailModalProps> = ({
  isOpen,
  onClose,
  pass,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen || !pass) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(pass.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div className="bg-white text-stone-900 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-[#8B7CB6] p-4 text-white flex items-center justify-between font-serif">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase bg-white/20 px-2 py-0.2 rounded-full font-semibold">
                {pass.tier}
              </span>
              <h2 className="text-sm font-bold font-serif mt-0.5">
                Official Digital Entry Pass
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-5 flex flex-col items-center font-serif">
          {/* Event Title */}
          <div className="text-center mb-3">
            <span className="text-[10px] text-stone-500 tracking-wider uppercase font-serif font-semibold">
              YOUTHCONNECT NASHIK VERIFIED
            </span>
            <h3 className="text-base font-bold text-stone-900 font-serif mt-0.5">
              {pass.eventTitle}
            </h3>
            <p className="text-xs text-[#7C6BA6] font-medium mt-0.5 flex items-center justify-center gap-1 font-serif">
              <MapPin className="w-3 h-3" />
              {pass.venue}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex flex-col items-center justify-center mb-3 w-full">
            <div className="w-40 h-40 bg-white p-2 rounded-xl flex items-center justify-center border border-stone-200 shadow-xs">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pass.ticketId + ' | ' + pass.eventTitle + ' | ' + pass.attendeeName)}`} 
                alt="Ticket QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="mt-2.5 flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-stone-900 bg-white px-2.5 py-0.5 rounded-lg border border-stone-200 shadow-xs">
                {pass.ticketId}
              </span>
              <button
                onClick={handleCopy}
                title="Copy Ticket ID"
                className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-xs transition-colors cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Subtle Divider Line */}
            <div className="w-full border-t border-stone-200 my-2.5" />

            {/* Add to Google Calendar Action Button */}
            <a
              href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                pass.eventTitle
              )}&dates=20261215T090000Z/20261215T130000Z&details=${encodeURIComponent(
                'Registered Pass ID: ' + pass.ticketId + '\nAttendee: ' + pass.attendeeName + '\nVenue: ' + pass.venue + '\n\nManaged via YouthConnect'
              )}&location=${encodeURIComponent(pass.venue)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-purple-200 text-[#7C6BA6] hover:bg-purple-50 text-xs font-serif px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-all w-full shadow-xs cursor-pointer text-center select-none bg-white"
              title="Add this registered event to Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 shrink-0 text-[#8B7CB6]" />
              <span className="whitespace-nowrap font-medium">Add to Google Calendar</span>
            </a>
          </div>

          {/* Attendee Details Grid */}
          <div className="w-full bg-stone-50 rounded-2xl p-3.5 border border-stone-200 grid grid-cols-2 gap-2.5 text-xs mb-3 font-serif">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Attendee</span>
              <span className="font-semibold text-stone-900">{pass.attendeeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Pass Tier</span>
              <span className="font-semibold text-[#7C6BA6] font-serif">{pass.tier || 'Student Pass'}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Department</span>
              <span className="text-stone-700 font-medium truncate block">{pass.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Status</span>
              <span className={`inline-flex items-center gap-1 font-semibold ${
                pass.status === 'Valid' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  pass.status === 'Valid' ? 'bg-emerald-600' : 'bg-amber-600'
                }`} />
                {pass.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Date & Time</span>
              <span className="text-stone-700 font-medium">{pass.date} • {pass.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-medium block">Entry Verification</span>
              <span className="text-[#7C6BA6] font-semibold">Fast-Track Gate 1</span>
            </div>
          </div>

          {/* Download Notification */}
          {downloadSuccess && (
            <div className="w-full mb-2.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-medium flex items-center justify-center gap-1.5 animate-in fade-in font-serif">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Pass saved offline to device!
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex gap-2 font-serif">
            <button
              onClick={handleDownload}
              className="flex-1 py-2 bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer font-serif"
            >
              <Download className="w-3.5 h-3.5" />
              Save Offline Pass
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: pass.eventTitle,
                    text: `My entry pass for ${pass.eventTitle}: Ticket ID ${pass.ticketId}`,
                  }).catch(() => {});
                } else {
                  handleCopy();
                }
              }}
              className="p-2 bg-stone-100 border border-stone-200 hover:bg-stone-200 text-stone-800 rounded-xl font-medium text-xs flex items-center justify-center gap-1 transition-colors cursor-pointer font-serif"
            >
              <Share2 className="w-3.5 h-3.5 text-[#8B7CB6]" />
              Share
            </button>
          </div>
        </div>

        {/* Security & College Notes */}
        <div className="bg-stone-50 px-5 py-2.5 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between font-serif">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3 h-3 text-[#8B7CB6]" />
            Valid College ID Card required at entry
          </span>
          <span className="font-mono text-[10px]">YouthConnect Guard v2.4</span>
        </div>
      </div>
    </div>
  );
};
