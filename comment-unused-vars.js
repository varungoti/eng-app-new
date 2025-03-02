import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Finding and commenting out unused variables...');

// Generate a report of unused variables using ESLint
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
      
      // Skip if this is an import (already handled by the other script)
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
  console.log('🎉 Done! Now try running your build command.');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Make sure ESLint is properly installed and configured.');
} 