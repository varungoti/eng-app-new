import { SupabaseClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

interface SchoolData {
  id: string;
  name: string;
  description: string;
  address: string;
  created_at: string;
}

interface SchoolSettings {
  school_id: string;
  setting_key: string;
  setting_value: any;
}

interface SchoolDepartment {
  id: string;
  school_id: string;
  name: string;
  description: string;
  head_teacher_id?: string;
}

interface SchoolEvent {
  id: string;
  school_id: string;
  title: string;
  description: string;
  event_type: 'academic' | 'cultural' | 'sports' | 'other';
  start_date: string;
  end_date: string;
  location: string;
  organizer_id?: string;
}

interface SchoolAnnouncement {
  id: string;
  school_id: string;
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  start_date: string;
  end_date?: string;
  created_by: string;
}

export async function seedSchools(supabase: SupabaseClient) {
  console.log('Seeding schools...');

  // Create test schools
  const schools: SchoolData[] = [
    {
      id: faker.string.uuid(),
      name: 'SpeakWell Academy',
      description: 'A premier English learning institution',
      address: faker.location.streetAddress(),
      created_at: new Date().toISOString(),
    },
    {
      id: faker.string.uuid(),
      name: 'Global English Institute',
      description: 'International English learning center',
      address: faker.location.streetAddress(),
      created_at: new Date().toISOString(),
    },
  ];

  // Insert schools
  const { error: schoolsError } = await supabase
    .from('schools')
    .insert(schools);

  if (schoolsError) {
    throw new Error(`Error seeding schools: ${schoolsError.message}`);
  }

  // Create school settings
  const settings: SchoolSettings[] = schools.flatMap(school => [
    {
      school_id: school.id,
      setting_key: 'theme',
      setting_value: { primary: '#007bff', secondary: '#6c757d' },
    },
    {
      school_id: school.id,
      setting_key: 'features',
      setting_value: { 
        enableChat: true,
        enableVideo: true,
        enableAssessment: true,
      },
    },
  ]);

  const { error: settingsError } = await supabase
    .from('school_settings')
    .insert(settings);

  if (settingsError) {
    throw new Error(`Error seeding school settings: ${settingsError.message}`);
  }

  // Create school departments
  const departments: SchoolDepartment[] = schools.flatMap(school => [
    {
      id: faker.string.uuid(),
      school_id: school.id,
      name: 'English Department',
      description: 'Core English language department',
    },
    {
      id: faker.string.uuid(),
      school_id: school.id,
      name: 'Speaking Skills',
      description: 'Focus on oral communication',
    },
  ]);

  const { error: departmentsError } = await supabase
    .from('school_departments')
    .insert(departments);

  if (departmentsError) {
    throw new Error(`Error seeding school departments: ${departmentsError.message}`);
  }

  // Create school events
  const events: SchoolEvent[] = schools.flatMap(school => [
    {
      id: faker.string.uuid(),
      school_id: school.id,
      title: 'English Speaking Competition',
      description: 'Annual speaking competition for students',
      event_type: 'academic',
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Main Auditorium',
    },
    {
      id: faker.string.uuid(),
      school_id: school.id,
      title: 'Cultural Exchange Day',
      description: 'International cultural exchange event',
      event_type: 'cultural',
      start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'School Grounds',
    },
  ]);

  const { error: eventsError } = await supabase
    .from('school_events')
    .insert(events);

  if (eventsError) {
    throw new Error(`Error seeding school events: ${eventsError.message}`);
  }

  // Create school announcements
  const announcements: SchoolAnnouncement[] = schools.flatMap(school => [
    {
      id: faker.string.uuid(),
      school_id: school.id,
      title: 'New Course Available',
      content: 'We are excited to announce our new advanced speaking course!',
      priority: 'high',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: faker.string.uuid(), // This should be a valid user ID
    },
    {
      id: faker.string.uuid(),
      school_id: school.id,
      title: 'Holiday Schedule',
      content: 'Please note the upcoming holiday schedule for next month.',
      priority: 'normal',
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      created_by: faker.string.uuid(), // This should be a valid user ID
    },
  ]);

  const { error: announcementsError } = await supabase
    .from('school_announcements')
    .insert(announcements);

  if (announcementsError) {
    throw new Error(`Error seeding school announcements: ${announcementsError.message}`);
  }

  console.log('Schools seeded successfully!');
  return schools;
} 