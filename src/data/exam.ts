import { QuestionType } from "@/app/(protected)/lesson/[lesson]/dumy";

export const lessonData1 = {
  "id": 1,
  "classId": 1,
  "title": "Year-Long English Curriculum for PP1",
  "topic": "Greetings & Introductions, Family, Everyday Activities, Animals, Colors, Shapes, Numbers, and More",
  "duration": 60,
  "lessonNumber": "1",
  "totalTopics": "12",
  "difficulty": "Beginner",
  "color": "bg-blue-500",
  "unlocked": true,
  "completed": false,
  "subLessons": [
    {
      "id": 101,
      "unlocked": true,
      "completed": true,
      "type": "Speaking Practice",
      "title": "Saying 'Hello' and 'Goodbye'",
      "questions": [
        {
          "id": 1001,
          "type": "speaking",
          "prompt": "Say 'Hello' to someone.",
          "sampleAnswer": "Hello! How are you?",
          "teacherScript": "Hello, children! How are you today? I am so happy to see all of you! Today, we are going to learn how to say 'Hello' and 'Goodbye' in English! Ready? Let's go!"
        },
        {
          "id": 1002,
          "type": "speaking",
          "prompt": "Say 'Goodbye' to someone.",
          "sampleAnswer": "Goodbye! See you later!",
          "teacherScript": "Now, when you leave someone, you say: 'GOODBYE!' Can you say it with me? Let's say: 'GOODBYE!' Well done!"
        }
      ]
    },
    {
      "id": 102,
      "unlocked": true,
      "completed": true,
      "type": "Speaking Practice",
      "title": "Asking 'How Are You?'",
      "questions": [
        {
          "id": 1003,
          "type": "speaking",
          "prompt": "Ask 'How are you?' to a friend.",
          "sampleAnswer": "How are you?",
          "teacherScript": "Now, let's learn how to ask someone, 'How are you?' in English! When you meet someone, you can say: 'How are YOU?' Can you say it with me?"
        },
        {
          "id": 1004,
          "type": "speaking",
          "prompt": "Respond to 'How are you?'",
          "sampleAnswer": "I'm good, thank you!",
          "teacherScript": "Now, let's answer! You can say: 'I'm good!' Or: 'I'm happy!' Let's try it together!"
        }
      ]
    },
    {
      "id": 103,
      "unlocked": true,
      "completed": true,
      "type": "Vocabulary",
      "title": "Talking About Family",
      "questions": [
        {
          "id": 1005,
          "type": "vocabulary_word_list",
          "teacherScript": "Today, we are going to talk about our families! Family is very important. Let's learn the words for family in English.",
          "wordList": [
            {
              "id": 2001,
              "term": "Mother",
              "definition": "A female parent",
              "correctPronunciation": "MUH-thur",
              "phoneticGuide": "ˈmʌðər",
              "pronunciationNotes": "Stress on the first syllable."
            },
            {
              "id": 2002,
              "term": "Father",
              "definition": "A male parent",
              "correctPronunciation": "FAH-thur",
              "phoneticGuide": "ˈfɑːðər",
              "pronunciationNotes": "Stress on the first syllable."
            },
            {
              "id": 2003,
              "term": "Brother",
              "definition": "A male sibling",
              "correctPronunciation": "BRUH-thur",
              "phoneticGuide": "ˈbrʌðər",
              "pronunciationNotes": "Stress on the first syllable."
            },
            {
              "id": 2004,
              "term": "Sister",
              "definition": "A female sibling",
              "correctPronunciation": "SIS-tur",
              "phoneticGuide": "ˈsɪstər",
              "pronunciationNotes": "Stress on the first syllable."
            }
          ]
        }
      ]
    },
    {
      "id": 104,
      "unlocked": true,
      "completed": true,
      "type": "Speaking Practice",
      "title": "Talking About Friends",
      "questions": [
        {
          "id": 1006,
          "type": "speaking",
          "prompt": "Talk about your friend.",
          "sampleAnswer": "My friend is Sarah. She is kind and fun!",
          "teacherScript": "Now, let's talk about friends! Do you have friends? I'm sure you do! In English, we say: 'My friend is [name].' Can you say that with me?"
        }
      ]
    },
    {
      "id": 105,
      "unlocked": true,
      "completed": true,
      "type": "Sentence Formation",
      "title": "Everyday Activities",
      "questions": [
        {
          "id": 1007,
          "type": "sentence_transformation",
          "prompt": "Make a sentence: 'eat lunch' in the present tense.",
          "originalSentence": "I [eat] lunch every day.",
          "correctAnswer": "I eat lunch every day.",
          "teacherScript": "Let's talk about what we do every day. Ready? In English, we say: 'I eat lunch.' Can you say that with me?"
        },
        {
          "id": 1008,
          "type": "sentence_transformation",
          "prompt": "Make a sentence: 'play with toys' in the present tense.",
          "originalSentence": "I [play] with toys.",
          "correctAnswer": "I play with toys.",
          "teacherScript": "Now let's try another one! We say: 'I play with toys.' Can you say that?"
        }
      ]
    },
    {
      "id": 106,
      "unlocked": true,
      "completed": true,
      "type": "Vocabulary",
      "title": "Animals We Know",
      "questions": [
        {
          "id": 1009,
          "type": "vocabulary_word_list",
          "teacherScript": "Let's learn about animals today! Ready? Here are some animals we know:",
          "wordList": [
            {
              "id": 2005,
              "term": "Cat",
              "definition": "A small domesticated carnivorous mammal",
              "correctPronunciation": "KAT",
              "phoneticGuide": "kæt",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2006,
              "term": "Dog",
              "definition": "A domesticated carnivorous mammal",
              "correctPronunciation": "DAWG",
              "phoneticGuide": "dɔːɡ",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2007,
              "term": "Fish",
              "definition": "A cold-blooded aquatic vertebrate animal",
              "correctPronunciation": "FISH",
              "phoneticGuide": "fɪʃ",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2008,
              "term": "Bird",
              "definition": "A type of vertebrate animal with feathers",
              "correctPronunciation": "BURD",
              "phoneticGuide": "bɜːrd",
              "pronunciationNotes": "Single syllable word"
            }
          ]
        }
      ]
    },
    {
      "id": 107,
      "unlocked": true,
      "completed": true,
      "type": "Vocabulary",
      "title": "Colors and Shapes",
      "questions": [
        {
          "id": 1010,
          "type": "vocabulary_word_list",
          "teacherScript": "Let's talk about colors! Colors are everywhere!",
          "wordList": [
            {
              "id": 2009,
              "term": "Red",
              "definition": "A color that is similar to the color of a rose",
              "correctPronunciation": "RED",
              "phoneticGuide": "rɛd",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2010,
              "term": "Blue",
              "definition": "A color of the sky and sea",
              "correctPronunciation": "BLOO",
              "phoneticGuide": "bluː",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2011,
              "term": "Yellow",
              "definition": "A color like a lemon",
              "correctPronunciation": "YEL-oh",
              "phoneticGuide": "ˈjɛləʊ",
              "pronunciationNotes": "Stress on first syllable"
            },
            {
              "id": 2012,
              "term": "Green",
              "definition": "A color like grass",
              "correctPronunciation": "GREEN",
              "phoneticGuide": "ɡriːn",
              "pronunciationNotes": "Single syllable word"
            }
          ]
        }
      ]
    },
    {
      "id": 108,
      "unlocked": true,
      "completed": true,
      "type": "Vocabulary",
      "title": "Numbers and Counting",
      "questions": [
        {
          "id": 1011,
          "type": "vocabulary_word_list",
          "teacherScript": "Let's count together! Ready?",
          "wordList": [
            {
              "id": 2013,
              "term": "One",
              "definition": "The first number in counting sequence",
              "correctPronunciation": "WUN",
              "phoneticGuide": "wʌn",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2014,
              "term": "Two",
              "definition": "The second number in counting sequence",
              "correctPronunciation": "TOO",
              "phoneticGuide": "tuː",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2015,
              "term": "Three",
              "definition": "The third number in counting sequence",
              "correctPronunciation": "THREE",
              "phoneticGuide": "θriː",
              "pronunciationNotes": "Single syllable word"
            }
          ]
        }
      ]
    },
    {
      "id": 109,
      "unlocked": true,
      "completed": true,
      "type": "Vocabulary",
      "title": "Things Around Us",
      "questions": [
        {
          "id": 1012,
          "type": "vocabulary_word_list",
          "teacherScript": "Today, we're going to talk about things we see at home and school!",
          "wordList": [
            {
              "id": 2016,
              "term": "Bed",
              "definition": "A piece of furniture for sleeping",
              "correctPronunciation": "BED",
              "phoneticGuide": "bɛd",
              "pronunciationNotes": "Single syllable word"
            },
            {
              "id": 2017,
              "term": "Table",
              "definition": "A piece of furniture with a flat top",
              "correctPronunciation": "TAY-buhl",
              "phoneticGuide": "ˈteɪbəl",
              "pronunciationNotes": "Two syllables"
            },
            {
              "id": 2018,
              "term": "Chair",
              "definition": "A piece of furniture for sitting",
              "correctPronunciation": "CHAIR",
              "phoneticGuide": "tʃɛər",
              "pronunciationNotes": "Single syllable word"
            }
          ]
        }
      ]
    },
    {
      "id": 110,
      "unlocked": true,
      "completed": true,
      "type": "Vocabulary",
      "title": "Food and Drink",
      "questions": [
        {
          "id": 1013,
          "type": "vocabulary_word_list",
          "teacherScript": "Yum, yum! Today we're going to learn about food!",
          "wordList": [
            {
              "id": 2019,
              "term": "Apple",
              "definition": "A round fruit that can be red or green",
              "correctPronunciation": "AP-puhl",
              "phoneticGuide": "ˈæpəl",
              "pronunciationNotes": "Two syllables"
            },
            {
              "id": 2020,
              "term": "Banana",
              "definition": "A long yellow fruit",
              "correctPronunciation": "buh-NA-nuh",
              "phoneticGuide": "bəˈnɑːnə",
              "pronunciationNotes": "Three syllables"
            },
            {
              "id": 2021,
              "term": "Rice",
              "definition": "Small white grains we eat",
              "correctPronunciation": "RAIS",
              "phoneticGuide": "raɪs",
              "pronunciationNotes": "Single syllable word"
            }
          ]
        }
      ]
    },
    {
      "id": 111,
      "unlocked": true,
      "completed": true,
      "type": "Speaking Practice",
      "title": "Simple Actions",
      "questions": [
        {
          "id": 1014,
          "type": "speaking",
          "prompt": "Say what you can do.",
          "sampleAnswer": "I can run fast.",
          "teacherScript": "Let's talk about things we can do! There are many fun actions we can practice."
        },
        {
          "id": 1015,
          "type": "speaking",
          "prompt": "Describe how you do an action.",
          "sampleAnswer": "I jump high.",
          "teacherScript": "Excellent! Now, let's describe how we do these actions."
        }
      ]
    },
  ]
  }

export const lessonData = {
  id: 1,
  title: "Comprehensive English Language Practice",
  exercises: [
    {
      title: "Code Review Communication",
      type: "speaking_practice",
      questions: [
        {
          type: "vocabulary_word_list",
          wordList: [
            {
              term: 'repository',
              definition: 'A storage location for code and version control',
              correctPronunciation: 'ri-POZ-i-tree',
              phoneticGuide: 'rɪˈpɒzɪtri',
              pronunciationNotes: "In British English: 'poz' sounds like 'positive', stress on 'POZ'"
            },
            {
              term: 'deployment',
              definition: 'The process of making code live in production',
              correctPronunciation: 'dee-PLOY-ment',
              phoneticGuide: 'dɪˈplɔɪmənt',
              pronunciationNotes: "British: clear 'dee' sound, not 'duh', stress on 'PLOY'"
            },
            {
              term: 'parameter',
              definition: 'A variable passed to a function',
              correctPronunciation: 'puh-RAM-i-tuh',
              phoneticGuide: 'pəˈræmɪtə',
              pronunciationNotes: "British: ends with 'tuh', not 'ter', stress on 'RAM'"
            },
            {
              term: 'middleware',
              definition: 'Software that acts as a bridge between systems',
              correctPronunciation: 'MID-dl-weh',
              phoneticGuide: 'ˈmɪdlweə',
              pronunciationNotes: "British: 'weh' like in 'where', stress on 'MID'"
            }
          ]
        }
      ]
    },
    {
      title: "Architecture Discussion",
      type: "speaking_practice",
      questions: [
        {
          type: "vocabulary_word_list",
          wordList: [
            {
              term: 'microservices',
              definition: 'An architectural style structuring an application as services',
              correctPronunciation: 'MAI-kroh-ser-vi-siz',
              phoneticGuide: 'ˈmaɪkrəʊˌsɜːvɪsɪz',
              pronunciationNotes: "British: 'ser' as in 'serve', clear 'i' in 'siz', stress on 'MAI'"
            },
            {
              term: 'infrastructure',
              definition: 'The foundational elements of a system',
              correctPronunciation: 'in-fruh-STRUK-chuh',
              phoneticGuide: 'ˌɪnfrəˈstrʌktʃə',
              pronunciationNotes: "British: ends with 'chuh', not 'chure', stress on 'STRUK'"
            },
            {
              term: 'configuration',
              definition: 'The arrangement of system settings',
              correctPronunciation: 'kun-fig-yuh-RAY-shun',
              phoneticGuide: 'kənˌfɪɡjəˈreɪʃn',
              pronunciationNotes: "British: 'fig' like in 'figure', stress on 'RAY'"
            }
          ]
        }
      ]
    },
    {
      title: "Development Workflow",
      type: "speaking_practice",
      questions: [
        {
          type: "vocabulary_word_list",
          wordList: [
            {
              term: 'debugging',
              definition: 'The process of finding and fixing code issues',
              correctPronunciation: 'dee-BUG-ing',
              phoneticGuide: 'diːˈbʌɡɪŋ',
              pronunciationNotes: "British: clear 'dee' sound, strong 'g' at end, stress on 'BUG'"
            },
            {
              term: 'iteration',
              definition: 'A single development cycle',
              correctPronunciation: 'it-uh-RAY-shun',
              phoneticGuide: 'ɪtəˈreɪʃn',
              pronunciationNotes: "British: 'it' as in 'hit', stress on 'RAY'"
            },
            {
              term: 'compilation',
              definition: 'The process of converting code to executable form',
              correctPronunciation: 'kom-pai-LAY-shun',
              phoneticGuide: 'kɒmpɪˈleɪʃn',
              pronunciationNotes: "British: 'kom' like in 'common', stress on 'LAY'"
            }
          ]
        }
      ]
    },
    {
      title: "Testing Terminology",
      type: "speaking_practice",
      questions: [
        {
          type: "vocabulary_word_list",
          wordList: [
            {
              term: 'asynchronous',
              definition: 'Operations that occur independently of main program flow',
              correctPronunciation: 'ay-SIN-kruh-nus',
              phoneticGuide: 'eɪˈsɪŋkrənəs',
              pronunciationNotes: "British: 'ay' as in 'day', stress on 'SIN'"
            },
            {
              term: 'recursion',
              definition: 'A function calling itself',
              correctPronunciation: 'ri-KUH-zhun',
              phoneticGuide: 'rɪˈkɜːʒn',
              pronunciationNotes: "British: 'ri' as in 'rich', stress on 'KUH'"
            },
            {
              term: 'exception',
              definition: 'An error that occurs during execution',
              correctPronunciation: 'ik-SEP-shun',
              phoneticGuide: 'ɪkˈsepʃn',
              pronunciationNotes: "British: 'ik' as in 'tick', stress on 'SEP'"
            }
          ]
        }
      ]
    },
    {
      title: "Database Concepts",
      type: "speaking_practice",
      questions: [
        {
          type: "vocabulary_word_list",
          wordList: [
            {
              term: 'query',
              definition: 'A request for data from a database',
              correctPronunciation: 'KWEE-ree',
              phoneticGuide: 'ˈkwɪəri',
              pronunciationNotes: "British: 'kwee' clear and crisp, stress on first syllable"
            },
            {
              term: 'schema',
              definition: 'The structure of a database',
              correctPronunciation: 'SKEE-muh',
              phoneticGuide: 'ˈskiːmə',
              pronunciationNotes: "British: 'muh' soft ending, stress on 'SKEE'"
            },
            {
              term: 'indexing',
              definition: 'Creating data structures to improve database performance',
              correctPronunciation: 'IN-dek-sing',
              phoneticGuide: 'ˈɪndeksɪŋ',
              pronunciationNotes: "British: clear 'ing' ending, stress on 'IN'"
            }
          ]
        },
        {
          title: "Team Leadership Phrases",
          type: "speaking_practice",
          questions: [
            {
              type: "vocabulary_word_list",
              wordList: [
                {
                  term: 'stakeholder alignment',
                  definition: 'Ensuring all parties agree on project direction and goals',
                  correctPronunciation: 'STAYK-hol-duh uh-LAIN-muhnt',
                  phoneticGuide: 'ˈsteɪkhəʊldə əˈlaɪnmənt',
                  pronunciationNotes: "British: 'hold' becomes 'hol-duh', stress on 'STAYK' and 'LAIN'",
                  commonPhrases: [
                    "Let's ensure stakeholder alignment before proceeding",
                    "We need stakeholder alignment on this initiative",
                    "I'll facilitate stakeholder alignment meetings"
                  ]
                },
                {
                  term: 'strategic initiative',
                  definition: 'A planned project or effort aligned with company goals',
                  correctPronunciation: 'struh-TEE-jik i-NISH-uh-tiv',
                  phoneticGuide: 'strəˈtiːdʒɪk ɪˈnɪʃətɪv',
                  pronunciationNotes: "British: 'tiv' soft ending, not 'tive', stress on 'TEE' and 'NISH'",
                  commonPhrases: [
                    "This is a key strategic initiative for Q3",
                    "We're prioritizing strategic initiatives",
                    "Let's align our strategic initiatives"
                  ]
                },
                {
                  term: 'governance',
                  definition: 'Framework for decision-making and oversight',
                  correctPronunciation: 'GUV-uh-nuns',
                  phoneticGuide: 'ˈɡʌvənəns',
                  pronunciationNotes: "British: 'guv' as in 'love', not 'govern-ance'",
                  commonPhrases: [
                    "We need stronger governance around deployments",
                    "Let's review our governance model",
                    "The governance committee meets weekly"
                  ]
                }
              ]
            },
            {
              type: "situational_speaking",
              scenarios: [
                {
                  context: "Leading a Team Meeting",
                  keyPhrases: [
                    {
                      phrase: "Let's discuss our quarterly objectives",
                      pronunciation: "lets dis-KUSS our KWAW-tuh-lee ob-JEK-tivz",
                      notes: "British: 'quarterly' becomes 'KWAW-tuh-lee', crisp 't' sounds"
                    },
                    {
                      phrase: "I'd like your input on this approach",
                      pronunciation: "ayd laik yaw in-PUT on this uh-PROCH",
                      notes: "British: 'approach' becomes 'uh-PROCH', softer 'r' sound"
                    },
                    {
                      phrase: "We should prioritize our resources",
                      pronunciation: "we shud prai-OR-i-taiz our REE-saw-siz",
                      notes: "British: 'resources' becomes 'REE-saw-siz', stress on 'OR'"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Conflict Resolution and Feedback",
          type: "speaking_practice",
          questions: [
            {
              type: "vocabulary_word_list",
              wordList: [
                {
                  term: 'constructive feedback',
                  definition: 'Helpful and specific suggestions for improvement',
                  correctPronunciation: 'kun-STRUK-tiv FEED-bak',
                  phoneticGuide: 'kənˈstrʌktɪv ˈfiːdbæk',
                  pronunciationNotes: "British: 'con' becomes 'kun', clear 't' in 'tiv'",
                  commonPhrases: [
                    "I'd like to offer some constructive feedback",
                    "Let's focus on constructive feedback",
                    "This feedback is meant to be constructive"
                  ]
                },
                {
                  term: 'perspective',
                  definition: 'A particular way of viewing something',
                  correctPronunciation: 'puh-SPEK-tiv',
                  phoneticGuide: 'pəˈspektɪv',
                  pronunciationNotes: "British: 'per' becomes 'puh', stress on 'SPEK'",
                  commonPhrases: [
                    "From my perspective, we should consider...",
                    "That's an interesting perspective",
                    "Let's consider different perspectives"
                  ]
                }
              ]
            },
            {
              type: "difficult_conversations",
              scenarios: [
                {
                  context: "Addressing Poor Performance",
                  keyPhrases: [
                    {
                      phrase: "I've noticed some areas for improvement",
                      pronunciation: "aiv NO-tisd sum AIR-ee-uz for im-PROOV-muhnt",
                      notes: "British: 'noticed' with clear 't', 'improvement' ends soft"
                    },
                    {
                      phrase: "Let's discuss how we can support you",
                      pronunciation: "lets dis-KUSS how we kun suh-PAWT you",
                      notes: "British: 'support' becomes 'suh-PAWT', softer 'r'"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Strategic Communication",
          type: "speaking_practice",
          questions: [
            {
              type: "presentation_phrases",
              wordList: [
                {
                  term: 'quarterly forecast',
                  definition: 'Prediction of business results for the next three months',
                  correctPronunciation: 'KWAW-tuh-lee FAW-karst',
                  phoneticGuide: 'ˈkwɔːtəli ˈfɔːkɑːst',
                  pronunciationNotes: "British: 'forecast' becomes 'FAW-karst', clear 't' ending",
                  commonPhrases: [
                    "According to our quarterly forecast...",
                    "The quarterly forecast shows positive trends",
                    "We're revising the quarterly forecast"
                  ]
                },
                {
                  term: 'resource allocation',
                  definition: 'Distribution of available resources across projects',
                  correctPronunciation: 'REE-saw-s al-oh-KAY-shun',
                  phoneticGuide: 'ˈriːsɔːs æləˈkeɪʃn',
                  pronunciationNotes: "British: 'resource' becomes 'REE-saw-s', stress on 'KAY'",
                  commonPhrases: [
                    "We need to optimize resource allocation",
                    "Current resource allocation isn't sustainable",
                    "Let's review our resource allocation strategy"
                  ]
                }
              ]
            },
            {
              type: "executive_communication",
              scenarios: [
                {
                  context: "Board Meeting Presentation",
                  keyPhrases: [
                    {
                      phrase: "Our key performance indicators show",
                      pronunciation: "our kee puh-FAW-muhns IN-di-kay-tuhz show",
                      notes: "British: 'performance' becomes 'puh-FAW-muhns', crisp 'k' sounds"
                    },
                    {
                      phrase: "We've identified several opportunities",
                      pronunciation: "weev ai-DEN-ti-faid SEV-rul op-uh-CHEW-ni-tees",
                      notes: "British: 'opportunities' becomes 'op-uh-CHEW-ni-tees'"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Technical Vision Communication",
          type: "speaking_practice",
          questions: [
            {
              type: "vocabulary_word_list",
              wordList: [
                {
                  term: 'architectural vision',
                  definition: 'Long-term technical direction and goals',
                  correctPronunciation: 'ah-ki-TEK-chuh-rul VI-zhun',
                  phoneticGuide: 'ɑːkɪˈtektʃərəl ˈvɪʒn',
                  pronunciationNotes: "British: 'tectural' becomes 'TEK-chuh-rul', soft ending",
                  commonPhrases: [
                    "Our architectural vision aligns with business goals",
                    "Let me outline our architectural vision",
                    "The architectural vision supports scalability"
                  ]
                },
                {
                  term: 'innovation pipeline',
                  definition: 'Flow of new ideas and technological improvements',
                  correctPronunciation: 'in-oh-VAY-shun PAIP-lain',
                  phoneticGuide: 'ɪnəˈveɪʃn ˈpaɪplaɪn',
                  pronunciationNotes: "British: clear 'VAY' sound, stress on 'PAIP'",
                  commonPhrases: [
                    "We're strengthening our innovation pipeline",
                    "The innovation pipeline shows promising results",
                    "Let's review the innovation pipeline"
                  ]
                }
              ]
            }
          ]
        }
      ],
    },
        {
          title: "Meeting Opening Statements",
          type: "speaking_practice",
          subTitle: "How to Command Attention from the Start",
          questions: [
            {
              type: "vocabulary_word_list",
              context: "Opening Phrases That Command Attention",
              wordList: [
                {
                  term: "I'd like to highlight something critical",
                  definition: 'Opening statement to grab attention for important points',
                  correctPronunciation: "ayd laik tu HAI-lait sum-thing KRIT-i-kul",
                  phoneticGuide: "aɪd laɪk tu ˈhaɪlaɪt ˈsʌmθɪŋ ˈkrɪtɪkl",
                  impactNotes: "Speak slightly slower than usual, lower pitch at 'critical'",
                  bodyLanguage: "Stand straight, open posture, direct eye contact",
                  usage: "Use within first 30 seconds of your speaking turn"
                },
                {
                  term: "There's a compelling reason why",
                  definition: 'Phrase to build anticipation and interest',
                  correctPronunciation: "thehs uh kum-PEL-ing REE-zun wai",
                  phoneticGuide: "ðeəz ə kəmˈpelɪŋ ˈriːzn waɪ",
                  impactNotes: "Emphasize 'compelling', slight pause after 'reason'",
                  bodyLanguage: "Lean slightly forward, use hand gesture for emphasis",
                  usage: "Use when introducing new ideas or proposals"
                },
                {
                  term: "This directly impacts our objectives",
                  definition: 'Phrase connecting topic to business goals',
                  correctPronunciation: "this dai-REKT-lee im-PAKTS our ob-JEK-tivz",
                  phoneticGuide: "ðɪs daɪˈrektli ɪmˈpækts ɑː əbˈdʒektɪvz",
                  impactNotes: "Strong emphasis on 'directly', clear articulation of 'impacts'",
                  bodyLanguage: "Use deliberate hand movement to show impact",
                  usage: "Use when relating topic to business value"
                }
              ]
            },
            {
              type: "attention_grabbing_techniques",
              techniques: [
                {
                  name: "The Pattern Interrupt",
                  description: "Change your speaking pattern to grab attention",
                  examples: [
                    {
                      phrase: "Let me pause here for a moment",
                      pronunciation: "let mee PAWZ heh for uh MOH-muhnt",
                      execution: "Speak normally, then deliberately pause for 2 seconds",
                      impact: "Creates anticipation and regains wandering attention"
                    },
                    {
                      phrase: "This is particularly interesting",
                      pronunciation: "this iz puh-TIK-yuh-lee IN-tres-ting",
                      execution: "Lower your voice, lean forward slightly",
                      impact: "Signals important information is coming"
                    }
                  ]
                },
                {
                  name: "The Power Question",
                  description: "Use thought-provoking questions to engage",
                  examples: [
                    {
                      phrase: "Have you ever wondered why we always...?",
                      pronunciation: "hav yoo EV-uh WUN-duhd wai we AWL-ways",
                      execution: "Raise pitch slightly at end, scan room while asking",
                      impact: "Engages critical thinking and participation"
                    },
                    {
                      phrase: "What if we looked at this differently?",
                      pronunciation: "wot if we LUKT at this DIF-runt-lee",
                      execution: "Use hand gesture to indicate alternative perspective",
                      impact: "Opens minds to new possibilities"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Maintaining Engagement",
          type: "speaking_practice",
          questions: [
            {
              type: "engagement_techniques",
              techniques: [
                {
                  name: "The Bridge",
                  description: "Connecting points to listener interests",
                  examples: [
                    {
                      phrase: "This is especially relevant to what [name] mentioned earlier",
                      pronunciation: "this iz es-PESH-uh-lee REL-uh-vunt tu wot [name] MEN-shund ER-lee-uh",
                      execution: "Make eye contact with the person referenced",
                      impact: "Creates personal connection and relevance"
                    }
                  ]
                },
                {
                  name: "The Story Hook",
                  description: "Using brief narratives to illustrate points",
                  examples: [
                    {
                      phrase: "Let me share a quick example that illustrates this",
                      pronunciation: "let mee sheh a kwik eg-ZAM-pul that IL-us-trayts this",
                      execution: "Slight pause after 'share', maintain eye contact",
                      impact: "Captures attention through storytelling"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          title: "Assertive Contributions",
          type: "speaking_practice",
          questions: [
            {
              type: "vocabulary_word_list",
              wordList: [
                {
                  term: "If I may build on that point",
                  definition: 'Polite but assertive way to add to discussion',
                  correctPronunciation: "if ai may BILD on that point",
                  phoneticGuide: "ɪf aɪ meɪ bɪld ɒn ðæt pɔɪnt",
                  impactNotes: "Confident tone, slight emphasis on 'build'",
                  bodyLanguage: "Sit up straight, lean slightly forward",
                  usage: "Use when adding to others' points"
                },
                {
                  term: "I'd like to offer a different perspective",
                  definition: 'Respectful way to present alternative views',
                  correctPronunciation: "ayd laik tu OF-fer a DIF-runt puh-SPEK-tiv",
                  phoneticGuide: "aɪd laɪk tu ˈɒfər ə ˈdɪfrənt pəˈspektɪv",
                  impactNotes: "Maintain warm but confident tone",
                  bodyLanguage: "Open palm gesture while speaking",
                  usage: "Use when presenting alternative viewpoints"
                }
              ]
            }
          ]
        },
        {
          title: "Voice and Delivery Techniques",
          type: "speaking_practice",
          questions: [
            {
              type: "voice_modulation",
              techniques: [
                {
                  name: "The Power Pause",
                  description: "Strategic use of silence",
                  execution: "Make a point, pause for 2-3 seconds, then continue",
                  impact: "Creates emphasis and allows point to sink in"
                },
                {
                  name: "Dynamic Range",
                  description: "Varying voice volume and pace",
                  execution: "Start softly, build volume for key points",
                  impact: "Maintains attention through vocal variety"
                },
                {
                  name: "The Emphasis Pattern",
                  description: "Stressing key words in sentences",
                  example: "This is CRUCIAL for our SUCCESS",
                  impact: "Highlights important information"
                }
              ]
            }
          ]
        },
        {
          title: "Non-Verbal Impact",
          type: "body_language",
          questions: [
            {
              type: "posture_and_gestures",
              techniques: [
                {
                  name: "The Power Pose",
                  description: "Confident, open posture",
                  execution: "Shoulders back, chest open, head high",
                  impact: "Projects confidence and authority"
                },
                {
                  name: "Hand Gestures",
                  description: "Strategic use of hand movements",
                  examples: [
                    {
                      gesture: "Open palm",
                      usage: "When presenting ideas",
                      impact: "Shows openness and honesty"
                    },
                    {
                      gesture: "Precision grip",
                      usage: "When making precise points",
                      impact: "Indicates exactness and detail"
                    }
                  ]
                }
              ]
            }
          ],
        },
    {
      title: "Business Vocabulary Practice",
      type: "vocabulary_word_list",
      questions: [
        {
          type: "vocabulary_word_list",
          wordList: [
            {
              term: 'accomplish',
              definition: 'To succeed in doing something; to complete successfully',
              correctPronunciation: 'uh-KOM-plish'
            },
            {
              term: 'deadline',
              definition: 'A date or time by which something must be completed',
              correctPronunciation: 'DED-line'
            },
            {
              term: 'negotiate',
              definition: 'To discuss something to reach an agreement',
              correctPronunciation: 'neh-GOH-shee-ate'
            },
            {
              term: 'collaborate',
              definition: 'To work jointly with others',
              correctPronunciation: 'kuh-LAB-uh-rate'
            }
          ]           
        }
      ]
    },
    {
      "title": "Police Officer Role Play - LKG Level",
      "type": "vocabulary_word_list",
      "questions": [
        {
          "type": "vocabulary_word_list",
          "wordList": [
            {
              "term": "HI I am police officer",
              "definition": "Opening introduction with salute",
              "correctPronunciation": "heh-loh! ay am oh-fi-ser snig-dha"
            },
            {
              "term": "I am your friend in police dress!",
              "definition": "Friendly introduction pointing to uniform",
              "correctPronunciation": "ay am yoor frend in po-lees dress"
            },
            {
              "term": "I keep all children safe!",
              "definition": "Stand tall and proud while speaking",
              "correctPronunciation": "ay keep awl chil-dren sayf"
            },
            {
              "term": "Stop at red light!",
              "definition": "Hold hand up to show stop sign",
              "correctPronunciation": "stop at red layt"
            },
            {
              "term": "Go at green light!",
              "definition": "Point forward while speaking",
              "correctPronunciation": "go at green layt"
            },
            {
              "term": "Always wear your seat belt!",
              "definition": "Pretend to pull seat belt action",
              "correctPronunciation": "awl-ways wear yor seet belt"
            },
            {
              "term": "Cross road at zebra lines!",
              "definition": "Make walking motion while speaking",
              "correctPronunciation": "cross rohd at zee-bra layns"
            },
            {
              "term": "Say no to bad people!",
              "definition": "Shake head no while speaking",
              "correctPronunciation": "say noh to bad pee-pul"
            },
            {
              "term": "Call police at 100!",
              "definition": "Make phone call gesture",
              "correctPronunciation": "kawl po-lees at won hun-dred"
            },
            {
              "term": "Thank you! Be safe!",
              "definition": "Final line with smart salute",
              "correctPronunciation": "thank yoo! bee sayf"
            }
          ]
        }
      ]
    },
    {
      id: 1,
      title: "Basic Speaking and Sentence Transformation",
      questions: [
        {
          type: "speaking",
          prompt: "Introduce yourself and mention one hobby you enjoy.",
          sampleAnswer: "Hello, my name is John. I enjoy playing tennis in my free time.",
        },
        {
          type: "sentence_transformation",
          prompt: "Transform this sentence into past tense: 'I go to the gym every day.'",
          originalSentence: "I go to the gym every day.",
          correctAnswer: "I went to the gym every day.",
        },
      ],
    },
    {
      id: 2,
      title: "Vocabulary, Actions, and Idioms",
      questions: [
        {
          id: 1,
          type: "vocabulary_practice",
          word: "Cat",
          definition: "A small furry animal that people often keep as a pet.",
          inSentence: "The cat meowed softly as it curled up on the sofa.",
          prompt: "Can you say the word 'cat' and point to a picture of one?",
        },
        {
          id: 2,
          type: "vocabulary_practice",
          word: "Ball",
          definition: "A round object that you can throw, kick, or bounce.",
          inSentence: "The children played with a colorful ball in the park.",
          prompt: "Can you show me how you would throw a ball?",
        },
        // ... (other vocabulary questions)
        {
          type: "vocabulary_practice",
          word: "Ubiquitous",
          definition: "Present, appearing, or found everywhere.",
          inSentence: "Smartphones have become ubiquitous in modern society.",
          prompt: "Use the word 'ubiquitous' in a sentence about technology.",
        },
        {
          type: "vocabulary_practice",
          word: "Enigmatic",
          definition: "Difficult to interpret or understand; mysterious.",
          inSentence: "The enigmatic smile of the Mona Lisa has puzzled art enthusiasts for centuries.",
          prompt: "Describe something or someone enigmatic that you've encountered.",
        },
        {
          type: "idiom_practice",
          idiom: "Break the ice",
          meaning: "To do or say something to relieve tension or get conversation going in a strained situation or when strangers meet.",
          inSentence: "The host told a joke to break the ice at the beginning of the party.",
          prompt: "Describe a situation where you had to 'break the ice' and what you did.",
        },
      ],
    },
    {
      id: 3,
      title: "Spelling and Grammar",
      questions: [
        {
          type: "spelling",
          prompt: "Spell the word 'necessary' out loud.",
          word: "necessary",
          usage: "It is necessary to practice regularly to improve your skills.",
        },
        {
          type: "grammar_speaking",
          prompt: "Create a sentence using the present perfect tense with the verb 'to travel'.",
          sampleAnswer: "I have traveled to three different countries this year.",
        },
      ],
    },
    {
      id: 4,
      title: "Visual and Auditory Comprehension",
      questions: [
        {
          type: "look_and_speak",
          prompt: "Look at the image and describe what you see in detail.",
          imageUrl: "https://plus.unsplash.com/premium_photo-1683167306200-07261e75e569?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          sampleAnswer: "I see a busy city street with tall buildings on both sides. There are cars and buses on the road, and many people walking on the sidewalks. In the distance, I can see a park with trees and a fountain.",
        },
        {
          type: "watch_and_speak",
          prompt: "Watch the video clip and summarize what happened.",
          videoUrl: "/videos/cooking_demonstration.mp4",
          sampleAnswer: "The video shows a chef demonstrating how to make pasta from scratch. They mix flour and eggs, knead the dough, roll it out, and then cut it into long strips. Finally, they cook the pasta in boiling water and serve it with a tomato sauce.",
        },
      ],
    },
    {
      id: 5,
      title: "Complex Speaking and Grammar",
      questions: [
        {
          type: "multiStepSpeaking",
          steps: [
            {
              type: "repeat",
              prompt: "Listen and repeat: Hello, how are you doing today?",
              content: "Hello, how are you doing today?",
              correctAnswer: "Hello, how are you doing today?",
            },
            {
              type: "speaking",
              prompt: "Now, respond to this greeting with your own words.",
              sampleAnswer: "I'm doing well, thank you. How about you?",
            },
            {
              type: "speaking",
              prompt: "Describe your mood today using at least two sentences.",
              sampleAnswer: "I'm feeling quite energetic and positive today. The nice weather has really lifted my spirits.",
            },
          ],
          overallFeedback: "Remember to use a variety of expressions to describe your feelings and maintain a natural conversation flow.",
        },
        {
          type: "grammar_speaking",
          prompt: "Create a sentence using the third conditional.",
          rule: "The third conditional is used to talk about imaginary situations in the past.",
          example: "If I had studied harder, I would have passed the exam.",
          sampleAnswer: "If I had woken up earlier, I would have caught the train.",
        },
      ],
    },
    {
      id: 6,
      title: "Debate and Opinion",
      questions: [
        {
          type: "opinion",
          prompt: "Do you think social media has more positive or negative effects on society? Explain your viewpoint.",
          sampleAnswer: "I believe social media has both positive and negative effects, but overall, its negative impact outweighs the positive. While it allows for global connectivity and instant communication, it also contributes to privacy concerns, mental health issues, and the spread of misinformation.",
        },
        {
          type: "debate",
          prompt: "Some people argue that artificial intelligence will eventually replace human workers in many industries. Do you agree or disagree? Provide arguments to support your view.",
          sampleAnswer: "While I agree that AI will significantly change the job market, I don't believe it will entirely replace human workers. AI can automate repetitive tasks and improve efficiency, but human creativity, emotional intelligence, and complex decision-making skills are still invaluable in many fields. Instead, I think AI will create new job opportunities and change the nature of existing ones, requiring humans to adapt and develop new skills.",
        },
      ],
    },
    {
      id: 7,
      title: "Integrated Speaking Practice",
      questions: [
        {
          type: "integratedSpeaking",
          setup: {
            type: "reading",
            content: "Read this short passage about climate change:",
            text: "Climate change is one of the most pressing issues of our time. It refers to long-term shifts in temperatures and weather patterns, mainly caused by human activities. The burning of fossil fuels, deforestation, and industrial processes have led to an increase in greenhouse gases in the atmosphere, resulting in global warming.",
          },
          tasks: [
            {
              type: "comprehension",
              prompt: "Summarize the main points of the passage in your own words.",
              sampleAnswer: "The passage discusses climate change as a major current issue. It explains that climate change involves long-term changes in weather and temperature, primarily caused by human activities such as burning fossil fuels and deforestation. These actions increase greenhouse gases, leading to global warming.",
            },
            {
              type: "opinion",
              prompt: "What do you think is the most effective way to address climate change? Why?",
              sampleAnswer: "I believe that transitioning to renewable energy sources like solar and wind power is the most effective way to address climate change. This approach directly tackles the main cause of the problem by reducing greenhouse gas emissions from fossil fuels. Additionally, it can create new jobs and promote sustainable economic growth.",
            },
            {
              type: "hypothetical",
              prompt: "If you were a world leader, what policy would you implement to combat climate change?",
              sampleAnswer: "If I were a world leader, I would implement a carbon pricing policy. This would involve putting a cost on carbon emissions, encouraging businesses and individuals to reduce their carbon footprint. The revenue generated from this policy could be invested in green technologies and infrastructure, further accelerating the transition to a low-carbon economy.",
            },
          ],
          followUp: {
            type: "debate",
            prompt: "Some people argue that individual actions are insignificant in fighting climate change, and only large-scale government and corporate actions matter. Do you agree or disagree? Provide arguments to support your view.",
            sampleAnswer: "I disagree with the notion that individual actions are insignificant in fighting climate change. While it's true that large-scale actions by governments and corporations are crucial, individual choices collectively can have a substantial impact. When many people adopt environmentally friendly habits like reducing meat consumption, using public transportation, or choosing energy-efficient appliances, it creates a significant cumulative effect. Moreover, individual actions can influence market demands, pushing companies to offer more sustainable products. Lastly, individuals can use their voices and votes to pressure governments and corporations to take stronger action on climate change. Therefore, I believe both individual and large-scale actions are necessary and complementary in addressing this global challenge.",
          },
          overallFeedback: "Remember to structure your responses clearly, use specific examples to support your points, and consider multiple perspectives when discussing complex issues like climate change.",
        },
      ],
    },
    {
      id: 8,
      title: "Cultural Awareness and Global Issues",
      questions: [
        {
          type: "integratedSpeaking",
          setup: {
            type: "reading",
            content: "Read this short passage about cultural diversity:",
            text: "Cultural diversity refers to the variety of human societies or cultures in a specific region, or in the world as a whole. It encompasses the differences in language, religion, cuisine, social habits, music, and arts that exist between different groups of people. In an increasingly globalized world, understanding and appreciating cultural diversity has become more important than ever.",
          },
          tasks: [
            {
              type: "comprehension",
              prompt: "Summarize the main points of the passage in your own words.",
              sampleAnswer: "The passage defines cultural diversity as the variety of human cultures in a region or globally. It includes differences in various aspects of life such as language, religion, food, and social customs. The text emphasizes that in our globalized world, it's becoming increasingly important to understand and appreciate these cultural differences.",
            },
            {
              type: "opinion",
              prompt: "Why do you think understanding cultural diversity is important in today's world?",
              sampleAnswer: "Understanding cultural diversity is crucial in today's world for several reasons. Firstly, it promotes tolerance and reduces prejudice, helping to create a more harmonious global society. Secondly, in the business world, cultural awareness can lead to better international relationships and more successful global ventures. Lastly, exposure to diverse cultures enriches our own lives, broadening our perspectives and encouraging creativity and innovation.",
            },
          ],
          followUp: {
            type: "hypothetical",
            prompt: "Imagine you're organizing a cultural diversity day at your workplace or school. What activities or events would you include and why?",
            sampleAnswer: "For a cultural diversity day, I would organize a series of events to celebrate and learn about different cultures. This could include a food festival featuring cuisines from around the world, workshops on different languages and traditional arts, and panel discussions with people from various cultural backgrounds sharing their experiences. I would also set up booths representing different countries or cultures, where people could learn about traditions, try on traditional clothing, or participate in cultural games. The goal would be to create an immersive experience that encourages interaction and learning, fostering greater understanding and appreciation of cultural diversity.",
          },
        },
      ],
    },
    {
      id: 9,
      title: "Verb Agreement and Tenses",
      questions: [
        {
          type: "repeat",
          prompt: "Listen and repeat: One dog barks.",
          content: "One dog barks.",
          correctAnswer: "One dog barks.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about three dogs.",
          content: "Three dogs bark.",
          correctAnswer: "Three dogs bark.",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: He walks to work.",
          content: "He walks to work.",
          correctAnswer: "He walks to work.",
        },
        {
          type: "multipleChoice",
          prompt: "Does 'He walks to work' tell about today or yesterday?",
          options: ["Today", "Yesterday"],
          correctAnswer: "Today",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about yesterday: He walked to work.",
          content: "He walked to work.",
          correctAnswer: "He walked to work.",
        },
      ],
    },
    {
      id: 10,
      title: "Body Parts and Actions",
      questions: [
        {
          type: "action",
          prompt: "Touch your elbow.",
          correctAction: "Touching elbow",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about what you did.",
          content: "I touched my elbow.",
          correctAnswer: "I touched my elbow.",
        },
        {
          type: "multipleChoice",
          prompt: "Is the elbow part of the arm?",
          options: ["Yes", "No"],
          correctAnswer: "Yes",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about the elbow.",
          content: "The elbow is part of the arm.",
          correctAnswer: "The elbow is part of the arm.",
        },
      ],
    },
    {
      id: 11,
      title: "Pronouns and Sentence Structure",
      questions: [
        {
          type: "multipleChoice",
          prompt: "What is another word for a boy?",
          options: ["She", "It", "He"],
          correctAnswer: "He",
        },
        {
          type: "multipleChoice",
          prompt: "What is another word for a woman?",
          options: ["He", "She", "It"],
          correctAnswer: "She",
        },
        {
          type: "repeat",
          prompt: "Listen: Boys and girls were reading. Say the sentence with another word for boys and girls.",
          content: "They were reading.",
          correctAnswer: "They were reading.",
        },
        {
          type: "repeat",
          prompt: "Listen: You and I are talking. Say the sentence with another word for you and I.",
          content: "We are talking.",
          correctAnswer: "We are talking.",
        },
      ],
    },
    {
      id: 12,
      title: "Furniture and Vocabulary",
      questions: [
        {
          type: "multipleChoice",
          prompt: "What do we call items like chairs, tables, and lamps?",
          options: ["Clothes", "Furniture", "Food"],
          correctAnswer: "Furniture",
        },
        {
          type: "repeat",
          prompt: "Name the furniture items in the top row of the picture.",
          content: "Chair, table, lamp, couch, carpet.",
          correctAnswer: "Chair, table, lamp, couch, carpet.",
        },
        {
          type: "repeat",
          prompt: "Name the furniture items in the bottom row of the picture.",
          content: "Coffee table, dresser, bed, mirror.",
          correctAnswer: "Coffee table, dresser, bed, mirror.",
        },
      ],
    },
    {
      id: 13,
      title: "Comparatives and Opposites",
      questions: [
        {
          type: "repeat",
          prompt: "Listen and repeat: Road A was 30 feet wide.",
          content: "Road A was 30 feet wide.",
          correctAnswer: "Road A was 30 feet wide.",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: Road B was 40 feet wide.",
          content: "Road B was 40 feet wide.",
          correctAnswer: "Road B was 40 feet wide.",
        },
        {
          type: "multipleChoice",
          prompt: "Which road was wider, road A or road B?",
          options: ["Road A", "Road B", "They were the same width"],
          correctAnswer: "Road B",
        },
        {
          type: "repeat",
          prompt: "Say the sentence: Road B was wider than road A.",
          content: "Road B was wider than road A.",
          correctAnswer: "Road B was wider than road A.",
        },
        {
          type: "multipleChoice",
          prompt: "What is the opposite of a tall girl?",
          options: ["A short girl", "A wide girl", "A thin girl"],
          correctAnswer: "A short girl",
        },
      ],
    },
    {
      id: 14,
      title: "Calendar and Time",
      questions: [
        {
          type: "repeat",
          prompt: "Start with Sunday and say the days of the week.",
          content: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
          correctAnswer: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
        },
        {
          type: "multipleChoice",
          prompt: "How many days are in a week?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "7",
        },
        {
          type: "repeat",
          prompt: "Say the sentence: There are seven days in a week.",
          content: "There are seven days in a week.",
          correctAnswer: "There are seven days in a week.",
        },
        {
          type: "multipleChoice",
          prompt: "How many days are in a year?",
          options: ["365", "366", "360", "370"],
          correctAnswer: "365",
        },
        {
          type: "repeat",
          prompt: "Start with January and say the months of the year.",
          content: "January, February, March, April, May, June, July, August, September, October, November, December.",
          correctAnswer: "January, February, March, April, May, June, July, August, September, October, November, December.",
        },
      ],
    },
    {
      id: 15,
      title: "Advanced Vocabulary Practice",
      questions: [
        {
          type: "vocabulary_practice",
          word: "Ambiguous",
          definition: "Open to more than one interpretation; not having one obvious meaning.",
          inSentence: "The politician's statement was ambiguous, leaving room for multiple interpretations.",
          prompt: "Now use 'ambiguous' in your own sentence."
        },
        {
          type: "vocabulary_practice",
          word: "Benevolent",
          definition: "Kind, generous, and caring about other people.",
          inSentence: "The benevolent donor gave millions to charity.",
          prompt: "Now use 'benevolent' in your own sentence."
        },
        {
          type: "vocabulary_practice",
          word: "Ephemeral",
          definition: "Lasting for a very short time.",
          inSentence: "The beauty of cherry blossoms is ephemeral, lasting only a few days each year.",
          prompt: "Use 'ephemeral' in a sentence about a natural phenomenon."
        },
        {
          type: "vocabulary_practice",
          word: "Resilient",
          definition: "Able to withstand or recover quickly from difficult conditions.",
          inSentence: "The resilient community quickly rebuilt after the natural disaster.",
          prompt: "Describe a situation where you or someone you know showed resilience."
        },
      ],
    },
    {
      id: 16,
      title: "Advanced Grammar Practice",
      questions: [
        {
          type: "grammar_speaking",
          rule: "Use 'fewer' for countable nouns and 'less' for uncountable nouns.",
          example: "I have fewer apples than you, but less money.",
          prompt: "Create a sentence using both 'fewer' and 'less'."
        },
        {
          type: "grammar_speaking",
          rule: "In conditional sentences, use 'would have' in the main clause when the if-clause uses the past perfect.",
          example: "If I had studied harder, I would have passed the exam.",
          prompt: "Create a sentence using this conditional structure."
        },
        {
          type: "grammar_speaking",
          prompt: "Create a sentence using the present perfect continuous tense with the verb 'to study'.",
          sampleAnswer: "I have been studying English for five years.",
        },
      ],
    },
    {
      id: 17,
      title: "Idiomatic Expressions",
      questions: [
        {
          type: "idiom_practice",
          idiom: "Break the ice",
          meaning: "To do or say something to relieve tension or get conversation going in a strained situation or when strangers meet.",
          example: "The host told a joke to break the ice at the beginning of the party.",
          prompt: "Now use 'break the ice' in your own sentence."
        },
        {
          type: "idiom_practice",
          idiom: "Cut corners",
          meaning: "To do something in the easiest, cheapest, or fastest way, often by ignoring rules or leaving something out.",
          example: "The company cut corners by using cheaper materials, resulting in a lower quality product.",
          prompt: "Now use 'cut corners' in your own sentence."
        },
        {
          type: "idiom_practice",
          idiom: "Bite off more than you can chew",
          meaning: "To take on a task that is way too big or difficult to accomplish.",
          inSentence: "When Jack volunteered to organize the entire school festival by himself, he quickly realized he had bitten off more than he could chew.",
          prompt: "Describe a situation where you or someone you know 'bit off more than they could chew'.",
        },
      ],
    },
    {
      id: 18,
      title: "Complex Speaking Tasks",
      questions: [
        {
          type: "complexSpeaking",
          mainPrompt: "Describe your ideal vacation.",
          subPrompts: [
            {
              type: "speaking",
              prompt: "Where would you go and why?",
              sampleAnswer: "I would love to visit Japan because I'm fascinated by its unique blend of traditional culture and modern technology.",
            },
            {
              type: "vocabularyInContext",
              prompt: "Use the word 'itinerary' in a sentence about your vacation plans.",
              word: "itinerary",
              definition: "A planned route or journey.",
              sampleUsage: "My itinerary for the trip includes visits to ancient temples and bustling city markets.",
            },
            {
              type: "speaking",
              prompt: "Describe two activities you would do on this vacation.",
              sampleAnswer: "I would participate in a traditional tea ceremony to learn about Japanese customs. I would also visit Mount Fuji to enjoy the breathtaking natural scenery.",
            },
          ],
          overallFeedback: "Try to use specific details and descriptive language to make your vacation plan come alive for the listener.",
        },
      ],
    },
    {
      id: 19,
      title: "Storytelling and Narrative",
      questions: [
        {
          type: "speaking",
          prompt: "Tell a short story about a memorable travel experience you've had or would like to have.",
          sampleAnswer: "Last summer, I had an unforgettable experience backpacking through Southeast Asia. One particular memory stands out: visiting the ancient temples of Angkor Wat in Cambodia. As I watched the sunrise over the majestic ruins, I felt a deep connection to history and a sense of awe at human achievement. The intricate carvings, the massive stone structures, and the lush jungle surroundings created a magical atmosphere that I'll never forget.",
        },
        {
          type: "look_and_speak",
          prompt: "Look at this series of images and tell a story based on what you see.",
          imageUrl: "/images/story_sequence.jpg",
          sampleAnswer: "The images show a young girl finding a lost puppy in the rain. She takes it home, dries it off, and cares for it. Her parents seem hesitant at first, but they eventually agree to keep the puppy. The final image shows the girl and the now-grown dog playing happily in a sunny park, suggesting that several years have passed and they've formed a strong bond.",
        },
      ],
    },
    {
      id: 20,
      title: "Professional Communication",
      questions: [
        {
          type: "speaking",
          prompt: "You're giving a presentation to your colleagues about a new project. Introduce the project and explain its main objectives.",
          sampleAnswer: "Good morning, everyone. Today, I'd like to introduce our new project, 'Green Office Initiative'. The main objectives of this project are to reduce our company's carbon footprint by 30% within the next year, implement sustainable practices in our daily operations, and foster an environmentally conscious culture among our employees. We'll achieve these goals through a series of steps, including...",
        },
        {
          type: "action_and_speaking",
          prompt: "Role-play a job interview. Respond to the question: 'What are your greatest strengths and how do they apply to this position?'",
          action: "Maintain eye contact and use confident body language",
          correctSpeech: "One of my greatest strengths is my ability to work well under pressure. In my previous role as a project manager, I successfully led a team to complete a critical project ahead of schedule, despite numerous challenges. This strength would be particularly valuable in this position, as I understand you often work with tight deadlines and high-stakes projects.",
        },
      ],
    },

    {
      title: "Pronunciation and Fluency",
      questions: [
        {
          type: "phoneme_drill",
          prompt: "Practice the following sounds",
          phoneme: "th",
          words: ["think", "thistle", "thrust", "thrive", "thread"]
        },
        {
          type: "minimal_pair_practice",
          prompt: "Distinguish between these similar sounds",
          pairOne: "ship",
          pairTwo: "sheep"
        },
        {
          type: "stress_and_intonation",
          prompt: "Practice the correct stress and intonation",
          sentence: "I never said she stole my money.",
          stressPattern: "1-3-4"
        },
        {
          type: "shadow_speaking",
          prompt: "Shadow the following audio",
          audioToShadow: "url_to_audio_file.mp3"
        },
        {
          type: "speed_talking",
          prompt: "Say this as quickly and clearly as you can",
          text: "Peter Piper picked a peck of pickled peppers.",
          targetWordsPerMinute: 120
        },
        {
          type: "accent_reduction",
          prompt: "Focus on reducing your accent in these words",
          problematicSounds: ["r", "th", "w"],
          practiceWords: ["really", "weather", "water"]
        },
        {
          type: "tongue_twisters",
          prompt: "Try this tongue twister",
          tongueTwister: "She sells seashells by the seashore."
        }
      ]
    },
    {
      title: "Speaking Scenarios",
      questions: [
        {
          type: "situational_roleplay",
          prompt: "Act out this scenario",
          scenario: "You're at a job interview for your dream position.",
          role: "Job applicant"
        },
        {
          type: "impromptu_speaking",
          prompt: "Speak about this topic with minimal preparation",
          topic: "The importance of lifelong learning",
          preparationTime: 30
        },
        {
          type: "storytelling",
          prompt: "Tell a story based on this prompt",
          storyPrompt: "It was a dark and stormy night..."
        },
        {
          type: "pronunciation_comparison",
          prompt: "Try to match the native pronunciation",
          wordToCompare: "entrepreneurship",
          nativeAudioUrl: "url_to_native_audio.mp3"
        },
        {
          type: "accent_imitation",
          prompt: "Imitate this accent",
          accentToImitate: "British",
          sampleAudioUrl: "url_to_british_accent_sample.mp3"
        },
        {
          type: "paraphrasing",
          prompt: "Paraphrase the following text",
          originalText: "The early bird catches the worm, but the second mouse gets the cheese."
        },
        {
          type: "prosody_practice",
          prompt: "Practice the rhythm and melody of this sentence",
          sentence: "The beautiful butterfly fluttered by the bubbling brook.",
          focusWord: "beautiful"
        }
      ]
    },
    {
      title: "Advanced Speaking Challenges",
      questions: [
        {
          type: "speech_recognition_challenge",
          prompt: "Say this phrase clearly for speech recognition",
          phraseToRecognize: "The quick brown fox jumps over the lazy dog."
        },
        {
          type: "debate_preparation",
          prompt: "Prepare arguments for this debate topic",
          debateTopic: "Is artificial intelligence a threat to humanity?",
          preparationTime: 120
        },
        {
          type: "academic_presentation",
          prompt: "Give an academic presentation on this topic",
          topic: "The impact of social media on modern society",
          presentationDuration: 5
        },
        {
          type: "poetry_recitation",
          prompt: "Recite this poem with proper rhythm and emotion",
          poem: "The Road Not Taken",
          poet: "Robert Frost"
        },
        {
          type: "news_reporting",
          prompt: "Report on this news story as if you were a news anchor",
          newsArticle: "Scientists discover a new species of deep-sea creature."
        },
        {
          type: "voice_acting",
          prompt: "Act out this line as the given character",
          script: "To be, or not to be, that is the question.",
          character: "Hamlet"
        },
        {
          type: "simultaneous_interpretation",
          prompt: "Interpret this speech in real-time",
          sourceLanguage: "Spanish",
          targetLanguage: "English",
          audioToInterpret: "url_to_spanish_speech.mp3"
        }
      ]
    },
    {
      title: "Professional Speaking Skills",
      questions: [
        {
          type: "public_speaking",
          prompt: "Deliver a public speech on this topic",
          speechTopic: "The future of renewable energy",
          audiencetype: "Environmental conference attendees"
        },
        {
          type: "persuasive_speech",
          prompt: "Give a persuasive speech on this topic",
          topic: "Why everyone should learn a second language",
          targetAudience: "High school students"
        },
        {
          type: "technical_explanation",
          prompt: "Explain this technical concept in simple terms",
          technicalTopic: "How blockchain technology works",
          audienceExpertiseLevel: "Beginner"
        },
        {
          type: "cultural_context_speaking",
          prompt: "Adapt your speech to this cultural context",
          culturalScenario: "Giving a toast at a traditional Japanese wedding",
          targetCulture: "Japanese"
        },
        {
          type: "interview_simulation",
          prompt: "Participate in this simulated interview",
          jobPosition: "Marketing Manager",
          interviewerQuestions: [
            "Tell me about yourself.",
            "Why do you want this position?",
            "What's your greatest professional achievement?"
          ]
        },
        {
          type: "negotiation_practice",
          prompt: "Negotiate in this business scenario",
          negotiationScenario: "Salary negotiation for a new job offer",
          objectives: ["Increase base salary", "Secure better benefits", "Negotiate flexible working hours"]
        },
        {
          type: "conflict_resolution_dialogue",
          prompt: "Resolve this conflict through dialogue",
          conflictScenario: "Two team members disagree on project priorities",
          parties: ["Team Leader", "Team Member A", "Team Member B"]
        }
      ]
    },
    {
      title: "Advanced Presentation Skills",
      questions: [
        {
          type: "pitch_presentation",
          prompt: "Pitch your innovative idea to potential investors",
          productOrIdea: "A revolutionary AI-powered language learning app",
          targetInvestors: "Tech venture capitalists"
        },
        {
          type: "Ted_talk_style_presentation",
          prompt: "Deliver a TED-style talk on an inspiring topic",
          inspirationalTopic: "How small acts of kindness can change the world",
          presentationDuration: 10
        },
        {
          type: "language_teaching_simulation",
          prompt: "Teach this language concept to a group of students",
          languageConceptToTeach: "The use of conditional tenses in English",
          studentLevel: "Intermediate"
        }
      ]
    },
    {
      title: "Accent and Vocal Variety",
      questions: [
        {
          type: "accent_neutralization",
          prompt: "Try to neutralize your accent while reading this text",
          textToNeutralize: "The rain in Spain stays mainly in the plain.",
          targetAccent: "Neutral American"
        },
        {
          type: "speech_rhythm_practice",
          prompt: "Practice this speech rhythm pattern",
          rhythmPattern: "Strong-weak-weak, strong-weak-weak",
          practicePhrase: "Butterflies flutter by in the summer sky."
        },
        {
          type: "vocal_variety_exercises",
          prompt: "Express different emotions using the same phrase",
          basePhrase: "I can't believe it.",
          emotionsToExpress: ["Excitement", "Disappointment", "Sarcasm", "Confusion"]
        }
      ]
    },
    {
      title: "Advanced Language Skills",
      questions: [
        {
          type: "argumentative_discourse",
          prompt: "Present an argument on this controversial topic",
          controversialTopic: "Should social media platforms be regulated by governments?",
          stance: "for"
        },
        {
          type: "sociolinguistic_adaptation",
          prompt: "Adapt your language to this social context",
          socialContext: "A formal business meeting with international clients",
          registerToUse: "Formal business English"
        },
        {
          type: "code_switching_practice",
          prompt: "Practice code-switching in this scenario",
          languagePairs: ["English", "Spanish"],
          conversationScenario: "Explaining a work project to a bilingual colleague"
        },
        {
          type: "language_register_shifting",
          prompt: "Shift between different language registers",
          basePhrase: "Can you help me with this?",
          registersToShift: ["Formal", "Casual", "Academic", "Slang"]
        },
        {
          type: "figurative_language_usage",
          prompt: "Use figurative language in this context",
          figurativeDevice: "Metaphor",
          context: "Describing the process of learning a new language"
        },
        {
          type: "idiomatic_expression_mastery",
          prompt: "Use this idiomatic expression in a sentence",
          idiom: "Bite off more than you can chew",
          usage: "In a professional context"
        },
        {
          type: "cross_cultural_communication",
          prompt: "Navigate this cross-cultural communication scenario",
          culturalScenario: "Negotiating a business deal with partners from different cultures",
          involvedCultures: ["American", "Japanese", "German"]
        }
      ]
    }, {
      title: "Pronunciation and Fluency",
      questions: [
        {
          type: "phoneme_drill",
          prompt: "Practice the following sounds",
          phoneme: "th",
          words: ["think", "thistle", "thrust", "thrive", "thread"]
        },
        {
          type: "minimal_pair_practice",
          prompt: "Distinguish between these similar sounds",
          pairOne: "ship",
          pairTwo: "sheep"
        },
        {
          type: "stress_and_intonation",
          prompt: "Practice the correct stress and intonation",
          sentence: "I never said she stole my money.",
          stressPattern: "1-3-4"
        },
        {
          type: "shadow_speaking",
          prompt: "Shadow the following audio",
          audioToShadow: "url_to_audio_file.mp3"
        },
        {
          type: "speed_talking",
          prompt: "Say this as quickly and clearly as you can",
          text: "Peter Piper picked a peck of pickled peppers.",
          targetWordsPerMinute: 120
        },
        {
          type: "accent_reduction",
          prompt: "Focus on reducing your accent in these words",
          problematicSounds: ["r", "th", "w"],
          practiceWords: ["really", "weather", "water"]
        },
        {
          type: "tongue_twisters",
          prompt: "Try this tongue twister",
          tongueTwister: "She sells seashells by the seashore."
        }
      ]
    },
    {
      title: "Speaking Scenarios",
      questions: [
        {
          type: "situational_roleplay",
          prompt: "Act out this scenario",
          scenario: "You're at a job interview for your dream position.",
          role: "Job applicant"
        },
        {
          type: "impromptu_speaking",
          prompt: "Speak about this topic with minimal preparation",
          topic: "The importance of lifelong learning",
          preparationTime: 30
        },
        {
          type: "storytelling",
          prompt: "Tell a story based on this prompt",
          storyPrompt: "It was a dark and stormy night..."
        },
        {
          type: "pronunciation_comparison",
          prompt: "Try to match the native pronunciation",
          wordToCompare: "entrepreneurship",
          nativeAudioUrl: "url_to_native_audio.mp3"
        },
        {
          type: "accent_imitation",
          prompt: "Imitate this accent",
          accentToImitate: "British",
          sampleAudioUrl: "url_to_british_accent_sample.mp3"
        },
        {
          type: "paraphrasing",
          prompt: "Paraphrase the following text",
          originalText: "The early bird catches the worm, but the second mouse gets the cheese."
        },
        {
          type: "prosody_practice",
          prompt: "Practice the rhythm and melody of this sentence",
          sentence: "The beautiful butterfly fluttered by the bubbling brook.",
          focusWord: "beautiful"
        }
      ]
    },
    {
      title: "Advanced Speaking Challenges",
      questions: [
        {
          type: "speech_recognition_challenge",
          prompt: "Say this phrase clearly for speech recognition",
          phraseToRecognize: "The quick brown fox jumps over the lazy dog."
        },
        {
          type: "debate_preparation",
          prompt: "Prepare arguments for this debate topic",
          debateTopic: "Is artificial intelligence a threat to humanity?",
          preparationTime: 120
        },
        {
          type: "academic_presentation",
          prompt: "Give an academic presentation on this topic",
          topic: "The impact of social media on modern society",
          presentationDuration: 5
        },
        {
          type: "poetry_recitation",
          prompt: "Recite this poem with proper rhythm and emotion",
          poem: "The Road Not Taken",
          poet: "Robert Frost"
        },
        {
          type: "news_reporting",
          prompt: "Report on this news story as if you were a news anchor",
          newsArticle: "Scientists discover a new species of deep-sea creature."
        },
        {
          type: "voice_acting",
          prompt: "Act out this line as the given character",
          script: "To be, or not to be, that is the question.",
          character: "Hamlet"
        },
        {
          type: "simultaneous_interpretation",
          prompt: "Interpret this speech in real-time",
          sourceLanguage: "Spanish",
          targetLanguage: "English",
          audioToInterpret: "url_to_spanish_speech.mp3"
        }
      ]
    },
    {
      title: "Professional Speaking Skills",
      questions: [
        {
          type: "public_speaking",
          prompt: "Deliver a public speech on this topic",
          speechTopic: "The future of renewable energy",
          audiencetype: "Environmental conference attendees"
        },
        {
          type: "persuasive_speech",
          prompt: "Give a persuasive speech on this topic",
          topic: "Why everyone should learn a second language",
          targetAudience: "High school students"
        },
        {
          type: "technical_explanation",
          prompt: "Explain this technical concept in simple terms",
          technicalTopic: "How blockchain technology works",
          audienceExpertiseLevel: "Beginner"
        },
        {
          type: "cultural_context_speaking",
          prompt: "Adapt your speech to this cultural context",
          culturalScenario: "Giving a toast at a traditional Japanese wedding",
          targetCulture: "Japanese"
        },
        {
          type: "interview_simulation",
          prompt: "Participate in this simulated interview",
          jobPosition: "Marketing Manager",
          interviewerQuestions: [
            "Tell me about yourself.",
            "Why do you want this position?",
            "What's your greatest professional achievement?"
          ]
        },
        {
          type: "negotiation_practice",
          prompt: "Negotiate in this business scenario",
          negotiationScenario: "Salary negotiation for a new job offer",
          objectives: ["Increase base salary", "Secure better benefits", "Negotiate flexible working hours"]
        },
        {
          type: "conflict_resolution_dialogue",
          prompt: "Resolve this conflict through dialogue",
          conflictScenario: "Two team members disagree on project priorities",
          parties: ["Team Leader", "Team Member A", "Team Member B"]
        }
      ]
    }

  ],
};



export const lessonData4 = {
  id: 1,
  title: "Comprehensive Speaking Practice",
  exercises: [
    {
      id: 1,
      title: "Basic Speaking and Sentence Transformation",
      questions: [
        {
          type: "speaking",
          prompt: "Introduce yourself and mention one hobby you enjoy.",
          sampleAnswer: "Hello, my name is John. I enjoy playing tennis in my free time.",
        },
        {
          type: "sentence_transformation",
          prompt: "Transform this sentence into past tense: 'I go to the gym every day.'",
          originalSentence: "I go to the gym every day.",
          correctAnswer: "I went to the gym every day.",
        },
      ],
    },
    {
      id: 2,
      title: "Action, Vocabulary, and Idioms",
      questions: [
        {
          id: 1,
          type: "vocabulary_practice",
          word: "Cat",
          definition: "A small furry animal that people often keep as a pet.",
          inSentence: "The cat meowed softly as it curled up on the sofa.",
          prompt: "Can you say the word 'cat' and point to a picture of one?",
        },
        {
          id: 2,
          type: "vocabulary_practice",
          word: "Ball",
          definition: "A round object that you can throw, kick, or bounce.",
          inSentence: "The children played with a colorful ball in the park.",
          prompt: "Can you show me how you would throw a ball?",
        },
        {
          id: 3,
          type: "vocabulary_practice",
          word: "Apple",
          definition: "A round fruit with red, green, or yellow skin and white flesh.",
          inSentence: "Sarah ate a crunchy red apple for her snack.",
          prompt: "Apple",
        },
        {
          id: 4,
          type: "vocabulary_practice",
          word: "Sun",
          definition: "The bright star that gives light and heat to Earth.",
          inSentence: "The sun shone brightly in the clear blue sky.",
          prompt: "What do we call the big, bright circle in the sky during the day?",
        },
        {
          id: 5,
          type: "vocabulary_practice",
          word: "House",
          definition: "A building where people live.",
          inSentence: "The family lived in a cozy house with a red roof.",
          prompt: "Can you draw a simple picture of a house?",
        },
        {
          id: 6,
          type: "vocabulary_practice",
          word: "Dog",
          definition: "A common four-legged animal that people keep as a pet.",
          inSentence: "The friendly dog wagged its tail when it saw its owner.",
          prompt: "What animal says 'woof woof'?",
        },
        {
          id: 7,
          type: "vocabulary_practice",
          word: "Tree",
          definition: "A tall plant with a trunk, branches, and leaves.",
          inSentence: "The old oak tree provided shade in the backyard.",
          prompt: "Can you name something that grows tall and has leaves?",
        },
        {
          id: 8,
          type: "vocabulary_practice",
          word: "Car",
          definition: "A vehicle with four wheels that people drive on roads.",
          inSentence: "Dad drove the blue car to work every morning.",
          prompt: "What do we call the vehicle that has four wheels and takes us places?",
        },
        {
          id: 9,
          type: "vocabulary_practice",
          word: "Book",
          definition: "A set of printed pages with stories or information.",
          inSentence: "The teacher read a colorful book to the class.",
          prompt: "What do we read that has pages and a cover?",
        },
        {
          id: 10,
          type: "vocabulary_practice",
          word: "Flower",
          definition: "The colorful part of a plant that often smells nice.",
          inSentence: "The garden was full of beautiful flowers in many colors.",
          prompt: "Can you name something pretty that grows in a garden and has petals?",
        },
        {
          type: "vocabulary_practice",
          word: "Ubiquitous",
          definition: "Present, appearing, or found everywhere.",
          inSentence: "Smartphones have become ubiquitous in modern society.",
          prompt: "Use the word 'ubiquitous' in a sentence about technology.",
        },
        {
          type: "vocabulary_practice",
          word: "Enigmatic",
          definition: "Difficult to interpret or understand; mysterious.",
          inSentence: "The enigmatic smile of the Mona Lisa has puzzled art enthusiasts for centuries.",
          prompt: "Describe something or someone enigmatic that you've encountered.",
        },
        {
          type: "vocabulary_practice",
          word: "Ephemeral",
          definition: "Lasting for a very short time.",
          inSentence: "The beauty of cherry blossoms is ephemeral, lasting only a few days each year.",
          prompt: "Use 'ephemeral' in a sentence about a natural phenomenon.",
        },
        {
          type: "vocabulary_practice",
          word: "Resilient",
          definition: "Able to withstand or recover quickly from difficult conditions.",
          inSentence: "The resilient community quickly rebuilt after the natural disaster.",
          prompt: "Describe a situation where you or someone you know showed resilience.",
        },
        {
          type: "vocabulary_practice",
          word: "Eloquent",
          definition: "Fluent or persuasive in speaking or writing.",
          inSentence: "The eloquent speaker captivated the audience with her words.",
          prompt: "Use 'eloquent' to describe a public figure or someone you admire.",
        },
        {
          type: "action_and_speaking",
          prompt: "Point to your eyes, then say: 'These are my eyes.'",
          action: "Point to eyes",
          correctSpeech: "These are my eyes.",
        },
        {
          type: "vocabulary_practice",
          word: "Enthusiastic",
          definition: "Showing intense and eager enjoyment, interest, or approval.",
          inSentence: "The enthusiastic crowd cheered loudly for the home team.",
          prompt: "Use the word 'enthusiastic' in a sentence about your favorite hobby.",
        },
        {
          type: "idiom_practice",
          idiom: "Break the ice",
          meaning: "To do or say something to relieve tension or get conversation going in a strained situation or when strangers meet.",
          inSentence: "The host told a joke to break the ice at the beginning of the party.",
          prompt: "Describe a situation where you had to 'break the ice' and what you did.",
        },
      ],
    },
    {
      id: 3,
      title: "Spelling and Grammar",
      questions: [
        {
          type: "spelling",
          prompt: "Spell the word 'necessary' out loud.",
          word: "necessary",
          usage: "It is necessary to practice regularly to improve your skills.",
        },
        {
          type: "grammar_speaking",
          prompt: "Create a sentence using the present perfect tense with the verb 'to travel'.",
          sampleAnswer: "I have traveled to three different countries this year.",
        },
      ],
    },
    {
      id: 4,
      title: "Look, Watch, and Speak",
      questions: [
        {
          type: "look_and_speak",
          prompt: "Look at the image and describe what you see in detail.",
          imageUrl: "/images/city_scene.jpg",
          sampleAnswer: "I see a busy city street with tall buildings on both sides. There are cars and buses on the road, and many people walking on the sidewalks. In the distance, I can see a park with trees and a fountain.",
        },
        {
          type: "watch_and_speak",
          prompt: "Watch the video clip and summarize what happened.",
          videoUrl: "/videos/cooking_demonstration.mp4",
          sampleAnswer: "The video shows a chef demonstrating how to make pasta from scratch. They mix flour and eggs, knead the dough, roll it out, and then cut it into long strips. Finally, they cook the pasta in boiling water and serve it with a tomato sauce.",
        },
      ],
    },
    {
      id: 5,
      title: "Multi-Step and Complex Speaking",
      questions: [
        {
          type: "multiStepSpeaking",
          steps: [
            {
              type: "repeat",
              prompt: "Listen and repeat: Hello, how are you doing today?",
              content: "Hello, how are you doing today?",
              correctAnswer: "Hello, how are you doing today?",
            },
            {
              type: "speaking",
              prompt: "Now, respond to this greeting with your own words.",
              sampleAnswer: "I'm doing well, thank you. How about you?",
            },
            {
              type: "speaking",
              prompt: "Describe your mood today using at least two sentences.",
              sampleAnswer: "I'm feeling quite energetic and positive today. The nice weather has really lifted my spirits.",
            },
          ],
          overallFeedback: "Remember to use a variety of expressions to describe your feelings and maintain a natural conversation flow.",
        },
        {
          type: "complexSpeaking",
          mainPrompt: "Describe your ideal vacation.",
          subPrompts: [
            {
              type: "speaking",
              prompt: "Where would you go and why?",
              sampleAnswer: "I would love to visit Japan because I'm fascinated by its unique blend of traditional culture and modern technology.",
            },
            {
              type: "vocabularyInContext",
              prompt: "Use the word 'itinerary' in a sentence about your vacation plans.",
              word: "itinerary",
              definition: "A planned route or journey.",
              sampleUsage: "My itinerary for the trip includes visits to ancient temples and bustling city markets.",
            },
            {
              type: "speaking",
              prompt: "Describe two activities you would do on this vacation.",
              sampleAnswer: "I would participate in a traditional tea ceremony to learn about Japanese customs. I would also visit Mount Fuji to enjoy the breathtaking natural scenery.",
            },
          ],
          overallFeedback: "Try to use specific details and descriptive language to make your vacation plan come alive for the listener.",
        },
      ],
    },
    {
      id: 6,
      title: "Integrated Speaking Practice",
      questions: [
        {
          type: "integratedSpeaking",
          setup: {
            type: "reading",
            content: "Read this short passage about climate change:",
            text: "Climate change is one of the most pressing issues of our time. It refers to long-term shifts in temperatures and weather patterns, mainly caused by human activities. The burning of fossil fuels, deforestation, and industrial processes have led to an increase in greenhouse gases in the atmosphere, resulting in global warming.",
          },
          tasks: [
            {
              type: "comprehension",
              prompt: "Summarize the main points of the passage in your own words.",
              sampleAnswer: "The passage discusses climate change as a major current issue. It explains that climate change involves long-term changes in weather and temperature, primarily caused by human activities such as burning fossil fuels and deforestation. These actions increase greenhouse gases, leading to global warming.",
            },
            {
              type: "opinion",
              prompt: "What do you think is the most effective way to address climate change? Why?",
              sampleAnswer: "I believe that transitioning to renewable energy sources like solar and wind power is the most effective way to address climate change. This approach directly tackles the main cause of the problem by reducing greenhouse gas emissions from fossil fuels. Additionally, it can create new jobs and promote sustainable economic growth.",
            },
            {
              type: "hypothetical",
              prompt: "If you were a world leader, what policy would you implement to combat climate change?",
              sampleAnswer: "If I were a world leader, I would implement a carbon pricing policy. This would involve putting a cost on carbon emissions, encouraging businesses and individuals to reduce their carbon footprint. The revenue generated from this policy could be invested in green technologies and infrastructure, further accelerating the transition to a low-carbon economy.",
            },
          ],
          followUp: {
            type: "debate",
            prompt: "Some people argue that individual actions are insignificant in fighting climate change, and only large-scale government and corporate actions matter. Do you agree or disagree? Provide arguments to support your view.",
            sampleAnswer: "I disagree with the notion that individual actions are insignificant in fighting climate change. While it's true that large-scale actions by governments and corporations are crucial, individual choices collectively can have a substantial impact. When many people adopt environmentally friendly habits like reducing meat consumption, using public transportation, or choosing energy-efficient appliances, it creates a significant cumulative effect. Moreover, individual actions can influence market demands, pushing companies to offer more sustainable products. Lastly, individuals can use their voices and votes to pressure governments and corporations to take stronger action on climate change. Therefore, I believe both individual and large-scale actions are necessary and complementary in addressing this global challenge.",
          },
          overallFeedback: "Remember to structure your responses clearly, use specific examples to support your points, and consider multiple perspectives when discussing complex issues like climate change.",
        },
      ],
    },

    {
      id: 7,
      title: "Advanced Vocabulary and Idioms",
      questions: [
        {
          type: "vocabulary_practice",
          word: "Ubiquitous",
          definition: "Present, appearing, or found everywhere.",
          inSentence: "Smartphones have become ubiquitous in modern society.",
          prompt: "Use the word 'ubiquitous' in a sentence about technology.",
        },
        {
          type: "idiom_practice",
          idiom: "Bite off more than you can chew",
          meaning: "To take on a task that is way too big or difficult to accomplish.",
          inSentence: "When Jack volunteered to organize the entire school festival by himself, he quickly realized he had bitten off more than he could chew.",
          prompt: "Describe a situation where you or someone you know 'bit off more than they could chew'.",
        },
        {
          type: "vocabulary_practice",
          word: "Enigmatic",
          definition: "Difficult to interpret or understand; mysterious.",
          inSentence: "The enigmatic smile of the Mona Lisa has puzzled art enthusiasts for centuries.",
          prompt: "Describe something or someone enigmatic that you've encountered.",
        },
      ],
    },
    {
      id: 8,
      title: "Complex Grammar Structures",
      questions: [
        {
          type: "grammar_speaking",
          prompt: "Create a sentence using the third conditional.",
          rule: "The third conditional is used to talk about imaginary situations in the past.",
          example: "If I had studied harder, I would have passed the exam.",
          sampleAnswer: "If I had woken up earlier, I would have caught the train.",
        },
        {
          type: "grammar_speaking",
          prompt: "Use a relative clause to combine these two sentences: 'The woman is a doctor. She lives next door.'",
          rule: "Relative clauses are used to give additional information about something without starting another sentence.",
          example: "The book that I bought yesterday is very interesting.",
          sampleAnswer: "The woman who lives next door is a doctor.",
        },
      ],
    },
    {
      id: 9,
      title: "Debate and Opinion",
      questions: [
        {
          type: "opinion",
          prompt: "Do you think social media has more positive or negative effects on society? Explain your viewpoint.",
          sampleAnswer: "I believe social media has both positive and negative effects, but overall, its negative impact outweighs the positive. While it allows for global connectivity and instant communication, it also contributes to privacy concerns, mental health issues, and the spread of misinformation.",
        },
        {
          type: "debate",
          prompt: "Some people argue that artificial intelligence will eventually replace human workers in many industries. Do you agree or disagree? Provide arguments to support your view.",
          sampleAnswer: "While I agree that AI will significantly change the job market, I don't believe it will entirely replace human workers. AI can automate repetitive tasks and improve efficiency, but human creativity, emotional intelligence, and complex decision-making skills are still invaluable in many fields. Instead, I think AI will create new job opportunities and change the nature of existing ones, requiring humans to adapt and develop new skills.",
        },
      ],
    },
    {
      id: 10,
      title: "Storytelling and Narrative",
      questions: [
        {
          type: "speaking",
          prompt: "Tell a short story about a memorable travel experience you've had or would like to have.",
          sampleAnswer: "Last summer, I had an unforgettable experience backpacking through Southeast Asia. One particular memory stands out: visiting the ancient temples of Angkor Wat in Cambodia. As I watched the sunrise over the majestic ruins, I felt a deep connection to history and a sense of awe at human achievement. The intricate carvings, the massive stone structures, and the lush jungle surroundings created a magical atmosphere that I'll never forget.",
        },
        {
          type: "look_and_speak",
          prompt: "Look at this series of images and tell a story based on what you see.",
          imageUrl: "/images/story_sequence.jpg",
          sampleAnswer: "The images show a young girl finding a lost puppy in the rain. She takes it home, dries it off, and cares for it. Her parents seem hesitant at first, but they eventually agree to keep the puppy. The final image shows the girl and the now-grown dog playing happily in a sunny park, suggesting that several years have passed and they've formed a strong bond.",
        },
      ],
    },
    {
      id: 11,
      title: "Professional Communication",
      questions: [
        {
          type: "speaking",
          prompt: "You're giving a presentation to your colleagues about a new project. Introduce the project and explain its main objectives.",
          sampleAnswer: "Good morning, everyone. Today, I'd like to introduce our new project, 'Green Office Initiative'. The main objectives of this project are to reduce our company's carbon footprint by 30% within the next year, implement sustainable practices in our daily operations, and foster an environmentally conscious culture among our employees. We'll achieve these goals through a series of steps, including...",
        },
        {
          type: "action_and_speaking",
          prompt: "Role-play a job interview. Respond to the question: 'What are your greatest strengths and how do they apply to this position?'",
          action: "Maintain eye contact and use confident body language",
          correctSpeech: "One of my greatest strengths is my ability to work well under pressure. In my previous role as a project manager, I successfully led a team to complete a critical project ahead of schedule, despite numerous challenges. This strength would be particularly valuable in this position, as I understand you often work with tight deadlines and high-stakes projects.",
        },
      ],
    },
    {
      id: 12,
      title: "Cultural Awareness and Global Issues",
      questions: [
        {
          type: "integratedSpeaking",
          setup: {
            type: "reading",
            content: "Read this short passage about cultural diversity:",
            text: "Cultural diversity refers to the variety of human societies or cultures in a specific region, or in the world as a whole. It encompasses the differences in language, religion, cuisine, social habits, music, and arts that exist between different groups of people. In an increasingly globalized world, understanding and appreciating cultural diversity has become more important than ever.",
          },
          tasks: [
            {
              type: "comprehension",
              prompt: "Summarize the main points of the passage in your own words.",
              sampleAnswer: "The passage defines cultural diversity as the variety of human cultures in a region or globally. It includes differences in various aspects of life such as language, religion, food, and social customs. The text emphasizes that in our globalized world, it's becoming increasingly important to understand and appreciate these cultural differences.",
            },
            {
              type: "opinion",
              prompt: "Why do you think understanding cultural diversity is important in today's world?",
              sampleAnswer: "Understanding cultural diversity is crucial in today's world for several reasons. Firstly, it promotes tolerance and reduces prejudice, helping to create a more harmonious global society. Secondly, in the business world, cultural awareness can lead to better international relationships and more successful global ventures. Lastly, exposure to diverse cultures enriches our own lives, broadening our perspectives and encouraging creativity and innovation.",
            },
          ],
          followUp: {
            type: "hypothetical",
            prompt: "Imagine you're organizing a cultural diversity day at your workplace or school. What activities or events would you include and why?",
            sampleAnswer: "For a cultural diversity day, I would organize a series of events to celebrate and learn about different cultures. This could include a food festival featuring cuisines from around the world, workshops on different languages and traditional arts, and panel discussions with people from various cultural backgrounds sharing their experiences. I would also set up booths representing different countries or cultures, where people could learn about traditions, try on traditional clothing, or participate in cultural games. The goal would be to create an immersive experience that encourages interaction and learning, fostering greater understanding and appreciation of cultural diversity.",
          },
        },
      ],
    },
  ],
};

export const lessonData3 = {
  id: 1,
  title: "Lesson 1",
  exercises: [
    {
      id: 1,
      title: "Exercise 1: Verb Agreement",
      questions: [
        {
          type: "repeat",
          prompt: "Listen and repeat: One dog barks.",
          content: "One dog barks.",
          correctAnswer: "One dog barks.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about three dogs.",
          content: "Three dogs bark.",
          correctAnswer: "Three dogs bark.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about a lot of dogs.",
          content: "A lot of dogs bark.",
          correctAnswer: "A lot of dogs bark.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about one dog.",
          content: "One dog barks.",
          correctAnswer: "One dog barks.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about this dog.",
          content: "This dog barks.",
          correctAnswer: "This dog barks.",
        },
      ],
    },
    {
      id: 2,
      title: "Exercise 2: Comparatives",
      questions: [
        {
          type: "multipleChoice",
          prompt: "What is the opposite of a hot day?",
          options: ["A warm day", "A cold day", "A sunny day"],
          correctAnswer: "A cold day",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: On Sunday it was 45 degrees.",
          content: "On Sunday it was 45 degrees.",
          correctAnswer: "On Sunday it was 45 degrees.",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: On Monday it was 55 degrees.",
          content: "On Monday it was 55 degrees.",
          correctAnswer: "On Monday it was 55 degrees.",
        },
        {
          type: "multipleChoice",
          prompt: "Which day was hotter, Sunday or Monday?",
          options: ["Sunday", "Monday", "They were the same"],
          correctAnswer: "Monday",
        },
        {
          type: "repeat",
          prompt: "Say the sentence: Monday was hotter than Sunday.",
          content: "Monday was hotter than Sunday.",
          correctAnswer: "Monday was hotter than Sunday.",
        },
      ],
    },
    {
      id: 3,
      title: "Exercise 3: Present and Past Tense",
      questions: [
        {
          type: "repeat",
          prompt: "Start with Sunday and say the days of the week.",
          content: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
          correctAnswer: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
        },
        {
          type: "multipleChoice",
          prompt: "What day is it today?",
          options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          correctAnswer: "The current day of the week",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: He walks to work.",
          content: "He walks to work.",
          correctAnswer: "He walks to work.",
        },
        {
          type: "multipleChoice",
          prompt: "Does 'He walks to work' tell about today or yesterday?",
          options: ["Today", "Yesterday"],
          correctAnswer: "Today",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about yesterday: He walked to work.",
          content: "He walked to work.",
          correctAnswer: "He walked to work.",
        },
      ],
    },
    {
      id: 4,
      title: "Exercise 4: Body Parts",
      questions: [
        {
          type: "action",
          prompt: "Touch your elbow.",
          correctAction: "Touching elbow",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about what you did.",
          content: "I touched my elbow.",
          correctAnswer: "I touched my elbow.",
        },
        {
          type: "multipleChoice",
          prompt: "Is the elbow part of the arm?",
          options: ["Yes", "No"],
          correctAnswer: "Yes",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about the elbow.",
          content: "The elbow is part of the arm.",
          correctAnswer: "The elbow is part of the arm.",
        },
        {
          type: "multipleChoice",
          prompt: "How many elbows do you have?",
          options: ["One", "Two", "Three"],
          correctAnswer: "Two",
        },
      ],
    },
    {
      id: 5,
      title: "Exercise 5: Pronouns",
      questions: [
        {
          type: "multipleChoice",
          prompt: "What is another word for a boy?",
          options: ["She", "It", "He"],
          correctAnswer: "He",
        },
        {
          type: "multipleChoice",
          prompt: "What is another word for a woman?",
          options: ["He", "She", "It"],
          correctAnswer: "She",
        },
        {
          type: "multipleChoice",
          prompt: "What is another word for a boy and a girl?",
          options: ["He", "She", "They"],
          correctAnswer: "They",
        },
        {
          type: "repeat",
          prompt: "Listen: Boys and girls were reading. Say the sentence with another word for boys and girls.",
          content: "They were reading.",
          correctAnswer: "They were reading.",
        },
        {
          type: "repeat",
          prompt: "Listen: You and I are talking. Say the sentence with another word for you and I.",
          content: "We are talking.",
          correctAnswer: "We are talking.",
        },
      ],
    },
    {
      id: 6,
      title: "Exercise 6: Furniture",
      questions: [
        {
          type: "multipleChoice",
          prompt: "What do we call items like chairs, tables, and lamps?",
          options: ["Clothes", "Furniture", "Food"],
          correctAnswer: "Furniture",
        },
        {
          type: "repeat",
          prompt: "Name the furniture items in the top row of the picture.",
          content: "Chair, table, lamp, couch, carpet.",
          correctAnswer: "Chair, table, lamp, couch, carpet.",
        },
        {
          type: "repeat",
          prompt: "Name the furniture items in the bottom row of the picture.",
          content: "Coffee table, dresser, bed, mirror.",
          correctAnswer: "Coffee table, dresser, bed, mirror.",
        },
      ],
    },
    {
      id: 7,
      title: "Exercise 7: Comparatives",
      questions: [
        {
          type: "repeat",
          prompt: "Listen and repeat: Road A was 30 feet wide.",
          content: "Road A was 30 feet wide.",
          correctAnswer: "Road A was 30 feet wide.",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: Road B was 40 feet wide.",
          content: "Road B was 40 feet wide.",
          correctAnswer: "Road B was 40 feet wide.",
        },
        {
          type: "multipleChoice",
          prompt: "Which road was wider, road A or road B?",
          options: ["Road A", "Road B", "They were the same width"],
          correctAnswer: "Road B",
        },
        {
          type: "repeat",
          prompt: "Say the sentence: Road B was wider than road A.",
          content: "Road B was wider than road A.",
          correctAnswer: "Road B was wider than road A.",
        },
        {
          type: "multipleChoice",
          prompt: "What is the opposite of a tall girl?",
          options: ["A short girl", "A wide girl", "A thin girl"],
          correctAnswer: "A short girl",
        },
      ],
    },
    {
      id: 8,
      title: "Exercise 8: Verb Agreement",
      questions: [
        {
          type: "repeat",
          prompt: "Listen and repeat: One boy rides to school.",
          content: "One boy rides to school.",
          correctAnswer: "One boy rides to school.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about two boys.",
          content: "Two boys ride to school.",
          correctAnswer: "Two boys ride to school.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about his brothers.",
          content: "His brothers ride to school.",
          correctAnswer: "His brothers ride to school.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about his brother.",
          content: "His brother rides to school.",
          correctAnswer: "His brother rides to school.",
        },
        {
          type: "repeat",
          prompt: "Say the sentence about Bob and Bill.",
          content: "Bob and Bill ride to school.",
          correctAnswer: "Bob and Bill ride to school.",
        },
      ],
    },
    {
      id: 9,
      title: "Exercise 9: Prepositions",
      questions: [
        {
          type: "repeat",
          prompt: "Listen and repeat: One of these paths goes through the house.",
          content: "One of these paths goes through the house.",
          correctAnswer: "One of these paths goes through the house.",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: One of these paths goes over the house.",
          content: "One of these paths goes over the house.",
          correctAnswer: "One of these paths goes over the house.",
        },
        {
          type: "repeat",
          prompt: "Listen and repeat: One of these paths goes around the house.",
          content: "One of these paths goes around the house.",
          correctAnswer: "One of these paths goes around the house.",
        },
        {
          type: "multipleChoice",
          prompt: "Where does path A go?",
          options: ["Through the house", "Over the house", "Around the house"],
          correctAnswer: "Through the house",
        },
        {
          type: "multipleChoice",
          prompt: "Are the boy, the bird, and the girl in back of the house or in front of the house?",
          options: ["In back of the house", "In front of the house"],
          correctAnswer: "In front of the house",
        },
      ],
    },
    {
      id: 10,
      title: "Exercise 10: Food",
      questions: [
        {
          type: "multipleChoice",
          prompt: "What category of food are corn, beans, lettuce, tomato, and carrot?",
          options: ["Fruits", "Vegetables", "Meats"],
          correctAnswer: "Vegetables",
        },
        {
          type: "repeat",
          prompt: "Name the vegetables shown in the picture.",
          content: "Corn, beans, lettuce, tomato, carrot.",
          correctAnswer: "Corn, beans, lettuce, tomato, carrot.",
        },
      ],
    },
    {
      id: 11,
      title: "Exercise 11: Calendar Facts",
      questions: [
        {
          type: "repeat",
          prompt: "Start with Sunday and say the days of the week.",
          content: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
          correctAnswer: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
        },
        {
          type: "multipleChoice",
          prompt: "How many days are in a week?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "7",
        },
        {
          type: "repeat",
          prompt: "Say the sentence: There are seven days in a week.",
          content: "There are seven days in a week.",
          correctAnswer: "There are seven days in a week.",
        },
        {
          type: "multipleChoice",
          prompt: "How many days are in a year?",
          options: ["365", "366", "360", "370"],
          correctAnswer: "365",
        },
        {
          type: "repeat",
          prompt: "Start with January and say the months of the year.",
          content: "January, February, March, April, May, June, July, August, September, October, November, December.",
          correctAnswer: "January, February, March, April, May, June, July, August, September, October, November, December.",
        },
        {
          id: 1,
          title: "Verb Agreement",
          type: "speaking",
          instructions: "You're going to say sentences.",
          questions: [
            {
              prompt: "Listen: One dog barks.",
              task: "Say the sentence.",
              answer: "One dog barks.",
              variations: [
                {
                  prompt: "Say the sentence about three dogs.",
                  answer: "Three dogs bark."
                },
                {
                  prompt: "Say the sentence about a lot of dogs.",
                  answer: "A lot of dogs bark."
                },
                {
                  prompt: "Say the sentence about this dog.",
                  answer: "This dog barks."
                },
                {
                  prompt: "Say the sentence about Mary's dog.",
                  answer: "Mary's dog barks."
                }
              ]
            },
            {
              prompt: "Listen: Three dogs swim.",
              task: "Say the sentence.",
              answer: "Three dogs swim.",
              variations: [
                {
                  prompt: "Say the sentence about one dog.",
                  answer: "One dog swims."
                },
                {
                  prompt: "Say the sentence about that dog.",
                  answer: "That dog swims."
                },
                {
                  prompt: "Say the sentence about those dogs.",
                  answer: "Those dogs swim."
                }
              ]
            }
          ]
        },
        {
          id: 2,
          title: "Comparatives",
          type: "listening_and_speaking",
          instructions: "Listen and answer questions about comparatives.",
          questions: [
            {
              prompt: "What is the opposite of a hot day?",
              answer: "A cold day."
            },
            {
              prompt: "Listen: On Sunday it was 45 degrees. On Monday it was 55 degrees. Which day was hotter, Sunday or Monday?",
              answer: "Monday",
              followUp: {
                prompt: "Say the sentence: Monday was hotter than Sunday.",
                answer: "Monday was hotter than Sunday."
              }
            },
            {
              prompt: "What's the opposite of something that is wet?",
              answer: "Something that is dry."
            },
            {
              prompt: "Listen: It rained two inches on Sunday. It rained four inches on Monday. Which day was wetter, Sunday or Monday?",
              answer: "Monday",
              followUp: {
                prompt: "Say the sentence about Monday.",
                answer: "Monday was wetter than Sunday."
              }
            }
          ]
        },
        {
          id: 3,
          title: "Present and Past Tense",
          type: "speaking",
          instructions: "You're going to practice present and past tense.",
          questions: [
            {
              prompt: "Start with Sunday and say the days of the week.",
              answer: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday."
            },
            {
              prompt: "Listen: He walks to work. Does that tell about today or yesterday?",
              answer: "Today",
              followUp: {
                prompt: "Say the sentence about yesterday.",
                answer: "He walked to work."
              }
            },
            {
              prompt: "New sentence: They listen to music. Does that sentence tell about today or yesterday?",
              answer: "Today",
              followUp: {
                prompt: "Say the sentence about yesterday.",
                answer: "They listened to music."
              }
            }
          ]
        },
        {
          id: 4,
          title: "Body Parts",
          type: "action_and_speaking",
          instructions: "Follow instructions and answer questions about body parts.",
          questions: [
            {
              prompt: "Touch your elbow.",
              action: "Touch elbow",
              followUp: {
                prompt: "Say the sentence about what you did.",
                answer: "I touched my elbow."
              }
            },
            {
              prompt: "Is the elbow part of the arm?",
              answer: "Yes",
              followUp: {
                prompt: "Say the sentence about the elbow.",
                answer: "The elbow is part of the arm."
              }
            },
            {
              prompt: "Touch your wrist.",
              action: "Touch wrist",
              followUp: {
                prompt: "Say the sentence about what you did.",
                answer: "I touched my wrist."
              }
            },
            {
              prompt: "Touch your knees.",
              action: "Touch knees",
              followUp: {
                prompt: "Are knees part of arms?",
                answer: "No",
                additionalPrompt: "What are knees part of?",
                additionalAnswer: "Legs"
              }
            }
          ]
        },
        {
          id: 5,
          title: "Pronouns",
          type: "speaking",
          instructions: "Practice using pronouns in sentences.",
          questions: [
            {
              prompt: "What is another word for a boy?",
              answer: "He"
            },
            {
              prompt: "What is another word for a woman?",
              answer: "She"
            },
            {
              prompt: "Listen: Boys and girls were reading. Say the sentence with another word for boys and girls.",
              answer: "They were reading."
            },
            {
              prompt: "Listen: You and I are talking. Say the sentence with another word for you and I.",
              answer: "We are talking."
            },
            {
              prompt: "They looked at four trucks. Say the sentence with another word for four trucks.",
              answer: "They looked at them."
            }
          ]
        },
        {
          id: 6,
          title: "Exercise 6: Furniture",
          questions: [
            {
              type: "multipleChoice",
              prompt: "What do we call items like chairs, tables, and lamps?",
              options: ["Clothes", "Furniture", "Food"],
              correctAnswer: "Furniture",
            },
            {
              type: "repeat",
              prompt: "Name the furniture items in the top row of the picture.",
              content: "Chair, table, lamp, couch, carpet.",
              correctAnswer: "Chair, table, lamp, couch, carpet.",
            },
            {
              type: "repeat",
              prompt: "Name the furniture items in the bottom row of the picture.",
              content: "Coffee table, dresser, bed, mirror.",
              correctAnswer: "Coffee table, dresser, bed, mirror.",
            },
          ],
        },
        {
          id: 7,
          title: "Exercise 7: Comparatives",
          questions: [
            {
              type: "repeat",
              prompt: "Listen and repeat: Road A was 30 feet wide.",
              content: "Road A was 30 feet wide.",
              correctAnswer: "Road A was 30 feet wide.",
            },
            {
              type: "repeat",
              prompt: "Listen and repeat: Road B was 40 feet wide.",
              content: "Road B was 40 feet wide.",
              correctAnswer: "Road B was 40 feet wide.",
            },
            {
              type: "multipleChoice",
              prompt: "Which road was wider, road A or road B?",
              options: ["Road A", "Road B", "They were the same width"],
              correctAnswer: "Road B",
            },
            {
              type: "repeat",
              prompt: "Say the sentence: Road B was wider than road A.",
              content: "Road B was wider than road A.",
              correctAnswer: "Road B was wider than road A.",
            },
            {
              type: "multipleChoice",
              prompt: "What is the opposite of a tall girl?",
              options: ["A short girl", "A wide girl", "A thin girl"],
              correctAnswer: "A short girl",
            },
          ],
        },
        {
          id: 8,
          title: "Exercise 8: Verb Agreement",
          questions: [
            {
              type: "repeat",
              prompt: "Listen and repeat: One boy rides to school.",
              content: "One boy rides to school.",
              correctAnswer: "One boy rides to school.",
            },
            {
              type: "repeat",
              prompt: "Say the sentence about two boys.",
              content: "Two boys ride to school.",
              correctAnswer: "Two boys ride to school.",
            },
            {
              type: "repeat",
              prompt: "Say the sentence about his brothers.",
              content: "His brothers ride to school.",
              correctAnswer: "His brothers ride to school.",
            },
            {
              type: "repeat",
              prompt: "Say the sentence about his brother.",
              content: "His brother rides to school.",
              correctAnswer: "His brother rides to school.",
            },
            {
              type: "repeat",
              prompt: "Say the sentence about Bob and Bill.",
              content: "Bob and Bill ride to school.",
              correctAnswer: "Bob and Bill ride to school.",
            },
          ],
        },
        {
          id: 9,
          title: "Exercise 9: Prepositions",
          questions: [
            {
              type: "repeat",
              prompt: "Listen and repeat: One of these paths goes through the house.",
              content: "One of these paths goes through the house.",
              correctAnswer: "One of these paths goes through the house.",
            },
            {
              type: "repeat",
              prompt: "Listen and repeat: One of these paths goes over the house.",
              content: "One of these paths goes over the house.",
              correctAnswer: "One of these paths goes over the house.",
            },
            {
              type: "repeat",
              prompt: "Listen and repeat: One of these paths goes around the house.",
              content: "One of these paths goes around the house.",
              correctAnswer: "One of these paths goes around the house.",
            },
            {
              type: "multipleChoice",
              prompt: "Where does path A go?",
              options: ["Through the house", "Over the house", "Around the house"],
              correctAnswer: "Through the house",
            },
            {
              type: "multipleChoice",
              prompt: "Are the boy, the bird, and the girl in back of the house or in front of the house?",
              options: ["In back of the house", "In front of the house"],
              correctAnswer: "In front of the house",
            },
          ],
        },
        {
          id: 10,
          title: "Exercise 10: Food",
          questions: [
            {
              type: "multipleChoice",
              prompt: "What category of food are corn, beans, lettuce, tomato, and carrot?",
              options: ["Fruits", "Vegetables", "Meats"],
              correctAnswer: "Vegetables",
            },
            {
              type: "repeat",
              prompt: "Name the vegetables shown in the picture.",
              content: "Corn, beans, lettuce, tomato, carrot.",
              correctAnswer: "Corn, beans, lettuce, tomato, carrot.",
            },
          ],
        },
        {
          id: 11,
          title: "Exercise 11: Calendar Facts",
          questions: [
            {
              type: "repeat",
              prompt: "Start with Sunday and say the days of the week.",
              content: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
              correctAnswer: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday.",
            },
            {
              type: "multipleChoice",
              prompt: "How many days are in a week?",
              options: ["5", "6", "7", "8"],
              correctAnswer: "7",
            },
            {
              type: "repeat",
              prompt: "Say the sentence: There are seven days in a week.",
              content: "There are seven days in a week.",
              correctAnswer: "There are seven days in a week.",
            },
            {
              type: "multipleChoice",
              prompt: "How many days are in a year?",
              options: ["365", "366", "360", "370"],
              correctAnswer: "365",
            },
            {
              type: "repeat",
              prompt: "Start with January and say the months of the year.",
              content: "January, February, March, April, May, June, July, August, September, October, November, December.",
              correctAnswer: "January, February, March, April, May, June, July, August, September, October, November, December.",
            },
          ],
        },
        {
          id: 12,
          title: "Verb Agreement",
          type: "speaking",
          instructions: "Listen to the sentence and repeat it with the given changes.",
          questions: [
            {
              prompt: "Listen: One dog barks.",
              task: "Say the sentence.",
              answer: "One dog barks.",
              variations: [
                { prompt: "Say the sentence about three dogs", answer: "Three dogs bark." },
                { prompt: "Say the sentence about a lot of dogs", answer: "A lot of dogs bark." },
                { prompt: "Say the sentence about this dog", answer: "This dog barks." },
                { prompt: "Say the sentence about Mary's dog", answer: "Mary's dog barks." }
              ]
            },
            {
              prompt: "Listen: Three dogs swim.",
              task: "Say the sentence.",
              answer: "Three dogs swim.",
              variations: [
                { prompt: "Say the sentence about one dog", answer: "One dog swims." },
                { prompt: "Say the sentence about that dog", answer: "That dog swims." },
                { prompt: "Say the sentence about those dogs", answer: "Those dogs swim." }
              ]
            }
          ]
        },
        {
          id: 13,
          title: "Comparatives",
          type: "sentence_transformation",
          instructions: "Listen to the scenario and form comparative sentences.",
          questions: [
            {
              prompt: "Listen: Sunday was 45 degrees. Monday was 55 degrees. Which day was hotter?",
              content: "Sunday was 45 degrees. Monday was 55 degrees.",
              correctAnswer: "Monday was hotter than Sunday."
            },
            {
              prompt: "Now make a sentence about which day was colder.",
              correctAnswer: "Sunday was colder than Monday."
            },
            {
              prompt: "What's the opposite of something that is wet?",
              answer: "Something that is dry."
            },
            {
              prompt: "Listen: It rained two inches on Sunday. It rained four inches on Monday. Which day was wetter?",
              answer: "Monday was wetter than Sunday."
            }
          ]
        },
        {
          id: 14,
          title: "Present and Past Tense",
          type: "speaking",
          instructions: "Practice using present and past tense.",
          questions: [
            {
              prompt: "Start with Sunday and say the days of the week.",
              answer: "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday."
            },
            {
              prompt: "Listen: He walks to work. Does that tell about today or yesterday?",
              answer: "Today",
              followUp: {
                prompt: "Say the sentence about yesterday.",
                answer: "He walked to work."
              }
            },
            {
              prompt: "Listen: They listen to music. Does that sentence tell about today or yesterday?",
              answer: "Today",
              followUp: {
                prompt: "Say the sentence about yesterday.",
                answer: "They listened to music."
              }
            }
          ]
        },
        {
          id: 15,
          title: "Body Parts",
          type: "action_and_speaking",
          instructions: "Follow instructions and answer questions about body parts.",
          questions: [
            {
              prompt: "Touch your elbow.",
              action: "Touch elbow",
              followUp: {
                prompt: "Say the sentence about what you did.",
                answer: "I touched my elbow."
              }
            },
            {
              prompt: "Is the elbow part of the arm?",
              answer: "Yes",
              followUp: {
                prompt: "Say the sentence about the elbow.",
                answer: "The elbow is part of the arm."
              }
            },
            {
              prompt: "Touch your knees.",
              action: "Touch knees",
              followUp: {
                prompt: "Are knees part of arms?",
                answer: "No",
                additionalPrompt: "What are knees part of?",
                additionalAnswer: "Legs"
              }
            }
          ]
        },
        {
          id: 16,
          title: "Pronouns",
          type: "speaking",
          instructions: "Practice using pronouns in sentences.",
          questions: [
            {
              prompt: "What is another word for a boy?",
              answer: "He"
            },
            {
              prompt: "Listen: Boys and girls were reading. Say the sentence with another word for boys and girls.",
              answer: "They were reading."
            },
            {
              prompt: "They looked at four trucks. Say the sentence with another word for four trucks.",
              answer: "They looked at them."
            }
          ]
        },
        {
          id: 17,
          title: "Vocabulary Practice",
          type: "vocabulary_practice",
          instructions: "Listen to the word and its definition, then use it in a sentence.",
          questions: [
            {
              word: "Ambiguous",
              definition: "Open to more than one interpretation; not having one obvious meaning.",
              inSentence: "The politician's statement was ambiguous, leaving room for multiple interpretations.",
              prompt: "Now use 'ambiguous' in your own sentence."
            },
            {
              word: "Benevolent",
              definition: "Kind, generous, and caring about other people.",
              inSentence: "The benevolent donor gave millions to charity.",
              prompt: "Now use 'benevolent' in your own sentence."
            }
          ]
        },
        {
          id: 18,
          title: "Spelling Practice",
          type: "spelling",
          instructions: "Listen to the word and spell it out loud.",
          questions: [
            {
              word: "Necessary",
              usage: "It is necessary to study for the exam.",
              prompt: "Spell the word 'necessary'."
            },
            {
              word: "Rhythm",
              usage: "The song has a catchy rhythm.",
              prompt: "Spell the word 'rhythm'."
            }
          ]
        },
        {
          id: 19,
          title: "Grammar Guide Practice",
          type: "grammar_speaking",
          instructions: "Listen to the grammar rule and example, then create your own sentence using the rule.",
          questions: [
            {
              rule: "Use 'fewer' for countable nouns and 'less' for uncountable nouns.",
              example: "I have fewer apples than you, but less money.",
              prompt: "Create a sentence using both 'fewer' and 'less'."
            },
            {
              rule: "In conditional sentences, use 'would have' in the main clause when the if-clause uses the past perfect.",
              example: "If I had studied harder, I would have passed the exam.",
              prompt: "Create a sentence using this conditional structure."
            }
          ]
        },
        {
          id: 20,
          title: "Picture Description",
          type: "look_and_speak",
          instructions: "Describe the image you see in detail.",
          questions: [
            {
              type: "imageDescription",
              prompt: "Describe this city scene.",
              imageUrl: "/images/city_scene.jpg",
              sampleAnswer: "I see a busy city street with tall buildings, cars, and people walking on the sidewalk."
            }
          ]
        },
        {
          id: 21,
          title: "Video Response",
          type: "watch_and_speak",
          instructions: "Watch the video clip and answer the question.",
          questions: [
            {
              type: "videoDescription",
              prompt: "What happened in the traffic scene?",
              videoUrl: "/videos/traffic_scene.mp4",
              sampleAnswer: "A red car stopped at a traffic light, and then it turned green, allowing the car to continue driving."
            }
          ]
        },
        {
          id: 22,
          title: "Idiomatic Expressions",
          type: "idiom_practice",
          instructions: "Listen to the idiom and its meaning, then use it in your own sentence.",
          questions: [
            {
              idiom: "Break the ice",
              meaning: "To do or say something to relieve tension or get conversation going in a strained situation or when strangers meet.",
              example: "The host told a joke to break the ice at the beginning of the party.",
              prompt: "Now use 'break the ice' in your own sentence."
            },
            {
              idiom: "Cut corners",
              meaning: "To do something in the easiest, cheapest, or fastest way, often by ignoring rules or leaving something out.",
              example: "The company cut corners by using cheaper materials, resulting in a lower quality product.",
              prompt: "Now use 'cut corners' in your own sentence."
            }
          ]
        }
      ],
    },
  ],
};




export const lessonDataForamts = {
  id: 1,
  title: "Comprehensive English Speaking Practice",
  exercises: [
    {
      title: "Basic Speaking",
      type: QuestionType.SPEAKING,
      questions: [
        {
          type: QuestionType.SPEAKING,
          prompt: "Introduce yourself and your hobbies",
          sampleAnswer: "Hi, I'm John. I enjoy playing tennis and reading books in my free time.",
          points: ["name", "hobbies", "interests"]
        },
        {
          type: QuestionType.SPEAKING,
          prompt: "Describe your typical day",
          sampleAnswer: "I usually wake up at 7 AM, have breakfast, go to work, and return home at 6 PM.",
          points: ["schedule", "activities", "routines"]
        },
        {
          type: QuestionType.SPEAKING,
          prompt: "What are your future goals?",
          sampleAnswer: "I want to improve my English skills and travel to different countries.",
          points: ["goals", "aspirations", "timeline"]
        }
      ]
    },

    {
      title: "Multiple Choice Speaking",
      type: QuestionType.MULTIPLE_CHOICE,
      questions: [
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: "What's your preferred method of transportation?",
          options: [
            "I prefer taking the subway because it's fast",
            "I usually drive my car to avoid traffic",
            "I like walking when the weather is nice"
          ],
          correctAnswer: "I prefer taking the subway because it's fast"
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: "How do you like to spend your weekends?",
          options: [
            "I enjoy outdoor activities with friends",
            "I prefer staying home and relaxing",
            "I usually catch up on work and errands"
          ],
          correctAnswer: "I enjoy outdoor activities with friends"
        },
        {
          type: QuestionType.MULTIPLE_CHOICE,
          prompt: "What's your favorite season?",
          options: [
            "I love summer for beach activities",
            "Winter is best for skiing and snow",
            "Spring is perfect with mild weather"
          ],
          correctAnswer: "I love summer for beach activities"
        }
      ]
    },

    {
      title: "Look and Speak",
      type: QuestionType.LOOK_AND_SPEAK,
      questions: [
        {
          type: QuestionType.LOOK_AND_SPEAK,
          prompt: "Describe this beach scene",
          imageUrl: "/images/beach_scene.jpg",
          sampleAnswer: "The beach is crowded with people enjoying the sunny day. Children are building sandcastles while adults are swimming.",
          keyPoints: ["setting", "people", "activities"]
        },
        {
          type: QuestionType.LOOK_AND_SPEAK,
          prompt: "What's happening in this office?",
          imageUrl: "/images/office_scene.jpg",
          sampleAnswer: "A team of people is having a meeting. They're discussing something while looking at presentations.",
          keyPoints: ["location", "people", "actions"]
        },
        {
          type: QuestionType.LOOK_AND_SPEAK,
          prompt: "Describe this restaurant scene",
          imageUrl: "/images/restaurant_scene.jpg",
          sampleAnswer: "The restaurant is elegant with dimmed lighting. Waiters are serving food to customers at tables.",
          keyPoints: ["atmosphere", "people", "activities"]
        }
      ]
    },

    {
      title: "Vocabulary Practice",
      type: QuestionType.VOCABULARY,
      questions: [
        {
          type: QuestionType.VOCABULARY,
          wordList: [
            {
              term: "perseverance",
              definition: "Continued effort despite difficulties",
              correctPronunciation: "pur-suh-VEER-uhns",
              example: "His perseverance helped him achieve his goals"
            },
            {
              term: "innovative",
              definition: "Introducing new ideas or methods",
              correctPronunciation: "IN-oh-vay-tiv",
              example: "The company developed an innovative solution"
            },
            {
              term: "versatile",
              definition: "Able to adapt or be adapted to many functions",
              correctPronunciation: "VUR-suh-tyl",
              example: "She is a versatile actor who can play many roles"
            }
          ]
        }
      ]
    },

    {
      title: "Listen and Repeat",
      type: QuestionType.LISTEN_AND_REPEAT,
      questions: [
        {
          type: QuestionType.LISTEN_AND_REPEAT,
          prompt: "Practice this business phrase",
          audioUrl: "/audio/business_phrase.mp3",
          text: "Let's schedule a meeting to discuss the project",
          correctPronunciation: "Let's schedule a meeting to discuss the project",
          focusPoints: ["stress", "intonation"]
        },
        {
          type: QuestionType.LISTEN_AND_REPEAT,
          prompt: "Repeat this casual greeting",
          audioUrl: "/audio/casual_greeting.mp3",
          text: "Hey, how's it going?",
          correctPronunciation: "Hey, how's it going?",
          focusPoints: ["informal tone", "natural rhythm"]
        },
        {
          type: QuestionType.LISTEN_AND_REPEAT,
          prompt: "Practice this complex word",
          audioUrl: "/audio/complex_word.mp3",
          text: "Congratulations on your achievement",
          correctPronunciation: "Congratulations on your achievement",
          focusPoints: ["word stress", "clear articulation"]
        }
      ]
    },

    {
      title: "Watch and Describe",
      type: QuestionType.WATCH_AND_SPEAK,
      questions: [
        {
          type: QuestionType.WATCH_AND_SPEAK,
          prompt: "Describe this nature documentary clip",
          videoUrl: "/videos/nature_clip.mp4",
          sampleAnswer: "The video shows a lion hunting in the savanna. It slowly stalks its prey before making a quick dash.",
          keyPoints: ["sequence", "details", "outcome"]
        },
        {
          type: QuestionType.WATCH_AND_SPEAK,
          prompt: "Explain this dance performance",
          videoUrl: "/videos/dance_performance.mp4",
          sampleAnswer: "The dancers move gracefully across the stage, performing synchronized movements to classical music.",
          keyPoints: ["movements", "music", "coordination"]
        },
        {
          type: QuestionType.WATCH_AND_SPEAK,
          prompt: "Describe this cooking tutorial",
          videoUrl: "/videos/cooking_tutorial.mp4",
          sampleAnswer: "The chef demonstrates how to make pasta from scratch, starting with flour and eggs.",
          keyPoints: ["steps", "ingredients", "process"]
        }
      ]
    },

    {
      title: "Role Play",
      type: QuestionType.ROLE_PLAY,
      questions: [
        {
          type: QuestionType.ROLE_PLAY,
          scenario: "At a Restaurant",
          roles: ["Customer", "Waiter"],
          prompt: "Order a meal and interact with the waiter",
          sampleDialog: {
            waiter: "Welcome to our restaurant. May I take your order?",
            customer: "Yes, I'd like to see the menu, please."
          }
        },
        {
          type: QuestionType.ROLE_PLAY,
          scenario: "Job Interview",
          roles: ["Interviewer", "Candidate"],
          prompt: "Conduct a job interview for a marketing position",
          sampleDialog: {
            interviewer: "Tell me about your previous experience.",
            candidate: "I have five years of experience in digital marketing."
          }
        },
        {
          type: QuestionType.ROLE_PLAY,
          scenario: "Doctor's Office",
          roles: ["Doctor", "Patient"],
          prompt: "Describe symptoms and get medical advice",
          sampleDialog: {
            doctor: "What brings you in today?",
            patient: "I've had a headache for three days."
          }
        }
      ]
    },

    {
      title: "Pronunciation Check",
      type: QuestionType.PRONUNCIATION_CHECK,
      questions: [
        {
          type: QuestionType.PRONUNCIATION_CHECK,
          word: "entrepreneur",
          correctPronunciation: "ahn-truh-pruh-NUR",
          audioUrl: "/audio/entrepreneur.mp3",
          commonErrors: ["entre-pre-neur", "anti-pre-neur"],
          tips: "Focus on the stress on the last syllable"
        },
        {
          type: QuestionType.PRONUNCIATION_CHECK,
          word: "specifically",
          correctPronunciation: "spuh-SI-fi-klee",
          audioUrl: "/audio/specifically.mp3",
          commonErrors: ["spa-ci-fi-cally", "spe-ci-fi-cally"],
          tips: "Pay attention to the unstressed first syllable"
        },
        {
          type: QuestionType.PRONUNCIATION_CHECK,
          word: "thoroughly",
          correctPronunciation: "THUR-oh-lee",
          audioUrl: "/audio/thoroughly.mp3",
          commonErrors: ["thor-ough-ly", "tho-rough-ly"],
          tips: "Focus on the three distinct syllables"
        }
      ]
    },

    {
      title: "Grammar Speaking",
      type: QuestionType.GRAMMAR_SPEAKING,
      questions: [
        {
          type: QuestionType.GRAMMAR_SPEAKING,
          prompt: "Create a sentence using the present perfect tense",
          example: "I have visited Paris three times",
          grammarPoint: "Present Perfect",
          context: "Experiences"
        },
        {
          type: QuestionType.GRAMMAR_SPEAKING,
          prompt: "Make a conditional sentence about your future plans",
          example: "If I get the job, I will move to London",
          grammarPoint: "First Conditional",
          context: "Future Possibilities"
        },
        {
          type: QuestionType.GRAMMAR_SPEAKING,
          prompt: "Use the past continuous to describe a past event",
          example: "I was working when she called",
          grammarPoint: "Past Continuous",
          context: "Past Actions"
        }
      ]
    },
    {
      title: "Debate Practice",
      type: QuestionType.DEBATE,
      questions: [
        {
          type: QuestionType.DEBATE,
          topic: "Should social media be regulated?",
          position: "For",
          prompt: "Present arguments supporting social media regulation",
          keyPoints: [
            "Data privacy concerns",
            "Impact on mental health",
            "Spread of misinformation"
          ],
          sampleAnswer: "I believe social media should be regulated because it significantly impacts data privacy and mental health..."
        },
        {
          type: QuestionType.DEBATE,
          topic: "Is remote work better than office work?",
          position: "Choose your position",
          prompt: "Discuss the advantages and disadvantages of remote work",
          keyPoints: [
            "Work-life balance",
            "Productivity levels",
            "Team collaboration"
          ],
          sampleAnswer: "Remote work offers better work-life balance and reduces commute time, however..."
        },
        {
          type: QuestionType.DEBATE,
          topic: "Should homework be abolished?",
          position: "Against",
          prompt: "Present arguments for keeping homework in schools",
          keyPoints: [
            "Reinforcement of learning",
            "Time management skills",
            "Independent study habits"
          ],
          sampleAnswer: "Homework plays a crucial role in education by reinforcing classroom learning..."
        }
      ]
    },

    {
      title: "Situational Roleplay",
      type: QuestionType.ROLEPLAY,
      questions: [
        {
          type: QuestionType.ROLEPLAY,
          scenario: "Resolving a Customer Complaint",
          role: "Customer Service Representative",
          prompt: "Handle an upset customer whose package hasn't arrived",
          sampleDialog: {
            customer: "My package was supposed to arrive last week!",
            representative: "I understand your frustration. Let me help track your package..."
          }
        },
        {
          type: QuestionType.ROLEPLAY,
          scenario: "Job Promotion Discussion",
          role: "Employee",
          prompt: "Request a promotion from your manager",
          sampleDialog: {
            employee: "I'd like to discuss my career growth opportunities...",
            manager: "Tell me about your achievements in your current role."
          }
        },
        {
          type: QuestionType.ROLEPLAY,
          scenario: "Hotel Check-in Problem",
          role: "Hotel Guest",
          prompt: "Handle a situation where your room reservation is missing",
          sampleDialog: {
            guest: "I have a confirmation email for my booking...",
            receptionist: "I apologize for the inconvenience. Let me check our system."
          }
        }
      ]
    },

    {
      title: "Impromptu Speaking",
      type: QuestionType.SPEAKING,
      questions: [
        {
          type: QuestionType.SPEAKING,
          prompt: "What would you do if you won a million dollars?",
          preparationTime: 30,
          speakingTime: 120,
          keyPoints: [
            "Initial reaction",
            "Practical decisions",
            "Long-term plans"
          ]
        },
        {
          type: QuestionType.SPEAKING,
          prompt: "Describe a person who has influenced your life",
          preparationTime: 30,
          speakingTime: 120,
          keyPoints: [
            "Who they are",
            "Their influence",
            "Specific examples"
          ]
        },
        {
          type: QuestionType.SPEAKING,
          prompt: "What changes would you make to improve your city?",
          preparationTime: 30,
          speakingTime: 120,
          keyPoints: [
            "Current problems",
            "Proposed solutions",
            "Expected benefits"
          ]
        }
      ]
    },

    {
      title: "Storytelling",
      type: QuestionType.STORYTELLING,
      questions: [
        {
          type: QuestionType.STORYTELLING,
          prompt: "Tell a story about a memorable travel experience",
          storyElements: {
            setting: "Time and place",
            characters: "People involved",
            plot: "What happened",
            conclusion: "What you learned"
          },
          sampleAnswer: "Last summer, while traveling in Japan..."
        },
        {
          type: QuestionType.STORYTELLING,
          prompt: "Share an embarrassing moment",
          storyElements: {
            setting: "When and where",
            situation: "What led to it",
            climax: "The embarrassing moment",
            resolution: "How you handled it"
          },
          sampleAnswer: "During my first presentation at work..."
        },
        {
          type: QuestionType.STORYTELLING,
          prompt: "Describe a challenging situation you overcame",
          storyElements: {
            challenge: "The problem",
            actions: "What you did",
            outcome: "The result",
            lessons: "What you learned"
          },
          sampleAnswer: "When I first moved to a new country..."
        }
      ]
    },

    {
      title: "Professional Presentation",
      type: QuestionType.PRESENTATION,
      questions: [
        {
          type: QuestionType.PRESENTATION,
          topic: "Company Quarterly Results",
          prompt: "Present the Q3 financial results to stakeholders",
          sections: [
            "Financial highlights",
            "Key achievements",
            "Future projections"
          ],
          duration: 300,
          samplePresentation: "Good morning everyone. Today I'll be presenting our Q3 results..."
        },
        {
          type: QuestionType.PRESENTATION,
          topic: "New Product Launch",
          prompt: "Present a new product to potential customers",
          sections: [
            "Product features",
            "Market benefits",
            "Pricing strategy"
          ],
          duration: 300,
          samplePresentation: "I'm excited to introduce our latest innovation..."
        },
        {
          type: QuestionType.PRESENTATION,
          topic: "Team Project Update",
          prompt: "Give a project status update to management",
          sections: [
            "Project progress",
            "Challenges faced",
            "Next steps"
          ],
          duration: 300,
          samplePresentation: "Thank you for joining this project update meeting..."
        }
      ]
    }
  ]
};
 
   