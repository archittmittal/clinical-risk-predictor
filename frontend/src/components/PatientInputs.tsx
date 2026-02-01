import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { predictRisk, type PredictionInput, type PredictionResponse } from '../api/client';
import { Loader2, Info, Activity, User, Cigarette, HeartPulse, Scale, ActivitySquare, Droplets } from 'lucide-react';
import SectionCard from "./ui/SectionCard";

interface PatientInputsProps {
    onPredictionSuccess: (data: PredictionResponse, inputData: PredictionInput) => void;
    user?: { email: string; name: string } | null;
}

const PatientInputs: React.FC<PatientInputsProps> = ({ onPredictionSuccess, user }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<PredictionInput>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: PredictionInput) => {
        setIsLoading(true);
        setError(null);
        try {
            const payload: PredictionInput = {
                ...data,
                age: Number(data.age),
                hypertension: Number(data.hypertension),
                heart_disease: Number(data.heart_disease),
                bmi: Number(data.bmi),
                HbA1c_level: Number(data.HbA1c_level),
                blood_glucose_level: Number(data.blood_glucose_level),
                clinician_id: user?.email,
                clinician_name: user?.name,
            };

            const result = await predictRisk(payload);
            onPredictionSuccess(result, payload);
        } catch (err) {
            console.error(err);
            setError("Analysis service unavailable. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputWrapperClass = "space-y-1.5 group";
    const labelClass = "block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-clinical-teal dark:group-hover:text-teal-400 transition-colors flex items-center gap-1.5";
    const inputContainerClass = "relative";
    const inputClass = "w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm placeholder:text-slate-400 font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all text-sm backdrop-blur-sm";
    const selectClass = "w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-clinical-teal/50 focus:border-clinical-teal transition-all text-sm backdrop-blur-sm appearance-none cursor-pointer";
    const iconClass = "absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-clinical-teal transition-colors";
    const errorClass = "text-xs text-clinical-coral font-bold mt-1 ml-1 flex items-center gap-1";

    return (
        <SectionCard
            title="Patient Demographics"
            subtitle="Input clinical data for AI analysis."
            className="h-full sticky top-24 shadow-glass dark:shadow-glass-dark"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* 1. Demographics */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
                        Core Identity
                    </h4>
                    <div className="grid grid-cols-2 gap-5">
                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Age</label>
                            <div className={inputContainerClass}>
                                <User size={16} className={iconClass} />
                                <input
                                    type="number"
                                    {...register("age", { required: true, min: 0, max: 120 })}
                                    className={inputClass}
                                    placeholder="00"
                                />
                                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">YRS</span>
                            </div>
                            {errors.age && <p className={errorClass}>Required</p>}
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>Gender</label>
                            <div className={inputContainerClass}>
                                <div className={iconClass}>
                                    <div className="w-4 h-4 rounded-full border-2 border-current opacity-60"></div>
                                </div>
                                <select {...register("gender", { required: true })} className={selectClass}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute right-4 top-4 pointer-events-none">
                                    <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45 mb-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={inputWrapperClass}>
                        <label className={labelClass}>
                            <Cigarette size={14} /> Smoking History
                        </label>
                        <div className={inputContainerClass}>
                            <div className={iconClass}></div>
                            <select {...register("smoking_history", { required: true })} className={`${selectClass} pl-4`}>
                                <option value="never">Never Smoked</option>
                                <option value="current">Current Smoker</option>
                                <option value="former">Former Smoker</option>
                                <option value="ever">Ever Smoked</option>
                                <option value="not current">Not Current</option>
                            </select>
                            <div className="absolute right-4 top-4 pointer-events-none">
                                <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45 mb-1"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Medical History */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 mt-8 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
                        Medical History
                    </h4>
                    <div className="grid grid-cols-2 gap-5">
                        <div className={inputWrapperClass}>
                            <label className={labelClass}>
                                <HeartPulse size={14} /> Hypertension
                            </label>
                            <div className={inputContainerClass}>
                                <select {...register("hypertension")} className={`${selectClass} pl-4`}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                                <div className="absolute right-4 top-4 pointer-events-none">
                                    <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45 mb-1"></div>
                                </div>
                            </div>
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>
                                <ActivitySquare size={14} /> Heart Disease
                            </label>
                            <div className={inputContainerClass}>
                                <select {...register("heart_disease")} className={`${selectClass} pl-4`}>
                                    <option value="0">No</option>
                                    <option value="1">Yes</option>
                                </select>
                                <div className="absolute right-4 top-4 pointer-events-none">
                                    <div className="w-2 h-2 border-r-2 border-b-2 border-slate-400 transform rotate-45 mb-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Clinical Metrics */}
                <div className="space-y-5">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 mt-8 flex items-center gap-2">
                        <span className="w-8 h-[1px] bg-slate-200 dark:bg-slate-700"></span>
                        Vitals & Biometrics
                    </h4>

                    <div className={inputWrapperClass}>
                        <div className="flex justify-between items-baseline">
                            <label className={labelClass}>
                                <Scale size={14} /> BMI
                            </label>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">18-25 Normal</span>
                        </div>
                        <div className={inputContainerClass}>
                            <input
                                type="number"
                                step="0.1"
                                {...register("bmi", { required: true, min: 10, max: 100 })}
                                className={`${inputClass} pl-4`}
                                placeholder="24.5"
                            />
                            <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">KG/M²</span>
                        </div>
                        {errors.bmi && <p className={errorClass}>Valid BMI required</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <div className={inputWrapperClass}>
                            <label className={labelClass}>
                                <Droplets size={14} /> HbA1c
                            </label>
                            <div className={inputContainerClass}>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register("HbA1c_level", { required: true, min: 2, max: 20 })}
                                    className={`${inputClass} pl-4`}
                                    placeholder="5.7"
                                />
                                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                            </div>
                        </div>

                        <div className={inputWrapperClass}>
                            <label className={labelClass}>
                                <Droplets size={14} /> Glucose
                            </label>
                            <div className={inputContainerClass}>
                                <input
                                    type="number"
                                    step="1"
                                    {...register("blood_glucose_level", { required: true, min: 50, max: 500 })}
                                    className={`${inputClass} pl-4`}
                                    placeholder="100"
                                />
                                <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 pointer-events-none">MG/DL</span>
                            </div>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-clinical-coral rounded-xl text-sm flex items-center gap-3 animate-in slide-in-from-top-2">
                        <Info size={18} className="shrink-0" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative overflow-hidden group flex items-center justify-center py-4 px-6 bg-gradient-to-r from-clinical-teal to-clinical-teal-dark hover:from-teal-500 hover:to-teal-700 text-white text-sm font-bold tracking-wide uppercase rounded-xl shadow-lg shadow-clinical-teal/20 transition-all focus:outline-none focus:ring-2 focus:ring-clinical-teal focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4 transform active:scale-[0.98]"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        {isLoading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                PROCESSING ANALYSIS...
                            </>
                        ) : (
                            <>
                                GENERATE RISK PROFILE
                                <Activity size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none"></div>
                </button>
            </form>
        </SectionCard>
    );
};

export default PatientInputs;
