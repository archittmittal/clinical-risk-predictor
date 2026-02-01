import { useState, useEffect } from 'react';
import PatientInputs from './components/PatientInputs';
import CentralHub from './components/dashboard/CentralHub';
import AnalysisRail from './components/dashboard/AnalysisRail';
import AppShell from './components/layout/AppShell';
import Login from './components/Login';
import Signup from './components/Signup';
import AuditLog from './components/AuditLog';
import StoryPage from './components/StoryPage';
import GlobalBackground from './components/GlobalBackground';
import { type PredictionResponse, type PredictionInput } from './api/client';
import { Stethoscope, Brain, Activity, LineChart } from 'lucide-react';
import DigitalTwinModel from './components/DigitalTwinModel';

interface User {
  email: string;
  name: string;
  specialty?: string;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [view, setView] = useState<'dashboard' | 'logs'>('dashboard');
  const [showIntro, setShowIntro] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [patientData, setPatientData] = useState<PredictionInput | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);

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
    setShowIntro(true);
    localStorage.setItem('clinicalRiskUser', JSON.stringify(userData));
  };

  const handleSignupSuccess = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowIntro(true);
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

  return (
    <div className="relative w-full min-h-screen">
      <GlobalBackground
        mode={showIntro ? 'story' : 'dashboard'}
        slideIndex={slideIndex}
      />

      <div className="relative z-10">
        {showIntro ? (
          <StoryPage
            onComplete={() => setShowIntro(false)}
            onSlideChange={setSlideIndex}
          />
        ) : (
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
              // Main Dashboard Grid - Symmetrical 3-Column Layout (3 | 6 | 3)
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-[1800px] mx-auto pb-12 px-4 md:px-6">

                {/* Left Pillar: Input Form (Span 3) */}
                <div className="lg:col-span-3 space-y-6">
                  <div className="glass-panel p-6 rounded-3xl border-l-4 border-l-clinical-teal flex items-start gap-4 shadow-glass dark:shadow-glass-dark">
                    <div className="p-3 rounded-2xl bg-clinical-teal/10 text-clinical-teal">
                      <Stethoscope size={24} strokeWidth={2} />
                    </div>
                    <div>
                      <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Assessment</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">Enter vitals to generate risk profile.</p>
                    </div>
                  </div>
                  <PatientInputs onPredictionSuccess={handlePredictionSuccess} />
                </div>

                {/* Central Spire: Hero Hub or Placeholder (Span 6) */}
                <div className="lg:col-span-6 h-full min-h-[800px]">
                  {predictionData && patientData ? (
                    <CentralHub
                      prediction={predictionData}
                      patientInput={patientData}
                    />
                  ) : (
                    // HERO Placeholder
                    <div className="glass-panel h-full rounded-3xl p-0 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-900/40 dark:to-slate-900/10 border border-white/20 shadow-glass-lg">
                      {/* 3D Digital Twin Model */}
                      <div className="absolute inset-0 z-0 opacity-80">
                        <DigitalTwinModel />
                      </div>

                      <div className="relative z-10 flex flex-col items-center pointer-events-none mt-40">
                        <div className="relative mb-6">
                          <div className="relative bg-white/10 dark:bg-slate-900/30 p-6 rounded-2xl backdrop-blur-md shadow-glass ring-1 ring-white/20">
                            <Brain className="text-clinical-teal dark:text-teal-400 w-12 h-12" strokeWidth={1.5} />
                          </div>
                        </div>

                        <h3 className="text-3xl font-display font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                          Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-teal to-cyan-500">Analysis</span>
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 max-w-md text-base leading-relaxed mb-8 px-4">
                          SOTA ensemble model • BioMistral-7B • Digital Twin
                        </p>

                        <div className="flex gap-4">
                          <div className="px-4 py-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 backdrop-blur-sm shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            System Online
                          </div>
                          <div className="px-4 py-2 rounded-xl bg-white/40 dark:bg-slate-800/40 border border-white/20 text-xs font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 backdrop-blur-sm shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            v3.0 Core
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Pillar: Analysis Rail or Placeholder (Span 3) */}
                <div className="lg:col-span-3 h-full">
                  {predictionData && patientData ? (
                    <AnalysisRail prediction={predictionData} patientInput={patientData} />
                  ) : (
                    // Skeleton / Info Placeholder
                    <div className="space-y-6 h-full flex flex-col">
                      {/* Skeleton 1 */}
                      <div className="glass-panel p-6 rounded-3xl h-[200px] border border-white/10 flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <Activity className="mb-2 text-slate-300" />
                        <span className="text-xs font-bold uppercase tracking-widest">Waiting for Data</span>
                      </div>

                      {/* Skeleton 2 */}
                      <div className="glass-panel p-6 rounded-3xl flex-1 border border-white/10 flex flex-col items-center justify-center text-slate-400 opacity-60">
                        <LineChart className="mb-2 text-slate-300" />
                        <span className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</span>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}
          </AppShell>
        )}
      </div>
    </div>
  );
}

export default App;
