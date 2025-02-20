import { classesData as originalClassesData, lessonsData as originalLessonsData } from './mockData';

// Create deep copies of the data to ensure independence
export const classesData = JSON.parse(JSON.stringify(originalClassesData));
export const lessonsData = JSON.parse(JSON.stringify(originalLessonsData)); 