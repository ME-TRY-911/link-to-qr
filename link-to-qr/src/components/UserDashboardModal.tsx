import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, ShieldCheck, QrCode, LogOut, Sparkles, Download, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { User } from '../types';
import { fetchUserSavedQrsFromFirestore, deleteSavedQrFromFirestore, FirestoreSavedQr, logoutFirebase } from '../lib/firebase';

interface UserDashboardModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
}

export const UserDashboardModal: React.FC<UserDashboardModalProps> = ({
  isOpen,
  user,
  onClose,
  onLogout,
}) => {
  const [savedQrs, setSavedQrs] = useState<FirestoreSavedQr[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      setLoading(true);
      fetchUserSavedQrsFromFirestore(user.id)
        .then((items) => {
          setSavedQrs(items);
        })
        .catch((err) => {
          console.error('Error loading saved QRs:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, user?.id]);

  if (!isOpen || !user) return null;

  const handleDelete = async (id: string) => {
    if (!user?.id) return;
    try {
      await deleteSavedQrFromFirestore(user.id, id);
      setSavedQrs((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error('Failed to delete QR:', err);
    }
  };

  const handleCopyPayload = (id: string, payload: string) => {
    navigator.clipboard.writeText(payload);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.name}
              className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border-2 border-indigo-500/30 object-cover"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">
                  {user.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" />
                  {user.plan}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email} • Member since {user.createdAt}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-6 space-y-6">
          
          {/* Account Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase text-slate-400">Saved Designs</span>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                {savedQrs.length} / ∞
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase text-slate-400">Monthly Scans</span>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                Unlimited
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase text-slate-400">Status</span>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-2">
                <ShieldCheck className="w-4 h-4" />
                Active Account
              </div>
            </div>
          </div>

          {/* Saved QR History Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-indigo-600" />
                <span>My Saved QR Codes</span>
              </h4>
              <span className="text-xs text-slate-400">{savedQrs.length} items</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Syncing saved QR codes from Firebase...</span>
              </div>
            ) : savedQrs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                No saved QR codes yet. Create a QR code on the main page to save it!
              </div>
            ) : (
              <div className="space-y-2">
                {savedQrs.map((qr) => (
                  <div
                    key={qr.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-800 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {qr.name}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                          {qr.type}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                        {qr.payload}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleCopyPayload(qr.id, qr.payload)}
                        className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {copiedId === qr.id ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        onClick={() => handleDelete(qr.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Delete saved QR"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer Logout Button */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Connected as {user.email}</span>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
};
