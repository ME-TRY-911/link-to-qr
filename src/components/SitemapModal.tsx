import React, { useState } from 'react';
import { X, Globe, Copy, Check, Download, ExternalLink, Code2, Search, FileCode } from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SITEMAP_URLS = [
  { loc: 'https://linktoqr.in/', title: 'Homepage & Core Generator', priority: '1.0', changefreq: 'daily', type: 'Main' },
  { loc: 'https://linktoqr.in/#url', title: 'URL & Website QR Generator', priority: '0.9', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#wifi', title: 'WiFi Network QR Generator', priority: '0.9', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#vcard', title: 'vCard Digital Business Card QR', priority: '0.9', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#text', title: 'Plain Text QR Generator', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#email', title: 'Email QR Generator with Subject', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#phone', title: 'Click-to-Call Phone Number QR', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#sms', title: 'SMS Message QR Generator', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#event', title: 'iCal Meeting & Event QR', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#appstore', title: 'App Store & Play Store QR', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#pdf', title: 'PDF & Document Sharing QR', priority: '0.8', changefreq: 'weekly', type: 'Tool' },
  { loc: 'https://linktoqr.in/#scanner', title: 'Camera QR Code Scanner', priority: '0.7', changefreq: 'monthly', type: 'Utility' },
  { loc: 'https://linktoqr.in/#features', title: 'Vector SVG Customization Features', priority: '0.7', changefreq: 'monthly', type: 'Info' },
  { loc: 'https://linktoqr.in/#use-cases', title: 'Industry Use Cases & Spotlight', priority: '0.7', changefreq: 'monthly', type: 'Info' },
  { loc: 'https://linktoqr.in/#qr-guide', title: 'Complete QR Code SEO Guide', priority: '0.8', changefreq: 'weekly', type: 'Guide' },
  { loc: 'https://linktoqr.in/#faq', title: 'FAQ & SEO Knowledge Base', priority: '0.6', changefreq: 'monthly', type: 'Info' },
];

export const SitemapModal: React.FC<SitemapModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'xml'>('visual');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_URLS.map(
  u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
).join('\n')}
</urlset>`;

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadXml = () => {
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'sitemap.xml';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
                Sitemap & Search Engine Index
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                SEO XML Sitemap generator & crawler index directory for Link to QR
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Visual Directory ({SITEMAP_URLS.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('xml')}
              className={`flex-1 sm:flex-initial px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'xml'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>XML Source</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyXml}
              className="flex-1 sm:flex-initial px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy XML'}</span>
            </button>

            <button
              onClick={handleDownloadXml}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .xml</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          {activeTab === 'visual' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SITEMAP_URLS.map((url, idx) => (
                <a
                  key={idx}
                  href={url.loc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {url.title}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                        {url.type}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-400 truncate">
                      {url.loc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                      P: {url.priority}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <pre className="p-4 bg-slate-900 text-indigo-300 font-mono text-xs rounded-2xl overflow-x-auto border border-slate-800 leading-relaxed select-all">
              {xmlContent}
            </pre>
          )}
        </div>

        {/* Footer info box */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-indigo-500" />
            <span>Submit this sitemap to <strong>Google Search Console</strong> to speed up indexing.</span>
          </div>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
          >
            <span>Google Search Console</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
