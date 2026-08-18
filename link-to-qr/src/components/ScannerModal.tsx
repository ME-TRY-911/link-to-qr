import React, { useState } from 'react';
import { X, Camera, Upload, ExternalLink, Copy, Check, ShieldCheck, QrCode } from 'lucide-react';

interface ScannerModalProps {
  isOpen: boolean;
  scannedPayload: string | null;
  onClose: () => void;
}

export const ScannerModal: React.FC<ScannerModalProps> = ({ 
  isOpen, 
  scannedPayload, 
  onClose 
}) => {
  const [copied, setCopied] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activePayload, setActivePayload] = useState<string>(
    scannedPayload || 'https://linktoqr.in'
  );

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setActivePayload(customInput || 'https://linktoqr.in/sample-scanned-content');
    }, 1200);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              QR Code Scanner Simulator
            </h3>
            <p className="text-xs text-slate-500">Scan camera frame or inspect payload</p>
          </div>
        </div>

        {/* Camera Viewport Simulation */}
        <div className="relative w-full h-52 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center mb-5">
          <div className="absolute inset-0 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
          
          {/* Scanner Viewfinder Box */}
          <div className="w-36 h-36 border-2 border-dashed border-indigo-400 rounded-2xl relative flex items-center justify-center">
            {scanning ? (
              <div className="w-full h-1 bg-indigo-500 shadow-lg shadow-indigo-500/50 animate-bounce" />
            ) : (
              <QrCode className="w-12 h-12 text-indigo-400/50" />
            )}
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure Scanner Active
            </span>
            <button
              onClick={handleSimulateScan}
              className="text-indigo-400 font-semibold hover:underline"
            >
              {scanning ? 'Scanning...' : 'Re-scan'}
            </button>
          </div>
        </div>

        {/* Scanned Result Box */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Scanned Payload Data
          </span>
          
          <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 font-mono text-xs text-slate-900 dark:text-slate-100 break-all max-h-24 overflow-y-auto">
            {activePayload}
          </div>

          <div className="flex items-center gap-2 pt-1">
            {activePayload.startsWith('http') && (
              <a
                href={activePayload}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
      

            <button
              onClick={handleCopy}
              className="flex-1 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Payload'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
