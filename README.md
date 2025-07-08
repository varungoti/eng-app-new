# SpeakWell English Learning Application

A Next.js application for teaching English to young students from grade PP1 to grade 9.

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite

## Project Structure

- `src/api`: API routes for data operations
- `src/app`: Next.js app router components
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and libraries
  - `src/lib/models`: Database models and repositories
  - `src/lib/db`: Database connection utilities
- `src/modules`: Feature-specific modules
- `src/types`: TypeScript type definitions

## Recent Updates

The application has been migrated from MongoDB to Supabase. See [MIGRATION.md](./MIGRATION.md) for details on the migration process.

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env.local` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### API Routes

API routes are located in `src/api` and follow the Next.js API routes convention. Each route handles specific data operations and uses the Supabase models defined in `src/lib/models/database.ts`.

### Database Models

Database models are defined in `src/lib/models/database.ts` and include:

- Grade
- Topic
- Subtopic
- Lesson
- Question
- ExercisePrompt

Each model has a corresponding repository class with methods for CRUD operations.

### Authentication

Authentication is handled by Supabase Auth. The application uses the Supabase client to manage user sessions and authentication.

## Deployment

The application can be deployed to any platform that supports Next.js applications, such as Vercel or Netlify.

## Memory Bank System

This project uses a Memory Bank system for task management and project documentation. The Memory Bank provides a structured approach to development with persistent memory across sessions.

### Core Components

- **tasks.md**: Central source of truth for task tracking
- **activeContext.md**: Maintains focus of current development phase
- **progress.md**: Tracks implementation status
- **projectContext.md**: Contains project overview and key information
- **memories.md**: Stores important decisions, notes, and information
- **file-tree.md**: Contains the file-folder structure of the project
- **user-chats.md**: Logs user input chats with the Agent

### Utility Scripts

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

For detailed instructions on using the Memory Bank system, see [docs/memory-bank-guide.md](./docs/memory-bank-guide.md).

## Contributing

1. Create a feature branch
2. Make your changes
3. Update the Memory Bank files as needed
4. Submit a pull request

## License

This project is licensed under the MIT License.