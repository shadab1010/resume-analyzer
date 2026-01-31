import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Circle } from 'lucide-react';

interface AnalysisStepsProps {
    currentStep: number;
}

export const AnalysisSteps: React.FC<AnalysisStepsProps> = () => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        "Reading resume file...",
        "Extracting text content...",
        "Analyzing with Gemini AI...",
        "Calculating ATS score...",
        "Generating recommendations..."
    ];

    useEffect(() => {
        // Simulate progress through steps
        const timers = steps.map((_, index) => {
            return setTimeout(() => {
                if (index < steps.length - 1) {
                    setCurrentStep(index + 1);
                }
            }, (index + 1) * 2000); // 2 seconds per step roughly
        });

        return () => timers.forEach(timer => clearTimeout(timer));
    }, []);

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm">
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            {index < currentStep ? (
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                </div>
                            ) : index === currentStep ? (
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                                </div>
                            ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                    <Circle className="w-5 h-5 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className={`flex-1 transition-all duration-300 ${index === currentStep ? 'transform translate-x-1' : ''
                            }`}>
                            <p className={`font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                                }`}>
                                {step}
                            </p>
                            {index === currentStep && (
                                <p className="text-xs text-blue-600 mt-0.5 animate-pulse">Processing...</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
