# EmailDialog Component

A reusable email dialog component with template selection, rich text editing, dynamic placeholder support, and advanced filtering capabilities.

## Features

- **Template Selection**: Choose from pre-built email templates organized by categories
- **Advanced Filtering**: Filter templates by user type and context
- **Rich Text Editor**: Built-in TipTap editor with formatting options
- **Dynamic Placeholders**: Replace template variables with actual values
- **Email Service Integration**: Sends emails via SendGrid API
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Shows loading indicators during email sending
- **Error Handling**: Comprehensive error handling with user feedback

## Template Organization

Templates are organized into separate arrays with flags for better filtering:

### Template Arrays

- `ONBOARDING_TEMPLATES` - User onboarding and account management
- `EMPLOYEE_TEMPLATES` - Job seeker notifications and communications
- `EMPLOYER_TEMPLATES` - Employer notifications and job management
- `SUPPORT_TEMPLATES` - Support and system notifications
- `MARKETING_TEMPLATES` - Marketing and promotional content

### Template Flags

Each template has flags for filtering:

```typescript
flags: {
  userType: 'employee' | 'employer' | 'admin' | 'all';
  context: 'application' |
    'support' |
    'onboarding' |
    'system' |
    'marketing' |
    'all';
  isActive: boolean;
}
```

## Usage

### Basic Usage

```tsx
import EmailDialog from '@/components/ui/EmailDialog';

function MyComponent() {
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handleEmailSuccess = () => {
    console.log('Email sent successfully');
  };

  const handleEmailError = (error: string) => {
    console.error('Email error:', error);
  };

  return (
    <>
      <button onClick={() => setShowEmailDialog(true)}>Send Email</button>

      <EmailDialog
        open={showEmailDialog}
        onClose={() => setShowEmailDialog(false)}
        onSuccess={handleEmailSuccess}
        onError={handleEmailError}
      />
    </>
  );
}
```

### With Filtering

```tsx
<EmailDialog
  open={showEmailDialog}
  onClose={() => setShowEmailDialog(false)}
  userType='employer'
  context='application'
  showFilters={true}
  onSuccess={handleEmailSuccess}
  onError={handleEmailError}
/>
```

### With Default Values

```tsx
<EmailDialog
  open={showEmailDialog}
  onClose={() => setShowEmailDialog(false)}
  defaultTo='recipient@example.com'
  defaultSubject='Important Update'
  defaultHtml='<p>Hello,</p><p>This is a pre-filled email.</p>'
  userType='employee'
  context='application'
  onSuccess={handleEmailSuccess}
  onError={handleEmailError}
/>
```

## Props

| Prop             | Type                                                                             | Default | Description                              |
| ---------------- | -------------------------------------------------------------------------------- | ------- | ---------------------------------------- |
| `open`           | `boolean`                                                                        | -       | Controls dialog visibility               |
| `onClose`        | `() => void`                                                                     | -       | Callback when dialog is closed           |
| `defaultTo`      | `string`                                                                         | `''`    | Default recipient email                  |
| `defaultSubject` | `string`                                                                         | `''`    | Default email subject                    |
| `defaultHtml`    | `string`                                                                         | `''`    | Default email content                    |
| `userType`       | `'employee' \| 'employer' \| 'admin' \| 'all'`                                   | `'all'` | Filter templates by user type            |
| `context`        | `'application' \| 'support' \| 'onboarding' \| 'system' \| 'marketing' \| 'all'` | `'all'` | Filter templates by context              |
| `showFilters`    | `boolean`                                                                        | `true`  | Show/hide filter controls                |
| `onSuccess`      | `() => void`                                                                     | -       | Callback when email is sent successfully |
| `onError`        | `(error: string) => void`                                                        | -       | Callback when email sending fails        |

## Email Templates

### User Onboarding & Account

- Welcome Email
- Email Verification
- Password Reset
- Password Changed Confirmation
- Account Deactivation Confirmation

### Job Seeker Notifications

- Job Application Confirmation
- Job Application Status Update
- Interview Invitation
- Application Deadline Reminder
- New Job Recommendations

### Employer Notifications

- Job Post Approval
- New Applicant Notification
- Job Post Expiry Reminder
- Daily Application Summary

### Platform/Admin Notifications

- Contact Us Acknowledgement
- System Maintenance Notification
- Reported Job/Spam Notification

### Marketing

- Weekly Newsletter

## Template Placeholders

Templates support dynamic placeholders that can be replaced with actual values:

- `{{firstName}}` - User's first name
- `{{jobTitle}}` - Job title
- `{{companyName}}` - Company name
- `{{verificationLink}}` - Email verification link
- `{{resetLink}}` - Password reset link
- `{{interviewDate}}` - Interview date
- `{{interviewTime}}` - Interview time
- `{{interviewLocation}}` - Interview location
- `{{deadlineDate}}` - Application deadline
- `{{expiryDate}}` - Job post expiry date
- `{{maintenanceDate}}` - Maintenance date
- And many more...

## Filter Functions

The component provides several utility functions for filtering templates:

```typescript
// Filter by user type
getTemplatesByUserType('employee');
getTemplatesByUserType('employer');
getTemplatesByUserType('admin');

// Filter by context
getTemplatesByContext('application');
getTemplatesByContext('support');
getTemplatesByContext('onboarding');

// Filter by both user type and context
getTemplatesByUserTypeAndContext('employer', 'application');

// Quick access functions
getEmployeeTemplates();
getEmployerTemplates();
getAdminTemplates();
getApplicationTemplates();
getSupportTemplates();
getOnboardingTemplates();
```

## Email Service

The component uses the `emailService` to send emails via the `/email/send-grid` endpoint.

### API Endpoint

- **URL**: `POST /email/send-grid`
- **Body**:
  ```typescript
  {
    to: string;
    subject: string;
    html: string;
    from?: string;
    replyTo?: string;
  }
  ```

## Styling

The component uses Tailwind CSS classes and follows the existing design system. It's fully responsive and includes:

- Modal overlay with backdrop
- Two-column layout (templates + form)
- Filter panel with dropdown controls
- Rich text editor with toolbar
- Form validation
- Loading states
- Error handling
- Template badges showing user type and context

## Dependencies

- `@tiptap/react` - Rich text editor
- `@tiptap/starter-kit` - Basic editor features
- `@tiptap/extension-link` - Link support
- `@tiptap/extension-image` - Image support
- `@tiptap/extension-placeholder` - Placeholder text
- `@heroicons/react` - Icons

## Examples

See `EmailDialogExample.tsx` for complete usage examples with different filtering scenarios.

## Integration

The component is already integrated into the `ApplicationDetailModal` component, demonstrating how to use it in a real-world scenario with employer-specific filtering.
