import React, { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  X,
  ExternalLink,
  TrendingUp,
  Briefcase,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import AlertConfigurationModal from './AlertConfigurationModal';
import { AlertConfiguration } from '@/services/alertConfigurationService';

interface JobPageSidebarProps {
  className?: string;
}

export default function JobPageSidebar({
  className = '',
}: JobPageSidebarProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [alertConfigurations, setAlertConfigurations] = useState<
    AlertConfiguration[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mock news and advertisements data
  const newsItems = [
    {
      id: 1,
      title: 'Tech Industry Sees 15% Growth in Remote Jobs',
      excerpt:
        'Remote work opportunities continue to expand across technology sectors...',
      date: '2024-01-15',
      category: 'Industry News',
      readTime: '3 min read',
    },
    {
      id: 2,
      title: 'New AI Regulations Impact Job Market',
      excerpt:
        'Recent AI regulations are creating new opportunities for compliance specialists...',
      date: '2024-01-14',
      category: 'Market Trends',
      readTime: '5 min read',
    },
    {
      id: 3,
      title: 'Healthcare Sector Hiring Surge',
      excerpt:
        'Healthcare organizations are actively recruiting for various positions...',
      date: '2024-01-13',
      category: 'Sector Update',
      readTime: '4 min read',
    },
  ];

  const advertisements = [
    {
      id: 1,
      title: 'Premium Job Alerts',
      description: 'Get notified about the best opportunities first',
      cta: 'Upgrade Now',
      type: 'premium',
      link: '/dashboard/profile',
    },
    {
      id: 2,
      title: 'Resume Builder Pro',
      description: 'Create professional resumes that stand out',
      cta: 'Try Free',
      type: 'feature',
      link: '/cv-builder',
    },
  ];

  useEffect(() => {
    if (user) {
      fetchAlertConfigurations();
    }
  }, [user]);

  // Listen for changes to localStorage to keep sidebar in sync
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' && e.newValue) {
        try {
          const userData = JSON.parse(e.newValue);
          if (userData.alertConfiguration) {
            const configs = Array.isArray(userData.alertConfiguration)
              ? userData.alertConfiguration
              : [userData.alertConfiguration];

            const validConfigs = configs.filter(
              (config: any) =>
                config &&
                typeof config === 'object' &&
                Object.keys(config).length > 0 &&
                config.jobTitle, // Ensure at least jobTitle exists
            );

            setAlertConfigurations(validConfigs);
          } else {
            setAlertConfigurations([]);
          }
        } catch (error) {
          console.error('Error parsing user data from storage event:', error);
        }
      }
    };

    // Custom event for same-tab updates
    const handleUserDataChange = () => {
      fetchAlertConfigurations();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataChanged', handleUserDataChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChange);
    };
  }, []);

  const fetchAlertConfigurations = () => {
    if (!user) return;

    try {
      setLoading(true);
      // Get alert configurations from user data in localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.alertConfiguration) {
          // Handle both array and single object cases
          const configs = Array.isArray(userData.alertConfiguration)
            ? userData.alertConfiguration
            : [userData.alertConfiguration];

          // Filter out empty or invalid configurations
          const validConfigs = configs.filter(
            (config: any) =>
              config &&
              typeof config === 'object' &&
              Object.keys(config).length > 0 &&
              config.jobTitle, // Ensure at least jobTitle exists
          );

          setAlertConfigurations(validConfigs);
        } else {
          setAlertConfigurations([]);
        }
      } else {
        setAlertConfigurations([]);
      }
    } catch (error) {
      console.error(
        'Error fetching alert configurations from localStorage:',
        error,
      );
      setAlertConfigurations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAlert = () => {
    if (!user) {
      showToast({
        type: 'error',
        message: 'Please login to create job alerts',
      });
      return;
    }
    setIsModalOpen(true);
  };

  const handleAlertSuccess = () => {
    // Refresh alert configurations from localStorage after adding new one
    fetchAlertConfigurations();
    showToast({ type: 'success', message: 'Job alert created successfully' });
  };

  const handleDeleteAlert = (alertId: string) => {
    try {
      // Remove from local state
      const updatedConfigs = alertConfigurations.filter(
        (alert) => alert.id !== alertId,
      );
      setAlertConfigurations(updatedConfigs);

      // Update localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        const updatedUser = {
          ...userData,
          alertConfiguration: updatedConfigs,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('userDataChanged'));
      }

      showToast({ type: 'success', message: 'Job alert deleted successfully' });
    } catch (error) {
      console.error('Error deleting alert:', error);
      showToast({ type: 'error', message: 'Failed to delete job alert' });
    }
  };

  const formatSalary = (salary: string) => {
    if (!salary) return 'Not specified';
    const [min, max] = salary.split('-');
    if (min && max) {
      return `$${parseInt(min).toLocaleString()} - $${parseInt(max).toLocaleString()}`;
    }
    return salary;
  };

  return (
    <>
      {/* Mobile Sidebar Toggle Button */}
      <div className='lg:hidden fixed bottom-6 right-6 z-40'>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className='p-3 bg-blue-600 dark:bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors'
        >
          <Bell className='w-5 h-5' />
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
              <X className='w-5 h-5' />
            </button>
          </div>
          {/* Job Alerts Section */}
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <Bell className='w-5 h-5 text-blue-600 dark:text-blue-400' />
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    Job Alerts
                  </h3>
                </div>
                <button
                  onClick={handleAddAlert}
                  className='p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors'
                >
                  <Plus className='w-4 h-4' />
                </button>
              </div>
            </div>

            <div className='p-4'>
              {loading ? (
                <div className='flex items-center justify-center py-8'>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600'></div>
                </div>
              ) : alertConfigurations.length > 0 ? (
                <div className='space-y-3'>
                  {alertConfigurations.slice(0, 3).map((alert, index) => (
                    <div
                      key={alert.id || `alert-${index}`}
                      className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'
                    >
                      <div className='flex items-start justify-between mb-2'>
                        <h4 className='font-medium text-gray-900 dark:text-white text-sm truncate'>
                          {alert.jobTitle}
                        </h4>
                        <button
                          onClick={() =>
                            handleDeleteAlert(alert.id || `alert-${index}`)
                          }
                          className='p-1 text-gray-400 hover:text-red-500 transition-colors'
                        >
                          <X className='w-3 h-3' />
                        </button>
                      </div>
                      <div className='space-y-1 text-xs text-gray-500 dark:text-gray-400'>
                        {alert.Position && (
                          <div className='flex items-center gap-1'>
                            <Briefcase className='w-3 h-3' />
                            <span>{alert.Position}</span>
                          </div>
                        )}
                        {alert.address && (
                          <div className='flex items-center gap-1'>
                            <MapPin className='w-3 h-3' />
                            <span className='truncate'>{alert.address}</span>
                          </div>
                        )}
                        {alert.salary && (
                          <div className='flex items-center gap-1'>
                            <DollarSign className='w-3 h-3' />
                            <span>{formatSalary(alert.salary)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {alertConfigurations.length > 3 && (
                    <div className='text-center'>
                      <button className='text-blue-600 dark:text-blue-400 text-sm hover:underline'>
                        View all {alertConfigurations.length} alerts
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className='text-center py-6'>
                  <Bell className='w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2' />
                  <p className='text-sm text-gray-500 dark:text-gray-400 mb-3'>
                    No job alerts configured
                  </p>
                  <button
                    onClick={handleAddAlert}
                    className='text-blue-600 dark:text-blue-400 text-sm hover:underline'
                  >
                    Create your first alert
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Advertisements Section */}
          <div className='space-y-3'>
            {advertisements.map((ad) => (
              <div
                key={ad.id}
                onClick={() => {
                  window.open(ad.link, '_blank');
                }}
                className={`p-4 rounded-xl border ${
                  ad.type === 'premium'
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700'
                    : 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700'
                }`}
              >
                <h4 className='font-semibold text-gray-900 dark:text-white text-sm mb-1'>
                  {ad.title}
                </h4>
                <p className='text-xs text-gray-600 dark:text-gray-300 mb-3'>
                  {ad.description}
                </p>
                <button
                  className={`w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                    ad.type === 'premium'
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {ad.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Industry News Section */}
          <div className='bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm'>
            <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center gap-2'>
                <TrendingUp className='w-5 h-5 text-green-600 dark:text-green-400' />
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  Industry News
                </h3>
              </div>
            </div>

            <div className='p-4 space-y-4'>
              {newsItems.map((news) => (
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
                        <span className='bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full'>
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

          {/* Alert Configuration Modal */}
          <AlertConfigurationModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={handleAlertSuccess}
            onError={(error) => showToast({ type: 'error', message: error })}
          />
        </div>
      </div>
    </>
  );
}
