/**
 * Auto Update Memory Bank Script
 * 
 * This script automatically updates the Memory Bank based on Git activity.
 * It can be run as a scheduled task or manually.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MEMORY_BANK_DIR = path.join(__dirname, '..', 'memory-bank');
const TASKS_FILE = path.join(MEMORY_BANK_DIR, 'tasks.md');
const ACTIVE_CONTEXT_FILE = path.join(MEMORY_BANK_DIR, 'activeContext.md');
const PROGRESS_FILE = path.join(MEMORY_BANK_DIR, 'progress.md');

/**
 * Main function to run the Auto Update Memory Bank script
 */
function main() {
  console.log('\n=== SpeakWell Memory Bank Auto Update ===\n');
  
  // Update last updated date in progress.md
  updateLastUpdatedDate();
  
  // Get recent git commits
  const recentCommits = getRecentCommits();
  
  // Update task status based on commit messages
  updateTaskStatusFromCommits(recentCommits);
  
  // Update overall progress
  updateOverallProgress();
  
  console.log('\nMemory Bank auto-update completed!\n');
}

/**
 * Get recent git commits since the last update
 */
function getRecentCommits() {
  try {
    // Get the last updated date from progress.md
    const progressContent = fs.readFileSync(PROGRESS_FILE, 'utf8');
    const lastUpdatedMatch = progressContent.match(/- \*\*Last Updated\*\*: (\d{4}-\d{2}-\d{2})/);
    const lastUpdated = lastUpdatedMatch ? lastUpdatedMatch[1] : '1970-01-01';
    
    // Get commits since the last update
    const output = execSync(`git log --pretty=format:"%h - %s (%cr)" --since="${lastUpdated}"`).toString();
    return output.split('\n').filter(line => line.trim() !== '');
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
 * Update task status based on commit messages
 */
function updateTaskStatusFromCommits(commits) {
  if (commits.length === 0) {
    console.log('No recent commits found.');
    return;
  }
  
  console.log(`Found ${commits.length} recent commits.`);
  
  // Extract task IDs from commit messages
  const taskIds = new Set();
  const completedTaskIds = new Set();
  
  commits.forEach(commit => {
    const taskIdMatch = commit.match(/([A-Z]+-\d+(\.\d+)?)/);
    if (taskIdMatch) {
      const taskId = taskIdMatch[1];
      taskIds.add(taskId);
      
      // Check if the commit message indicates completion
      if (commit.toLowerCase().includes('complete') || 
          commit.toLowerCase().includes('finish') || 
          commit.toLowerCase().includes('fix') || 
          commit.toLowerCase().includes('resolve')) {
        completedTaskIds.add(taskId);
      }
    }
  });
  
  if (taskIds.size === 0) {
    console.log('No task IDs found in commit messages.');
    return;
  }
  
  console.log(`Found ${taskIds.size} task IDs in commit messages.`);
  
  // Update task status in tasks.md
  taskIds.forEach(taskId => {
    const status = completedTaskIds.has(taskId) ? 'COMPLETED' : 'IN PROGRESS';
    updateTaskStatusInFile(taskId, status);
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
      console.log(`Task ${taskId} not found. Skipping.`);
      return;
    }
    
    // Check if the status is already set
    const oldTaskRow = taskMatch[0];
    const columns = oldTaskRow.split('|');
    const currentStatus = columns[5].trim();
    
    if (currentStatus === status) {
      console.log(`Task ${taskId} already has status ${status}. Skipping.`);
      return;
    }
    
    // Update the status in the task row
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
    
    console.log(`Updated task ${taskId} status to ${status}`);
    
    // Also update the task in the active context file if it's there
    updateActiveContextTaskStatus(taskId, status);
  } catch (error) {
    console.error(`Error updating task ${taskId} status:`, error.message);
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
    console.error(`Error updating task ${taskId} status in active context:`, error.message);
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
    console.error(`Error updating active context:`, error.message);
  }
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
    
    console.log(`Updated overall progress to ${overallProgress}%`);
  } catch (error) {
    console.error('Error updating overall progress:', error.message);
  }
}

// Run the main function
main();
