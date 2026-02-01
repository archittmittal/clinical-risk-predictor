import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Activity } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: { email: string; name: string }) => void;
  onSwitchToSignup: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Extract name from email for demo
      const name = email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1);

      onLoginSuccess({ email, name });
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-clinical-bg dark:bg-clinical-bg-dark">

      {/* Visual Side */}
      <div className="hidden lg:flex relative flex-col justify-center items-center p-12 bg-clinical-primary overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-clinical-primary via-slate-900 to-clinical-teal-dark opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-clinical-teal/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

        <div className="relative z-10 max-w-lg text-center text-white">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-clinical-teal to-cyan-500 shadow-neon flex items-center justify-center mb-6">
              <Activity size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-display font-bold mb-6 tracking-tight">
            Astra<span className="text-cyan-400">Med</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            The next generation of clinical risk prediction. Empowering clinicians with interpretable AI and SOTA ensemble models.
          </p>
        </div>

        {/* Footer info */}
        <div className="absolute bottom-8 text-slate-500 text-xs flex gap-6">
          <span>v2.4.0 (BioMistral-7B)</span>
          <span>HIPAA Compliant</span>
          <span>256-bit Encryption</span>
        </div>
      </div>

      {/* Login Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-8 animate-slide-up">

          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-slate-500 dark:text-slate-400">Sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="doc@hospital.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter password"
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-slate-300 text-clinical-teal focus:ring-clinical-teal" defaultChecked />
                <span className="text-slate-600 dark:text-slate-400 group-hover:text-clinical-teal transition-colors">Remember me</span>
              </label>
              <a href="#" className="font-semibold text-clinical-teal hover:text-clinical-teal-dark transition-colors">Forgot Password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-clinical-teal to-clinical-teal-dark hover:from-teal-500 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-clinical-teal/20 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-clinical-bg dark:bg-clinical-bg-dark px-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Or continue with</span>
            </div>
          </div>

          <p className="text-center text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="font-bold text-clinical-teal hover:underline decoration-2 underline-offset-4"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
