import React, { useState, useEffect } from 'react';
import { X, QrCode, Check, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { loginWithGoogle, loginWithEmail, signupWithEmail } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'signin' | 'signup';
  onClose: () => void;
  onLoginSuccess?: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  initialMode, 
  onClose,
  onLoginSuccess 
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setMode(initialMode);
    setErrorMsg(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleFinishAuth = (user: User) => {
    if (rememberMe) {
      localStorage.setItem('linktoqr_user', JSON.stringify(user));
    }
    setLoading(false);
    setSubmitted(true);

    if (onLoginSuccess) {
      onLoginSuccess(user);
    }

    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (mode === 'signup' && !name) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        const user = await signupWithEmail(email, password, name);
        handleFinishAuth(user);
      } else {
        const user = await loginWithEmail(email, password);
        handleFinishAuth(user);
      }
    } catch (err: any) {
      setLoading(false);
      console.error('Auth submit error:', err);
      const errCode = err?.code || '';
      let message = err?.message || 'Authentication failed. Please try again.';
      
      if (errCode === 'auth/unauthorized-domain') {
        const currentHost = window.location.hostname;
        message = `Domain "${currentHost}" is unauthorized in Firebase! Please add "${currentHost}", "linktoqr.in", and "www.linktoqr.in" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`;
      } else if (errCode === 'auth/operation-not-allowed') {
        message = 'Email/Password sign-in is not enabled in your Firebase Console (Authentication -> Sign-in method).';
      } else if (errCode === 'auth/user-not-found' || errCode === 'auth/wrong-password' || errCode === 'auth/invalid-credential') {
        message = 'Invalid email or password. Please check your credentials.';
      } else if (errCode === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please sign in instead.';
      } else if (errCode === 'auth/weak-password') {
        message = 'Password should be at least 6 characters long.';
      } else if (errCode === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (message.includes('auth/')) {
        message = message.replace('Firebase: Error (auth/', '').replace(').', '');
      }
      
      setErrorMsg(message);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const user = await loginWithGoogle();
      handleFinishAuth(user);
    } catch (err: any) {
      setLoading(false);
      console.error('Google Auth error:', err);
      const errCode = err?.code || '';
      if (
        errCode === 'auth/cancelled-popup-request' ||
        errCode === 'auth/popup-closed-by-user'
      ) {
        console.log('Google Sign-In popup request cancelled or closed.');
      } else if (errCode === 'auth/popup-blocked') {
        setErrorMsg('Popup was blocked by your browser. Please allow popups and try again.');
      } else if (errCode === 'auth/unauthorized-domain') {
        const currentHost = window.location.hostname;
        setErrorMsg(`Domain "${currentHost}" is unauthorized in Firebase! Please add "${currentHost}", "linktoqr.in", and "www.linktoqr.in" to Firebase Console -> Authentication -> Settings -> Authorized Domains.`);
      } else if (errCode === 'auth/operation-not-allowed') {
        setErrorMsg('Google Sign-in is not enabled in Firebase Console (Authentication -> Sign-in method).');
      } else {
        setErrorMsg(`Google Sign-In failed (${errCode || err.message}). Please check Firebase Console configuration.`);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md glass-card rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center shadow-md p-0.5 mx-auto mb-3">
            <img 
              src="https://res.cloudinary.com/u7k7ngbi/image/upload/f_auto,q_auto/WhatsApp_Image_2026-07-31_at_2.57.49_PM_yagerg" 
              alt="Link to QR Logo" 
              className="w-full h-full object-cover rounded-xl" 
              referrerPolicy="no-referrer"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                if (e.currentTarget.parentElement) {
                  e.currentTarget.parentElement.innerHTML = '<svg class="w-7 h-7 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg>';
                }
              }}
            />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-900 dark:text-white">
            {mode === 'signin' ? 'Welcome Back' : 'Create Free Account'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {mode === 'signin' ? 'Sign in to access saved QR designs & analytics' : 'Unlock dynamic QR code tracking & custom brand kits'}
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white">
              {mode === 'signin' ? 'Signed in successfully!' : 'Account created successfully!'}
            </h4>
            <p className="text-xs text-slate-500">Redirecting to dashboard...</p>
          </div>
        ) : (
          <div className="space-y-4">
            
            {/* Google Social Auth Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors flex items-center justify-center gap-2.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {/* Google Icon SVG */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="relative flex items-center my-2">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
              <span className="flex-shrink mx-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Or with Email
              </span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setErrorMsg('A password reset link has been sent to your email.')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded-sm border-slate-300 text-indigo-600"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Free Account'}</span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                {mode === 'signin' ? (
                  <p>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setErrorMsg(null); }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign up free
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setErrorMsg(null); }}
                      className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
