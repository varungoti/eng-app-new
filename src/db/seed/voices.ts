import { faker } from '@faker-js/faker';
import { SupabaseClient } from '@supabase/supabase-js';

interface Voice {
  id: string;
  name: string;
  language: string;
  gender: 'male' | 'female';
  accent: string;
  age_group: 'child' | 'young_adult' | 'adult' | 'senior';
  description: string;
  sample_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function seedVoices(supabase: SupabaseClient): Promise<Voice[]> {
  try {
    const voices: Omit<Voice, 'id'>[] = [];
    const languages = ['en-US', 'en-GB', 'en-AU', 'es-ES', 'fr-FR', 'de-DE'];
    const accents = ['American', 'British', 'Australian', 'Indian', 'Spanish', 'French', 'German'];
    const ageGroups: Voice['age_group'][] = ['child', 'young_adult', 'adult', 'senior'];
    const voiceCount = 15; // Number of voices to create

    for (let i = 0; i < voiceCount; i++) {
      const gender = faker.helpers.arrayElement(['male', 'female'] as const);
      const language = faker.helpers.arrayElement(languages);
      const accent = faker.helpers.arrayElement(accents);
      const ageGroup = faker.helpers.arrayElement(ageGroups);
      const firstName = faker.person.firstName(gender === 'male' ? 'male' : 'female');

      voices.push({
        name: `${firstName} ${faker.person.lastName()}`,
        language,
        gender,
        accent,
        age_group: ageGroup,
        description: faker.lorem.sentence(),
        sample_url: faker.helpers.maybe(() => faker.internet.url()),
        is_active: faker.datatype.boolean(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    // Insert voices
    const { data: insertedVoices, error } = await supabase
      .from('voices')
      .insert(voices)
      .select();

    if (error) {
      throw new Error(`Failed to insert voices: ${error.message}`);
    }

    if (!insertedVoices) {
      throw new Error('No voices were inserted');
    }

    return insertedVoices;
  } catch (error) {
    console.error('Error seeding voices:', error);
    throw error;
  }
} 