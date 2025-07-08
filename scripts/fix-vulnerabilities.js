/**
 * Fix Vulnerabilities Script
 * 
 * This script helps fix vulnerability issues by updating or removing problematic packages.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Packages to update or remove
const packagesToUpdate = {
  'axios': 'latest',
  'braces': 'latest',
  'defaults-deep': 'latest',
  'expand-object': 'latest',
  'parse-git-config': 'latest',
  'set-value': 'latest',
  'yargs-parser': 'latest'
};

// Packages to remove (if they're not needed)
const packagesToRemove = [
  'update',
  'composer',
  'base-config-process',
  'base-runtimes',
  'match-file',
  'expand-pkg',
  'expand-args',
  'base-argv',
  'normalize-pkg',
  'remote-origin-url',
  'git-repo-name',
  'project-name',
  'base-store',
  'data-store',
  'question-store',
  'repo-utils'
];

function main() {
  console.log('\n=== Fixing Vulnerabilities ===\n');
  
  try {
    // Step 1: Check which packages are direct dependencies
    console.log('Checking direct dependencies...');
    const directDeps = [];
    for (const pkg of [...Object.keys(packagesToUpdate), ...packagesToRemove]) {
      try {
        const output = execSync(`npm ls ${pkg} --depth=0`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        if (!output.includes('empty')) {
          directDeps.push(pkg);
        }
      } catch (error) {
        // Not a direct dependency
      }
    }
    
    console.log(`Direct dependencies found: ${directDeps.join(', ') || 'none'}`);
    
    // Step 2: Update direct dependencies that need updating
    for (const [pkg, version] of Object.entries(packagesToUpdate)) {
      if (directDeps.includes(pkg)) {
        console.log(`Updating ${pkg} to ${version}...`);
        try {
          execSync(`npm install ${pkg}@${version} --legacy-peer-deps --save`, { stdio: 'inherit' });
        } catch (error) {
          console.log(`Failed to update ${pkg}, skipping...`);
        }
      }
    }
    
    // Step 3: Remove direct dependencies that are in the remove list
    const depsToRemove = directDeps.filter(dep => packagesToRemove.includes(dep));
    if (depsToRemove.length > 0) {
      console.log(`Removing unnecessary dependencies: ${depsToRemove.join(', ')}...`);
      try {
        execSync(`npm uninstall ${depsToRemove.join(' ')} --legacy-peer-deps`, { stdio: 'inherit' });
      } catch (error) {
        console.log('Failed to remove some dependencies, skipping...');
      }
    }
    
    // Step 4: Run npm audit fix
    console.log('Running npm audit fix...');
    try {
      execSync('npm audit fix --legacy-peer-deps', { stdio: 'inherit' });
    } catch (error) {
      console.log('npm audit fix completed with some issues.');
    }
    
    // Step 5: Run npm dedupe to remove duplicate packages
    console.log('Running npm dedupe...');
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
