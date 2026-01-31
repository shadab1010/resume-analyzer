import React, { useState } from 'react';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import logo from '../image/logo.png';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ResumeAnalysis } from '../types/resume';
import { ScoreCard } from './ScoreCard';
import { SkillsAnalysis } from './SkillsAnalysis';
import { ErrorsAndSuggestions } from './ErrorsAndSuggestions';
import { DetailedChecks } from './DetailedChecks';

interface AnalysisDashboardProps {
  analysis: ResumeAnalysis;
  onNewAnalysis: () => void;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ analysis, onNewAnalysis }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById('resume-analysis-report');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${analysis.fileName.replace(/\.[^/.]+$/, "")}_Analysis_Report.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-slide-up" id="resume-analysis-report">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 mb-8 transition-all hover:shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold rounded-full shadow-sm">
                AI POWERED
              </span>
              <span className="text-gray-400 text-xs uppercase tracking-wider">Report</span>
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <img src={logo} alt="Logo" className="w-28 h-28 object-contain hover:scale-105 transition-transform filter drop-shadow-lg" />
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Resume Analysis</h1>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span className="font-medium text-gray-700">{analysis.fileName}</span>
              <span>•</span>
              <span>{analysis.uploadDate.toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-3" data-html2canvas-ignore>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-50"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              <span>{isExporting ? 'Exporting...' : 'Export PDF'}</span>
            </button>
            <button
              onClick={onNewAnalysis}
              className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:opacity-90 transition-all transform hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="transform hover:scale-105 transition-transform duration-300">
          <ScoreCard
            type="overall"
            title="Overall Score"
            score={analysis.overallScore}
            description="Comprehensive resume quality assessment based on content, structure, and ATS compatibility."
          />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-300">
          <ScoreCard
            type="ats"
            title="ATS Compatibility"
            score={analysis.atsScore}
            description="How well your resume will perform with Applicant Tracking Systems used by most companies."
          />
        </div>
        <div className="transform hover:scale-105 transition-transform duration-300">
          <ScoreCard
            title="Skills Match"
            score={Math.round(analysis.skills.filter(s => s.isRelevant).length / analysis.skills.length * 100)}
            description="Percentage of relevant skills identified for your target role or industry."
          />
        </div>
      </div>

      {/* Detailed Content Checks */}
      {analysis.kpis && (
        <DetailedChecks kpis={analysis.kpis} />
      )}


      {/* Section Scores */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/20 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="w-1 h-6 bg-blue-600 rounded-full mr-3"></span>
          Section Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analysis.sections.map((section, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors">
              <h3 className="font-semibold text-gray-900 mb-3">{section.name}</h3>
              <div className="flex items-end justify-between mb-2">
                <div className={`text-3xl font-bold ${section.score >= 80 ? 'text-green-600' :
                  section.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                  {section.score}
                  <span className="text-sm text-gray-400 ml-1 font-normal">/100</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                <div
                  className={`h-1.5 rounded-full ${section.score >= 80 ? 'bg-green-500' :
                    section.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  style={{ width: `${section.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{section.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Skills Analysis */}
      <div className="mb-8">
        <SkillsAnalysis skills={analysis.skills} />
      </div>

      {/* Errors and Suggestions */}
      <ErrorsAndSuggestions errors={analysis.errors} suggestions={analysis.suggestions} />

      {/* AI Analysis Section */}
      {analysis.aiAnalysis && (
        <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-6 border border-purple-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg shadow-purple-200">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Deep AI Analysis</h3>
              <p className="text-sm text-gray-500">Advanced insights from Gemini Pro</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* AI Feedback */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-purple-100 shadow-sm">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-xl mr-2">🎯</span> Executive Summary
              </h4>
              <p className="text-gray-700 leading-relaxed text-lg">{analysis.aiAnalysis.ai_feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enhanced Suggestions */}
              {analysis.aiAnalysis.enhanced_suggestions.length > 0 && (
                <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                  <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">💡</span> Strategic Improvements
                  </h4>
                  <ul className="space-y-3">
                    {analysis.aiAnalysis.enhanced_suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Industry Insights */}
              {analysis.aiAnalysis.industry_insights.length > 0 && (
                <div className="bg-green-50/50 rounded-xl p-5 border border-green-100">
                  <h4 className="font-semibold text-green-900 mb-4 flex items-center">
                    <span className="text-xl mr-2">📈</span> Industry Alignment
                  </h4>
                  <ul className="space-y-3">
                    {analysis.aiAnalysis.industry_insights.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-3 text-sm">
                        <span className="flex-shrink-0 w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></span>
                        <span className="text-gray-700">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};