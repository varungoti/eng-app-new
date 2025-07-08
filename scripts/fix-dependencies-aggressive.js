/**
 * Fix Dependencies Aggressive Script
 * 
 * This script aggressively fixes dependency compatibility issues by using npm's
 * --force and --no-package-lock flags, and by installing packages one by one
 * if necessary.
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
 * Main function to run the Fix Dependencies Aggressive script
 */
function main() {
  console.log('\n=== Aggressively Fixing Dependencies ===\n');
  
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
    
    // Step 4: Try to install dependencies with force and legacy-peer-deps
    console.log('Attempting to install dependencies with force and legacy-peer-deps...');
    try {
      execSync('npm install --legacy-peer-deps --force --no-package-lock', { cwd: rootDir, stdio: 'inherit' });
      console.log('\nDependencies installed successfully!\n');
      return;
    } catch (error) {
      console.log('\nBulk install failed, trying individual package installation...');
    }
    
    // Step 5: If bulk install fails, try installing packages one by one
    console.log('Installing packages one by one...');
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Install dependencies
    console.log('Installing dependencies...');
    for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
      try {
        console.log(`Installing ${name}@${version}...`);
        execSync(`npm install ${name}@${version} --legacy-peer-deps --force --no-package-lock`, { cwd: rootDir, stdio: 'inherit' });
      } catch (error) {
        console.log(`Failed to install ${name}@${version}, skipping...`);
      }
    }
    
    // Install devDependencies
    console.log('Installing devDependencies...');
    for (const [name, version] of Object.entries(packageJson.devDependencies || {})) {
      try {
        console.log(`Installing ${name}@${version}...`);
        execSync(`npm install ${name}@${version} --legacy-peer-deps --force --no-package-lock --save-dev`, { cwd: rootDir, stdio: 'inherit' });
      } catch (error) {
        console.log(`Failed to install ${name}@${version}, skipping...`);
      }
    }
    
    console.log('\nDependencies fixed aggressively!\n');
  } catch (error) {
    console.error('Error fixing dependencies:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
