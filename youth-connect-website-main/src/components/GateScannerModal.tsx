import React, { useState } from 'react';
import { DigitalPass } from '../types';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Camera, 
  ShieldCheck, 
  XCircle, 
  RefreshCw, 
  Sun
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200 font-serif">
      <div className={`rounded-3xl w-full max-w-xl max-h-[92vh] overflow-y-auto shadow-2xl border flex flex-col transition-colors ${
        highContrastOutdoorMode 
          ? 'bg-black text-white border-amber-400' 
          : 'bg-white text-stone-900 border-stone-200'
      }`}>
        {/* Terminal Header */}
        <div className={`p-4 sm:p-5 border-b flex justify-between items-center ${
          highContrastOutdoorMode ? 'border-zinc-800 bg-zinc-950' : 'border-stone-200 bg-stone-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif">
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-md uppercase border border-emerald-200">
                  Gate Counter 02 • Active
                </span>
                <span className="text-xs text-stone-500 font-serif">• KKWIEER Nashik</span>
              </div>
              <h2 className="text-base font-bold tracking-tight font-serif mt-0.5 text-stone-900">
                Gate Entry & QR Scanner Terminal
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHighContrastOutdoorMode(!highContrastOutdoorMode)}
              className={`p-1.5 rounded-xl border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer font-serif ${
                highContrastOutdoorMode 
                  ? 'bg-amber-400 text-black border-amber-400' 
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="Toggle Sunlight High-Contrast Mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Outdoor</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport / Status Box */}
        <div className="p-5 space-y-4 font-serif">
          {/* Simulated Optical Viewfinder */}
          <div className="relative bg-stone-900 rounded-2xl h-44 overflow-hidden flex flex-col items-center justify-center text-white border border-stone-800 shadow-inner">
            {/* Target Reticle */}
            <div className={`w-32 h-32 border-2 border-dashed rounded-2xl relative flex items-center justify-center transition-colors ${
              scanStatus === 'VALID_TICKET' || scanStatus === 'ENTRY_CONFIRMED'
                ? 'border-emerald-400 bg-emerald-500/10'
                : scanStatus === 'ALREADY_USED' || scanStatus === 'INVALID_TICKET' || scanStatus === 'TICKET_NOT_FOUND' || scanStatus === 'WRONG_EVENT'
                ? 'border-red-500 bg-red-500/10'
                : 'border-purple-300/50'
            }`}>
              <QrCode className={`w-16 h-16 transition-opacity ${
                scanStatus === 'READY_TO_SCAN' ? 'opacity-40 text-purple-200' : 'opacity-80 text-emerald-300'
              }`} />
            </div>

            {/* Live State Banner on Camera Overlay */}
            <div className="mt-2.5 flex items-center gap-1.5 z-10 font-serif">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1 shadow-xs font-serif ${
                scanStatus === 'ENTRY_CONFIRMED'
                  ? 'bg-emerald-600 text-white'
                  : scanStatus === 'VALID_TICKET'
                  ? 'bg-emerald-600 text-white'
                  : scanStatus === 'ALREADY_USED'
                  ? 'bg-amber-600 text-white'
                  : scanStatus === 'INVALID_TICKET' || scanStatus === 'TICKET_NOT_FOUND' || scanStatus === 'WRONG_EVENT'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#8B7CB6] text-white'
              }`}>
                {scanStatus === 'ENTRY_CONFIRMED' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {scanStatus === 'VALID_TICKET' && <CheckCircle2 className="w-3.5 h-3.5" />}
                {scanStatus === 'ALREADY_USED' && <AlertTriangle className="w-3.5 h-3.5" />}
                {(scanStatus === 'INVALID_TICKET' || scanStatus === 'TICKET_NOT_FOUND' || scanStatus === 'WRONG_EVENT') && <XCircle className="w-3.5 h-3.5" />}
                {scanStatus.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          {/* Quick Scenario State Switcher Chips */}
          <div className="space-y-1">
            <span className="text-[10px] font-medium text-stone-500 uppercase tracking-wider block font-serif">
              Simulate Gate Scenarios:
            </span>
            <div className="flex flex-wrap gap-1 text-xs font-serif">
              <button
                onClick={() => handleLookup('TKT-8492-XYS')}
                className="px-2 py-0.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium cursor-pointer"
              >
                1. Valid Ticket
              </button>
              <button
                onClick={() => handleLookup('TKT-3129-DSG')}
                className="px-2 py-0.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium cursor-pointer"
              >
                2. Already Used
              </button>
              <button
                onClick={() => handleLookup('INVALID-CODE')}
                className="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 font-medium cursor-pointer"
              >
                3. Invalid Code
              </button>
              <button
                onClick={() => handleLookup('WRONG-EVENT')}
                className="px-2 py-0.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-[#7C6BA6] border border-purple-200 font-medium cursor-pointer"
              >
                4. Wrong Event
              </button>
              <button
                onClick={resetScanner}
                className="px-2 py-0.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>
          </div>

          {/* Manual Input Code */}
          <div className="flex gap-2 font-serif">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup(ticketInput)}
              placeholder="Enter Ticket ID (e.g. TKT-8492-XYS)"
              className={`flex-1 rounded-xl px-3 py-2 text-xs font-mono font-medium border focus:outline-none font-serif ${
                highContrastOutdoorMode
                  ? 'bg-zinc-900 text-amber-300 border-amber-500'
                  : 'bg-white text-stone-900 border-stone-300 focus:border-[#8B7CB6] shadow-xs'
              }`}
            />
            <button
              onClick={() => handleLookup(ticketInput)}
              className="bg-[#8B7CB6] hover:bg-[#7C6BA6] text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-xs transition-colors cursor-pointer font-serif"
            >
              Verify Code
            </button>
          </div>

          {/* Detailed Verification Feedback Card */}
          <div className={`p-3.5 rounded-2xl border text-xs space-y-2.5 font-serif ${
            scanStatus === 'ENTRY_CONFIRMED' || scanStatus === 'VALID_TICKET'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : scanStatus === 'ALREADY_USED'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : scanStatus === 'READY_TO_SCAN'
              ? 'bg-purple-50 border-purple-200 text-stone-800'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            <div className="flex items-start gap-2">
              {scanStatus === 'ENTRY_CONFIRMED' || scanStatus === 'VALID_TICKET' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : scanStatus === 'ALREADY_USED' ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              ) : scanStatus === 'READY_TO_SCAN' ? (
                <Camera className="w-4 h-4 text-[#8B7CB6] shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-bold text-xs leading-tight font-serif text-stone-900">
                  {statusMessage}
                </h4>
                {scannedPass && (
                  <div className="mt-2 grid grid-cols-2 gap-2 bg-white p-2.5 rounded-xl border border-stone-200 font-serif shadow-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 font-medium block uppercase">Attendee</span>
                      <span className="font-bold text-stone-900 text-xs font-serif">{scannedPass.attendeeName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-medium block uppercase">PRN / College</span>
                      <span className="font-medium text-stone-700 text-xs font-serif">{scannedPass.collegeId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-medium block uppercase">Department</span>
                      <span className="text-stone-700 text-xs font-serif">{scannedPass.department}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-medium block uppercase">Pass Tier</span>
                      <span className="font-semibold text-[#7C6BA6] text-xs font-serif">{scannedPass.tier}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Entry Action Buttons */}
            {scanStatus === 'VALID_TICKET' && (
              <button
                onClick={handleConfirmEntry}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-all cursor-pointer font-serif"
              >
                <UserCheck className="w-4 h-4" />
                <span>CONFIRM ENTRY & ADMIT ATTENDEE</span>
              </button>
            )}

            {scanStatus === 'ENTRY_CONFIRMED' && (
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-xl text-center font-medium text-xs flex items-center justify-center gap-1.5 font-serif border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>ADMISSION COMPLETED • PASS REDEEMED</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
