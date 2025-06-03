'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import OverviewTab from './employer/OverviewTab';
import PostJobTab from './employer/PostJobTab';
import MyJobsTab from './employer/MyJobsTab';
import ProfileTab from './employer/ProfileTab';
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
  { key: 'profile', label: 'Employers Profile', icon: FiUser },
  { key: 'post-job', label: 'Post a Job', icon: FiPlusCircle },
  { key: 'myjobs', label: 'My Jobs', icon: FiBriefcase },
  { key: 'saved', label: 'Saved Candidate', icon: FiBookmark },
  { key: 'plans', label: 'Plans & Billing', icon: FiCreditCard },
  { key: 'companies', label: 'All Companies', icon: FiUsers },
  { key: 'settings', label: 'Settings', icon: FiSettings },
] as const;

function EmployerDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TABS.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    router.push(`/dashboard?tab=${tabKey}`);
    // Close sidebar on mobile after tab change
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'profile':
        return <ProfileTab />;
      case 'post-job':
        return <PostJobTab />;
      case 'myjobs':
        return <MyJobsTab />;
      // Add more cases for other tabs as needed
      default:
        return <OverviewTab />;
    }
  }

  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Mobile Menu Button */}
      <button
        className='fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg md:hidden'
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <FiX className='w-6 h-6' />
        ) : (
          <FiMenu className='w-6 h-6' />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed  left-0 z-40 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className='p-6'>
          <h2 className='text-xs font-semibold text-gray-400 mb-6'>
            EMPLOYER DASHBOARD
          </h2>
          <nav className='flex flex-col gap-2'>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'bg-blue-50 text-blue-600'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className='w-5 h-5' />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className=' bottom-0 left-0 right-0 p-6'>
          <button className='flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm'>
            <FiLogOut className='w-5 h-5' />
            <span>Log-out</span>
          </button>
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
    <Suspense fallback={<div>Loading...</div>}>
      <EmployerDashboardContent />
    </Suspense>
  );
}
