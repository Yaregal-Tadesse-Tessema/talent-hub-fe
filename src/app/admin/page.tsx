'use client';

import { useState } from 'react';
import JobCreationForm from '@/components/admin/JobCreationForm';
import AdminRouteGuard from '@/components/admin/AdminRouteGuard';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('jobs');

  const tabs = [
    { id: 'jobs', label: 'Job Management', component: <JobCreationForm /> },
    {
      id: 'companies',
      label: 'Company Management',
      component: (
        <div className='p-6'>Company management features coming soon...</div>
      ),
    },
    {
      id: 'users',
      label: 'User Management',
      component: (
        <div className='p-6'>User management features coming soon...</div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      component: <div className='p-6'>Settings features coming soon...</div>,
    },
  ];

  return (
    <AdminRouteGuard>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
              Admin Dashboard
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-400'>
              Manage jobs, companies, and system settings
            </p>
          </div>

          {/* Tab Navigation */}
          <div className='border-b border-gray-200 dark:border-gray-700 mb-8'>
            <nav className='-mb-px flex space-x-8'>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
            {tabs.find((tab) => tab.id === activeTab)?.component}
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  );
}
