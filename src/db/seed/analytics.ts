import { SupabaseClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

interface ContentAnalytics {
  content_id: string;
  view_count: number;
  completion_count: number;
  average_completion_time: number;
  difficulty_rating: number;
  engagement_score: number;
}

interface SchoolAnalytics {
  school_id: string;
  total_students: number;
  active_students: number;
  total_teachers: number;
  active_teachers: number;
  total_lessons: number;
  completed_lessons: number;
  average_engagement_score: number;
}

export async function seedAnalytics(supabase: SupabaseClient) {
  console.log('Seeding analytics...');

  // Get all content IDs
  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id');

  if (lessonsError) {
    throw new Error(`Error fetching lessons: ${lessonsError.message}`);
  }

  // Create content analytics
  const contentAnalytics: ContentAnalytics[] = lessons.map(lesson => ({
    content_id: lesson.id,
    view_count: faker.number.int({ min: 10, max: 1000 }),
    completion_count: faker.number.int({ min: 5, max: 500 }),
    average_completion_time: faker.number.int({ min: 300, max: 3600 }), // 5-60 minutes
    difficulty_rating: faker.number.float({ min: 0.1, max: 1.0, precision: 0.1 }),
    engagement_score: faker.number.float({ min: 0.1, max: 1.0, precision: 0.1 }),
  }));

  const { error: contentAnalyticsError } = await supabase
    .from('content_analytics')
    .insert(contentAnalytics);

  if (contentAnalyticsError) {
    throw new Error(`Error seeding content analytics: ${contentAnalyticsError.message}`);
  }

  // Get all school IDs
  const { data: schools, error: schoolsError } = await supabase
    .from('schools')
    .select('id');

  if (schoolsError) {
    throw new Error(`Error fetching schools: ${schoolsError.message}`);
  }

  // Create school analytics
  const schoolAnalytics: SchoolAnalytics[] = schools.map(school => ({
    school_id: school.id,
    total_students: faker.number.int({ min: 50, max: 1000 }),
    active_students: faker.number.int({ min: 30, max: 800 }),
    total_teachers: faker.number.int({ min: 5, max: 50 }),
    active_teachers: faker.number.int({ min: 3, max: 40 }),
    total_lessons: faker.number.int({ min: 10, max: 200 }),
    completed_lessons: faker.number.int({ min: 5, max: 150 }),
    average_engagement_score: faker.number.float({ min: 0.1, max: 1.0, precision: 0.1 }),
  }));

  const { error: schoolAnalyticsError } = await supabase
    .from('school_analytics')
    .insert(schoolAnalytics);

  if (schoolAnalyticsError) {
    throw new Error(`Error seeding school analytics: ${schoolAnalyticsError.message}`);
  }

  console.log('Analytics seeded successfully!');
  return {
    contentAnalytics,
    schoolAnalytics,
  };
} 