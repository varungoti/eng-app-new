export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      classes: {
        Row: {
          id: string
          name: string
          description: string | null
          grade_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
          section: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          grade_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          section?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          grade_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
          section?: string | null
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          content: string | null
          grade_id: string | null
          topic_id: string | null
          subtopic_id: string
          order_index: number | null
          status: string
          created_at: string
          updated_at: string
          description: string | null
          media_type: string | null
          media_url: string | null
          duration: number | null
          subjectId: string | null
          contentheading: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          grade_id?: string | null
          topic_id?: string | null
          subtopic_id: string
          order_index?: number | null
          status?: string
          created_at?: string
          updated_at?: string
          description?: string | null
          media_type?: string | null
          media_url?: string | null
          duration?: number | null
          subjectId?: string | null
          contentheading?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          grade_id?: string | null
          topic_id?: string | null
          subtopic_id?: string
          order_index?: number | null
          status?: string
          created_at?: string
          updated_at?: string
          description?: string | null
          media_type?: string | null
          media_url?: string | null
          duration?: number | null
          subjectId?: string | null
          contentheading?: string | null
          user_id?: string | null
        }
      }
      students: {
        Row: {
          id: string
          first_name: string
          last_name: string
          roll_number: string
          school_id: string | null
          grade_id: string | null
          gender: string | null
          date_of_birth: string | null
          contact_number: string | null
          email: string | null
          address: string | null
          guardian_name: string | null
          guardian_contact: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          roll_number: string
          school_id?: string | null
          grade_id?: string | null
          gender?: string | null
          date_of_birth?: string | null
          contact_number?: string | null
          email?: string | null
          address?: string | null
          guardian_name?: string | null
          guardian_contact?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          roll_number?: string
          school_id?: string | null
          grade_id?: string | null
          gender?: string | null
          date_of_birth?: string | null
          contact_number?: string | null
          email?: string | null
          address?: string | null
          guardian_name?: string | null
          guardian_contact?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      class_students: {
        Row: {
          class_id: string
          student_id: string
          assigned_by: string | null
          assigned_at: string
        }
        Insert: {
          class_id: string
          student_id: string
          assigned_by?: string | null
          assigned_at?: string
        }
        Update: {
          class_id?: string
          student_id?: string
          assigned_by?: string | null
          assigned_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 