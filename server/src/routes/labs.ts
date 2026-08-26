import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET /api/labs — list all
router.get('/', async (_req: Request, res: Response) => {
  try {
    const labs = await prisma.lab.findMany({
      orderBy: { order: 'asc' },
      include: { learningPath: true },
    });
    res.json(labs);
  } catch (err) {
    console.error('Failed to fetch labs:', err);
    res.status(500).json({ error: 'Failed to fetch labs' });
  }
});

// GET /api/labs/:slug — single lab by slug
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const lab = await prisma.lab.findUnique({
      where: { slug: req.params.slug },
      include: { learningPath: true },
    });
    if (!lab) {
      return res.status(404).json({ error: 'Lab not found' });
    }
    res.json(lab);
  } catch (err) {
    console.error('Failed to fetch lab:', err);
    res.status(500).json({ error: 'Failed to fetch lab' });
  }
});

export default router;