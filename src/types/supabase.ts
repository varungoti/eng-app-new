export interface Database {
  public: {
    Tables: {
      classes: {
        Row: {
          id: string;
          name: string;
          grade_id: string;
          section?: string;
          description?: string;
          created_at: string;
          updated_at: string;
        };
      };
      topics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          grade_id: string;
          order_index: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      subtopics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          topic_id: string;
          order_index: number | null;
          created_at: string;
          updated_at: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          description: string | null;
          topic_id: string | null;
          subtopic_id: string;
          order_index: number | null;
          duration: number | null;
          status: 'draft' | 'published';
          created_at: string;
          updated_at: string;
          contentheading: string | null;
          user_id: string | null;
          voice_id: string | null;
        };
      };
      students: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
      };
      class_students: {
        Row: {
          id: string;
          class_id: string;
          student_id: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}

export type Tables = Database['public']['Tables'];
export type DbClass = Tables['classes']['Row'];
export type DbTopic = Tables['topics']['Row'];
export type DbSubtopic = Tables['subtopics']['Row'];
export type DbLesson = Tables['lessons']['Row'];
export type DbStudent = Tables['students']['Row'];
export type DbClassStudent = Tables['class_students']['Row'];
