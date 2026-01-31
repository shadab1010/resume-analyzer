import React from 'react';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface DetailedChecksProps {
    kpis: {
        quantifyingImpact: number;
        actionVerbs: number;
        repetition: number;
        spelling: number;
    };
}

export const DetailedChecks: React.FC<DetailedChecksProps> = ({ kpis }) => {
    const getStatus = (score: number) => {
        if (score >= 80) return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-100', text: 'Great Job' };
        if (score >= 60) return { icon: AlertCircle, color: 'text-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-100', text: 'Needs Improvement' };
        return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', text: 'Critical Issue' };
    };

    const checks = [
        {
            key: 'quantifyingImpact',
            label: 'Quantifying Impact',
            score: kpis.quantifyingImpact,
            description: 'Usage of numbers, percentages, and metrics to demonstrate achievements.'
        },
        {
            key: 'actionVerbs',
            label: 'Action Verbs',
            score: kpis.actionVerbs,
            description: 'Starting bullet points with strong, active verbs (e.g., Led, Developed).'
        },
        {
            key: 'repetition',
            label: 'Repetition',
            score: kpis.repetition,
            description: 'Avoiding repetitive words and ensuring varied vocabulary.'
        },
        {
            key: 'spelling',
            label: 'Spelling & Grammar',
            score: kpis.spelling,
            description: 'Freedom from spelling mistakes and grammatical errors.'
        }
    ];

    return (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-1 h-6 bg-purple-600 rounded-full mr-3"></span>
                Content Analysis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checks.map((check) => {
                    const status = getStatus(check.score);
                    const Icon = status.icon;

                    return (
                        <div key={check.key} className={`p-4 rounded-xl border ${status.border} ${status.bg} transition-all duration-300 hover:scale-[1.02] hover:shadow-md`}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <Icon className={`w-5 h-5 ${status.color}`} />
                                    <h3 className="font-semibold text-gray-900">{check.label}</h3>
                                </div>
                                <span className={`text-sm font-bold ${status.color} px-2 py-1 rounded-full bg-white/50`}>
                                    {check.score}/100
                                </span>
                            </div>

                            <div className="w-full bg-gray-200/50 rounded-full h-1.5 mb-3">
                                <div
                                    className={`h-1.5 rounded-full ${status.color.replace('text', 'bg')}`}
                                    style={{ width: `${check.score}%` }}
                                ></div>
                            </div>

                            <p className="text-sm text-gray-600 leading-relaxed">
                                {check.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
