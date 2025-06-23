import { config } from '@/lib/env';

// Environment detection
export const isProd = config.env === 'production';
export const isDev = config.env === 'development';
export const isStaging = config.publicEnv === 'staging';
export const isLocal = config.publicEnv === 'development';

// Feature flags
export const showLogger = config.features.showLogger;
export const showDevTools = config.features.showDevTools;
export const enableAnalytics = config.features.enableAnalytics;

// Development tools
export const enableMockApi = config.development.enableMockApi;
export const mockApiDelay = config.development.mockApiDelay;

// Performance
export const enablePerformanceMonitoring = config.performance.enableMonitoring;
export const enableBundleAnalyzer = config.performance.enableBundleAnalyzer;
