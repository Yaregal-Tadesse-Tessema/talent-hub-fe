'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IconBaseProps } from 'react-icons';
import OverviewTab from './employer/OverviewTab';
import PostJobTab from './employer/PostJobTab';
import MyJobsTab from './employer/MyJobsTab';
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

export default function EmployerDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && TABS.some((t) => t.key === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    router.push(`/dashboard?tab=${tabKey}`);
  };

  function renderTabContent() {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
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
    <div className='flex min-h-screen bg-gray-50 px-16'>
      {/* Sidebar Navigation (Employer) */}
      <aside className='w-64 min-w-64 bg-white border-r p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-xs font-semibold text-gray-400 mb-6'>
            EMPLOYERS DASHBOARD
          </h2>
          <nav className='flex flex-col gap-2'>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-4 py-2 rounded-lg flex items-center gap-3 ${activeTab === tab.key ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
              >
                <span className='text-lg'>{tab.icon({})}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <button className='flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm mt-8'>
          <span className='text-lg'>↩</span> Log-out
        </button>
      </aside>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-6'>{renderTabContent()}</main>
    </div>
  );
}
