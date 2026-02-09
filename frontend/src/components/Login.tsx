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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Simple mock validation
      if (password.length < 4) {
        setError("Password must be at least 4 characters");
        setLoading(false);
        return;
      }

      const mockUser = {
        email: email,
        name: email.split('@')[0] || "Clinician"
      };

      // Store auth state locally
      localStorage.setItem('authToken', 'mock-jwt-token-12345');
      localStorage.setItem('user', JSON.stringify(mockUser));

      onLoginSuccess(mockUser);
      setLoading(false);
    }, 800);
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
          <span>v2.5.0 (BioMistral-7B)</span>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-clinical-teal focus:border-transparent transition-all outline-none text-sm placeholder:text-slate-400"
                  placeholder="doctor@hospital.org"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <a href="#" className="text-xs text-clinical-teal hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-clinical-teal focus:border-transparent transition-all outline-none text-sm placeholder:text-slate-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-clinical-teal to-cyan-600 hover:from-clinical-teal-dark hover:to-cyan-700 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transform transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </span>
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 font-medium">
            Don't have an account?{' '}
            <button onClick={onSwitchToSignup} className="text-clinical-teal hover:underline cursor-pointer">
              Create an account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
