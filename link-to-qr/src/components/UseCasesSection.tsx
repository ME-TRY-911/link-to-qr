import React, { useState } from 'react';
import { 
  Building2, Megaphone, GraduationCap, Utensils, Calendar, 
  User, Share2, Check, ArrowRight 
} from 'lucide-react';

interface UseCasesSectionProps {
  onSelectUseCase?: (type: string) => void;
}

export const UseCasesSection: React.FC<UseCasesSectionProps> = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const USE_CASES = [
    {
      id: 'business',
      title: 'Business & Office',
      icon: <Building2 className="w-5 h-5" />,
      tagline: 'Digital business cards, WiFi access & office check-ins',
      benefits: [
        'Instant contact saving via vCard format',
        'Secure guest WiFi auto-connect',
        'Physical office visitor management',
        'SaaS app onboarding deep links',
      ],
      previewUrl: 'https://linktoqr.in/vcard/alex-morgan',
    },
    {
      id: 'marketing',
      title: 'Marketing & Ads',
      icon: <Megaphone className="w-5 h-5" />,
      tagline: 'Flyers, billboards, magazine ads & direct mail',
      benefits: [
        'Track campaign conversion rates',
        'Dynamic redirection to seasonal landing pages',
        'Discount coupon downloads',
        'A/B test advertising creatives',
      ],
      previewUrl: 'https://linktoqr.in/promo/summer-sale',
    },
    {
      id: 'restaurant',
      title: 'Restaurant Menus',
      icon: <Utensils className="w-5 h-5" />,
      tagline: 'Touchless digital table menus & ordering',
      benefits: [
        'Instant PDF menu viewing without app download',
        'Real-time price & daily special updates',
        'Direct table ordering & contactless payment',
        'Google Review prompt link',
      ],
      previewUrl: 'https://linktoqr.in/menu/bistro-san-francisco.pdf',
    },
    {
      id: 'events',
      title: 'Events & Tickets',
      icon: <Calendar className="w-5 h-5" />,
      tagline: 'Conferences, weddings, concerts & check-in passes',
      benefits: [
        'Add event directly to Google & Apple Calendars',
        'Venue GPS directions & parking info',
        'Contactless badge scanning',
        'RSVP response collection',
      ],
      previewUrl: 'https://linktoqr.in/event/saas-summit-2026',
    },
    {
      id: 'education',
      title: 'Education & Schools',
      icon: <GraduationCap className="w-5 h-5" />,
      tagline: 'Classroom handouts, syllabi & campus portals',
      benefits: [
        'Quick access to lecture slides & assignments',
        'Library resource catalog links',
        'Student attendance logging',
        'Campus map navigation',
      ],
      previewUrl: 'https://linktoqr.in/edu/cs101-syllabus',
    },
    {
      id: 'social',
      title: 'Social Media',
      icon: <Share2 className="w-5 h-5" />,
      tagline: 'Link-in-bio, Instagram, TikTok & YouTube',
      benefits: [
        'Single QR for all social profile handles',
        'Follower growth on physical merch',
        'Spotify playlist & podcast sharing',
        'Custom brand styling matching feed',
      ],
      previewUrl: 'https://linktoqr.in/bio/alexcreator',
    },
  ];

  const current = USE_CASES[activeTab];

  return (
    <section id="use-cases" className="py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
            Tailored Applications
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Perfect for Every Industry & Use Case
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            From restaurant menus to high-converting outdoor billboards, Link to QR handles it seamlessly.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {USE_CASES.map((uc, idx) => (
            <button
              key={uc.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === idx
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800'
              }`}
            >
              {uc.icon}
              <span>{uc.title}</span>
            </button>
          ))}
        </div>

        {/* Active Use Case Details Box */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-100 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
          
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Industry Spotlight
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-1">
                {current.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">
                {current.tagline}
              </p>
            </div>

            <div className="space-y-3">
              {current.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {b}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#generator"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              <span>Create {current.title} QR</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right Visual Card Mock */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              {current.icon}
            </div>
            <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
              {current.title} QR Sample
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4 font-mono">
              {current.previewUrl}
            </p>
            <div className="w-40 h-40 bg-slate-100 dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(current.previewUrl)}&color=0f172a`}
                alt="QR Preview"
                className="w-full h-full object-contain rounded-md"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
