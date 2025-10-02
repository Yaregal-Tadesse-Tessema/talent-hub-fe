'use client';

import React from 'react';
import { usePostHog } from '@/contexts/PostHogContext';
import { AnalyticsService } from '@/services/analyticsService';

export default function PostHogTest() {
  const { trackEvent, posthog, isLoaded } = usePostHog();

  const testBasicEvent = () => {
    console.log('🧪 Testing PostHog basic event...');
    trackEvent('Test Event', {
      message: 'Hello from TalentHub!',
      timestamp: new Date().toISOString(),
      test: true,
    });
    console.log('✅ Test event sent to PostHog');
  };

  const testAnalyticsService = () => {
    console.log('🧪 Testing Analytics Service...');
    AnalyticsService.trackJobSearch(
      'Software Engineer',
      { location: 'Remote' },
      25,
    );
    AnalyticsService.trackCVDownload('modern', 'pdf');
    AnalyticsService.trackDarkModeToggle(true);
    console.log('✅ Analytics Service events sent');
  };

  const testUserIdentification = () => {
    console.log('🧪 Testing user identification...');
    if (posthog) {
      posthog.identify('test-user-123', {
        email: 'test@example.com',
        name: 'Test User',
        role: 'employee',
      });
      console.log('✅ User identified in PostHog');
    }
  };

  const checkPostHogStatus = () => {
    console.log('🔍 PostHog Status Check:');
    console.log('- PostHog loaded:', isLoaded);
    console.log('- PostHog instance:', posthog);
    console.log(
      '- PostHog key configured:',
      !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
    );
    console.log('- PostHog host:', process.env.NEXT_PUBLIC_POSTHOG_HOST);

    if (posthog) {
      console.log('- PostHog config:', posthog.config);
      console.log('- PostHog session ID:', posthog.get_session_id());
    }
  };

  if (!isLoaded) {
    return (
      <div className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg'>
        <h3 className='text-lg font-semibold text-yellow-800'>
          PostHog Test Panel
        </h3>
        <p className='text-yellow-700'>PostHog is loading...</p>
      </div>
    );
  }

  return (
    <div className='p-6 bg-blue-50 border border-blue-200 rounded-lg space-y-4'>
      <h3 className='text-lg font-semibold text-blue-800'>
        🧪 PostHog Test Panel
      </h3>
      <p className='text-blue-700 text-sm'>
        Use these buttons to test PostHog integration. Check browser console and
        PostHog dashboard for results.
      </p>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <button
          onClick={testBasicEvent}
          className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
        >
          Test Basic Event
        </button>

        <button
          onClick={testAnalyticsService}
          className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'
        >
          Test Analytics Service
        </button>

        <button
          onClick={testUserIdentification}
          className='px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors'
        >
          Test User ID
        </button>

        <button
          onClick={checkPostHogStatus}
          className='px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors'
        >
          Check Status
        </button>
      </div>

      <div className='text-xs text-gray-600 space-y-1'>
        <p>
          <strong>Status:</strong>{' '}
          {isLoaded ? '✅ PostHog Loaded' : '❌ PostHog Not Loaded'}
        </p>
        <p>
          <strong>API Key:</strong>{' '}
          {process.env.NEXT_PUBLIC_POSTHOG_KEY ? '✅ Configured' : '❌ Missing'}
        </p>
        <p>
          <strong>Instructions:</strong> Click buttons above, then check PostHog
          dashboard for events
        </p>
      </div>
    </div>
  );
}
