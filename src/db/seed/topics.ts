import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface Topic {
  id: string;
  name: string;
  description: string;
  subject: string;
  grade_level: string;
  created_at: string;
  updated_at: string;
}

export async function seedTopics(supabase: SupabaseClient): Promise<Topic[]> {
  try {
    const topics: Omit<Topic, 'id'>[] = [];
    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
    const gradeLevels = ['elementary', 'middle', 'high'];

    // Create topics for each subject and grade level
    subjects.forEach(subject => {
      gradeLevels.forEach(level => {
        const topicCount = faker.number.int({ min: 3, max: 6 });
        
        for (let i = 0; i < topicCount; i++) {
          topics.push({
            name: faker.helpers.arrayElement([
              `${subject} Fundamentals`,
              `Advanced ${subject}`,
              `${subject} Basics`,
              `${subject} Applications`,
              `${subject} Theory`,
              `${subject} Practice`
            ]),
            description: faker.lorem.paragraph(),
            subject,
            grade_level: level,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      });
    });

    // Insert topics
    const { data: insertedTopics, error } = await supabase
      .from('topics')
      .insert(topics)
      .select();

    if (error) {
      throw new Error(`Failed to insert topics: ${error.message}`);
    }

    if (!insertedTopics) {
      throw new Error('No topics were inserted');
    }

    return insertedTopics;
  } catch (error) {
    console.error('Error seeding topics:', error);
    throw error;
  }
} 