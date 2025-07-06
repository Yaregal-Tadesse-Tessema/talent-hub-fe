import React, { useState } from 'react';
import {
  Building2,
  TrendingUp,
  ExternalLink,
  Users,
  Briefcase,
  MapPin,
  Star,
  BookOpen,
  Target,
  Award,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

interface EmployerPageSidebarProps {
  className?: string;
}

export default function EmployerPageSidebar({
  className = '',
}: EmployerPageSidebarProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Job seeker news and insights
  const jobSeekerNews = [
    {
      id: 1,
      title: 'Top Companies Hiring in 2024',
      excerpt:
        'Discover which companies are actively recruiting and expanding their teams this year...',
      category: 'Hiring Trends',
      readTime: '4 min read',
    },
    {
      id: 2,
      title: 'How to Research Companies Before Applying',
      excerpt:
        'Learn effective strategies to research company culture, values, and employee satisfaction...',
      category: 'Career Tips',
      readTime: '6 min read',
    },
    {
      id: 3,
      title: 'Questions to Ask During Company Interviews',
      excerpt:
        'Prepare thoughtful questions to ask employers about culture, growth, and opportunities...',
      category: 'Interview Prep',
      readTime: '5 min read',
    },
  ];

  // Job seeker insights and tips
  const jobSeekerInsights = [
    {
      id: 1,
      title: 'Research Company Culture',
      description:
        'Learn about work environment, values, and employee satisfaction before applying',
      icon: Building2,
      color: 'blue',
    },
    {
      id: 2,
      title: 'Check Growth Opportunities',
      description:
        'Look for companies that offer career advancement and skill development',
      icon: TrendingUp,
      color: 'green',
    },
    {
      id: 3,
      title: 'Evaluate Benefits Package',
      description:
        'Compare health insurance, retirement plans, and other employee benefits',
      icon: Award,
      color: 'purple',
    },
  ];

  // Quick action buttons for job seekers
  const quickActions = [
    {
      id: 1,
      title: 'Update Your Profile',
      description: 'Keep your skills and experience current',
      action: 'Update',
      icon: Users,
      type: 'primary',
    },
    {
      id: 2,
      title: 'Browse Job Postings',
      description: 'Find opportunities at these companies',
      action: 'Browse Jobs',
      icon: Briefcase,
      type: 'secondary',
    },
  ];

  const handleQuickAction = (action: string) => {
    if (!user) {
      showToast({
        type: 'error',
        message: 'Please login to access this feature',
      });
      return;
    }

    if (action === 'Update') {
      // Navigate to profile update
      window.location.href = '/profile';
    } else if (action === 'Browse Jobs') {
      // Navigate to job listings
      window.location.href = '/find-jobs';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getActionButtonStyle = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className='lg:hidden fixed bottom-6 right-6 z-40'>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className='p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
        >
          <Building2 className='w-5 h-5' />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className='lg:hidden fixed inset-0 bg-black/50 z-50'
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:relative fixed top-0 right-0 h-full lg:h-auto w-80 lg:w-80 
        bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 
        shadow-xl lg:shadow-none z-50 transition-transform duration-300 ease-in-out
        overflow-y-auto lg:overflow-y-visible
        ${className}
      `}
      >
        <div className='p-4 lg:p-0 space-y-6'>
          {/* Mobile Close Button */}
          <div className='lg:hidden flex justify-end'>
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            >
              <ExternalLink className='w-5 h-5' />
            </button>
          </div>

          {/* Quick Actions Section */}
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                <Target className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  Quick Actions
                </h3>
              </div>
            </div>

            <div className='p-4 space-y-3'>
              {quickActions.map((action) => (
                <div
                  key={action.id}
                  className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'
                >
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0'>
                      <action.icon
                        className={`w-5 h-5 ${getIconColor('blue')}`}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-gray-900 dark:text-white text-sm mb-1'>
                        {action.title}
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mb-3'>
                        {action.description}
                      </p>
                      <button
                        onClick={() => handleQuickAction(action.action)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${getActionButtonStyle(action.type)}`}
                      >
                        {action.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Seeker Insights Section */}
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                <BookOpen className='w-5 h-5 text-green-600 dark:text-green-400' />
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  Job Seeker Insights
                </h3>
              </div>
            </div>

            <div className='p-4 space-y-4'>
              {jobSeekerInsights.map((insight) => (
                <div key={insight.id} className='group cursor-pointer'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-shrink-0'>
                      <insight.icon
                        className={`w-4 h-4 ${getIconColor(insight.color)}`}
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {insight.title}
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Seeker News Section */}
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-purple-600 dark:text-purple-400' />
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  Job Seeker News
                </h3>
              </div>
            </div>

            <div className='p-4 space-y-4'>
              {jobSeekerNews.map((news) => (
                <article key={news.id} className='group cursor-pointer'>
                  <div className='flex items-start gap-3'>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {news.title}
                      </h4>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        {news.excerpt}
                      </p>
                      <div className='flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-gray-500'>
                        <span className='bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full'>
                          {news.category}
                        </span>
                        <span>{news.readTime}</span>
                      </div>
                    </div>
                    <ExternalLink className='w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0' />
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Featured Companies Section */}
          <div className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700 p-4'>
            <div className='flex items-center gap-2 mb-3'>
              <Star className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h3 className='font-semibold text-blue-900 dark:text-blue-100'>
                Featured Companies
              </h3>
            </div>
            <p className='text-sm text-blue-800 dark:text-blue-200 mb-3'>
              Discover top-rated employers with excellent employee satisfaction
            </p>
            <button className='w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors'>
              View Featured Companies
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
