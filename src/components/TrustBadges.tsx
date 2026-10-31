import React from 'react';
import { ShieldCheck, Sparkles, Award, UserCheck, Lock, CheckCircle2 } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const BADGES = [
    {
      title: '100% Free',
      description: 'No hidden paywalls, subscription traps, or credit card requirements.',
      icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-500/10 border-purple-200 dark:border-purple-800/60',
    },
    {
      title: 'Secure & Private',
      description: 'Your links and data are processed instantly with zero data selling.',
      icon: <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-500/10 border-indigo-200 dark:border-indigo-800/60',
    },
    {
      title: 'High Quality',
      description: 'Vector SVG and 4K ultra high resolution printable downloads.',
      icon: <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      color: 'bg-blue-500/10 border-blue-200 dark:border-blue-800/60',
    },
    {
      title: 'No Signup Required',
      description: 'Create and download unlimited QR codes instantly without registering.',
      icon: <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800/60',
    },
  ];

  return (
    <section className="py-10 border-y border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-4 flex items-start gap-3.5 hover:shadow-md transition-all border border-slate-200/80 dark:border-slate-800/80"
            >
              <div className={`p-2.5 rounded-xl border ${badge.color} shrink-0`}>
                {badge.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  {badge.title}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
