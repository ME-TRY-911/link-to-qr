import React from 'react';
import { 
  X, Info, ShieldCheck, Zap, Sparkles, Heart, Globe, 
  CheckCircle2, Code2, Server, Lock, Mail, ExternalLink, Users, FileText 
} from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                About Link to <span className="text-indigo-600 dark:text-indigo-400">QR</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ultra-fast, customizable, and privacy-first QR code generator for creators & businesses
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 py-6 space-y-6 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          
          {/* Mission Hero Box */}
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-950/40 dark:to-slate-900 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Our Core Mission</span>
            </div>
            <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              Democratizing High-Quality QR Code Generation
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
              Link to QR was created to eliminate paywalls, low-resolution exports, and watermarked QR code generators. We empower businesses, marketers, organizers, and creators with vector-sharp SVG exports, custom brand logos, and instant scanning tools—completely free forever.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100 dark:border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> 100% Free Forever
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100 dark:border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> High-Res SVG & PNG Exports
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 font-semibold text-xs border border-indigo-100 dark:border-indigo-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Zero Tracking & Privacy First
              </span>
            </div>
          </div>

          {/* Key Value Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <h5 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                Instant Generation
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate crisp QR codes in milliseconds. Customize colors, dot styles, corner radiuses, and embed your brand logo seamlessly.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h5 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                Privacy Guaranteed
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Static QR codes are rendered strictly in your browser. Your URLs, passwords, and vCard contents never leave your device.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <h5 className="font-heading font-bold text-slate-900 dark:text-white text-sm">
                Multi-Format Support
              </h5>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports URLs, WiFi networks, vCards, Emails, SMS, Events, App Store links, and plain text with instant live previews.
              </p>
            </div>
          </div>

          {/* Architecture & Tech Stack */}
          <div className="space-y-3 pt-2">
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-600" />
              <span>Technology Stack & Architecture</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Link to QR is engineered with cut-throat modern web technologies to ensure lightning-fast performance, maximum uptime, and robust user authorization:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> React 18 & Vite
              </div>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span> Tailwind CSS v4
              </div>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Firebase & Auth
              </div>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Google Cloud Run
              </div>
            </div>
          </div>

          {/* Ecosystem & Partners */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Partner & AI Ecosystem
              </span>
              <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                Featured Product
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>TextSnap AI OCR</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Extract text from images, scanned documents, and physical QR prints using artificial intelligence.
                </p>
              </div>
              <a
                href="https://textsnap-ai-ocr.onrender.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors"
              >
                <span>Visit AI OCR</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for the global creator community.</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
