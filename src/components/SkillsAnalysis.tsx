import React from 'react';
import { Code, Users, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { Skill } from '../types/resume';

interface SkillsAnalysisProps {
  skills: Skill[];
}

export const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({ skills }) => {
  const getSkillIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Code className="w-4 h-4" />;
      case 'soft': return <Users className="w-4 h-4" />;
      case 'industry': return <Briefcase className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'soft': return 'bg-green-100 text-green-800';
      case 'industry': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills Analysis</h3>
      
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <div className="flex items-center space-x-2 mb-3">
              {getSkillIcon(category)}
              <h4 className="font-medium text-gray-900 capitalize">
                {category} Skills ({categorySkills.length})
              </h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categorySkills.map((skill, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      {skill.isRelevant ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {Math.round(skill.confidence * 100)}%
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${skill.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};