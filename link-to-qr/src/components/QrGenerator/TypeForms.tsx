import React from 'react';
import { QrConfig, QrType } from '../../types';
import { 
  Link, AlignLeft, Wifi, Mail, Phone, MessageSquare, 
  User, Calendar, Smartphone, FileText, Upload, Sparkles, Check
} from 'lucide-react';

interface TypeFormsProps {
  config: QrConfig;
  onChange: (updated: Partial<QrConfig>) => void;
}

export const TypeForms: React.FC<TypeFormsProps> = ({ config, onChange }) => {
  const { type } = config;

  switch (type) {
    case 'url': {
      const getFaviconUrl = () => {
        try {
          const raw = config.url.trim();
          if (!raw) return null;
          const formatted = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
          const urlObj = new URL(formatted);
          return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
        } catch {
          return null;
        }
      };
      const faviconUrl = getFaviconUrl();

      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Target Website or URL
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Link className="w-4 h-4" />
            </div>
            <input
              type="url"
              value={config.url}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://yourwebsite.com or link..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono"
            />
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs gap-2 pt-1">
            <span className="text-slate-500">Supports HTTP, HTTPS, deep links & social profiles</span>
            {faviconUrl && (
              <button
                type="button"
                onClick={() => onChange({ logo: faviconUrl, errorCorrectionLevel: 'H' })}
                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200/80 dark:border-indigo-800"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Auto-Add Site Logo to QR</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    case 'text':
      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Plain Text Message or Notes
          </label>
          <div className="relative">
            <textarea
              rows={4}
              value={config.text}
              onChange={(e) => onChange({ text: e.target.value })}
              placeholder="Enter your message, passcodes, instructions, or notes..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>
          <div className="text-xs text-slate-500 text-right">
            {config.text.length} characters
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Network Name (SSID)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Wifi className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={config.wifi.ssid}
                onChange={(e) => onChange({ wifi: { ...config.wifi, ssid: e.target.value } })}
                placeholder="e.g. Guest_WiFi_5G"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="text"
                value={config.wifi.password}
                onChange={(e) => onChange({ wifi: { ...config.wifi, password: e.target.value } })}
                placeholder="WiFi Password"
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Encryption Type
              </label>
              <select
                value={config.wifi.encryption}
                onChange={(e) => onChange({ wifi: { ...config.wifi, encryption: e.target.value as any } })}
                className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              >
                <option value="WPA">WPA/WPA2/WPA3 (Recommended)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 pt-1 min-h-[40px]">
            <input
              type="checkbox"
              checked={config.wifi.hidden}
              onChange={(e) => onChange({ wifi: { ...config.wifi, hidden: e.target.checked } })}
              className="w-4 h-4 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Hidden SSID Network</span>
          </label>
        </div>
      );

    case 'email':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Recipient Email Address
            </label>
            <input
              type="email"
              value={config.email.address}
              onChange={(e) => onChange({ email: { ...config.email, address: e.target.value } })}
              placeholder="support@company.com"
              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pre-filled Subject
            </label>
            <input
              type="text"
              value={config.email.subject}
              onChange={(e) => onChange({ email: { ...config.email, subject: e.target.value } })}
              placeholder="Inquiry about Product Services"
              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Email Body Message
            </label>
            <textarea
              rows={2}
              value={config.email.body}
              onChange={(e) => onChange({ email: { ...config.email, body: e.target.value } })}
              placeholder="Hi team, I would like to learn more..."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      );

    case 'phone':
      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            Phone Number (with Country Code)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Phone className="w-4 h-4" />
            </div>
            <input
              type="tel"
              value={config.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="+1 (555) 019-2834"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <p className="text-xs text-slate-500">Scanning dials this phone number directly on smartphone devices.</p>
        </div>
      );

    case 'sms':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Recipient Phone Number
            </label>
            <input
              type="tel"
              value={config.sms.phone}
              onChange={(e) => onChange({ sms: { ...config.sms, phone: e.target.value } })}
              placeholder="+1 (555) 019-2834"
              className="w-full px-3.5 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pre-filled Text Message
            </label>
            <textarea
              rows={2}
              value={config.sms.message}
              onChange={(e) => onChange({ sms: { ...config.sms, message: e.target.value } })}
              placeholder="Hi! Please RSVP me for the launch party."
              className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        </div>
      );

    case 'vcard':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                First Name
              </label>
              <input
                type="text"
                value={config.vcard.firstName}
                onChange={(e) => onChange({ vcard: { ...config.vcard, firstName: e.target.value } })}
                placeholder="Sarah"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={config.vcard.lastName}
                onChange={(e) => onChange({ vcard: { ...config.vcard, lastName: e.target.value } })}
                placeholder="Connor"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Organization / Company
              </label>
              <input
                type="text"
                value={config.vcard.organization}
                onChange={(e) => onChange({ vcard: { ...config.vcard, organization: e.target.value } })}
                placeholder="Acme Corp"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={config.vcard.title}
                onChange={(e) => onChange({ vcard: { ...config.vcard, title: e.target.value } })}
                placeholder="Head of Product"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={config.vcard.mobile}
                onChange={(e) => onChange({ vcard: { ...config.vcard, mobile: e.target.value } })}
                placeholder="+1 555-019-2834"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                value={config.vcard.email}
                onChange={(e) => onChange({ vcard: { ...config.vcard, email: e.target.value } })}
                placeholder="sarah@acme.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={config.vcard.website || ''}
                onChange={(e) => onChange({ vcard: { ...config.vcard, website: e.target.value } })}
                placeholder="https://acme.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Street Address / Location
              </label>
              <input
                type="text"
                value={config.vcard.address || ''}
                onChange={(e) => onChange({ vcard: { ...config.vcard, address: e.target.value } })}
                placeholder="San Francisco, CA"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>
      );

    case 'event':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Event Title
            </label>
            <input
              type="text"
              value={config.event.title}
              onChange={(e) => onChange({ event: { ...config.event, title: e.target.value } })}
              placeholder="Product Launch Keynote 2026"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Location / Venue
            </label>
            <input
              type="text"
              value={config.event.location}
              onChange={(e) => onChange({ event: { ...config.event, location: e.target.value } })}
              placeholder="San Francisco Convention Center / Online"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                Start Date/Time
              </label>
              <input
                type="datetime-local"
                value={config.event.startDate}
                onChange={(e) => onChange({ event: { ...config.event, startDate: e.target.value } })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
                End Date/Time
              </label>
              <input
                type="datetime-local"
                value={config.event.endDate}
                onChange={(e) => onChange({ event: { ...config.event, endDate: e.target.value } })}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>
      );

    case 'appstore':
      return (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Apple App Store Link
            </label>
            <input
              type="url"
              value={config.appstore.iosUrl}
              onChange={(e) => onChange({ appstore: { ...config.appstore, iosUrl: e.target.value } })}
              placeholder="https://apps.apple.com/app/id..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1">
              Google Play Store Link
            </label>
            <input
              type="url"
              value={config.appstore.androidUrl}
              onChange={(e) => onChange({ appstore: { ...config.appstore, androidUrl: e.target.value } })}
              placeholder="https://play.google.com/store/apps/details?id=..."
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>
        </div>
      );

    case 'pdf':
      return (
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
            PDF Document Link or Upload
          </label>
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50">
            <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drag & Drop your PDF file here, or click to browse
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Max size 25MB • Hosted securely on Link to QR CDN
            </p>
          </div>
          <div className="relative">
            <input
              type="url"
              value={config.pdfUrl}
              onChange={(e) => onChange({ pdfUrl: e.target.value })}
              placeholder="Or enter existing PDF URL (e.g. https://domain.com/menu.pdf)"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base sm:text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 font-mono"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};

