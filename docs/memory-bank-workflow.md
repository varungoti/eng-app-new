# Memory Bank Development Workflow

This document outlines how to integrate the Memory Bank system into your daily development workflow for the SpeakWell English Learning Application.

## Daily Development Workflow

### 1. Start of Day

At the beginning of each development session:

1. **Review the Memory Bank**
   ```bash
   # View the active context to understand current focus
   cat memory-bank/activeContext.md

   # Review current tasks
   npm run memory-bank
   # Select option 1 to list all tasks
   ```

2. **Update Task Status**
   ```bash
   # If you're starting work on a task, update its status to IN PROGRESS
   npm run update-memory
   # Select option 1 to update task status
   ```

3. **Plan Your Work**
   - Identify which tasks you'll work on today
   - Check dependencies to ensure you're not blocked
   - Review the technical requirements for your tasks

### 2. During Development

While working on tasks:

1. **Use Task IDs in Commit Messages**
   ```bash
   # Include the task ID in your commit messages
   git commit -m "DB-001.1: Migrated user data models"
   ```

2. **Update Progress Regularly**
   ```bash
   # After significant progress, update the component progress
   npm run update-memory
   # Select option 3 to update component progress
   ```

3. **Record Important Decisions**
   ```bash
   # When making important technical decisions
   npm run update-memory
   # Select option 4 to add a technical decision
   ```

4. **Remember Important Information**
   ```bash
   # For quick notes and information to remember
   npm run remember
   ```

### 3. End of Day

At the end of each development session:

1. **Update Task Status**
   ```bash
   # Update the status of tasks you worked on
   npm run update-memory
   # Select option 1 to update task status
   ```

2. **Add Accomplishments**
   ```bash
   # Record what you accomplished today
   npm run update-memory
   # Select option 2 to add a recent accomplishment
   ```

3. **Update Active Context**
   ```bash
   # If your focus is changing for tomorrow
   # Edit memory-bank/activeContext.md directly
   ```

4. **Update File Tree**
   ```bash
   # Update the file-folder tree of the project
   npm run update-file-tree
   ```

5. **Log User Chats**
   ```bash
   # Log any important conversations with the Agent
   npm run log-chat
   ```

## Weekly Development Workflow

### 1. Start of Week

At the beginning of each week:

1. **Review Progress**
   ```bash
   # Review overall progress
   cat memory-bank/progress.md
   ```

2. **Plan Weekly Goals**
   - Update the Current Sprint Goals in activeContext.md
   - Prioritize tasks for the week
   - Identify potential blockers

3. **Team Sync**
   ```bash
   # After team meetings, record important notes
   npm run update-memory
   # Select option 5 to add meeting notes
   ```

### 2. End of Week

At the end of each week:

1. **Review Completed Tasks**
   ```bash
   # Review what was completed this week
   grep "COMPLETED" memory-bank/tasks.md
   ```

2. **Update Overall Progress**
   ```bash
   # Update the overall project progress
   npm run update-memory
   # Select option 3 to update component progress for each component
   ```

3. **Plan Next Week**
   - Update activeContext.md with focus for next week
   - Identify tasks to prioritize

## Sprint Development Workflow

### 1. Sprint Planning

During sprint planning:

1. **Update Sprint Goals**
   - Edit the Current Sprint Goals in activeContext.md
   - Update the Active Tasks section with tasks for the sprint

2. **Task Breakdown**
   ```bash
   # Add new tasks and subtasks
   npm run memory-bank
   # Select option 2 to add new tasks
   ```

### 2. Sprint Review

During sprint review:

1. **Update Progress**
   ```bash
   # Update component progress
   npm run update-memory
   # Select option 3 to update component progress
   ```

2. **Record Accomplishments**
   ```bash
   # Add major accomplishments from the sprint
   npm run update-memory
   # Select option 2 to add recent accomplishments
   ```

3. **Update Technical Debt**
   - Edit the Technical Debt section in progress.md
   - Add any new technical debt identified during the sprint

### 3. Sprint Retrospective

After sprint retrospective:

1. **Record Meeting Notes**
   ```bash
   # Add retrospective notes
   npm run update-memory
   # Select option 5 to add meeting notes
   ```

2. **Update Process Improvements**
   - Add any process improvements to memories.md
   - Update workflow documentation if needed

## Integrating with Git Workflow

### 1. Branch Creation

When creating a new branch:

1. **Name Branches with Task IDs**
   ```bash
   # Include the task ID in the branch name
   git checkout -b feature/DB-001.1-user-data-migration
   ```

### 2. Commits

For each commit:

1. **Include Task ID in Commit Messages**
   ```bash
   # Include the task ID in your commit messages
   git commit -m "DB-001.1: Migrated user authentication data"
   ```

2. **Update Memory Bank After Commits**
   ```bash
   # After committing, update the memory bank
   npm run update-memory
   ```

### 3. Pull Requests

When creating pull requests:

1. **Reference Task IDs**
   - Include task IDs in PR title and description
   - Link to relevant sections in the Memory Bank

2. **Update Task Status**
   ```bash
   # Update task status to REVIEW
   npm run update-memory
   # Select option 1 to update task status
   ```

### 4. Merging

After merging:

1. **Update Task Status**
   ```bash
   # Update task status to COMPLETED
   npm run update-memory
   # Select option 1 to update task status
   ```

2. **Add Accomplishment**
   ```bash
   # Add the completed feature as an accomplishment
   npm run update-memory
   # Select option 2 to add a recent accomplishment
   ```

## Best Practices

1. **Be Consistent**
   - Always use the same format for task IDs
   - Keep the Memory Bank updated regularly
   - Follow the established workflow

2. **Be Detailed**
   - Provide sufficient detail in task descriptions
   - Include context in technical decisions
   - Document dependencies between tasks

3. **Be Proactive**
   - Update the Memory Bank as you work, not just at the end
   - Record important information immediately
   - Use the Memory Bank to plan ahead

4. **Be Collaborative**
   - Share the Memory Bank with the team
   - Use it as a reference during discussions
   - Keep it up to date for others to use

5. **Maintain Documentation**
   - Keep the file-tree.md up to date with the project structure
   - Log important user chats in user-chats.md
   - Use these files as reference for onboarding new team members

## Troubleshooting

### Common Issues

1. **Task ID Not Found**
   - Check the spelling and format of the task ID
   - Make sure the task exists in tasks.md
   - Use the memory-bank tool to list all tasks

2. **Memory Bank Files Out of Sync**
   - Run `npm run update-memory` to update all files
   - Check for conflicts if multiple people are updating

3. **Script Errors**
   - Check that Node.js is installed and up to date
   - Ensure you're running the scripts from the project root
   - Check the script logs for error messages

### Getting Help

If you encounter issues with the Memory Bank system:

1. **Check Documentation**
   - Review the Memory Bank guide in docs/memory-bank-guide.md
   - Check this workflow document for guidance

2. **Ask for Help**
   - Reach out to the team for assistance
   - Document any issues in the Memory Bank for future reference
