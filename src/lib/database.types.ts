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
      grades: {
        Row: {
          id: string;
          name: string;
          level: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          level: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          level?: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      role_settings: {
        Row: {
          id: string;
          role_key: string;
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          role_key: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role_key?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales_activities: {
        Row: {
          id: string;
          lead_id: string;
          type: string;
          subject: string;
          description: string | null;
          status: string | null;
          due_date: string | null;
          completed_at: string | null;
          performed_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          type: string;
          subject: string;
          description?: string | null;
          status?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          performed_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          type?: string;
          subject?: string;
          description?: string | null;
          status?: string | null;
          due_date?: string | null;
          completed_at?: string | null;
          performed_by?: string;
          created_at?: string;
        };
      };
      sales_leads: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone: string | null;
          status: string;
          source: string | null;
          assigned_to: string | null;
          estimated_value: number | null;
          probability: number | null;
          expected_close_date: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name: string;
          email: string;
          phone?: string | null;
          status: string;
          source?: string | null;
          assigned_to?: string | null;
          estimated_value?: number | null;
          probability?: number | null;
          expected_close_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_name?: string;
          email?: string;
          phone?: string | null;
          status?: string;
          source?: string | null;
          assigned_to?: string | null;
          estimated_value?: number | null;
          probability?: number | null;
          expected_close_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      sales_opportunities: {
        Row: {
          id: string;
          lead_id: string;
          name: string;
          stage: string;
          amount: number | null;
          close_date: string | null;
          probability: number | null;
          next_step: string | null;
          competition: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          name: string;
          stage: string;
          amount?: number | null;
          close_date?: string | null;
          probability?: number | null;
          next_step?: string | null;
          competition?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          name?: string;
          stage?: string;
          amount?: number | null;
          close_date?: string | null;
          probability?: number | null;
          next_step?: string | null;
          competition?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          type: string;
          parent_id: string | null;
          address: string;
          latitude: number;
          longitude: number;
          contact_number: string;
          email: string;
          status: string;
          capacity: number;
          principal_name: string;
          website: string | null;
          established_year: number | null;
          accreditation_status: string | null;
          facilities: Json | null;
          operating_hours: Json | null;
          social_media: Json | null;
          emergency_contact: string | null;
          tax_id: string | null;
          license_number: string | null;
          last_inspection_date: string | null;
          student_count: number | null;
          staff_count: number | null;
          classroom_count: number | null;
          is_boarding: boolean | null;
          transportation_provided: boolean | null;
          curriculum_type: string[] | null;
          languages_offered: string[] | null;
          extracurricular_activities: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          parent_id?: string | null;
          address: string;
          latitude: number;
          longitude: number;
          contact_number: string;
          email: string;
          status: string;
          capacity: number;
          principal_name: string;
          website?: string | null;
          established_year?: number | null;
          accreditation_status?: string | null;
          facilities?: Json | null;
          operating_hours?: Json | null;
          social_media?: Json | null;
          emergency_contact?: string | null;
          tax_id?: string | null;
          license_number?: string | null;
          last_inspection_date?: string | null;
          student_count?: number | null;
          staff_count?: number | null;
          classroom_count?: number | null;
          is_boarding?: boolean | null;
          transportation_provided?: boolean | null;
          curriculum_type?: string[] | null;
          languages_offered?: string[] | null;
          extracurricular_activities?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          parent_id?: string | null;
          address?: string;
          latitude?: number;
          longitude?: number;
          contact_number?: string;
          email?: string;
          status?: string;
          capacity?: number;
          principal_name?: string;
          website?: string | null;
          established_year?: number | null;
          accreditation_status?: string | null;
          facilities?: Json | null;
          operating_hours?: Json | null;
          social_media?: Json | null;
          emergency_contact?: string | null;
          tax_id?: string | null;
          license_number?: string | null;
          last_inspection_date?: string | null;
          student_count?: number | null;
          staff_count?: number | null;
          classroom_count?: number | null;
          is_boarding?: boolean | null;
          transportation_provided?: boolean | null;
          curriculum_type?: string[] | null;
          languages_offered?: string[] | null;
          extracurricular_activities?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      school_grades: {
        Row: {
          school_id: string;
          grade_id: string;
          created_at: string;
        };
        Insert: {
          school_id: string;
          grade_id: string;
          created_at?: string;
        };
        Update: {
          school_id?: string;
          grade_id?: string;
          created_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercise_prompts: {
        Row: {
          id: string;
          text: string;
          media: string | null;
          type: string | null;
          narration: string | null;
          saytext: string | null;
          question_id: string | null;
          created_at: string;
          updated_at: string;
          user_id: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          text: string;
          media?: string | null;
          type?: string | null;
          narration?: string | null;
          saytext?: string | null;
          question_id?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          order_index: number;
        };
        Update: {
          id?: string;
          text?: string;
          media?: string | null;
          type?: string | null;
          narration?: string | null;
          saytext?: string | null;
          question_id?: string | null;
          created_at?: string;
          updated_at?: string;
          user_id?: string | null;
          order_index?: number;
        };
      };
      students: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string;
          roll_number: string;
          school_id: string | null;
          grade_id: string | null;
          gender: string | null;
          date_of_birth: string | null;
          contact_number: string | null;
          email: string | null;
          address: string | null;
          guardian_name: string | null;
          guardian_contact: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          first_name?: string | null;
          last_name: string;
          roll_number: string;
          school_id?: string | null;
          grade_id?: string | null;
          gender?: string | null;
          date_of_birth?: string | null;
          contact_number?: string | null;
          email?: string | null;
          address?: string | null;
          guardian_name?: string | null;
          guardian_contact?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string;
          roll_number?: string;
          school_id?: string | null;
          grade_id?: string | null;
          gender?: string | null;
          date_of_birth?: string | null;
          contact_number?: string | null;
          email?: string | null;
          address?: string | null;
          guardian_name?: string | null;
          guardian_contact?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      questions: {
        Row: {
          id: string;
          title: string;
          content: string | null;
          type: string;
          lesson_id: string;
          points: number | null;
          metadata: Json | null;
          order_index: number | null;
          created_at: string | null;
          updated_at: string | null;
          data: Json;
          correct_answer: string | null;
          user_id: string | null;
          exercise_prompts: Json[] | null;
        };
        Insert: {
          id?: string;
          title: string;
          content?: string | null;
          type: string;
          lesson_id: string;
          points?: number | null;
          metadata?: Json | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          data?: Json;
          correct_answer?: string | null;
          user_id?: string | null;
          exercise_prompts?: Json[] | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string | null;
          type?: string;
          lesson_id?: string;
          points?: number | null;
          metadata?: Json | null;
          order_index?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
          data?: Json;
          correct_answer?: string | null;
          user_id?: string | null;
          exercise_prompts?: Json[] | null;
        };
      };
      activities: {
        Row: {
          id: string;
          created_at: string;
          lesson_id: string;
          title: string;
          description: string | null;
          type: string;
          content: string | null;
          updated_at: string | null;
          name: string;
          instructions: string | null;
          data: Json | null;
          media: Json[] | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          lesson_id: string;
          title: string;
          description?: string | null;
          type: string;
          content?: string | null;
          updated_at?: string | null;
          name: string;
          instructions?: string | null;
          data?: Json | null;
          media?: Json[] | null;
          order_index: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          lesson_id?: string;
          title?: string;
          description?: string | null;
          type?: string;
          content?: string | null;
          updated_at?: string | null;
          name?: string;
          instructions?: string | null;
          data?: Json | null;
          media?: Json[] | null;
          order_index?: number;
        };
      };
      branches: {
        Row: {
          id: string;
          name: string;
          type: string;
          address: string;
          school_id: string | null;
          location: Json;
          latitude: number;
          longitude: number;
          contact_number: string;
          email: string;
          status: string;
          capacity: Json;
          administration: Json;
          website: string | null;
          established_year: number | null;
          accreditation_status: string | null;
          facilities: string[];
          operating_hours: Json;
          social_media: Json | null;
          emergency_contact: string | null;
          tax_id: string | null;
          license_number: string | null;
          last_inspection_date: string | null;
          student_count: number;
          staff_count: number;
          classroom_count: number;
          is_boarding: boolean;
          transportation_provided: boolean;
          curriculum_type: string[];
          languages_offered: string[];
          extracurricular_activities: string[];
          grades: string[];
          created_at: string;
          updated_at: string;
          academic_year_start: string | null;
          academic_year_end: string | null;
          school_timings: Json;
          academic_calendar: Json;
          grade_structure: Json;
          supported_languages: string[];
          academic_programs: Json;
          assessment_system: Json;
          teaching_methodologies: string[];
          academic_policies: Json;
          class_size_limits: Json;
        };
        Insert: {
          id?: string;
          type: string;
          address: string;
          name: string;
          school_id?: string | null;
          location: Json;
          latitude: number;
          longitude: number;
          contact_number: string;
          email: string;
          status: string;
          capacity: Json;
          administration: Json;
          website?: string | null;
          established_year?: number | null;
          accreditation_status?: string | null;
          facilities?: string[];
          operating_hours: Json;
          social_media?: Json | null;
          emergency_contact?: string | null;
          tax_id?: string | null;
          license_number?: string | null;
          last_inspection_date?: string | null;
          student_count?: number;
          staff_count?: number;
          classroom_count?: number;
          is_boarding?: boolean;
          transportation_provided?: boolean;
          curriculum_type?: string[];
          languages_offered?: string[];
          extracurricular_activities?: string[];
          grades?: string[];
          created_at?: string;
          updated_at?: string;
          academic_year_start?: string | null;
          academic_year_end?: string | null;
          school_timings?: Json;
          academic_calendar?: Json;
          grade_structure?: Json;
          supported_languages?: string[];
          academic_programs?: Json;
          assessment_system?: Json;
          teaching_methodologies?: string[];
          academic_policies?: Json;
          class_size_limits?: Json;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          address?: string;
          school_id?: string | null;
          location?: Json;
          latitude?: number;
          longitude?: number;
          contact_number?: string;
          email?: string;
          status?: string;
          capacity?: Json;
          administration?: Json;
          website?: string | null;
          established_year?: number | null;
          accreditation_status?: string | null;
          facilities?: string[];
          operating_hours?: Json;
          social_media?: Json | null;
          emergency_contact?: string | null;
          tax_id?: string | null;
          license_number?: string | null;
          last_inspection_date?: string | null;
          student_count?: number;
          staff_count?: number;
          classroom_count?: number;
          is_boarding?: boolean;
          transportation_provided?: boolean;
          curriculum_type?: string[];
          languages_offered?: string[];
          extracurricular_activities?: string[];
          grades?: string[];
          created_at?: string;
          updated_at?: string;
          academic_year_start?: string | null;
          academic_year_end?: string | null;
          school_timings?: Json;
          academic_calendar?: Json;
          grade_structure?: Json;
          supported_languages?: string[];
          academic_programs?: Json;
          assessment_system?: Json;
          teaching_methodologies?: string[];
          academic_policies?: Json;
          class_size_limits?: Json;
        };
      };
      calendar_events: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          description: string | null;
          start_time: string;
          end_time: string;
          location: string | null;
          type: string;
          status: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          description?: string | null;
          start_time: string;
          end_time: string;
          location?: string | null;
          type: string;
          status: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          description?: string | null;
          start_time?: string;
          end_time?: string;
          location?: string | null;
          type?: string;
          status?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          details?: Json;
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          name: string;
          type: string;
          url: string;
          size: number;
          mime_type: string;
          tags: string[];
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          url: string;
          size: number;
          mime_type: string;
          tags?: string[];
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          url?: string;
          size?: number;
          mime_type?: string;
          tags?: string[];
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string | null;
          recipient_id: string | null;
          subject: string;
          content: string;
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sender_id?: string | null;
          recipient_id?: string | null;
          subject: string;
          content: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string | null;
          recipient_id?: string | null;
          subject?: string;
          content?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      message_threads: {
        Row: {
          id: string;
          participants: string[];
          subject: string;
          last_message_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          participants: string[];
          subject: string;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          participants?: string[];
          subject?: string;
          last_message_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          type: string;
          title: string;
          message: string;
          read: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          type: string;
          title: string;
          message: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          type?: string;
          title?: string;
          message?: string;
          read?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          type: string;
          status: string;
          config: Json;
          url: string | null;
          error: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          status: string;
          config: Json;
          url?: string | null;
          error?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          status?: string;
          config?: Json;
          url?: string | null;
          error?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          assigned_to: string | null;
          due_date: string;
          priority: string;
          status: string;
          tags: string[];
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          assigned_to?: string | null;
          due_date: string;
          priority: string;
          status: string;
          tags?: string[];
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          assigned_to?: string | null;
          due_date?: string;
          priority?: string;
          status?: string;
          tags?: string[];
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics_metrics: {
        Row: {
          id: string;
          name: string;
          value: number;
          unit: string;
          category: string;
          tags: Json;
          timestamp: string;
        };
        Insert: {
          id?: string;
          name: string;
          value: number;
          unit: string;
          category: string;
          tags?: Json;
          timestamp?: string;
        };
        Update: {
          id?: string;
          name?: string;
          value?: number;
          unit?: string;
          category?: string;
          tags?: Json;
          timestamp?: string;
        };
      };
      sales_contacts: {
        Row: {
          id: string;
          lead_id: string | null;
          name: string;
          title: string | null;
          email: string | null;
          phone: string | null;
          is_primary: boolean;
          department: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id?: string | null;
          name: string;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          is_primary?: boolean;
          department?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string | null;
          name?: string;
          title?: string | null;
          email?: string | null;
          phone?: string | null;
          is_primary?: boolean;
          department?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      class_teachers: {
        Row: {
          class_id: string;
          teacher_id: string;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: {
          class_id: string;
          teacher_id: string;
          assigned_by?: string | null;
          assigned_at?: string;
        };
        Update: {
          class_id?: string;
          teacher_id?: string;
          assigned_by?: string | null;
          assigned_at?: string;
        };
      };
      class_students: {
        Row: {
          class_id: string;
          student_id: string;
          assigned_by: string | null;
          assigned_at: string;
        };
        Insert: {
          class_id: string;
          student_id: string;
          assigned_by?: string | null;
          assigned_at?: string;
        };
        Update: {
          class_id?: string;
          student_id?: string;
          assigned_by?: string | null;
          assigned_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          document_id: string;
          title: string;
          description: string | null;
          image_url: string | null;
          level: number | null;
          progress: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          title: string;
          description?: string | null;
          image_url?: string | null;
          level?: number | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          title?: string;
          description?: string | null;
          image_url?: string | null;
          level?: number | null;
          progress?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      loading_states: {
        Row: {
          id: string;
          component: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          component: string;
          status: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          component?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      onboarding_tasks: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          required: boolean;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: string;
          required?: boolean;
          order_index: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: string;
          required?: boolean;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      onboarding_progress: {
        Row: {
          id: string;
          school_id: string | null;
          task_id: string | null;
          status: string;
          notes: string | null;
          completed_by: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id?: string | null;
          task_id?: string | null;
          status: string;
          notes?: string | null;
          completed_by?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string | null;
          task_id?: string | null;
          status?: string;
          notes?: string | null;
          completed_by?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      school_documents: {
        Row: {
          id: string;
          school_id: string | null;
          type: string;
          name: string;
          url: string;
          status: string;
          notes: string | null;
          uploaded_by: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          valid_until: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id?: string | null;
          type: string;
          name: string;
          url: string;
          status: string;
          notes?: string | null;
          uploaded_by?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string | null;
          type?: string;
          name?: string;
          url?: string;
          status?: string;
          notes?: string | null;
          uploaded_by?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          valid_until?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          school_id: string | null;
          department: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          role: string;
          school_id?: string | null;
          department?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: string;
          school_id?: string | null;
          department?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
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
          course_id: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          grade_id: string;
          order_index?: number | null;
          created_at?: string;
          updated_at?: string;
          course_id?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          grade_id?: string;
          order_index?: number | null;
          created_at?: string;
          updated_at?: string;
          course_id?: string | null;
        };
      };
      user_schools: {
        Row: {
          user_id: string;
          school_id: string;
        };
        Insert: {
          user_id: string;
          school_id: string;
        };
        Update: {
          user_id?: string;
          school_id?: string;
        };
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
        Insert: Record<string, unknown>;
        Update: Record<string, unknown>;
      };
    };
    Functions: {
      update_health_check: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      school_status: 'active' | 'inactive' | 'pending' | 'suspended';
      school_category: 'public' | 'private' | 'charter' | 'international';
      school_level: 'elementary' | 'middle' | 'high' | 'all';
    };
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  grade?: { name: string };
  topics?: Array<{ count: number }>;
}