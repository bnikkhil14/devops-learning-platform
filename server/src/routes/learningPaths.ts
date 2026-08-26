import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/learning-paths — list all, each with its labs and projects
router.get('/', async (_req: Request, res: Response) => {
  try {
    const paths = await prisma.learningPath.findMany({
      orderBy: { order: 'asc' },
      include: { labs: true, projects: true },
    });
    res.json(paths);
  } catch (err) {
    console.error('Failed to fetch learning paths:', err);
    res.status(500).json({ error: 'Failed to fetch learning paths' });
  }
});

// GET /api/learning-paths/:slug — single path by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const path = await prisma.learningPath.findUnique({
      where: { slug: req.params.slug },
      include: { labs: true, projects: true },
    });
    if (!path) {
      return res.status(404).json({ error: 'Learning path not found' });
    }
    res.json(path);
  } catch (err) {
    console.error('Failed to fetch learning path:', err);
    res.status(500).json({ error: 'Failed to fetch learning path' });
  }
});

export default router;