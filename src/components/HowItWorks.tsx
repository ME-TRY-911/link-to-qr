import React from 'react';
import { FormInput, Sliders, Share2, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const STEPS = [
    {
      number: '01',
      title: 'Enter Your Content',
      description: 'Paste your website URL, WiFi details, contact vCard info, or upload a document.',
      icon: <FormInput className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      highlight: 'Instant parsing & validation',
    },
    {
      number: '02',
      title: 'Customize Your Design',
      description: 'Choose brand colors, dot styles, corner shapes, and upload your custom company logo.',
      icon: <Sliders className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      highlight: 'Live SVG/Canvas preview',
    },
    {
      number: '03',
      title: 'Download & Share',
      description: 'Export in ultra high-resolution PNG, vector SVG, or PDF ready for web, print, and physical signage.',
      icon: <Share2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      highlight: 'Zero quality loss downloads',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
            Simple 3-Step Process
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            How It Works
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Create professional QR codes for your business or project in under 30 seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {STEPS.map((step, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-100 dark:border-slate-800 relative group hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-300 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading font-extrabold text-3xl text-indigo-600/30 dark:text-indigo-400/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {step.number}
                  </span>
                  <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white mb-2">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{step.highlight}</span>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
