import React, { useState } from 'react';
import { Brain, FileText, Target, Star, AlertCircle } from 'lucide-react';
import logo from './image/logo.png';
import { FileUpload } from './components/FileUpload';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeAnalysis } from './types/resume';
import ApiService from './services/api';

function App() {
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ApiService.uploadAndAnalyze(file);

      // Convert API response to our ResumeAnalysis type
      const analysisData: ResumeAnalysis = {
        ...result,
        uploadDate: new Date(result.uploadDate)
      };

      setAnalysis(analysisData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysis(null);
    setIsLoading(false);
    setError(null);
  };

  if (analysis) {
    return <AnalysisDashboard analysis={analysis} onNewAnalysis={handleNewAnalysis} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-fade-in">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Logo" className="w-28 h-28 object-contain hover:scale-105 transition-transform filter drop-shadow-lg" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ResumeAI Analyzer</h1>
                <p className="text-sm text-gray-600">AI-Powered Resume Optimization</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Optimize Your Resume with
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Intelligence</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Get instant feedback on your resume's ATS compatibility, skill matching, and content quality.
            Our AI analyzes thousands of successful resumes to help you stand out.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">ATS Optimization</h3>
            <p className="text-gray-600">
              Ensure your resume passes Applicant Tracking Systems with our advanced compatibility analysis.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Skills Analysis</h3>
            <p className="text-gray-600">
              AI-powered skill extraction and relevance scoring to highlight your strongest qualifications.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Content Enhancement</h3>
            <p className="text-gray-600">
              Get specific suggestions to improve content, formatting, and overall resume effectiveness.
            </p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Upload Your Resume</h3>
            <p className="text-gray-600">
              Upload your resume in PDF or DOCX format and get instant AI-powered analysis
            </p>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-red-800 font-medium">Analysis Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                  <p className="text-red-600 text-xs mt-1">
                    Make sure the Python backend is running on port 5000
                  </p>
                </div>
              </div>
            )}
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500K+</div>
              <div className="text-gray-600">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
              <div className="text-gray-600">Improvement in ATS Score</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-2">3x</div>
              <div className="text-gray-600">More Interview Calls</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-white p-2 rounded-xl shadow-md border border-gray-800 flex items-center justify-center">
                <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
              </div>
              <span className="text-xl font-bold">ResumeAI Analyzer</span>
            </div>
            <p className="text-gray-400 mb-6">
              Powered by advanced AI and machine learning to help you land your dream job.
            </p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Support</a>
              <a
                href="https://www.linkedin.com/in/itsshadab/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;