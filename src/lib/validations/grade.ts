import * as z from 'zod';

export const gradeSchema = z.object({
  name: z.string().min(2, 'Grade name must be at least 2 characters'),
  description: z.string().optional()
});

export type GradeFormValues = z.infer<typeof gradeSchema>; 