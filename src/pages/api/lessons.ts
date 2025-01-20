import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';
import { logger } from '../../lib/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const lessons = await prisma.lesson.findMany({
          orderBy: { createdAt: 'desc' },
        });
        return res.json(lessons);

      case 'POST':
        const newLesson = await prisma.lesson.create({
          data: {
            ...req.body,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        });
        return res.status(201).json(newLesson);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    logger.error('Lesson API error', {
      context: { error: error instanceof Error ? error.message : String(error) },
      source: 'LessonsAPI'
    });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 