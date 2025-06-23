import { config } from '@/lib/env';

// API Configuration
export const API_URL = config.api.url;
export const API_TIMEOUT = config.api.timeout;

// Environment flags
export const IS_PRODUCTION = config.env === 'production';
export const IS_DEVELOPMENT = config.env === 'development';
export const IS_STAGING = config.publicEnv === 'staging';

// Feature flags
export const SHOW_LOGGER = config.features.showLogger;
export const SHOW_DEV_TOOLS = config.features.showDevTools;
export const ENABLE_ANALYTICS = config.features.enableAnalytics;

// Development tools
export const ENABLE_MOCK_API = config.development.enableMockApi;
export const MOCK_API_DELAY = config.development.mockApiDelay;

// Performance
export const ENABLE_PERFORMANCE_MONITORING =
  config.performance.enableMonitoring;
export const ENABLE_BUNDLE_ANALYZER = config.performance.enableBundleAnalyzer;

// Other constants can be added here as needed
