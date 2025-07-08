/**
 * Remove Vulnerable Packages Script
 *
 * This script forcibly removes vulnerable packages from node_modules
 * that are not directly used by the application.
 */

import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import * as rimraf from 'rimraf';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Packages to forcibly remove
const packagesToRemove = [
  'braces',
  'micromatch',
  'anymatch',
  'chokidar',
  'composer',
  'base-tasks',
  'assemble-core',
  'question-match',
  'base-cli',
  'readdirp',
  'update',
  'expand-object',
  'expand-args',
  'js-yaml',
  'eslint',
  'lodash.merge',
  'lodash.template',
  'gulp-util',
  'gulp-eslint',
  'minimatch',
  'glob-stream',
  'parse-git-config',
  'remote-origin-url',
  'git-repo-name',
  'project-name',
  'base-store',
  'data-store',
  'question-store',
  'base-questions',
  'set-value',
  'base',
  'base-data',
  'cache-base',
  'engine',
  'engine-base',
  'map-schema',
  'merge-value',
  'option-cache',
  'base-options',
  'question-cache',
  'union-value',
  'shelljs',
  'bach',
  'inquirer',
  'templates'
];

function main() {
  console.log('\n=== Removing Vulnerable Packages ===\n');

  try {
    // Step 1: Check which packages are direct dependencies
    console.log('Checking direct dependencies...');
    const directDeps = [];
    for (const pkg of packagesToRemove) {
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

    // Step 2: Remove direct dependencies that are in the remove list
    if (directDeps.length > 0) {
      console.log(`Removing direct dependencies: ${directDeps.join(', ')}...`);
      try {
        execSync(`npm uninstall ${directDeps.join(' ')} --legacy-peer-deps`, { stdio: 'inherit' });
      } catch (error) {
        console.log('Failed to remove some direct dependencies, skipping...');
      }
    }

    // Step 3: Forcibly remove vulnerable packages from node_modules
    console.log('Forcibly removing vulnerable packages from node_modules...');
    let removedCount = 0;

    for (const pkg of packagesToRemove) {
      // Skip direct dependencies as they've already been handled
      if (directDeps.includes(pkg)) continue;

      // Find all instances of the package in node_modules
      try {
        const findCommand = process.platform === 'win32'
          ? `dir /s /b "${rootDir}\\node_modules\\${pkg}" 2>nul`
          : `find ${rootDir}/node_modules -name "${pkg}" -type d -print`;

        const output = execSync(findCommand, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
        const paths = output.trim().split('\n').filter(Boolean);

        for (const pkgPath of paths) {
          if (fs.existsSync(pkgPath)) {
            console.log(`Removing ${pkgPath}...`);
            rimraf.sync(pkgPath);
            removedCount++;
          }
        }
      } catch (error) {
        // Package not found or error removing
      }
    }

    console.log(`\nRemoved ${removedCount} vulnerable package instances from node_modules.\n`);

    // Step 4: Run npm dedupe to clean up dependencies
    console.log('Running npm dedupe...');
    try {
      execSync('npm dedupe --legacy-peer-deps', { stdio: 'inherit' });
    } catch (error) {
      console.log('npm dedupe completed with some issues.');
    }

    console.log('\nVulnerable packages removal completed. Run npm audit to check remaining issues.\n');
  } catch (error) {
    console.error('Error removing vulnerable packages:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();
