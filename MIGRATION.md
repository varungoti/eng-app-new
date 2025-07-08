# MongoDB to Supabase Migration Guide

This document outlines the process of migrating from MongoDB to Supabase in the SpeakWell application.

## Overview

The application has been migrated from using MongoDB with Mongoose to Supabase for data storage. This migration involved:

1. Creating Supabase type definitions based on the database schema
2. Implementing repository functions for CRUD operations
3. Updating API routes to use the new Supabase models
4. Creating a compatibility layer for backward compatibility

## New Structure

### Database Models

The new database models are defined in `src/lib/models/database.ts`. This file contains:

- Type definitions for all entities (Grade, Topic, Subtopic, Lesson, etc.)
- Repository classes for each entity with methods for CRUD operations

### API Routes

API routes have been updated to use the new Supabase models. Changes include:

- Removing MongoDB connection code
- Updating validation schemas to match Supabase field names
- Modifying error handling for PostgreSQL-specific error codes

### Compatibility Layer

A compatibility layer has been created in `src/lib/db/mongodb.ts` to ensure backward compatibility with any code still using the MongoDB connection. This layer:

- Provides a no-op `connectToDatabase` function that logs warnings
- Returns stub objects with common MongoDB methods
- Mocks the mongoose global object

## Migration Steps

To complete the migration:

1. Update all remaining API routes to use the new Supabase models
2. Update any frontend code that directly references MongoDB models
3. Test all functionality to ensure data is correctly stored and retrieved
4. Monitor logs for any calls to the compatibility layer and update those code paths

## Database Schema

The Supabase database schema includes the following tables:

- `grades`: Stores information about grade levels
- `topics`: Stores topics associated with grades
- `subtopics`: Stores subtopics associated with topics
- `lessons`: Stores lessons associated with subtopics
- `questions`: Stores questions associated with lessons
- `exercise_prompts`: Stores exercise prompts associated with questions

## Error Handling

Error handling has been updated to account for PostgreSQL-specific error codes:

- `23505`: Unique violation (replaces MongoDB's `11000` error code)

## Future Improvements

- Remove the MongoDB compatibility layer once all code has been migrated
- Implement more advanced Supabase features like real-time subscriptions
- Add database migrations for schema changes 