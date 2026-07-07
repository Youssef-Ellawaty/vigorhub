#!/usr/bin/env node

/**
 * VigorHub Setup Verification Script
 * 
 * This script verifies that all required dependencies and configurations
 * are properly set up for local development.
 * 
 * Run with: node verify-setup.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  log(`  ${status} ${description}`, exists ? '' : '');
  return exists;
}

function checkDirectory(dirPath, description) {
  const fullPath = path.join(__dirname, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  const status = exists ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
  log(`  ${status} ${description}`);
  return exists;
}

async function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', BLUE);
  log('║        VigorHub Setup Verification Script                 ║', BLUE);
  log('╚════════════════════════════════════════════════════════════╝\n', BLUE);

  let allPassed = true;

  // Check configuration files
  log('1️⃣  Configuration Files:', BLUE);
  allPassed &= checkFile('package.json', 'package.json');
  allPassed &= checkFile('tsconfig.json', 'tsconfig.json');
  allPassed &= checkFile('tailwind.config.ts', 'tailwind.config.ts');
  allPassed &= checkFile('next.config.ts', 'next.config.ts');
  allPassed &= checkFile('postcss.config.mjs', 'postcss.config.mjs');
  allPassed &= checkFile('.eslintrc.json', '.eslintrc.json');

  // Check source directories
  log('\n2️⃣  Source Directories:', BLUE);
  allPassed &= checkDirectory('app', 'app/');
  allPassed &= checkDirectory('components', 'components/');
  allPassed &= checkDirectory('auth-onboarding', 'auth-onboarding/');
  allPassed &= checkDirectory('athlete-dashboard', 'athlete-dashboard/');
  allPassed &= checkDirectory('calorie-tracker', 'calorie-tracker/');
  allPassed &= checkDirectory('progress-analytics', 'progress-analytics/');
  allPassed &= checkDirectory('community', 'community/');

  // Check app files
  log('\n3️⃣  App Entry Point Files:', BLUE);
  allPassed &= checkFile('app/page.tsx', 'app/page.tsx');
  allPassed &= checkFile('app/layout.tsx', 'app/layout.tsx');
  allPassed &= checkFile('app/globals.css', 'app/globals.css');

  // Check component files
  log('\n4️⃣  Component Files:', BLUE);
  allPassed &= checkFile('components/layouts/DashboardLayout.tsx', 'DashboardLayout.tsx');
  allPassed &= checkFile('components/pages/SettingsPage.tsx', 'SettingsPage.tsx');
  allPassed &= checkFile('components/modules/AthleteModule.tsx', 'AthleteModule.tsx');
  allPassed &= checkFile('components/modules/CaloricTrackerModule.tsx', 'CaloricTrackerModule.tsx');
  allPassed &= checkFile('components/modules/ProgressAnalyticsModule.tsx', 'ProgressAnalyticsModule.tsx');
  allPassed &= checkFile('components/modules/CommunityModule.tsx', 'CommunityModule.tsx');

  // Check dependencies
  log('\n5️⃣  Dependencies:', BLUE);
  const packageJsonPath = path.join(__dirname, 'package.json');
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      'lucide-react',
    ];
    
    let depsOk = true;
    for (const dep of requiredDeps) {
      const has = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
      const status = has ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
      log(`  ${status} ${dep}${has ? ` (${has})` : ''}`);
      depsOk &= !!has;
    }
    allPassed &= depsOk;
  } catch (error) {
    log(`  ${RED}✗${RESET} Could not read package.json`, RED);
    allPassed = false;
  }

  // Check node_modules
  log('\n6️⃣  Node Modules:', BLUE);
  const nodeModulesExists = fs.existsSync(path.join(__dirname, 'node_modules'));
  if (nodeModulesExists) {
    log(`  ${GREEN}✓${RESET} node_modules/ directory exists`);
  } else {
    log(`  ${YELLOW}⚠${RESET} node_modules/ directory not found`, YELLOW);
    log('     Run: npm install', YELLOW);
    allPassed = false;
  }

  // Check environment file
  log('\n7️⃣  Environment Configuration:', BLUE);
  const envLocalExists = checkFile('.env.local', '.env.local (optional)');
  const envExampleExists = checkFile('.env.example', '.env.example');
  if (!envLocalExists && envExampleExists) {
    log(`  ${YELLOW}⚠${RESET} .env.local not found. Creating from .env.example...`, YELLOW);
    try {
      const exampleContent = fs.readFileSync(
        path.join(__dirname, '.env.example'),
        'utf8'
      );
      fs.writeFileSync(path.join(__dirname, '.env.local'), exampleContent);
      log(`  ${GREEN}✓${RESET} Created .env.local`, GREEN);
    } catch (error) {
      log(`  ${RED}✗${RESET} Failed to create .env.local`, RED);
    }
  }

  // Final result
  log('\n' + '═'.repeat(62), BLUE);
  if (allPassed && nodeModulesExists) {
    log('✅ All checks passed! You\'re ready to run: npm run dev', GREEN);
  } else if (allPassed && !nodeModulesExists) {
    log('⚠️  Run npm install before starting development', YELLOW);
  } else {
    log('❌ Some checks failed. Please review above and try again.', RED);
  }
  log('═'.repeat(62) + '\n', BLUE);

  // Print next steps
  if (!nodeModulesExists) {
    log('Next steps:', BLUE);
    log('  1. Run: npm install', YELLOW);
    log('  2. Run: npm run dev', YELLOW);
    log('  3. Open: http://localhost:3000', YELLOW);
  } else {
    log('Ready to develop! Run:', BLUE);
    log('  npm run dev', YELLOW);
  }
  log('');
}

main().catch(error => {
  log(`Error: ${error.message}`, RED);
  process.exit(1);
});
