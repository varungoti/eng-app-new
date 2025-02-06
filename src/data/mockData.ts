import { Class, Lesson, Student, Assignment } from '@/types';

export const classes: Class[] = [
  {
    id: 1,
    name: 'Business English A1',
    level: 'Beginner',
    students: 15,
    schedule: 'Mon, Wed 10:00 AM',
    progress: 65,
    nextLesson: 'Professional Introductions'
  },
  {
    id: 2,
    name: 'Conversation B2',
    level: 'Intermediate',
    students: 12,
    schedule: 'Tue, Thu 2:00 PM',
    progress: 78,
    nextLesson: 'Debating Current Events'
  },
  {
    id: 3,
    name: 'Academic IELTS',
    level: 'Advanced',
    students: 8,
    schedule: 'Fri 9:00 AM',
    progress: 82,
    nextLesson: 'Essay Writing Techniques'
  }
];

export const upcomingClasses = [
  {
    id: 1,
    subject: 'English Literature',
    time: '09:00 AM',
    students: 28,
    topic: 'Shakespeare: Romeo & Juliet',
    room: 'Room 101',
  },
  {
    id: 2,
    subject: 'Creative Writing',
    time: '11:30 AM',
    students: 24,
    topic: 'Character Development',
    room: 'Room 203',
  },
  {
    id: 3,
    subject: 'Grammar Fundamentals',
    time: '02:00 PM',
    students: 26,
    topic: 'Advanced Verb Tenses',
    room: 'Room 105',
  },
];

export const topStudents = [
  {
    id: 1,
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    progress: 92,
    trend: 'up',
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    progress: 88,
    trend: 'up',
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    progress: 85,
    trend: 'stable',
  },
];

export const classesData = [
  {
    id: 1,
    name: 'Grade 1-A',
    schedule: 'Mon - Sun, 8:00 AM - 9:00 AM',  // 1 hour per day
    students: 15,
    gradeLevel: '1st Grade',
    createdAt: new Date(),
    maxStudents: 30,
    lessonIds: [101, 102],
    assignments: [201, 202, 203],
    studentIds: Array(15).fill(0).map((_, i) => i + 1),  // Array of student IDs
  },
  {
    id: 2,
    schedule: 'Mon - Fri, 9:00 PM - 10:00 PM',  // 1 hour per day
    name: 'Grade 2',
    students: 30,
    gradeLevel: '2st Grade',
    createdAt: new Date(),
    maxStudents: 30,
    lessonIds: [101, 102],
    assignments: [201, 202, 203],
    studentIds: Array(15).fill(0).map((_, i) => i + 1),  // Array of student IDs
  },
  {
    id: 3,
    name: 'Grade 3',
    schedule: 'Mon - Fri, 10:00 AM - 11:00 AM',  // 1 hour per day
    students: 36,
  },
  {
    id: 4,
    name: 'Grade 4',
    schedule: 'Mon - Fri, 11:00 AM - 7:00 PM',  // 1 hour per day
    students: 26,
  },
  {
    id: 5,
    name: 'Grade 5',
    schedule: 'Mon - Fri, 12:00 PM - 1:00 PM',  // 1 hour per day
    students: 40,
  },
  {
    id: 6,
    name: 'Grade 6',
    schedule: 'Mon - Fri, 1:00 PM - 2:00 PM',  // 1 hour per day
    students: 40,
  },
  // Additional grades with adjusted times
  // {
  //   id: 7,
  //   name: 'Grade 7',
  //   schedule: 'Mon - Fri, 2:00 PM - 3:00 PM',  // 1 hour per day
  //   students: 40,
  // },
  // {
  //   id: 8,
  //   name: 'Grade 8',
  //   schedule: 'Mon - Fri, 3:00 PM - 4:00 PM',  // 1 hour per day
  //   students: 40,
  // },
  // {
  //   id: 9,
  //   name: 'Grade 9',
  //   schedule: 'Mon - Fri, 4:00 PM - 5:00 PM',  // 1 hour per day
  //   students: 40,
  // },
  // {
  //   id: 10,
  //   name: 'Grade 10',
  //   schedule: 'Mon - Fri, 5:00 PM - 6:00 PM',  // 1 hour per day
  //   students: 40,
  // },
];

export const lessonsData12 = [
  {
    "id": 1,
    "classId": 1,
    "title": "Greeting",
    "topic": "Greetings & Introductions",
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
        "completed": false,
        "type": "Speaking Practice",
        "title": "Saying 'Hello' and 'Goodbye'",
        "questions": [
          {
            "id": 1001,
            "type": "speaking",
            "prompt": "Say 'Hello' to someone",
            "sampleAnswer": "Hello!",
            "teacherScript": "Hello, children! How are you today? I am so happy to see all of you! Today, we are going to learn how to say 'Hello' and 'Goodbye' in English! Ready? Let's go!"
          },
          {
            "id": 1002,
            "type": "speaking",
            "prompt": "Say 'Goodbye' to someone",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now, when you leave someone, you say: 'GOODBYE!' Can you say it with me? Let's say: 'GOODBYE!' Well done! Let's say it together again: 'GOODBYE!' You did so well!"
          },
          {
            "id": 1003,
            "type": "speaking",
            "prompt": "Say 'Hello' and wave",
            "sampleAnswer": "Hello!",
            "teacherScript": "Let's say 'Hello' again, but this time wave your hand. Say 'Hello!' while you wave!"
          },
          {
            "id": 1004,
            "type": "speaking",
            "prompt": "Say 'Goodbye' and wave",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now let's say 'Goodbye!' while waving our hand. Say 'Goodbye!'"
          },
          {
            "id": 1005,
            "type": "speaking",
            "prompt": "Practice saying 'Hello' with a smile",
            "sampleAnswer": "Hello!",
            "teacherScript": "Say 'Hello' with a big smile. Smiling makes people happy when you say 'Hello!'"
          },
          {
            "id": 1006,
            "type": "speaking",
            "prompt": "Practice saying 'Goodbye' with a smile",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now let's practice saying 'Goodbye' with a smile. Smiling makes saying 'Goodbye' even nicer!"
          },
          {
            "id": 1007,
            "type": "speaking",
            "prompt": "Say 'Good morning' to greet someone",
            "sampleAnswer": "Good morning!",
            "teacherScript": "In the morning, we can say 'Good morning!' Let's say it together!"
          },
          {
            "id": 1008,
            "type": "speaking",
            "prompt": "Say 'Good night' to someone",
            "sampleAnswer": "Good night!",
            "teacherScript": "At night, we say 'Good night!' Can you say that with me? 'Good night!'"
          },
          {
            "id": 1009,
            "type": "speaking",
            "prompt": "Ask someone if they know how to say 'Hello' in another language",
            "sampleAnswer": "Do you know how to say 'Hello' in another language?",
            "teacherScript": "It's fun to know how to say 'Hello' in different languages. Ask someone, 'Do you know how to say 'Hello' in another language?'"
          },
          {
            "id": 1010,
            "type": "speaking",
            "prompt": "Tell someone that 'Goodbye' means you will see them again",
            "sampleAnswer": "'Goodbye' means we will see each other again!",
            "teacherScript": "Explain that saying 'Goodbye' means we'll meet again soon!"
          }
        ]
      },
      {
        "id": 102,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Asking 'How Are You?'",
        "questions": [
          {
            "id": 1011,
            "type": "speaking",
            "prompt": "Ask someone how they are",
            "sampleAnswer": "How are you?",
            "teacherScript": "Now, let's learn how to ask someone, 'How are you?' in English! When you meet someone, you can say: 'How are YOU?' Can you say it with me?"
          },
          {
            "id": 1012,
            "type": "speaking",
            "prompt": "Respond to 'How are you?'",
            "sampleAnswer": "I'm good! / I'm happy!",
            "teacherScript": "Now, let's answer! You can say: 'I'm good!' Or: 'I'm happy!' Let's try it together! 'I'm good!' Great! Let's say: 'I'm happy!' You did an amazing job!"
          },
          {
            "id": 1013,
            "type": "speaking",
            "prompt": "Ask someone 'How was your day?'",
            "sampleAnswer": "How was your day?",
            "teacherScript": "Another way to ask someone about their day is to say, 'How was your day?' Let's try it together!"
          },
          {
            "id": 1014,
            "type": "speaking",
            "prompt": "Respond to 'How was your day?' with a positive answer",
            "sampleAnswer": "My day was great!",
            "teacherScript": "If someone asks you 'How was your day?' you can answer: 'My day was great!' Try saying it with me!"
          },
          {
            "id": 1015,
            "type": "speaking",
            "prompt": "Say 'I'm happy to see you!' to someone",
            "sampleAnswer": "I'm happy to see you!",
            "teacherScript": "When you see someone, you can say, 'I'm happy to see you!' Let's try it together!"
          },
          {
            "id": 1016,
            "type": "speaking",
            "prompt": "Ask someone 'How do you feel today?'",
            "sampleAnswer": "How do you feel today?",
            "teacherScript": "You can ask, 'How do you feel today?' to find out how someone is feeling."
          },
          {
            "id": 1017,
            "type": "speaking",
            "prompt": "Say 'I feel good!'",
            "sampleAnswer": "I feel good!",
            "teacherScript": "When someone asks how you feel, you can say, 'I feel good!' Try saying it!"
          },
          {
            "id": 1018,
            "type": "speaking",
            "prompt": "Ask someone 'What's up?'",
            "sampleAnswer": "What's up?",
            "teacherScript": "'What's up?' is another way to ask someone how they are. Let's say it together!"
          },
          {
            "id": 1019,
            "type": "speaking",
            "prompt": "Respond to 'What's up?' with 'Not much!'",
            "sampleAnswer": "Not much!",
            "teacherScript": "When someone says 'What's up?' you can respond with 'Not much!' Let's try it!"
          },
          {
            "id": 1020,
            "type": "speaking",
            "prompt": "Ask someone if they are happy",
            "sampleAnswer": "Are you happy?",
            "teacherScript": "It's nice to check if someone is happy. Try saying, 'Are you happy?'"
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "classId": 1,
    "title": "Family",
    "topic": "Family and Friends",
    "duration": 60,
    "lessonNumber": "2",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-green-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 201,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Talking About Family",
        "questions": [
          {
            "id": 2001,
            "type": "speaking",
            "prompt": "Name family members",
            "sampleAnswer": "Mother, Father, Brother, Sister",
            "teacherScript": "Today, we are going to talk about our families! Family is very important. Let's learn the words for family in English. Ready? 'Mother', 'Father', 'Brother', 'Sister'"
          },
          {
            "id": 2002,
            "type": "speaking",
            "prompt": "Introduce your family member",
            "sampleAnswer": "My mother is [name].",
            "teacherScript": "Now, let's introduce a family member. Say, 'My mother is [name].'"
          },
          {
            "id": 2003,
            "type": "speaking",
            "prompt": "Say 'I have a brother.'",
            "sampleAnswer": "I have a brother.",
            "teacherScript": "If you have a brother, you can say: 'I have a brother.' Repeat after me!"
          },
          {
            "id": 2004,
            "type": "speaking",
            "prompt": "Say 'I love my family!'",
            "sampleAnswer": "I love my family!",
            "teacherScript": "Let's say it together with love, 'I love my family!'"
          },
          {
            "id": 2005,
            "type": "speaking",
            "prompt": "Name a family member who makes you smile",
            "sampleAnswer": "My sister makes me smile.",
            "teacherScript": "Think of a family member who makes you happy. Now, say their name and say 'makes me smile.'"
          },
          {
            "id": 2006,
            "type": "speaking",
            "prompt": "Say 'My family is special to me.'",
            "sampleAnswer": "My family is special to me.",
            "teacherScript": "Families are special! Let's say: 'My family is special to me.'"
          },
          {
            "id": 2007,
            "type": "speaking",
            "prompt": "Tell someone about a family tradition",
            "sampleAnswer": "In my family, we [tradition].",
            "teacherScript": "Think of something your family always does together. You can say, 'In my family, we [tradition].'"
          },
          {
            "id": 2008,
            "type": "speaking",
            "prompt": "Say 'My family lives together.'",
            "sampleAnswer": "My family lives together.",
            "teacherScript": "We can say: 'My family lives together.' Repeat after me!"
          },
          {
            "id": 2009,
            "type": "speaking",
            "prompt": "Describe a family meal",
            "sampleAnswer": "We eat dinner together every night.",
            "teacherScript": "Let's talk about our family meals. Say, 'We eat dinner together every night.'"
          },
          {
            "id": 2010,
            "type": "speaking",
            "prompt": "Say 'Family means love.'",
            "sampleAnswer": "Family means love.",
            "teacherScript": "Yes! Family means love. Let's say it together: 'Family means love.'"
          }
        ]
      }
    ]
  }
]

export const lessonsData = [
  {
    "id": 1,
    "classId": 1,
    "title": "Greeting",
    "topic": "Greetings & Introductions",
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
        "completed": false,
        "type": "Speaking Practice",
        "title": "Saying 'Hello' and 'Goodbye'",
        "questions": [
          {
            "id": 1001,
            "type": "speaking",
            "prompt": "Say 'Hello' to someone",
            "sampleAnswer": "Hello!",
            "teacherScript": "Hello, children! How are you today? I am so happy to see all of you! Today, we are going to learn how to say 'Hello' and 'Goodbye' in English! Ready? Let's go!"
          },
          {
            "id": 1002,
            "type": "speaking",
            "prompt": "Say 'Goodbye' to someone",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now, when you leave someone, you say: 'GOODBYE!' Can you say it with me? Let's say: 'GOODBYE!' Well done! Let's say it together again: 'GOODBYE!' You did so well!"
          },
          {
            "id": 1003,
            "type": "speaking",
            "prompt": "Say 'Hello' and wave",
            "sampleAnswer": "Hello!",
            "teacherScript": "Let's say 'Hello' again, but this time wave your hand. Say 'Hello!' while you wave!"
          },
          {
            "id": 1004,
            "type": "speaking",
            "prompt": "Say 'Goodbye' and wave",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now let's say 'Goodbye!' while waving our hand. Say 'Goodbye!'"
          },
          {
            "id": 1005,
            "type": "speaking",
            "prompt": "Practice saying 'Hello' with a smile",
            "sampleAnswer": "Hello!",
            "teacherScript": "Say 'Hello' with a big smile. Smiling makes people happy when you say 'Hello!'"
          },
          {
            "id": 1006,
            "type": "speaking",
            "prompt": "Practice saying 'Goodbye' with a smile",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now let's practice saying 'Goodbye' with a smile. Smiling makes saying 'Goodbye' even nicer!"
          },
          {
            "id": 1007,
            "type": "speaking",
            "prompt": "Say 'Good morning' to greet someone",
            "sampleAnswer": "Good morning!",
            "teacherScript": "In the morning, we can say 'Good morning!' Let's say it together!"
          },
          {
            "id": 1008,
            "type": "speaking",
            "prompt": "Say 'Good night' to someone",
            "sampleAnswer": "Good night!",
            "teacherScript": "At night, we say 'Good night!' Can you say that with me? 'Good night!'"
          },
          {
            "id": 1009,
            "type": "speaking",
            "prompt": "Ask someone if they know how to say 'Hello' in another language",
            "sampleAnswer": "Do you know how to say 'Hello' in another language?",
            "teacherScript": "It's fun to know how to say 'Hello' in different languages. Ask someone, 'Do you know how to say 'Hello' in another language?'"
          },
          {
            "id": 1010,
            "type": "speaking",
            "prompt": "Tell someone that 'Goodbye' means you will see them again",
            "sampleAnswer": "'Goodbye' means we will see each other again!",
            "teacherScript": "Explain that saying 'Goodbye' means we'll meet again soon!"
          }
        ]
      },
      {
        "id": 102,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Asking 'How Are You?'",
        "questions": [
          {
            "id": 1011,
            "type": "speaking",
            "prompt": "Ask someone how they are",
            "sampleAnswer": "How are you?",
            "teacherScript": "Now, let's learn how to ask someone, 'How are you?' in English! When you meet someone, you can say: 'How are YOU?' Can you say it with me?"
          },
          {
            "id": 1012,
            "type": "speaking",
            "prompt": "Respond to 'How are you?'",
            "sampleAnswer": "I'm good! / I'm happy!",
            "teacherScript": "Now, let's answer! You can say: 'I'm good!' Or: 'I'm happy!' Let's try it together! 'I'm good!' Great! Let's say: 'I'm happy!' You did an amazing job!"
          },
          {
            "id": 1013,
            "type": "speaking",
            "prompt": "Ask someone 'How was your day?'",
            "sampleAnswer": "How was your day?",
            "teacherScript": "Another way to ask someone about their day is to say, 'How was your day?' Let's try it together!"
          },
          {
            "id": 1014,
            "type": "speaking",
            "prompt": "Respond to 'How was your day?' with a positive answer",
            "sampleAnswer": "My day was great!",
            "teacherScript": "If someone asks you 'How was your day?' you can answer: 'My day was great!' Try saying it with me!"
          },
          {
            "id": 1015,
            "type": "speaking",
            "prompt": "Say 'I'm happy to see you!' to someone",
            "sampleAnswer": "I'm happy to see you!",
            "teacherScript": "When you see someone, you can say, 'I'm happy to see you!' Let's try it together!"
          },
          {
            "id": 1016,
            "type": "speaking",
            "prompt": "Ask someone 'How do you feel today?'",
            "sampleAnswer": "How do you feel today?",
            "teacherScript": "You can ask, 'How do you feel today?' to find out how someone is feeling."
          },
          {
            "id": 1017,
            "type": "speaking",
            "prompt": "Say 'I feel good!'",
            "sampleAnswer": "I feel good!",
            "teacherScript": "When someone asks how you feel, you can say, 'I feel good!' Try saying it!"
          },
          {
            "id": 1018,
            "type": "speaking",
            "prompt": "Ask someone 'What's up?'",
            "sampleAnswer": "What's up?",
            "teacherScript": "'What's up?' is another way to ask someone how they are. Let's say it together!"
          },
          {
            "id": 1019,
            "type": "speaking",
            "prompt": "Respond to 'What's up?' with 'Not much!'",
            "sampleAnswer": "Not much!",
            "teacherScript": "When someone says 'What's up?' you can respond with 'Not much!' Let's try it!"
          },
          {
            "id": 1020,
            "type": "speaking",
            "prompt": "Ask someone if they are happy",
            "sampleAnswer": "Are you happy?",
            "teacherScript": "It's nice to check if someone is happy. Try saying, 'Are you happy?'"
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "classId": 1,
    "title": "Family",
    "topic": "Family and Friends",
    "duration": 60,
    "lessonNumber": "2",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-green-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 201,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Talking About Family",
        "questions": [
          {
            "id": 2001,
            "type": "speaking",
            "prompt": "Name family members",
            "sampleAnswer": "Mother, Father, Brother, Sister",
            "teacherScript": "Today, we are going to talk about our families! Family is very important. Let's learn the words for family in English. Ready? 'Mother', 'Father', 'Brother', 'Sister'"
          },
          {
            "id": 2002,
            "type": "speaking",
            "prompt": "Introduce your family member",
            "sampleAnswer": "My mother is [name].",
            "teacherScript": "Now, let's introduce a family member. Say, 'My mother is [name].'"
          },
          {
            "id": 2003,
            "type": "speaking",
            "prompt": "Say 'I have a brother.'",
            "sampleAnswer": "I have a brother.",
            "teacherScript": "If you have a brother, you can say: 'I have a brother.' Repeat after me!"
          },
          {
            "id": 2004,
            "type": "speaking",
            "prompt": "Say 'I love my family!'",
            "sampleAnswer": "I love my family!",
            "teacherScript": "Let's say it together with love, 'I love my family!'"
          },
          {
            "id": 2005,
            "type": "speaking",
            "prompt": "Name a family member who makes you smile",
            "sampleAnswer": "My sister makes me smile.",
            "teacherScript": "Think of a family member who makes you happy. Now, say their name and say 'makes me smile.'"
          },
          {
            "id": 2006,
            "type": "speaking",
            "prompt": "Say 'My family is special to me.'",
            "sampleAnswer": "My family is special to me.",
            "teacherScript": "Families are special! Let's say: 'My family is special to me.'"
          },
          {
            "id": 2007,
            "type": "speaking",
            "prompt": "Tell someone about a family tradition",
            "sampleAnswer": "In my family, we [tradition].",
            "teacherScript": "Think of something your family always does together. You can say, 'In my family, we [tradition].'"
          },
          {
            "id": 2008,
            "type": "speaking",
            "prompt": "Say 'My family lives together.'",
            "sampleAnswer": "My family lives together.",
            "teacherScript": "We can say: 'My family lives together.' Repeat after me!"
          },
          {
            "id": 2009,
            "type": "speaking",
            "prompt": "Describe a family meal",
            "sampleAnswer": "We eat dinner together every night.",
            "teacherScript": "Let's talk about our family meals. Say, 'We eat dinner together every night.'"
          },
          {
            "id": 2010,
            "type": "speaking",
            "prompt": "Say 'Family means love.'",
            "sampleAnswer": "Family means love.",
            "teacherScript": "Yes! Family means love. Let's say it together: 'Family means love.'"
          }
        ]
      }
    ]
  },
 
{
    "id": 3,
    "classId": 1,
    "title": "Numbers",
    "topic": "Numbers and Counting",
    "duration": 60,
    "lessonNumber": "3",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-yellow-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 301,
        "unlocked": true,
        "completed": false,
        "type": "Counting Practice",
        "title": "Counting to 10",
        "questions": [
          {
            "id": 3001,
            "type": "speaking",
            "prompt": "Count from 1 to 10 out loud",
            "sampleAnswer": "One, two, three, four, five, six, seven, eight, nine, ten",
            "teacherScript": "Today, we're going to practice counting from 1 to 10. Ready? Let's go together: One, two, three, four, five, six, seven, eight, nine, ten!"
          },
          {
            "id": 3002,
            "type": "speaking",
            "prompt": "Say the number 'three'",
            "sampleAnswer": "Three",
            "teacherScript": "Let's say the number three. Repeat after me: 'Three!' Great job!"
          },
          {
            "id": 3003,
            "type": "speaking",
            "prompt": "Say the number 'seven'",
            "sampleAnswer": "Seven",
            "teacherScript": "Now let's say the number 'seven' together. 'Seven!' Well done!"
          },
          {
            "id": 3004,
            "type": "speaking",
            "prompt": "Count backwards from 10 to 1",
            "sampleAnswer": "Ten, nine, eight, seven, six, five, four, three, two, one",
            "teacherScript": "Now let's count backwards from 10! Ready? Ten, nine, eight, seven, six, five, four, three, two, one!"
          },
          {
            "id": 3005,
            "type": "speaking",
            "prompt": "Say 'I can count to ten!'",
            "sampleAnswer": "I can count to ten!",
            "teacherScript": "Let's say proudly: 'I can count to ten!' Great job!"
          },
          {
            "id": 3006,
            "type": "speaking",
            "prompt": "Count only even numbers from 2 to 10",
            "sampleAnswer": "Two, four, six, eight, ten",
            "teacherScript": "Let's count just the even numbers: Two, four, six, eight, ten!"
          },
          {
            "id": 3007,
            "type": "speaking",
            "prompt": "Count only odd numbers from 1 to 9",
            "sampleAnswer": "One, three, five, seven, nine",
            "teacherScript": "Now let's count only the odd numbers: One, three, five, seven, nine!"
          },
          {
            "id": 3008,
            "type": "speaking",
            "prompt": "Say 'Ten is the biggest number in our counting today.'",
            "sampleAnswer": "Ten is the biggest number in our counting today.",
            "teacherScript": "Today, ten is the highest number. Let's say: 'Ten is the biggest number in our counting today.'"
          },
          {
            "id": 3009,
            "type": "speaking",
            "prompt": "Say 'One is the smallest number in our counting today.'",
            "sampleAnswer": "One is the smallest number in our counting today.",
            "teacherScript": "And one is our smallest number. Let's say: 'One is the smallest number in our counting today.'"
          },
          {
            "id": 3010,
            "type": "speaking",
            "prompt": "Ask a friend to count from 1 to 5",
            "sampleAnswer": "Can you count from 1 to 5?",
            "teacherScript": "It's fun to count together! Ask a friend, 'Can you count from 1 to 5?'"
          }
        ]
      },
      {
        "id": 302,
        "unlocked": true,
        "completed": false,
        "type": "Counting Practice",
        "title": "Counting Objects",
        "questions": [
          {
            "id": 3011,
            "type": "speaking",
            "prompt": "Count 3 pencils",
            "sampleAnswer": "One, two, three",
            "teacherScript": "Look, we have three pencils. Let's count them together: One, two, three!"
          },
          {
            "id": 3012,
            "type": "speaking",
            "prompt": "Count 5 books",
            "sampleAnswer": "One, two, three, four, five",
            "teacherScript": "Here are five books. Let's count them: One, two, three, four, five!"
          },
          {
            "id": 3013,
            "type": "speaking",
            "prompt": "Ask someone how many toys they have",
            "sampleAnswer": "How many toys do you have?",
            "teacherScript": "Let's ask a friend, 'How many toys do you have?'"
          },
          {
            "id": 3014,
            "type": "speaking",
            "prompt": "Count 4 apples",
            "sampleAnswer": "One, two, three, four",
            "teacherScript": "Here are four apples. Let's count them: One, two, three, four!"
          },
          {
            "id": 3015,
            "type": "speaking",
            "prompt": "Say 'I can count five fingers!'",
            "sampleAnswer": "I can count five fingers!",
            "teacherScript": "Let's say: 'I can count five fingers!'"
          },
          {
            "id": 3016,
            "type": "speaking",
            "prompt": "Count 6 crayons",
            "sampleAnswer": "One, two, three, four, five, six",
            "teacherScript": "Look at these crayons. Let's count them together: One, two, three, four, five, six!"
          },
          {
            "id": 3017,
            "type": "speaking",
            "prompt": "Count 2 hats",
            "sampleAnswer": "One, two",
            "teacherScript": "Here are two hats. Let's count them: One, two!"
          },
          {
            "id": 3018,
            "type": "speaking",
            "prompt": "Say 'Counting helps us know how many things we have.'",
            "sampleAnswer": "Counting helps us know how many things we have.",
            "teacherScript": "Let's say: 'Counting helps us know how many things we have.'"
          },
          {
            "id": 3019,
            "type": "speaking",
            "prompt": "Count 7 buttons",
            "sampleAnswer": "One, two, three, four, five, six, seven",
            "teacherScript": "Look at these buttons. Let's count them: One, two, three, four, five, six, seven!"
          },
          {
            "id": 3020,
            "type": "speaking",
            "prompt": "Ask someone if they know how to count to ten",
            "sampleAnswer": "Can you count to ten?",
            "teacherScript": "Ask your friend, 'Can you count to ten?'"
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "classId": 1,
    "title": "Colors",
    "topic": "Learning Colors",
    "duration": 60,
    "lessonNumber": "4",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-red-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 401,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Basic Colors",
        "questions": [
          {
            "id": 4001,
            "type": "speaking",
            "prompt": "Say the color 'red'",
            "sampleAnswer": "Red",
            "teacherScript": "Today, we're going to learn colors! Let's start with 'Red.' Say it with me: 'Red!'"
          },
          {
            "id": 4002,
            "type": "speaking",
            "prompt": "Say the color 'blue'",
            "sampleAnswer": "Blue",
            "teacherScript": "Now let's say the color 'Blue.' Repeat after me: 'Blue!'"
          },
          {
            "id": 4003,
            "type": "speaking",
            "prompt": "Point to something green",
            "sampleAnswer": "Green",
            "teacherScript": "Can you point to something green around you? Say 'Green' while you point to it!"
          },
          {
            "id": 4004,
            "type": "speaking",
            "prompt": "Say the color 'yellow'",
            "sampleAnswer": "Yellow",
            "teacherScript": "Let's try the color 'Yellow.' Say it with me: 'Yellow!'"
          },
          {
            "id": 4005,
            "type": "speaking",
            "prompt": "Say 'I like the color orange.'",
            "sampleAnswer": "I like the color orange.",
            "teacherScript": "Let's say: 'I like the color orange.' Well done!"
          }
        ]
      }
    ]
  },
 
{
    "id": 5,
    "classId": 1,
    "title": "Shapes",
    "topic": "Learning Shapes",
    "duration": 60,
    "lessonNumber": "5",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-blue-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 501,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Basic Shapes",
        "questions": [
          {
            "id": 5001,
            "type": "speaking",
            "prompt": "Say the shape 'circle'",
            "sampleAnswer": "Circle",
            "teacherScript": "Let's start with the shape 'Circle.' Say it with me: 'Circle!'"
          },
          {
            "id": 5002,
            "type": "speaking",
            "prompt": "Say the shape 'square'",
            "sampleAnswer": "Square",
            "teacherScript": "Now, let's say 'Square.' Repeat after me: 'Square!'"
          },
          {
            "id": 5003,
            "type": "speaking",
            "prompt": "Point to something shaped like a triangle",
            "sampleAnswer": "Triangle",
            "teacherScript": "Can you find something that looks like a triangle? Say 'Triangle' as you point to it!"
          },
          {
            "id": 5004,
            "type": "speaking",
            "prompt": "Say the shape 'rectangle'",
            "sampleAnswer": "Rectangle",
            "teacherScript": "Next, let's say the shape 'Rectangle.' Say it with me: 'Rectangle!'"
          },
          {
            "id": 5005,
            "type": "speaking",
            "prompt": "Say 'I like the shape star.'",
            "sampleAnswer": "I like the shape star.",
            "teacherScript": "Let's say: 'I like the shape star.' Great job!"
          },
          {
            "id": 5006,
            "type": "speaking",
            "prompt": "Say the shape 'oval'",
            "sampleAnswer": "Oval",
            "teacherScript": "Here's the shape 'Oval.' Say it with me: 'Oval!'"
          },
          {
            "id": 5007,
            "type": "speaking",
            "prompt": "Say 'I can see a square!'",
            "sampleAnswer": "I can see a square!",
            "teacherScript": "Let's say: 'I can see a square!' Look around for a square!"
          },
          {
            "id": 5008,
            "type": "speaking",
            "prompt": "Say 'I can see a triangle!'",
            "sampleAnswer": "I can see a triangle!",
            "teacherScript": "Let's say: 'I can see a triangle!' Look for something shaped like a triangle!"
          }
        ]
      },
      {
        "id": 502,
        "unlocked": true,
        "completed": false,
        "type": "Identifying Shapes",
        "title": "Recognizing Shapes in Objects",
        "questions": [
          {
            "id": 5021,
            "type": "speaking",
            "prompt": "Point to a circle-shaped object",
            "sampleAnswer": "Circle",
            "teacherScript": "Can you find something shaped like a circle? Point to it and say 'Circle!'"
          },
          {
            "id": 5022,
            "type": "speaking",
            "prompt": "Point to a square-shaped object",
            "sampleAnswer": "Square",
            "teacherScript": "Now find something shaped like a square. Point to it and say 'Square!'"
          },
          {
            "id": 5023,
            "type": "speaking",
            "prompt": "Point to a triangle-shaped object",
            "sampleAnswer": "Triangle",
            "teacherScript": "Let's find something that looks like a triangle. Point to it and say 'Triangle!'"
          },
          {
            "id": 5024,
            "type": "speaking",
            "prompt": "Point to a rectangle-shaped object",
            "sampleAnswer": "Rectangle",
            "teacherScript": "Find something shaped like a rectangle and say 'Rectangle!'"
          },
          {
            "id": 5025,
            "type": "speaking",
            "prompt": "Point to a star-shaped object",
            "sampleAnswer": "Star",
            "teacherScript": "Look for something shaped like a star and say 'Star!'"
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "classId": 1,
    "title": "Animals",
    "topic": "Learning About Animals",
    "duration": 60,
    "lessonNumber": "6",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-green-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 601,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Common Animals",
        "questions": [
          {
            "id": 6001,
            "type": "speaking",
            "prompt": "Say the animal 'dog'",
            "sampleAnswer": "Dog",
            "teacherScript": "Let's start with the animal 'Dog.' Say it with me: 'Dog!'"
          },
          {
            "id": 6002,
            "type": "speaking",
            "prompt": "Say the animal 'cat'",
            "sampleAnswer": "Cat",
            "teacherScript": "Now, let's say 'Cat.' Repeat after me: 'Cat!'"
          },
          {
            "id": 6003,
            "type": "speaking",
            "prompt": "Say the animal 'elephant'",
            "sampleAnswer": "Elephant",
            "teacherScript": "Next, let's say the animal 'Elephant.' Say it with me: 'Elephant!'"
          },
          {
            "id": 6004,
            "type": "speaking",
            "prompt": "Say the animal 'lion'",
            "sampleAnswer": "Lion",
            "teacherScript": "Let's say 'Lion.' Repeat after me: 'Lion!'"
          },
          {
            "id": 6005,
            "type": "speaking",
            "prompt": "Say the animal 'tiger'",
            "sampleAnswer": "Tiger",
            "teacherScript": "Now, let's say 'Tiger.' Say it with me: 'Tiger!'"
          }
        ]
      },
      {
        "id": 602,
        "unlocked": true,
        "completed": false,
        "type": "Identifying Animals",
        "title": "Recognizing Animals in Pictures",
        "questions": [
          {
            "id": 6021,
            "type": "speaking",
            "prompt": "Point to a picture of a dog",
            "sampleAnswer": "Dog",
            "teacherScript": "Can you find a picture of a dog? Point to it and say 'Dog!'"
          },
          {
            "id": 6022,
            "type": "speaking",
            "prompt": "Point to a picture of a cat",
            "sampleAnswer": "Cat",
            "teacherScript": "Now, find a picture of a cat. Point to it and say 'Cat!'"
          },
          {
            "id": 6023,
            "type": "speaking",
            "prompt": "Point to a picture of an elephant",
            "sampleAnswer": "Elephant",
            "teacherScript": "Look for a picture of an elephant. Point to it and say 'Elephant!'"
          },
          {
            "id": 6024,
            "type": "speaking",
            "prompt": "Point to a picture of a lion",
            "sampleAnswer": "Lion",
            "teacherScript": "Find a picture of a lion. Point to it and say 'Lion!'"
          },
          {
            "id": 6025,
            "type": "speaking",
            "prompt": "Point to a picture of a tiger",
            "sampleAnswer": "Tiger",
            "teacherScript": "Look for a picture of a tiger. Point to it and say 'Tiger!'"
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "classId": 1,
    "title": "Weather",
    "topic": "Understanding Weather",
    "duration": 60,
    "lessonNumber": "7",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-purple-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 701,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Weather Vocabulary",
        "questions": [
          {
            "id": 7001,
            "type": "speaking",
            "prompt": "Say the word 'sunny'",
            "sampleAnswer": "Sunny",
            "teacherScript": "Let's start with the weather word 'Sunny.' Say it with me: 'Sunny!'"
          },
          {
            "id": 7002,
            "type": "speaking",
            "prompt": "Say the word 'rainy'",
            "sampleAnswer": "Rainy",
            "teacherScript": "Now, let's say 'Rainy.' Repeat after me: 'Rainy!'"
          },
          {
            "id": 7003,
            "type": "speaking",
            "prompt": "Say the word 'cloudy'",
            "sampleAnswer": "Cloudy",
            "teacherScript": "Next, let's say 'Cloudy.' Say it with me: 'Cloudy!'"
          },
          {
            "id": 7004,
            "type": "speaking",
            "prompt": "Say the word 'windy'",
            "sampleAnswer": "Windy",
            "teacherScript": "Let's say 'Windy.' Repeat after me: 'Windy!'"
          },
          {
            "id": 7005,
            "type": "speaking",
            "prompt": "Say the word 'snowy'",
            "sampleAnswer": "Snowy",
            "teacherScript": "Now, let's say 'Snowy.' Say it with me: 'Snowy!'"
          }
        ]
      },
      {
        "id": 702,
        "unlocked": true,
        "completed": false,
        "type": "Identifying Weather",
        "title": "Recognizing Weather Conditions",
        "questions": [
          {
            "id": 7021,
            "type": "speaking",
            "prompt": "Say 'It's sunny outside.'",
            "sampleAnswer": "It's sunny outside.",
            "teacherScript": "Let's say: 'It's sunny outside.' Look outside and say what you see!"
          },
          {
            "id": 7022,
            "type": "speaking",
            "prompt": "Say 'It's raining today.'",
            "sampleAnswer": "It's raining today.",
            "teacherScript": "Say: 'It's raining today.' Is it raining outside? Try saying it!"
          },
          {
            "id": 7023,
            "type": "speaking",
            "prompt": "Say 'It's cloudy today.'",
            "sampleAnswer": "It's cloudy today.",
            "teacherScript": "Let's say: 'It's cloudy today.' Look at the sky and say what you see!"
          },
          {
            "id": 7024,
            "type": "speaking",
            "prompt": "Say 'It's windy outside.'",
            "sampleAnswer": "It's windy outside.",
            "teacherScript": "Say: 'It's windy outside.' Is the wind blowing today?"
          },
          {
            "id": 7025,
            "type": "speaking",
            "prompt": "Say 'It's snowing today.'",
            "sampleAnswer": "It's snowing today.",
            "teacherScript": "Let's say: 'It's snowing today.' Is it snowing outside?"
          }
        ]
      }
    ]
  },

{
  "id": 8,
  "classId": 1,
  "title": "Colors",
  "topic": "Learning Colors",
  "duration": 60,
  "lessonNumber": "8",
  "totalTopics": "12",
  "difficulty": "Beginner",
  "color": "bg-red-500",
  "unlocked": true,
  "completed": false,
  "subLessons": [
    {
      "id": 801,
      "unlocked": true,
      "completed": false,
      "type": "Vocabulary",
      "title": "Color Vocabulary",
      "questions": [
        {
          "id": 8001,
          "type": "speaking",
          "prompt": "Say the color 'red'",
          "sampleAnswer": "Red",
          "teacherScript": "Let's start with the color 'Red.' Say it with me: 'Red!'"
        },
        {
          "id": 8002,
          "type": "speaking",
          "prompt": "Say the color 'blue'",
          "sampleAnswer": "Blue",
          "teacherScript": "Now, let's say 'Blue.' Repeat after me: 'Blue!'"
        },
        {
          "id": 8003,
          "type": "speaking",
          "prompt": "Say the color 'green'",
          "sampleAnswer": "Green",
          "teacherScript": "Next, let's say 'Green.' Say it with me: 'Green!'"
        },
        {
          "id": 8004,
          "type": "speaking",
          "prompt": "Say the color 'yellow'",
          "sampleAnswer": "Yellow",
          "teacherScript": "Let's say 'Yellow.' Repeat after me: 'Yellow!'"
        },
        {
          "id": 8005,
          "type": "speaking",
          "prompt": "Say the color 'orange'",
          "sampleAnswer": "Orange",
          "teacherScript": "Now, let's say 'Orange.' Say it with me: 'Orange!'"
        },
        {
          "id": 8006,
          "type": "speaking",
          "prompt": "Say the color 'purple'",
          "sampleAnswer": "Purple",
          "teacherScript": "Let's say 'Purple.' Repeat after me: 'Purple!'"
        }
      ]
    },
    {
      "id": 802,
      "unlocked": true,
      "completed": false,
      "type": "Identifying Colors",
      "title": "Recognizing Colors in Objects",
      "questions": [
        {
          "id": 8021,
          "type": "speaking",
          "prompt": "Point to something red",
          "sampleAnswer": "Red",
          "teacherScript": "Can you find something red? Point to it and say 'Red!'"
        },
        {
          "id": 8022,
          "type": "speaking",
          "prompt": "Point to something blue",
          "sampleAnswer": "Blue",
          "teacherScript": "Now find something blue. Point to it and say 'Blue!'"
        },
        {
          "id": 8023,
          "type": "speaking",
          "prompt": "Point to something green",
          "sampleAnswer": "Green",
          "teacherScript": "Find something green. Point to it and say 'Green!'"
        },
        {
          "id": 8024,
          "type": "speaking",
          "prompt": "Point to something yellow",
          "sampleAnswer": "Yellow",
          "teacherScript": "Find something yellow. Point to it and say 'Yellow!'"
        },
        {
          "id": 8025,
          "type": "speaking",
          "prompt": "Point to something orange",
          "sampleAnswer": "Orange",
          "teacherScript": "Find something orange. Point to it and say 'Orange!'"
        },
        {
          "id": 8026,
          "type": "speaking",
          "prompt": "Point to something purple",
          "sampleAnswer": "Purple",
          "teacherScript": "Find something purple. Point to it and say 'Purple!'"
        }
      ]
    }
  ]
},

{
  "id": 9,
  "classId": 1,
  "title": "Numbers",
  "topic": "Learning Numbers",
  "duration": 60,
  "lessonNumber": "9",
  "totalTopics": "12",
  "difficulty": "Beginner",
  "color": "bg-yellow-500",
  "unlocked": true,
  "completed": false,
  "subLessons": [
    {
      "id": 901,
      "unlocked": true,
      "completed": false,
      "type": "Vocabulary",
      "title": "Number Vocabulary",
      "questions": [
        {
          "id": 9001,
          "type": "speaking",
          "prompt": "Say the number 'one'",
          "sampleAnswer": "One",
          "teacherScript": "Let's start with the number 'One.' Say it with me: 'One!'"
        },
        {
          "id": 9002,
          "type": "speaking",
          "prompt": "Say the number 'two'",
          "sampleAnswer": "Two",
          "teacherScript": "Now, let's say 'Two.' Repeat after me: 'Two!'"
        },
        {
          "id": 9003,
          "type": "speaking",
          "prompt": "Say the number 'three'",
          "sampleAnswer": "Three",
          "teacherScript": "Next, let's say 'Three.' Say it with me: 'Three!'"
        },
        {
          "id": 9004,
          "type": "speaking",
          "prompt": "Say the number 'four'",
          "sampleAnswer": "Four",
          "teacherScript": "Let's say 'Four.' Repeat after me: 'Four!'"
        },
        {
          "id": 9005,
          "type": "speaking",
          "prompt": "Say the number 'five'",
          "sampleAnswer": "Five",
          "teacherScript": "Now, let's say 'Five.' Say it with me: 'Five!'"
        }
      ]
    },
    {
      "id": 902,
      "unlocked": true,
      "completed": false,
      "type": "Identifying Numbers",
      "title": "Recognizing Numbers in Objects",
      "questions": [
        {
          "id": 9021,
          "type": "speaking",
          "prompt": "Point to the number '1'",
          "sampleAnswer": "One",
          "teacherScript": "Can you find the number '1'? Point to it and say 'One!'"
        },
        {
          "id": 9022,
          "type": "speaking",
          "prompt": "Point to the number '2'",
          "sampleAnswer": "Two",
          "teacherScript": "Find the number '2'. Point to it and say 'Two!'"
        },
        {
          "id": 9023,
          "type": "speaking",
          "prompt": "Point to the number '3'",
          "sampleAnswer": "Three",
          "teacherScript": "Find the number '3'. Point to it and say 'Three!'"
        },
        {
          "id": 9024,
          "type": "speaking",
          "prompt": "Point to the number '4'",
          "sampleAnswer": "Four",
          "teacherScript": "Find the number '4'. Point to it and say 'Four!'"
        },
        {
          "id": 9025,
          "type": "speaking",
          "prompt": "Point to the number '5'",
          "sampleAnswer": "Five",
          "teacherScript": "Find the number '5'. Point to it and say 'Five!'"
        }
      ]
    }
  ]
},
{
  "id": 10,
  "classId": 1,
  "title": "Family",
  "topic": "Learning About Family",
  "duration": 60,
  "lessonNumber": "10",
  "totalTopics": "12",
  "difficulty": "Beginner",
  "color": "bg-teal-500",
  "unlocked": true,
  "completed": false,
  "subLessons": [
    {
      "id": 1001,
      "unlocked": true,
      "completed": false,
      "type": "Vocabulary",
      "title": "Family Members",
      "questions": [
        {
          "id": 10001,
          "type": "speaking",
          "prompt": "Say the word 'father'",
          "sampleAnswer": "Father",
          "teacherScript": "Let's start with the family member 'Father.' Say it with me: 'Father!'"
        },
        {
          "id": 10002,
          "type": "speaking",
          "prompt": "Say the word 'mother'",
          "sampleAnswer": "Mother",
          "teacherScript": "Now, let's say 'Mother.' Repeat after me: 'Mother!'"
        },
        {
          "id": 10003,
          "type": "speaking",
          "prompt": "Say the word 'brother'",
          "sampleAnswer": "Brother",
          "teacherScript": "Next, let's say 'Brother.' Say it with me: 'Brother!'"
        },
        {
          "id": 10004,
          "type": "speaking",
          "prompt": "Say the word 'sister'",
          "sampleAnswer": "Sister",
          "teacherScript": "Let's say 'Sister.' Repeat after me: 'Sister!'"
        },
        {
          "id": 10005,
          "type": "speaking",
          "prompt": "Say the word 'grandfather'",
          "sampleAnswer": "Grandfather",
          "teacherScript": "Now, let's say 'Grandfather.' Say it with me: 'Grandfather!'"
        },
        {
          "id": 10006,
          "type": "speaking",
          "prompt": "Say the word 'grandmother'",
          "sampleAnswer": "Grandmother",
          "teacherScript": "Let's say 'Grandmother.' Repeat after me: 'Grandmother!'"
        }
      ]
    },
    {
      "id": 1002,
      "unlocked": true,
      "completed": false,
      "type": "Identifying Family",
      "title": "Recognizing Family Members",
      "questions": [
        {
          "id": 10021,
          "type": "speaking",
          "prompt": "Say 'This is my father.'",
          "sampleAnswer": "This is my father.",
          "teacherScript": "Say: 'This is my father.' Now point to your father and say it!"
        },
        {
          "id": 10022,
          "type": "speaking",
          "prompt": "Say 'This is my mother.'",
          "sampleAnswer": "This is my mother.",
          "teacherScript": "Say: 'This is my mother.' Point to your mother and say it!"
        },
        {
          "id": 10023,
          "type": "speaking",
          "prompt": "Say 'This is my brother.'",
          "sampleAnswer": "This is my brother.",
          "teacherScript": "Say: 'This is my brother.' Point to your brother and say it!"
        },
        {
          "id": 10024,
          "type": "speaking",
          "prompt": "Say 'This is my sister.'",
          "sampleAnswer": "This is my sister.",
          "teacherScript": "Say: 'This is my sister.' Point to your sister and say it!"
        },
        {
          "id": 10025,
          "type": "speaking",
          "prompt": "Say 'This is my grandfather.'",
          "sampleAnswer": "This is my grandfather.",
          "teacherScript": "Say: 'This is my grandfather.' Point to your grandfather and say it!"
        },
        {
          "id": 10026,
          "type": "speaking",
          "prompt": "Say 'This is my grandmother.'",
          "sampleAnswer": "This is my grandmother.",
          "teacherScript": "Say: 'This is my grandmother.' Point to your grandmother and say it!"
        }
      ]
    }
  ]
},
{
  "id": 11,
  "classId": 1,
  "title": "Animals",
  "topic": "Learning Animals",
  "duration": 60,
  "lessonNumber": "11",
  "totalTopics": "12",
  "difficulty": "Beginner",
  "color": "bg-green-500",
  "unlocked": true,
  "completed": false,
  "subLessons": [
    {
      "id": 1101,
      "unlocked": true,
      "completed": false,
      "type": "Vocabulary",
      "title": "Animal Vocabulary",
      "questions": [
        {
          "id": 11001,
          "type": "speaking",
          "prompt": "Say the word 'cat'",
          "sampleAnswer": "Cat",
          "teacherScript": "Let's start with the word 'Cat.' Say it with me: 'Cat!'"
        },
        {
          "id": 11002,
          "type": "speaking",
          "prompt": "Say the word 'dog'",
          "sampleAnswer": "Dog",
          "teacherScript": "Now, let's say 'Dog.' Repeat after me: 'Dog!'"
        },
        {
          "id": 11003,
          "type": "speaking",
          "prompt": "Say the word 'elephant'",
          "sampleAnswer": "Elephant",
          "teacherScript": "Next, let's say 'Elephant.' Say it with me: 'Elephant!'"
        },
        {
          "id": 11004,
          "type": "speaking",
          "prompt": "Say the word 'tiger'",
          "sampleAnswer": "Tiger",
          "teacherScript": "Let's say 'Tiger.' Repeat after me: 'Tiger!'"
        },
        {
          "id": 11005,
          "type": "speaking",
          "prompt": "Say the word 'lion'",
          "sampleAnswer": "Lion",
          "teacherScript": "Now, let's say 'Lion.' Say it with me: 'Lion!'"
        }
      ]
    },
    {
      "id": 1102,
      "unlocked": true,
      "completed": false,
      "type": "Identifying Animals",
      "title": "Recognizing Animals",
      "questions": [
        {
          "id": 11021,
          "type": "speaking",
          "prompt": "Point to a cat",
          "sampleAnswer": "Cat",
          "teacherScript": "Can you find a cat? Point to it and say 'Cat!'"
        },
        {
          "id": 11022,
          "type": "speaking",
          "prompt": "Point to a dog",
          "sampleAnswer": "Dog",
          "teacherScript": "Now, find a dog. Point to it and say 'Dog!'"
        },
        {
          "id": 11023,
          "type": "speaking",
          "prompt": "Point to an elephant",
          "sampleAnswer": "Elephant",
          "teacherScript": "Find an elephant. Point to it and say 'Elephant!'"
        },
        {
          "id": 11024,
          "type": "speaking",
          "prompt": "Point to a tiger",
          "sampleAnswer": "Tiger",
          "teacherScript": "Find a tiger. Point to it and say 'Tiger!'"
        },
        {
          "id": 11025,
          "type": "speaking",
          "prompt": "Point to a lion",
          "sampleAnswer": "Lion",
          "teacherScript": "Find a lion. Point to it and say 'Lion!'"
        }
      ]
    }
  ]
},
{
  "id": 12,
  "classId": 1,
  "title": "Weather",
  "topic": "Learning About Weather",
  "duration": 60,
  "lessonNumber": "12",
  "totalTopics": "12",
  "difficulty": "Beginner",
  "color": "bg-blue-500",
  "unlocked": true,
  "completed": false,
  "subLessons": [
    {
      "id": 1201,
      "unlocked": true,
      "completed": false,
      "type": "Vocabulary",
      "title": "Weather Vocabulary",
      "questions": [
        {
          "id": 12001,
          "type": "speaking",
          "prompt": "Say the word 'sunny'",
          "sampleAnswer": "Sunny",
          "teacherScript": "Let's start with the word 'Sunny.' Say it with me: 'Sunny!'"
        },
        {
          "id": 12002,
          "type": "speaking",
          "prompt": "Say the word 'rainy'",
          "sampleAnswer": "Rainy",
          "teacherScript": "Now, let's say 'Rainy.' Repeat after me: 'Rainy!'"
        },
        {
          "id": 12003,
          "type": "speaking",
          "prompt": "Say the word 'cloudy'",
          "sampleAnswer": "Cloudy",
          "teacherScript": "Next, let's say 'Cloudy.' Say it with me: 'Cloudy!'"
        },
        {
          "id": 12004,
          "type": "speaking",
          "prompt": "Say the word 'snowy'",
          "sampleAnswer": "Snowy",
          "teacherScript": "Let's say 'Snowy.' Repeat after me: 'Snowy!'"
        },
        {
          "id": 12005,
          "type": "speaking",
          "prompt": "Say the word 'windy'",
          "sampleAnswer": "Windy",
          "teacherScript": "Now, let's say 'Windy.' Say it with me: 'Windy!'"
        }
      ]
    },
    {
      "id": 1202,
      "unlocked": true,
      "completed": false,
      "type": "Identifying Weather",
      "title": "Recognizing Weather",
      "questions": [
        {
          "id": 12021,
          "type": "speaking",
          "prompt": "Point to a sunny day",
          "sampleAnswer": "Sunny",
          "teacherScript": "Can you point to a sunny day? Say 'Sunny!'"
        },
        {
          "id": 12022,
          "type": "speaking",
          "prompt": "Point to a rainy day",
          "sampleAnswer": "Rainy",
          "teacherScript": "Now, point to a rainy day. Say 'Rainy!'"
        },
        {
          "id": 12023,
          "type": "speaking",
          "prompt": "Point to a cloudy day",
          "sampleAnswer": "Cloudy",
          "teacherScript": "Find a cloudy day. Point to it and say 'Cloudy!'"
        },
        {
          "id": 12024,
          "type": "speaking",
          "prompt": "Point to a snowy day",
          "sampleAnswer": "Snowy",
          "teacherScript": "Find a snowy day. Point to it and say 'Snowy!'"
        },
        {
          "id": 12025,
          "type": "speaking",
          "prompt": "Point to a windy day",
          "sampleAnswer": "Windy",
          "teacherScript": "Find a windy day. Point to it and say 'Windy!'"
        }
      ]
    }
  ]
}
]
export const lessonsDataAll = [
  {
    "id": 1,
    "classId": 1,
    "title": "Greeting",
    "topic": "Greetings & Introductions",
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
        "completed": false,
        "type": "Speaking Practice",
        "title": "Saying 'Hello' and 'Goodbye'",
        "questions": [
          {
            "id": 1001,
            "type": "speaking",
            "prompt": "Say 'Hello' to someone",
            "sampleAnswer": "Hello!",
            "teacherScript": "Hello, children! How are you today? I am so happy to see all of you! Today, we are going to learn how to say 'Hello' and 'Goodbye' in English! Ready? Let's go!"
          },
          {
            "id": 1002,
            "type": "speaking",
            "prompt": "Say 'Goodbye' to someone",
            "sampleAnswer": "Goodbye!",
            "teacherScript": "Now, when you leave someone, you say: 'GOODBYE!' Can you say it with me? Let's say: 'GOODBYE!' Well done! Let's say it together again: 'GOODBYE!' You did so well!"
          }
        ]
      },
      {
        "id": 102,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Asking 'How Are You?'",
        "questions": [
          {
            "id": 1003,
            "type": "speaking",
            "prompt": "Ask someone how they are",
            "sampleAnswer": "How are you?",
            "teacherScript": "Now, let's learn how to ask someone, 'How are you?' in English! When you meet someone, you can say: 'How are YOU?' Can you say it with me?"
          },
          {
            "id": 1004,
            "type": "speaking",
            "prompt": "Respond to 'How are you?'",
            "sampleAnswer": "I'm good! / I'm happy!",
            "teacherScript": "Now, let's answer! You can say: 'I'm good!' Or: 'I'm happy!' Let's try it together! 'I'm good!' Great! Let's say: 'I'm happy!' You did an amazing job!"
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "classId": 1,
    "title": "Family",
    "topic": "Family and Friends",
    "duration": 60,
    "lessonNumber": "2",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-green-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 201,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Talking About Family",
        "questions": [
          {
            "id": 2001,
            "type": "speaking",
            "prompt": "Name family members",
            "sampleAnswer": "Mother, Father, Brother, Sister",
            "teacherScript": "Today, we are going to talk about our families! Family is very important. Let's learn the words for family in English. Ready? 'Mother', 'Father', 'Brother', 'Sister'"
          },
          {
            "id": 2002,
            "type": "speaking",
            "prompt": "Introduce your family member",
            "sampleAnswer": "My mother is [name].",
            "teacherScript": "Now, let's practice! 'My mother is [name].' Can you say that? 'My mother is [name].' Awesome! Let's say: 'My father is [name].' Fantastic!"
          }
        ]
      },
      {
        "id": 202,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Talking About Friends",
        "questions": [
          {
            "id": 2003,
            "type": "speaking",
            "prompt": "Introduce your friend",
            "sampleAnswer": "My friend is [name].",
            "teacherScript": "Now, let's talk about friends! Do you have friends? I'm sure you do! In English, we say: 'My friend is [name].' Can you say that with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Everyday Activities",
    "duration": 60,
    "lessonNumber": "3",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-yellow-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 301,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "What Do You Do Every Day?",
        "questions": [
          {
            "id": 3001,
            "type": "speaking",
            "prompt": "Say what you do every day",
            "sampleAnswer": "I eat lunch. I play with toys. I go to school.",
            "teacherScript": "Let's talk about what we do every day. Ready? In English, we say: 'I eat lunch.' 'I play with toys.' 'I go to school.' Can you say those with me?"
          }
        ]
      },
      {
        "id": 302,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Talking About What You Like",
        "questions": [
          {
            "id": 3002,
            "type": "speaking",
            "prompt": "Express what you like",
            "sampleAnswer": "I like [apple/banana/toys].",
            "teacherScript": "Now, let's talk about things we like! In English, we say: 'I like [apple/banana/toys].' Can you say that with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Animals and Nature",
    "duration": 60,
    "lessonNumber": "4",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-red-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 401,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Animals We Know",
        "questions": [
          {
            "id": 4001,
            "type": "speaking",
            "prompt": "Name different animals",
            "sampleAnswer": "Cat, Dog, Fish, Bird",
            "teacherScript": "Let's learn about animals today! Ready? Here are some animals: 'Cat', 'Dog', 'Fish', 'Bird'. Can you say them with me?"
          },
          {
            "id": 4002,
            "type": "speaking",
            "prompt": "Make a sentence about animals",
            "sampleAnswer": "I see a cat/dog/fish/bird.",
            "teacherScript": "Let's make a sentence! 'I see a [cat/dog/fish/bird].' Can you say that with me?"
          }
        ]
      },
      {
        "id": 402,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Talking About Nature",
        "questions": [
          {
            "id": 4003,
            "type": "speaking",
            "prompt": "Name things in nature",
            "sampleAnswer": "Tree, Flower, Sky, Sun",
            "teacherScript": "Now, let's learn about nature! Nature is beautiful, isn't it? In English, we say: 'Tree', 'Flower', 'Sky', 'Sun'. Can you say them with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Colors and Shapes",
    "duration": 60,
    "lessonNumber": "5",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-purple-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 501,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Learning Colors",
        "questions": [
          {
            "id": 5001,
            "type": "speaking",
            "prompt": "Name different colors",
            "sampleAnswer": "Red, Blue, Yellow, Green",
            "teacherScript": "Let's talk about colors! Colors are everywhere! Here are some colors: 'Red', 'Blue', 'Yellow', 'Green'. Can you say them with me?"
          },
          {
            "id": 5002,
            "type": "speaking",
            "prompt": "Make a sentence with colors",
            "sampleAnswer": "I see a red apple.",
            "teacherScript": "Let's make a sentence! 'I see a [color] [object].' For example: 'I see a red apple.' Can you say it?"
          }
        ]
      },
      {
        "id": 502,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Learning Shapes",
        "questions": [
          {
            "id": 5003,
            "type": "speaking",
            "prompt": "Name different shapes",
            "sampleAnswer": "Circle, Square, Triangle, Rectangle",
            "teacherScript": "Now, let's talk about shapes! Shapes are everywhere too! Here are some shapes: 'Circle', 'Square', 'Triangle', 'Rectangle'. Can you say them with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Numbers and Counting",
    "duration": 60,
    "lessonNumber": "6",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-orange-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 601,
        "unlocked": true,
        "completed": false,
        "type": "Numbers",
        "title": "Learning Numbers 1-10",
        "questions": [
          {
            "id": 6001,
            "type": "speaking",
            "prompt": "Count from 1 to 10",
            "sampleAnswer": "One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten",
            "teacherScript": "Let's count together! Ready? One! Two! Three! Four! Five! Six! Seven! Eight! Nine! Ten! Great job!"
          }
        ]
      },
      {
        "id": 602,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Counting Objects",
        "questions": [
          {
            "id": 6002,
            "type": "speaking",
            "prompt": "Count objects and make a sentence",
            "sampleAnswer": "I see [number] [object].",
            "teacherScript": "Now, let's count things around us! How many pencils do you see? How many chairs do you see? Let's count together! Ready?"
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Things Around Us",
    "duration": 60,
    "lessonNumber": "7",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-pink-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 701,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Naming Things at Home",
        "questions": [
          {
            "id": 7001,
            "type": "speaking",
            "prompt": "Name household items",
            "sampleAnswer": "Bed, Table, Chair",
            "teacherScript": "Today, we're going to talk about things we see at home! Let's learn the names of some common household items. 'Bed', 'Table', 'Chair'. Can you say them with me?"
          }
        ]
      },
      {
        "id": 702,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Naming Things at School",
        "questions": [
          {
            "id": 7002,
            "type": "speaking",
            "prompt": "Name school items",
            "sampleAnswer": "Book, Pen, Bag",
            "teacherScript": "Now, let's talk about things we see at school! We have lots of important things at school. 'Book', 'Pen', 'Bag'. Can you say them with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 8,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Food and Drink",
    "duration": 60,
    "lessonNumber": "8",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-indigo-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 801,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Naming Foods",
        "questions": [
          {
            "id": 8001,
            "type": "speaking",
            "prompt": "Name different foods",
            "sampleAnswer": "Apple, Banana, Rice",
            "teacherScript": "Yum, yum! Today we're going to learn about food! Let's start with some common food items. 'Apple', 'Banana', 'Rice'. Can you say them with me?"
          }
        ]
      },
      {
        "id": 802,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Talking About Meals",
        "questions": [
          {
           "id": 8002,
            "type": "speaking",
            "prompt": "Name different meals",
            "sampleAnswer": "Breakfast, Lunch, Dinner",
            "teacherScript": "We all need to eat meals to stay healthy. In English, we have different names for our meals. 'Breakfast', 'Lunch', 'Dinner'. Can you say them with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Simple Actions",
    "duration": 60,
    "lessonNumber": "9",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-teal-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 901,
        "unlocked": true,
        "completed": false,
        "type": "Action Words",
        "title": "Basic Actions",
        "questions": [
          {
            "id": 9001,
            "type": "speaking",
            "prompt": "Say different action words",
            "sampleAnswer": "Run, Jump, Walk, Sit",
            "teacherScript": "Let's talk about things we can do! There are many fun actions we can practice. 'Run', 'Jump', 'Walk', 'Sit'. Can you say them with me?"
          }
        ]
      },
      {
        "id": 902,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Describing Actions",
        "questions": [
          {
            "id": 9002,
            "type": "speaking",
            "prompt": "Describe how you do actions",
            "sampleAnswer": "I run fast. I jump high.",
            "teacherScript": "Excellent! Now, let's describe how we do these actions. 'I run fast.' 'I jump high.' Can you say those with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "My Body and Senses",
    "duration": 60,
    "lessonNumber": "10",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-cyan-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 1001,
        "unlocked": true,
        "completed": false,
        "type": "Vocabulary",
        "title": "Naming Body Parts",
        "questions": [
          {
            "id": 10001,
            "type": "speaking",
            "prompt": "Name different body parts",
            "sampleAnswer": "Head, Eyes, Ears, Hands, Feet",
            "teacherScript": "Today, we're going to learn about our bodies! Let's start by naming some important body parts. 'Head', 'Eyes', 'Ears', 'Hands', 'Feet'. Can you say them with me?"
          }
        ]
      },
      {
        "id": 1002,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Describing Body Parts",
        "questions": [
          {
            "id": 10002,
            "type": "speaking",
            "prompt": "Make sentences about body parts",
            "sampleAnswer": "I clap my hands. I touch my nose.",
            "teacherScript": "Excellent! Now, let's describe what we can do with our body parts. 'I clap my hands.' 'I touch my nose.' Can you say those with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Simple Sentences & Questions",
    "duration": 60,
    "lessonNumber": "11",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-rose-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 1101,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Building Simple Sentences",
        "questions": [
          {
            "id": 11001,
            "type": "speaking",
            "prompt": "Make simple sentences",
            "sampleAnswer": "I am happy. She is my friend.",
            "teacherScript": "Great job, everyone! Now, let's learn how to build simple sentences in English. 'I am happy.' 'She is my friend.' Can you say those with me?"
          }
        ]
      },
      {
        "id": 1102,
        "unlocked": true,
        "completed": false,
        "type": "Speaking Practice",
        "title": "Asking Questions",
        "questions": [
          {
            "id": 11002,
            "type": "speaking",
            "prompt": "Practice asking questions",
            "sampleAnswer": "What is your name? Where are you from?",
            "teacherScript": "Excellent! Now, let's learn how to ask questions in English. 'What is your name?' 'Where are you from?' Can you say those with me?"
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "classId": 1,
    "title": "Year-Long English Curriculum for PP1",
    "topic": "Review and Play",
    "duration": 60,
    "lessonNumber": "12",
    "totalTopics": "12",
    "difficulty": "Beginner",
    "color": "bg-violet-500",
    "unlocked": true,
    "completed": false,
    "subLessons": [
      {
        "id": 1201,
        "unlocked": true,
        "completed": false,
        "type": "Review",
        "title": "Review of Previous Lessons",
        "questions": [
          {
            "id": 12001,
            "type": "speaking",
            "prompt": "Practice greetings and introductions",
            "sampleAnswer": "Hello! Goodbye! How are you?",
            "teacherScript": "Today, we're going to review what we've learned so far! Let's start with greetings and introductions. Can you say 'Hello' and 'Goodbye' with me?"
          },
          {
            "id": 12002,
            "type": "speaking",
            "prompt": "Review family members",
            "sampleAnswer": "Mother, Father, Brother, Sister",
            "teacherScript": "Now, let's review what we've learned about family and friends. Can you tell me the words for family members?"
          },
          {
            "id": 12003,
            "type": "speaking",
            "prompt": "Review animals and nature",
            "sampleAnswer": "Cat, Dog, Fish, Bird, Tree, Flower",
            "teacherScript": "Alright, let's move on to animals and nature! What are some animals we know?"
          }
        ]
      },
      {
        "id": 1202,
        "unlocked": true,
        "completed": false,
        "type": "Games",
        "title": "Fun Review Games",
        "questions": [
          {
            "id": 12004,
            "type": "interactive",
            "prompt": "Play 'Who Am I?' with animal sounds",
            "sampleAnswer": "It's a cat! (After hearing meowing sound)",
            "teacherScript": "Okay, now it's time for some fun review games! For our first game, let's play 'Who Am I?' I'll make an animal sound, and you guess which animal it is!"
          }
        ]
      }
    ]
  }
];
export const lessonsData2 = [{
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
    }
  ]
  },
  { id: 3,  classId: 2, title: "Lesson 1", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
    { id: 31, title: "Practice lesson", unlocked: true, completed: true },
    { id: 32, title: "Vocabulary", unlocked: true, completed: false },
    { id: 33, title: "Exam", unlocked: false, completed: false },
  ]},
{ id: 4,  classId: 2, title: "Lesson 2", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
    { id: 41, title: "Colors", unlocked: false, completed: false },
    { id: 42, title: "Family Members", unlocked: false, completed: false },
  ]},
{ id: 5,  classId: 2, title: "Lesson 3", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
    { id: 51, title: "Advanced Grammar", unlocked: false, completed: false },
    { id: 52, title: "Idiomatic Expressions", unlocked: false, completed: false },
  ]},
{ id: 6,  classId: 3, title: "Lesson 4", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
    { id: 61, title: "Practice lesson", unlocked: true, completed: true },
    { id: 62, title: "Vocabulary", unlocked: true, completed: false },
    { id: 63, title: "Exam", unlocked: false, completed: false },
  ]},
{ id: 7,  classId: 3, title: "Lesson 5", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
    { id: 71, title: "Colors", unlocked: false, completed: false },
    { id: 72, title: "Family Members", unlocked: false, completed: false },
  ]},
{ id: 8, classId: 4, title: "Lesson 6", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
    { id: 81, title: "Advanced Grammar", unlocked: false, completed: false },
    { id: 82, title: "Idiomatic Expressions", unlocked: false, completed: false },
  ]},
{ id: 9,  classId: 5, title: "Lesson 7", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
    { id: 91, title: "Practice lesson", unlocked: true, completed: true },
    { id: 92, title: "Vocabulary", unlocked: true, completed: false },
    { id: 93, title: "Exam", unlocked: false, completed: false },
  ]},
{ id: 10,  classId: 5, title: "Lesson 8", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
    { id: 101, title: "Colors", unlocked: false, completed: false },
    { id: 102, title: "Family Members", unlocked: false, completed: false },
  ]},
{ id: 11,  classId: 6, title: "Lesson 9", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
    { id: 111, title: "Advanced Grammar", unlocked: false, completed: false },
    { id: 112, title: "Idiomatic Expressions", unlocked: false, completed: false },
  ]}     

]

export const lessonsData0: any[] = [ 
    {
      id: 1,
      classId: 1,
      title: 'Professional Introductions',
      topic: 'Business Communication',
      duration: 60,
      lessonNumber:"1",
      totalTopics:"2",
      difficulty: 'Beginner',
      color: "bg-green-500", 
      unlocked: true, 
      completed: false,
      subLessons: [
        {
          id: 101,
          unlocked: true, 
          completed: true,
          type: "Practice lesson",
          title: "Basic Speaking and Sentence Transformation",
          questions: [
            {
              id: 1001,
              type: "speaking",
              prompt: "Introduce yourself and mention one hobby you enjoy.",
              sampleAnswer: "Hello, my name is John. I enjoy playing tennis in my free time.",
            },
            {
              id: 1002,
              type: "sentence_transformation",
              prompt: "Transform this sentence into past tense: 'I go to the gym every day.'",
              originalSentence: "I go to the gym every day.",
              correctAnswer: "I went to the gym every day.",
            }, 
          ],
        },
        {
          id: 102,
          color: "bg-blue-500",
          unlocked: true, 
          completed: true,
          title: "Vocabulary",
          type: "speaking_practice",
          questions: [
            {
              id: 1003,
              type: "vocabulary_word_list",
              wordList: [
                {
                  id: 2001,
                  term: 'repository',
                  definition: 'A storage location for code and version control',
                  correctPronunciation: 'ri-POZ-i-tree',
                  phoneticGuide: 'rɪˈpɒzɪtri',
                  pronunciationNotes: "In British English: 'poz' sounds like 'positive', stress on 'POZ'"
                },
                {
                  id: 2002,
                  term: 'deployment',
                  definition: 'The process of making code live in production',
                  correctPronunciation: 'dee-PLOY-ment',
                  phoneticGuide: 'dɪˈplɔɪmənt',
                  pronunciationNotes: "British: clear 'dee' sound, not 'duh', stress on 'PLOY'"
                },
                {
                  id: 2003,
                  term: 'parameter',
                  definition: 'A variable passed to a function',
                  correctPronunciation: 'puh-RAM-i-tuh',
                  phoneticGuide: 'pəˈræmɪtə',
                  pronunciationNotes: "British: ends with 'tuh', not 'ter', stress on 'RAM'"
                },
                {
                  id: 2004,
                  term: 'middleware',
                  definition: 'Software that acts as a bridge between systems',
                  correctPronunciation: 'MID-dl-weh',
                  phoneticGuide: 'ˈmɪdlweə',
                  pronunciationNotes: "British: 'weh' like in 'where', stress on 'MID'"
                }
              ]
            },
            {
              id: 10017,
              type: "vocabulary_word_list",
              wordList: [
                {
                  id: 2001,
                  term: 'repository',
                  definition: 'A storage location for code and version control',
                  correctPronunciation: 'ri-POZ-i-tree',
                  phoneticGuide: 'rɪˈpɒzɪtri',
                  pronunciationNotes: "In British English: 'poz' sounds like 'positive', stress on 'POZ'"
                },
                {
                  id: 2002,
                  term: 'deployment',
                  definition: 'The process of making code live in production',
                  correctPronunciation: 'dee-PLOY-ment',
                  phoneticGuide: 'dɪˈplɔɪmənt',
                  pronunciationNotes: "British: clear 'dee' sound, not 'duh', stress on 'PLOY'"
                },
                {
                  id: 2003,
                  term: 'parameter',
                  definition: 'A variable passed to a function',
                  correctPronunciation: 'puh-RAM-i-tuh',
                  phoneticGuide: 'pəˈræmɪtə',
                  pronunciationNotes: "British: ends with 'tuh', not 'ter', stress on 'RAM'"
                },
                {
                  id: 2004,
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
      ]
    },
    {
      classId: 1,
      id: 2,
      title: 'Debating Current Events',
      topic: 'Advanced Discussion',
      lessonNumber:"2",
      totalTopics:"2",
      duration: 90,
      difficulty: 'Advanced',
      color: "bg-red-500", 
      unlocked: true, 
      completed: true,
      subLessons: [
        {
          id: 103,
          title: "Code Review Communication",
          type: "speaking_practice",
          unlocked: false, 
          completed: false,
          questions: [
            {
              id: 1004,
              type: "vocabulary_word_list",
              wordList: [
                {
                  id: 2005,
                  term: 'repository',
                  definition: 'A storage location for code and version control',
                  correctPronunciation: 'ri-POZ-i-tree',
                  phoneticGuide: 'rɪˈpɒzɪtri',
                  pronunciationNotes: "In British English: 'poz' sounds like 'positive', stress on 'POZ'"
                },
                {
                  id: 2006,
                  term: 'deployment',
                  definition: 'The process of making code live in production',
                  correctPronunciation: 'dee-PLOY-ment',
                  phoneticGuide: 'dɪˈplɔɪmənt',
                  pronunciationNotes: "British: clear 'dee' sound, not 'duh', stress on 'PLOY'"
                },
                {
                  id: 2007,
                  term: 'parameter',
                  definition: 'A variable passed to a function',
                  correctPronunciation: 'puh-RAM-i-tuh',
                  phoneticGuide: 'pəˈræmɪtə',
                  pronunciationNotes: "British: ends with 'tuh', not 'ter', stress on 'RAM'"
                },
                {
                  id: 2008,
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
          id: 104,
          title: "Basic Speaking and Sentence Transformation",
          unlocked: false, 
          completed: false,
          questions: [
            {
              id: 1005,
              type: "speaking",
              prompt: "Introduce yourself and mention one hobby you enjoy.",
              sampleAnswer: "Hello, my name is John. I enjoy playing tennis in my free time.",
            },
            {
              id: 1006,
              type: "sentence_transformation",
              prompt: "Transform this sentence into past tense: 'I go to the gym every day.'",
              originalSentence: "I go to the gym every day.",
              correctAnswer: "I went to the gym every day.",
            },
          ],
        }
      ]
    }, 
      { id: 3,  classId: 2, title: "Lesson 1", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
          { id: 31, title: "Practice lesson", unlocked: true, completed: true },
          { id: 32, title: "Vocabulary", unlocked: true, completed: false },
          { id: 33, title: "Exam", unlocked: false, completed: false },
        ]},
      { id: 4,  classId: 2, title: "Lesson 2", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
          { id: 41, title: "Colors", unlocked: false, completed: false },
          { id: 42, title: "Family Members", unlocked: false, completed: false },
        ]},
      { id: 5,  classId: 2, title: "Lesson 3", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
          { id: 51, title: "Advanced Grammar", unlocked: false, completed: false },
          { id: 52, title: "Idiomatic Expressions", unlocked: false, completed: false },
        ]},
      { id: 6,  classId: 3, title: "Lesson 4", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
          { id: 61, title: "Practice lesson", unlocked: true, completed: true },
          { id: 62, title: "Vocabulary", unlocked: true, completed: false },
          { id: 63, title: "Exam", unlocked: false, completed: false },
        ]},
      { id: 7,  classId: 3, title: "Lesson 5", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
          { id: 71, title: "Colors", unlocked: false, completed: false },
          { id: 72, title: "Family Members", unlocked: false, completed: false },
        ]},
      { id: 8, classId: 4, title: "Lesson 6", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
          { id: 81, title: "Advanced Grammar", unlocked: false, completed: false },
          { id: 82, title: "Idiomatic Expressions", unlocked: false, completed: false },
        ]},
      { id: 9,  classId: 5, title: "Lesson 7", color: "bg-blue-500", unlocked: true, completed: false, subLessons: [
          { id: 91, title: "Practice lesson", unlocked: true, completed: true },
          { id: 92, title: "Vocabulary", unlocked: true, completed: false },
          { id: 93, title: "Exam", unlocked: false, completed: false },
        ]},
      { id: 10,  classId: 5, title: "Lesson 8", color: "bg-green-500", unlocked: false, completed: false, subLessons: [
          { id: 101, title: "Colors", unlocked: false, completed: false },
          { id: 102, title: "Family Members", unlocked: false, completed: false },
        ]},
      { id: 11,  classId: 6, title: "Lesson 9", color: "bg-purple-500", unlocked: false, completed: false, subLessons: [
          { id: 111, title: "Advanced Grammar", unlocked: false, completed: false },
          { id: 112, title: "Idiomatic Expressions", unlocked: false, completed: false },
        ]}     
  
];

export const students: Student[] = [
  {
    id: 1,
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    level: 'Intermediate',
    progress: 78,
    attendance: 95,
    recentScores: [85, 92, 88],
    strengths: ['Speaking', 'Vocabulary'],
    areasToImprove: ['Writing']
  },
  {
    id: 2,
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    level: 'Advanced',
    progress: 92,
    attendance: 98,
    recentScores: [95, 88, 94],
    strengths: ['Grammar', 'Reading'],
    areasToImprove: ['Pronunciation']
  }
];

export const assignments: Assignment[] = [
  {
    id: 1,
    title: 'Business Email Writing',
    dueDate: '2024-03-25',
    class: 'Business English A1',
    type: 'Writing',
    status: 'Pending',
    submissions: 8,
    totalStudents: 15
  },
  {
    id: 2,
    title: 'Presentation Recording',
    dueDate: '2024-03-28',
    class: 'Conversation B2',
    type: 'Speaking',
    status: 'Submitted',
    submissions: 12,
    totalStudents: 12
  }
];

export const teacherStatsData = {
  streak: {
    current: 1,
    best: 1,
    dailyProgress: {
      Wed: true,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
      Mon: false,
      Tue: false
    }
  },
  callTime: {
    totalSpent: '4h 59m',
    dailyAverage: '42s',
    dailyGoal: '15m',
    weeklyData: {
      Thu: 120,
      Fri: 180,
      Sat: 90,
      Sun: 0,
      Mon: 240,
      Tue: 150,
      Wed: 210
    }
  },
  completedLessons: [
    {
      id: 1,
      title: 'Basic Greetings',
      date: '2024-03-20',
      duration: 45,
      students: 15
    },
    {
      id: 2,
      title: 'Past Tense Usage',
      date: '2024-03-19',
      duration: 60,
      students: 12
    },
    {
      id: 3,
      title: 'Business Vocabulary',
      date: '2024-03-18',
      duration: 45,
      students: 18
    }
  ]
};

export const teacherStats = {
  streak: {
    current: 1,
    best: 3,
    dailyProgress: {
      Wed: true,
      Thu: true,
      Fri: true,
      Sat: false,
      Sun: false,
      Mon: false,
      Tue: false,
    },
  },
  callTime: {
    totalSpent: '4h 59m',
    dailyAverage: '42s',
    dailyGoal: '15m',
    weeklyData: {
      Thu: 120,
      Fri: 180,
      Sat: 90,
      Sun: 0,
      Mon: 240,
      Tue: 150,
      Wed: 210,
    },
  },
  completedLessons: [
    {
      id: 1,
      title: 'Basic Greetings',
      date: '2024-03-20',
      duration: 45,
      students: 15,
    },
    {
      id: 2,
      title: 'Past Tense Usage',
      date: '2024-03-19',
      duration: 60,
      students: 12,
    },
    {
      id: 3,
      title: 'Business Vocabulary',
      date: '2024-03-18',
      duration: 45,
      students: 18,
    },
  ],
};
