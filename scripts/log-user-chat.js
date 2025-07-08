/**
 * Log User Chat Script
 *
 * This script logs user input chats with the Agent to a file in the memory bank.
 * It can be used to maintain a history of conversations for reference.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MEMORY_BANK_DIR = path.join(__dirname, '..', 'memory-bank');
const CHAT_LOG_PATH = path.join(MEMORY_BANK_DIR, 'user-chats.md');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function to run the Log User Chat script
 */
function main() {
  console.log('\n=== Log User Chat with Agent ===\n');

  // Create the memory bank directory if it doesn't exist
  if (!fs.existsSync(MEMORY_BANK_DIR)) {
    fs.mkdirSync(MEMORY_BANK_DIR, { recursive: true });
  }

  // Create the chat log file if it doesn't exist
  if (!fs.existsSync(CHAT_LOG_PATH)) {
    const initialContent = `# SpeakWell English Learning Application - User Chat Log\n\n` +
                          `This document contains a log of user chats with the Agent. ` +
                          `It serves as a reference for conversations and decisions made during development.\n\n`;
    fs.writeFileSync(CHAT_LOG_PATH, initialContent, 'utf8');
  }

  // Ask for chat details
  askChatDetails();
}

/**
 * Ask for chat details
 */
function askChatDetails() {
  rl.question('Enter a title for this chat session: ', (title) => {
    rl.question('Enter your name (or leave blank for anonymous): ', (name) => {
      rl.question('Enter chat content (multi-line, press Enter twice to finish):\n', getMultiLineInput((content) => {
        // Log the chat
        logChat(title, name, content);
      }));
    });
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

/**
 * Log a chat to the chat log file
 */
function logChat(title, name, content) {
  try {
    // Read the existing chat log
    const chatLog = fs.readFileSync(CHAT_LOG_PATH, 'utf8');

    // Format the new chat entry
    const today = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();
    const userName = name.trim() ? name : 'Anonymous';

    const chatEntry = `\n## ${title} (${today} ${time})\n\n` +
                     `**User**: ${userName}\n\n` +
                     `\`\`\`\n${content}\n\`\`\`\n`;

    // Append the new chat entry to the log
    fs.writeFileSync(CHAT_LOG_PATH, chatLog + chatEntry, 'utf8');

    console.log('\nChat logged successfully!\n');
    rl.close();
  } catch (error) {
    console.error('Error logging chat:', error.message);
    rl.close();
  }
}

// Main function execution
function run() {
  // Run the main function
  main();
}

// Run the script
run();
