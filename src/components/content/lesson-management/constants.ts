export const QUESTION_TYPES = {
  speaking: {
    label: 'Speaking Practice',
    description: 'Basic speaking practice with optional sample answers and teacher scripts.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      sampleAnswer: ''
    }
  },
  storytelling: {
    label: 'Storytelling',
    description: 'Practice storytelling with keywords, hints, and structured prompts.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      storyPrompt: '',
      keywords: [],
      hints: []
    }
  },
  listening: {
    label: 'Listening Practice',
    description: 'Listen to audio content and answer related questions.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      audioContent: '',
      transcript: '',
      questions: []
    }
  },
  listenAndRepeat: {
    label: 'Listen and Repeat',
    description: 'Practice pronunciation by listening and repeating phrases.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      phrases: [],
      translations: []
    }
  },
  multipleChoice: {
    label: 'Multiple Choice',
    description: 'Answer questions by selecting from multiple options.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      options: [],
      correctAnswer: null
    }
  },
  grammarSpeaking: {
    label: 'Grammar Speaking',
    description: 'Practice grammar points through speaking exercises.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      grammarPoint: '',
      example: ''
    }
  }
} as const;

export type QuestionType = keyof typeof QUESTION_TYPES;

export function isQuestionType(type: string): type is QuestionType {
  return Object.prototype.hasOwnProperty.call(QUESTION_TYPES, type);
}