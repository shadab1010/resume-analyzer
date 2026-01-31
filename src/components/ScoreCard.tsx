import React from 'react';
import { TrendingUp, Award, AlertCircle } from 'lucide-react';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore?: number;
  description: string;
  type?: 'ats' | 'overall' | 'section';
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  maxScore = 100,
  description,
  type = 'section'
}) => {
  const percentage = (score / maxScore) * 100;

  const getScoreColor = (percent: number) => {
    if (percent >= 80) return 'text-green-600';
    if (percent >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 80) return 'bg-green-500';
    if (percent >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getIcon = () => {
    if (type === 'ats') return <TrendingUp className="w-6 h-6" />;
    if (type === 'overall') return <Award className="w-6 h-6" />;
    return <AlertCircle className="w-6 h-6" />;
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl transition-colors ${percentage >= 80 ? 'bg-green-100 text-green-600' :
              percentage >= 60 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
            }`}>
            {getIcon()}
          </div>
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        </div>
        <div className={`text-3xl font-extrabold ${getScoreColor(percentage)}`}>
          {score}
          <span className="text-sm text-gray-400 font-normal ml-1">/ {maxScore}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          <span>Performance</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${getProgressColor(percentage)}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
};