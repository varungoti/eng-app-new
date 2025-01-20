import { supabase } from '@/lib/supabase';

const getStudents = async () => {
  try {
    console.log('Fetching students data...');
    
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        school:schools!students_school_id_fkey (
          id,
          name
        ),
        grade:grades!fk_student_grade (
          id,
          name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }

    console.log('Students data fetched:', data?.length || 0, 'records');
    return data;
  } catch (err) {
    console.error('Failed to fetch students:', err);
    throw err;
  }
}; 

export const studentsService = {
  getStudents
};