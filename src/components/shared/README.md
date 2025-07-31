# EmailComposer Component

A comprehensive, reusable email composition component with rich text editing capabilities, template support, and draft management.

## Features

- **Rich Text Editor**: Powered by TipTap with full formatting options
- **Multiple Recipients**: Support for To, CC, and BCC fields
- **Email Templates**: Pre-built templates for common scenarios
- **Draft Management**: Save and load email drafts
- **Flexible Configuration**: Show/hide fields based on needs
- **Validation**: Configurable required field validation
- **Responsive Design**: Works on desktop and mobile devices

## Installation

The component uses the following dependencies that should already be installed in your project:

```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-image @tiptap/extension-placeholder @tiptap/extension-text-align @tiptap/extension-underline @tiptap/extension-highlight @tiptap/extension-table @tiptap/extension-table-row @tiptap/extension-table-cell @tiptap/extension-table-header @tiptap/extension-color @tiptap/extension-text-style @tiptap/extension-font-family
```

## Basic Usage

```tsx
import EmailComposer from '@/components/shared/EmailComposer';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Compose Email</button>

      <EmailComposer
        open={isOpen}
        onClose={() => setIsOpen(false)}
        defaultTo='recipient@example.com'
        defaultSubject='Hello'
        onSuccess={(response) => console.log('Email sent:', response)}
        onError={(error) => console.error('Error:', error)}
      />
    </div>
  );
}
```

## Props

### Required Props

| Prop      | Type         | Description                                    |
| --------- | ------------ | ---------------------------------------------- |
| `open`    | `boolean`    | Controls whether the email composer is visible |
| `onClose` | `() => void` | Callback when the composer is closed           |

### Email Fields

| Prop              | Type                 | Default | Description                  |
| ----------------- | -------------------- | ------- | ---------------------------- |
| `defaultFrom`     | `string`             | `''`    | Default sender email address |
| `defaultTo`       | `string \| string[]` | `''`    | Default recipient(s)         |
| `defaultCc`       | `string \| string[]` | `''`    | Default CC recipient(s)      |
| `defaultBcc`      | `string \| string[]` | `''`    | Default BCC recipient(s)     |
| `defaultSubject`  | `string`             | `''`    | Default email subject        |
| `defaultHtml`     | `string`             | `''`    | Default email content (HTML) |
| `defaultTemplate` | `string`             | `''`    | Default template ID to apply |

### Templates

| Prop               | Type                                | Default            | Description                          |
| ------------------ | ----------------------------------- | ------------------ | ------------------------------------ |
| `templates`        | `EmailTemplate[]`                   | Built-in templates | Array of email templates             |
| `onTemplateSelect` | `(template: EmailTemplate) => void` | `undefined`        | Callback when a template is selected |

### Callbacks

| Prop          | Type                          | Description                            |
| ------------- | ----------------------------- | -------------------------------------- |
| `onSuccess`   | `(response: any) => void`     | Called when email is sent successfully |
| `onError`     | `(error: string) => void`     | Called when an error occurs            |
| `onSaveDraft` | `(draft: EmailDraft) => void` | Called when a draft is saved           |
| `onLoadDraft` | `() => EmailDraft \| null`    | Called to load a saved draft           |

### UI Options

| Prop               | Type      | Default           | Description                    |
| ------------------ | --------- | ----------------- | ------------------------------ |
| `showFrom`         | `boolean` | `true`            | Show/hide the From field       |
| `showCc`           | `boolean` | `true`            | Show/hide the CC field         |
| `showBcc`          | `boolean` | `true`            | Show/hide the BCC field        |
| `showTemplates`    | `boolean` | `true`            | Show/hide template selector    |
| `showDraftActions` | `boolean` | `true`            | Show/hide draft save button    |
| `maxHeight`        | `string`  | `'90vh'`          | Maximum height of the composer |
| `title`            | `string`  | `'Compose Email'` | Title displayed in the header  |

### Validation

| Prop             | Type                                           | Default                        | Description              |
| ---------------- | ---------------------------------------------- | ------------------------------ | ------------------------ |
| `requiredFields` | `('from' \| 'to' \| 'subject' \| 'content')[]` | `['to', 'subject', 'content']` | Fields that are required |

## Types

### EmailTemplate

```tsx
interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html: string;
  description?: string;
}
```

### EmailDraft

```tsx
interface EmailDraft {
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  html: string;
  timestamp: number;
}
```

## Usage Examples

### Simple Email Composer

```tsx
<EmailComposer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTo='recipient@example.com'
  defaultSubject='Simple Email'
  showFrom={false}
  showCc={false}
  showBcc={false}
  showTemplates={false}
  showDraftActions={false}
  title='Simple Email Composer'
/>
```

### Full Featured Email Composer

```tsx
<EmailComposer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  defaultFrom='sender@example.com'
  defaultTo='recipient@example.com'
  defaultCc='cc@example.com'
  defaultBcc='bcc@example.com'
  defaultSubject='Full Featured Email'
  showFrom={true}
  showCc={true}
  showBcc={true}
  showTemplates={true}
  showDraftActions={true}
  templates={customTemplates}
  title='Full Featured Email Composer'
  onSuccess={handleSuccess}
  onError={handleError}
  onSaveDraft={handleSaveDraft}
  onLoadDraft={handleLoadDraft}
  onTemplateSelect={handleTemplateSelect}
/>
```

### Template-Based Email Composer

```tsx
const customTemplates: EmailTemplate[] = [
  {
    id: 'job-application',
    name: 'Job Application Follow-up',
    subject: 'Follow-up on Job Application - [Position]',
    html: `
      <h2>Dear [Hiring Manager],</h2>
      <p>I hope this email finds you well. I wanted to follow up on my recent application for the [Position] role at [Company Name].</p>
      <p>Best regards,<br>[Your Name]</p>
    `,
    description: 'Professional follow-up for job applications',
  },
];

<EmailComposer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  defaultTemplate='job-application'
  templates={customTemplates}
  showFrom={true}
  showCc={false}
  showBcc={false}
  showTemplates={true}
  showDraftActions={true}
  title='Template-Based Email Composer'
/>;
```

### With Draft Management

```tsx
const [savedDraft, setSavedDraft] = useState<EmailDraft | null>(null);

const handleSaveDraft = (draft: EmailDraft) => {
  // Save to localStorage or database
  localStorage.setItem('emailDraft', JSON.stringify(draft));
  setSavedDraft(draft);
};

const handleLoadDraft = () => {
  // Load from localStorage or database
  const draft = localStorage.getItem('emailDraft');
  return draft ? JSON.parse(draft) : null;
};

<EmailComposer
  open={isOpen}
  onClose={() => setIsOpen(false)}
  onSaveDraft={handleSaveDraft}
  onLoadDraft={handleLoadDraft}
  showDraftActions={true}
/>;
```

## Rich Text Editor Features

The component includes a full-featured rich text editor with:

- **Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1, H2, H3
- **Text Alignment**: Left, center, right, justify
- **Lists**: Bullet and numbered lists
- **Links**: Add and remove hyperlinks
- **Tables**: Insert and manage tables
- **Colors**: Text color and highlighting
- **Fonts**: Multiple font family options
- **Blockquotes**: Quote formatting
- **Code Blocks**: Code formatting
- **Horizontal Rules**: Divider lines

## Styling

The component uses Tailwind CSS classes and can be customized by:

1. Modifying the component's CSS classes
2. Using CSS custom properties
3. Overriding styles with your own CSS

## Integration with Email Service

The component integrates with the existing `emailService` from `@/services/emailService`. Make sure your email service supports the `EmailRequest` interface:

```tsx
interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}
```

## Accessibility

The component includes:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Performance Considerations

- The rich text editor is lazy-loaded
- Large email content is handled efficiently
- Draft saving is debounced to prevent excessive saves
- Template rendering is optimized

## Troubleshooting

### Common Issues

1. **Editor not loading**: Check that all TipTap dependencies are installed
2. **Email not sending**: Verify your email service configuration
3. **Templates not showing**: Ensure templates array is properly formatted
4. **Drafts not saving**: Check your draft storage implementation

### Debug Mode

Enable debug logging by setting:

```tsx
// Add to your component
const DEBUG = process.env.NODE_ENV === 'development';

// Use in callbacks
onSuccess={(response) => {
  if (DEBUG) console.log('Email sent:', response);
}}
```

## Contributing

When contributing to this component:

1. Follow the existing code style
2. Add proper TypeScript types
3. Include unit tests for new features
4. Update documentation for any changes
5. Test across different browsers and devices
