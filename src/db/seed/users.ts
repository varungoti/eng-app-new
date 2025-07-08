import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  password: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

interface UserRole {
  user_id: string;
  role: 'admin' | 'teacher' | 'student';
  created_at: string;
  updated_at: string;
}

interface UserPreference {
  user_id: string;
  theme: 'light' | 'dark';
  language: string;
  notifications_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export async function seedUsers(supabase: SupabaseClient): Promise<User[]> {
  try {
    // Create test users
    const users: Omit<User, 'id'>[] = Array.from({ length: 10 }, () => ({
      email: faker.internet.email(),
      password: 'test123', // You might want to hash this in production
      full_name: faker.person.fullName(),
      avatar_url: faker.image.avatar(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    // Insert users
    const { data: insertedUsers, error: userError } = await supabase
      .from('users')
      .insert(users)
      .select();

    if (userError) {
      throw new Error(`Failed to insert users: ${userError.message}`);
    }

    if (!insertedUsers) {
      throw new Error('No users were inserted');
    }

    // Create user roles
    const userRoles: UserRole[] = insertedUsers.map(user => ({
      user_id: user.id,
      role: faker.helpers.arrayElement(['admin', 'teacher', 'student']),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: roleError } = await supabase
      .from('user_roles')
      .insert(userRoles);

    if (roleError) {
      throw new Error(`Failed to insert user roles: ${roleError.message}`);
    }

    // Create user preferences
    const userPreferences: UserPreference[] = insertedUsers.map(user => ({
      user_id: user.id,
      theme: faker.helpers.arrayElement(['light', 'dark']),
      language: faker.helpers.arrayElement(['en', 'es', 'fr']),
      notifications_enabled: faker.datatype.boolean(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: prefError } = await supabase
      .from('user_preferences')
      .insert(userPreferences);

    if (prefError) {
      throw new Error(`Failed to insert user preferences: ${prefError.message}`);
    }

    return insertedUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
} 