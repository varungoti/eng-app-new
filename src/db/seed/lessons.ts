import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface Lesson {
  id: string;
  title: string;
  description: string;
  topic_id: string;
  created_by: string;
  content: any;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  prerequisites: string[];
  learning_objectives: string[];
  created_at: string;
  updated_at: string;
}

interface Topic {
  id: string;
}

interface Staff {
  id: string;
}

export async function seedLessons(
  supabase: SupabaseClient,
  topics: Topic[],
  staff: Staff[]
): Promise<Lesson[]> {
  try {
    const lessons: Omit<Lesson, 'id'>[] = [];
    const lessonCount = 30; // Number of lessons to create
    const difficultyLevels: Lesson['difficulty_level'][] = ['beginner', 'intermediate', 'advanced'];

    for (let i = 0; i < lessonCount; i++) {
      const topic = faker.helpers.arrayElement(topics);
      const teacher = faker.helpers.arrayElement(staff);
      const difficulty = faker.helpers.arrayElement(difficultyLevels);

      lessons.push({
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraphs(2),
        topic_id: topic.id,
        created_by: teacher.id,
        content: {
          sections: Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, () => ({
            title: faker.lorem.sentence(),
            content: faker.lorem.paragraphs(3),
            media: faker.helpers.maybe(() => ({
              type: faker.helpers.arrayElement(['image', 'video', 'audio']),
              url: faker.image.url()
            }))
          }))
        },
        difficulty_level: difficulty,
        duration_minutes: faker.number.int({ min: 30, max: 120 }),
        prerequisites: Array.from(
          { length: faker.number.int({ min: 0, max: 3 }) },
          () => faker.lorem.sentence()
        ),
        learning_objectives: Array.from(
          { length: faker.number.int({ min: 2, max: 5 }) },
          () => faker.lorem.sentence()
        ),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert lessons
    const { data: insertedLessons, error } = await supabase
      .from('lessons')
      .insert(lessons)
      .select();

    if (error) {
      throw new Error(`Failed to insert lessons: ${error.message}`);
    }

    if (!insertedLessons) {
      throw new Error('No lessons were inserted');
    }

    return insertedLessons;
  } catch (error) {
    console.error('Error seeding lessons:', error);
    throw error;
  }
} 