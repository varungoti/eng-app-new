-- Update schools table with additional academic fields
ALTER TABLE schools
ADD COLUMN IF NOT EXISTS academic_year_start DATE,
ADD COLUMN IF NOT EXISTS academic_year_end DATE,
ADD COLUMN IF NOT EXISTS school_timings JSONB DEFAULT '{"regular": {"start": "08:00", "end": "15:00"}, "friday": {"start": "08:00", "end": "12:00"}}'::jsonb,
ADD COLUMN IF NOT EXISTS academic_calendar JSONB DEFAULT '{"terms": [], "holidays": [], "events": []}'::jsonb,
ADD COLUMN IF NOT EXISTS grade_structure JSONB DEFAULT '{"elementary": {"grades": [], "sections": []}, "middle": {"grades": [], "sections": []}, "high": {"grades": [], "sections": []}}'::jsonb,
ADD COLUMN IF NOT EXISTS supported_languages TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS academic_programs JSONB DEFAULT '{"regular": true, "specialNeeds": false, "gifted": false, "vocational": false}'::jsonb,
ADD COLUMN IF NOT EXISTS assessment_system JSONB DEFAULT '{"grading": "percentage", "passingScore": 40, "assessmentTypes": []}'::jsonb,
ADD COLUMN IF NOT EXISTS teaching_methodologies TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS academic_policies JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS class_size_limits JSONB DEFAULT '{"min": 15, "max": 30}'::jsonb;

-- Update branches table with additional academic fields
ALTER TABLE branches
ADD COLUMN IF NOT EXISTS academic_year_start DATE,
ADD COLUMN IF NOT EXISTS academic_year_end DATE,
ADD COLUMN IF NOT EXISTS school_timings JSONB DEFAULT '{"regular": {"start": "08:00", "end": "15:00"}, "friday": {"start": "08:00", "end": "12:00"}}'::jsonb,
ADD COLUMN IF NOT EXISTS academic_calendar JSONB DEFAULT '{"terms": [], "holidays": [], "events": []}'::jsonb,
ADD COLUMN IF NOT EXISTS grade_structure JSONB DEFAULT '{"elementary": {"grades": [], "sections": []}, "middle": {"grades": [], "sections": []}, "high": {"grades": [], "sections": []}}'::jsonb,
ADD COLUMN IF NOT EXISTS supported_languages TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS academic_programs JSONB DEFAULT '{"regular": true, "specialNeeds": false, "gifted": false, "vocational": false}'::jsonb,
ADD COLUMN IF NOT EXISTS assessment_system JSONB DEFAULT '{"grading": "percentage", "passingScore": 40, "assessmentTypes": []}'::jsonb,
ADD COLUMN IF NOT EXISTS teaching_methodologies TEXT[] DEFAULT '{}'::TEXT[],
ADD COLUMN IF NOT EXISTS academic_policies JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS class_size_limits JSONB DEFAULT '{"min": 15, "max": 30}'::jsonb;

-- Add comments to explain the new columns
COMMENT ON COLUMN schools.academic_year_start IS 'Start date of the academic year';
COMMENT ON COLUMN schools.academic_year_end IS 'End date of the academic year';
COMMENT ON COLUMN schools.school_timings IS 'School timing configuration for different days';
COMMENT ON COLUMN schools.academic_calendar IS 'Academic calendar including terms, holidays, and events';
COMMENT ON COLUMN schools.grade_structure IS 'Structure of grades and sections across different school levels';
COMMENT ON COLUMN schools.supported_languages IS 'Languages supported for instruction';
COMMENT ON COLUMN schools.academic_programs IS 'Types of academic programs offered';
COMMENT ON COLUMN schools.assessment_system IS 'Assessment and grading system configuration';
COMMENT ON COLUMN schools.teaching_methodologies IS 'Teaching methodologies employed';
COMMENT ON COLUMN schools.academic_policies IS 'Academic policies and rules';
COMMENT ON COLUMN schools.class_size_limits IS 'Minimum and maximum class size limits';

COMMENT ON COLUMN branches.academic_year_start IS 'Start date of the academic year';
COMMENT ON COLUMN branches.academic_year_end IS 'End date of the academic year';
COMMENT ON COLUMN branches.school_timings IS 'Branch timing configuration for different days';
COMMENT ON COLUMN branches.academic_calendar IS 'Branch academic calendar including terms, holidays, and events';
COMMENT ON COLUMN branches.grade_structure IS 'Structure of grades and sections across different branch levels';
COMMENT ON COLUMN branches.supported_languages IS 'Languages supported for instruction in this branch';
COMMENT ON COLUMN branches.academic_programs IS 'Types of academic programs offered in this branch';
COMMENT ON COLUMN branches.assessment_system IS 'Branch assessment and grading system configuration';
COMMENT ON COLUMN branches.teaching_methodologies IS 'Teaching methodologies employed in this branch';
COMMENT ON COLUMN branches.academic_policies IS 'Branch academic policies and rules';
COMMENT ON COLUMN branches.class_size_limits IS 'Branch minimum and maximum class size limits';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_schools_academic_year ON schools(academic_year_start, academic_year_end);
CREATE INDEX IF NOT EXISTS idx_branches_academic_year ON branches(academic_year_start, academic_year_end); 