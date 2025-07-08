/**
 * Install Git Hooks Script
 * 
 * This script installs Git hooks for the Memory Bank system.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Paths
const HOOKS_DIR = path.join(__dirname, '..', '.git', 'hooks');
const PRE_COMMIT_HOOK = path.join(HOOKS_DIR, 'pre-commit');
const POST_COMMIT_HOOK = path.join(HOOKS_DIR, 'post-commit');

// Hook content
const PRE_COMMIT_CONTENT = `#!/usr/bin/env node

/**
 * Pre-commit hook for Memory Bank
 * 
 * This hook reminds developers to update the Memory Bank before committing.
 */

console.log('\\n=== Memory Bank Pre-Commit Check ===');
console.log('Have you updated the Memory Bank with your changes?');
console.log('If not, consider running \'npm run update-memory\' before committing.\\n');

// Continue with the commit
process.exit(0);
`;

const POST_COMMIT_CONTENT = `#!/usr/bin/env node

/**
 * Post-commit hook for Memory Bank
 * 
 * This hook reminds developers to update the Memory Bank after committing.
 */

console.log('\\n=== Memory Bank Post-Commit Reminder ===');
console.log('Don\\'t forget to update the Memory Bank with your changes!');
console.log('Run \\'npm run update-memory\\' to update the Memory Bank.\\n');

// Uncomment the following line to automatically run the update script
// require('child_process').execSync('npm run update-memory', { stdio: 'inherit' });
`;

/**
 * Install hooks
 */
function installHooks() {
  console.log('Installing Git hooks for Memory Bank...');
  
  // Create hooks directory if it doesn't exist
  if (!fs.existsSync(HOOKS_DIR)) {
    console.log('Creating hooks directory...');
    fs.mkdirSync(HOOKS_DIR, { recursive: true });
  }
  
  // Install pre-commit hook
  console.log('Installing pre-commit hook...');
  fs.writeFileSync(PRE_COMMIT_HOOK, PRE_COMMIT_CONTENT, 'utf8');
  makeExecutable(PRE_COMMIT_HOOK);
  
  // Install post-commit hook
  console.log('Installing post-commit hook...');
  fs.writeFileSync(POST_COMMIT_HOOK, POST_COMMIT_CONTENT, 'utf8');
  makeExecutable(POST_COMMIT_HOOK);
  
  console.log('Git hooks installed successfully!');
}

/**
 * Make a file executable
 */
function makeExecutable(filePath) {
  try {
    // For Unix-like systems
    if (process.platform !== 'win32') {
      execSync(`chmod +x ${filePath}`);
    } else {
      // For Windows, we can't make it executable in the same way,
      // but we can ensure it's readable by everyone
      execSync(`icacls "${filePath}" /grant Everyone:RX`);
    }
  } catch (error) {
    console.warn(`Warning: Could not make ${filePath} executable. You may need to do this manually.`);
    console.warn(`Error: ${error.message}`);
  }
}

// Run the installation
installHooks();
