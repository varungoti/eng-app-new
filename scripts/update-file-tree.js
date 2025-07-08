/**
 * Update File Tree Script
 *
 * This script generates a file-folder tree of the project and saves it to the memory bank.
 * It can be run manually or as part of a Git hook to keep the tree updated.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_BANK_DIR = path.join(__dirname, '..', 'memory-bank');
const FILE_TREE_PATH = path.join(MEMORY_BANK_DIR, 'file-tree.md');

// Directories to exclude from the tree
const EXCLUDE_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.vscode',
  '.idea'
];

// File extensions to exclude from the tree
const EXCLUDE_EXTENSIONS = [
  '.log',
  '.lock',
  '.map',
  '.DS_Store'
];

/**
 * Main function to run the Update File Tree script
 */
function main() {
  console.log('\n=== Updating Project File Tree ===\n');

  try {
    // Create the memory bank directory if it doesn't exist
    if (!fs.existsSync(MEMORY_BANK_DIR)) {
      fs.mkdirSync(MEMORY_BANK_DIR, { recursive: true });
    }

    // Generate the file tree
    const projectRoot = path.resolve(__dirname, '..');
    const fileTree = generateFileTree(projectRoot);

    // Write the file tree to the memory bank
    const today = new Date().toISOString().split('T')[0];
    const content = `# SpeakWell English Learning Application - File Tree\n\n` +
                   `Last updated: ${today}\n\n` +
                   `This document contains the file-folder structure of the SpeakWell English Learning Application. ` +
                   `It is automatically generated and updated when files are created or modified.\n\n` +
                   `\`\`\`\n${fileTree}\n\`\`\`\n`;

    fs.writeFileSync(FILE_TREE_PATH, content, 'utf8');

    console.log(`File tree updated successfully at ${FILE_TREE_PATH}`);
  } catch (error) {
    console.error('Error updating file tree:', error.message);
  }
}

/**
 * Generate a file tree for the given directory
 */
function generateFileTree(rootDir) {
  try {
    // Try to use the tree command if available (Unix-like systems)
    if (process.platform !== 'win32') {
      try {
        const excludeArgs = EXCLUDE_DIRS.map(dir => `-I "${dir}"`).join(' ');
        const output = execSync(`cd "${rootDir}" && tree -a ${excludeArgs}`, { encoding: 'utf8' });
        return output;
      } catch (error) {
        // tree command not available, fall back to custom implementation
        console.log('tree command not available, using custom implementation');
      }
    }

    // Custom implementation for Windows or if tree command is not available
    return customGenerateFileTree(rootDir);
  } catch (error) {
    console.error('Error generating file tree:', error.message);
    return 'Error generating file tree';
  }
}

/**
 * Custom implementation of file tree generation
 */
function customGenerateFileTree(rootDir, prefix = '') {
  let result = rootDir.split(path.sep).pop() + '\n';

  const entries = fs.readdirSync(rootDir, { withFileTypes: true });

  // Sort entries: directories first, then files
  const sortedEntries = entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  // Process each entry
  sortedEntries.forEach((entry, index) => {
    const isLast = index === sortedEntries.length - 1;
    const entryPath = path.join(rootDir, entry.name);

    // Skip excluded directories and files
    if (EXCLUDE_DIRS.includes(entry.name)) return;
    if (entry.isFile() && EXCLUDE_EXTENSIONS.some(ext => entry.name.endsWith(ext))) return;

    const connector = isLast ? '└── ' : '├── ';
    const newPrefix = prefix + (isLast ? '    ' : '│   ');

    result += prefix + connector + entry.name + '\n';

    if (entry.isDirectory()) {
      try {
        result += customGenerateFileTree(entryPath, newPrefix);
      } catch (error) {
        result += newPrefix + 'Error: ' + error.message + '\n';
      }
    }
  });

  return result;
}

/**
 * Install a Git hook to update the file tree on post-commit
 */
function installGitHook() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const hooksDir = path.join(projectRoot, '.git', 'hooks');
    const postCommitHookPath = path.join(hooksDir, 'post-commit');

    // Create the hooks directory if it doesn't exist
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Check if the post-commit hook already exists
    let hookContent = '';
    if (fs.existsSync(postCommitHookPath)) {
      hookContent = fs.readFileSync(postCommitHookPath, 'utf8');

      // Check if our script is already in the hook
      if (hookContent.includes('update-file-tree.js')) {
        console.log('File tree update already in post-commit hook');
        return;
      }

      // Add a newline if the file doesn't end with one
      if (!hookContent.endsWith('\n')) {
        hookContent += '\n';
      }
    } else {
      // Create a new hook file with the shebang line
      hookContent = '#!/bin/sh\n\n';
    }

    // Add our script to the hook
    hookContent += '# Update file tree\nnode "' + path.join(__dirname, 'update-file-tree.js') + '"\n';

    // Write the updated hook
    fs.writeFileSync(postCommitHookPath, hookContent, 'utf8');

    // Make the hook executable
    if (process.platform !== 'win32') {
      execSync(`chmod +x "${postCommitHookPath}"`);
    } else {
      try {
        execSync(`icacls "${postCommitHookPath}" /grant Everyone:RX`);
      } catch (error) {
        console.warn('Warning: Could not make post-commit hook executable on Windows.');
        console.warn('You may need to run the update-file-tree script manually.');
      }
    }

    console.log('Git hook installed successfully');
  } catch (error) {
    console.error('Error installing Git hook:', error.message);
  }
}

// Main function execution
function run() {
  // Check if the script is being run with the --install-hook flag
  if (process.argv.includes('--install-hook')) {
    installGitHook();
  } else {
    // Run the main function
    main();
  }
}

// Run the script
run();
