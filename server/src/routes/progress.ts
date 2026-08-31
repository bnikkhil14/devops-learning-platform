import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';

const router = Router();
const prisma = new PrismaClient();

const VALID_CONTENT_TYPES = ['LEARNING_PATH', 'LAB', 'PROJECT'] as const;
type ContentTypeInput = (typeof VALID_CONTENT_TYPES)[number];

// GET /api/progress — all progress records for the logged-in user
router.get('/', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const progress = await prisma.userProgress.findMany({
      where: { userId: req.userId },
    });
    res.json(progress);
  } catch (err) {
    console.error('Failed to fetch progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/progress/toggle — flips completed true/false for a given content item
router.post('/toggle', requireAuth, async (req: AuthRequest, res: Response) => {
  const { contentType, contentId } = req.body;

  if (!contentType || !VALID_CONTENT_TYPES.includes(contentType)) {
    return res.status(400).json({
      error: `contentType must be one of: ${VALID_CONTENT_TYPES.join(', ')}`,
    });
  }

  if (typeof contentId !== 'number') {
    return res.status(400).json({ error: 'contentId must be a number' });
  }

  try {
    const existing = await prisma.userProgress.findUnique({
      where: {
        userId_contentType_contentId: {
          userId: req.userId!,
          contentType: contentType as ContentTypeInput,
          contentId,
        },
      },
    });

    const nextCompleted = !existing?.completed;

    const updated = await prisma.userProgress.upsert({
      where: {
        userId_contentType_contentId: {
          userId: req.userId!,
          contentType: contentType as ContentTypeInput,
          contentId,
        },
      },
      update: {
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date() : null,
      },
      create: {
        userId: req.userId!,
        contentType: contentType as ContentTypeInput,
        contentId,
        completed: nextCompleted,
        completedAt: nextCompleted ? new Date() : null,
      },
    });

    res.json(updated);
  } catch (err) {
    console.error('Failed to toggle progress:', err);
    res.status(500).json({ error: 'Failed to toggle progress' });
  }
});

export default router;