'use client';
import React, { useState } from 'react';
import OverviewTab from './components/candidate/OverviewTab';
import AppliedJobsTab from './components/candidate/AppliedJobsTab';
import FavoriteJobsTab from './components/candidate/FavoriteJobsTab';
import JobAlertsTab from './components/candidate/JobAlertsTab';
import SettingsTab from './components/candidate/SettingsTab';

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'applied', label: 'Applied Jobs' },
  { key: 'favorite', label: 'Favorite Jobs' },
  { key: 'alerts', label: 'Job Alert' },
  { key: 'settings', label: 'Settings' },
];

export default function CandidateDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className='flex min-h-screen bg-gray-50 px-16'>
      {/* Sidebar Navigation (Candidate) */}
      <aside className='w-64 bg-white border-r p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-xs font-semibold text-gray-400 mb-6'>
            CANDIDATE DASHBOARD
          </h2>
          <nav className='flex flex-col gap-2'>
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'overview' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('applied')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'applied' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span>Applied Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('favorite')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'favorite' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span>Favorite Jobs</span>
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 relative ${activeTab === 'alerts' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span>Job Alert</span>
              <span className='ml-auto bg-gray-200 text-xs px-2 py-0.5 rounded-full'>
                09
              </span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${activeTab === 'settings' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-700'}`}
            >
              <span>Settings</span>
            </button>
          </nav>
        </div>
        <button className='flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm mt-8'>
          <span className='text-lg'>↩</span> Log-out
        </button>
      </aside>

      {/* Main Content */}
      {renderTabContent()}
    </div>
  );
}
