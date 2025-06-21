export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  subject: string;
  html: string;
  placeholders: string[];
  description: string;
  flags: {
    userType: 'employee' | 'employer' | 'admin' | 'all';
    context:
      | 'application'
      | 'support'
      | 'onboarding'
      | 'system'
      | 'marketing'
      | 'all';
    isActive: boolean;
  };
}

// User Onboarding & Account Templates
export const ONBOARDING_TEMPLATES: EmailTemplate[] = [
  {
    id: 'welcome-email',
    name: 'Welcome Email',
    category: 'User Onboarding & Account',
    subject: 'Welcome to Talent – Start exploring new opportunities!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Talent Hub!</h2>
        <p>Hi {{firstName}},</p>
        <p>Welcome to Talent Hub! We're excited to have you join our community of professionals and opportunities.</p>
        <p>Here's what you can do to get started:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Browse available opportunities</li>
          <li>Connect with other professionals</li>
        </ul>
        <p>If you have any questions, feel free to reach out to our support team.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName'],
    description: 'Welcome email for new users joining the platform',
    flags: {
      userType: 'all',
      context: 'onboarding',
      isActive: true,
    },
  },
  {
    id: 'email-verification',
    name: 'Email Verification',
    category: 'User Onboarding & Account',
    subject: 'Verify your email to activate your account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Verify Your Email</h2>
        <p>Hi {{firstName}},</p>
        <p>Please verify your email address to activate your Talent Hub account.</p>
        <p>Click the button below to verify your email:</p>
        <a href="{{verificationLink}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>{{verificationLink}}</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName', 'verificationLink'],
    description: 'Email verification link for new account activation',
    flags: {
      userType: 'all',
      context: 'onboarding',
      isActive: true,
    },
  },
  {
    id: 'password-reset',
    name: 'Password Reset',
    category: 'User Onboarding & Account',
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>Hi {{firstName}},</p>
        <p>We received a request to reset your password for your Talent Hub account.</p>
        <p>Click the button below to reset your password:</p>
        <a href="{{resetLink}}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName', 'resetLink'],
    description: 'Password reset link for account recovery',
    flags: {
      userType: 'all',
      context: 'onboarding',
      isActive: true,
    },
  },
  {
    id: 'password-changed',
    name: 'Password Changed Confirmation',
    category: 'User Onboarding & Account',
    subject: 'Your password has been successfully changed',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Password Changed Successfully</h2>
        <p>Hi {{firstName}},</p>
        <p>Your password has been successfully changed for your Talent Hub account.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName'],
    description: 'Confirmation email when password is successfully changed',
    flags: {
      userType: 'all',
      context: 'onboarding',
      isActive: true,
    },
  },
  {
    id: 'account-deactivation',
    name: 'Account Deactivation Confirmation',
    category: 'User Onboarding & Account',
    subject: 'Your account has been deactivated',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Account Deactivated</h2>
        <p>Hi {{firstName}},</p>
        <p>Your Talent Hub account has been deactivated as requested.</p>
        <p>If you change your mind, you can reactivate your account by logging in within 30 days.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName'],
    description: 'Confirmation email when account is deactivated',
    flags: {
      userType: 'all',
      context: 'onboarding',
      isActive: true,
    },
  },
];

// Job Seeker (Employee) Templates
export const EMPLOYEE_TEMPLATES: EmailTemplate[] = [
  {
    id: 'job-application-confirmation',
    name: 'Job Application Confirmation',
    category: 'Job Seeker Notifications',
    subject: "You've successfully applied to {{jobTitle}} at {{companyName}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Submitted Successfully</h2>
        <p>Hi {{firstName}},</p>
        <p>Your application for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> has been submitted successfully.</p>
        <p>Application Details:</p>
        <ul>
          <li><strong>Position:</strong> {{jobTitle}}</li>
          <li><strong>Company:</strong> {{companyName}}</li>
          <li><strong>Applied Date:</strong> {{appliedDate}}</li>
        </ul>
        <p>We'll notify you when the employer reviews your application.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName', 'jobTitle', 'companyName', 'appliedDate'],
    description: 'Confirmation email when job application is submitted',
    flags: {
      userType: 'employee',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'application-status-update',
    name: 'Job Application Status Update',
    category: 'Job Seeker Notifications',
    subject: 'Your application for {{jobTitle}} is now {{status}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Application Status Update</h2>
        <p>Hi {{firstName}},</p>
        <p>Your application for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> has been updated.</p>
        <p><strong>New Status:</strong> {{status}}</p>
        <p>{{statusMessage}}</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'firstName',
      'jobTitle',
      'companyName',
      'status',
      'statusMessage',
    ],
    description: 'Status update notification for job applications',
    flags: {
      userType: 'employee',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'interview-invitation',
    name: 'Interview Invitation',
    category: 'Job Seeker Notifications',
    subject: "You've been invited to an interview for {{jobTitle}}",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Interview Invitation</h2>
        <p>Hi {{firstName}},</p>
        <p>Congratulations! You've been invited to an interview for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong>.</p>
        <p><strong>Interview Details:</strong></p>
        <ul>
          <li><strong>Date:</strong> {{interviewDate}}</li>
          <li><strong>Time:</strong> {{interviewTime}}</li>
          <li><strong>Type:</strong> {{interviewType}}</li>
          <li><strong>Location/Link:</strong> {{interviewLocation}}</li>
        </ul>
        <p>Please confirm your attendance by responding to this email or through the platform.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'firstName',
      'jobTitle',
      'companyName',
      'interviewDate',
      'interviewTime',
      'interviewType',
      'interviewLocation',
    ],
    description: 'Interview invitation for job candidates',
    flags: {
      userType: 'employee',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'application-deadline-reminder',
    name: 'Application Deadline Reminder',
    category: 'Job Seeker Notifications',
    subject: 'Reminder: {{jobTitle}} closes in {{daysLeft}} days',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Application Deadline Reminder</h2>
        <p>Hi {{firstName}},</p>
        <p>Don't miss out! The application for <strong>{{jobTitle}}</strong> at <strong>{{companyName}}</strong> closes in {{daysLeft}} days.</p>
        <p>If you're interested in this position, make sure to submit your application before the deadline.</p>
        <p><strong>Deadline:</strong> {{deadlineDate}}</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'firstName',
      'jobTitle',
      'companyName',
      'daysLeft',
      'deadlineDate',
    ],
    description: 'Reminder for job application deadlines',
    flags: {
      userType: 'employee',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'new-job-recommendations',
    name: 'New Job Recommendations',
    category: 'Job Seeker Notifications',
    subject: 'New jobs you might be interested in, based on your profile',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Job Opportunities</h2>
        <p>Hi {{firstName}},</p>
        <p>We found some new job opportunities that match your profile and preferences:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0;">{{jobTitle1}}</h3>
          <p><strong>{{companyName1}}</strong> • {{location1}}</p>
          <p>{{jobDescription1}}</p>
          <a href="{{jobLink1}}" style="color: #2563eb;">View Job</a>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0;">{{jobTitle2}}</h3>
          <p><strong>{{companyName2}}</strong> • {{location2}}</p>
          <p>{{jobDescription2}}</p>
          <a href="{{jobLink2}}" style="color: #2563eb;">View Job</a>
        </div>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'firstName',
      'jobTitle1',
      'companyName1',
      'location1',
      'jobDescription1',
      'jobLink1',
      'jobTitle2',
      'companyName2',
      'location2',
      'jobDescription2',
      'jobLink2',
    ],
    description: 'Weekly job recommendations based on user profile',
    flags: {
      userType: 'employee',
      context: 'marketing',
      isActive: true,
    },
  },
];

// Employer Templates
export const EMPLOYER_TEMPLATES: EmailTemplate[] = [
  {
    id: 'job-post-approval',
    name: 'Job Post Approval',
    category: 'Employer Notifications',
    subject: 'Your job post for {{jobTitle}} has been approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Job Post Approved</h2>
        <p>Hi {{employerName}},</p>
        <p>Great news! Your job post for <strong>{{jobTitle}}</strong> has been approved and is now live on our platform.</p>
        <p>Your job post will be visible to qualified candidates and will remain active until {{expiryDate}}.</p>
        <p>You'll receive notifications when candidates apply for this position.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['employerName', 'jobTitle', 'expiryDate'],
    description: 'Confirmation when job post is approved',
    flags: {
      userType: 'employer',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'new-applicant-notification',
    name: 'New Applicant Notification',
    category: 'Employer Notifications',
    subject: 'You have a new applicant for {{jobTitle}}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Applicant</h2>
        <p>Hi {{employerName}},</p>
        <p>You have a new applicant for <strong>{{jobTitle}}</strong>.</p>
        <p><strong>Applicant Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> {{applicantName}}</li>
          <li><strong>Applied Date:</strong> {{appliedDate}}</li>
          <li><strong>Experience:</strong> {{applicantExperience}}</li>
        </ul>
        <p>Log in to your dashboard to review the application and take action.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'employerName',
      'jobTitle',
      'applicantName',
      'appliedDate',
      'applicantExperience',
    ],
    description: 'Notification when a new candidate applies',
    flags: {
      userType: 'employer',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'job-post-expiry-reminder',
    name: 'Job Post Expiry Reminder',
    category: 'Employer Notifications',
    subject: 'Your job post for {{jobTitle}} is expiring in {{daysLeft}} days',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Job Post Expiring Soon</h2>
        <p>Hi {{employerName}},</p>
        <p>Your job post for <strong>{{jobTitle}}</strong> is expiring in {{daysLeft}} days.</p>
        <p><strong>Expiry Date:</strong> {{expiryDate}}</p>
        <p>If you'd like to extend the posting or repost the position, please log in to your dashboard.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['employerName', 'jobTitle', 'daysLeft', 'expiryDate'],
    description: 'Reminder when job post is about to expire',
    flags: {
      userType: 'employer',
      context: 'application',
      isActive: true,
    },
  },
  {
    id: 'daily-application-summary',
    name: 'Daily Application Summary',
    category: 'Employer Notifications',
    subject: "Here's a summary of applicants for your job posts",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Daily Application Summary</h2>
        <p>Hi {{employerName}},</p>
        <p>Here's a summary of applications received for your job posts today:</p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0;">{{jobTitle1}}</h3>
          <p><strong>{{applicantCount1}}</strong> new applications</p>
          <p>Total applications: {{totalApplicants1}}</p>
        </div>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <h3 style="margin-top: 0;">{{jobTitle2}}</h3>
          <p><strong>{{applicantCount2}}</strong> new applications</p>
          <p>Total applications: {{totalApplicants2}}</p>
        </div>
        <p>Log in to your dashboard to review and manage applications.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'employerName',
      'jobTitle1',
      'applicantCount1',
      'totalApplicants1',
      'jobTitle2',
      'applicantCount2',
      'totalApplicants2',
    ],
    description: 'Daily summary of applications for employer job posts',
    flags: {
      userType: 'employer',
      context: 'application',
      isActive: true,
    },
  },
];

// Support & System Templates
export const SUPPORT_TEMPLATES: EmailTemplate[] = [
  {
    id: 'contact-support-acknowledgement',
    name: 'Contact Us Acknowledgement',
    category: 'Platform/Admin Notifications',
    subject: "Thanks for reaching out – we'll get back to you shortly",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">We've Received Your Message</h2>
        <p>Hi {{firstName}},</p>
        <p>Thank you for contacting Talent Hub support. We've received your message and will get back to you within 24-48 hours.</p>
        <p><strong>Reference Number:</strong> {{referenceNumber}}</p>
        <p><strong>Subject:</strong> {{subject}}</p>
        <p>If you have any urgent concerns, please don't hesitate to reach out again.</p>
        <p>Best regards,<br>The Talent Hub Support Team</p>
      </div>
    `,
    placeholders: ['firstName', 'referenceNumber', 'subject'],
    description: 'Acknowledgement for support requests',
    flags: {
      userType: 'all',
      context: 'support',
      isActive: true,
    },
  },
  {
    id: 'system-maintenance',
    name: 'System Maintenance Notification',
    category: 'Platform/Admin Notifications',
    subject:
      'Planned maintenance on {{maintenanceDate}} – Platform may be unavailable',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Scheduled Maintenance Notice</h2>
        <p>Hi {{firstName}},</p>
        <p>We wanted to let you know that Talent Hub will be undergoing scheduled maintenance on <strong>{{maintenanceDate}}</strong> from <strong>{{startTime}}</strong> to <strong>{{endTime}}</strong>.</p>
        <p>During this time, the platform may be temporarily unavailable. We apologize for any inconvenience this may cause.</p>
        <p>We're working to improve your experience and will be back online as soon as possible.</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: ['firstName', 'maintenanceDate', 'startTime', 'endTime'],
    description: 'Notification for scheduled system maintenance',
    flags: {
      userType: 'all',
      context: 'system',
      isActive: true,
    },
  },
  {
    id: 'reported-job-notification',
    name: 'Reported Job/Spam Notification',
    category: 'Platform/Admin Notifications',
    subject: 'A job post has been reported',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ef4444;">Job Post Reported</h2>
        <p>Hi Admin,</p>
        <p>A job post has been reported by a user and requires your attention.</p>
        <p><strong>Reported Job:</strong> {{jobTitle}}</p>
        <p><strong>Company:</strong> {{companyName}}</p>
        <p><strong>Reported By:</strong> {{reporterName}}</p>
        <p><strong>Reason:</strong> {{reportReason}}</p>
        <p><strong>Report Date:</strong> {{reportDate}}</p>
        <p>Please review this report and take appropriate action.</p>
        <p>Best regards,<br>The Talent Hub System</p>
      </div>
    `,
    placeholders: [
      'jobTitle',
      'companyName',
      'reporterName',
      'reportReason',
      'reportDate',
    ],
    description: 'Notification to admin when a job post is reported',
    flags: {
      userType: 'admin',
      context: 'support',
      isActive: true,
    },
  },
];

// Marketing Templates
export const MARKETING_TEMPLATES: EmailTemplate[] = [
  {
    id: 'newsletter-weekly',
    name: 'Weekly Newsletter',
    category: 'Marketing',
    subject: "This week's top opportunities and industry insights",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Weekly Talent Hub Newsletter</h2>
        <p>Hi {{firstName}},</p>
        <p>Here's what's happening this week in the job market:</p>
        <h3>Top Opportunities</h3>
        <ul>
          <li>{{opportunity1}}</li>
          <li>{{opportunity2}}</li>
          <li>{{opportunity3}}</li>
        </ul>
        <h3>Industry Insights</h3>
        <p>{{industryInsight}}</p>
        <p>Stay tuned for more updates next week!</p>
        <p>Best regards,<br>The Talent Hub Team</p>
      </div>
    `,
    placeholders: [
      'firstName',
      'opportunity1',
      'opportunity2',
      'opportunity3',
      'industryInsight',
    ],
    description: 'Weekly newsletter with job opportunities and insights',
    flags: {
      userType: 'all',
      context: 'marketing',
      isActive: true,
    },
  },
];

// Combine all templates
export const EMAIL_TEMPLATES: EmailTemplate[] = [
  ...ONBOARDING_TEMPLATES,
  ...EMPLOYEE_TEMPLATES,
  ...EMPLOYER_TEMPLATES,
  ...SUPPORT_TEMPLATES,
  ...MARKETING_TEMPLATES,
];

// Filter functions
export const getTemplatesByUserType = (
  userType: 'employee' | 'employer' | 'admin' | 'all',
) => {
  return EMAIL_TEMPLATES.filter(
    (template) =>
      template.flags.userType === userType || template.flags.userType === 'all',
  );
};

export const getTemplatesByContext = (
  context:
    | 'application'
    | 'support'
    | 'onboarding'
    | 'system'
    | 'marketing'
    | 'all',
) => {
  return EMAIL_TEMPLATES.filter(
    (template) =>
      template.flags.context === context || template.flags.context === 'all',
  );
};

export const getTemplatesByUserTypeAndContext = (
  userType: 'employee' | 'employer' | 'admin' | 'all',
  context:
    | 'application'
    | 'support'
    | 'onboarding'
    | 'system'
    | 'marketing'
    | 'all',
) => {
  return EMAIL_TEMPLATES.filter(
    (template) =>
      (template.flags.userType === userType ||
        template.flags.userType === 'all') &&
      (template.flags.context === context || template.flags.context === 'all'),
  );
};

export const getActiveTemplates = () => {
  return EMAIL_TEMPLATES.filter((template) => template.flags.isActive);
};

export const getTemplatesByCategory = () => {
  const categories = EMAIL_TEMPLATES.reduce(
    (acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = [];
      }
      acc[template.category].push(template);
      return acc;
    },
    {} as Record<string, EmailTemplate[]>,
  );

  return categories;
};

export const getTemplateById = (id: string): EmailTemplate | undefined => {
  return EMAIL_TEMPLATES.find((template) => template.id === id);
};

// Quick access to specific template groups
export const getEmployeeTemplates = () => getTemplatesByUserType('employee');
export const getEmployerTemplates = () => getTemplatesByUserType('employer');
export const getAdminTemplates = () => getTemplatesByUserType('admin');
export const getApplicationTemplates = () =>
  getTemplatesByContext('application');
export const getSupportTemplates = () => getTemplatesByContext('support');
export const getOnboardingTemplates = () => getTemplatesByContext('onboarding');
