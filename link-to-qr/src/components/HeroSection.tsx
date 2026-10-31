import React from 'react';
import { QrGeneratorCard } from './QrGenerator/QrGeneratorCard';
import { Sparkles, Shield, Zap, Star, ArrowDown } from 'lucide-react';
import { User } from '../types';

interface HeroSectionProps {
  onOpenScanModal: (qrData: string) => void;
  currentUser?: User | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenScanModal, currentUser, onOpenAuth }) => {
  return (
    <section id="generator" className="relative pt-6 pb-16 md:pt-10 md:pb-20 overflow-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-100/70 dark:bg-indigo-900/30 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-blue-100/70 dark:bg-blue-900/30 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Hero Header Content */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-4">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 px-3.5 py-1.5 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-900/80 shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            NEW: VCard Plus & High Resolution Vector Support
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 dark:text-white tracking-tight leading-[1.1]">
            Free Custom <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">QR Code Generator</span> with Logo
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            The most powerful, secure, and customizable QR code generator for businesses and creators. No signup required.
          </p>

          {/* Avatar Social Proof Row */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-2">
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="User" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="User" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="User" />
              <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" alt="User" />
            </div>
            <div className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <div className="flex text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span>Trusted by 500,000+ creators & brands</span>
            </div>
          </div>

        </div>

        {/* Embedded Interactive QR Generator Card */}
        <QrGeneratorCard 
          onOpenScanModal={onOpenScanModal} 
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
        />

      </div>
    </section>
  );
};
