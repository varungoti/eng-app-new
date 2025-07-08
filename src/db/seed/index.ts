import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { seedUsers } from './users.js';
import { seedSchools } from './schools.js';
import { seedGrades } from './grades.js';
import { seedStudents } from './students.js';
import { seedStaff } from './staff.js';
import { seedLessons } from './lessons.js';
import { seedTopics } from './topics.js';
import { seedExercisePrompts } from './exercise-prompts.js';
import { seedVoices } from './voices.js';
import { seedSales } from './sales.js';

const supabaseUrl = 'https://pxjhsbezqybrksmcpwmx.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_KEY environment variable is not set');
  process.exit(1);
}

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    console.log('📊 Environment:', process.env.NODE_ENV);
    console.log('🔌 Connected to Supabase');

    // Test the connection
    const { data: testData, error: testError } = await supabase
      .from('_health')
      .select('*')
      .limit(1);

    if (testError) {
      throw new Error(`Failed to connect to Supabase: ${testError.message}`);
    }

    console.log('✅ Successfully connected to Supabase');

    // Seed in order of dependencies
    console.log('\n👥 Seeding users...');
    const users = await seedUsers(supabase);
    console.log(`✅ Created ${users.length} users`);

    console.log('\n🏫 Seeding schools...');
    const schools = await seedSchools(supabase);
    console.log(`✅ Created ${schools.length} schools`);

    console.log('\n📚 Seeding grades...');
    const grades = await seedGrades(supabase);
    console.log(`✅ Created ${grades.length} grades`);

    console.log('\n👨‍🎓 Seeding students...');
    const students = await seedStudents(supabase, schools, grades);
    console.log(`✅ Created ${students.length} students`);

    console.log('\n👨‍🏫 Seeding staff...');
    const staff = await seedStaff(supabase, schools);
    console.log(`✅ Created ${staff.length} staff members`);

    console.log('\n📝 Seeding topics...');
    const topics = await seedTopics(supabase);
    console.log(`✅ Created ${topics.length} topics`);

    console.log('\n📖 Seeding lessons...');
    const lessons = await seedLessons(supabase, topics, staff);
    console.log(`✅ Created ${lessons.length} lessons`);

    console.log('\n✍️ Seeding exercise prompts...');
    const prompts = await seedExercisePrompts(supabase, lessons);
    console.log(`✅ Created ${prompts.length} exercise prompts`);

    console.log('\n🎙️ Seeding voices...');
    const voices = await seedVoices(supabase);
    console.log(`✅ Created ${voices.length} voices`);

    console.log('\n💰 Seeding sales data...');
    const sales = await seedSales(supabase);
    console.log(`✅ Created sales data with ${sales.leads.length} leads`);

    console.log('\n✨ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    process.exit(1);
  }
}

// Run seeding if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  seed();
}

export { seed }; 