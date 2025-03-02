// Script to fix unused imports using ESLint
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔍 Fixing unused imports and declarations using ESLint...');

// Define source directories to check
const sourceDirs = [
  'src'
];

try {
  // Run ESLint with --fix option to automatically fix unused imports
  sourceDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`Processing ${dir} directory...`);
      try {
        execSync(`npx eslint ${dir} --ext .ts,.tsx --fix --rule "no-unused-vars: error" --rule "@typescript-eslint/no-unused-vars: error"`, 
          { stdio: 'inherit' });
      } catch (error) {
        // ESLint might exit with code 1 if it finds errors it can't fix
        console.log(`Some issues in ${dir} couldn't be automatically fixed.`);
      }
    } else {
      console.log(`Directory ${dir} not found, skipping...`);
    }
  });

  console.log('✅ Completed fixing unused imports!');
  console.log('Some issues may require manual fixes. Please run the build to verify.');
} catch (error) {
  console.error('❌ Error occurred:', error.message);
  process.exit(1);
} 