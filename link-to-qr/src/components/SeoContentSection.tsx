import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Smartphone, 
  Wifi, 
  Contact, 
  FileText, 
  Share2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Printer,
  QrCode
} from 'lucide-react';

export const SeoContentSection: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <section id="qr-guide" className="py-16 bg-slate-900 text-slate-100 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Badge & Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>Complete Guide & Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
            Everything You Need to Know About <span className="text-indigo-400">Custom QR Codes</span>
          </h2>
          <p className="mt-3 text-slate-400 text-base sm:text-lg leading-relaxed">
            Learn how to generate high-resolution, branded vector QR codes for free with logos, custom colors, and error-correction reliability.
          </p>
        </div>

        {/* Content Body Container */}
        <div className="bg-slate-800/60 rounded-2xl border border-slate-700/80 p-6 sm:p-10 shadow-xl space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          
          {/* Section 1: What is a QR Code */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                What is a QR Code and How Does it Work?
              </h3>
            </div>
            <p>
              A <strong>Quick Response (QR) Code</strong> is a two-dimensional matrix barcode invented in 1994 by Denso Wave. Unlike standard linear barcodes that store data in one dimension (up to 20 digits), a QR code stores data in both vertical and horizontal dimensions. This allows a single QR code to hold over 4,000 characters of text, including website URLs, contact info, Wi-Fi credentials, digital business cards (vCards), payment links, and document attachments.
            </p>
            <p>
              When a smartphone camera or dedicated QR code scanner reads a code, built-in optical software detects three prominent square positioning patterns located at the corners. The scanner aligns the grid, decodes the pixel modules, applies built-in Reed-Solomon error correction, and immediately performs the designated action—such as opening a web browser or connecting to a local Wi-Fi network—without requiring manual input.
            </p>
          </div>

          {/* URL to QR Code Section */}
          <div className="space-y-4 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <QrCode className="w-5 h-5" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                URL to QR Code Generator
              </h3>
            </div>

            <p>
              Convert any website URL or link into a QR code in seconds. A URL QR code
              lets people open a website, landing page, online store, social profile,
              or other web link by simply scanning the code with their smartphone.
            </p>

            <h4 className="text-lg font-bold text-white font-heading">
              How to Convert a URL to a QR Code
            </h4>

            <ol className="list-decimal pl-5 space-y-2">
              <li>Enter your website URL or link into the URL QR code generator.</li>
              <li>Customize the QR code with your preferred style, color, or logo.</li>
              <li>Generate the QR code.</li>
              <li>Download and use your QR code online or in print.</li>
            </ol>

            <h4 className="text-lg font-bold text-white font-heading">
              Create a QR Code for Any Link
            </h4>

            <p>
              You can create a QR code for websites, landing pages, online stores,
              social media profiles, portfolios, event pages, menus, and other
              publicly accessible links.
            </p>
          </div>

          {/* Section 2: Why Choose Link to QR */}
          <div className="space-y-4 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Why Choose Link to QR as Your Primary Custom QR Code Generator?
              </h3>
            </div>
            <p>
              Many online QR code generators place artificial limits on free accounts, force users to sign up, or redirect links through paid third-party servers that break after a trial period. <strong>Link to QR (linktoqr.in)</strong> provides a completely free, privacy-first, client-side QR generator engineered for business owners, marketers, designers, and event organizers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free & Unlimited Scans</span>
                </div>
                <p className="text-xs text-slate-400">
                  Generate as many static QR codes as you need. No hidden fees, subscriptions, or scan limits ever applied.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>High-Res SVG Vector Download</span>
                </div>
                <p className="text-xs text-slate-400">
                  Export vector SVG files for infinite scale printing on billboards, packaging, and signages without quality loss.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/60">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Custom Logo & Brand Colors</span>
                </div>
                <p className="text-xs text-slate-400">
                  Upload your own brand logo or pick from popular presets (WhatsApp, Instagram, WiFi, Google Reviews) with custom eye styles.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Detailed Use Cases */}
          <div className="space-y-6 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Popular QR Code Types & Use Cases
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Website & Landing Pages */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <h4>1. Website URL & Landing Page QR Codes</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Direct users instantly to your official website, e-commerce store, promotional landing page, or online portfolio. Eliminate manual address typing errors and boost conversion rates from print marketing materials like flyers, posters, and business cards.
                </p>
              </div>

              {/* Card 2: WiFi QR Codes */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <h4>2. WiFi Access QR Codes</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Allow café guests, hotel visitors, and office clients to join your Wi-Fi network instantly without typing complex passwords. Encrypts network SSID, authentication mode (WPA/WPA2/WPA3), and password securely into a scannable graphic.
                </p>
              </div>

              {/* Card 3: vCard Digital Business Cards */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Contact className="w-4 h-4 text-purple-400" />
                  <h4>3. Digital Business Card (vCard Plus) QR Codes</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Share full contact details including full name, phone number, email address, job title, company name, address, and website in a standardized vCard format. Scanning prompts smartphone operating systems to add the contact immediately to phonebooks.
                </p>
              </div>

              {/* Card 4: PDF & Document QR Codes */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <h4>4. Restaurant Menus & PDF Document QR Codes</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Ideal for restaurants, hotels, schools, and corporate events. Connect users directly to digital food menus, product catalogs, user manuals, event brochures, and downloadable PDF reports without paper printing costs.
                </p>
              </div>

              {/* Card 5: App Store QR Codes */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Share2 className="w-4 h-4 text-rose-400" />
                  <h4>5. Mobile App Store Download Links</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Consolidate Apple App Store and Google Play Store links into a single smart QR code. When scanned, it routes iOS users to the App Store and Android users directly to Google Play for frictionless app installation.
                </p>
              </div>

              {/* Card 6: WhatsApp & Social Media QR Codes */}
              <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-700/70 space-y-2">
                <div className="flex items-center gap-2 text-white font-semibold text-base">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <h4>6. WhatsApp Direct Chat & Social Media QR Codes</h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  Allow customers to open a pre-filled WhatsApp conversation with your customer support or sales team with a single scan. Works seamlessly for Instagram profiles, YouTube channels, LinkedIn pages, and Facebook business pages.
                </p>
              </div>

            </div>
          </div>

          {/* Section 4: Printing Best Practices */}
          <div className="space-y-4 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30">
                <Printer className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Best Practices for Printing and High-Scannability Custom QR Codes
              </h3>
            </div>

            <ul className="space-y-3 list-none pl-0">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Maintain High Color Contrast:</strong> Always use a dark foreground pattern on a light background (e.g., black or dark blue pattern on a crisp white background). Reversing colors (light dots on a dark background) can fail on older camera scanners.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Always Respect Quiet Zones:</strong> Leave a clear border margin (at least 4 modules wide) around the outside edges of your QR code so scanner cameras can easily isolate the barcode from surrounding graphic elements.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Use SVG Vector Format for Large Prints:</strong> When printing on banners, T-shirts, packaging, or vehicles, download the <code>SVG vector</code> format. Vector files scale infinitely without pixelation or blurriness.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Test Across Multiple Mobile Devices:</strong> Always scan your final generated QR code using both iOS Camera and Android devices before launching print runs or publishing campaigns.
                </div>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
