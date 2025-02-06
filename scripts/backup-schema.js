import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function backupSchema() {
  try {
    const supabase = createClient(
      `https://${process.env.SUPABASE_PROJECT_ID}.supabase.co`,
      process.env.SUPABASE_ANON_KEY
    );

    // Get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables');

    if (tablesError) {
      throw new Error(`Failed to fetch tables: ${tablesError.message}`);
    }

    console.log('Tables found:', tables);

    const schema = {
      metadata: {
        timestamp: new Date().toISOString(),
        projectId: process.env.SUPABASE_PROJECT_ID,
        version: '1.0'
      },
      tables: {}
    };

    let sqlSchema = '-- Database Schema Export\n';
    sqlSchema += `-- Generated at: ${new Date().toISOString()}\n\n`;

    // Get details for each table
    for (const tableName of tables || []) {
      console.log(`Fetching info for table: ${tableName}`);
      
      const { data: tableInfo, error: tableError } = await supabase
        .rpc('get_table_info', { 
          table_name: tableName 
        });

      if (tableError) {
        console.error(`Error fetching info for table ${tableName}:`, tableError);
        console.error('Error details:', tableError.message);
        continue;
      }

      console.log(`Table info received for ${tableName}:`, tableInfo);

      if (!tableInfo) {
        console.warn(`No info received for table ${tableName}`);
        continue;
      }

      schema.tables[tableName] = tableInfo;

      // Generate SQL for this table
      sqlSchema += `-- Table: ${tableName}\n`;
      sqlSchema += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      
      // Add columns
      if (tableInfo.columns && Array.isArray(tableInfo.columns)) {
        const columnDefs = tableInfo.columns.map(col => {
          let def = `  ${col.name} ${col.type}`;
          if (col.nullable === 'NO') def += ' NOT NULL';
          if (col.default) def += ` DEFAULT ${col.default}`;
          return def;
        });
        sqlSchema += columnDefs.join(',\n');
      }

      // Add constraints
      if (tableInfo.constraints && Array.isArray(tableInfo.constraints) && tableInfo.constraints.length > 0) {
        sqlSchema += ',\n';
        const constraintDefs = tableInfo.constraints.map(con => 
          `  CONSTRAINT ${con.name} ${con.type}`
        );
        sqlSchema += constraintDefs.join(',\n');
      }

      sqlSchema += '\n);\n\n';
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const schemaPath = path.join(__dirname, '../src/db');
    
    if (!fs.existsSync(schemaPath)) {
      fs.mkdirSync(schemaPath, { recursive: true });
    }

    // Save JSON backup
    fs.writeFileSync(
      path.join(schemaPath, `schema-${timestamp}.json`),
      JSON.stringify(schema, null, 2)
    );

    // Save SQL backup
    fs.writeFileSync(
      path.join(schemaPath, `schema-${timestamp}.sql`),
      sqlSchema
    );

    console.log('Schema backup completed successfully!');
    console.log(`JSON backup saved to: ${path.join(schemaPath, `schema-${timestamp}.json`)}`);
    console.log(`SQL backup saved to: ${path.join(schemaPath, `schema-${timestamp}.sql`)}`);

  } catch (error) {
    console.error('Error backing up schema:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

backupSchema();