import { Tutorial } from '@/contexts/TutorialContext';

export const TUTORIALS: Tutorial[] = [
  // Employee Tutorial - Find Job Page
  {
    id: 'employee-find-job',
    name: 'Find Your Perfect Job',
    description: 'Learn how to search and apply for jobs effectively',
    role: 'employee',
    page: '/find-job',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Job Search!',
        content:
          "Let's take a quick tour to help you find your perfect job. We'll show you how to search, filter, and apply for positions.",
        target: 'body',
        position: 'center',
        skipable: true,
      },
      {
        id: 'search-bar',
        title: 'Search for Jobs',
        content:
          'Use the search bar to find jobs by title, company, or keywords. Try searching for roles like "Software Engineer" or "Marketing Manager".',
        target: '[data-tutorial="search-bar"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Try searching',
      },
      {
        id: 'filters',
        title: 'Refine Your Search',
        content:
          'Use filters to narrow down results by location, experience level, salary range, and more. This helps you find the most relevant opportunities.',
        target: '[data-tutorial="filters"]',
        position: 'left',
        action: 'click',
        actionText: 'Open filters',
      },
      {
        id: 'job-card',
        title: 'Job Details',
        content:
          'Click on any job card to see detailed information including requirements, benefits, and company details.',
        target: '[data-tutorial="job-card"]',
        position: 'bottom',
        action: 'click',
        actionText: 'View job details',
      },
      {
        id: 'apply-button',
        title: 'Apply for Jobs',
        content:
          'When you find a job you like, click the "Apply" button to submit your application. Make sure your profile is complete first!',
        target: '[data-tutorial="apply-button"]',
        position: 'top',
        action: 'click',
        actionText: 'Apply now',
      },
      {
        id: 'profile-completion',
        title: 'Complete Your Profile',
        content:
          'A complete profile increases your chances of getting hired. Add your skills, experience, and upload your resume.',
        target: '[data-tutorial="profile-link"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Go to profile',
      },
    ],
  },

  // Employee Tutorial - Dashboard
  {
    id: 'employee-dashboard',
    name: 'Your Dashboard',
    description: 'Learn how to navigate your personal dashboard',
    role: 'employee',
    page: '/dashboard',
    steps: [
      {
        id: 'welcome-dashboard',
        title: 'Welcome to Your Dashboard!',
        content:
          'This is your personal command center. Here you can manage your profile, track applications, and access all your tools.',
        target: 'body',
        position: 'center',
        skipable: true,
      },
      {
        id: 'profile-section',
        title: 'Profile Management',
        content:
          'Keep your profile up to date with your latest skills, experience, and contact information. Employers will see this information.',
        target: '[data-tutorial="profile-section"]',
        position: 'right',
        action: 'click',
        actionText: 'Edit profile',
      },
      {
        id: 'applications',
        title: 'Track Applications',
        content:
          'Monitor the status of all your job applications. See which ones are under review, accepted, or need follow-up.',
        target: '[data-tutorial="applications"]',
        position: 'bottom',
        action: 'click',
        actionText: 'View applications',
      },
      {
        id: 'resume-builder',
        title: 'Resume Builder',
        content:
          'Create professional resumes with our AI-powered builder. Choose from multiple templates and formats.',
        target: '[data-tutorial="resume-builder"]',
        position: 'left',
        action: 'click',
        actionText: 'Build resume',
      },
      {
        id: 'settings',
        title: 'Account Settings',
        content:
          'Manage your account preferences, privacy settings, and notification preferences.',
        target: '[data-tutorial="settings"]',
        position: 'top',
        action: 'click',
        actionText: 'Open settings',
      },
    ],
  },

  // Employer Tutorial - Find Candidates
  {
    id: 'employer-find-candidates',
    name: 'Find Top Talent',
    description: 'Learn how to search and connect with qualified candidates',
    role: 'employer',
    page: '/find-candidates',
    steps: [
      {
        id: 'welcome-employer',
        title: 'Welcome to Candidate Search!',
        content:
          "Find the perfect candidates for your open positions. Let's explore how to search and connect with top talent.",
        target: 'body',
        position: 'center',
        skipable: true,
      },
      {
        id: 'search-candidates',
        title: 'Search for Candidates',
        content:
          'Use the search bar to find candidates by skills, job titles, or keywords. Try searching for specific roles or technologies.',
        target: '[data-tutorial="search-candidates"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Search candidates',
      },
      {
        id: 'advanced-filters',
        title: 'Advanced Filters',
        content:
          'Use filters to find candidates by experience level, education, location, salary expectations, and more.',
        target: '[data-tutorial="advanced-filters"]',
        position: 'left',
        action: 'click',
        actionText: 'Apply filters',
      },
      {
        id: 'candidate-card',
        title: 'Candidate Profiles',
        content:
          'Click on candidate cards to view detailed profiles, including skills, experience, and contact information.',
        target: '[data-tutorial="candidate-card"]',
        position: 'bottom',
        action: 'click',
        actionText: 'View profile',
      },
      {
        id: 'save-candidate',
        title: 'Save Candidates',
        content:
          'Save promising candidates to your shortlist for easy access later. You can add notes and organize them by position.',
        target: '[data-tutorial="save-candidate"]',
        position: 'top',
        action: 'click',
        actionText: 'Save candidate',
      },
      {
        id: 'contact-candidate',
        title: 'Contact Candidates',
        content:
          'Reach out to candidates directly through our messaging system. Start conversations and schedule interviews.',
        target: '[data-tutorial="contact-candidate"]',
        position: 'right',
        action: 'click',
        actionText: 'Send message',
      },
    ],
  },

  // Employer Tutorial - Dashboard
  {
    id: 'employer-dashboard',
    name: 'Employer Dashboard',
    description: 'Learn how to manage your recruitment process',
    role: 'employer',
    page: '/dashboard',
    steps: [
      {
        id: 'welcome-employer-dashboard',
        title: 'Welcome to Your Employer Dashboard!',
        content:
          'Manage your recruitment process, post jobs, and track candidate applications all in one place.',
        target: 'body',
        position: 'center',
        skipable: true,
      },
      {
        id: 'post-job',
        title: 'Post a New Job',
        content:
          'Create and publish new job openings. Add detailed descriptions, requirements, and benefits to attract the best candidates.',
        target: '[data-tutorial="post-job"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Post job',
      },
      {
        id: 'manage-jobs',
        title: 'Manage Job Postings',
        content:
          'View and edit your active job postings. Update descriptions, close positions, or extend deadlines.',
        target: '[data-tutorial="manage-jobs"]',
        position: 'right',
        action: 'click',
        actionText: 'Manage jobs',
      },
      {
        id: 'applications',
        title: 'Review Applications',
        content:
          'Review and manage incoming job applications. Sort by status, experience level, or application date.',
        target: '[data-tutorial="applications"]',
        position: 'left',
        action: 'click',
        actionText: 'View applications',
      },
      {
        id: 'saved-candidates',
        title: 'Saved Candidates',
        content:
          'Access your shortlisted candidates. Add notes, organize by position, and track your recruitment pipeline.',
        target: '[data-tutorial="saved-candidates"]',
        position: 'top',
        action: 'click',
        actionText: 'View saved candidates',
      },
      {
        id: 'analytics',
        title: 'Recruitment Analytics',
        content:
          'Track your recruitment performance with detailed analytics. Monitor application rates, candidate quality, and hiring success.',
        target: '[data-tutorial="analytics"]',
        position: 'bottom',
        action: 'click',
        actionText: 'View analytics',
      },
    ],
  },

  // General Tutorial - Navigation
  {
    id: 'general-navigation',
    name: 'Getting Started',
    description: 'Learn the basics of navigating the platform',
    role: 'both',
    page: '*',
    steps: [
      {
        id: 'welcome-general',
        title: 'Welcome to Talent Hub!',
        content:
          "We're excited to help you succeed. Let's take a quick tour to get you familiar with the platform.",
        target: 'body',
        position: 'center',
        skipable: true,
      },
      {
        id: 'navigation',
        title: 'Navigation Menu',
        content:
          'Use the navigation menu to access different sections of the platform. The menu adapts based on your role.',
        target: '[data-tutorial="navigation"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Explore menu',
      },
      {
        id: 'notifications',
        title: 'Notifications',
        content:
          'Stay updated with important notifications about applications, messages, and platform updates.',
        target: '[data-tutorial="notifications"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Check notifications',
      },
      {
        id: 'profile-menu',
        title: 'Profile Menu',
        content:
          'Access your profile, settings, and account options from the profile menu in the top right.',
        target: '[data-tutorial="profile-menu"]',
        position: 'bottom',
        action: 'click',
        actionText: 'Open profile menu',
      },
      {
        id: 'help-support',
        title: 'Help & Support',
        content:
          'Need help? Access our help center, contact support, or view tutorials anytime.',
        target: '[data-tutorial="help-support"]',
        position: 'top',
        action: 'click',
        actionText: 'Get help',
      },
    ],
  },
];

// Helper function to get tutorials for a specific role and page
export function getTutorialsForRole(
  role: 'employee' | 'employer',
  page: string,
): Tutorial[] {
  return TUTORIALS.filter(
    (tutorial) =>
      (tutorial.role === role || tutorial.role === 'both') &&
      (tutorial.page === page || tutorial.page === '*'),
  );
}

// Helper function to get a specific tutorial by ID
export function getTutorialById(id: string): Tutorial | undefined {
  return TUTORIALS.find((tutorial) => tutorial.id === id);
}
