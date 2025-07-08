import { SupabaseClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: any;
  created_by: string;
  created_at: string;
}

interface ContentVersion {
  content_id: string;
  version_number: number;
  content_data: any;
  created_by: string;
}

interface ContentMetadata {
  content_id: string;
  metadata_type: string;
  metadata_value: any;
}

interface ContentTag {
  id: string;
  name: string;
  description: string;
}

interface ContentTagRelation {
  content_id: string;
  tag_id: string;
}

interface ContentApproval {
  content_id: string;
  status: 'pending' | 'approved' | 'rejected';
  requested_by: string;
  review_notes?: string;
}

export async function seedContent(supabase: SupabaseClient) {
  console.log('Seeding content...');

  // Create test lessons
  const lessons: Lesson[] = [
    {
      id: faker.string.uuid(),
      title: 'Basic English Conversation',
      description: 'Learn essential English conversation skills',
      content: {
        sections: [
          {
            type: 'text',
            content: 'Welcome to Basic English Conversation!',
          },
          {
            type: 'exercise',
            content: {
              question: 'How do you greet someone in English?',
              options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
              correct: 'Hello',
            },
          },
        ],
      },
      created_by: faker.string.uuid(), // This should be a valid user ID
      created_at: new Date().toISOString(),
    },
    {
      id: faker.string.uuid(),
      title: 'Advanced Speaking Skills',
      description: 'Master advanced English speaking techniques',
      content: {
        sections: [
          {
            type: 'text',
            content: 'Welcome to Advanced Speaking Skills!',
          },
          {
            type: 'exercise',
            content: {
              question: 'What is the correct pronunciation of "schedule"?',
              options: ['shed-yool', 'sked-yool', 'shedule', 'skedule'],
              correct: 'shed-yool',
            },
          },
        ],
      },
      created_by: faker.string.uuid(), // This should be a valid user ID
      created_at: new Date().toISOString(),
    },
  ];

  // Insert lessons
  const { error: lessonsError } = await supabase
    .from('lessons')
    .insert(lessons);

  if (lessonsError) {
    throw new Error(`Error seeding lessons: ${lessonsError.message}`);
  }

  // Create content versions
  const versions: ContentVersion[] = lessons.map(lesson => ({
    content_id: lesson.id,
    version_number: 1,
    content_data: lesson.content,
    created_by: lesson.created_by,
  }));

  const { error: versionsError } = await supabase
    .from('content_versions')
    .insert(versions);

  if (versionsError) {
    throw new Error(`Error seeding content versions: ${versionsError.message}`);
  }

  // Create content metadata
  const metadata: ContentMetadata[] = lessons.flatMap(lesson => [
    {
      content_id: lesson.id,
      metadata_type: 'difficulty',
      metadata_value: { level: 'intermediate', score: 0.7 },
    },
    {
      content_id: lesson.id,
      metadata_type: 'prerequisites',
      metadata_value: ['basic_english', 'vocabulary'],
    },
  ]);

  const { error: metadataError } = await supabase
    .from('content_metadata')
    .insert(metadata);

  if (metadataError) {
    throw new Error(`Error seeding content metadata: ${metadataError.message}`);
  }

  // Create content tags
  const tags: ContentTag[] = [
    {
      id: faker.string.uuid(),
      name: 'beginner',
      description: 'Content suitable for beginners',
    },
    {
      id: faker.string.uuid(),
      name: 'advanced',
      description: 'Content for advanced learners',
    },
    {
      id: faker.string.uuid(),
      name: 'speaking',
      description: 'Speaking-focused content',
    },
  ];

  const { error: tagsError } = await supabase
    .from('content_tags')
    .insert(tags);

  if (tagsError) {
    throw new Error(`Error seeding content tags: ${tagsError.message}`);
  }

  // Create content-tag relations
  const tagRelations: ContentTagRelation[] = lessons.flatMap(lesson => [
    {
      content_id: lesson.id,
      tag_id: tags[0].id, // beginner tag
    },
    {
      content_id: lesson.id,
      tag_id: tags[2].id, // speaking tag
    },
  ]);

  const { error: relationsError } = await supabase
    .from('content_tag_relations')
    .insert(tagRelations);

  if (relationsError) {
    throw new Error(`Error seeding content tag relations: ${relationsError.message}`);
  }

  // Create content approvals
  const approvals: ContentApproval[] = lessons.map(lesson => ({
    content_id: lesson.id,
    status: 'approved',
    requested_by: lesson.created_by,
    review_notes: 'Content meets quality standards',
  }));

  const { error: approvalsError } = await supabase
    .from('content_approvals')
    .insert(approvals);

  if (approvalsError) {
    throw new Error(`Error seeding content approvals: ${approvalsError.message}`);
  }

  console.log('Content seeded successfully!');
  return lessons;
} 