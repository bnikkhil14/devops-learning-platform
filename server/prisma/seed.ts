import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (safe for dev/seed re-runs)
  await prisma.lab.deleteMany();
  await prisma.project.deleteMany();
  await prisma.learningPath.deleteMany();

  const ciCdPath = await prisma.learningPath.create({
    data: {
      slug: 'ci-cd-fundamentals',
      title: 'CI/CD Fundamentals',
      description: 'Learn to build automated pipelines from commit to deploy.',
      difficulty: Difficulty.BEGINNER,
      estimatedHours: 6,
      order: 1,
    },
  });

  const containersPath = await prisma.learningPath.create({
    data: {
      slug: 'containers-and-orchestration',
      title: 'Containers & Orchestration',
      description: 'Docker fundamentals through to Kubernetes basics.',
      difficulty: Difficulty.INTERMEDIATE,
      estimatedHours: 10,
      order: 2,
    },
  });

  await prisma.lab.createMany({
    data: [
      {
        slug: 'write-your-first-github-actions-workflow',
        title: 'Write Your First GitHub Actions Workflow',
        description: 'Create a workflow that runs tests on every push.',
        difficulty: Difficulty.BEGINNER,
        estimatedMinutes: 30,
        order: 1,
        learningPathId: ciCdPath.id,
      },
      {
        slug: 'add-a-deploy-job',
        title: 'Add a Deploy Job',
        description: 'Extend a CI workflow to deploy on merge to main.',
        difficulty: Difficulty.BEGINNER,
        estimatedMinutes: 45,
        order: 2,
        learningPathId: ciCdPath.id,
      },
      {
        slug: 'dockerize-a-node-app',
        title: 'Dockerize a Node App',
        description: 'Write a Dockerfile and build your first image.',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedMinutes: 40,
        order: 1,
        learningPathId: containersPath.id,
      },
    ],
  });

  await prisma.project.createMany({
    data: [
      {
        slug: 'build-a-full-cicd-pipeline',
        title: 'Build a Full CI/CD Pipeline',
        description: 'End-to-end pipeline: lint, test, build, deploy to a live URL.',
        difficulty: Difficulty.BEGINNER,
        estimatedHours: 3,
        techStack: ['GitHub Actions', 'Node.js'],
        order: 1,
        learningPathId: ciCdPath.id,
      },
      {
        slug: 'deploy-a-multi-container-app',
        title: 'Deploy a Multi-Container App',
        description: 'Use Docker Compose to run an app with a database and cache.',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedHours: 4,
        techStack: ['Docker', 'Docker Compose', 'PostgreSQL'],
        order: 1,
        learningPathId: containersPath.id,
      },
    ],
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });