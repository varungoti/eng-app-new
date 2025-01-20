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
      [key: string]: any;
    };
    Views: {
      [key: string]: any;
    };
    Functions: {
      update_health_check: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      [key: string]: any;
    };
  };
}