# Available Commands

## Environment Management

### Quick Environment Setup

```bash
# Set up environment files
npm run env:dev        # Copy development config to .env.local
npm run env:staging    # Copy staging config to .env.local
npm run env:production # Copy production config to .env.local
npm run env:clean      # Remove .env.local file
```

### Environment Switching & Info

```bash
# Switch environments (with visual feedback)
npm run env:switch development
npm run env:switch staging
npm run env:switch production

# Check current environment
npm run env:current

# Validate environment files
npm run env:validate development
npm run env:validate staging
npm run env:validate production

# List available environments
npm run env:list
```

### Direct Script Usage

```bash
# Environment setup script
node scripts/env-setup.js setup development
node scripts/env-setup.js validate staging
node scripts/env-setup.js list

# Environment switching script
node scripts/switch-env.js development
node scripts/switch-env.js staging
node scripts/switch-env.js production
```

## Development

### Start Development Server

```bash
# Standard development
npm run dev

# Environment-specific development
npm run dev:local      # Uses development settings
npm run dev:staging    # Uses staging settings
npm run dev:production # Uses production settings
```

### Build Application

```bash
# Standard build (production)
npm run build

# Environment-specific builds
npm run build:dev       # Development build
npm run build:staging   # Staging build
npm run build:production # Production build
npm run build:analyze   # Development build with bundle analyzer
```

### Start Production Server

```bash
# Standard start (production)
npm run start

# Environment-specific starts
npm run start:dev       # Development server
npm run start:staging   # Staging server
npm run start:production # Production server
```

## Code Quality

### Linting

```bash
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues and format
npm run lint:strict    # Strict linting (no warnings allowed)
```

### Type Checking

```bash
npm run typecheck      # TypeScript type checking
```

### Formatting

```bash
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

## Testing

```bash
npm run test           # Run tests
npm run test:watch     # Run tests in watch mode
```

## Complete Workflow Examples

### Development Workflow

```bash
# 1. Set up development environment
npm run env:dev

# 2. Start development server
npm run dev

# 3. In another terminal, run tests
npm run test:watch
```

### Staging Deployment Workflow

```bash
# 1. Set up staging environment
npm run env:staging

# 2. Build for staging
npm run build:staging

# 3. Start staging server
npm run start:staging
```

### Production Deployment Workflow

```bash
# 1. Set up production environment
npm run env:production

# 2. Build for production
npm run build:production

# 3. Start production server
npm run start:production
```

### Code Quality Workflow

```bash
# 1. Check types
npm run typecheck

# 2. Lint and fix
npm run lint:fix

# 3. Format code
npm run format

# 4. Run tests
npm run test
```

## Environment Variables Reference

### Quick Environment Check

```bash
# See current environment configuration
npm run env:current
```

### Environment File Locations

- `env.example` - Template with all variables
- `env.development` - Development settings
- `env.staging` - Staging settings
- `env.production` - Production settings
- `.env.local` - Active environment (gitignored)

### Key Environment Variables

- `NODE_ENV` - Node.js environment
- `NEXT_PUBLIC_ENV` - Public environment identifier
- `NEXT_PUBLIC_API_URL` - API base URL
- `NEXT_PUBLIC_SHOW_LOGGER` - Enable logging
- `NEXT_PUBLIC_SHOW_DEV_TOOLS` - Enable dev tools
- `NEXT_PUBLIC_ENABLE_ANALYTICS` - Enable analytics

## Troubleshooting

### Common Issues

```bash
# Environment file not found
npm run env:dev

# Validate environment file
npm run env:validate development

# Check current environment
npm run env:current

# Clean and reset
npm run env:clean
npm run env:dev
```

### Build Issues

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Clean build
rm -rf .next
npm run build
```
