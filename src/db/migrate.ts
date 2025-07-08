import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://pxjhsbezqybrksmcpwmx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function runMigration() {
  try {
    console.log('🔄 Running database migration...');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'migrations', '20240410-initial-schema.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');

    // Split the migration into individual statements
    const statements = migrationSql
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      console.log(`\n🔨 Executing statement:\n${statement}`);
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        console.error('Error executing statement:', error);
        throw new Error(`Failed to execute statement: ${error.message}`);
      }
      console.log('Statement executed successfully:', data);
    }

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('\n❌ Error running migration:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  runMigration();
}

export { runMigration }; 