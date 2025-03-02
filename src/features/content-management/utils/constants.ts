export const QUESTION_TYPES = {
  multipleChoice: {
    label: 'Multiple Choice',
    description: 'A question with multiple options where only one is correct',
    defaultData: {
      prompt: '',
      options: ['', '', '', ''],
      correct_answer: '',
      teacher_script: '',
      explanation: ''
    }
  },
  fillInBlank: {
    label: 'Fill in the Blank',
    description: 'A sentence or paragraph with missing words to be filled in',
    defaultData: {
      prompt: '',
      blanks: [],
      teacher_script: '',
      explanation: ''
    }
  },
  trueFalse: {
    label: 'True/False',
    description: 'A statement that students must identify as true or false',
    defaultData: {
      prompt: '',
      correct_answer: null,
      teacher_script: '',
      explanation: ''
    }
  },
  matching: {
    label: 'Matching',
    description: 'Two columns of items that students must match correctly',
    defaultData: {
      prompt: '',
      pairs: [],
      teacher_script: '',
      explanation: ''
    }
  },
  ordering: {
    label: 'Ordering',
    description: 'A list of items that students must arrange in the correct order',
    defaultData: {
      prompt: '',
      items: [],
      correctOrder: [],
      teacher_script: '',
      explanation: ''
    }
  },
  shortAnswer: {
    label: 'Short Answer',
    description: 'A question that requires a brief written response',
    defaultData: {
      prompt: '',
      sample_answer: '',
      teacher_script: '',
      explanation: '',
      keywords: []
    }
  },
  speaking: {
    label: 'Speaking',
    description: 'A prompt that requires a spoken response',
    defaultData: {
      prompt: '',
      sample_answer: '',
      teacher_script: '',
      audioPrompt: '',
      pronunciation: ''
    }
  },
  listening: {
    label: 'Listening',
    description: 'An audio-based question that tests listening comprehension',
    defaultData: {
      prompt: '',
      audioContent: '',
      transcript: '',
      teacher_script: '',
      comprehensionQuestions: []
    }
  },
  listenAndRepeat: {
    label: 'Listen and Repeat',
    description: 'An exercise where students listen to and repeat audio',
    defaultData: {
      prompt: '',
      audioContent: '',
      targetPhrase: '',
      teacher_script: '',
      pronunciation: ''
    }
  }
} as const;

export type QuestionType = keyof typeof QUESTION_TYPES;

export const isQuestionType = (type: string): type is QuestionType => {
  return type in QUESTION_TYPES;
};

export const getQuestionTypeFields = (type: string) => {
  switch (type) {
    case 'multipleChoice':
      return {
        required: ['prompt', 'options', 'correctAnswer'],
        fields: QUESTION_TYPES.multipleChoice.defaultData
      };
    case 'fillInBlank':
      return {
        required: ['prompt', 'blanks'],
        fields: QUESTION_TYPES.fillInBlank.defaultData
      };
    case 'trueFalse':
      return {
        required: ['prompt', 'correctAnswer'],
        fields: QUESTION_TYPES.trueFalse.defaultData
      };
    case 'matching':
      return {
        required: ['prompt', 'pairs'],
        fields: QUESTION_TYPES.matching.defaultData
      };
    case 'ordering':
      return {
        required: ['prompt', 'items', 'correctOrder'],
        fields: QUESTION_TYPES.ordering.defaultData
      };
    case 'shortAnswer':
      return {
        required: ['prompt', 'sampleAnswer'],
        fields: QUESTION_TYPES.shortAnswer.defaultData
      };
    case 'speaking':
      return {
        required: ['prompt', 'sampleAnswer'],
        fields: QUESTION_TYPES.speaking.defaultData
      };
    case 'listening':
      return {
        required: ['prompt', 'audioContent'],
        fields: QUESTION_TYPES.listening.defaultData
      };
    case 'listenAndRepeat':
      return {
        required: ['prompt', 'audioContent'],
        fields: QUESTION_TYPES.listenAndRepeat.defaultData
      };
    default:
      return {
        required: ['prompt'],
        fields: {
          prompt: '',
          teacher_script: ''
        }
      };
  }
}; 