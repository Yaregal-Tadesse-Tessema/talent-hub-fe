/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Configuration for type-safe environment variables.
 * Imported through src/app/page.tsx
 * @see https://x.com/mattpocockuk/status/1760991147793449396
 */
import { z } from 'zod';

const envVariables = z.object({
  // Environment - make this optional with a default
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
  NEXT_PUBLIC_ENV: z.enum(['development', 'staging', 'production']).optional(),

  // API Configuration
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_TIMEOUT: z.string().transform(Number).optional(),

  // Feature Flags
  NEXT_PUBLIC_SHOW_LOGGER: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_SHOW_DEV_TOOLS: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_ENABLE_ANALYTICS: z.enum(['true', 'false']).optional(),

  // Authentication
  NEXT_PUBLIC_AUTH_DOMAIN: z.string().optional(),
  NEXT_PUBLIC_AUTH_CLIENT_ID: z.string().optional(),

  // External Services
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string().optional(),

  // Development Tools
  NEXT_PUBLIC_ENABLE_MOCK_API: z.enum(['true', 'false']).optional(),
  NEXT_PUBLIC_MOCK_API_DELAY: z.string().transform(Number).optional(),

  // Performance
  NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING: z
    .enum(['true', 'false'])
    .optional(),
  NEXT_PUBLIC_ENABLE_BUNDLE_ANALYZER: z.enum(['true', 'false']).optional(),

  // Build-time variables
  ANALYZE: z.enum(['true', 'false']).optional(),
});

// Parse and validate environment variables
const env = envVariables.parse(process.env);

// Export validated environment variables
export const config = {
  env: env.NODE_ENV,
  publicEnv: env.NEXT_PUBLIC_ENV || env.NODE_ENV,
  api: {
    url: env.NEXT_PUBLIC_API_URL || 'http://157.230.227.83:3010/api',
    timeout: env.NEXT_PUBLIC_API_TIMEOUT || 10000,
  },
  features: {
    showLogger: env.NEXT_PUBLIC_SHOW_LOGGER === 'true',
    showDevTools: env.NEXT_PUBLIC_SHOW_DEV_TOOLS === 'true',
    enableAnalytics: env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  },
  auth: {
    domain: env.NEXT_PUBLIC_AUTH_DOMAIN,
    clientId: env.NEXT_PUBLIC_AUTH_CLIENT_ID,
  },
  services: {
    sentryDsn: env.NEXT_PUBLIC_SENTRY_DSN,
    googleAnalyticsId: env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  },
  development: {
    enableMockApi: env.NEXT_PUBLIC_ENABLE_MOCK_API === 'true',
    mockApiDelay: env.NEXT_PUBLIC_MOCK_API_DELAY || 1000,
  },
  performance: {
    enableMonitoring: env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
    enableBundleAnalyzer: env.NEXT_PUBLIC_ENABLE_BUNDLE_ANALYZER === 'true',
  },
  build: {
    analyze: env.ANALYZE === 'true',
  },
} as const;

// Type-safe environment variables for global use
declare global {
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

export default config;
