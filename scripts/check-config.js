#!/usr/bin/env node

/**
 * Configuration Checker
 * Validates your .env file before running the bot
 */

require('dotenv').config();

const requiredVars = [
  'NOTION_TOKEN',
  'TELEGRAM_BOT_TOKEN',
  'NOTION_DB_OBJECTIVES',
  'NOTION_DB_PROJECTS',
  'NOTION_DB_WEEKLY_OUTCOMES',
  'NOTION_DB_DAILY_MITS',
];

console.log('🔍 Checking configuration...\n');

let hasErrors = false;
const warnings = [];

// Check required variables
requiredVars.forEach((varName) => {
  const value = process.env[varName];
  
  if (!value) {
    console.log(`❌ ${varName} is missing`);
    hasErrors = true;
  } else if (value.includes('your_') || value.includes('_here')) {
    console.log(`⚠️  ${varName} still has placeholder value`);
    hasErrors = true;
  } else {
    // Validate format
    if (varName === 'NOTION_TOKEN' && !value.startsWith('secret_')) {
      warnings.push(`⚠️  ${varName} should start with 'secret_'`);
    } else if (varName.startsWith('NOTION_DB_') && value.length !== 32) {
      warnings.push(`⚠️  ${varName} should be 32 characters (got ${value.length})`);
    } else if (varName === 'TELEGRAM_BOT_TOKEN' && !value.includes(':')) {
      warnings.push(`⚠️  ${varName} format looks incorrect (should contain ':')`);
    } else {
      console.log(`✅ ${varName} is set`);
    }
  }
});

console.log('');

// Show warnings
if (warnings.length > 0) {
  console.log('⚠️  Warnings:');
  warnings.forEach(w => console.log(`   ${w}`));
  console.log('');
}

// Final verdict
if (hasErrors) {
  console.log('❌ Configuration incomplete. Please fill in all required values in .env\n');
  console.log('See NEXT_STEPS.md for detailed instructions.\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('⚠️  Configuration has warnings but may work. Review the warnings above.\n');
  process.exit(0);
} else {
  console.log('✅ Configuration looks good! You can run: npm run dev\n');
  process.exit(0);
}
