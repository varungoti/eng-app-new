import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

console.log('Script started');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

console.log('Environment loaded');
console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
console.log('Supabase client created');

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Logger
const logger = {
  info: (msg: string) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}✖ ${msg}${colors.reset}`),
  divider: () => console.log('\n' + '─'.repeat(50) + '\n')
};

export interface QuestionRecord {
  id: string;
  original_id: string;
  created_at: string;
}

// Backup directory setup
const BACKUP_DIR = path.join(process.cwd(), 'backups');
const getBackupPath = (type: string) => path.join(BACKUP_DIR, `${type}_${new Date().toISOString().replace(/[:.]/g, '-')}.json`);

// Backup functionality
async function createBackup(type: string, data: any[]) {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    const backupPath = getBackupPath(type);
    await fs.writeFile(backupPath, JSON.stringify(data, null, 2));
    logger.success(`Backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    logger.error(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// Restore functionality
async function restoreFromBackup(backupPath: string) {
  try {
    const backupData = JSON.parse(await fs.readFile(backupPath, 'utf-8'));
    const type = path.basename(backupPath).split('_')[0];

    logger.info(`Restoring ${type} from backup: ${backupPath}`);

    for (const item of backupData) {
      const { error } = await supabase
        .from(type)
        .upsert(item, { onConflict: 'id' });

      if (error) {
        logger.error(`Error restoring item ${item.id}: ${error.message}`);
      }
    }

    logger.success(`Restored ${backupData.length} items from backup`);
  } catch (error) {
    logger.error(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

async function rollbackDuplicates() {
  logger.info('Starting rollback of duplicate entries...');
  logger.divider();

  try {
    // First handle questions duplicates
    await handleQuestionDuplicates();

    // Handle topic duplicates
    await handleTopicDuplicates();

    // Handle subtopic duplicates
    await handleSubtopicDuplicates();

    // Clean up empty lessons
    await cleanupEmptyLessons();

    logger.divider();
    logger.success('Rollback completed successfully');

  } catch (error) {
    logger.error(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

async function handleQuestionDuplicates() {
  logger.info('Starting rollback of duplicate questions...');
  logger.divider();

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id, original_id')
      .limit(1);

    if (error) {
      logger.error(error.message);
      throw error;
    }

    logger.info(JSON.stringify(data, null, 2));
    
    // Get all questions to check their structure
    const { data: sampleQuestion, error: sampleError } = await supabase
      .from('questions')
      .select('*')
      .limit(1)
      .single();

    if (sampleError) {
      logger.error(`Error fetching sample question: ${sampleError.message}`);
      throw sampleError;
    }

    logger.info('Database connection successful');
    logger.info(`Sample question ID: ${sampleQuestion.id}`);
    logger.divider();

    // Now proceed with duplicate check
    const { data: duplicates, error: findError } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false });

    if (findError) {
      logger.error(`Error finding duplicates: ${findError.message}`);
      throw findError;
    }

    if (!duplicates || duplicates.length === 0) {
      logger.warn('No questions found.');
      return;
    }

    logger.info(`Total questions found: ${duplicates.length}`);
    logger.divider();

    // Group by content to find duplicates
    const groupedByContent = duplicates.reduce<Record<string, string[]>>((acc, curr) => {
      const key = `${curr.title}-${curr.content}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr.id);
      return acc;
    }, {});

    // Get IDs to delete (all except the first/latest one for each original_id)
    const idsToDelete = Object.values(groupedByContent)
      .filter(ids => ids.length > 1)
      .map(ids => ids.slice(1))
      .flat();

    if (idsToDelete.length === 0) {
      logger.success('No duplicates found.');
      return;
    }

    logger.warn(`Found ${idsToDelete.length} duplicate entries to remove.`);
    logger.divider();

    // Delete duplicates in batches of 100
    const batchSize = 100;
    for (let i = 0; i < idsToDelete.length; i += batchSize) {
      const batch = idsToDelete.slice(i, i + batchSize);
      logger.info(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(idsToDelete.length / batchSize)}`);
      
      const { error: deleteError } = await supabase
        .from('questions')
        .delete()
        .in('id', batch);

      if (deleteError) {
        logger.error(`Error deleting batch: ${deleteError.message}`);
        throw deleteError;
      }
      logger.success(`Batch ${Math.floor(i / batchSize) + 1} completed`);
    }

    logger.divider();
    logger.success('Rollback completed successfully');
    logger.success(`Removed ${idsToDelete.length} duplicate entries`);

  } catch (error) {
    logger.error(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

async function handleTopicDuplicates() {
  logger.info('Checking for duplicate topics...');

  // First get all topics with their associated lessons
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select(`
      *,
      lessons:lessons(*),
      subtopics:subtopics(*)
    `)
    .order('created_at', { ascending: false });

  if (topicsError) throw topicsError;

  // Create backups before deletion
  const backupPaths = {
    topics: await createBackup('topics', topics),
    lessons: await createBackup('lessons', topics.flatMap(t => t.lessons || [])),
    subtopics: await createBackup('subtopics', topics.flatMap(t => t.subtopics || []))
  };

  // Store backup metadata
  await fs.writeFile(
    path.join(BACKUP_DIR, 'backup_metadata.json'),
    JSON.stringify({
      timestamp: new Date().toISOString(),
      paths: backupPaths,
      type: 'topic_cleanup'
    })
  );

  // Group by title to find duplicates
  const groupedByTitle = topics.reduce<Record<string, any[]>>((acc, curr) => {
    const key = curr.title.toLowerCase().trim();
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  // Get duplicate topics (keeping the most recent one)
  const duplicateTopics = Object.values(groupedByTitle)
    .filter(group => group.length > 1)
    .map(group => group.slice(1))
    .flat();

  if (duplicateTopics.length > 0) {
    logger.warn(`Found ${duplicateTopics.length} duplicate topics to process`);

    // First, delete associated empty lessons
    for (const topic of duplicateTopics) {
      if (topic.lessons && topic.lessons.length > 0) {
        const lessonIds = topic.lessons.map((lesson: any) => lesson.id);
        
        // Delete lessons associated with this topic
        const { error: deleteError } = await supabase
          .from('lessons')
          .delete()
          .in('id', lessonIds);

        if (deleteError) {
          logger.error(`Error deleting lessons for topic ${topic.id}: ${deleteError.message}`);
          continue;
        }
        logger.success(`Removed ${lessonIds.length} lessons from topic ${topic.id}`);
      }

      // Delete subtopics associated with this topic
      const { error: subtopicsError } = await supabase
        .from('subtopics')
        .delete()
        .eq('topic_id', topic.id);

      if (subtopicsError) {
        logger.error(`Error deleting subtopics for topic ${topic.id}: ${subtopicsError.message}`);
        continue;
      }

      // Finally delete the topic
      const { error: topicError } = await supabase
        .from('topics')
        .delete()
        .eq('id', topic.id);

      if (topicError) {
        logger.error(`Error deleting topic ${topic.id}: ${topicError.message}`);
        continue;
      }
      logger.success(`Successfully removed duplicate topic: ${topic.title}`);
    }

    logger.success(`Completed processing ${duplicateTopics.length} duplicate topics`);
  } else {
    logger.success('No duplicate topics found');
  }
}

async function handleSubtopicDuplicates() {
  logger.info('Checking for duplicate subtopics...');

  // Get subtopics with their associated lessons
  const { data: subtopics, error: subtopicsError } = await supabase
    .from('subtopics')
    .select(`
      *,
      lessons:lessons(*)
    `)
    .order('created_at', { ascending: false });

  if (subtopicsError) {
    logger.error(`Error fetching subtopics: ${subtopicsError.message}`);
    throw subtopicsError;
  }

  // Group by title within same topic to find duplicates
  const groupedByTitleAndTopic = subtopics.reduce<Record<string, any[]>>((acc, curr) => {
    const key = `${curr.topic_id}-${curr.title.toLowerCase().trim()}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  // Get duplicate subtopics
  const duplicateSubtopics = Object.values(groupedByTitleAndTopic)
    .filter(group => group.length > 1)
    .map(group => group.slice(1))
    .flat();

  if (duplicateSubtopics.length > 0) {
    logger.warn(`Found ${duplicateSubtopics.length} duplicate subtopics to process`);

    for (const subtopic of duplicateSubtopics) {
      // First delete associated lessons
      if (subtopic.lessons && subtopic.lessons.length > 0) {
        const lessonIds = subtopic.lessons.map((lesson: any) => lesson.id);
        
        const { error: deleteError } = await supabase
          .from('lessons')
          .delete()
          .in('id', lessonIds);

        if (deleteError) {
          logger.error(`Error deleting lessons for subtopic ${subtopic.id}: ${deleteError.message}`);
          continue;
        }
        logger.success(`Removed ${lessonIds.length} lessons from subtopic ${subtopic.id}`);
      }

      // Then delete the subtopic
      const { error: subtopicError } = await supabase
        .from('subtopics')
        .delete()
        .eq('id', subtopic.id);

      if (subtopicError) {
        logger.error(`Error deleting subtopic ${subtopic.id}: ${subtopicError.message}`);
        continue;
      }
      logger.success(`Successfully removed duplicate subtopic: ${subtopic.title}`);
    }

    logger.success(`Completed processing ${duplicateSubtopics.length} duplicate subtopics`);
  } else {
    logger.success('No duplicate subtopics found');
  }
}

async function cleanupEmptyLessons() {
  logger.info('Checking for empty lessons...');

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('*, questions!inner(*)');

  if (lessonsError) {
    logger.error(`Error fetching lessons: ${lessonsError.message}`);
    throw lessonsError;
  }

  // Find lessons with no questions
  const emptyLessons = lessons.filter(lesson => !lesson.questions || lesson.questions.length === 0);

  if (emptyLessons.length > 0) {
    logger.warn(`Found ${emptyLessons.length} empty lessons to remove`);
    
    const emptyLessonIds = emptyLessons.map(lesson => lesson.id);
    
    // Delete empty lessons
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .in('id', emptyLessonIds);

    if (deleteError) {
      logger.error(`Error deleting empty lessons: ${deleteError.message}`);
      throw deleteError;
    }
    
    logger.success(`Removed ${emptyLessons.length} empty lessons`);
  } else {
    logger.success('No empty lessons found');
  }
}

// Restore command
async function restoreBackup(timestamp?: string) {
  const metadataPath = path.join(BACKUP_DIR, 'backup_metadata.json');
  
  try {
    const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf-8'));
    
    if (timestamp && metadata.timestamp !== timestamp) {
      throw new Error('Backup timestamp does not match');
    }

    // Restore in reverse order to handle foreign keys
    await restoreFromBackup(metadata.paths.lessons);
    await restoreFromBackup(metadata.paths.subtopics);
    await restoreFromBackup(metadata.paths.topics);

    logger.success('Restore completed successfully');
  } catch (error) {
    logger.error(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    throw error;
  }
}

// List available backups
async function listBackups() {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const metadataFiles = files.filter(f => f.endsWith('metadata.json'));
    
    for (const file of metadataFiles) {
      const metadata = JSON.parse(
        await fs.readFile(path.join(BACKUP_DIR, file), 'utf-8')
      );
      console.log(`Backup from ${metadata.timestamp} (${metadata.type})`);
    }
  } catch (error) {
    logger.error(`Failed to list backups: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Modified main function to include the actual rollback
async function main() {
  const command = process.argv[2];
  const timestamp = process.argv[3];

  switch (command) {
    case 'backup':
      await handleTopicDuplicates();
      break;
    case 'restore':
      await restoreBackup(timestamp);
      break;
    case 'list':
      await listBackups();
      break;
    case 'rollback':
      await rollbackDuplicates();
      break;
    default:
      console.log(`
Usage:
  npx ts-node src/scripts/rollback-duplicates.ts rollback   # Remove duplicates with backup
  npx ts-node src/scripts/rollback-duplicates.ts backup     # Only create backup
  npx ts-node src/scripts/rollback-duplicates.ts restore [timestamp]  # Restore from backup
  npx ts-node src/scripts/rollback-duplicates.ts list      # List available backups
      `);
  }
}

// Execute if this is the main module
if (import.meta.url === fileURLToPath(import.meta.url)) {
  main()
    .then(() => {
      logger.divider();
      logger.success('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      logger.divider();
      logger.error('Script failed');
      logger.error(error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    });
}

export { rollbackDuplicates, restoreBackup, listBackups }; 