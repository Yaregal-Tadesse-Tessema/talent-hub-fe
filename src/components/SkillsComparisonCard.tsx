'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp,
  Target,
  BookOpen,
  Sparkles,
  ChevronRight,
  Brain,
  Zap,
  Trophy,
} from 'lucide-react';
import { Job } from '@/types/job';
import { UserProfile } from '@/types/profile';
import {
  skillsAnalysisService,
  SkillsAnalysisResult,
} from '@/services/skillsAnalysisService';
import { AnalyticsService } from '@/services/analyticsService';

interface SkillsComparisonCardProps {
  job: Job;
  userProfile: UserProfile | null;
  onViewDetails: (analysis: SkillsAnalysisResult) => void;
}

export const SkillsComparisonCard: React.FC<SkillsComparisonCardProps> = ({
  job,
  userProfile,
  onViewDetails,
}) => {
  const [analysis, setAnalysis] = useState<SkillsAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      analyzeSkills();
    }
  }, [job.id, userProfile]);

  const analyzeSkills = async () => {
    if (!userProfile) return;

    try {
      setLoading(true);
      setError(null);
      const result = await skillsAnalysisService.analyzeSkillsMatch(
        userProfile,
        job,
      );
      setAnalysis(result);

      // Track skills analysis view
      AnalyticsService.trackSkillsAnalysisView(
        job.id,
        result.overallMatchPercentage,
      );
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

  // Don't render if user is not logged in
  if (!userProfile) {
    return null;
  }

  if (loading) {
    return (
      <Card className='p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200'>
        <div className='flex items-center justify-center space-y-4'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
          <div className='text-center'>
            <h3 className='font-semibold text-gray-900 mb-2'>
              Analyzing Your Skills
            </h3>
            <p className='text-sm text-gray-600'>
              AI is comparing your profile with job requirements...
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200'>
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
    return null;
  }

  return (
    <div
      className='p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border border-purple-200 rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden'
      onClick={() => {
        if (analysis) {
          // Track skills analysis details view
          AnalyticsService.trackSkillsAnalysisDetails(
            job.id,
            analysis.missingSkills?.map((s) => s.skill) || [],
            analysis.matchedSkills || [],
          );
          onViewDetails(analysis);
        }
      }}
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
                AI Skills Analysis
              </h3>
              <p className='text-xs text-gray-600'>Powered by AI</p>
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

        {/* Quick Stats */}
        <div className='grid grid-cols-2 gap-3 mb-4'>
          <div className='bg-white/60 rounded-lg p-3 text-center border border-white/40'>
            <div className='text-lg font-bold text-green-600'>
              {analysis.matchedSkills.length}
            </div>
            <div className='text-xs text-gray-600'>Skills Match</div>
          </div>
          <div className='bg-white/60 rounded-lg p-3 text-center border border-white/40'>
            <div className='text-lg font-bold text-orange-600'>
              {analysis.missingSkills.length}
            </div>
            <div className='text-xs text-gray-600'>To Learn</div>
          </div>
        </div>

        {/* Teaser Content */}
        <div className='space-y-2 mb-4'>
          {analysis.strengthAreas.length > 0 && (
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              <span className='text-xs text-gray-700'>
                Strong in: {analysis.strengthAreas.slice(0, 2).join(', ')}
              </span>
            </div>
          )}

          {analysis.improvementAreas.length > 0 && (
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
              <span className='text-xs text-gray-700'>
                Focus on: {analysis.improvementAreas.slice(0, 2).join(', ')}
              </span>
            </div>
          )}

          {analysis.learningPaths.length > 0 && (
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
              <span className='text-xs text-gray-700'>
                {analysis.learningPaths.length} learning resources available
              </span>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className='flex items-center justify-between'>
          <div className='flex space-x-1'>
            <Badge
              variant='outline'
              className='text-xs bg-white/60 border-purple-200 text-purple-700'
            >
              AI Powered
            </Badge>
            <Badge
              variant='outline'
              className='text-xs bg-white/60 border-blue-200 text-blue-700'
            >
              Personalized
            </Badge>
          </div>

          <div className='flex items-center space-x-1 text-purple-600 group-hover:text-purple-700 transition-colors'>
            <span className='text-xs font-medium'>View Details</span>
            <ChevronRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
          </div>
        </div>

        {/* Hover Effect Indicator */}
        <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300'></div>
      </div>
    </div>
  );
};
