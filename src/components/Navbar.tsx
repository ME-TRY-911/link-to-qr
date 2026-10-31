import React, { useState, useEffect } from 'react';
import { QrCode, Sun, Moon, Menu, X, ArrowRight, Sparkles, User as UserIcon, LogOut, ChevronDown, ExternalLink } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  onOpenDashboard: () => void;
  onLogout: () => void;
  onScrollToGenerator: () => void;
  onOpenAboutUs?: () => void;
  onOpenPrivacyPolicy?: (tab?: 'privacy' | 'terms') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onOpenAuth, 
  onOpenDashboard, 
  onLogout,
  onScrollToGenerator,
  onOpenAboutUs,
  onOpenPrivacyPolicy
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check saved theme or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-nav border-b border-slate-200/80 dark:border-slate-800/80 shadow-xs py-3' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3.5 group">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-md p-0.5">
              <img 
                src="https://res.cloudinary.com/u7k7ngbi/image/upload/f_auto,q_auto/WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg" 
                alt="Link to QR Logo" 
                className="w-full h-full object-cover rounded-xl" 
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if image fails
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerHTML = '<svg class="w-7 h-7 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>';
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  Link to <span className="gradient-text">QR</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                  Free
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            <a href="#generator" onClick={onScrollToGenerator} className="px-3 py-2 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">
              Home
            </a>
            <a href="#features" className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg">
              Features
            </a>
            <a href="#how-it-works" className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg">
              How It Works
            </a>
            <a href="#use-cases" className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg">
              Use Cases
            </a>
            <a href="#pricing" className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg">
              Pricing
            </a>
            <a href="#faq" className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg">
              FAQ
            </a>
            <button 
              onClick={onOpenAboutUs}
              className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg cursor-pointer"
            >
              About Us
            </button>
            <button 
              onClick={() => onOpenPrivacyPolicy?.('privacy')}
              className="px-3 py-2 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg cursor-pointer"
            >
              Privacy
            </button>
            <a 
              href="https://textsnap-ai-ocr.onrender.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="px-3 py-1.5 text-xs font-bold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-all flex items-center gap-1.5 ml-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>TextSnap AI OCR</span>
              <ExternalLink className="w-3 h-3 text-indigo-400" />
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-hidden cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover bg-indigo-100"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-indigo-600 text-white text-[9px] font-extrabold uppercase">
                    PRO
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenDashboard();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 flex items-center gap-2 cursor-pointer"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-500" />
                      <span>My Account & Saved QRs</span>
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Sign In Button */}
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="text-sm font-semibold text-slate-600 dark:text-slate-300 px-4 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign In
                </button>

                {/* Sign Up Free Button */}
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <span>Sign Up Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-200 dark:border-slate-800 px-4 pt-4 pb-6 mt-3 space-y-3">
          <a
            href="#generator"
            onClick={() => { setMobileMenuOpen(false); onScrollToGenerator(); }}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home / Generator
          </a>
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            How It Works
          </a>
          <a
            href="#use-cases"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Use Cases
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            FAQ
          </a>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenAboutUs?.(); }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            About Us
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); onOpenPrivacyPolicy?.('privacy'); }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Privacy Policy
          </button>
          <a
            href="https://textsnap-ai-ocr.onrender.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>TextSnap AI OCR</span>
            </div>
            <ExternalLink className="w-4 h-4" />
          </a>
          
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenDashboard();
                  }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-xs flex items-center justify-center gap-2"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>My Account ({user.name})</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 rounded-full"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('signin'); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenAuth('signup'); }}
                  className="w-full text-center py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-full shadow-xs"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
