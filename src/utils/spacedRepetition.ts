import { Question } from '@/types';

const INITIAL_INTERVAL = 1; // 1 day
const EASY_FACTOR = 2.5;
const HARD_FACTOR = 1.5;

export function calculateNextReviewDate(question: Question, wasCorrect: boolean): Date {
  const now = new Date();
  let interval = question.interval || INITIAL_INTERVAL;
  let easeFactor = question.easeFactor || 2.5;

  if (wasCorrect) {
    interval *= easeFactor;
    easeFactor = Math.min(easeFactor * EASY_FACTOR, 2.5);
  } else {
    interval = INITIAL_INTERVAL;
    easeFactor = Math.max(1.3, easeFactor * HARD_FACTOR);
  }

  question.interval = interval;
  question.easeFactor = easeFactor;

  const nextReviewDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
  return nextReviewDate;
}





// export const calculateNextReviewDate = (
//   lastReviewDate: Date,
//   correctStreak: number
// ): Date => {
//   const days = Math.pow(2, correctStreak - 1);
//   const nextDate = new Date(lastReviewDate);
//   nextDate.setDate(nextDate.getDate() + days);
//   return nextDate;
// }; 