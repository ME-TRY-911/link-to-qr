import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'Are these QR codes 100% free for commercial use?',
      a: 'Yes! All QR codes generated on Link to QR are 100% free for both personal and commercial use with no hidden fees, paywalls, or limits.',
    },
    {
      q: 'Do generated QR codes ever expire?',
      a: 'No, static QR codes never expire because the encoded information (such as your URL, WiFi password, or vCard details) is embedded directly into the pixel pattern itself.',
    },
    {
      q: 'What is the difference between Static and Dynamic QR codes?',
      a: 'A Static QR code permanently encodes the payload directly into the pattern. A Dynamic QR code points to a short URL redirect, allowing you to update the destination URL at any time after printing, plus track real-time scan analytics.',
    },
    {
      q: 'Can I add my company logo and brand colors?',
      a: 'Absolutely! You can customize foreground colors, background colors (including transparency), choose dot styles, and upload custom PNG/SVG logos to sit in the center of your QR code.',
    },
    {
      q: 'Which download file format is best for printing on large banners?',
      a: 'For physical print (flyers, menus, billboards, vehicle wraps), we strongly recommend downloading in SVG (Scalable Vector Graphics). SVG files scale infinitely without losing sharpness or pixelating.',
    },
    {
      q: 'Is there any scan cap or bandwidth limit on free QR codes?',
      a: 'No, there are zero scan caps or scan throttling. Your QR codes can be scanned millions of times without interruption.',
    },
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-slate-50/60 dark:bg-slate-900/30">
      {/* FAQ JSON-LD Structured Data for Google SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQS.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          }))
        })}
      </script>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/60">
            Got Questions?
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need to know about creating, customizing, and printing your QR codes.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${
                  isOpen 
                    ? 'border-indigo-300 dark:border-indigo-800 shadow-md' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-hidden cursor-pointer"
                >
                  <span className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-indigo-600 dark:text-indigo-400' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
