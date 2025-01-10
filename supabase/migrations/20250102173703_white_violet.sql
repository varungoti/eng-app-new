/*
  # Add additional school fields

  1. New Fields for schools table:
    - `website` (text): School's website URL
    - `established_year` (integer): Year the school was established
    - `accreditation_status` (text): Current accreditation status
    - `facilities` (jsonb): Available facilities and amenities
    - `operating_hours` (jsonb): School operating hours
    - `social_media` (jsonb): Social media links
    - `emergency_contact` (text): Emergency contact information
    - `tax_id` (text): School's tax identification number
    - `license_number` (text): Educational license number
    - `last_inspection_date` (date): Date of last safety/quality inspection
    - `student_count` (integer): Current number of enrolled students
    - `staff_count` (integer): Total number of staff members
    - `classroom_count` (integer): Number of available classrooms
    - `is_boarding` (boolean): Whether the school offers boarding facilities
    - `transportation_provided` (boolean): Whether school transport is available
    - `curriculum_type` (text[]): Types of curriculum offered
    - `languages_offered` (text[]): Languages taught at the school
    - `extracurricular_activities` (text[]): Available extracurricular activities

  2. Security:
    - Maintain existing RLS policies
*/

-- Add new columns to schools table
ALTER TABLE schools ADD COLUMN IF NOT EXISTS website text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS established_year integer;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS accreditation_status text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS facilities jsonb DEFAULT '{}';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS operating_hours jsonb DEFAULT '{}';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '{}';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS emergency_contact text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS tax_id text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS license_number text;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS last_inspection_date date;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS student_count integer DEFAULT 0;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS staff_count integer DEFAULT 0;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS classroom_count integer DEFAULT 0;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_boarding boolean DEFAULT false;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS transportation_provided boolean DEFAULT false;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS curriculum_type text[] DEFAULT '{}';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS languages_offered text[] DEFAULT '{}';
ALTER TABLE schools ADD COLUMN IF NOT EXISTS extracurricular_activities text[] DEFAULT '{}';