# SpeakWell English Learning Application - Project Context

## Project Overview
SpeakWell is a Next.js application for teaching English to young students from grade PP1 to grade 9. The application provides an interactive learning experience with a focus on speaking, listening, reading, and writing skills.

## Business Goals
1. Create an engaging platform for English language learning
2. Provide teachers with tools to create and manage lesson content
3. Enable students to practice English skills through interactive exercises
4. Track student progress and provide feedback
5. Support different learning styles and paces

## Target Users
- **Students**: Young learners from grade PP1 to grade 9
- **Teachers**: English language teachers who create and manage content
- **School Administrators**: Manage school accounts and monitor progress
- **Content Creators**: Develop and curate educational content

## Key Features
1. **Content Management System**:
   - Create and edit lessons with rich text and media
   - Organize content by grade, topic, and subtopic
   - Review and approve content

2. **User Management**:
   - Role-based access control
   - User profiles and preferences
   - School and class management

3. **Lesson Delivery**:
   - Interactive lesson player
   - Progress tracking
   - Assessments and exercises

4. **Speech Recognition**:
   - Text-to-speech using Fish Speech
   - Speech recognition for practice
   - Pronunciation feedback

## Technical Architecture

### Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Speech**: Fish Speech API

### Project Structure
- `src/api`: API routes for data operations
- `src/app`: Next.js app router components
- `src/components`: Reusable UI components
- `src/lib`: Utility functions and libraries
  - `src/lib/models`: Database models and repositories
  - `src/lib/db`: Database connection utilities
- `src/modules`: Feature-specific modules
- `src/types`: TypeScript type definitions

### Data Model
The application uses a hierarchical data model:
- **Grades**: Top-level organization (PP1 to grade 9)
- **Topics**: Subject areas within each grade
- **Subtopics**: Specific areas within topics
- **Lessons**: Individual learning units with questions
- **Questions**: Learning activities with various exercise prompts
- **Exercise Prompts**: Specific instructions or content for student interaction

### User Roles
- **Super Admin**: Full system access
- **Admin**: System-wide access with some restrictions
- **Technical/Developer Roles**: For system maintenance
- **Sales Roles**: For managing school relationships
- **Content Roles**: For curriculum development
- **School Roles**: For school management (principals, teachers)

## Development Approach
- **Agile Methodology**: Iterative development with regular feedback
- **Component-Based Design**: Reusable UI components
- **Repository Pattern**: For data access
- **Test-Driven Development**: For critical components
- **Continuous Integration**: Automated testing and deployment

## Integration Points
- **Supabase**: For database, authentication, and storage
- **Fish Speech**: For text-to-speech capabilities
- **OpenAI**: For content generation (future)

## Constraints and Considerations
- **Performance**: Must work well on low-end devices
- **Accessibility**: Must be accessible to users with disabilities
- **Security**: Must protect student data and content
- **Scalability**: Must handle growing number of users and content
- **Offline Access**: Should provide some functionality without internet

## Success Metrics
- **User Engagement**: Time spent on platform
- **Learning Outcomes**: Improvement in English skills
- **Content Creation**: Volume and quality of content
- **Technical Performance**: Load times, error rates
- **User Satisfaction**: Feedback from students and teachers

## References
- [README.md](../README.md): Project overview and setup instructions
- [docs/API.md](../docs/API.md): API documentation
- [MIGRATION.md](../MIGRATION.md): Database migration details
