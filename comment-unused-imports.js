import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Finding and commenting out unused imports...');

// Generate a report of unused imports using ESLint
try {
  // First, run ESLint to identify unused imports
  const output = execSync(
    'npx eslint --quiet "src/**/*.tsx" "src/**/*.ts" --rule "no-unused-vars: error" --rule "@typescript-eslint/no-unused-vars: error" --format json',
    { encoding: 'utf-8' }
  );
  
  const results = JSON.parse(output);
  const fileProblems = new Map();
  
  // Group problems by file
  results.forEach(result => {
    const { filePath, messages } = result;
    
    // Filter only for unused import messages
    const unusedImports = messages.filter(msg => 
      (msg.ruleId === 'no-unused-vars' || msg.ruleId === '@typescript-eslint/no-unused-vars') &&
      msg.line <= 30 // Most imports are at the top of files
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
      
      // Extract the import variable name from the error message
      const match = message.match(/'([^']+)' is defined but never used/);
      if (!match) continue;
      
      const unusedVar = match[1];
      const lineContent = lines[lineIndex];
      
      // Check if this line is an import statement
      if (lineContent.includes('import ')) {
        // If it's a destructured import like: import { A, B, C } from 'module'
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
        } else if (lineContent.includes(`import ${unusedVar} from`)) {
          // For default imports: import Name from 'module'
          lines[lineIndex] = `// ${lineContent} // Unused import`;
        }
        
        totalCommentsAdded++;
      }
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  }
  
  console.log(`✅ Added comments to ${totalCommentsAdded} unused imports across ${fileProblems.size} files.`);
  console.log('🎉 Done! Now try running your build command.');
  
} catch (error) {
  console.error('Error:', error.message);
  console.error('Make sure ESLint is properly installed and configured.');
} 