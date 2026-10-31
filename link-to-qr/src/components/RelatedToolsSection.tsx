import React from 'react';
import { 
  Scan, Barcode, Link2, Share2, Image as ImageIcon, Wifi, 
  User, FileText, ArrowUpRight, Sparkles 
} from 'lucide-react';

interface RelatedToolsSectionProps {
  onOpenScanner: () => void;
  onScrollToGenerator: () => void;
}

export const RelatedToolsSection: React.FC<RelatedToolsSectionProps> = ({ 
  onOpenScanner, 
  onScrollToGenerator 
}) => {
  const TOOLS = [
    {
      id: 'textsnap-ocr',
      name: 'TextSnap AI OCR',
      description: 'Extract text from images, documents & photos instantly using AI.',
      icon: <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />,
      externalUrl: 'https://textsnap-ai-ocr.onrender.com/',
      badge: 'Featured AI Tool',
    },
    {
      id: 'scanner',
      name: 'QR Scanner',
      description: 'Scan QR codes using camera or image file upload.',
      icon: <Scan className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      action: onOpenScanner,
      badge: 'Interactive Tool',
    },
    {
      id: 'barcode',
      name: 'Barcode Generator',
      description: 'Generate EAN-13, UPC, Code 128 barcodes.',
      icon: <Barcode className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      action: onScrollToGenerator,
      badge: 'Popular',
    },
    {
      id: 'shortener',
      name: 'URL Shortener',
      description: 'Shorten long links into memorable bio URLs.',
      icon: <Link2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      action: onScrollToGenerator,
    },
    {
      id: 'linkinbio',
      name: 'Link in Bio',
      description: 'Combine all social media links into a single landing page.',
      icon: <Share2 className="w-5 h-5 text-pink-600 dark:text-pink-400" />,
      action: onScrollToGenerator,
    },
    {
      id: 'image2qr',
      name: 'Image to QR',
      description: 'Convert images, menus, and gallery photos to QR links.',
      icon: <ImageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      action: onScrollToGenerator,
    },
    {
      id: 'wifiqr',
      name: 'WiFi QR Generator',
      description: 'Share guest WiFi access without revealing raw passwords.',
      icon: <Wifi className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      action: onScrollToGenerator,
    },
    {
      id: 'vcardqr',
      name: 'vCard QR Maker',
      description: 'Create digital business card contact QR codes.',
      icon: <User className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
      action: onScrollToGenerator,
    },
    {
      id: 'pdfqr',
      name: 'PDF to QR',
      description: 'Upload PDF documents & menus directly to QR codes.',
      icon: <FileText className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
      action: onScrollToGenerator,
    },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
            Ecosystem
          </span>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
            Explore Related Utilities & Tools
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Everything you need for link management, scanning, and digital identity.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <a
              key={tool.id}
              href={tool.externalUrl || '#'}
              target={tool.externalUrl ? '_blank' : '_self'}
              rel={tool.externalUrl ? 'noopener noreferrer' : undefined}
              onClick={(e) => {
                if (!tool.externalUrl && tool.action) {
                  e.preventDefault();
                  tool.action();
                }
              }}
              className="glass-card rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-pointer group hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform">
                    {tool.icon}
                  </div>
                  {tool.badge && (
                    <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center justify-between">
                  <span>{tool.name}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
