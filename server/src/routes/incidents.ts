import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth';
import { Request } from 'express';

const router = Router();
const prisma = new PrismaClient();

interface AuthRequest extends Request {
  userId: string;
}

// GET /api/incidents — list all incidents, no auth required
router.get('/', async (req, res) => {
  try {
    const incidents = await prisma.incident.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json(incidents);
  } catch (err) {
    console.error('Error fetching incidents:', err);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

// GET /api/incidents/:slug
router.get('/:slug', async (req, res) => {
  try {
    const incident = await prisma.incident.findUnique({
      where: { slug: req.params.slug },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        scenarioText: true,
        choices: { select: { id: true, choiceText: true } },
      },
    });

    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    res.json(incident);
  } catch (err) {
    console.error('Error fetching incident:', err);
    res.status(500).json({ error: 'Failed to fetch incident' });
  }
});

// POST /api/incidents/:slug/attempt
router.post('/:slug/attempt', requireAuth, async (req, res) => {
  const { choiceId } = req.body as { choiceId?: number };
  const userId = req.userId!;

  try {
    const incident = await prisma.incident.findUnique({ where: { slug: req.params.slug } });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    if (!Number.isInteger(choiceId)) {
      return res.status(400).json({ error: 'Invalid choice id' });
    }

    const choice = await prisma.incidentChoice.findUnique({ where: { id: choiceId } });
    if (!choice || choice.incidentId !== incident.id) {
      return res.status(400).json({ error: 'Choice does not belong to this incident' });
    }

    const attempt = await prisma.userIncidentAttempt.create({
      data: { userId, incidentId: incident.id, choiceId, isCorrect: choice.isCorrect },
    });

    if (choice.isCorrect) {
      await prisma.userProgress.upsert({
        where: { userId_contentType_contentId: { userId, contentType: 'INCIDENT', contentId: incident.id } },
        create: { userId, contentType: 'INCIDENT', contentId: incident.id, completed: true, completedAt: new Date() },
        update: { completed: true, completedAt: new Date() },
      });
    }

    res.json({ isCorrect: choice.isCorrect, feedbackText: choice.feedbackText, attemptId: attempt.id });
  } catch (err) {
    console.error('Error recording incident attempt:', err);
    res.status(500).json({ error: 'Failed to record attempt' });
  }
});

export default router;