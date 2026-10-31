import React from 'react';
import { Users, QrCode, Activity, Globe2, TrendingUp } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const STATS = [
    {
      value: '500K+',
      label: 'Active Monthly Users',
      subtext: 'Entrepreneurs, agencies & creators worldwide',
      icon: <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      gradient: 'from-purple-500/10 to-indigo-500/5',
    },
    {
      value: '20M+',
      label: 'QR Codes Generated',
      subtext: 'High resolution vector & raster exports',
      icon: <QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      gradient: 'from-indigo-500/10 to-blue-500/5',
    },
    {
      value: '99.9%',
      label: 'Server Uptime',
      subtext: 'Global CDN distribution for instant load times',
      icon: <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      gradient: 'from-emerald-500/10 to-teal-500/5',
    },
    {
      value: '180+',
      label: 'Countries Served',
      subtext: 'Universal compatibility across iOS & Android',
      icon: <Globe2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      gradient: 'from-blue-500/10 to-sky-500/5',
    },
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
            Global Impact
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-3">
            Powering Connections Across the World
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-2">
            Trusted by top startups, enterprise brands, and small businesses for reliable QR generation.
          </p>
        </div>

        {/* Grid of Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  {stat.icon}
                </div>
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  <span>+24% YoY</span>
                </div>
              </div>

              <div className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>

              <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-semibold mt-1">
                {stat.label}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
