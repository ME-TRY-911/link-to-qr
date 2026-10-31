import React from 'react';
import { QrCode, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

interface CtaBannerProps {
  onScrollToGenerator: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onScrollToGenerator }) => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glow Box Container */}
        <div className="relative rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl shadow-purple-900/30 border border-purple-500/20">
          
          {/* Background Decorative Rings & Radial Blurs */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Copy */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Instant & Free Forever</span>
              </div>

              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                Ready to Create Your QR Code?
              </h2>

              <p className="text-purple-200 text-base sm:text-lg max-w-xl font-normal">
                Join over 500,000 businesses, creators, and marketers generating high-resolution vector QR codes in seconds.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-purple-200">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  No Registration
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  SVG & 4K PNG
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Custom Logo Support
                </span>
              </div>
            </div>

            {/* Right Action Button */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-start lg:justify-end">
              <button
                onClick={onScrollToGenerator}
                className="w-full py-4 px-8 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-base shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group active:scale-98 cursor-pointer"
              >
                <span>Generate QR Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
