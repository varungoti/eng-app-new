/**
 * Memory Bank Manager
 * 
 * A simple utility script to help manage the Memory Bank system.
 * This script provides commands for common Memory Bank operations.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MEMORY_BANK_DIR = path.join(__dirname, '..', 'memory-bank');
const TASKS_FILE = path.join(MEMORY_BANK_DIR, 'tasks.md');
const ACTIVE_CONTEXT_FILE = path.join(MEMORY_BANK_DIR, 'activeContext.md');
const PROGRESS_FILE = path.join(MEMORY_BANK_DIR, 'progress.md');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function to run the Memory Bank Manager
 */
function main() {
  console.log('\n=== SpeakWell Memory Bank Manager ===\n');
  showMenu();
}

/**
 * Display the main menu
 */
function showMenu() {
  console.log('Available commands:');
  console.log('1. List all tasks');
  console.log('2. Add new task');
  console.log('3. Update task status');
  console.log('4. View active context');
  console.log('5. Update active context');
  console.log('6. View progress');
  console.log('7. Update progress');
  console.log('8. Exit');
  
  rl.question('\nEnter command number: ', (answer) => {
    switch (answer) {
      case '1':
        listTasks();
        break;
      case '2':
        addTask();
        break;
      case '3':
        updateTaskStatus();
        break;
      case '4':
        viewActiveContext();
        break;
      case '5':
        updateActiveContext();
        break;
      case '6':
        viewProgress();
        break;
      case '7':
        updateProgress();
        break;
      case '8':
        console.log('Exiting Memory Bank Manager');
        rl.close();
        return;
      default:
        console.log('Invalid command. Please try again.');
        showMenu();
        break;
    }
  });
}

/**
 * List all tasks from tasks.md
 */
function listTasks() {
  try {
    const tasksContent = fs.readFileSync(TASKS_FILE, 'utf8');
    const taskSections = tasksContent.split('###').slice(1);
    
    console.log('\n=== Current Tasks ===\n');
    
    taskSections.forEach(section => {
      const sectionLines = section.split('\n');
      const sectionName = sectionLines[0].trim();
      
      if (sectionName !== 'Completed Tasks' && sectionName !== 'Backlog' && sectionName !== 'Task Management Guidelines') {
        console.log(`\n--- ${sectionName} ---`);
        
        // Find the table in this section
        const tableStartIndex = sectionLines.findIndex(line => line.includes('| ID | Task |'));
        if (tableStartIndex !== -1) {
          // Skip the header and separator rows
          for (let i = tableStartIndex + 2; i < sectionLines.length; i++) {
            const line = sectionLines[i].trim();
            if (line.startsWith('|') && line.endsWith('|')) {
              const columns = line.split('|').map(col => col.trim()).filter(col => col);
              if (columns.length >= 4) {
                console.log(`${columns[0]} - ${columns[1]} (${columns[4] || 'No status'})`);
              }
            }
          }
        }
      }
    });
    
    console.log('\n');
    showMenu();
  } catch (error) {
    console.error('Error reading tasks file:', error);
    showMenu();
  }
}

/**
 * Add a new task to tasks.md
 */
function addTask() {
  console.log('\n=== Add New Task ===\n');
  
  rl.question('Task ID (e.g., CM-004): ', (id) => {
    rl.question('Task name: ', (name) => {
      rl.question('Task description: ', (description) => {
        rl.question('Priority (HIGH/MEDIUM/LOW): ', (priority) => {
          rl.question('Category (Content Management, User Management, etc.): ', (category) => {
            rl.question('Dependencies (comma-separated task IDs, or none): ', (dependencies) => {
              try {
                const tasksContent = fs.readFileSync(TASKS_FILE, 'utf8');
                const categoryHeader = `### ${category}`;
                
                if (!tasksContent.includes(categoryHeader)) {
                  console.log(`Category "${category}" not found in tasks.md. Please use an existing category.`);
                  showMenu();
                  return;
                }
                
                // Find the category section and its table
                const sections = tasksContent.split('###');
                const categoryIndex = sections.findIndex(section => 
                  section.trim().startsWith(category));
                
                if (categoryIndex === -1) {
                  console.log(`Category "${category}" not found in tasks.md. Please use an existing category.`);
                  showMenu();
                  return;
                }
                
                // Create the new task row
                const newTaskRow = `| ${id} | ${name} | ${description} | ${priority} | 📋 PLANNED | | ${dependencies || ''} | |`;
                
                // Insert the new task into the table
                const categorySection = sections[categoryIndex];
                const tableStartIndex = categorySection.indexOf('| ID | Task |');
                
                if (tableStartIndex === -1) {
                  console.log(`Table not found in category "${category}". Please check the file structure.`);
                  showMenu();
                  return;
                }
                
                const tableEndIndex = categorySection.indexOf('\n\n', tableStartIndex);
                const beforeTable = categorySection.substring(0, tableStartIndex);
                const table = categorySection.substring(tableStartIndex, tableEndIndex !== -1 ? tableEndIndex : undefined);
                const afterTable = tableEndIndex !== -1 ? categorySection.substring(tableEndIndex) : '';
                
                // Split the table into lines
                const tableLines = table.split('\n');
                // Add the new task row after the header and separator
                tableLines.push(newTaskRow);
                
                // Reconstruct the category section
                sections[categoryIndex] = beforeTable + tableLines.join('\n') + afterTable;
                
                // Write the updated content back to the file
                fs.writeFileSync(TASKS_FILE, sections.join('###'), 'utf8');
                
                console.log(`\nTask ${id} added successfully!\n`);
                showMenu();
              } catch (error) {
                console.error('Error adding task:', error);
                showMenu();
              }
            });
          });
        });
      });
    });
  });
}

/**
 * Update the status of an existing task
 */
function updateTaskStatus() {
  console.log('\n=== Update Task Status ===\n');
  
  rl.question('Task ID to update: ', (id) => {
    rl.question('New status (PLANNED, IN PROGRESS, COMPLETED, REVIEW, BLOCKED, CANCELLED): ', (statusText) => {
      try {
        const tasksContent = fs.readFileSync(TASKS_FILE, 'utf8');
        
        // Map status text to emoji
        const statusMap = {
          'PLANNED': '📋 PLANNED',
          'IN PROGRESS': '🔄 IN PROGRESS',
          'COMPLETED': '✅ COMPLETED',
          'REVIEW': '🔍 REVIEW',
          'BLOCKED': '⏸️ BLOCKED',
          'CANCELLED': '🚫 CANCELLED'
        };
        
        const status = statusMap[statusText.toUpperCase()] || '📋 PLANNED';
        
        // Find the task by ID
        const taskRegex = new RegExp(`\\| ${id} \\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|`, 'g');
        const taskMatch = tasksContent.match(taskRegex);
        
        if (!taskMatch) {
          console.log(`Task ${id} not found. Please check the ID.`);
          showMenu();
          return;
        }
        
        // Update the status in the task row
        const oldTaskRow = taskMatch[0];
        const columns = oldTaskRow.split('|');
        columns[5] = ` ${status} `; // Status is in the 5th column (index 5)
        const newTaskRow = columns.join('|');
        
        // Replace the old task row with the new one
        const updatedContent = tasksContent.replace(oldTaskRow, newTaskRow);
        
        // If task is completed, move it to the Completed Tasks section
        let finalContent = updatedContent;
        if (status === '✅ COMPLETED') {
          // Remove the task from its current section
          const completedTaskRegex = new RegExp(`\\| ${id} \\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|\\n`, 'g');
          const taskToMove = updatedContent.match(completedTaskRegex)[0];
          finalContent = updatedContent.replace(completedTaskRegex, '');
          
          // Extract task details
          const taskDetails = taskToMove.split('|').map(col => col.trim()).filter(col => col);
          
          // Create a new entry for the Completed Tasks section
          const today = new Date().toISOString().split('T')[0];
          const completedTaskEntry = `| ${taskDetails[0]} | ${taskDetails[1]} | ${taskDetails[2]} | ${today} | | |\n`;
          
          // Add to the Completed Tasks section
          const completedTasksSection = '## Completed Tasks';
          const completedTasksIndex = finalContent.indexOf(completedTasksSection);
          
          if (completedTasksIndex !== -1) {
            const tableStartIndex = finalContent.indexOf('| ID | Task |', completedTasksIndex);
            if (tableStartIndex !== -1) {
              const tableEndIndex = finalContent.indexOf('\n\n', tableStartIndex);
              const beforeTable = finalContent.substring(0, tableStartIndex);
              const table = finalContent.substring(tableStartIndex, tableEndIndex !== -1 ? tableEndIndex : undefined);
              const afterTable = tableEndIndex !== -1 ? finalContent.substring(tableEndIndex) : '';
              
              // Split the table into lines
              const tableLines = table.split('\n');
              // Add the new completed task row after the header and separator
              tableLines.push(completedTaskEntry);
              
              // Reconstruct the content
              finalContent = beforeTable + tableLines.join('\n') + afterTable;
            }
          }
        }
        
        // Write the updated content back to the file
        fs.writeFileSync(TASKS_FILE, finalContent, 'utf8');
        
        console.log(`\nTask ${id} status updated to ${status}!\n`);
        showMenu();
      } catch (error) {
        console.error('Error updating task status:', error);
        showMenu();
      }
    });
  });
}

/**
 * View the active context
 */
function viewActiveContext() {
  try {
    const activeContextContent = fs.readFileSync(ACTIVE_CONTEXT_FILE, 'utf8');
    console.log('\n=== Active Context ===\n');
    console.log(activeContextContent);
    console.log('\n');
    showMenu();
  } catch (error) {
    console.error('Error reading active context file:', error);
    showMenu();
  }
}

/**
 * Update the active context
 */
function updateActiveContext() {
  console.log('\n=== Update Active Context ===\n');
  console.log('This will open the activeContext.md file in your default editor.');
  
  rl.question('Press Enter to continue or type "cancel" to go back: ', (answer) => {
    if (answer.toLowerCase() === 'cancel') {
      showMenu();
      return;
    }
    
    try {
      // This is a simple approach - in a real implementation, you might want to use a proper editor
      console.log(`Please edit the file at: ${ACTIVE_CONTEXT_FILE}`);
      console.log('When you are done, come back to this terminal.');
      
      rl.question('Press Enter when you have finished editing: ', () => {
        console.log('\nActive context updated!\n');
        showMenu();
      });
    } catch (error) {
      console.error('Error updating active context:', error);
      showMenu();
    }
  });
}

/**
 * View the progress
 */
function viewProgress() {
  try {
    const progressContent = fs.readFileSync(PROGRESS_FILE, 'utf8');
    console.log('\n=== Progress ===\n');
    console.log(progressContent);
    console.log('\n');
    showMenu();
  } catch (error) {
    console.error('Error reading progress file:', error);
    showMenu();
  }
}

/**
 * Update the progress
 */
function updateProgress() {
  console.log('\n=== Update Progress ===\n');
  console.log('This will open the progress.md file in your default editor.');
  
  rl.question('Press Enter to continue or type "cancel" to go back: ', (answer) => {
    if (answer.toLowerCase() === 'cancel') {
      showMenu();
      return;
    }
    
    try {
      // This is a simple approach - in a real implementation, you might want to use a proper editor
      console.log(`Please edit the file at: ${PROGRESS_FILE}`);
      console.log('When you are done, come back to this terminal.');
      
      rl.question('Press Enter when you have finished editing: ', () => {
        console.log('\nProgress updated!\n');
        showMenu();
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      showMenu();
    }
  });
}

// Run the main function
main();
