import { useState, useEffect } from 'react';
import PatientInputs from './components/PatientInputs';
import ClinicianDashboard from './components/ClinicianDashboard';
import AppShell from './components/layout/AppShell';
import Login from './components/Login';
import Signup from './components/Signup';
import AuditLog from './components/AuditLog'; // New
import { type PredictionResponse, type PredictionInput } from './api/client';
import { Activity, Stethoscope, LineChart, Brain } from 'lucide-react';

interface User {
  email: string;
  name: string;
  specialty?: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [view, setView] = useState<'dashboard' | 'logs'>('dashboard'); // New view state
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [patientData, setPatientData] = useState<PredictionInput | null>(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('clinicalRiskUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('clinicalRiskUser');
      }
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('clinicalRiskUser', JSON.stringify(userData));
  };

  const handleSignupSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('clinicalRiskUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setPredictionData(null);
    setPatientData(null);
    localStorage.removeItem('clinicalRiskUser');
  };

  const handlePredictionSuccess = (data: PredictionResponse, input: PredictionInput) => {
    setPredictionData(data);
    setPatientData(input);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    if (authMode === 'login') {
      return (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onSwitchToSignup={() => setAuthMode('signup')}
        />
      );
    } else {
      return (
        <Signup
          onSignupSuccess={handleSignupSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  // Show main app if authenticated
  return (
    <AppShell
      onLogout={handleLogout}
      user={user}
      currentView={view}
      onNavigate={(v) => setView(v === 'logs' ? 'logs' : 'dashboard')}
    >
      {view === 'logs' ? (
        <div className="max-w-5xl mx-auto">
          <AuditLog />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-[1600px] mx-auto pb-12">

          {/* Left Column: Input Form */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-clinical-teal flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-clinical-teal/10 text-clinical-teal">
                <Stethoscope size={24} strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">New Assessment</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enter patient vitals below to generate a multi-model risk profile.</p>
              </div>
            </div>
            <PatientInputs onPredictionSuccess={handlePredictionSuccess} />
          </div>

          {/* Right Column: Dashboard */}
          <div className="lg:col-span-8 xl:col-span-8">
            {predictionData ? (
              <ClinicianDashboard
                prediction={predictionData}
                patientInput={patientData!}
                onReset={() => { setPredictionData(null); setPatientData(null); }}
              />
            ) : (
              <div className="glass-panel min-h-[600px] h-full rounded-3xl p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">

                {/* Decorative Elements */}
                <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-800/50 [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-clinical-teal/10 to-cyan-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-clinical-teal/20 blur-xl rounded-full group-hover:bg-clinical-teal/30 transition-all duration-500"></div>
                    <div className="relative bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-glass ring-1 ring-white/50 dark:ring-white/10">
                      <Brain className="text-clinical-teal dark:text-teal-400 w-16 h-16" strokeWidth={1.5} />
                    </div>

                    {/* Floating Icons */}
                    <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg animate-bounce delay-100">
                      <Activity size={20} className="text-cyan-500" />
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg animate-bounce delay-300">
                      <LineChart size={20} className="text-indigo-500" />
                    </div>
                  </div>

                  <h3 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                    Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-teal to-cyan-500">Analysis</span>
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 max-w-lg text-lg leading-relaxed mb-10">
                    Our SOTA ensemble model combined with BioMistral-7B provides explainable risk predictions and digital twin simulations.
                  </p>

                  <div className="flex gap-4">
                    <div className="px-5 py-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      System Online
                    </div>
                    <div className="px-5 py-3 rounded-2xl bg-white/50 dark:bg-slate-800/50 border border-white/20 text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      v2.0 Models Loaded
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      )}
    </AppShell>
  );
}

export default App;
