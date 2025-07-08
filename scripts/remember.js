/**
 * Memory Bank Remember Script
 * 
 * A simple utility script to add memories to the Memory Bank system.
 * This script allows you to quickly add notes, decisions, or other important information.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MEMORY_BANK_DIR = path.join(__dirname, '..', 'memory-bank');
const MEMORIES_FILE = path.join(MEMORY_BANK_DIR, 'memories.md');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Main function to run the Memory Bank Remember script
 */
function main() {
  console.log('\n=== SpeakWell Memory Bank - Remember ===\n');
  
  // Check if memories.md exists, create it if not
  if (!fs.existsSync(MEMORIES_FILE)) {
    createMemoriesFile();
  }
  
  // Ask for memory type
  askMemoryType();
}

/**
 * Create the memories.md file with initial structure
 */
function createMemoriesFile() {
  const initialContent = `# SpeakWell English Learning Application - Memories

## Overview
This document contains important memories, decisions, and notes related to the SpeakWell English Learning Application. It serves as a reference for key information that should be remembered across development sessions.

## Technical Decisions
<!-- Technical decisions and their rationales -->

## Important Notes
<!-- Important notes about the project -->

## Meeting Notes
<!-- Notes from important meetings -->

## Ideas
<!-- Ideas for future development -->

## Questions and Answers
<!-- Important Q&A that should be remembered -->

`;
  
  fs.writeFileSync(MEMORIES_FILE, initialContent, 'utf8');
  console.log('Created memories.md file with initial structure.');
}

/**
 * Ask for the type of memory to add
 */
function askMemoryType() {
  console.log('What type of memory would you like to add?');
  console.log('1. Technical Decision');
  console.log('2. Important Note');
  console.log('3. Meeting Note');
  console.log('4. Idea');
  console.log('5. Question and Answer');
  
  rl.question('\nEnter memory type (1-5): ', (answer) => {
    let section;
    switch (answer) {
      case '1':
        section = 'Technical Decisions';
        break;
      case '2':
        section = 'Important Notes';
        break;
      case '3':
        section = 'Meeting Notes';
        break;
      case '4':
        section = 'Ideas';
        break;
      case '5':
        section = 'Questions and Answers';
        break;
      default:
        console.log('Invalid option. Please try again.');
        askMemoryType();
        return;
    }
    
    askMemoryContent(section);
  });
}

/**
 * Ask for the content of the memory
 */
function askMemoryContent(section) {
  console.log(`\nAdding a memory to "${section}"`);
  
  if (section === 'Technical Decisions') {
    rl.question('Decision title: ', (title) => {
      rl.question('Decision details (multi-line, press Enter twice to finish):\n', getMultiLineInput((details) => {
        rl.question('Rationale: ', (rationale) => {
          rl.question('Date (YYYY-MM-DD, leave empty for today): ', (date) => {
            const memoryDate = date || new Date().toISOString().split('T')[0];
            const memory = `### ${title} (${memoryDate})\n**Decision**: ${details}\n\n**Rationale**: ${rationale}\n\n`;
            addMemory(section, memory);
          });
        });
      }));
    });
  } else if (section === 'Questions and Answers') {
    rl.question('Question: ', (question) => {
      rl.question('Answer (multi-line, press Enter twice to finish):\n', getMultiLineInput((answer) => {
        const memory = `### Q: ${question}\n**A**: ${answer}\n\n`;
        addMemory(section, memory);
      }));
    });
  } else {
    rl.question('Title: ', (title) => {
      rl.question('Details (multi-line, press Enter twice to finish):\n', getMultiLineInput((details) => {
        rl.question('Date (YYYY-MM-DD, leave empty for today): ', (date) => {
          const memoryDate = date || new Date().toISOString().split('T')[0];
          const memory = `### ${title} (${memoryDate})\n${details}\n\n`;
          addMemory(section, memory);
        });
      }));
    });
  }
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
 * Add a memory to the specified section in memories.md
 */
function addMemory(section, memory) {
  try {
    const content = fs.readFileSync(MEMORIES_FILE, 'utf8');
    const sectionHeader = `## ${section}`;
    
    if (!content.includes(sectionHeader)) {
      console.log(`Section "${section}" not found in memories.md. Please check the file structure.`);
      rl.close();
      return;
    }
    
    // Find the section and add the memory after it
    const sectionIndex = content.indexOf(sectionHeader);
    const nextSectionIndex = content.indexOf('## ', sectionIndex + sectionHeader.length);
    
    let beforeSection = content.substring(0, sectionIndex + sectionHeader.length);
    let afterSection;
    
    if (nextSectionIndex !== -1) {
      // There is another section after this one
      afterSection = content.substring(nextSectionIndex);
      
      // Check if there's content between the section header and the next section
      const sectionContent = content.substring(sectionIndex + sectionHeader.length, nextSectionIndex).trim();
      
      if (sectionContent.includes('<!--') && sectionContent.includes('-->') && !sectionContent.replace(/<!--.*?-->/gs, '').trim()) {
        // Section only contains a comment, replace it
        beforeSection = content.substring(0, sectionIndex + sectionHeader.length);
        afterSection = content.substring(nextSectionIndex);
      } else {
        // Section has content, add a newline
        beforeSection = content.substring(0, sectionIndex + sectionHeader.length) + '\n';
        afterSection = content.substring(nextSectionIndex);
      }
    } else {
      // This is the last section
      afterSection = '';
      
      // Check if there's content after the section header
      const sectionContent = content.substring(sectionIndex + sectionHeader.length).trim();
      
      if (sectionContent.includes('<!--') && sectionContent.includes('-->') && !sectionContent.replace(/<!--.*?-->/gs, '').trim()) {
        // Section only contains a comment, replace it
        beforeSection = content.substring(0, sectionIndex + sectionHeader.length);
      } else {
        // Section has content, add a newline
        beforeSection = content.substring(0, sectionIndex + sectionHeader.length) + '\n';
      }
    }
    
    // Add the memory
    const updatedContent = beforeSection + '\n' + memory + afterSection;
    
    // Write the updated content back to the file
    fs.writeFileSync(MEMORIES_FILE, updatedContent, 'utf8');
    
    console.log('\nMemory added successfully!\n');
    rl.close();
  } catch (error) {
    console.error('Error adding memory:', error);
    rl.close();
  }
}

// Run the main function
main();
