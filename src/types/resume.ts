export interface ResumeAnalysis {
  id: string;
  fileName: string;
  uploadDate: Date;
  atsScore: number;
  overallScore: number;
  contentScore?: number;
  kpis?: {
    quantifyingImpact: number;
    actionVerbs: number;
    repetition: number;
    spelling: number;
  };
  skills: Skill[];
  errors: AnalysisError[];
  suggestions: Suggestion[];
  sections: ResumeSection[];
}

export interface Skill {
  name: string;
  category: string;
  confidence: number;
  isRelevant: boolean;
}

export interface AnalysisError {
  type: string;
  severity: string;
  message: string;
  location?: string;
  suggestion?: string;
}

export interface Suggestion {
  category: string;
  title: string;
  description: string;
  impact: string;
}

export interface ResumeSection {
  name: string;
  score: number;
  feedback: string;
}