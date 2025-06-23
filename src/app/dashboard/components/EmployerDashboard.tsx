'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OverviewTab from './employer/OverviewTab';
import MyJobsTab from './employer/MyJobsTab';
import SettingsTab from './employer/SettingsTab';
import {
  FiHome,
  FiUser,
  FiPlusCircle,
  FiBriefcase,
  FiBookmark,
  FiCreditCard,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';

const TABS = [
  { key: 'overview', label: 'Overview', icon: FiHome },
  { key: 'myjobs', label: 'My Jobs', icon: FiBriefcase },
  { key: 'saved', label: 'Saved Candidate', icon: FiBookmark },
  { key: 'plans', label: 'Plans & Billing', icon: FiCreditCard },
  { key: 'settings', label: 'Settings', icon: FiSettings },
] as const;

function EmployerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (searchParams) {
      const tab = searchParams.get('tab');
      if (tab && TABS.some((t) => t.key === tab)) {
        setActiveTab(tab);
      }
    }
  }, [searchParams]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    // Clear any job-specific parameters when switching tabs
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('tab', tabKey);
    router.push(`/dashboard?${newSearchParams.toString()}`);
    // Close sidebar on mobile after tab change
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'myjobs':
        return <MyJobsTab />;
      case 'settings':
        return <SettingsTab />;
      // Add more cases for other tabs as needed
      default:
        return <OverviewTab />;
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Mobile Menu Button */}
      <button
        className='fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg md:hidden border border-gray-200 dark:border-gray-700'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <FiX className='w-6 h-6 text-gray-700 dark:text-gray-300' />
        ) : (
          <FiMenu className='w-6 h-6 text-gray-700 dark:text-gray-300' />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 pt-20 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='flex flex-col h-full'>
          <div className='p-6'>
            <h2 className='text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6 uppercase tracking-wider'>
              Employer Dashboard
            </h2>
            <nav className='flex flex-col gap-3 overflow-y-auto'>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
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
                      <Icon className='w-5 h-5' />
                    </div>

                    {/* Label */}
                    <span className='font-medium'>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User profile section at bottom 
          <div className='mt-auto border-t border-gray-200 dark:border-gray-700 p-6'>
            <div className='flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600'>
              <div className='w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center'>
                <span className='text-white text-sm font-bold'>E</span>
              </div>
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                  Employer Profile
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Company
                </p>
              </div>
            </div>
          </div>
          */}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all duration-200 ease-in-out bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20 ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } md:ml-64`}
      >
        <div className='relative'>{renderTabContent()}</div>
      </main>
    </div>
  );
}

export default function EmployerDashboard() {
  return (
    <Suspense
      fallback={
        <div className='flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center'>
          <div className='text-gray-600 dark:text-gray-300'>Loading...</div>
        </div>
      }
    >
      <EmployerDashboardContent />
    </Suspense>
  );
}
