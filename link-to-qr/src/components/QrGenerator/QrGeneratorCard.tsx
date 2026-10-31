import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { 
  QrConfig, QrType, QrDotStyle, QrEyeStyle, QrFrameStyle, ErrorCorrectionLevel, User as UserType
} from '../../types';
import { generateQrPayload } from '../../utils/qrEncoder';
import { renderQrToCanvas, convertGoogleDriveUrl } from '../../utils/qrRenderer';
import { 
  saveDraftConfigCache, loadDraftConfigCache, saveToHistoryCache, 
  createQrCacheKey, getCachedQrDataUrl, setCachedQrDataUrl 
} from '../../utils/cacheManager';
import { BRAND_LOGO_DATA_URI } from '../../utils/brandLogoData';
import { TypeForms } from './TypeForms';
import { saveQrCodeToFirestore } from '../../lib/firebase';
import { 
  Link, AlignLeft, Wifi, Mail, Phone, MessageSquare, User, 
  Calendar, Smartphone, FileText, Download, Copy, 
  Palette, Image as ImageIcon, Sparkles, Check, 
  Eye, QrCode as QrIcon, ShieldCheck, Zap, Layers, Frame,
  Sliders, Square, Circle, LayoutGrid, Type, Bookmark, Loader2,
  ChevronDown, ChevronUp
} from 'lucide-react';

interface QrGeneratorCardProps {
  onOpenScanModal?: (qrData: string) => void;
  currentUser?: UserType | null;
  onOpenAuth?: (mode: 'signin' | 'signup') => void;
}

const TAB_ITEMS: { id: QrType; label: string; icon: React.ReactNode }[] = [
  { id: 'url', label: 'URL', icon: <Link className="w-3.5 h-3.5" /> },
  { id: 'text', label: 'Text', icon: <AlignLeft className="w-3.5 h-3.5" /> },
  { id: 'wifi', label: 'WiFi', icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: 'email', label: 'Email', icon: <Mail className="w-3.5 h-3.5" /> },
  { id: 'phone', label: 'Phone', icon: <Phone className="w-3.5 h-3.5" /> },
  { id: 'sms', label: 'SMS', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { id: 'vcard', label: 'vCard', icon: <User className="w-3.5 h-3.5" /> },
  { id: 'event', label: 'Event', icon: <Calendar className="w-3.5 h-3.5" /> },
  { id: 'appstore', label: 'App Store', icon: <Smartphone className="w-3.5 h-3.5" /> },
  { id: 'pdf', label: 'PDF', icon: <FileText className="w-3.5 h-3.5" /> },
];

const PRESET_FG_COLORS = [
  { name: 'Obsidian', hex: '#0f172a' },
  { name: 'Indigo', hex: '#4f46e5' },
  { name: 'Violet', hex: '#7c3aed' },
  { name: 'Ocean Blue', hex: '#0284c7' },
  { name: 'Emerald', hex: '#059669' },
  { name: 'Crimson', hex: '#dc2626' },
];

const PRESET_BG_COLORS = [
  { name: 'Pure White', hex: '#ffffff' },
  { name: 'Soft Gray', hex: '#f8fafc' },
  { name: 'Dark Slate', hex: '#0f172a' },
  { name: 'Midnight', hex: '#020617' },
];

const DOT_STYLES: { id: QrDotStyle; label: string; desc: string }[] = [
  { id: 'square', label: 'Square', desc: 'Classic' },
  { id: 'rounded', label: 'Rounded', desc: 'Smooth' },
  { id: 'dots', label: 'Dots', desc: 'Circles' },
  { id: 'classy', label: 'Classy', desc: 'Diamond' },
];

const EYE_STYLES: { id: QrEyeStyle; label: string; desc: string }[] = [
  { id: 'square', label: 'Square', desc: 'Sharp' },
  { id: 'rounded', label: 'Rounded', desc: 'Curved' },
  { id: 'circle', label: 'Circle', desc: 'Ring' },
  { id: 'leaf', label: 'Leaf', desc: 'Organic' },
];

const FRAME_STYLES: { id: QrFrameStyle; label: string }[] = [
  { id: 'none', label: 'No Frame' },
  { id: 'banner', label: 'Bottom Banner' },
  { id: 'badge', label: 'Top Badge' },
  { id: 'card', label: 'Card Border' },
];

const PRESET_THEMES = [
  {
    name: 'Classic Slate',
    config: { dotStyle: 'square' as QrDotStyle, eyeStyle: 'square' as QrEyeStyle, frameStyle: 'none' as QrFrameStyle, gradientFg: false, fgColor: '#0f172a', bgColor: '#ffffff', transparentBg: false }
  },
  {
    name: 'Modern Round',
    config: { dotStyle: 'rounded' as QrDotStyle, eyeStyle: 'rounded' as QrEyeStyle, frameStyle: 'none' as QrFrameStyle, gradientFg: false, fgColor: '#4f46e5', bgColor: '#ffffff', transparentBg: false }
  },
  {
    name: 'Neon Sunset',
    config: { dotStyle: 'dots' as QrDotStyle, eyeStyle: 'circle' as QrEyeStyle, frameStyle: 'banner' as QrFrameStyle, frameText: 'SCAN ME', gradientFg: true, fgColor: '#e11d48', fgColorEnd: '#7c3aed', bgColor: '#ffffff', transparentBg: false }
  },
  {
    name: 'Emerald Leaf',
    config: { dotStyle: 'classy' as QrDotStyle, eyeStyle: 'leaf' as QrEyeStyle, frameStyle: 'badge' as QrFrameStyle, frameText: 'SCAN HERE', gradientFg: true, fgColor: '#059669', fgColorEnd: '#0284c7', bgColor: '#ffffff', transparentBg: false }
  },
];

export const QrGeneratorCard: React.FC<QrGeneratorCardProps> = ({ onOpenScanModal, currentUser, onOpenAuth }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [savingToCloud, setSavingToCloud] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState<boolean>(false);

  const [config, setConfig] = useState<QrConfig>(() => {
    const cachedDraft = loadDraftConfigCache();
    if (cachedDraft) {
      return {
        ...cachedDraft,
        includeBranding: cachedDraft.includeBranding !== undefined ? cachedDraft.includeBranding : true,
      };
    }
    return {
      type: 'url',
      url: 'https://linktoqr.in',
      text: 'Welcome to Link to QR',
      wifi: { ssid: 'Guest_WiFi_5G', password: 'securepassword123', encryption: 'WPA', hidden: false },
      vcard: { firstName: '', lastName: '', organization: '', title: '', mobile: '', email: '', website: '', address: '' },
      email: { address: 'hello@linktoqr.in', subject: 'Inquiry from QR Code', body: 'Hi team, I would like to get more information...' },
      phone: '+1 555-019-2834',
      sms: { phone: '+1 555-019-2834', message: 'Hi! Let\'s connect.' },
      event: { title: 'SaaS Summit 2026', location: 'San Francisco, CA', startDate: '2026-09-15T09:00', endDate: '2026-09-15T17:00', description: 'Annual SaaS Conference' },
      appstore: { iosUrl: 'https://apps.apple.com/app/id123456789', androidUrl: 'https://play.google.com/store/apps/details?id=com.app' },
      pdfName: 'Company-Overview-2026.pdf',
      pdfUrl: 'https://linktoqr.in/doc/company-overview.pdf',
      // Customization & Styles
      dotStyle: 'rounded',
      eyeStyle: 'rounded',
      frameStyle: 'none',
      frameText: 'SCAN ME',
      gradientFg: false,
      fgColor: '#0f172a',
      fgColorEnd: '#6366f1',
      bgColor: '#ffffff',
      transparentBg: false,
      logo: null,
      errorCorrectionLevel: 'H',
      size: 1024,
      isDynamic: false,
      includeBranding: true,
    };
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const updateConfig = (updated: Partial<QrConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updated };
      saveDraftConfigCache(next);
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load tab from URL hash on mount & update SEO metadata on tab change
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') as QrType;
    const validTypes: QrType[] = ['url', 'text', 'wifi', 'email', 'phone', 'sms', 'vcard', 'event', 'appstore', 'pdf'];
    if (hash && validTypes.includes(hash)) {
      setConfig((prev) => ({ ...prev, type: hash }));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const titles: Record<QrType, string> = {
      url: 'Free Link & URL QR Code Generator with Logo | Link to QR',
      wifi: 'Free WiFi QR Code Generator with Password & Logo | Link to QR',
      vcard: 'Free vCard & Business Card QR Code Generator | Link to QR',
      email: 'Free Email QR Code Generator with Subject | Link to QR',
      phone: 'Free Phone Call QR Code Generator | Link to QR',
      sms: 'Free SMS Text Message QR Code Generator | Link to QR',
      event: 'Free Event & Calendar Invite QR Code Generator | Link to QR',
      appstore: 'Free App Store & Play Store QR Code Generator | Link to QR',
      pdf: 'Free PDF Document QR Code Generator with Logo | Link to QR',
      text: 'Free Plain Text QR Code Generator | Link to QR',
    };

    const descriptions: Record<QrType, string> = {
      url: 'Create custom URL QR codes for websites and links. Add your logo, colors, frames, and download in vector SVG or PNG.',
      wifi: 'Generate free WiFi QR codes. Share network SSID and password instantly without typing. Custom colors & vector SVG output.',
      vcard: 'Create digital business card QR codes (vCard). Share contact info, phone, email, and company details instantly.',
      email: 'Generate pre-filled email QR codes with recipient address, subject, and body text for instant email launching.',
      phone: 'Create click-to-call phone QR codes. Help customers dial your business number instantly with a single scan.',
      sms: 'Generate SMS QR codes with pre-filled phone numbers and custom text messages for easy mobile customer engagement.',
      event: 'Create event calendar QR codes. Let attendees add dates, locations, and descriptions directly to Google & Apple Calendar.',
      appstore: 'Create smart App Store QR codes that route iOS & Android users to download your mobile application.',
      pdf: 'Convert PDF documents into scannable QR codes. Share digital catalogs, menus, and guides easily.',
      text: 'Generate secure plain text QR codes for notes, keys, or instructions with customizable vector styling.',
    };

    document.title = titles[config.type] || 'Link to QR - Free Custom QR Code Generator with Logo & SVG';
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', descriptions[config.type] || 'Generate customizable, high-resolution QR codes for free.');
    }

    if (window.location.hash !== `#${config.type}`) {
      window.history.replaceState(null, '', `#${config.type}`);
    }
  }, [config.type]);

  // Generate QR Canvas with custom rendering engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const payload = generateQrPayload(config);
    renderQrToCanvas(canvasRef.current, payload, config, 600);

    // Preload brand logo and guarantee canvas refresh once decoded
    const brandImg = new Image();
    brandImg.onload = () => {
      if (canvasRef.current) {
        renderQrToCanvas(canvasRef.current, payload, config, 600);
      }
    };
    brandImg.src = BRAND_LOGO_DATA_URI;
  }, [config]);

  // File logo upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          updateConfig({ logo: evt.target.result as string });
          showToast('Custom logo applied successfully!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Handlers
  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#8b5cf6', '#d946ef', '#3b82f6'],
    });
  };

  const handleDownloadPng = async () => {
    const payload = generateQrPayload(config);
    const exportCanvas = document.createElement('canvas');
    await renderQrToCanvas(exportCanvas, payload, config, config.size);

    const dataUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `linktoqr-${config.type}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    // Cache generated QR in history cache
    saveToHistoryCache({
      title: `${config.type.toUpperCase()} QR Code`,
      type: config.type,
      dataUrl,
      payload,
      config,
    });

    triggerConfetti();
    showToast(
      config.includeBranding !== false
        ? `PNG Downloaded with Link to QR branding (${config.size}px)`
        : `PNG Downloaded (${config.size}x${config.size}px High Res)`
    );
  };

  const handleDownloadSvg = async () => {
    const payload = generateQrPayload(config);
    try {
      let svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        errorCorrectionLevel: config.errorCorrectionLevel,
        color: {
          dark: config.fgColor,
          light: config.transparentBg ? '#00000000' : config.bgColor,
        },
      });

      // Inject Link to QR website name & logo branding badge in SVG if includeBranding is true
      if (config.includeBranding !== false) {
        const vbMatch = svgString.match(/viewBox="0 0 ([0-9.]+) ([0-9.]+)"/);
        if (vbMatch) {
          const w = parseFloat(vbMatch[1]);
          const h = parseFloat(vbMatch[2]);
          const footerH = w * 0.22;
          const newH = h + footerH;
          svgString = svgString.replace(/viewBox="0 0 [0-9.]+ [0-9.]+"/, `viewBox="0 0 ${w} ${newH}"`);
          svgString = svgString.replace(new RegExp(`d="M0 0h${w}v${h}H0z"`), `d="M0 0h${w}v${newH}H0z"`);

          const isDarkBg = !config.transparentBg && config.bgColor && (
            config.bgColor.toLowerCase() === '#000000' ||
            config.bgColor.toLowerCase() === '#0f172a' ||
            config.bgColor.toLowerCase().startsWith('#1')
          );
          const pillFill = isDarkBg ? '#1e293b' : '#f8fafc';
          const pillBorder = isDarkBg ? '#334155' : '#e2e8f0';
          const titleColor = isDarkBg ? '#ffffff' : '#0f172a';
          const subColor = isDarkBg ? '#94a3b8' : '#64748b';

          const brandingSvg = `<g id="linktoqr-brand-footer" transform="translate(0, ${h})">
            <defs>
              <clipPath id="linktoqr-brand-logo-clip">
                <rect x="${(w * 0.08).toFixed(2)}" y="${(footerH * 0.23).toFixed(2)}" width="${(footerH * 0.55).toFixed(2)}" height="${(footerH * 0.55).toFixed(2)}" rx="${(footerH * 0.16).toFixed(2)}" />
              </clipPath>
            </defs>
            <rect x="${(w * 0.05).toFixed(2)}" y="${(footerH * 0.15).toFixed(2)}" width="${(w * 0.9).toFixed(2)}" height="${(footerH * 0.72).toFixed(2)}" rx="${(footerH * 0.22).toFixed(2)}" fill="${pillFill}" stroke="${pillBorder}" stroke-width="${(w * 0.005).toFixed(2)}" />
            <rect x="${(w * 0.08).toFixed(2)}" y="${(footerH * 0.23).toFixed(2)}" width="${(footerH * 0.55).toFixed(2)}" height="${(footerH * 0.55).toFixed(2)}" rx="${(footerH * 0.16).toFixed(2)}" fill="#ffffff" stroke="#6366f1" stroke-width="${(w * 0.004).toFixed(2)}" />
            <image href="${BRAND_LOGO_DATA_URI}" x="${(w * 0.08).toFixed(2)}" y="${(footerH * 0.23).toFixed(2)}" width="${(footerH * 0.55).toFixed(2)}" height="${(footerH * 0.55).toFixed(2)}" clip-path="url(#linktoqr-brand-logo-clip)" preserveAspectRatio="xMidYMid slice" />
            <text x="${(w * 0.08 + footerH * 0.75).toFixed(2)}" y="${(footerH * 0.48).toFixed(2)}" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="${(footerH * 0.25).toFixed(2)}" fill="${titleColor}">Link to <tspan fill="#6366f1">QR</tspan></text>
            <text x="${(w * 0.08 + footerH * 0.75).toFixed(2)}" y="${(footerH * 0.72).toFixed(2)}" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="${(footerH * 0.16).toFixed(2)}" fill="${subColor}">linktoqr.in • Free QR Code</text>
          </g></svg>`;
          svgString = svgString.replace('</svg>', brandingSvg);
        }
      }

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `linktoqr-${config.type}-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);

      triggerConfetti();
      showToast(
        config.includeBranding !== false
          ? 'Scalable Vector SVG Downloaded with Link to QR branding!'
          : 'Scalable Vector SVG Downloaded!'
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyImage = async () => {
    try {
      const payload = generateQrPayload(config);
      const exportCanvas = document.createElement('canvas');
      await renderQrToCanvas(exportCanvas, payload, config, 1024);

      exportCanvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          showToast('QR Code image copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        }
      });
    } catch (e) {
      showToast('Copied payload to clipboard!');
    }
  };

  const handleSaveToFirestore = async () => {
    if (!currentUser) {
      if (onOpenAuth) {
        onOpenAuth('signin');
      } else {
        showToast('Please sign in to save QR codes to your Firebase account.');
      }
      return;
    }

    setSavingToCloud(true);
    setSaveSuccess(false);

    try {
      const payload = generateQrPayload(config);
      const name = `${config.type.toUpperCase()} - ${new Date().toLocaleDateString()}`;
      await saveQrCodeToFirestore(currentUser.id, name, config.type, payload, config);
      setSaveSuccess(true);
      showToast('Saved to your Firebase account successfully!');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save to Firestore:', err);
      showToast('Failed to save QR code. Please try again.');
    } finally {
      setSavingToCloud(false);
    }
  };

  return (
    <div className="w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 text-sm font-medium animate-bounce">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Glass Generator Box */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-2xl sm:rounded-3xl lg:rounded-[32px] p-4 sm:p-6 lg:p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
        
        {/* Mobile Type Selector Section */}
        <div className="sm:hidden mb-5">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Select QR Type
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              10 Options
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-slate-100/70 dark:bg-slate-950/60 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            {TAB_ITEMS.map((tab) => {
              const isActive = config.type === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => updateConfig({ type: tab.id })}
                  className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-2 ring-indigo-500/30'
                      : 'bg-white dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/50'
                  }`}
                >
                  <span className={`p-0.5 rounded-lg ${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-[10px] font-bold tracking-tight truncate w-full text-center mt-0.5">
                    {tab.label === 'App Store' ? 'App' : tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop / Tablet Type Selector Row */}
        <div className="hidden sm:flex flex-wrap gap-2 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
          {TAB_ITEMS.map((tab) => {
            const isActive = config.type === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => updateConfig({ type: tab.id })}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 active:scale-98 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-500/20'
                    : 'text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-800/50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2-Column Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & Customization Panels (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Dynamic Payload Input Form */}
            <div className="bg-slate-50/70 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  1. Content Information
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold">
                  {TAB_ITEMS.find(t => t.id === config.type)?.label}
                </span>
              </div>
              
              <TypeForms config={config} onChange={updateConfig} />
            </div>

            {/* 2. Customization & Style Options (Collapsible) */}
            <div className="bg-slate-50/70 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all overflow-hidden shadow-xs">
              
              {/* Collapsible Header */}
              <div 
                onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
                className="w-full p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                      2. QR Style & Customization
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {isCustomizeOpen ? 'Click to hide style options' : 'Customize colors, logo, shapes & frames (Optional)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <span className="text-[10px] font-semibold text-slate-400">Presets:</span>
                    {PRESET_THEMES.map((theme) => (
                      <button
                        key={theme.name}
                        type="button"
                        onClick={() => updateConfig(theme.config)}
                        className="px-2 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 text-[11px] font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                      >
                        {theme.name}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs"
                    aria-label={isCustomizeOpen ? "Collapse customization options" : "Expand customization options"}
                  >
                    {isCustomizeOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Content */}
              {isCustomizeOpen && (
                <div className="p-5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-5">
                  {/* A. Dot Pattern Style Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Pattern Style (Dots)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DOT_STYLES.map((st) => {
                    const isSelected = config.dotStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateConfig({ dotStyle: st.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="font-bold text-xs">{st.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {st.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* B. Corner Finder Pattern (Eye Frame) Shape Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Square className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Corner Frame Shape (Eyes)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EYE_STYLES.map((st) => {
                    const isSelected = config.eyeStyle === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => updateConfig({ eyeStyle: st.id })}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        <div className="font-bold text-xs">{st.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {st.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* C. Frame & Banner Style */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Frame className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Call To Action Frame</span>
                  </span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                  {FRAME_STYLES.map((fst) => {
                    const isSelected = config.frameStyle === fst.id;
                    return (
                      <button
                        key={fst.id}
                        type="button"
                        onClick={() => updateConfig({ frameStyle: fst.id })}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer text-xs font-semibold ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                        }`}
                      >
                        {fst.label}
                      </button>
                    );
                  })}
                </div>

                {config.frameStyle !== 'none' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Type className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={config.frameText}
                      onChange={(e) => updateConfig({ frameText: e.target.value })}
                      placeholder="e.g. SCAN ME / CONNECT WIFI"
                      className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>
                )}
              </div>

              {/* D. Color & Gradient Picker */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Colors & Gradients</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    <input
                      type="checkbox"
                      checked={config.gradientFg}
                      onChange={(e) => updateConfig({ gradientFg: e.target.checked })}
                      className="rounded-sm border-slate-300 text-indigo-600"
                    />
                    <span>Gradient Mode</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Foreground Color */}
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                      {config.gradientFg ? 'Foreground Start Color' : 'Foreground Color'}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={config.fgColor}
                        onChange={(e) => updateConfig({ fgColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
                      />
                      <input
                        type="text"
                        value={config.fgColor}
                        onChange={(e) => updateConfig({ fgColor: e.target.value })}
                        className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono uppercase text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {PRESET_FG_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => updateConfig({ fgColor: c.hex })}
                          style={{ backgroundColor: c.hex }}
                          className="w-7 h-7 sm:w-6 sm:h-6 rounded-full border-2 border-white dark:border-slate-900 shadow-xs hover:scale-110 active:scale-95 transition-transform cursor-pointer shrink-0"
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Gradient End Color or Background Color */}
                  {config.gradientFg ? (
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                        Gradient End Color
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.fgColorEnd}
                          onChange={(e) => updateConfig({ fgColorEnd: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent"
                        />
                        <input
                          type="text"
                          value={config.fgColorEnd}
                          onChange={(e) => updateConfig({ fgColorEnd: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono uppercase text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          Background Color
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer text-[10px] font-semibold text-slate-500">
                          <input
                            type="checkbox"
                            checked={config.transparentBg}
                            onChange={(e) => updateConfig({ transparentBg: e.target.checked })}
                            className="rounded-sm border-slate-300 text-indigo-600"
                          />
                          <span>Transparent</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.bgColor}
                          onChange={(e) => updateConfig({ bgColor: e.target.value, transparentBg: false })}
                          disabled={config.transparentBg}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 dark:border-slate-700 bg-transparent disabled:opacity-40"
                        />
                        <input
                          type="text"
                          value={config.transparentBg ? 'TRANSPARENT' : config.bgColor}
                          onChange={(e) => updateConfig({ bgColor: e.target.value, transparentBg: false })}
                          disabled={config.transparentBg}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono uppercase text-slate-900 dark:text-white disabled:opacity-40"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* E. Brand Identity / Logo */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Brand Identity / Logo Overlay
                </label>

                {/* Google Drive or Image URL Input */}
                <div className="space-y-1">
                  <div className="relative flex items-center">
                    <input
                      type="url"
                      placeholder="Paste Image URL or Google Drive Share Link..."
                      value={config.logo || ''}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const converted = convertGoogleDriveUrl(raw);
                        updateConfig({ logo: converted || null });
                      }}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                    {config.logo && (
                      <button
                        type="button"
                        onClick={() => updateConfig({ logo: null })}
                        className="absolute right-2 px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Supports direct image links or Google Drive share links (set access to &quot;Anyone with the link&quot;).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100/60 cursor-pointer flex items-center gap-1.5 transition-colors">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Logo File</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>

                  <button
                    type="button"
                    onClick={() => updateConfig({ logo: 'https://res.cloudinary.com/u7k7ngbi/image/upload/f_auto,q_auto/WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg' })}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                      config.logo === 'https://res.cloudinary.com/u7k7ngbi/image/upload/f_auto,q_auto/WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                    }`}
                  >
                    <img src="https://res.cloudinary.com/u7k7ngbi/image/upload/f_auto,q_auto/WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg" alt="Link to QR Logo" className="w-4 h-4 object-cover rounded-xs" referrerPolicy="no-referrer" />
                    <span>Link to QR Logo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateConfig({ logo: null })}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                      !config.logo 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent' 
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    No Logo
                  </button>

                  <button
                    type="button"
                    onClick={() => updateConfig({ logo: 'https://api.iconify.design/lucide:qr-code.svg' })}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <QrIcon className="w-3.5 h-3.5 text-indigo-600" />
                    <span>QR Brand</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateConfig({ logo: 'https://api.iconify.design/lucide:wifi.svg' })}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Wifi className="w-3.5 h-3.5 text-blue-500" />
                    <span>WiFi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateConfig({ logo: 'https://api.iconify.design/lucide:globe.svg' })}
                    className="px-3 py-2 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Link className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Web</span>
                  </button>
                </div>

                {config.logo && (
                  <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Logo Size: {config.logoSizePercent || 22}%
                      </span>
                      <div className="flex gap-1">
                        {[18, 22, 28, 34].map((sizeVal) => (
                          <button
                            key={sizeVal}
                            type="button"
                            onClick={() => updateConfig({ logoSizePercent: sizeVal })}
                            className={`px-2 py-1 text-[10px] rounded-md font-medium border transition-colors cursor-pointer ${
                              (config.logoSizePercent || 22) === sizeVal
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800'
                            }`}
                          >
                            {sizeVal === 18 ? 'Small' : sizeVal === 22 ? 'Medium' : sizeVal === 28 ? 'Large' : 'XL'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="35"
                      step="1"
                      value={config.logoSizePercent || 22}
                      onChange={(e) => updateConfig({ logoSizePercent: parseInt(e.target.value, 10) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                        Badge Shape:
                      </span>
                      <div className="flex gap-1">
                        {[
                          { id: 'circle', label: 'Circle' },
                          { id: 'rounded', label: 'Rounded' },
                          { id: 'square', label: 'Square' },
                          { id: 'none', label: 'None' },
                        ].map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => updateConfig({ logoShape: s.id as any })}
                            className={`px-2 py-1 text-[10px] rounded-md font-medium border transition-colors cursor-pointer ${
                              (config.logoShape || 'rounded') === s.id
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800'
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* F. Error Correction & Resolution */}
              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Error Correction Level
                  </label>
                  <select
                    value={config.errorCorrectionLevel}
                    onChange={(e) => updateConfig({ errorCorrectionLevel: e.target.value as ErrorCorrectionLevel })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value="L">L - 7% Recovery</option>
                    <option value="M">M - 15% Recovery</option>
                    <option value="Q">Q - 25% Recovery</option>
                    <option value="H">H - 30% Recovery (Best)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Export Resolution
                  </label>
                  <select
                    value={config.size}
                    onChange={(e) => updateConfig({ size: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white"
                  >
                    <option value={256}>256 x 256 px</option>
                    <option value={512}>512 x 512 px</option>
                    <option value={1024}>1024 x 1024 px (4K)</option>
                    <option value={2048}>2048 x 2048 px (Print Vector)</option>
                  </select>
                </div>

                {/* Include Website Branding Default Note */}
                <div className="col-span-2 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src="/brand-logo.jpg" alt="Logo" className="w-4 h-4 rounded-xs object-cover" />
                    <div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                        Website Name & Logo Included (Default)
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        Automatically embeds &quot;Link to QR • linktoqr.in&quot; brand emblem on downloaded QR codes
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Always Included
                  </span>
                </div>
              </div>

              {/* Mobile Quick Jump to Live Preview Button */}
              <a
                href="#qr-preview-stage"
                className="lg:hidden w-full py-3 px-4 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center gap-2 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
              >
                <Eye className="w-4 h-4" />
                <span>Jump to Live Preview & Download</span>
              </a>

                </div>
              )}

            </div>

          </div>

          {/* Right Column: Live QR Preview & Export Actions (5 Cols) */}
          <div id="qr-preview-stage" className="lg:col-span-5 flex flex-col items-center sticky top-24 scroll-mt-20">
            
            {/* Live QR Stage Card */}
            <div className="w-full bg-slate-900 dark:bg-slate-950 p-5 sm:p-6 rounded-2xl sm:rounded-[24px] text-white flex flex-col items-center justify-center relative shadow-xl">
              
              <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Preview
              </div>

              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Copy QR Code Image"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* The Interactive Canvas Frame */}
              <div className="my-4 sm:my-5 w-52 h-52 sm:w-60 sm:h-60 bg-white rounded-2xl p-3 shadow-[0_0_30px_rgba(255,255,255,0.08)] flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-102"
                />
              </div>

              {/* QR Payload Summary Banner */}
              <div className="w-full bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/60 text-center mb-4">
                <p className="text-[11px] font-mono text-slate-300 truncate max-w-full">
                  {generateQrPayload(config)}
                </p>
              </div>

              {/* Primary Action Buttons */}
              <div className="w-full space-y-2.5">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG ({config.size}px)</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadSvg}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Download SVG</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenScanModal) {
                        onOpenScanModal(generateQrPayload(config));
                      } else {
                        showToast('QR Code tested! Scan ready.');
                      }
                    }}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>Test Scan</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSaveToFirestore}
                  disabled={savingToCloud}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500/60 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingToCloud ? (
                    <Loader2 className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                  ) : saveSuccess ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span>
                    {savingToCloud
                      ? 'Saving to Cloud...'
                      : saveSuccess
                      ? 'Saved to Cloud!'
                      : currentUser
                      ? 'Save to Firebase Account'
                      : 'Sign In to Save to Cloud'}
                  </span>
                </button>
              </div>

            </div>

            {/* Micro Feature Bullets */}
            <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                No Expiry
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                100% Free
              </span>
              <span>•</span>
              <span>High DPI Print Vector</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
