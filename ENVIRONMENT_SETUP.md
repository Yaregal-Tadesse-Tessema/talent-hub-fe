# Environment Setup Guide

This project supports multiple environments: **development**, **staging**, and **production**. Each environment has its own configuration file and specific settings.

## Environment Files

The project includes the following environment files:

- `env.example` - Template with all available environment variables
- `env.development` - Development environment settings
- `env.staging` - Staging environment settings
- `env.production` - Production environment settings

## Quick Start

### 1. Setup Environment

Choose one of the following methods:

**Method 1: Using npm scripts**

```bash
# Development
npm run env:dev

# Staging
npm run env:staging

# Production
npm run env:production
```

**Method 2: Using the setup script**

```bash
# Development
node scripts/env-setup.js setup development

# Staging
node scripts/env-setup.js setup staging

# Production
node scripts/env-setup.js setup production
```

**Method 3: Manual copy**

```bash
# Development
cp env.development .env.local

# Staging
cp env.staging .env.local

# Production
cp env.production .env.local
```

### 2. Run the Project

**Development Mode:**

```bash
# Standard development
npm run dev

# With specific environment
npm run dev:local      # Uses development settings
npm run dev:staging    # Uses staging settings
npm run dev:production # Uses production settings
```

**Build Mode:**

```bash
# Standard build
npm run build

# Environment-specific builds
npm run build:dev       # Development build
npm run build:staging   # Staging build
npm run build:production # Production build
npm run build:analyze   # Development build with bundle analyzer
```

**Start Mode:**

```bash
# Standard start
npm run start

# Environment-specific starts
npm run start:dev       # Development server
npm run start:staging   # Staging server
npm run start:production # Production server
```

## Environment Variables

### Core Configuration

| Variable          | Description                   | Default       |
| ----------------- | ----------------------------- | ------------- |
| `NODE_ENV`        | Node.js environment           | `development` |
| `NEXT_PUBLIC_ENV` | Public environment identifier | `development` |

### API Configuration

| Variable                  | Description              | Default                     |
| ------------------------- | ------------------------ | --------------------------- |
| `NEXT_PUBLIC_API_URL`     | API base URL             | `http://localhost:3010/api` |
| `NEXT_PUBLIC_API_TIMEOUT` | API request timeout (ms) | `10000`                     |

### Feature Flags

| Variable                       | Description              | Default                       |
| ------------------------------ | ------------------------ | ----------------------------- |
| `NEXT_PUBLIC_SHOW_LOGGER`      | Enable console logging   | `true` (dev) / `false` (prod) |
| `NEXT_PUBLIC_SHOW_DEV_TOOLS`   | Enable development tools | `true` (dev) / `false` (prod) |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics         | `false` (dev) / `true` (prod) |

### Authentication

| Variable                     | Description     | Default |
| ---------------------------- | --------------- | ------- |
| `NEXT_PUBLIC_AUTH_DOMAIN`    | Auth0 domain    | -       |
| `NEXT_PUBLIC_AUTH_CLIENT_ID` | Auth0 client ID | -       |

### External Services

| Variable                          | Description                   | Default |
| --------------------------------- | ----------------------------- | ------- |
| `NEXT_PUBLIC_SENTRY_DSN`          | Sentry DSN for error tracking | -       |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | Google Analytics ID           | -       |

### Development Tools

| Variable                      | Description                  | Default                       |
| ----------------------------- | ---------------------------- | ----------------------------- |
| `NEXT_PUBLIC_ENABLE_MOCK_API` | Enable mock API responses    | `true` (dev) / `false` (prod) |
| `NEXT_PUBLIC_MOCK_API_DELAY`  | Mock API response delay (ms) | `1000`                        |

### Performance

| Variable                                    | Description                   | Default |
| ------------------------------------------- | ----------------------------- | ------- |
| `NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING` | Enable performance monitoring | `true`  |
| `NEXT_PUBLIC_ENABLE_BUNDLE_ANALYZER`        | Enable bundle analyzer        | `false` |

## Environment-Specific Settings

### Development

- **API URL**: `http://localhost:3010/api`
- **Logging**: Enabled
- **Dev Tools**: Enabled
- **Mock API**: Enabled
- **Analytics**: Disabled

### Staging

- **API URL**: `https://staging-api.yourdomain.com/api`
- **Logging**: Enabled
- **Dev Tools**: Disabled
- **Mock API**: Disabled
- **Analytics**: Enabled

### Production

- **API URL**: `https://api.yourdomain.com/api`
- **Logging**: Disabled
- **Dev Tools**: Disabled
- **Mock API**: Disabled
- **Analytics**: Enabled

## Using Environment Configuration in Code

### Import Configuration

```typescript
import { config } from '@/lib/env';
import { API_URL, IS_PRODUCTION, SHOW_LOGGER } from '@/config/constants';
```

### Environment Detection

```typescript
import { isProd, isDev, isStaging } from '@/constant/env';

if (isDev) {
  // Development-only code
}

if (isProd) {
  // Production-only code
}
```

### Feature Flags

```typescript
import { config } from '@/lib/env';

if (config.features.showLogger) {
  console.log('Debug information');
}

if (config.development.enableMockApi) {
  // Use mock data
}
```

## Validation

Validate your environment files:

```bash
# Validate specific environment
node scripts/env-setup.js validate development
node scripts/env-setup.js validate staging
node scripts/env-setup.js validate production

# List available environments
node scripts/env-setup.js list
```

## Troubleshooting

### Common Issues

1. **Environment file not found**

   ```bash
   # Make sure you've copied the environment file
   npm run env:dev
   ```

2. **TypeScript errors with environment variables**

   - Ensure `src/lib/env.ts` is imported in your app
   - Check that all required variables are defined

3. **Build fails with missing variables**
   - Validate your environment file: `node scripts/env-setup.js validate <env>`
   - Check that all required variables are set

### Clean Up

Remove the local environment file:

```bash
npm run env:clean
```

## Best Practices

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Use environment-specific files** - Don't modify `env.example`
3. **Validate before deployment** - Always validate environment files
4. **Use type-safe configuration** - Import from `@/lib/env` instead of `process.env`
5. **Test all environments** - Ensure your app works in all environments

## Deployment

### Vercel

- Set environment variables in Vercel dashboard
- Use `NEXT_PUBLIC_ENV` to determine environment

### Other Platforms

- Copy appropriate environment file to `.env.local`
- Set `NODE_ENV` and `NEXT_PUBLIC_ENV` appropriately
