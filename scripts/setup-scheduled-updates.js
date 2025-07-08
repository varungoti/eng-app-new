/**
 * Setup Scheduled Updates Script
 * 
 * This script sets up a scheduled task to automatically update the Memory Bank.
 * It creates a scheduled task on Windows or a cron job on Unix-like systems.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function to run the Setup Scheduled Updates script
 */
function main() {
  console.log('\n=== Setup Scheduled Memory Bank Updates ===\n');
  
  // Ask for schedule
  askSchedule();
}

/**
 * Ask for the update schedule
 */
function askSchedule() {
  console.log('How often would you like to schedule automatic Memory Bank updates?');
  console.log('1. Daily');
  console.log('2. Weekly');
  console.log('3. On Git push');
  console.log('4. Cancel');
  
  rl.question('\nEnter option (1-4): ', (answer) => {
    switch (answer) {
      case '1':
        setupDailySchedule();
        break;
      case '2':
        setupWeeklySchedule();
        break;
      case '3':
        setupGitPushHook();
        break;
      case '4':
        console.log('Cancelled setup.');
        rl.close();
        break;
      default:
        console.log('Invalid option. Please try again.');
        askSchedule();
        break;
    }
  });
}

/**
 * Set up a daily scheduled task
 */
function setupDailySchedule() {
  rl.question('\nWhat time would you like the update to run? (HH:MM, 24-hour format): ', (time) => {
    const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(time)) {
      console.log('Invalid time format. Please use HH:MM in 24-hour format.');
      setupDailySchedule();
      return;
    }
    
    const [hours, minutes] = time.split(':');
    
    if (process.platform === 'win32') {
      setupWindowsScheduledTask('Daily', hours, minutes);
    } else {
      setupUnixCronJob('daily', hours, minutes);
    }
  });
}

/**
 * Set up a weekly scheduled task
 */
function setupWeeklySchedule() {
  console.log('\nWhat day of the week would you like the update to run?');
  console.log('1. Monday');
  console.log('2. Tuesday');
  console.log('3. Wednesday');
  console.log('4. Thursday');
  console.log('5. Friday');
  console.log('6. Saturday');
  console.log('7. Sunday');
  
  rl.question('\nEnter option (1-7): ', (dayOption) => {
    const dayMap = {
      '1': 'MON',
      '2': 'TUE',
      '3': 'WED',
      '4': 'THU',
      '5': 'FRI',
      '6': 'SAT',
      '7': 'SUN'
    };
    
    const unixDayMap = {
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      '5': '5',
      '6': '6',
      '7': '0'
    };
    
    const day = dayMap[dayOption];
    const unixDay = unixDayMap[dayOption];
    
    if (!day) {
      console.log('Invalid option. Please try again.');
      setupWeeklySchedule();
      return;
    }
    
    rl.question('\nWhat time would you like the update to run? (HH:MM, 24-hour format): ', (time) => {
      const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
      if (!timeRegex.test(time)) {
        console.log('Invalid time format. Please use HH:MM in 24-hour format.');
        setupWeeklySchedule();
        return;
      }
      
      const [hours, minutes] = time.split(':');
      
      if (process.platform === 'win32') {
        setupWindowsScheduledTask('WEEKLY', hours, minutes, day);
      } else {
        setupUnixCronJob('weekly', hours, minutes, unixDay);
      }
    });
  });
}

/**
 * Set up a Windows scheduled task
 */
function setupWindowsScheduledTask(frequency, hours, minutes, day = null) {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const scriptPath = path.join(projectRoot, 'scripts', 'auto-update-memory.js');
    const nodePath = process.execPath;
    
    let command = `schtasks /create /tn "SpeakWell Memory Bank Update" /tr "${nodePath} ${scriptPath}" /sc ${frequency}`;
    
    if (frequency === 'WEEKLY' && day) {
      command += ` /d ${day}`;
    }
    
    command += ` /st ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')} /f`;
    
    console.log(`\nRunning command: ${command}`);
    execSync(command);
    
    console.log('\nScheduled task created successfully!');
    console.log(`The Memory Bank will be automatically updated ${frequency.toLowerCase()} at ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}${day ? ` on ${day}` : ''}.`);
    
    rl.close();
  } catch (error) {
    console.error('Error creating scheduled task:', error.message);
    console.log('\nYou may need to run this script with administrator privileges.');
    rl.close();
  }
}

/**
 * Set up a Unix cron job
 */
function setupUnixCronJob(frequency, hours, minutes, day = null) {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const scriptPath = path.join(projectRoot, 'scripts', 'auto-update-memory.js');
    const nodePath = process.execPath;
    
    let cronExpression;
    
    if (frequency === 'daily') {
      cronExpression = `${minutes} ${hours} * * *`;
    } else if (frequency === 'weekly' && day) {
      cronExpression = `${minutes} ${hours} * * ${day}`;
    } else {
      throw new Error('Invalid frequency or day');
    }
    
    const command = `${nodePath} ${scriptPath}`;
    
    // Create a temporary file with the cron job
    const tempFile = path.join(__dirname, 'temp-cron');
    execSync(`crontab -l > ${tempFile} 2>/dev/null || true`);
    
    // Check if the cron job already exists
    const cronContent = fs.readFileSync(tempFile, 'utf8');
    if (cronContent.includes('SpeakWell Memory Bank Update')) {
      // Update the existing cron job
      const updatedCronContent = cronContent.replace(/.*SpeakWell Memory Bank Update.*/g, `${cronExpression} ${command} # SpeakWell Memory Bank Update`);
      fs.writeFileSync(tempFile, updatedCronContent, 'utf8');
    } else {
      // Add the new cron job
      fs.appendFileSync(tempFile, `\n${cronExpression} ${command} # SpeakWell Memory Bank Update\n`);
    }
    
    // Install the cron job
    execSync(`crontab ${tempFile}`);
    
    // Remove the temporary file
    fs.unlinkSync(tempFile);
    
    console.log('\nCron job created successfully!');
    console.log(`The Memory Bank will be automatically updated ${frequency} at ${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}${day ? ` on day ${day} of the week` : ''}.`);
    
    rl.close();
  } catch (error) {
    console.error('Error creating cron job:', error.message);
    rl.close();
  }
}

/**
 * Set up a Git push hook
 */
function setupGitPushHook() {
  try {
    const projectRoot = path.resolve(__dirname, '..');
    const hooksDir = path.join(projectRoot, '.git', 'hooks');
    const pushHookPath = path.join(hooksDir, 'post-push');
    
    // Create the hooks directory if it doesn't exist
    if (!fs.existsSync(hooksDir)) {
      fs.mkdirSync(hooksDir, { recursive: true });
    }
    
    // Create the post-push hook
    const hookContent = `#!/usr/bin/env node

/**
 * Post-push hook for Memory Bank
 * 
 * This hook automatically updates the Memory Bank after pushing to the remote repository.
 */

console.log('\\n=== Automatically updating Memory Bank ===');
require('child_process').execSync('npm run auto-update-memory', { stdio: 'inherit' });
console.log('Memory Bank updated successfully!\\n');
`;
    
    fs.writeFileSync(pushHookPath, hookContent, 'utf8');
    
    // Make the hook executable
    if (process.platform !== 'win32') {
      execSync(`chmod +x ${pushHookPath}`);
    } else {
      execSync(`icacls "${pushHookPath}" /grant Everyone:RX`);
    }
    
    console.log('\nGit push hook created successfully!');
    console.log('The Memory Bank will be automatically updated after each Git push.');
    
    rl.close();
  } catch (error) {
    console.error('Error creating Git push hook:', error.message);
    rl.close();
  }
}

// Run the main function
main();
