/**
 * Fix Vulnerabilities Simple Script
 * 
 * This script uses a simpler approach to fix vulnerabilities by:
 * 1. Updating direct dependencies to their latest versions
 * 2. Running npm audit fix with --force
 * 3. Cleaning up the node_modules directory
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// List of packages that are known to have vulnerabilities
const vulnerablePackages = [
  'axios',
  'braces',
  'lodash',
  'minimatch',
  'set-value',
  'js-yaml'
];

function main() {
  console.log('\n=== Fixing Vulnerabilities (Simple Approach) ===\n');
  
  try {
    // Step 1: Update direct dependencies that are known to have vulnerabilities
    console.log('Updating vulnerable direct dependencies...');
    for (const pkg of vulnerablePackages) {
      try {
        // Check if the package is a direct dependency
        const output = execSync(`npm ls ${pkg} --depth=0`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        if (!output.includes('empty')) {
          console.log(`Updating ${pkg} to latest version...`);
          execSync(`npm install ${pkg}@latest --legacy-peer-deps --save`, { stdio: 'inherit' });
        }
      } catch (error) {
        // Not a direct dependency or error updating
      }
    }
    
    // Step 2: Clean up node_modules
    console.log('\nCleaning up node_modules...');
    if (fs.existsSync(path.join(rootDir, 'node_modules'))) {
      if (process.platform === 'win32') {
        execSync('rmdir /s /q node_modules', { cwd: rootDir, stdio: 'inherit' });
      } else {
        execSync('rm -rf node_modules', { cwd: rootDir, stdio: 'inherit' });
      }
    }
    
    // Step 3: Remove package-lock.json
    console.log('Removing package-lock.json...');
    const packageLockPath = path.join(rootDir, 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      fs.unlinkSync(packageLockPath);
    }
    
    // Step 4: Reinstall dependencies with --legacy-peer-deps
    console.log('Reinstalling dependencies...');
    execSync('npm install --legacy-peer-deps', { cwd: rootDir, stdio: 'inherit' });
    
    // Step 5: Run npm audit fix with --force
    console.log('\nRunning npm audit fix with --force...');
    try {
      execSync('npm audit fix --force --legacy-peer-deps', { stdio: 'inherit' });
    } catch (error) {
      console.log('npm audit fix completed with some issues.');
    }
    
    // Step 6: Run npm dedupe to clean up dependencies
    console.log('\nRunning npm dedupe...');
    try {
      execSync('npm dedupe --legacy-peer-deps', { stdio: 'inherit' });
    } catch (error) {
      console.log('npm dedupe completed with some issues.');
    }
    
    console.log('\nVulnerability fixes completed. Run npm audit to check remaining issues.\n');
  } catch (error) {
    console.error('Error fixing vulnerabilities:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
