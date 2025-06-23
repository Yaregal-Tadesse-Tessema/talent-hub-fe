#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const environments = ['development', 'staging', 'production'];

function copyEnvFile(env) {
  const sourceFile = path.join(process.cwd(), `env.${env}`);
  const targetFile = path.join(process.cwd(), '.env.local');

  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ Environment file ${sourceFile} does not exist`);
    process.exit(1);
  }

  try {
    fs.copyFileSync(sourceFile, targetFile);
    console.log(`✅ Successfully copied env.${env} to .env.local`);
  } catch (error) {
    console.error(`❌ Failed to copy environment file: ${error.message}`);
    process.exit(1);
  }
}

function validateEnvFile(env) {
  const envFile = path.join(process.cwd(), `env.${env}`);

  if (!fs.existsSync(envFile)) {
    console.error(`❌ Environment file ${envFile} does not exist`);
    return false;
  }

  const content = fs.readFileSync(envFile, 'utf8');
  const lines = content
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('#'));

  let isValid = true;
  const requiredVars = ['NEXT_PUBLIC_ENV', 'NEXT_PUBLIC_API_URL'];

  for (const requiredVar of requiredVars) {
    if (!lines.some((line) => line.startsWith(requiredVar))) {
      console.error(`❌ Missing required environment variable: ${requiredVar}`);
      isValid = false;
    }
  }

  if (isValid) {
    console.log(`✅ Environment file env.${env} is valid`);
  }

  return isValid;
}

function showUsage() {
  console.log(`
Environment Setup Script

Usage:
  node scripts/env-setup.js <command> [environment]

Commands:
  setup <env>     Copy environment file to .env.local
  validate <env>  Validate environment file
  list           List available environments

Environments:
  ${environments.join(', ')}

Examples:
  node scripts/env-setup.js setup development
  node scripts/env-setup.js validate staging
  node scripts/env-setup.js list
`);
}

function main() {
  const command = process.argv[2];
  const env = process.argv[3];

  switch (command) {
    case 'setup':
      if (!env || !environments.includes(env)) {
        console.error(
          `❌ Invalid environment. Available: ${environments.join(', ')}`,
        );
        process.exit(1);
      }
      copyEnvFile(env);
      break;

    case 'validate':
      if (!env || !environments.includes(env)) {
        console.error(
          `❌ Invalid environment. Available: ${environments.join(', ')}`,
        );
        process.exit(1);
      }
      validateEnvFile(env);
      break;

    case 'list':
      console.log('Available environments:');
      environments.forEach((env) => {
        const envFile = path.join(process.cwd(), `env.${env}`);
        const exists = fs.existsSync(envFile) ? '✅' : '❌';
        console.log(`  ${exists} ${env}`);
      });
      break;

    default:
      showUsage();
      process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { copyEnvFile, validateEnvFile };
