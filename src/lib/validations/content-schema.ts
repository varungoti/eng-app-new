import * as z from "zod";

export const topicSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  gradeId: z.string().min(1, "Grade is required")
});

export const subtopicSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  topicId: z.string().min(1, "Topic is required")
});

export const lessonSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().optional(),
  subtopicId: z.string().min(1, "Subtopic is required")
});

export const questionSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional(),
  format: z.enum([
    'speaking',
    'storytelling',
    'listening',
    'listen_repeat',
    'multiple_choice',
    'grammar_speaking',
    'idiom_practice',
    'look_speak',
    'watch_speak',
    'debate',
    'presentation'
  ], {
    required_error: "Please select a question format"
  }),
  lessonId: z.string().min(1, "Lesson is required")
}); 