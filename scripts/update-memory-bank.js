/**
 * Memory Bank Update Script
 * 
 * This script automates the process of updating the Memory Bank files
 * based on git commits and project status.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const MEMORY_BANK_DIR = path.join(__dirname, '..', 'memory-bank');
const TASKS_FILE = path.join(MEMORY_BANK_DIR, 'tasks.md');
const ACTIVE_CONTEXT_FILE = path.join(MEMORY_BANK_DIR, 'activeContext.md');
const PROGRESS_FILE = path.join(MEMORY_BANK_DIR, 'progress.md');
const MEMORIES_FILE = path.join(MEMORY_BANK_DIR, 'memories.md');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function to run the Memory Bank Update script
 */
function main() {
  console.log('\n=== SpeakWell Memory Bank Update ===\n');
  
  // Get recent git commits
  const recentCommits = getRecentCommits();
  
  // Update last updated date in progress.md
  updateLastUpdatedDate();
  
  // Show menu
  showMenu(recentCommits);
}

/**
 * Get recent git commits
 */
function getRecentCommits() {
  try {
    const output = execSync('git log --pretty=format:"%h - %s (%cr)" -n 10').toString();
    return output.split('\n');
  } catch (error) {
    console.error('Error getting recent commits:', error.message);
    return [];
  }
}

/**
 * Update the last updated date in progress.md
 */
function updateLastUpdatedDate() {
  try {
    const content = fs.readFileSync(PROGRESS_FILE, 'utf8');
    const today = new Date().toISOString().split('T')[0];
    
    // Find the last updated line
    const lastUpdatedRegex = /- \*\*Last Updated\*\*: \d{4}-\d{2}-\d{2}/;
    const updatedContent = content.replace(lastUpdatedRegex, `- **Last Updated**: ${today}`);
    
    fs.writeFileSync(PROGRESS_FILE, updatedContent, 'utf8');
    console.log(`Updated last updated date to ${today} in progress.md`);
  } catch (error) {
    console.error('Error updating last updated date:', error.message);
  }
}

/**
 * Show the main menu
 */
function showMenu(recentCommits) {
  console.log('What would you like to update?');
  console.log('1. Update task status based on recent commits');
  console.log('2. Add recent accomplishment');
  console.log('3. Update component progress');
  console.log('4. Add technical decision');
  console.log('5. Add meeting note');
  console.log('6. Exit');
  
  rl.question('\nEnter option (1-6): ', (answer) => {
    switch (answer) {
      case '1':
        updateTaskStatus(recentCommits);
        break;
      case '2':
        addRecentAccomplishment();
        break;
      case '3':
        updateComponentProgress();
        break;
      case '4':
        addTechnicalDecision();
        break;
      case '5':
        addMeetingNote();
        break;
      case '6':
        console.log('Exiting Memory Bank Update');
        rl.close();
        return;
      default:
        console.log('Invalid option. Please try again.');
        showMenu(recentCommits);
        break;
    }
  });
}

/**
 * Update task status based on recent commits
 */
function updateTaskStatus(recentCommits) {
  console.log('\n=== Recent Commits ===');
  recentCommits.forEach((commit, index) => {
    console.log(`${index + 1}. ${commit}`);
  });
  
  rl.question('\nEnter commit number to use for task update (or 0 to go back): ', (answer) => {
    const commitIndex = parseInt(answer) - 1;
    
    if (answer === '0' || isNaN(commitIndex) || commitIndex < 0 || commitIndex >= recentCommits.length) {
      showMenu(recentCommits);
      return;
    }
    
    const commit = recentCommits[commitIndex];
    console.log(`\nSelected commit: ${commit}`);
    
    // Extract task ID from commit message
    const taskIdMatch = commit.match(/([A-Z]+-\d+(\.\d+)?)/);
    const taskId = taskIdMatch ? taskIdMatch[1] : null;
    
    if (taskId) {
      console.log(`Detected task ID: ${taskId}`);
      rl.question(`\nUpdate status for task ${taskId}? (y/n): `, (answer) => {
        if (answer.toLowerCase() === 'y') {
          rl.question('New status (PLANNED, IN PROGRESS, COMPLETED, REVIEW, BLOCKED, CANCELLED): ', (statusText) => {
            updateTaskStatusInFile(taskId, statusText);
          });
        } else {
          rl.question('\nEnter task ID to update: ', (taskId) => {
            rl.question('New status (PLANNED, IN PROGRESS, COMPLETED, REVIEW, BLOCKED, CANCELLED): ', (statusText) => {
              updateTaskStatusInFile(taskId, statusText);
            });
          });
        }
      });
    } else {
      console.log('No task ID detected in commit message.');
      rl.question('\nEnter task ID to update: ', (taskId) => {
        rl.question('New status (PLANNED, IN PROGRESS, COMPLETED, REVIEW, BLOCKED, CANCELLED): ', (statusText) => {
          updateTaskStatusInFile(taskId, statusText);
        });
      });
    }
  });
}

/**
 * Update task status in tasks.md
 */
function updateTaskStatusInFile(taskId, statusText) {
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
    const taskRegex = new RegExp(`\\| ${taskId} \\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|`, 'g');
    const taskMatch = tasksContent.match(taskRegex);
    
    if (!taskMatch) {
      console.log(`Task ${taskId} not found. Please check the ID.`);
      showMenu(getRecentCommits());
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
      const completedTaskRegex = new RegExp(`\\| ${taskId} \\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|.*\\|\\n`, 'g');
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
      
      // Also update the active context file
      updateActiveContext(taskId);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(TASKS_FILE, finalContent, 'utf8');
    
    console.log(`\nTask ${taskId} status updated to ${status}!\n`);
    
    // Also update the task in the active context file if it's there
    updateActiveContextTaskStatus(taskId, status);
    
    showMenu(getRecentCommits());
  } catch (error) {
    console.error('Error updating task status:', error);
    showMenu(getRecentCommits());
  }
}

/**
 * Update task status in activeContext.md
 */
function updateActiveContextTaskStatus(taskId, status) {
  try {
    const activeContextContent = fs.readFileSync(ACTIVE_CONTEXT_FILE, 'utf8');
    
    // Find the task by ID in the active tasks section
    const taskRegex = new RegExp(`\\| ${taskId} \\|.*\\|.*\\|.*\\|.*\\|.*\\|`, 'g');
    const taskMatch = activeContextContent.match(taskRegex);
    
    if (!taskMatch) {
      // Task not in active context, no need to update
      return;
    }
    
    // Update the status in the task row
    const oldTaskRow = taskMatch[0];
    const columns = oldTaskRow.split('|');
    columns[4] = ` ${status} `; // Status is in the 4th column (index 4) in active context
    const newTaskRow = columns.join('|');
    
    // Replace the old task row with the new one
    const updatedContent = activeContextContent.replace(oldTaskRow, newTaskRow);
    
    // Write the updated content back to the file
    fs.writeFileSync(ACTIVE_CONTEXT_FILE, updatedContent, 'utf8');
    
    console.log(`Updated task ${taskId} status in activeContext.md`);
  } catch (error) {
    console.error('Error updating task status in active context:', error);
  }
}

/**
 * Remove a task from activeContext.md
 */
function updateActiveContext(taskId) {
  try {
    const activeContextContent = fs.readFileSync(ACTIVE_CONTEXT_FILE, 'utf8');
    
    // Find the task by ID in the active tasks section
    const taskRegex = new RegExp(`\\| ${taskId} \\|.*\\|.*\\|.*\\|.*\\|.*\\|\\n`, 'g');
    const taskMatch = activeContextContent.match(taskRegex);
    
    if (!taskMatch) {
      // Task not in active context, no need to update
      return;
    }
    
    // Remove the task row
    const updatedContent = activeContextContent.replace(taskRegex, '');
    
    // Write the updated content back to the file
    fs.writeFileSync(ACTIVE_CONTEXT_FILE, updatedContent, 'utf8');
    
    console.log(`Removed completed task ${taskId} from activeContext.md`);
  } catch (error) {
    console.error('Error updating active context:', error);
  }
}

/**
 * Add a recent accomplishment to progress.md
 */
function addRecentAccomplishment() {
  rl.question('\nEnter accomplishment: ', (accomplishment) => {
    try {
      const progressContent = fs.readFileSync(PROGRESS_FILE, 'utf8');
      
      // Find the Recent Accomplishments section
      const sectionHeader = '## Recent Accomplishments';
      const sectionIndex = progressContent.indexOf(sectionHeader);
      
      if (sectionIndex === -1) {
        console.log('Recent Accomplishments section not found in progress.md');
        showMenu(getRecentCommits());
        return;
      }
      
      // Find the end of the list
      const nextSectionIndex = progressContent.indexOf('##', sectionIndex + sectionHeader.length);
      
      if (nextSectionIndex === -1) {
        console.log('Could not find the end of the Recent Accomplishments section');
        showMenu(getRecentCommits());
        return;
      }
      
      // Find the last list item
      const listItemRegex = /- .+/g;
      const listItems = progressContent.substring(sectionIndex, nextSectionIndex).match(listItemRegex);
      
      if (!listItems) {
        console.log('No list items found in Recent Accomplishments section');
        showMenu(getRecentCommits());
        return;
      }
      
      const lastListItem = listItems[listItems.length - 1];
      const lastListItemIndex = progressContent.lastIndexOf(lastListItem, nextSectionIndex);
      
      // Insert the new accomplishment after the last list item
      const beforeLastItem = progressContent.substring(0, lastListItemIndex + lastListItem.length);
      const afterLastItem = progressContent.substring(lastListItemIndex + lastListItem.length);
      
      const updatedContent = beforeLastItem + '\n- ' + accomplishment + afterLastItem;
      
      // Write the updated content back to the file
      fs.writeFileSync(PROGRESS_FILE, updatedContent, 'utf8');
      
      console.log('\nAccomplishment added successfully!\n');
      showMenu(getRecentCommits());
    } catch (error) {
      console.error('Error adding accomplishment:', error);
      showMenu(getRecentCommits());
    }
  });
}

/**
 * Update component progress in progress.md
 */
function updateComponentProgress() {
  console.log('\n=== Update Component Progress ===');
  console.log('1. Database');
  console.log('2. Authentication & Authorization');
  console.log('3. Content Management');
  console.log('4. Lesson Delivery');
  console.log('5. Speech Recognition');
  
  rl.question('\nSelect component (1-5): ', (componentAnswer) => {
    let component;
    switch (componentAnswer) {
      case '1':
        component = 'Database';
        break;
      case '2':
        component = 'Authentication & Authorization';
        break;
      case '3':
        component = 'Content Management';
        break;
      case '4':
        component = 'Lesson Delivery';
        break;
      case '5':
        component = 'Speech Recognition';
        break;
      default:
        console.log('Invalid component. Please try again.');
        updateComponentProgress();
        return;
    }
    
    rl.question(`\nEnter new progress percentage for ${component} (e.g., 65): `, (percentageAnswer) => {
      const percentage = parseInt(percentageAnswer);
      
      if (isNaN(percentage) || percentage < 0 || percentage > 100) {
        console.log('Invalid percentage. Please enter a number between 0 and 100.');
        updateComponentProgress();
        return;
      }
      
      try {
        const progressContent = fs.readFileSync(PROGRESS_FILE, 'utf8');
        
        // Find the component section
        const componentHeader = `### ${component}`;
        const componentIndex = progressContent.indexOf(componentHeader);
        
        if (componentIndex === -1) {
          console.log(`${component} section not found in progress.md`);
          showMenu(getRecentCommits());
          return;
        }
        
        // Find the status line
        const statusLineRegex = new RegExp(`- \\*\\*Status\\*\\*: \\d+% Complete`);
        const statusLineMatch = progressContent.substring(componentIndex, progressContent.indexOf('###', componentIndex + 1) !== -1 ? progressContent.indexOf('###', componentIndex + 1) : progressContent.length).match(statusLineRegex);
        
        if (!statusLineMatch) {
          console.log(`Status line not found in ${component} section`);
          showMenu(getRecentCommits());
          return;
        }
        
        const oldStatusLine = statusLineMatch[0];
        const newStatusLine = `- **Status**: ${percentage}% Complete`;
        
        // Replace the status line
        const updatedContent = progressContent.replace(oldStatusLine, newStatusLine);
        
        // Write the updated content back to the file
        fs.writeFileSync(PROGRESS_FILE, updatedContent, 'utf8');
        
        console.log(`\n${component} progress updated to ${percentage}%!\n`);
        
        // Update overall progress
        updateOverallProgress();
        
        showMenu(getRecentCommits());
      } catch (error) {
        console.error('Error updating component progress:', error);
        showMenu(getRecentCommits());
      }
    });
  });
}

/**
 * Update overall progress in progress.md
 */
function updateOverallProgress() {
  try {
    const progressContent = fs.readFileSync(PROGRESS_FILE, 'utf8');
    
    // Find all component progress percentages
    const componentRegex = /### ([^\n]+)\n- \*\*Status\*\*: (\d+)% Complete/g;
    let match;
    let totalPercentage = 0;
    let componentCount = 0;
    
    while ((match = componentRegex.exec(progressContent)) !== null) {
      totalPercentage += parseInt(match[2]);
      componentCount++;
    }
    
    if (componentCount === 0) {
      console.log('No components found in progress.md');
      return;
    }
    
    // Calculate overall progress
    const overallProgress = Math.round(totalPercentage / componentCount);
    
    // Update overall progress
    const overallProgressRegex = /- \*\*Overall Progress\*\*: (\d+)%/;
    const overallProgressMatch = progressContent.match(overallProgressRegex);
    
    if (!overallProgressMatch) {
      console.log('Overall progress line not found in progress.md');
      return;
    }
    
    const oldOverallProgressLine = overallProgressMatch[0];
    const newOverallProgressLine = `- **Overall Progress**: ${overallProgress}%`;
    
    // Replace the overall progress line
    const updatedContent = progressContent.replace(oldOverallProgressLine, newOverallProgressLine);
    
    // Write the updated content back to the file
    fs.writeFileSync(PROGRESS_FILE, updatedContent, 'utf8');
    
    console.log(`Overall progress updated to ${overallProgress}%`);
  } catch (error) {
    console.error('Error updating overall progress:', error);
  }
}

/**
 * Add a technical decision to memories.md
 */
function addTechnicalDecision() {
  rl.question('\nEnter decision title: ', (title) => {
    rl.question('Enter decision details (multi-line, press Enter twice to finish):\n', getMultiLineInput((details) => {
      rl.question('Enter rationale: ', (rationale) => {
        try {
          const memoriesContent = fs.readFileSync(MEMORIES_FILE, 'utf8');
          
          // Find the Technical Decisions section
          const sectionHeader = '## Technical Decisions';
          const sectionIndex = memoriesContent.indexOf(sectionHeader);
          
          if (sectionIndex === -1) {
            console.log('Technical Decisions section not found in memories.md');
            showMenu(getRecentCommits());
            return;
          }
          
          // Create the new decision entry
          const today = new Date().toISOString().split('T')[0];
          const newDecision = `\n\n### ${title} (${today})\n**Decision**: ${details}\n\n**Rationale**: ${rationale}`;
          
          // Insert the new decision after the section header
          const beforeSection = memoriesContent.substring(0, sectionIndex + sectionHeader.length);
          const afterSection = memoriesContent.substring(sectionIndex + sectionHeader.length);
          
          const updatedContent = beforeSection + newDecision + afterSection;
          
          // Write the updated content back to the file
          fs.writeFileSync(MEMORIES_FILE, updatedContent, 'utf8');
          
          console.log('\nTechnical decision added successfully!\n');
          showMenu(getRecentCommits());
        } catch (error) {
          console.error('Error adding technical decision:', error);
          showMenu(getRecentCommits());
        }
      });
    }));
  });
}

/**
 * Add a meeting note to memories.md
 */
function addMeetingNote() {
  rl.question('\nEnter meeting title: ', (title) => {
    rl.question('Enter meeting notes (multi-line, press Enter twice to finish):\n', getMultiLineInput((notes) => {
      try {
        const memoriesContent = fs.readFileSync(MEMORIES_FILE, 'utf8');
        
        // Find the Meeting Notes section
        const sectionHeader = '## Meeting Notes';
        const sectionIndex = memoriesContent.indexOf(sectionHeader);
        
        if (sectionIndex === -1) {
          console.log('Meeting Notes section not found in memories.md');
          showMenu(getRecentCommits());
          return;
        }
        
        // Create the new meeting note entry
        const today = new Date().toISOString().split('T')[0];
        const newMeetingNote = `\n\n### ${title} (${today})\n${notes}`;
        
        // Insert the new meeting note after the section header
        const beforeSection = memoriesContent.substring(0, sectionIndex + sectionHeader.length);
        const afterSection = memoriesContent.substring(sectionIndex + sectionHeader.length);
        
        const updatedContent = beforeSection + newMeetingNote + afterSection;
        
        // Write the updated content back to the file
        fs.writeFileSync(MEMORIES_FILE, updatedContent, 'utf8');
        
        console.log('\nMeeting note added successfully!\n');
        showMenu(getRecentCommits());
      } catch (error) {
        console.error('Error adding meeting note:', error);
        showMenu(getRecentCommits());
      }
    }));
  });
}

/**
 * Helper function to get multi-line input
 */
function getMultiLineInput(callback) {
  let lines = [];
  
  return function onLine(line) {
    if (line.trim() === '') {
      // Empty line, finish input
      rl.removeListener('line', onLine);
      callback(lines.join('\n'));
    } else {
      // Add line to input
      lines.push(line);
      rl.once('line', onLine);
    }
  };
}

// Run the main function
main();
