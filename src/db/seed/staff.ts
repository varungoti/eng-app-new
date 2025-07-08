import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface Staff {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  school_id: string;
  role: 'teacher' | 'principal' | 'admin' | 'counselor';
  department: string;
  qualification: string;
  experience_years: number;
  joining_date: string;
  address: string;
  emergency_contact: string;
  created_at: string;
  updated_at: string;
}

interface School {
  id: string;
}

export async function seedStaff(
  supabase: SupabaseClient,
  schools: School[]
): Promise<Staff[]> {
  try {
    const staff: Omit<Staff, 'id'>[] = [];
    const staffCount = 20; // Number of staff members to create
    const departments = ['Mathematics', 'Science', 'English', 'History', 'Physical Education', 'Arts'];
    const roles: Staff['role'][] = ['teacher', 'principal', 'admin', 'counselor'];

    for (let i = 0; i < staffCount; i++) {
      const school = faker.helpers.arrayElement(schools);
      const role = faker.helpers.arrayElement(roles);
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      staff.push({
        first_name: firstName,
        last_name: lastName,
        email: faker.internet.email({ firstName, lastName }),
        phone: faker.phone.number(),
        school_id: school.id,
        role,
        department: role === 'teacher' ? faker.helpers.arrayElement(departments) : 'Administration',
        qualification: faker.helpers.arrayElement(['B.Ed', 'M.Ed', 'PhD', 'MA', 'MS']),
        experience_years: faker.number.int({ min: 1, max: 30 }),
        joining_date: faker.date.past({ years: 5 }).toISOString().split('T')[0],
        address: faker.location.streetAddress(),
        emergency_contact: faker.phone.number(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert staff
    const { data: insertedStaff, error } = await supabase
      .from('staff')
      .insert(staff)
      .select();

    if (error) {
      throw new Error(`Failed to insert staff: ${error.message}`);
    }

    if (!insertedStaff) {
      throw new Error('No staff members were inserted');
    }

    return insertedStaff;
  } catch (error) {
    console.error('Error seeding staff:', error);
    throw error;
  }
} 