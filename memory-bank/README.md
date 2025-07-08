# SpeakWell Memory Bank System

## Overview
The Memory Bank System is a documentation-driven framework for managing tasks, tracking progress, and maintaining project context for the SpeakWell English Learning Application. It provides a structured approach to development with persistent memory across sessions.

## Core Files

### 1. tasks.md
**Purpose**: Central source of truth for task tracking
**Content**:
- Task definitions with unique IDs
- Status tracking
- Priority information
- Dependencies between tasks
- Completed tasks history
- Backlog for future tasks

### 2. activeContext.md
**Purpose**: Maintains focus of current development phase
**Content**:
- Current sprint goals
- Active tasks
- Current blockers
- Recent decisions
- Technical notes
- Next priorities
- Questions to resolve

### 3. progress.md
**Purpose**: Tracks implementation status and history
**Content**:
- Project timeline
- Current status
- Component-by-component progress
- Recent accomplishments
- Upcoming milestones
- Technical debt
- Performance metrics

### 4. projectContext.md
**Purpose**: Contains project overview and key information
**Content**:
- Project overview
- Business goals
- Target users
- Key features
- Technical architecture
- Development approach
- Integration points
- Constraints and considerations
- Success metrics

## How to Use the Memory Bank

### For Task Management
1. Add new tasks to `tasks.md` with unique IDs
2. Update task status as work progresses
3. Move completed tasks to the Completed Tasks section
4. Reference task IDs in commit messages and pull requests

### For Development Focus
1. Update `activeContext.md` at the beginning of each sprint
2. Review and update active tasks regularly
3. Document blockers as they arise
4. Record important decisions

### For Progress Tracking
1. Update `progress.md` after completing significant milestones
2. Keep component status sections up to date
3. Document technical debt as it's identified
4. Update performance metrics as they're measured

### For Project Context
1. Reference `projectContext.md` for high-level project information
2. Update as the project evolves
3. Use as onboarding material for new team members

## Best Practices
1. **Consistency**: Use consistent formatting and terminology
2. **Regular Updates**: Keep the Memory Bank files up to date
3. **Single Source of Truth**: Don't duplicate information across files
4. **Reference**: Link to specific sections in other files when needed
5. **History**: Maintain historical information for context

## Integration with Development Workflow
1. Review Memory Bank at the start of each development session
2. Update relevant files at the end of each session
3. Reference Memory Bank in pull requests and code reviews
4. Use Memory Bank for sprint planning and retrospectives

## Memory Bank Maintenance
The Memory Bank should be maintained as a living document. Regular cleanup and organization will ensure it remains valuable:

1. Archive completed tasks periodically
2. Review and update project context quarterly
3. Validate that all active tasks are still relevant
4. Ensure technical notes are accurate and up-to-date
