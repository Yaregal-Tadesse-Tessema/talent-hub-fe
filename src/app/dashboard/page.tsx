'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HomeIcon,
  BriefcaseIcon,
  HeartIcon,
  BellIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import OverviewTab from './components/candidate/OverviewTab';
import AppliedJobsTab from './components/candidate/AppliedJobsTab';
import FavoriteJobsTab from './components/candidate/FavoriteJobsTab';
import JobAlertsTab from './components/candidate/JobAlertsTab';
import SettingsTab from './components/candidate/SettingsTab';
import EmployerDashboard from './components/EmployerDashboard';

// Job-specific routes (e.g., /dashboard/jobs/[jobId]/applications) are handled in the jobs directory.

const TABS = [
  { key: 'overview', label: 'Overview', icon: HomeIcon },
  { key: 'applied', label: 'Applied Jobs', icon: BriefcaseIcon },
  { key: 'favorite', label: 'Favorite Jobs', icon: HeartIcon },
  { key: 'alerts', label: 'Job Alert', icon: BellIcon },
  { key: 'settings', label: 'Settings', icon: Cog6ToothIcon },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    // Get user type from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserType(JSON.parse(storedUser)?.role);
      } catch {
        setUserType(null);
      }
    } else {
      setUserType(null);
    }
  }, []);

  useEffect(() => {
    // Set active tab from URL query parameter
    if (searchParams) {
      const tab = searchParams.get('tab');
      if (tab && TABS.some((t) => t.key === tab)) {
        setActiveTab(tab);
      }
    }
  }, [searchParams]);

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'applied':
        return <AppliedJobsTab />;
      case 'favorite':
        return <FavoriteJobsTab />;
      case 'alerts':
        return <JobAlertsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  }

  // Show nothing until userType is loaded
  if (userType === null) return null;

  // Render EmployerDashboard if userType is 'employer'
  if (userType === 'employer') {
    return <EmployerDashboard />;
  }

  // Otherwise, render CandidateDashboard
  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Sidebar Navigation (Candidate) */}
      <aside className='w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider'>
            Candidate Dashboard
          </h2>
          <nav className='flex flex-col gap-3'>
            {TABS.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`group relative px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {/* Icon with simple styling */}
                  <div
                    className={`${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}
                  >
                    <IconComponent className='w-5 h-5' />
                  </div>

                  {/* Label */}
                  <span className='font-medium'>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile section at bottom
        <div className='mt-8 pt-6 border-t border-gray-200 dark:border-gray-700'>
          <div className='flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
              <span className='text-white text-sm font-bold'>U</span>
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                User Profile
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-400'>
                Candidate
              </p>
            </div>
          </div>
        </div>
        */}
      </aside>
      {/* Main Content */}
      <main className='flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20'>
        {/* Content Area */}
        <div className='relative'>{renderTabContent()}</div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300'>
          Loading...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
