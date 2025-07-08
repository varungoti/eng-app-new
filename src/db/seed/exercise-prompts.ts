import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface ExercisePrompt {
  id: string;
  text: string;
  media: string | null;
  type: 'multiple_choice' | 'open_ended' | 'true_false' | 'matching';
  narration: string | null;
  saytext: string | null;
  question_id: string | null;
  lesson_id: string;
  order_index: number;
  voice_id: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
}

interface Lesson {
  id: string;
}

export async function seedExercisePrompts(
  supabase: SupabaseClient,
  lessons: Lesson[]
): Promise<ExercisePrompt[]> {
  try {
    const prompts: Omit<ExercisePrompt, 'id'>[] = [];
    const promptTypes: ExercisePrompt['type'][] = [
      'multiple_choice',
      'open_ended',
      'true_false',
      'matching'
    ];

    // Create prompts for each lesson
    lessons.forEach(lesson => {
      const promptCount = faker.number.int({ min: 3, max: 8 });
      
      for (let i = 0; i < promptCount; i++) {
        const type = faker.helpers.arrayElement(promptTypes);
        const hasMedia = faker.datatype.boolean();
        const hasNarration = faker.datatype.boolean();

        prompts.push({
          text: faker.lorem.sentence(),
          media: hasMedia ? faker.image.url() : null,
          type,
          narration: hasNarration ? faker.lorem.paragraph() : null,
          saytext: faker.helpers.maybe(() => faker.lorem.sentence()),
          question_id: null, // This would be linked to a question if needed
          lesson_id: lesson.id,
          order_index: i + 1,
          voice_id: null, // This would be linked to a voice if needed
          metadata: {
            difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
            points: faker.number.int({ min: 1, max: 10 }),
            time_limit: faker.number.int({ min: 30, max: 300 }),
            hints: Array.from(
              { length: faker.number.int({ min: 0, max: 2 }) },
              () => faker.lorem.sentence()
            )
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    });

    // Insert prompts
    const { data: insertedPrompts, error } = await supabase
      .from('exercise_prompts')
      .insert(prompts)
      .select();

    if (error) {
      throw new Error(`Failed to insert exercise prompts: ${error.message}`);
    }

    if (!insertedPrompts) {
      throw new Error('No exercise prompts were inserted');
    }

    return insertedPrompts;
  } catch (error) {
    console.error('Error seeding exercise prompts:', error);
    throw error;
  }
} 