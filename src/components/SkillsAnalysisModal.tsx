'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Award,
  Clock,
  DollarSign,
  Target,
  TrendingUp,
  Brain,
  Lightbulb,
  Star,
  ArrowRight,
  PlayCircle,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/card';
import {
  SkillsAnalysisResult,
  LearningResource,
  SkillGap,
} from '@/services/skillsAnalysisService';

interface SkillsAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: SkillsAnalysisResult | null;
  jobTitle: string;
}

export const SkillsAnalysisModal: React.FC<SkillsAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  jobTitle,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'skills' | 'learning'
  >('overview');

  if (!isOpen || !analysis) return null;

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getMatchBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-blue-50 border-blue-200';
    if (percentage >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const getSkillImportanceColor = (importance: 'high' | 'medium' | 'low') => {
    switch (importance) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getResourceTypeIcon = (type: LearningResource['type']) => {
    switch (type) {
      case 'course':
        return <PlayCircle className='w-4 h-4' />;
      case 'certification':
        return <Award className='w-4 h-4' />;
      case 'tutorial':
        return <BookOpen className='w-4 h-4' />;
      case 'documentation':
        return <FileText className='w-4 h-4' />;
      default:
        return <BookOpen className='w-4 h-4' />;
    }
  };

  const getResourceTypeColor = (type: LearningResource['type']) => {
    switch (type) {
      case 'course':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'certification':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'tutorial':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'documentation':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const modalContent = (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4'>
      <div className='bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden'>
        {/* Header */}
        <div className='bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center'>
                <Brain className='w-6 h-6' />
              </div>
              <div>
                <h2 className='text-xl font-bold'>AI Skills Analysis</h2>
                <p className='text-purple-100 text-sm'>For {jobTitle}</p>
              </div>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={onClose}
              className='text-white border-white/30 hover:bg-white/10'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className='flex space-x-1 mt-6 bg-white/10 rounded-lg p-1'>
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-purple-600'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'skills'
                  ? 'bg-white text-purple-600'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Skills Analysis
            </button>
            <button
              onClick={() => setActiveTab('learning')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'learning'
                  ? 'bg-white text-purple-600'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Learning Path
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='p-6 overflow-y-auto max-h-[calc(90vh-200px)]'>
          {activeTab === 'overview' && (
            <div className='space-y-6'>
              {/* Match Score */}
              <Card
                className={`p-6 border-2 ${getMatchBgColor(analysis.overallMatchPercentage)}`}
              >
                <div className='text-center'>
                  <div
                    className={`text-4xl font-bold ${getMatchColor(analysis.overallMatchPercentage)} mb-2`}
                  >
                    {analysis.overallMatchPercentage}%
                  </div>
                  <p className='text-gray-600 mb-4'>Overall Skills Match</p>
                  <div className='w-full bg-gray-200 rounded-full h-3'>
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        analysis.overallMatchPercentage >= 80
                          ? 'bg-green-500'
                          : analysis.overallMatchPercentage >= 60
                            ? 'bg-blue-500'
                            : analysis.overallMatchPercentage >= 40
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${analysis.overallMatchPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </Card>

              {/* Quick Stats */}
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card className='p-4 bg-green-50 border-green-200'>
                  <div className='flex items-center space-x-3'>
                    <CheckCircle className='w-8 h-8 text-green-600' />
                    <div>
                      <div className='text-2xl font-bold text-green-600'>
                        {analysis.matchedSkills.length}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Matching Skills
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className='p-4 bg-orange-50 border-orange-200'>
                  <div className='flex items-center space-x-3'>
                    <Target className='w-8 h-8 text-orange-600' />
                    <div>
                      <div className='text-2xl font-bold text-orange-600'>
                        {analysis.missingSkills.length}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Skills to Learn
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className='p-4 bg-purple-50 border-purple-200'>
                  <div className='flex items-center space-x-3'>
                    <BookOpen className='w-8 h-8 text-purple-600' />
                    <div>
                      <div className='text-2xl font-bold text-purple-600'>
                        {analysis.learningPaths.length}
                      </div>
                      <div className='text-sm text-gray-600'>
                        Learning Resources
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className='p-6'>
                <h3 className='text-lg font-semibold mb-4 flex items-center'>
                  <Lightbulb className='w-5 h-5 text-yellow-500 mr-2' />
                  AI Recommendations
                </h3>
                <div className='space-y-3'>
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className='flex items-start space-x-3'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full mt-2'></div>
                      <p className='text-gray-700'>{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Strength Areas */}
              {analysis.strengthAreas.length > 0 && (
                <Card className='p-6 bg-green-50 border-green-200'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center text-green-800'>
                    <Star className='w-5 h-5 text-green-600 mr-2' />
                    Your Strengths
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {analysis.strengthAreas.map((strength, index) => (
                      <Badge
                        key={index}
                        className='bg-green-100 text-green-800 border-green-200'
                      >
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className='space-y-6'>
              {/* Matched Skills */}
              {analysis.matchedSkills.length > 0 && (
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center text-green-600'>
                    <CheckCircle className='w-5 h-5 mr-2' />
                    Skills You Already Have ({analysis.matchedSkills.length})
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {analysis.matchedSkills.map((skill, index) => (
                      <Badge
                        key={index}
                        className='bg-green-100 text-green-800 border-green-200'
                      >
                        <CheckCircle className='w-3 h-3 mr-1' />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>
              )}

              {/* Missing Skills */}
              {analysis.missingSkills.length > 0 && (
                <Card className='p-6'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center text-orange-600'>
                    <AlertCircle className='w-5 h-5 mr-2' />
                    Skills to Develop ({analysis.missingSkills.length})
                  </h3>
                  <div className='space-y-3'>
                    {analysis.missingSkills.map((skillGap, index) => (
                      <div
                        key={index}
                        className='border border-gray-200 rounded-lg p-4'
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <h4 className='font-medium text-gray-900'>
                            {skillGap.skill}
                          </h4>
                          <Badge
                            className={`${getSkillImportanceColor(skillGap.importance)} border`}
                          >
                            {skillGap.importance} priority
                          </Badge>
                        </div>
                        <p className='text-sm text-gray-600'>
                          {skillGap.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'learning' && (
            <div className='space-y-6'>
              <Card className='p-6'>
                <h3 className='text-lg font-semibold mb-4 flex items-center'>
                  <TrendingUp className='w-5 h-5 text-blue-600 mr-2' />
                  Recommended Learning Path
                </h3>
                <p className='text-gray-600 mb-4'>
                  Based on your skill gaps, here are curated learning resources
                  to help you become a stronger candidate:
                </p>

                <div className='space-y-4'>
                  {analysis.learningPaths.map((resource, index) => (
                    <div
                      key={index}
                      className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
                    >
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <div className='flex items-center space-x-2 mb-2'>
                            <div
                              className={`p-1 rounded border ${getResourceTypeColor(resource.type)}`}
                            >
                              {getResourceTypeIcon(resource.type)}
                            </div>
                            <h4 className='font-medium text-gray-900'>
                              {resource.title}
                            </h4>
                            <Badge
                              variant='outline'
                              className={`text-xs ${getResourceTypeColor(resource.type)}`}
                            >
                              {resource.type}
                            </Badge>
                          </div>

                          <div className='flex items-center space-x-4 text-sm text-gray-600 mb-2'>
                            <span className='flex items-center'>
                              <Award className='w-3 h-3 mr-1' />
                              {resource.provider}
                            </span>
                            {resource.duration && (
                              <span className='flex items-center'>
                                <Clock className='w-3 h-3 mr-1' />
                                {resource.duration}
                              </span>
                            )}
                            <span className='flex items-center'>
                              <Target className='w-3 h-3 mr-1' />
                              {resource.level}
                            </span>
                            <span className='flex items-center'>
                              {resource.isPaid ? (
                                <DollarSign className='w-3 h-3 mr-1 text-orange-500' />
                              ) : (
                                <span className='w-3 h-3 mr-1 text-green-500'>
                                  ✓
                                </span>
                              )}
                              {resource.isPaid ? 'Paid' : 'Free'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-end'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-blue-600 border-blue-200 hover:bg-blue-50'
                          onClick={() => window.open(resource.url, '_blank')}
                        >
                          <ExternalLink className='w-3 h-3 mr-1' />
                          View Resource
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {analysis.learningPaths.length === 0 && (
                  <div className='text-center py-8 text-gray-500'>
                    <BookOpen className='w-12 h-12 mx-auto mb-3 opacity-50' />
                    <p>
                      No specific learning resources available at the moment.
                    </p>
                    <p className='text-sm'>
                      Try searching online for courses related to the missing
                      skills.
                    </p>
                  </div>
                )}
              </Card>

              {/* Learning Tips */}
              <Card className='p-6 bg-blue-50 border-blue-200'>
                <h3 className='text-lg font-semibold mb-4 flex items-center text-blue-800'>
                  <Lightbulb className='w-5 h-5 mr-2' />
                  Learning Tips
                </h3>
                <div className='space-y-2 text-sm text-blue-700'>
                  <div className='flex items-center space-x-2'>
                    <ArrowRight className='w-4 h-4' />
                    <span>Start with high-priority skills first</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <ArrowRight className='w-4 h-4' />
                    <span>
                      Practice with real projects to solidify learning
                    </span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <ArrowRight className='w-4 h-4' />
                    <span>Join communities and forums for support</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <ArrowRight className='w-4 h-4' />
                    <span>Update your profile as you learn new skills</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='border-t border-gray-200 p-4 bg-gray-50'>
          <div className='flex items-center justify-between'>
            <div className='text-xs text-gray-500'>
              Analysis powered by AI • Results may vary based on profile
              completeness
            </div>
            <Button onClick={onClose}>Close Analysis</Button>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null;
};
