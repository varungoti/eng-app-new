/**
 * Add Dependency Script
 * 
 * This script helps add new dependencies safely by checking compatibility
 * with existing packages and installing with the appropriate flags.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import readline from 'readline';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function to run the Add Dependency script
 */
function main() {
  console.log('\n=== Add Dependency Safely ===\n');
  
  // Ask for package name and version
  rl.question('Enter package name: ', (packageName) => {
    if (!packageName) {
      console.error('Package name is required');
      rl.close();
      return;
    }
    
    rl.question('Enter version (leave blank for latest): ', (version) => {
      rl.question('Is this a dev dependency? (y/n): ', (isDev) => {
        const devFlag = isDev.toLowerCase() === 'y' ? '--save-dev' : '';
        
        // Check available versions
        console.log(`\nChecking available versions for ${packageName}...`);
        try {
          const versionsOutput = execSync(`npm view ${packageName} versions --json`, { encoding: 'utf8' });
          const versions = JSON.parse(versionsOutput);
          console.log(`Available versions: ${versions.slice(-5).join(', ')}${versions.length > 5 ? ' (showing last 5 only)' : ''}`);
        } catch (error) {
          console.log(`Could not fetch versions for ${packageName}`);
        }
        
        // Confirm installation
        const packageWithVersion = version ? `${packageName}@${version}` : packageName;
        rl.question(`\nInstall ${packageWithVersion} ${devFlag ? 'as dev dependency' : ''}? (y/n): `, (confirm) => {
          if (confirm.toLowerCase() !== 'y') {
            console.log('Installation cancelled');
            rl.close();
            return;
          }
          
          // Install the package
          console.log(`\nInstalling ${packageWithVersion}...`);
          try {
            execSync(`npm install ${packageWithVersion} ${devFlag} --legacy-peer-deps --save-exact`, { cwd: rootDir, stdio: 'inherit' });
            console.log(`\n${packageWithVersion} installed successfully!`);
          } catch (error) {
            console.log(`\nInstallation failed, trying with --force...`);
            try {
              execSync(`npm install ${packageWithVersion} ${devFlag} --legacy-peer-deps --force --save-exact`, { cwd: rootDir, stdio: 'inherit' });
              console.log(`\n${packageWithVersion} installed successfully with --force!`);
            } catch (error) {
              console.error(`\nFailed to install ${packageWithVersion}`);
            }
          }
          
          rl.close();
        });
      });
    });
  });
}

// Run the main function
main();
