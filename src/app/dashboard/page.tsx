'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import OverviewTab from './components/candidate/OverviewTab';
import AppliedJobsTab from './components/candidate/AppliedJobsTab';
import FavoriteJobsTab from './components/candidate/FavoriteJobsTab';
import JobAlertsTab from './components/candidate/JobAlertsTab';
import SettingsTab from './components/candidate/SettingsTab';
import EmployerDashboard from './components/EmployerDashboard';

// Job-specific routes (e.g., /dashboard/jobs/[jobId]/applications) are handled in the jobs directory.

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'applied', label: 'Applied Jobs' },
  { key: 'favorite', label: 'Favorite Jobs' },
  { key: 'alerts', label: 'Job Alert' },
  { key: 'settings', label: 'Settings' },
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
    <div className='flex min-h-screen bg-gray-50 px-16'>
      {/* Sidebar Navigation (Candidate) */}
      <aside className='w-64 bg-white border-r p-6 flex flex-col justify-between'>
        <div>
          <h2 className='text-xs font-semibold text-gray-400 mb-6'>
            CANDIDATE DASHBOARD
          </h2>
          <nav className='flex flex-col gap-2'>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
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
      <main className='flex-1'>{renderTabContent()}</main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
