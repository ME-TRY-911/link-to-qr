import React, { useState } from 'react';
import { ExternalLink, Info, X } from 'lucide-react';

interface AdBannerProps {
  slot?: 'responsive' | 'banner' | 'leaderboard';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ slot = 'responsive', className = '' }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6 ${className}`}>
      <div className="relative overflow-hidden bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 text-xs">
        {/* Ad Header Label */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span>Sponsored / Advertisement</span>
            <Info className="w-3 h-3 text-slate-400 cursor-pointer" title="Ad choices" />
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            title="Hide Advertisement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Ad Content Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 font-extrabold text-sm border border-indigo-200 dark:border-indigo-800">
              ADS
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                Fast Cloud Hosting for Next-Gen Web Apps & API Services
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs">
                Deploy high-throughput microservices with instant global CDN distribution.
              </p>
            </div>
          </div>

          <a
            href="https://cloud.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs whitespace-nowrap transition-colors flex items-center gap-1.5 shadow-xs w-full sm:w-auto justify-center"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
