import React from 'react';

// Performance monitoring utilities
class PerformanceMonitor {
  private navigationTimes: Map<string, number> = new Map();
  private pageLoadTimes: Map<string, number> = new Map();

  // Track navigation start
  startNavigation(path: string) {
    this.navigationTimes.set(path, performance.now());
  }

  // Track navigation end
  endNavigation(path: string) {
    const startTime = this.navigationTimes.get(path);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.navigationTimes.delete(path);

      // Log slow navigations
      if (duration > 1000) {
        console.warn(`Slow navigation to ${path}: ${duration.toFixed(2)}ms`);
      }

      // Send to analytics if available
      this.sendMetric('navigation', { path, duration });
    }
  }

  // Track page load time
  trackPageLoad(path: string) {
    const loadTime = performance.now();
    this.pageLoadTimes.set(path, loadTime);

    // Use Navigation Timing API if available
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType(
        'navigation',
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        const domContentLoaded =
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart;
        const loadComplete =
          navigation.loadEventEnd - navigation.loadEventStart;

        this.sendMetric('page_load', {
          path,
          domContentLoaded,
          loadComplete,
          total: loadComplete,
        });
      }
    }
  }

  // Send metrics to analytics
  private sendMetric(type: string, data: any) {
    // You can integrate with your analytics service here
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric [${type}]:`, data);
    }

    // Example: Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'performance', {
        event_category: type,
        event_label: data.path,
        value: Math.round(data.duration || data.total || 0),
      });
    }
  }

  // Get average navigation time
  getAverageNavigationTime(): number {
    const times = Array.from(this.navigationTimes.values());
    if (times.length === 0) return 0;
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  // Clear all metrics
  clear() {
    this.navigationTimes.clear();
    this.pageLoadTimes.clear();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Hook for tracking navigation performance
export function useNavigationTracking() {
  const trackNavigation = (path: string) => {
    performanceMonitor.startNavigation(path);
  };

  const endNavigation = (path: string) => {
    performanceMonitor.endNavigation(path);
  };

  return { trackNavigation, endNavigation };
}

// Hook for tracking page load performance
export function usePageLoadTracking() {
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      performanceMonitor.trackPageLoad(path);
    }
  }, []);
}

// Performance optimization utilities
export const performanceUtils = {
  // Debounce function calls
  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  // Throttle function calls
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number,
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  // Preload critical resources
  preloadResource(href: string, as: string) {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = as;
      document.head.appendChild(link);
    }
  },

  // Prefetch page
  prefetchPage(href: string) {
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    }
  },
};
