'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  HomeIcon,
  BriefcaseIcon,
  HeartIcon,
  BellIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    // Get user type from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserType(userData?.role);
        setUserProfile(userData);
      } catch {
        setUserType(null);
        setUserProfile(null);
      }
    } else {
      setUserType(null);
      setUserProfile(null);
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

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        sidebarOpen &&
        !target.closest('.sidebar') &&
        !target.closest('.mobile-menu-button')
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'applied':
        return <AppliedJobsTab />;
      case 'favorite':
        return <FavoriteJobsTab />;
      case 'alerts':
        return (
          <JobAlertsTab
            userProfile={userProfile}
            setUserProfile={setUserProfile}
          />
        );
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
      {/* Mobile menu button */}
      <button
        className='mobile-menu-button fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700'
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? (
          <XMarkIcon className='w-6 h-6 text-gray-600 dark:text-gray-300' />
        ) : (
          <Bars3Icon className='w-6 h-6 text-gray-600 dark:text-gray-300' />
        )}
      </button>

      {/* Sidebar Navigation (Candidate) */}
      <aside
        className={`sidebar fixed inset-y-0 left-0 z-40 pt-8 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full p-4 lg:p-6'>
          <div className='flex-1'>
            <h2 className='text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider'>
              Candidate Dashboard
            </h2>
            <nav className='flex flex-col gap-2 lg:gap-3'>
              {TABS.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      // Close sidebar on mobile after tab selection
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`group relative px-3 py-2 lg:px-4 lg:py-3 rounded-lg font-medium flex items-center gap-3 transition-all duration-200 ${
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
                    <span className='font-medium text-sm lg:text-base'>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile section at bottom */}
          <div className='mt-6 pt-4 border-t border-gray-200 dark:border-gray-700'>
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
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className='flex-1 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20'>
        {/* Mobile header */}
        <div className='lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4'>
          <div className='flex items-center justify-between'>
            <h1 className='text-lg font-semibold text-gray-900 dark:text-white'>
              {TABS.find((tab) => tab.key === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>
        </div>

        {/* Content Area */}
        <div className='relative p-4 lg:p-6'>{renderTabContent()}</div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className='flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-300'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <p className='text-lg'>Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
