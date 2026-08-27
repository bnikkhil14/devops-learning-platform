import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import learningPathsRouter from './routes/learningPaths';
import labsRouter from './routes/labs';
import projectsRouter from './routes/projects';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  'https://bnikkhil14.github.io',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman, curl, or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

app.use(express.json());

app.use('/api/learning-paths', learningPathsRouter);
app.use('/api/labs', labsRouter);
app.use('/api/projects', projectsRouter);

app.use('/api/auth', authRouter);

// Basic liveness check — confirms the server is up
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'devopsforge-api' });
});

// Confirms the server can actually reach Postgres via Prisma
app.get('/api/health/db', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('DB health check failed:', err);
    res.status(500).json({ status: 'error', db: 'unreachable' });
  }
});

app.listen(PORT, () => {
  console.log(`DevOpsForge API listening on port ${PORT}`);
});