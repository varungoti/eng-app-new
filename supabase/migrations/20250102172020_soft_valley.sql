/*
  # Add initial grades data
  
  1. New Data
    - Adds initial grade records for PP1 through Grade 6
    
  2. Changes
    - Inserts base grade data with proper ordering
*/

-- Insert initial grades
INSERT INTO grades (name, level, description)
VALUES 
  ('PP1', 0, 'Pre-Primary 1'),
  ('PP2', 1, 'Pre-Primary 2'),
  ('Grade 1', 2, 'First Grade'),
  ('Grade 2', 3, 'Second Grade'),
  ('Grade 3', 4, 'Third Grade'),
  ('Grade 4', 5, 'Fourth Grade'),
  ('Grade 5', 6, 'Fifth Grade'),
  ('Grade 6', 7, 'Sixth Grade')
ON CONFLICT (id) DO NOTHING;