/**
 * Fix Dependencies Script
 *
 * This script helps fix dependency compatibility issues by cleaning the node_modules
 * directory and reinstalling packages with the correct versions.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

/**
 * Main function to run the Fix Dependencies script
 */
function main() {
  console.log('\n=== Fixing Dependencies ===\n');

  try {
    // Step 1: Remove node_modules directory
    console.log('Removing node_modules directory...');
    const nodeModulesPath = path.join(rootDir, 'node_modules');
    if (fs.existsSync(nodeModulesPath)) {
      if (process.platform === 'win32') {
        execSync('rmdir /s /q node_modules', { cwd: rootDir, stdio: 'inherit' });
      } else {
        execSync('rm -rf node_modules', { cwd: rootDir, stdio: 'inherit' });
      }
    }

    // Step 2: Remove package-lock.json
    console.log('Removing package-lock.json...');
    const packageLockPath = path.join(rootDir, 'package-lock.json');
    if (fs.existsSync(packageLockPath)) {
      fs.unlinkSync(packageLockPath);
    }

    // Step 3: Clean npm cache
    console.log('Cleaning npm cache...');
    execSync('npm cache clean --force', { stdio: 'inherit' });

    // Step 4: Install dependencies
    console.log('Installing dependencies...');
    try {
      execSync('npm install --legacy-peer-deps --force', { cwd: rootDir, stdio: 'inherit' });
    } catch (error) {
      console.log('\nFirst install attempt failed, trying with --no-package-lock...');
      execSync('npm install --legacy-peer-deps --force --no-package-lock', { cwd: rootDir, stdio: 'inherit' });
    }

    console.log('\nDependencies fixed successfully!\n');
  } catch (error) {
    console.error('Error fixing dependencies:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
