import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { StatsSection } from './components/StatsSection';
import { FeaturesSection } from './components/FeaturesSection';
import { HowItWorks } from './components/HowItWorks';
import { UseCasesSection } from './components/UseCasesSection';
import { RelatedToolsSection } from './components/RelatedToolsSection';
import { SeoContentSection } from './components/SeoContentSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { UserDashboardModal } from './components/UserDashboardModal';
import { ScannerModal } from './components/ScannerModal';
import { SitemapModal } from './components/SitemapModal';
import { AboutUsModal } from './components/AboutUsModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdBanner } from './components/AdBanner';
import { User } from './types';
import { auth, syncUserProfile, logoutFirebase } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const [dashboardModalOpen, setDashboardModalOpen] = useState<boolean>(false);

  const [scannerModalOpen, setScannerModalOpen] = useState<boolean>(false);
  const [scannedQrData, setScannedQrData] = useState<string | null>(null);

  const [sitemapModalOpen, setSitemapModalOpen] = useState<boolean>(false);
  const [aboutModalOpen, setAboutModalOpen] = useState<boolean>(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [privacyTab, setPrivacyTab] = useState<'privacy' | 'terms'>('privacy');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const synced = await syncUserProfile(firebaseUser);
          setCurrentUser(synced);
          localStorage.setItem('linktoqr_user', JSON.stringify(synced));
        } catch (e) {
          console.error('Failed syncing user profile:', e);
        }
      } else {
        const savedUserStr = localStorage.getItem('linktoqr_user');
        if (savedUserStr) {
          try {
            setCurrentUser(JSON.parse(savedUserStr));
          } catch (err) {
            console.error('Failed parsing local session:', err);
          }
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Auto show login modal after 10 seconds if user is not logged in
  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyPrompted = sessionStorage.getItem('linktoqr_auth_prompted');
      const savedUser = localStorage.getItem('linktoqr_user');
      if (!currentUser && !savedUser && !alreadyPrompted) {
        setAuthMode('signin');
        setAuthModalOpen(true);
        sessionStorage.setItem('linktoqr_auth_prompted', 'true');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleOpenAuth = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logoutFirebase();
    localStorage.removeItem('linktoqr_user');
    setCurrentUser(null);
  };

  const handleOpenScanner = (qrData?: string) => {
    if (qrData) {
      setScannedQrData(qrData);
    }
    setScannerModalOpen(true);
  };

  const handleScrollToGenerator = () => {
    const el = document.getElementById('generator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white font-sans antialiased">
      
      {/* Navigation Header */}
      <Navbar
        user={currentUser}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={() => setDashboardModalOpen(true)}
        onLogout={handleLogout}
        onScrollToGenerator={handleScrollToGenerator}
        onOpenAboutUs={() => setAboutModalOpen(true)}
        onOpenPrivacyPolicy={(tab) => {
          setPrivacyTab(tab || 'privacy');
          setPrivacyModalOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section containing interactive QrGeneratorCard */}
        <HeroSection 
          onOpenScanModal={handleOpenScanner} 
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
        />

        {/* 100% Free / High Quality / Secure Badges */}
        <TrustBadges />

        {/* Statistics Counter Section */}
        <StatsSection />

        {/* Sponsored Monetization Slot */}
        <AdBanner slot="responsive" />

        {/* Features Glass Grid */}
        <FeaturesSection />

        {/* How It Works 3-Step Section */}
        <HowItWorks />

        {/* Use Cases Section */}
        <UseCasesSection />

        {/* Related Tools Ecosystem */}
        <RelatedToolsSection
          onOpenScanner={() => handleOpenScanner()}
          onScrollToGenerator={handleScrollToGenerator}
        />

        {/* Comprehensive SEO Knowledge Base & Guide */}
        <SeoContentSection />

        {/* FAQ Accordion Section */}
        <FaqSection />

        {/* Large CTA Banner */}
        <CtaBanner onScrollToGenerator={handleScrollToGenerator} />
      </main>

      {/* Dark Footer */}
      <Footer 
        onOpenSitemap={() => setSitemapModalOpen(true)} 
        onOpenAboutUs={() => setAboutModalOpen(true)}
        onOpenPrivacyPolicy={(tab) => {
          setPrivacyTab(tab || 'privacy');
          setPrivacyModalOpen(true);
        }}
      />

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <UserDashboardModal
        isOpen={dashboardModalOpen}
        user={currentUser}
        onClose={() => setDashboardModalOpen(false)}
        onLogout={handleLogout}
      />

      <ScannerModal
        isOpen={scannerModalOpen}
        scannedPayload={scannedQrData}
        onClose={() => setScannerModalOpen(false)}
      />

      <SitemapModal
        isOpen={sitemapModalOpen}
        onClose={() => setSitemapModalOpen(false)}
      />

      <AboutUsModal
        isOpen={aboutModalOpen}
        onClose={() => setAboutModalOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        initialTab={privacyTab}
        onClose={() => setPrivacyModalOpen(false)}
      />

    </div>
  );
}
