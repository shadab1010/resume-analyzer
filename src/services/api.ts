const API_BASE_URL = 'http://localhost:5000';

export interface UploadResponse {
  id: string;
  fileName: string;
  uploadDate: string;
  atsScore: number;
  overallScore: number;
  skills: Array<{
    name: string;
    category: string;
    confidence: number;
    isRelevant: boolean;
  }>;
  errors: Array<{
    type: string;
    severity: string;
    message: string;
    location?: string;
    suggestion?: string;
  }>;
  suggestions: Array<{
    category: string;
    title: string;
    description: string;
    impact: string;
  }>;
  sections: Array<{
    name: string;
    score: number;
    feedback: string;
  }>;
  textLength: number;
  wordCount: number;
  aiAnalysis?: {
    ai_feedback: string;
    enhanced_suggestions: string[];
    industry_insights: string[];
    missing_keywords: string[];
    structure_improvements: string[];
  };
}

export class ApiService {
  static async uploadAndAnalyze(file: File): Promise<UploadResponse> {
    console.log('Uploading file:', file.name, 'to', `${API_BASE_URL}/api/analyze`);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Analysis result:', result);
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Cannot connect to backend server. Make sure the server is running on port 5000.');
      }
      throw error;
    }
  }

  static async healthCheck(): Promise<{ 
    status: string; 
    spacy_loaded: boolean; 
    openai_available: boolean;
  }> {
    try {
      console.log('Checking health at:', `${API_BASE_URL}/api/health`);
      const response = await fetch(`${API_BASE_URL}/api/health`, {
        mode: 'cors',
      });
      
      if (!response.ok) {
        throw new Error('Backend not available');
      }

      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Cannot connect to backend server');
    }
  }
}
export default ApiService;
