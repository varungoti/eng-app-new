/**
 * Check Dependencies Script
 * 
 * This script checks for package compatibility issues by analyzing the installed packages
 * and comparing them with the versions specified in package.json.
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
 * Main function to run the Check Dependencies script
 */
function main() {
  console.log('\n=== Checking Dependencies ===\n');
  
  try {
    // Get the list of installed packages
    console.log('Getting list of installed packages...');
    const installedPackages = getInstalledPackages();
    
    // Get the list of packages from package.json
    console.log('Getting list of packages from package.json...');
    const packageJsonPackages = getPackageJsonPackages();
    
    // Compare the lists
    console.log('Comparing package versions...');
    const issues = comparePackages(installedPackages, packageJsonPackages);
    
    // Display the results
    if (issues.length === 0) {
      console.log('\nNo package compatibility issues found!\n');
    } else {
      console.log(`\nFound ${issues.length} package compatibility issues:\n`);
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.name}: expected ${issue.expected}, got ${issue.installed}`);
      });
      console.log('\nTo fix these issues, run: npm run fix-deps\n');
    }
  } catch (error) {
    console.error('Error checking dependencies:', error.message);
    process.exit(1);
  }
}

/**
 * Get the list of installed packages
 */
function getInstalledPackages() {
  const output = execSync('npm list --depth=0 --json', { encoding: 'utf8' });
  const json = JSON.parse(output);
  const dependencies = json.dependencies || {};
  
  const result = {};
  for (const [name, info] of Object.entries(dependencies)) {
    result[name] = info.version;
  }
  
  return result;
}

/**
 * Get the list of packages from package.json
 */
function getPackageJsonPackages() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const result = {};
  
  // Add dependencies
  for (const [name, version] of Object.entries(packageJson.dependencies || {})) {
    result[name] = version.replace(/^\^|~/, ''); // Remove ^ and ~ from version
  }
  
  // Add devDependencies
  for (const [name, version] of Object.entries(packageJson.devDependencies || {})) {
    result[name] = version.replace(/^\^|~/, ''); // Remove ^ and ~ from version
  }
  
  return result;
}

/**
 * Compare the installed packages with the package.json packages
 */
function comparePackages(installed, packageJson) {
  const issues = [];
  
  for (const [name, expectedVersion] of Object.entries(packageJson)) {
    const installedVersion = installed[name];
    
    if (!installedVersion) {
      issues.push({
        name,
        expected: expectedVersion,
        installed: 'not installed'
      });
    } else if (installedVersion !== expectedVersion) {
      issues.push({
        name,
        expected: expectedVersion,
        installed: installedVersion
      });
    }
  }
  
  return issues;
}

// Run the main function
main();
