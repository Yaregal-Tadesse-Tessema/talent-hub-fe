# PostHog Integration Guide for TalentHub

This guide explains how to set up and use PostHog analytics in the TalentHub application.

## 🚀 Quick Setup

### 1. Get Your PostHog Project Key

1. Go to [PostHog](https://app.posthog.com) and create an account
2. Create a new project for TalentHub
3. Copy your Project API Key from the Project Settings

### 2. Configure Environment Variables

Update your `.env.local` file with your PostHog credentials:

```env
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 3. Restart the Development Server

```bash
npm run dev
```

## 📊 What's Being Tracked

### Authentication Events

- **User Login**: Tracks successful logins with user role and method
- **User Logout**: Tracks logout events with user role
- **Login Failed**: Tracks failed login attempts with reason

### Job Search Events

- **Job Search**: Tracks search queries, filters, and result counts
- **Job View**: Tracks job detail page views
- **Job Apply**: Tracks job applications
- **Job Save/Unsave**: Tracks job bookmarking

### CV Builder Events

- **CV Builder Start**: Tracks when users start creating CVs
- **CV Builder Step Complete**: Tracks completion of each CV step with time spent
- **CV Builder Finish**: Tracks CV completion with total time and steps
- **CV Download**: Tracks CV downloads with template and format
- **CV Parse Upload**: Tracks CV file uploads for parsing
- **CV Parse Success**: Tracks successful CV parsing with confidence scores

### Skills Analysis Events

- **Skills Analysis View**: Tracks when skills analysis is viewed
- **Skills Analysis Details**: Tracks detailed analysis views
- **Learning Resource Click**: Tracks clicks on learning recommendations

### Employer Events

- **Job Post Create**: Tracks job posting creation
- **Job Post Publish**: Tracks job posting publication
- **Candidate View**: Tracks candidate profile views
- **Candidate Save**: Tracks candidate bookmarking
- **Application Review**: Tracks application review actions

### Tutorial Events

- **Tutorial Start**: Tracks tutorial initiation
- **Tutorial Step Complete**: Tracks tutorial step completion
- **Tutorial Skip**: Tracks tutorial skips with reasons
- **Tutorial Finish**: Tracks tutorial completion

### UI/UX Events

- **Page View**: Tracks all page views with referrer information
- **Dark Mode Toggle**: Tracks theme changes
- **Search Filter**: Tracks filter usage
- **Sort Change**: Tracks sorting changes

## 🎛️ Feature Flags

### Available Feature Flags

```typescript
// CV Builder features
CV_AI_GENERATION: 'cv-ai-generation';
CV_TEMPLATE_MODERN: 'cv-template-modern';
CV_TEMPLATE_CREATIVE: 'cv-template-creative';
CV_PARSE_ENHANCED: 'cv-parse-enhanced';

// Skills Analysis features
SKILLS_AI_ANALYSIS: 'skills-ai-analysis';
LEARNING_RECOMMENDATIONS: 'learning-recommendations';
SKILLS_GAP_ANALYSIS: 'skills-gap-analysis';

// Job Search features
ADVANCED_FILTERING: 'advanced-filtering';
JOB_ALERTS_SMART: 'job-alerts-smart';
APPLY_WITH_ONE_CLICK: 'apply-with-one-click';

// Employer features
AI_JOB_DESCRIPTION: 'ai-job-description';
CANDIDATE_SCORING: 'candidate-scoring';
APPLICATION_AUTOMATION: 'application-automation';

// UI/UX features
DARK_MODE: 'dark-mode';
TUTORIAL_ENHANCED: 'tutorial-enhanced';
NOTIFICATIONS_PUSH: 'notifications-push';
```

### Using Feature Flags

```typescript
import { useFeatureFlag, FEATURE_FLAGS } from '@/hooks/useFeatureFlags';

function MyComponent() {
  const { isEnabled: isAIEnabled } = useFeatureFlag(FEATURE_FLAGS.CV_AI_GENERATION);

  return (
    <div>
      {isAIEnabled && <AIFeature />}
      <RegularFeature />
    </div>
  );
}
```

## 🔧 Custom Tracking

### Using the Analytics Service

```typescript
import { AnalyticsService } from '@/services/analyticsService';

// Track custom events
AnalyticsService.trackJobApply('job-123', 'Software Engineer', 'direct');
AnalyticsService.trackCVDownload('modern', 'pdf');
AnalyticsService.trackSkillsAnalysisView('job-456', 85);
```

### Direct PostHog Usage

```typescript
import { usePostHog } from '@/contexts/PostHogContext';

function MyComponent() {
  const { trackEvent, posthog } = usePostHog();

  const handleCustomAction = () => {
    trackEvent('Custom Action', {
      custom_property: 'value',
      timestamp: new Date().toISOString(),
    });
  };

  return <button onClick={handleCustomAction}>Custom Action</button>;
}
```

## 📈 Analytics Dashboard

### Key Metrics to Monitor

1. **User Engagement**

   - Daily/Monthly Active Users
   - Session Duration
   - Pages per Session
   - Bounce Rate

2. **Job Search Funnel**

   - Job Search → Job View → Job Apply
   - Conversion rates at each step
   - Most popular job categories

3. **CV Builder Funnel**

   - CV Builder Start → Step Completion → CV Download
   - Step drop-off rates
   - Template preferences

4. **Skills Analysis Usage**

   - Skills Analysis views per job
   - Learning resource clicks
   - Skills gap identification

5. **Employer Activities**
   - Job posting creation rate
   - Application review patterns
   - Candidate engagement

### Creating Custom Dashboards

1. Go to PostHog → Dashboards
2. Create new dashboard
3. Add charts for key metrics
4. Set up alerts for important events

## 🔍 Session Recordings

Session recordings are automatically enabled and will capture:

- User interactions
- Page navigation
- Form submissions
- Click events

**Privacy Note**: Password fields are automatically masked for security.

## 🧪 A/B Testing

### Setting Up Experiments

1. Go to PostHog → Experiments
2. Create new experiment
3. Define variants and success metrics
4. Set traffic allocation

### Example: CV Template A/B Test

```typescript
// In your component
const { getFeatureFlag } = useFeatureFlag(FEATURE_FLAGS.CV_TEMPLATE_MODERN);
const template = getFeatureFlag(FEATURE_FLAGS.CV_TEMPLATE_MODERN)
  ? 'modern'
  : 'classic';

// Track experiment exposure
AnalyticsService.trackCVTemplateSelect(template);
```

## 🚨 Troubleshooting

### Common Issues

1. **Events not showing up**

   - Check if PostHog key is correct
   - Verify environment variables are loaded
   - Check browser console for errors

2. **Feature flags not working**

   - Ensure PostHog is fully loaded
   - Check feature flag configuration in PostHog dashboard
   - Verify user identification

3. **Session recordings not capturing**
   - Check if session recording is enabled
   - Verify no ad blockers are interfering
   - Check PostHog project settings

### Debug Mode

Enable debug mode in development:

```env
NODE_ENV=development
```

This will log PostHog events to the console.

## 📚 Additional Resources

- [PostHog Documentation](https://posthog.com/docs)
- [Feature Flags Guide](https://posthog.com/docs/feature-flags)
- [Session Recordings](https://posthog.com/docs/session-recordings)
- [A/B Testing](https://posthog.com/docs/experiments)

## 🔒 Privacy & Compliance

- All tracking respects user privacy
- Sensitive data (passwords) is automatically masked
- Users can opt-out through browser settings
- GDPR compliant data handling

## 🎯 Next Steps

1. Set up your PostHog project
2. Configure environment variables
3. Test tracking in development
4. Set up production monitoring
5. Create custom dashboards
6. Implement feature flags
7. Set up A/B tests
