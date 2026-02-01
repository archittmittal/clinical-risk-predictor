import React, { useState } from 'react';
import { Mail, Lock, Building2, Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

interface SignupProps {
  onSignupSuccess: (user: { email: string; name: string; specialty: string }) => void;
  onSwitchToLogin: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignupSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    hospital: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Valid email is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.specialty || !formData.hospital.trim()) {
      setError("Clinical details are required");
      return false;
    }
    return true;
  }

  const validateForm = () => {
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError('');
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSignupSuccess({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        specialty: formData.specialty,
      });
    } catch (err) {
      setError('Signup failed. Please try again.');
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
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

        <div className="relative z-10 max-w-lg text-center text-white">
          <h2 className="text-3xl font-display font-bold mb-6 tracking-tight">
            Join the <span className="text-cyan-400">Network</span>
          </h2>
          <p className="text-lg text-slate-300 leading-relaxed max-w-sm mx-auto">
            Get access to real-time risk stratification and predictive analytics for better patient outcomes.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h4 className="font-bold text-clinical-teal mb-1">State of the Art</h4>
              <p className="text-xs text-slate-400">Ensemble models combining XGBoost, CatBoost, and LightGBM.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <h4 className="font-bold text-clinical-teal mb-1">Explainable AI</h4>
              <p className="text-xs text-slate-400">SHAP values provided for every single prediction.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Form Side */}
      <div className="flex items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md space-y-6 animate-slide-up">

          <button
            onClick={onSwitchToLogin}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-clinical-teal transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back to Login
          </button>

          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">Create Account</h2>
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-clinical-teal' : 'w-4 bg-slate-200 dark:bg-slate-700'}`}></div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">First Name</label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Last Name</label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="doctor@hospital.org"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                      autoFocus
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Specialty</label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Specialty...</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="endocrinology">Endocrinology</option>
                    <option value="nephrology">Nephrology</option>
                    <option value="general">General Medicine</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Hospital / Institution</label>
                  <div className="relative group">
                    <Building2 className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors" size={20} />
                    <input
                      type="text"
                      name="hospital"
                      value={formData.hospital}
                      onChange={handleInputChange}
                      placeholder="General Hospital"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Min 8 characters"
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Confirm Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors" size={20} />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Repeat password"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
              </div>
            )}

            <div className="pt-2">
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold rounded-xl shadow-lg transform active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-clinical-teal to-clinical-teal-dark hover:from-teal-500 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-clinical-teal/20 transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
