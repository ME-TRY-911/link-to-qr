import React, { useState } from 'react';
import { 
  X, ShieldCheck, FileText, Lock, Eye, Database, Cookie, 
  UserCheck, AlertCircle, Mail, CheckCircle2 
} from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  initialTab?: 'privacy' | 'terms';
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ 
  isOpen, 
  initialTab = 'privacy', 
  onClose 
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Legal & Compliance Center
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Last updated: July 2026 | Link to QR Governance Policy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-4 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Scrollable Document Area */}
        <div className="flex-1 overflow-y-auto pr-2 py-2 space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {activeTab === 'privacy' ? (
            /* PRIVACY POLICY CONTENT */
            <div className="space-y-6">
              
              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-indigo-950 dark:text-indigo-200">
                  <strong>Privacy Commitment:</strong> We respect your privacy. All basic QR code creations are generated 100% locally in your browser. We do not sell your personal data or store unauthenticated QR contents.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  1. Information We Collect
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  We collect minimal data required to provide a seamless user experience:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li><strong>Account Information:</strong> When you register via Email or Google Sign-In, we store your name, email address, and profile avatar via Firebase Authentication.</li>
                  <li><strong>Saved QR History:</strong> If you log in and choose to save a QR code, its metadata (title, target payload, styling settings) is encrypted and saved to your personal Cloud Firestore database.</li>
                  <li><strong>Unauthenticated Use:</strong> If you use Link to QR without logging in, your QR codes exist purely in your browser memory and are never uploaded to any server.</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-indigo-500" />
                  2. How We Use Your Information
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Your data is used strictly for:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Authenticating your account session and managing saved QR collections.</li>
                  <li>Providing dynamic QR code editing and scan analytics when enabled by you.</li>
                  <li>Improving app layout, performance, and cross-device compatibility.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Cookie className="w-4 h-4 text-indigo-500" />
                  3. Cookies & Local Storage
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Link to QR uses client-side LocalStorage exclusively to maintain your visual dark/light theme preference and remember your active login state. We do not use intrusive tracking cookies or cross-site tracking pixels.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-500" />
                  4. Data Security & Storage Rules
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Our database utilizes Firebase Firestore strict Security Rules, ensuring that user records can only be read or written by their authenticated owner (`request.auth.uid == userId`). All communication is transmitted over TLS 1.3 encrypted SSL connections.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-500" />
                  5. Your Rights & Data Deletion
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  You retain complete control over your data. You can delete individual saved QR codes from your User Dashboard at any time. To request full account and data erasure, contact us at <strong>privacy@linktoqr.in</strong>.
                </p>
              </div>

            </div>
          ) : (
            /* TERMS OF SERVICE CONTENT */
            <div className="space-y-6">

              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  By accessing or using Link to QR, you agree to be bound by these Terms of Service. If you do not agree to all terms, please refrain from using the platform.
                </p>
              </div>

              {/* Section 1 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  1. Acceptance & Fair Usage
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Link to QR provides free, unlimited static QR code generation and high-resolution SVG/PNG downloads. You are free to use generated QR codes for personal, commercial, non-profit, or marketing purposes without royalty fees or attribution requirements.
                </p>
              </div>

              {/* Section 2 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  2. Prohibited Conduct
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  You agree not to use Link to QR to generate QR codes linking to:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Phishing, malware, ransom software, or scam landing pages.</li>
                  <li>Illegal drugs, weapons, or hate speech content.</li>
                  <li>Automated bot spam or denial-of-service target endpoints.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  3. Disclaimer of Warranties
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  The service is provided on an "AS IS" and "AS AVAILABLE" basis. While we strive for 99.9% uptime and high error correction rates, Link to QR makes no warranties regarding uninterrupted availability or specific scan yields in physical print materials. Always test print samples before high-volume commercial production.
                </p>
              </div>

              {/* Section 4 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  4. Limitation of Liability
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  To the maximum extent permitted by applicable law, Link to QR shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
                </p>
              </div>

              {/* Section 5 */}
              <div className="space-y-2">
                <h4 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
                  5. Contact Information
                </h4>
                <p className="text-slate-600 dark:text-slate-400">
                  For legal inquiries or terms clarification, please email <strong>legal@linktoqr.in</strong>.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Compliant with GDPR & Google OAuth Security Standards</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
