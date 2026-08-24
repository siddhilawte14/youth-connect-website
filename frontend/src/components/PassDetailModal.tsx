import React, { useState } from 'react';
import { DigitalPass } from '../types';
import { 
  X, 
  QrCode, 
  Download, 
  Share2, 
  MapPin, 
  Calendar, 
  Clock, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  AlertCircle,
  Sparkles
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-[#c2c6d6]/60 flex flex-col relative animate-in zoom-in-95 duration-200">
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-[#0058be] to-[#004294] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full font-bold">
                {pass.tier}
              </span>
              <h2 className="text-base font-bold font-headline mt-0.5">
                Official Digital Entry Pass
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Body */}
        <div className="p-6 flex flex-col items-center">
          {/* Event Title */}
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono text-[#727785] tracking-wider uppercase">
              YOUTHCONNECT NASHIK VERIFIED
            </span>
            <h3 className="text-lg font-bold text-[#0b1c30] font-headline mt-0.5">
              {pass.eventTitle}
            </h3>
            <p className="text-xs text-[#0058be] font-semibold mt-0.5 flex items-center justify-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {pass.venue}
            </p>
          </div>

          {/* QR Code Container */}
          <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-[#0058be]/40 shadow-inner flex flex-col items-center justify-center mb-4 relative group">
            <div className="w-48 h-48 bg-white p-2 rounded-xl flex items-center justify-center border border-gray-200">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pass.ticketId + ' | ' + pass.eventTitle + ' | ' + pass.attendeeName)}`} 
                alt="Ticket QR Code" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="mt-2 flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0b1c30] bg-[#f8f9ff] px-3 py-1 rounded-lg border border-[#c2c6d6]/60">
                {pass.ticketId}
              </span>
              <button
                onClick={handleCopy}
                title="Copy Ticket ID"
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#424754] transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Attendee Details Grid */}
          <div className="w-full bg-[#f8f9ff] rounded-2xl p-4 border border-[#e5eeff] grid grid-cols-2 gap-3 text-xs mb-4">
            <div>
              <span className="text-[10px] text-[#727785] uppercase font-bold block">Attendee</span>
              <span className="font-bold text-[#0b1c30]">{pass.attendeeName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#727785] uppercase font-bold block">College PRN / ID</span>
              <span className="font-bold text-[#0b1c30] font-mono">{pass.collegeId}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#727785] uppercase font-bold block">Department</span>
              <span className="text-[#424754] font-medium truncate block">{pass.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#727785] uppercase font-bold block">Status</span>
              <span className={`inline-flex items-center gap-1 font-bold ${
                pass.status === 'Valid' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  pass.status === 'Valid' ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
                {pass.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#727785] uppercase font-bold block">Date & Time</span>
              <span className="text-[#424754] font-medium">{pass.date} • {pass.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#727785] uppercase font-bold block">Entry Verification</span>
              <span className="text-[#0058be] font-bold">Fast-Track Gate 1</span>
            </div>
          </div>

          {/* Download Notification */}
          {downloadSuccess && (
            <div className="w-full mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-center font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Pass downloaded to device as Offline Pass & Apple Wallet PKPASS format!
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 py-2.5 bg-[#0058be] hover:bg-[#004bb0] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
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
              className="p-2.5 bg-[#f8f9ff] border border-[#c2c6d6] hover:bg-[#eef2ff] text-[#0b1c30] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#0058be]" />
              Share
            </button>
          </div>
        </div>

        {/* Security & College Notes */}
        <div className="bg-[#f0f4fc] px-6 py-3 border-t border-[#e5eeff] text-[11px] text-[#727785] flex items-center justify-between">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-[#0058be]" />
            Valid College ID Card required along with this QR
          </span>
          <span className="font-mono text-[10px]">Youth Connect Guard v2.4</span>
        </div>
      </div>
    </div>
  );
};
