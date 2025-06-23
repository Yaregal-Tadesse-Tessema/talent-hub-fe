#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const environments = ['development', 'staging', 'production'];
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function switchEnvironment(env) {
  if (!environments.includes(env)) {
    log(`❌ Invalid environment: ${env}`, 'red');
    log(`Available environments: ${environments.join(', ')}`, 'yellow');
    process.exit(1);
  }

  const sourceFile = path.join(process.cwd(), `env.${env}`);
  const targetFile = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(sourceFile)) {
    log(`❌ Environment file not found: ${sourceFile}`, 'red');
    process.exit(1);
  }

  try {
    fs.copyFileSync(sourceFile, targetFile);
    log(`✅ Switched to ${env} environment`, 'green');

    // Show current environment info
    const content = fs.readFileSync(targetFile, 'utf8');
    const lines = content.split('\n');
    const apiUrl =
      lines
        .find((line) => line.startsWith('NEXT_PUBLIC_API_URL'))
        ?.split('=')[1] || 'Not set';
    const showLogger =
      lines
        .find((line) => line.startsWith('NEXT_PUBLIC_SHOW_LOGGER'))
        ?.split('=')[1] || 'false';

    log('\n📋 Current Configuration:', 'cyan');
    log(`   Environment: ${env}`, 'bright');
    log(`   API URL: ${apiUrl}`, 'bright');
    log(`   Logging: ${showLogger}`, 'bright');
  } catch (error) {
    log(`❌ Failed to switch environment: ${error.message}`, 'red');
    process.exit(1);
  }
}

function showCurrentEnvironment() {
  const envFile = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(envFile)) {
    log('❌ No environment file found (.env.local)', 'red');
    log('Run: npm run env:dev (or staging/production)', 'yellow');
    return;
  }

  const content = fs.readFileSync(envFile, 'utf8');
  const lines = content.split('\n');
  const envLine = lines.find((line) => line.startsWith('NEXT_PUBLIC_ENV'));
  const currentEnv = envLine ? envLine.split('=')[1] : 'unknown';

  log(`🎯 Current environment: ${currentEnv}`, 'green');
}

function main() {
  const env = process.argv[2];

  if (!env) {
    showCurrentEnvironment();
    log('\n💡 Usage: node scripts/switch-env.js <environment>', 'cyan');
    log(`   Environments: ${environments.join(', ')}`, 'yellow');
    return;
  }

  switchEnvironment(env);
}

if (require.main === module) {
  main();
}

module.exports = { switchEnvironment };
