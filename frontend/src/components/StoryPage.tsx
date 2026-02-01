import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Activity, Brain, ShieldCheck, ChevronRight, Stethoscope } from 'lucide-react';

interface StoryPageProps {
    onComplete: () => void;
}

export default function StoryPage({ onComplete }: StoryPageProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 0,
            title: "The Clinical Data Challenge",
            subtitle: "Healthcare data is complex, fragmented, and overwhelming.",
            description: "Clinicians spend 40% of their time synthesizing data instead of treating patients. Critical insights often get lost in the noise of disconnected systems.",
            icon: <Activity className="w-24 h-24 text-rose-500" />,
            color: "from-rose-500/20 to-orange-500/20",
            accent: "text-rose-400"
        },
        {
            id: 1,
            title: "Enter Astra Meds AI",
            subtitle: "A digital twin for every patient, powered by SOTA ensembles.",
            description: "We process thousands of biomarkers in real-time using BioMistral-7B and advanced risk engines to predict outcomes before they happen.",
            icon: <Brain className="w-24 h-24 text-cyan-500" />,
            color: "from-cyan-500/20 to-blue-500/20",
            accent: "text-cyan-400"
        },
        {
            id: 2,
            title: "Your Intelligent Workspace",
            subtitle: "Precision medicine at your fingertips.",
            description: "Welcome to your new dashboard. Real-time risk stratification, counterfactual analysis, and explainable AI—all in one place.",
            icon: <ShieldCheck className="w-24 h-24 text-emerald-500" />,
            color: "from-emerald-500/20 to-teal-500/20",
            accent: "text-emerald-400"
        }
    ];

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden font-display">
            {/* Dynamic Background */}
            <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].color} blur-3xl opacity-30`}
            />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent)]"></div>

            <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center text-center">

                {/* Header Logo */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-50"
                >
                    <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md shadow-2xl ring-1 ring-white/20 hover:bg-white/10 transition-colors cursor-default">
                        <div className="p-1.5 bg-clinical-teal/20 rounded-full">
                            <Stethoscope className="w-5 h-5 text-clinical-teal" strokeWidth={2.5} />
                        </div>
                        <span className="text-lg font-bold tracking-widest text-white uppercase font-display">Astra Meds</span>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="mt-20 min-h-[400px] flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentSlide}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 1.05 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="flex flex-col items-center max-w-3xl"
                        >
                            <div className="mb-8 p-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
                                {slides[currentSlide].icon}
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6 drop-shadow-lg">
                                <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                    {slides[currentSlide].title}
                                </span>
                            </h1>

                            <h2 className={`text-2xl md:text-3xl font-medium ${slides[currentSlide].accent} mb-6`}>
                                {slides[currentSlide].subtitle}
                            </h2>

                            <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                                {slides[currentSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation & Progress */}
                <div className="mt-24 w-full flex flex-col items-center gap-8">

                    {/* Progress Indicators */}
                    <div className="flex gap-3">
                        {slides.map((_, index) => (
                            <motion.div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-500 ${index === currentSlide ? "w-12 bg-white" : "w-3 bg-white/20"
                                    }`}
                                layoutId="progress"
                            />
                        ))}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNext}
                        className="group relative px-8 py-4 bg-white text-slate-950 rounded-2xl font-semibold text-lg hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-3 overflow-hidden"
                    >
                        <span className="relative z-10">
                            {currentSlide === slides.length - 1 ? "Enter Dashboard" : "Continue Journey"}
                        </span>
                        {currentSlide === slides.length - 1 ? (
                            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        ) : (
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                        )}

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.button>

                    <button
                        onClick={onComplete}
                        className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                        Skip Intro
                    </button>
                </div>
            </div>
        </div>
    );
}
