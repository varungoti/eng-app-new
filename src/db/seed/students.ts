import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  school_id: string;
  grade_id: string;
  gender: 'male' | 'female' | 'other';
  date_of_birth: string;
  contact_number: string;
  email: string;
  address: string;
  guardian_name: string;
  guardian_contact: string;
  created_at: string;
  updated_at: string;
}

interface School {
  id: string;
}

interface Grade {
  id: string;
}

export async function seedStudents(
  supabase: SupabaseClient,
  schools: School[],
  grades: Grade[]
): Promise<Student[]> {
  try {
    const students: Omit<Student, 'id'>[] = [];
    const studentCount = 50; // Number of students to create

    for (let i = 0; i < studentCount; i++) {
      const school = faker.helpers.arrayElement(schools);
      const grade = faker.helpers.arrayElement(grades);
      const gender = faker.helpers.arrayElement(['male', 'female', 'other'] as const);
      const firstName = faker.person.firstName(gender === 'male' ? 'male' : 'female');
      const lastName = faker.person.lastName();

      students.push({
        first_name: firstName,
        last_name: lastName,
        roll_number: faker.string.numeric(6),
        school_id: school.id,
        grade_id: grade.id,
        gender,
        date_of_birth: faker.date.birthdate({ min: 5, max: 18 }).toISOString().split('T')[0],
        contact_number: faker.phone.number(),
        email: faker.internet.email({ firstName, lastName }),
        address: faker.location.streetAddress(),
        guardian_name: faker.person.fullName(),
        guardian_contact: faker.phone.number(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert students
    const { data: insertedStudents, error } = await supabase
      .from('students')
      .insert(students)
      .select();

    if (error) {
      throw new Error(`Failed to insert students: ${error.message}`);
    }

    if (!insertedStudents) {
      throw new Error('No students were inserted');
    }

    return insertedStudents;
  } catch (error) {
    console.error('Error seeding students:', error);
    throw error;
  }
} 