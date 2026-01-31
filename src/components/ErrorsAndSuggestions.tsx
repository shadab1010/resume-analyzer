import React from 'react';
import { AlertTriangle, CheckCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { AnalysisError, Suggestion } from '../types/resume';

interface ErrorsAndSuggestionsProps {
  errors: AnalysisError[];
  suggestions: Suggestion[];
}

export const ErrorsAndSuggestions: React.FC<ErrorsAndSuggestionsProps> = ({ errors, suggestions }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low': return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-green-700 bg-green-100';
      case 'medium': return 'text-blue-700 bg-blue-100';
      case 'low': return 'text-gray-700 bg-gray-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Errors Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            Issues Found ({errors.length})
          </h3>
        </div>
        
        {errors.length > 0 ? (
          <div className="space-y-4">
            {errors.map((error, index) => (
              <div 
                key={index}
                className={`border rounded-lg p-4 ${getSeverityColor(error.severity)}`}
              >
                <div className="flex items-start space-x-3">
                  {getSeverityIcon(error.severity)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{error.type.toUpperCase()}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        error.severity === 'high' ? 'bg-red-100 text-red-800' :
                        error.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {error.severity} priority
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{error.message}</p>
                    {error.location && (
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="font-medium">Location:</span> {error.location}
                      </p>
                    )}
                    {error.suggestion && (
                      <div className="flex items-start space-x-2 mt-3 p-3 bg-white rounded border-l-4 border-green-400">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                        <p className="text-sm text-gray-700">{error.suggestion}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
            <p>No critical issues found in your resume!</p>
          </div>
        )}
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            Improvement Suggestions ({suggestions.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                    {suggestion.impact} impact
                  </span>
                </div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {suggestion.category}
                </span>
              </div>
              <p className="text-gray-700 mb-3">{suggestion.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                <span>Apply suggestion</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};