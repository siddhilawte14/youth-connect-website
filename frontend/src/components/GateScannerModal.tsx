import React, { useState } from 'react';
import { DigitalPass } from '../types';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Camera, 
  Search,
  Sparkles,
  ShieldCheck,
  XCircle,
  Clock,
  RefreshCw,
  Sun,
  Volume2
} from 'lucide-react';

interface GateScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  passes: Record<string, DigitalPass>;
  onRedeemPass: (ticketId: string) => void;
}

type ScanStatus = 
  | 'READY_TO_SCAN'
  | 'VALID_TICKET'
  | 'ENTRY_CONFIRMED'
  | 'INVALID_TICKET'
  | 'ALREADY_USED'
  | 'TICKET_NOT_FOUND'
  | 'WRONG_EVENT';

export const GateScannerModal: React.FC<GateScannerModalProps> = ({
  isOpen,
  onClose,
  passes,
  onRedeemPass,
}) => {
  const [ticketInput, setTicketInput] = useState('TKT-8492-XYS');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('VALID_TICKET');
  const [scannedPass, setScannedPass] = useState<DigitalPass | null>(passes['TKT-8492-XYS'] || null);
  const [statusMessage, setStatusMessage] = useState<string>('Pass verified in system database. Ready for entry.');
  const [highContrastOutdoorMode, setHighContrastOutdoorMode] = useState(false);

  if (!isOpen) return null;

  const handleLookup = (code: string) => {
    const clean = code.trim().toUpperCase();
    setTicketInput(clean);

    if (clean === 'INVALID-CODE') {
      setScanStatus('INVALID_TICKET');
      setScannedPass(null);
      setStatusMessage('QR code checksum failed. Ticket signature is forged or invalid.');
      return;
    }

    if (clean === 'WRONG-EVENT') {
      setScanStatus('WRONG_EVENT');
      setScannedPass({
        ticketId: 'TKT-9999-WRG',
        eventId: 'evt-other-campus',
        eventTitle: 'Symbiosis Pune Cultural Fest 2026',
        venue: 'Pune Viman Nagar Campus',
        date: 'Oct 30, 2026',
        time: '11:00 AM',
        tier: 'GENERAL PASS',
        attendeeName: 'Vikram Joshi',
        collegeId: '22SIBM099',
        department: 'MBA Tech',
        qrCodeUrl: '',
        status: 'Valid',
        amountPaid: 200,
        issuedAt: new Date().toISOString(),
      });
      setStatusMessage('Pass belongs to a different event (Symbiosis Pune) — Not valid for this gate.');
      return;
    }

    const found = passes[clean];
    if (found) {
      setScannedPass(found);
      if (found.status === 'Redeemed') {
        setScanStatus('ALREADY_USED');
        setStatusMessage(`Ticket was already checked in at Gate 1 at ${found.redeemedAt || '10:14 AM'}.`);
      } else {
        setScanStatus('VALID_TICKET');
        setStatusMessage('Verified authentic ticket pass. Ready for entry confirmation.');
      }
    } else {
      setScanStatus('TICKET_NOT_FOUND');
      setScannedPass(null);
      setStatusMessage(`No registration found for ticket ID "${clean}". Check student PRN.`);
    }
  };

  const handleConfirmEntry = () => {
    if (scannedPass) {
      onRedeemPass(scannedPass.ticketId);
      setScannedPass({
        ...scannedPass,
        status: 'Redeemed',
        redeemedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
      setScanStatus('ENTRY_CONFIRMED');
      setStatusMessage('Entry confirmed! Attendee admitted to KKWIEER Main Auditorium.');
    }
  };

  const resetScanner = () => {
    setScanStatus('READY_TO_SCAN');
    setScannedPass(null);
    setStatusMessage('Point camera at student QR pass or enter ticket code.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`rounded-3xl w-full max-w-xl max-h-[94vh] overflow-y-auto shadow-2xl border flex flex-col transition-colors ${
        highContrastOutdoorMode 
          ? 'bg-black text-white border-yellow-400' 
          : 'bg-white text-[#0b1c30] border-[#c2c6d6]/60'
      }`}>
        {/* Terminal Header */}
        <div className={`p-4 sm:p-5 border-b flex justify-between items-center ${
          highContrastOutdoorMode ? 'border-zinc-800 bg-zinc-950' : 'border-[#d3e4fe] bg-[#f8f9ff]'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] bg-emerald-500/20 text-emerald-600 font-bold px-2 py-0.5 rounded uppercase">
                  Gate Counter 02 • Active
                </span>
                <span className="text-xs text-gray-400">• KKWIEER Nashik</span>
              </div>
              <h2 className="text-base sm:text-lg font-black font-headline tracking-tight">
                Gate Entry & QR Scanner Terminal
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighContrastOutdoorMode(!highContrastOutdoorMode)}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
                highContrastOutdoorMode 
                  ? 'bg-yellow-400 text-black border-yellow-400' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
              title="Toggle Sunlight High-Contrast Mode"
            >
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Outdoor Sunlight</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:bg-gray-200/40 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport / Status Box */}
        <div className="p-5 space-y-4">
          {/* Simulated Optical Viewfinder */}
          <div className="relative bg-[#050b14] rounded-2xl h-52 overflow-hidden flex flex-col items-center justify-center text-white border-2 border-blue-500/30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,88,190,0.25)_0,transparent_70%)]" />
            

            {/* Target Reticle */}
            <div className={`w-36 h-36 border-2 border-dashed rounded-2xl relative flex items-center justify-center transition-colors ${
              scanStatus === 'VALID_TICKET' || scanStatus === 'ENTRY_CONFIRMED'
                ? 'border-emerald-400 bg-emerald-500/10'
                : scanStatus === 'ALREADY_USED' || scanStatus === 'INVALID_TICKET' || scanStatus === 'TICKET_NOT_FOUND' || scanStatus === 'WRONG_EVENT'
                ? 'border-red-500 bg-red-500/10'
                : 'border-blue-400/80'
            }`}>
              <QrCode className={`w-20 h-20 transition-opacity ${
                scanStatus === 'READY_TO_SCAN' ? 'opacity-40 text-blue-300' : 'opacity-80 text-emerald-300'
              }`} />
            </div>

            {/* Live State Banner on Camera Overlay */}
            <div className="mt-3 flex items-center gap-2 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md ${
                scanStatus === 'ENTRY_CONFIRMED'
                  ? 'bg-emerald-500 text-white'
                  : scanStatus === 'VALID_TICKET'
                  ? 'bg-emerald-600 text-white'
                  : scanStatus === 'ALREADY_USED'
                  ? 'bg-amber-500 text-black'
                  : scanStatus === 'INVALID_TICKET' || scanStatus === 'TICKET_NOT_FOUND' || scanStatus === 'WRONG_EVENT'
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white'
              }`}>
                {scanStatus === 'ENTRY_CONFIRMED' && <CheckCircle2 className="w-4 h-4" />}
                {scanStatus === 'VALID_TICKET' && <CheckCircle2 className="w-4 h-4" />}
                {scanStatus === 'ALREADY_USED' && <AlertTriangle className="w-4 h-4" />}
                {(scanStatus === 'INVALID_TICKET' || scanStatus === 'TICKET_NOT_FOUND' || scanStatus === 'WRONG_EVENT') && <XCircle className="w-4 h-4" />}
                {scanStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Quick Scenario State Switcher Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              Simulate Gate Scanner Scenarios:
            </span>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <button
                onClick={() => handleLookup('TKT-8492-XYS')}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold"
              >
                1. Valid Ticket
              </button>
              <button
                onClick={() => handleLookup('TKT-3129-DSG')}
                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold"
              >
                2. Already Used
              </button>
              <button
                onClick={() => handleLookup('INVALID-CODE')}
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-bold"
              >
                3. Invalid Checksum
              </button>
              <button
                onClick={() => handleLookup('WRONG-EVENT')}
                className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-300 font-bold"
              >
                4. Wrong Event Pass
              </button>
              <button
                onClick={() => handleLookup('UNKNOWN-999')}
                className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold"
              >
                5. Ticket Not Found
              </button>
              <button
                onClick={resetScanner}
                className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Manual Input Code */}
          <div className="flex gap-2">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup(ticketInput)}
              placeholder="Enter Ticket ID (e.g. TKT-8492-XYS)"
              className={`flex-1 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold border focus:outline-none ${
                highContrastOutdoorMode
                  ? 'bg-zinc-900 text-yellow-300 border-yellow-500'
                  : 'bg-[#f8f9ff] text-[#0b1c30] border-[#c2c6d6] focus:border-[#0058be]'
              }`}
            />
            <button
              onClick={() => handleLookup(ticketInput)}
              className="bg-[#0058be] hover:bg-[#004bb0] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Verify Code
            </button>
          </div>

          {/* Detailed Verification Feedback Card */}
          <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
            scanStatus === 'ENTRY_CONFIRMED' || scanStatus === 'VALID_TICKET'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : scanStatus === 'ALREADY_USED'
              ? 'bg-amber-50 border-amber-300 text-amber-950'
              : scanStatus === 'READY_TO_SCAN'
              ? 'bg-blue-50 border-blue-200 text-blue-950'
              : 'bg-red-50 border-red-300 text-red-950'
          }`}>
            <div className="flex items-start gap-2.5">
              {scanStatus === 'ENTRY_CONFIRMED' || scanStatus === 'VALID_TICKET' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              ) : scanStatus === 'ALREADY_USED' ? (
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              ) : scanStatus === 'READY_TO_SCAN' ? (
                <Camera className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-sm leading-tight">
                  {statusMessage}
                </h4>
                {scannedPass && (
                  <div className="mt-2 grid grid-cols-2 gap-2 bg-white/80 p-2.5 rounded-xl border border-black/10">
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Attendee</span>
                      <span className="font-bold text-gray-900 text-xs">{scannedPass.attendeeName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">PRN / College</span>
                      <span className="font-bold text-gray-900 text-xs">{scannedPass.collegeId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Department</span>
                      <span className="text-gray-900 text-xs">{scannedPass.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-500 font-bold block uppercase">Pass Tier</span>
                      <span className="font-bold text-[#0058be] text-xs">{scannedPass.tier}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Entry Action Buttons */}
            {scanStatus === 'VALID_TICKET' && (
              <button
                onClick={handleConfirmEntry}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <UserCheck className="w-5 h-5" />
                <span>CONFIRM ENTRY & ADMIT ATTENDEE</span>
              </button>
            )}

            {scanStatus === 'ENTRY_CONFIRMED' && (
              <div className="p-3 bg-emerald-700 text-white rounded-xl text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>ADMISSION COMPLETED • PASS REDEEMED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
