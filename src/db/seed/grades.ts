import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface Grade {
  id: string;
  name: string;
  level: 'elementary' | 'middle' | 'high';
  description: string;
  created_at: string;
  updated_at: string;
}

export async function seedGrades(supabase: SupabaseClient): Promise<Grade[]> {
  try {
    const gradeLevels = ['elementary', 'middle', 'high'];
    const grades: Omit<Grade, 'id'>[] = [];

    // Create grades for each level
    gradeLevels.forEach(level => {
      const gradeCount = level === 'elementary' ? 5 : level === 'middle' ? 3 : 4;
      
      for (let i = 1; i <= gradeCount; i++) {
        grades.push({
          name: `${level.charAt(0).toUpperCase() + level.slice(1)} ${i}`,
          level: level as 'elementary' | 'middle' | 'high',
          description: faker.lorem.sentence(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    });

    // Insert grades
    const { data: insertedGrades, error } = await supabase
      .from('grades')
      .insert(grades)
      .select();

    if (error) {
      throw new Error(`Failed to insert grades: ${error.message}`);
    }

    if (!insertedGrades) {
      throw new Error('No grades were inserted');
    }

    return insertedGrades;
  } catch (error) {
    console.error('Error seeding grades:', error);
    throw error;
  }
} 