export const API_BASE_URL = '/api/admin';

export const QUESTION_TYPES = {
  speaking: {
    label: 'Speaking Practice',
    description: 'Basic speaking practice with optional sample answers and teacher scripts.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      sample_answer: ''
    }
  },
  storytelling: {
    label: 'Storytelling',
    description: 'Practice storytelling with keywords, hints, and structured prompts.',
    defaultData: {
      prompt: '',
      teacher_script: '',
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
      teacher_script: '',
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
      teacher_script: '',
      phrases: [] as string[],
      translations: [] as string[]
    }
  },
  multipleChoice: {
    label: 'Multiple Choice',
    description: 'Answer questions by selecting from multiple options.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      options: [] as string[],
      correct_answer: null
    }
  },
  grammarSpeaking: {
    label: 'Grammar Speaking',
    description: 'Practice grammar points through speaking exercises.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      grammarPoint: '',
      example: ''
    }
  },
  idiomPractice: {
    label: 'Idiom Practice',
    description: 'Learn and practice using English idioms in context.',
    defaultData: {
      prompt: '',
      teacher_script: '',
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
      teacher_script: '',
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
      teacher_script: '',
      videoUrl: '',
      discussionPoints: [] as string[]
    }
  },
  debate: {
    label: 'Debate Practice',
    description: 'Practice argumentation and persuasive speaking.',
    defaultData: {
      prompt: '',
      teacher_script: '',
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
      teacher_script: '',
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
      teacher_script: '',
      items: [] as string[],
      descriptions: [] as string[]
    }
  },
  fillInTheBlank: {
    label: 'Fill in the Blank',
    description: 'Fill in the missing words in a sentence.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      sentence: '',
      blanks: [] as string[]
    }
  },
  trueOrFalse: {
    label: 'True or False',
    description: 'Determine if a statement is true or false.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      statement: '',
      correct_answer: ''
    }
  },
  reading: {
    label: 'Reading',
    description: 'Read a passage and answer related questions.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      passage: '',
      questions: [] as string[]
    }
  },
  writing: {
    label: 'Writing',
    description: 'Write a response to a prompt.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      response: ''
    }
  },
  speakingAndWriting: {
    label: 'Speaking and Writing',
    description: 'Practice speaking and writing in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      writingPrompt: ''
    }
  },
  speakingAndListening: {
    label: 'Listening and Speaking',
    description: 'Practice listening and speaking in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      listeningPrompt: '',
      speakingPrompt: ''
    }
  },
  readingAndSpeaking: {
    label: 'Reading and Speaking',
    description: 'Practice reading and speaking in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      readingPrompt: '',
      speakingPrompt: ''
    }
  },
  speakingAndSpeaking: {
    label: 'Speaking and Speaking',
    description: 'Practice speaking and speaking in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      speakingPrompt2: ''
    }
  },
  speakingWithAPartner: {
    label: 'Speaking with a Partner',
    description: 'Practice speaking with a partner in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      partnerPrompt: ''
    }
  },
  actionAndSpeaking: {
    label: 'Action and Speaking',
    description: 'Practice speaking with a partner in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      actionPrompt: ''
    }
  },
  objectAndSpeaking: {
    label: 'Object and Speaking',
    description: 'Practice speaking with an object in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      objectPrompt: ''
    }
  },
  objectActionAndSpeaking: {
    label: 'Object Action and Speaking',
    description: 'Practice speaking with an object and action in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      objectPrompt: '',
      actionPrompt: ''
    }
  },
  vocabularyAndSpeaking: {
    label: 'Vocabulary and Speaking',
    description: 'Practice speaking with vocabulary in a structured format.',
    defaultData: {
      prompt: '',
      teacher_script: '',
      speakingPrompt: '',
      vocabularyPrompt: ''
    },
  },
  vocabularyAndWordlist: {
    label: 'Vocabulary and Wordlist',
    description: 'Practice speaking with vocabulary and wordlist in a structured format.',
    defaultData: {
        prompt: '',
        teacher_script: '',
        wordlistPrompt: [] as Array<{ word: string; definition: string; correctPronunciation: string; phoneticGuide: string; pronunciationAudio: string; example: string; usageNotes: string; synonyms: string[]; antonyms: string[] }>,
        vocabularyPrompt: ''
    }
  },
  sentenceFormation: {
    label: 'Sentence Formation',
    description: 'Practice speaking with sentence formation in a structured format.',
    defaultData: {
      prompt: '',
      originalSentence: '',
      hint: [] as string[] ,
      correct_answer: '',
      teacher_script: ''
    }
  },
  sentenceTransformation: {
    label: 'Sentence Transformation',
    description: 'Practice speaking with sentence transformation in a structured format.',
    defaultData: {
      prompt: '',
      originalSentence: '',
      tenseToTransform: '',
      hint: [] as string[],
      correct_answer: '',
      teacher_script: ''
    }
  },
  sentenceCompletion: {
    label: 'Sentence Completion',
    description: 'Practice speaking with sentence completion in a structured format.',
    defaultData: {
      prompt: '',
      sentence: '',
      hint: [] as string[],
      correct_answer: '',
      teacher_script: ''
    }
  },
  sentenceTransformationAndCompletion: {
    label: 'Sentence Transformation and Completion',
    description: 'Practice speaking with sentence transformation and completion in a structured format.',
    defaultData: {
      prompt: '',
      originalSentence: '',
      tenseToTransform: '',
      hint: [] as string[],
      correct_answer: '',
      teacher_script: ''
    }
  }
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