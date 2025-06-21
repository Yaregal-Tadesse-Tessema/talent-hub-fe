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
            <h2 className='text-xs font-semibold text-gray-400 dark:text-gray-500 mb-6'>
              EMPLOYER DASHBOARD
            </h2>
            <nav className='flex flex-col gap-2 overflow-y-auto'>
              {TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      activeTab === tab.key
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className='w-5 h-5' />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          <div className='mt-auto border-t border-gray-200 dark:border-gray-700 p-6'></div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 transition-all p-4 duration-200 ease-in-out ${
          isSidebarOpen ? 'ml-64' : 'ml-0'
        } md:ml-64`}
      >
        {renderTabContent()}
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
