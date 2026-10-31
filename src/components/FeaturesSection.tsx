import React from 'react';
import { Palette, RefreshCw, BarChart3, Image as ImageIcon, Sparkles, Download, ShieldCheck, Zap } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const FEATURES = [
    {
      title: 'Custom QR Design',
      description: 'Choose custom dot patterns, corner shapes, foreground colors, gradients, and transparent backgrounds.',
      icon: <Palette className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      tag: 'Styling Engine',
    },
    {
      title: 'Dynamic QR Codes',
      description: 'Update target destination URLs anytime without needing to reprint physical posters or marketing materials.',
      icon: <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      tag: 'Editable Links',
    },
    {
      title: 'Real-time Analytics',
      description: 'Track total scans, unique visitors, geographic distribution, device types, and peak engagement times.',
      icon: <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      tag: 'Metrics',
    },
    {
      title: 'Logo & Brand Support',
      description: 'Embed your company logo or select from built-in social and tech brand icons with automated center margin padding.',
      icon: <ImageIcon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      tag: 'Branding',
    },
    {
      title: 'High Resolution & Vector',
      description: 'Export in crisp 4K PNG raster formats or fully scalable SVG vector formats for large outdoor billboard printing.',
      icon: <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />,
      tag: 'Print Ready',
    },
    {
      title: 'Unlimited Free Downloads',
      description: 'No scan caps, bandwidth limits, or expiration dates. Generate as many QR codes as your project requires.',
      icon: <Download className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
      tag: 'No Restrictions',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
            Powerful Features
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Everything You Need in a Modern QR Generator
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Designed for designers, marketers, developers, and everyday users who demand precision and high aesthetics.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                    {feature.tag}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Explore capability</span>
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
