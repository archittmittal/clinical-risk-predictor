import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RiskGaugeProps {
    riskScore: number; // 0 to 1
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ riskScore }) => {
    const percentage = Math.round(riskScore * 100);

    const data = [
        { name: 'Score', value: percentage },
        { name: 'Remaining', value: 100 - percentage },
    ];

    // Clinical palette colors
    let color = '#2dd4bf'; // teal-400 (Low Risk)
    let tailwindColorClass = 'text-teal-400';
    let label = 'Low Risk';

    if (riskScore > 0.3) {
        color = '#fbbf24'; // amber-400 (Moderate)
        tailwindColorClass = 'text-amber-400';
        label = 'Moderate Risk';
    }
    if (riskScore > 0.7) {
        color = '#f43f5e'; // rose-500 (High)
        tailwindColorClass = 'text-rose-500';
        label = 'High Risk';
    }

    const cx = "50%";
    const cy = "70%";
    const iR = 60;
    const oR = 100;

    return (
        <div className="flex flex-col items-center justify-center h-full w-full relative">
            <div className="h-48 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            dataKey="value"
                            startAngle={180}
                            endAngle={0}
                            data={data}
                            cx={cx}
                            cy={cy}
                            innerRadius={iR}
                            outerRadius={oR}
                            fill="#8884d8"
                            stroke="none"
                        >
                            <Cell fill={color} />
                            <Cell fill="#e2e8f0" className="dark:fill-slate-700/50" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 text-center">
                    <span className={`text-5xl font-black tracking-tighter ${tailwindColorClass} drop-shadow-sm`}>
                        {percentage}%
                    </span>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">
                        {label}
                    </p>
                </div>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full font-bold uppercase tracking-wide mt-[-20px] relative z-10 border border-slate-200 dark:border-slate-700/50">
                AI Probability
            </div>
        </div>
    );
};

export default RiskGauge;
