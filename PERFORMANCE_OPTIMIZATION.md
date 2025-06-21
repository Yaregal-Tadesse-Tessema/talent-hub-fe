# Performance Optimization Guide

This document outlines the performance optimizations implemented to improve page navigation speed in the TalentHub application.

## Issues Identified

1. **Heavy Context Providers**: Multiple context providers wrapping the entire app
2. **Excessive localStorage reads**: Many components reading from localStorage on every render
3. **Large bundle size**: Heavy dependencies without proper optimization
4. **No navigation optimization**: Missing Next.js navigation optimizations
5. **Heavy components loading**: Large components without proper code splitting

## Optimizations Implemented

### 1. Font Loading Optimization

- Added `display: 'swap'` to Inter font for better loading performance
- Preconnect to Google Fonts for faster font loading

### 2. Layout Optimization

- Memoized pathname checks in `ClientLayout` to prevent unnecessary re-renders
- Memoized Navbar and Footer components
- Added preconnect and DNS prefetch for external resources

### 3. Context Provider Optimization

- Memoized context values to prevent unnecessary re-renders
- Optimized localStorage reads with caching
- Reduced context provider overhead

### 4. Navigation Performance

- Created `NavigationProvider` for centralized navigation management
- Added loading states during navigation
- Implemented performance monitoring for navigation tracking

### 5. Next.js Configuration

- Added experimental optimizations for package imports
- Enabled concurrent features
- Added performance headers
- Optimized webpack configuration

### 6. localStorage Optimization

- Created `useLocalStorage` hook with caching
- Reduced redundant localStorage reads
- Added utility functions for cached access

## Usage

### Using the Navigation Provider

Replace direct `router.push` calls with the optimized navigation:

```tsx
import { useNavigation } from '@/components/navigation/NavigationProvider';

function MyComponent() {
  const { navigate } = useNavigation();

  const handleClick = async () => {
    // This will show a loading spinner and track performance
    await navigate('/dashboard');
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

### Using the Optimized localStorage Hook

```tsx
import { useLocalStorage } from '@/hooks/useLocalStorage';

function MyComponent() {
  const [user, setUser, removeUser] = useLocalStorage('user', null);

  const handleLogout = () => {
    removeUser();
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Using Performance Monitoring

```tsx
import {
  useNavigationTracking,
  usePageLoadTracking,
} from '@/utils/performance';

function MyPage() {
  const { trackNavigation, endNavigation } = useNavigationTracking();

  // Track page load performance
  usePageLoadTracking();

  const handleNavigation = (path: string) => {
    trackNavigation(path);
    // Navigate to path
    setTimeout(() => endNavigation(path), 100);
  };

  return <div>My Page</div>;
}
```

### Using Loading Components

```tsx
import {
  LoadingSpinner,
  PageLoadingSpinner,
  InlineSpinner,
} from '@/components/ui/LoadingSpinner';

function MyComponent() {
  return (
    <div>
      {/* Inline spinner */}
      <InlineSpinner size='sm' />

      {/* Loading spinner with text */}
      <LoadingSpinner text='Loading data...' />

      {/* Full page loading spinner */}
      <PageLoadingSpinner text='Loading page...' />
    </div>
  );
}
```

## Performance Monitoring

The application now includes performance monitoring that tracks:

- Navigation times between pages
- Page load times
- Slow navigation warnings (over 1 second)
- Performance metrics logging in development

### Viewing Performance Data

In development mode, performance metrics are logged to the console. You can also integrate with analytics services by modifying the `sendMetric` function in `src/utils/performance.ts`.

## Additional Recommendations

### 1. Code Splitting

Consider implementing dynamic imports for heavy components:

```tsx
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false,
});
```

### 2. Image Optimization

- Use Next.js Image component with proper sizing
- Implement lazy loading for images below the fold
- Use WebP format when possible

### 3. Bundle Analysis

Run bundle analysis to identify large dependencies:

```bash
npm run build
# Check the generated bundle analysis report
```

### 4. Caching Strategy

- Implement service worker for caching static assets
- Use React Query or SWR for data caching
- Consider implementing Redis for server-side caching

### 5. Database Optimization

- Implement database query optimization
- Use connection pooling
- Consider implementing read replicas for heavy read operations

## Testing Performance

### 1. Lighthouse Audit

Run Lighthouse audit to check performance scores:

- Open Chrome DevTools
- Go to Lighthouse tab
- Run audit for Performance

### 2. Network Tab

Monitor network requests in Chrome DevTools:

- Check for unnecessary requests
- Look for large bundle sizes
- Monitor loading times

### 3. Performance Tab

Use Chrome DevTools Performance tab to:

- Record page loads
- Analyze rendering performance
- Identify bottlenecks

## Monitoring in Production

1. **Set up monitoring**: Implement real user monitoring (RUM)
2. **Track Core Web Vitals**: Monitor LCP, FID, and CLS
3. **Set up alerts**: Configure alerts for slow page loads
4. **Regular audits**: Schedule regular performance audits

## Troubleshooting

### Slow Navigation Issues

1. Check if the target page has heavy components
2. Verify that the NavigationProvider is properly set up
3. Check for excessive re-renders in components
4. Monitor localStorage operations

### Performance Degradation

1. Run bundle analysis to identify large dependencies
2. Check for memory leaks in components
3. Verify that memoization is working correctly
4. Monitor API response times

## Future Improvements

1. **Implement virtual scrolling** for large lists
2. **Add service worker** for offline functionality
3. **Implement progressive loading** for images
4. **Add skeleton screens** for better perceived performance
5. **Implement predictive prefetching** for likely user paths
