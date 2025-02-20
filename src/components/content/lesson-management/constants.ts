export const API_BASE_URL = '/api/admin';

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
      keywords: [] as string[],
      hints: [] as string[]
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
      questions: [] as string[]
    }
  },
  listenAndRepeat: {
    label: 'Listen and Repeat',
    description: 'Practice pronunciation by listening and repeating phrases.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      phrases: [] as string[],
      translations: [] as string[]
    }
  },
  multipleChoice: {
    label: 'Multiple Choice',
    description: 'Answer questions by selecting from multiple options.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      options: [] as string[],
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
  },
  idiomPractice: {
    label: 'Idiom Practice',
    description: 'Learn and practice using English idioms in context.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      idiom: '',
      meaning: '',
      example: '',
      usageNotes: ''
    }
  },
  lookAndSpeak: {
    label: 'Look and Speak',
    description: 'Describe images and practice vocabulary.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      imageUrl: '',
      imageCaption: '',
      helpfulVocabulary: [] as string[]
    }
  },
  watchAndSpeak: {
    label: 'Watch and Speak',
    description: 'Watch videos and discuss their content.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      videoUrl: '',
      discussionPoints: [] as string[]
    }
  },
  debate: {
    label: 'Debate Practice',
    description: 'Practice argumentation and persuasive speaking.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      topic: '',
      position: '',
      keyPoints: [] as string[]
    }
  },
  presentation: {
    label: 'Presentation Practice',
    description: 'Prepare and deliver structured presentations.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      topic: '',
      duration: '',
      structure: [] as Array<{ title: string; points: string[] }>,
      visualAids: [] as Array<{ url: string; description: string }>
    }
  }
} as const;

export function isQuestionType(type: string): type is keyof typeof QUESTION_TYPES {
  return type in QUESTION_TYPES;
} 