'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/Badge';
import {
  TrendingUp,
  Target,
  BookOpen,
  Sparkles,
  ChevronRight,
  Brain,
  Zap,
  Trophy,
  CheckCircle,
  AlertCircle,
  BarChart3,
} from 'lucide-react';
import {
  SkillsAnalysisService,
  SkillsAnalysisResult,
} from '@/services/skillsAnalysisService';

interface ApplicationSkillsCardProps {
  applicationData: any;
  onAnalysisComplete?: (analysis: SkillsAnalysisResult) => void;
  className?: string;
}

export const ApplicationSkillsCard: React.FC<ApplicationSkillsCardProps> = ({
  applicationData,
  onAnalysisComplete,
  className = '',
}) => {
  const [analysis, setAnalysis] = useState<SkillsAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (applicationData?.userInfo && applicationData?.jobPost) {
      analyzeSkills();
    }
  }, [applicationData]);

  const analyzeSkills = async () => {
    if (!applicationData?.userInfo || !applicationData?.jobPost) return;

    try {
      setLoading(true);
      setError(null);
      const skillsService = new SkillsAnalysisService();
      const result = await skillsService.analyzeSkillsMatch(
        applicationData.userInfo,
        applicationData.jobPost,
      );
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      console.error('Error analyzing skills:', err);
      setError('Failed to analyze skills match');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (percentage >= 40)
      return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Moderate Match';
    return 'Needs Development';
  };

  const getMatchIcon = (percentage: number) => {
    if (percentage >= 80) return <Trophy className='w-5 h-5' />;
    if (percentage >= 60) return <Target className='w-5 h-5' />;
    if (percentage >= 40) return <TrendingUp className='w-5 h-5' />;
    return <BookOpen className='w-5 h-5' />;
  };

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-blue-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Show placeholder if required data is missing
  if (!applicationData?.userInfo || !applicationData?.jobPost) {
    return (
      <Card
        className={`p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 ${className}`}
      >
        <div className='text-center'>
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <BarChart3 className='w-6 h-6 text-gray-600' />
          </div>
          <h3 className='font-semibold text-gray-900 mb-2'>Skills Analysis</h3>
          <p className='text-sm text-gray-600 mb-3'>
            {!applicationData
              ? 'Loading application data...'
              : 'Required data not available for analysis'}
          </p>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card
        className={`p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 ${className}`}
      >
        <div className='text-center space-y-4'>
          <div className='flex items-center justify-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 mb-2'>
              Analyzing Skills Match
            </h3>
            <p className='text-sm text-gray-600'>
              AI is comparing candidate&apos;s profile with job requirements...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={`p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 ${className}`}
      >
        <div className='text-center'>
          <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <Zap className='w-6 h-6 text-red-600' />
          </div>
          <h3 className='font-semibold text-gray-900 mb-2'>
            Analysis Unavailable
          </h3>
          <p className='text-sm text-gray-600 mb-3'>{error}</p>
          <Button
            variant='outline'
            size='sm'
            onClick={analyzeSkills}
            className='text-red-600 border-red-200 hover:bg-red-50'
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card
        className={`p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 ${className}`}
      >
        <div className='text-center'>
          <div className='w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3'>
            <BarChart3 className='w-6 h-6 text-gray-600' />
          </div>
          <h3 className='font-semibold text-gray-900 mb-2'>Skills Analysis</h3>
          <p className='text-sm text-gray-600 mb-3'>
            Click to analyze how well this candidate matches your job
            requirements
          </p>
          <Button
            variant='outline'
            size='sm'
            onClick={analyzeSkills}
            className='text-blue-600 border-blue-200 hover:bg-blue-50'
          >
            <BarChart3 className='w-4 h-4 mr-2' />
            Analyze Skills
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}
    >
      {/* Background decoration */}
      <div className='absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-20 transform translate-x-8 -translate-y-8'></div>

      <div className='relative'>
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center'>
              <Brain className='w-4 h-4 text-white' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900 text-sm'>
                Skills Analysis
              </h3>
              <p className='text-xs text-gray-600'>AI-Powered Match</p>
            </div>
          </div>
          <Sparkles className='w-5 h-5 text-purple-500 animate-pulse' />
        </div>

        {/* Match Percentage - Main Feature */}
        <div className='text-center mb-4'>
          <div
            className={`inline-flex items-center space-x-2 px-4 py-3 rounded-xl border-2 ${getMatchColor(analysis.overallMatchPercentage)} transition-all duration-300`}
          >
            {getMatchIcon(analysis.overallMatchPercentage)}
            <div>
              <div className='text-2xl font-bold'>
                {analysis.overallMatchPercentage}%
              </div>
              <div className='text-xs font-medium'>
                {getMatchLabel(analysis.overallMatchPercentage)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className='w-full bg-gray-200 rounded-full h-2 mb-4'>
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${getProgressBarColor(analysis.overallMatchPercentage)}`}
            style={{ width: `${analysis.overallMatchPercentage}%` }}
          ></div>
        </div>

        {/* Quick Stats */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div className='bg-white/60 rounded-lg p-3 text-center border border-white/40'>
            <div className='flex items-center justify-center mb-1'>
              <CheckCircle className='w-4 h-4 text-green-600 mr-1' />
              <div className='text-lg font-bold text-green-600'>
                {analysis.matchedSkills.length}
              </div>
            </div>
            <div className='text-xs text-gray-600'>Skills Match</div>
          </div>
          <div className='bg-white/60 rounded-lg p-3 text-center border border-white/40'>
            <div className='flex items-center justify-center mb-1'>
              <AlertCircle className='w-4 h-4 text-orange-600 mr-1' />
              <div className='text-lg font-bold text-orange-600'>
                {analysis.missingSkills.length}
              </div>
            </div>
            <div className='text-xs text-gray-600'>Missing Skills</div>
          </div>
        </div>

        {/* Key Insights */}
        <div className='space-y-2 mb-4'>
          {analysis.strengthAreas && analysis.strengthAreas.length > 0 && (
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full flex-shrink-0'></div>
              <span className='text-xs text-gray-700'>
                <strong>Strengths:</strong>{' '}
                {analysis.strengthAreas.slice(0, 2).join(', ')}
                {analysis.strengthAreas.length > 2 &&
                  ` +${analysis.strengthAreas.length - 2} more`}
              </span>
            </div>
          )}

          {analysis.improvementAreas &&
            analysis.improvementAreas.length > 0 && (
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full flex-shrink-0'></div>
                <span className='text-xs text-gray-700'>
                  <strong>Areas to improve:</strong>{' '}
                  {analysis.improvementAreas.slice(0, 2).join(', ')}
                  {analysis.improvementAreas.length > 2 &&
                    ` +${analysis.improvementAreas.length - 2} more`}
                </span>
              </div>
            )}

          {analysis.missingSkills.length > 0 && (
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-red-500 rounded-full flex-shrink-0'></div>
              <span className='text-xs text-gray-700'>
                <strong>Key gaps:</strong>{' '}
                {analysis.missingSkills
                  .slice(0, 2)
                  .map((skill: any) => skill.skill || skill)
                  .join(', ')}
                {analysis.missingSkills.length > 2 &&
                  ` +${analysis.missingSkills.length - 2} more`}
              </span>
            </div>
          )}
        </div>

        {/* Summary Recommendation */}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div className='bg-white/60 rounded-lg p-3 mb-4 border border-white/40'>
            <div className='flex items-start space-x-2'>
              <div className='w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
              </div>
              <p className='text-xs text-gray-700 leading-relaxed'>
                <strong>AI Insight:</strong> {analysis.recommendations[0]}
              </p>
            </div>
          </div>
        )}

        {/* Bottom badges */}
        <div className='flex items-center justify-between'>
          <div className='flex space-x-1'>
            <Badge
              variant='outline'
              className='text-xs bg-white/60 border-purple-200 text-purple-700'
            >
              AI Analysis
            </Badge>
            {analysis.overallMatchPercentage >= 70 && (
              <Badge
                variant='outline'
                className='text-xs bg-white/60 border-green-200 text-green-700'
              >
                Strong Match
              </Badge>
            )}
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => onAnalysisComplete?.(analysis)}
            className='text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-1 border-purple-200'
          >
            View Details
            <ChevronRight className='w-3 h-3 ml-1' />
          </Button>
        </div>

        {/* Hover Effect Indicator */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 hover:scale-x-100 transition-transform duration-300 rounded-b-lg'></div>
      </div>
    </Card>
  );
};
