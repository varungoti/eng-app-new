import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛠️ Beginning TypeScript error fixing process...');

// Function to handle unused imports
function fixUnusedImports() {
  console.log('🔍 Finding and commenting out unused imports...');
  
  try {
    // Run ESLint to identify unused imports
    const output = execSync(
      'npx eslint --quiet "src/**/*.tsx" "src/**/*.ts" --rule "no-unused-vars: error" --format json',
      { encoding: 'utf-8' }
    );
    
    const results = JSON.parse(output);
    const fileProblems = new Map();
    
    // Group problems by file
    results.forEach(result => {
      const { filePath, messages } = result;
      
      // Filter for unused imports
      const unusedImports = messages.filter(msg => 
        msg.ruleId === 'no-unused-vars' && 
        msg.message.includes(' is defined but never used') &&
        (() => {
          // Read the file content to check if the variable is from an import
          const content = fs.readFileSync(filePath, 'utf8');
          const lines = content.split('\n');
          const lineContent = lines[msg.line - 1];
          return lineContent.includes('import ');
        })()
      );
      
      if (unusedImports.length > 0) {
        fileProblems.set(filePath, unusedImports);
      }
    });
    
    console.log(`Found unused imports in ${fileProblems.size} files.`);
    
    // Process each file
    let totalCommentsAdded = 0;
    
    for (const [filePath, problems] of fileProblems) {
      console.log(`Processing ${path.relative(__dirname, filePath)}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Sort problems by line number in descending order to avoid offset issues
      problems.sort((a, b) => b.line - a.line);
      
      for (const problem of problems) {
        const { line, message } = problem;
        const lineIndex = line - 1;
        const lineContent = lines[lineIndex];
        
        // Extract the unused import name from the message
        const match = message.match(/'([^']+)' is defined but never used/);
        if (!match) continue;
        
        const unusedImport = match[1];
        
        // Handle default imports: import React from 'react'
        if (lineContent.match(new RegExp(`import\\s+${unusedImport}\\s+from`))) {
          lines[lineIndex] = `// ${lineContent} // Unused import`;
          totalCommentsAdded++;
        }
        // Handle named imports: import { useState, useEffect } from 'react'
        else if (lineContent.includes('import {') && lineContent.includes('}')) {
          // Check if the entire import statement is unused
          const importPattern = /import\s*\{\s*([^}]+)\s*\}\s*from/;
          const importMatch = lineContent.match(importPattern);
          
          if (importMatch) {
            const importedItems = importMatch[1].split(',').map(item => item.trim());
            // If all items are the same as the unused import, comment out the whole line
            if (importedItems.length === 1 && importedItems[0] === unusedImport) {
              lines[lineIndex] = `// ${lineContent} // Unused import`;
            } else {
              // Comment out just the unused import
              const newLineContent = lineContent.replace(
                new RegExp(`(\\s|,)${unusedImport}(\\s|,|$)`),
                (match) => {
                  // Keep the commas and spaces but comment out the import name
                  return match.replace(unusedImport, `/* ${unusedImport} */`);
                }
              );
              lines[lineIndex] = newLineContent;
            }
            totalCommentsAdded++;
          }
        }
        // Handle side-effect imports: import 'tailwindcss/tailwind.css'
        else if (lineContent.match(/import\s+['"].*['"];?$/)) {
          // These are usually side-effect imports and should not be commented out
          continue;
        }
        // Handle any other import patterns
        else if (lineContent.includes('import ')) {
          lines[lineIndex] = `// ${lineContent} // Check unused import`;
          totalCommentsAdded++;
        }
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    }
    
    console.log(`✅ Commented out ${totalCommentsAdded} unused imports across ${fileProblems.size} files.`);
    return true;
  } catch (error) {
    console.error('❌ Error fixing unused imports:', error.message);
    console.error('Make sure ESLint is properly installed and configured.');
    return false;
  }
}

// Function to handle unused variables
function fixUnusedVariables() {
  console.log('🔍 Finding and commenting out unused variables...');
  
  try {
    // Run ESLint to identify unused variables
    const output = execSync(
      'npx eslint --quiet "src/**/*.tsx" "src/**/*.ts" --rule "no-unused-vars: error" --rule "@typescript-eslint/no-unused-vars: error" --format json',
      { encoding: 'utf-8' }
    );
    
    const results = JSON.parse(output);
    const fileProblems = new Map();
    
    // Group problems by file
    results.forEach(result => {
      const { filePath, messages } = result;
      
      // Filter for unused variables
      const unusedVars = messages.filter(msg => 
        (msg.ruleId === 'no-unused-vars' || msg.ruleId === '@typescript-eslint/no-unused-vars')
      );
      
      if (unusedVars.length > 0) {
        fileProblems.set(filePath, unusedVars);
      }
    });
    
    console.log(`Found unused variables in ${fileProblems.size} files.`);
    
    // Process each file
    let totalCommentsAdded = 0;
    
    for (const [filePath, problems] of fileProblems) {
      console.log(`Processing ${path.relative(__dirname, filePath)}`);
      
      let content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Sort problems by line number in descending order to avoid offset issues
      problems.sort((a, b) => b.line - a.line);
      
      for (const problem of problems) {
        const { line, message } = problem;
        const lineIndex = line - 1;
        
        // Extract the variable name from the error message
        const match = message.match(/'([^']+)' is defined but never used/);
        if (!match) continue;
        
        const unusedVar = match[1];
        const lineContent = lines[lineIndex];
        
        // Skip if this is an import (already handled by fixUnusedImports)
        if (lineContent.includes('import ')) {
          continue;
        }
        
        // Handle variable declarations (const, let, var)
        if (/\b(const|let|var)\s+(\w+|\{[^}]*\}|\[[^\]]*\])\s*=/.test(lineContent)) {
          // If it's a destructuring assignment like: const { a, b, c } = obj
          if (lineContent.includes(`{ ${unusedVar}`) || lineContent.includes(`, ${unusedVar}`) || lineContent.includes(`${unusedVar},`)) {
            // Comment out just the unused variable in the destructuring
            const parts = lineContent.split(/[{,}]/g);
            let newLineContent = '';
            let inBraces = false;
            
            for (let i = 0; i < parts.length; i++) {
              let part = parts[i];
              
              if (part.includes('{')) {
                inBraces = true;
                newLineContent += part;
                continue;
              }
              
              if (part.includes('}')) {
                inBraces = false;
                newLineContent += part;
                continue;
              }
              
              if (inBraces && part.trim() === unusedVar) {
                newLineContent += `/* ${part} */`;
              } else {
                newLineContent += part;
              }
              
              if (i < parts.length - 1 && !parts[i+1].includes('}')) {
                newLineContent += ',';
              }
            }
            
            lines[lineIndex] = newLineContent;
          } else if (lineContent.match(new RegExp(`\\b(const|let|var)\\s+${unusedVar}\\s*=`))) {
            // For simple variable declarations: const name = value
            lines[lineIndex] = `// ${lineContent} // Unused variable`;
          }
          
          totalCommentsAdded++;
        }
        
        // Handle function parameters
        else if (/function\s+\w+\s*\([^)]*\)/.test(lineContent) && lineContent.includes(unusedVar)) {
          // Comment out the parameter by adding an underscore prefix (TypeScript convention)
          lines[lineIndex] = lineContent.replace(
            new RegExp(`\\b${unusedVar}\\b`),
            `_${unusedVar} /* Unused parameter */`
          );
          totalCommentsAdded++;
        }
        
        // Handle function arguments in arrow functions: (a, b) => {}
        else if (/\([^)]*\)\s*=>/.test(lineContent) && lineContent.includes(unusedVar)) {
          // Comment out the parameter by adding an underscore prefix
          lines[lineIndex] = lineContent.replace(
            new RegExp(`\\b${unusedVar}\\b`),
            `_${unusedVar} /* Unused parameter */`
          );
          totalCommentsAdded++;
        }
        
        // Handle interface properties and type declarations
        else if ((/interface\s+\w+/.test(lineContent) || /type\s+\w+\s*=/.test(lineContent)) 
          && lineContent.includes(unusedVar)) {
            // This is a bit risky, so we'll just add a comment
            lines[lineIndex] = `${lineContent} /* Contains unused property: ${unusedVar} */`;
            totalCommentsAdded++;
        }
      }
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    }
    
    console.log(`✅ Added comments to ${totalCommentsAdded} unused variables across ${fileProblems.size} files.`);
    return true;
  } catch (error) {
    console.error('❌ Error fixing unused variables:', error.message);
    console.error('Make sure ESLint is properly installed and configured.');
    return false;
  }
}

// Function to fix LogContext issues
function fixLogContextIssues() {
  console.log('🔍 Fixing LogContext issues...');
  
  try {
    const filesToFix = [
      'src/lib/supabaseClient.ts',
      'src/lib/supabase.ts',
      'src/lib/queryClient.ts'
    ];
    
    let totalFixedFiles = 0;
    
    for (const filePath of filesToFix) {
      if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File not found: ${filePath}`);
        continue;
      }
      
      console.log(`Processing ${filePath}`);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Replace `{ service: "supabase" }` with `{ source: "supabase" }`
      const serviceRegex = /{\s*service:\s*["']([^"']+)["']\s*}/g;
      const updatedContent = content.replace(serviceRegex, '{ source: "$1" }');
      
      // Replace string literals passed to logger with proper objects
      const stringLiteralRegex = /logger\.(info|error|warn|debug)\((.*?)["']([^"']+)["']\)/g;
      const updatedContent2 = updatedContent.replace(stringLiteralRegex, (match, level, prefix, value) => {
        // If it already has a context object, leave it alone
        if (prefix.includes('{') && prefix.includes('}')) {
          return match;
        }
        return `logger.${level}(${prefix}"${value}", { source: "app" })`;
      });
      
      if (content !== updatedContent2) {
        fs.writeFileSync(filePath, updatedContent2, 'utf8');
        totalFixedFiles++;
        console.log(`✅ Fixed LogContext issues in ${filePath}`);
      } else {
        console.log(`No LogContext issues found in ${filePath}`);
      }
    }
    
    console.log(`✅ Fixed LogContext issues in ${totalFixedFiles} files.`);
    return true;
  } catch (error) {
    console.error('❌ Error fixing LogContext issues:', error.message);
    return false;
  }
}

// Main function to coordinate all fixes
async function fixAllIssues() {
  console.log('🚀 Starting the TypeScript error fixing process...');
  
  // Step 1: Fix LogContext issues
  const logContextSuccess = fixLogContextIssues();
  if (!logContextSuccess) {
    console.error('⚠️ Failed to fix LogContext issues, but continuing with other fixes...');
  }
  
  // Step 2: Fix unused imports
  const importsSuccess = fixUnusedImports();
  if (!importsSuccess) {
    console.error('⚠️ Failed to fix unused imports, but continuing with other fixes...');
  }
  
  // Step 3: Fix unused variables
  const variablesSuccess = fixUnusedVariables();
  if (!variablesSuccess) {
    console.error('⚠️ Failed to fix unused variables.');
  }
  
  // Final status
  if (logContextSuccess && importsSuccess && variablesSuccess) {
    console.log('🎉 All fixes applied successfully!');
  } else {
    console.log('⚠️ Some fixes were not applied successfully. Check the logs above for details.');
  }
  
  console.log('🔄 Now try running your build command to see if the errors have been resolved:');
  console.log('npm run build');
}

// Run the main function
fixAllIssues().catch(error => {
  console.error('❌ An unexpected error occurred:', error);
}); 