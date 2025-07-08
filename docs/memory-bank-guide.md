# SpeakWell Memory Bank System Guide

## Introduction

The Memory Bank System is a documentation-driven framework for managing tasks, tracking progress, and maintaining project context for the SpeakWell English Learning Application. This guide explains how to use the system effectively.

## Core Components

The Memory Bank System consists of several key components:

### 1. Memory Bank Files

Located in the `memory-bank/` directory, these files serve as the central repository for project information:

- **tasks.md**: Central source of truth for task tracking
- **activeContext.md**: Maintains focus of current development phase
- **progress.md**: Tracks implementation status
- **projectContext.md**: Contains project overview and key information
- **memories.md**: Stores important decisions, notes, and information
- **file-tree.md**: Contains the file-folder structure of the project
- **user-chats.md**: Logs user input chats with the Agent

### 2. Utility Scripts

The system includes utility scripts to help manage the Memory Bank:

- **memory-bank-manager.js**: A command-line tool for managing tasks and updating Memory Bank files
- **remember.js**: A utility for quickly adding memories to the system
- **update-memory-bank.js**: An interactive tool for updating the Memory Bank
- **auto-update-memory.js**: A script for automatically updating the Memory Bank based on Git activity
- **install-hooks.js**: A script for installing Git hooks to remind you to update the Memory Bank
- **setup-scheduled-updates.js**: A script for setting up scheduled automatic updates
- **update-file-tree.js**: A script for generating a file-folder tree of the project
- **log-user-chat.js**: A script for logging user input chats with the Agent

## Getting Started

### Setting Up

The Memory Bank System is already set up in this project. The core files are in the `memory-bank/` directory, and the utility scripts are in the `scripts/` directory.

### Running the Utilities

You can run the Memory Bank utilities using npm scripts:

```bash
# Run the Memory Bank Manager
npm run memory-bank

# Add a memory
npm run remember

# Update the Memory Bank interactively
npm run update-memory

# Automatically update the Memory Bank based on Git activity
npm run auto-update-memory

# Install Git hooks for Memory Bank integration
npm run install-hooks

# Set up scheduled automatic updates
npm run setup-scheduled-updates

# Generate a file-folder tree of the project
npm run update-file-tree

# Install the file tree update hook
npm run install-file-tree-hook

# Log a user chat
npm run log-chat
```

## Using the Memory Bank System

### Task Management

The `tasks.md` file is the central source of truth for task tracking. It contains:

- Task definitions with unique IDs
- Status tracking
- Priority information
- Dependencies between tasks
- Completed tasks history
- Backlog for future tasks

You can manage tasks using the Memory Bank Manager:

1. Run `npm run memory-bank`
2. Select option 1 to list all tasks
3. Select option 2 to add a new task
4. Select option 3 to update a task's status

### Active Context

The `activeContext.md` file maintains focus on the current development phase. It contains:

- Current sprint goals
- Active tasks
- Current blockers
- Recent decisions
- Technical notes
- Next priorities
- Questions to resolve

Update this file at the beginning of each development session to maintain focus.

### Progress Tracking

The `progress.md` file tracks implementation status and history. It contains:

- Project timeline
- Current status
- Component-by-component progress
- Recent accomplishments
- Upcoming milestones
- Technical debt
- Performance metrics

Update this file after completing significant milestones to maintain a record of progress.

### Project Context

The `projectContext.md` file contains project overview and key information. It serves as a reference for:

- Project overview
- Business goals
- Target users
- Key features
- Technical architecture
- Development approach
- Integration points
- Constraints and considerations
- Success metrics

This file should be updated as the project evolves and can be used for onboarding new team members.

### Memories

The `memories.md` file stores important decisions, notes, and information that should be remembered across development sessions. It includes:

- Technical decisions and their rationales
- Important notes about the project
- Meeting notes
- Ideas for future development
- Questions and answers

You can add memories using the Remember utility:

1. Run `npm run remember`
2. Select the type of memory to add
3. Enter the required information

## Best Practices

### Regular Updates

Keep the Memory Bank files up to date:

- Update `tasks.md` whenever task status changes
- Update `activeContext.md` at the beginning of each development session
- Update `progress.md` after completing significant milestones
- Add to `memories.md` whenever important decisions are made

### Reference in Development

Reference the Memory Bank in your development workflow:

- Review Memory Bank files at the start of each development session
- Reference task IDs in commit messages and pull requests
- Use Memory Bank for sprint planning and retrospectives

### Consistency

Maintain consistency in the Memory Bank:

- Use consistent formatting and terminology
- Follow the established patterns for each file
- Don't duplicate information across files
- Use the utility scripts to ensure proper formatting

## Automation

The Memory Bank system includes several automation features to help keep it up to date:

### Git Hooks

You can install Git hooks to remind you to update the Memory Bank:

```bash
npm run install-hooks
```

This will install:

- A pre-commit hook that reminds you to update the Memory Bank before committing
- A post-commit hook that reminds you to update the Memory Bank after committing

### Automatic Updates

You can automatically update the Memory Bank based on Git activity:

```bash
npm run auto-update-memory
```

This script:

- Updates the last updated date in progress.md
- Extracts task IDs from recent commit messages
- Updates task status based on commit messages
- Updates overall progress

### Scheduled Updates

You can set up scheduled automatic updates:

```bash
npm run setup-scheduled-updates
```

This script allows you to schedule updates:

- Daily at a specific time
- Weekly on a specific day and time
- After each Git push

## Troubleshooting

### Common Issues

- **File not found**: Ensure you're running the scripts from the project root directory
- **Script errors**: Make sure Node.js is installed and up to date
- **Formatting issues**: Use the utility scripts rather than editing files directly

### Getting Help

If you encounter issues with the Memory Bank System, check:

- The README.md file in the memory-bank directory
- This guide for usage instructions
- The script source code for implementation details

## Conclusion

The Memory Bank System provides a structured approach to development with persistent memory across sessions. By following this guide and using the system consistently, you can improve project organization, maintain focus, and ensure important information is preserved throughout the development process.
