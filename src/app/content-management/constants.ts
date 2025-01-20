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
  },
  matching: {
    label: 'Matching',
    description: 'Match items with their corresponding descriptions.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      items: [] as string[],
      descriptions: [] as string[]
    }
  },
  fillInTheBlank: {
    label: 'Fill in the Blank',
    description: 'Fill in the missing words in a sentence.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      sentence: '',
      blanks: [] as string[]
    }
  },
  trueOrFalse: {
    label: 'True or False',
    description: 'Determine if a statement is true or false.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      statement: '',
      correctAnswer: ''
    }
  },
  reading: {
    label: 'Reading',
    description: 'Read a passage and answer related questions.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      passage: '',
      questions: [] as string[]
    }
  },
  writing: {
    label: 'Writing',
    description: 'Write a response to a prompt.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      response: ''
    }
  },
  speakingAndWriting: {
    label: 'Speaking and Writing',
    description: 'Practice speaking and writing in a structured format.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      speakingPrompt: '',
      writingPrompt: ''
    }
  },
  speakingAndListening: {
    label: 'Speaking and Listening',
    description: 'Practice speaking and listening in a structured format.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      speakingPrompt: '',
      listeningPrompt: ''
    }
  },
  speakingAndReading: {
    label: 'Speaking and Reading',
    description: 'Practice speaking and reading in a structured format.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      speakingPrompt: '',
      readingPrompt: ''
    }
  },
  speakingAndSpeaking: {
    label: 'Speaking and Speaking',
    description: 'Practice speaking and speaking in a structured format.',
    defaultData: {
      prompt: '',
      teacherScript: '',
      speakingPrompt: '',
      speakingPrompt2: ''
    }
  },
} as const;

export type QuestionType = keyof typeof QUESTION_TYPES;

export function isQuestionType(type: string): type is keyof typeof QUESTION_TYPES {
  return type in QUESTION_TYPES;
} 

export const ACTIVITY_TYPES = {
  practice: 'Practice',
  exercise: 'Exercise',
  game: 'Game',
  quiz: 'Quiz'
} as const;

export const MEDIA_TYPES = {
  image: 'Image',
  video: 'Video',
  gif: 'GIF'
} as const;

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;