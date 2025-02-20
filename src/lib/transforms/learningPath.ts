import type { Topic, Subtopic, Lesson, LessonProgress, Question } from '@/types/index';

const transformQuestionsToSubLessons = (questions: Question[] = [], progress?: LessonProgress) => {
  return questions.map((question, index) => {
    // Transform each question into a subLesson
    const subLesson = {
      id: question.id,
      title: `Question ${index + 1}`,
      completed: progress?.completed_questions?.includes(question.id) || false,
      description: question.content,
      duration: question.data?.metadata?.duration,
      unlocked: true, // Questions are unlocked by default
      exercises: question.data?.metadata?.questions?.map((exercisePrompt, promptIndex) => ({
        id: `${question.id}-prompt-${promptIndex}`,
        prompt: exercisePrompt,
        completed: progress?.progress_data?.answers?.[`${question.id}-prompt-${promptIndex}`] != null,
        hints: question.data?.metadata?.hints,
        keywords: question.data?.metadata?.keywords,
        sampleAnswer: question.data?.metadata?.sampleAnswer,
        transcript: question.data?.metadata?.transcript,
        audioContent: question.data?.metadata?.audioContent,
        translations: question.data?.metadata?.translations,
        options: question.data?.metadata?.options,
        correctAnswer: question.data?.metadata?.correctAnswer
      })) || []
    };

    return subLesson;
  });
};

const getDifficultyLevel = (lesson: Lesson) => {
  // Calculate base difficulty from question count
  const questionCount = lesson.questions?.length || 0;
  let difficultyScore = 0;

  // Question count contribution (0-3 points)
  if (questionCount > 15) difficultyScore += 3;
  else if (questionCount > 10) difficultyScore += 2;
  else if (questionCount > 5) difficultyScore += 1;

  // Content complexity contribution (0-3 points)
  const hasMedia = lesson.media_url ? 1 : 0;
  const hasActivities = (lesson.activities?.length || 0) > 0 ? 1 : 0;
  const hasPrerequisites = (lesson.prerequisites?.length || 0) > 0 ? 1 : 0;
  difficultyScore += hasMedia + hasActivities + hasPrerequisites;

  // Duration contribution (0-2 points)
  const duration = lesson.duration || 0;
  if (duration > 45) difficultyScore += 2;
  else if (duration > 25) difficultyScore += 1;

  // Map total score to difficulty level
  if (difficultyScore >= 6) return 'advanced';
  if (difficultyScore >= 3) return 'intermediate';
  return 'beginner';
};

const getColorForIndex = (index: number) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-red-500', 'bg-orange-500', 'bg-gray-500', 'bg-teal-500', 'bg-indigo-500'];
  return colors[index % colors.length];
};

const isLessonUnlocked = (lesson: Lesson, progress: LessonProgress[]) => {
  // If no prerequisites, lesson is unlocked
  if (!lesson.prerequisites?.length) return true;
  
  // Check if all prerequisites are completed
  return lesson.prerequisites.every(prereqId => 
    progress.some(p => p.lesson_id === prereqId && p.status === 'completed')
  );
};

export const transformLearningPathData = (
  topics: Topic[],
  progress: LessonProgress[]
) => {
  return topics.flatMap((topic, topicIndex) => {
    return topic.subtopics?.flatMap((subtopic, subtopicIndex) => {
      return subtopic.lessons?.map((lesson, lessonIndex) => {
        const lessonProgress = progress.find(p => p.lesson_id === lesson.id);
        
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          color: getColorForIndex(topicIndex),
          unlocked: isLessonUnlocked(lesson, progress),
          completed: lessonProgress?.status === 'completed',
          lessonNumber: `${topicIndex + 1}.${subtopicIndex + 1}.${lessonIndex + 1}`,
          totalTopics: `${lesson.questions?.length || 0}`,
          difficulty: getDifficultyLevel(lesson),
          subLessons: transformQuestionsToSubLessons(lesson.questions, lessonProgress)
        };
      });
    });
  }).filter(Boolean);
}; 