import React, { useState } from 'react';
import { 
  QrCode, Send, Sparkles, CheckCircle2, 
  Instagram, Facebook, Youtube 
} from 'lucide-react';

interface FooterProps {
  onOpenSitemap?: () => void;
  onOpenAboutUs?: () => void;
  onOpenPrivacyPolicy?: (tab?: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenSitemap,
  onOpenAboutUs,
  onOpenPrivacyPolicy
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-12 border-b border-slate-900">
          
          {/* Col 1: Brand Info (2 cols wide on desktop) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/10 border border-indigo-700 flex items-center justify-center shadow-md p-0.5">
                <img 
                  src="https://res.cloudinary.com/u7k7ngbi/image/upload/f_auto,q_auto/WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg" 
                  alt="Link to QR Logo" 
                  className="w-full h-full object-cover rounded-xl" 
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.parentElement) {
                      e.currentTarget.parentElement.innerHTML = '<svg class="w-6 h-6 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>';
                    }
                  }}
                />
              </div>
              <span className="font-heading font-bold text-lg tracking-tight text-white">
                Link to <span className="gradient-text">QR</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The modern, ultra-fast QR Code Generator built for creators, businesses, and developers. Free forever with high-resolution SVG exports and custom branding.
            </p>

            {/* Trust Pill Strip */}
            <div className="flex flex-wrap gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                100% Free Forever
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                Secure & Private
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                SVG/PDF Support
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" className="p-2 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 text-slate-300 hover:text-white transition-all shadow-xs">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" className="p-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-slate-300 hover:text-white transition-all shadow-xs">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" title="YouTube" className="p-2 rounded-xl bg-slate-900 hover:bg-red-600 text-slate-300 hover:text-white transition-all shadow-xs">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Tools */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#generator" className="hover:text-white transition-colors">URL to QR Code</a></li>
              <li><a href="#generator" className="hover:text-white transition-colors">WiFi QR Code</a></li>
              <li><a href="#generator" className="hover:text-white transition-colors">vCard Contact QR</a></li>
              <li><a href="#generator" className="hover:text-white transition-colors">Email & SMS QR</a></li>
              <li><a href="#generator" className="hover:text-white transition-colors">PDF & Menu QR</a></li>
              <li><a href="#generator" className="hover:text-white transition-colors">Event Calendar QR</a></li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              AI & Partner Tools
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a 
                  href="https://textsnap-ai-ocr.onrender.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-indigo-400 font-bold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>TextSnap AI OCR</span>
                </a>
              </li>
              <li><a href="#scanner" className="hover:text-white transition-colors">QR Code Scanner</a></li>
              <li><a href="#generator" className="hover:text-white transition-colors">Barcode Generator</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Print Design Guide</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Vector SVG Tips</a></li>
            </ul>
          </div>

          {/* Col 4: Company & API */}
          <div>
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Company & API
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={onOpenAboutUs} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenAboutUs?.()} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Developer API
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPrivacyPolicy?.('privacy')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenPrivacyPolicy?.('terms')} 
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenSitemap}
                  className="hover:text-white transition-colors text-indigo-400 font-semibold cursor-pointer"
                >
                  XML Sitemap Directory
                </button>
              </li>
              <li>
                <a 
                  href="/sitemap.xml" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-slate-400"
                >
                  sitemap.xml (Google Bot)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="col-span-2 md:col-span-1 lg:col-span-1">
            <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider mb-4">
              Newsletter
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Get monthly updates on QR marketing trends and product features.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Subscribe</span>
                <Send className="w-3 h-3" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Subscribed successfully!
              </p>
            )}
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Link to QR. All rights reserved.</p>
          <p className="flex items-center gap-2 text-slate-400 font-medium">
            <span>⚡ Fast QR Generation</span>
            <span>•</span>
            <span>🔒 Privacy First</span>
            <span>•</span>
            <span>🌍 Accessible Anywhere</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
