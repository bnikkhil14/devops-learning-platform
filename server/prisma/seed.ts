import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (safe for dev/seed re-runs)
  await prisma.lab.deleteMany();
  await prisma.project.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.userIncidentAttempt.deleteMany(); // clear first — FK depends on Incident/IncidentChoice
  await prisma.incidentChoice.deleteMany(); // clear next — FK depends on Incident
  await prisma.incident.deleteMany(); // cascades to IncidentChoice if you set onDelete: Cascade, otherwise clear IncidentChoice explicitly too

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

  await seedIncidents();

  console.log('Seed complete.');
}

// Incidents

async function seedIncidents() {
  // Incident 1: Kubernetes
  await prisma.incident.create({
    data: {
      slug: 'pod-crashloopbackoff',
      title: 'Pod Stuck in CrashLoopBackOff',
      category: 'Kubernetes',
      difficulty: 'BEGINNER',
      scenarioText:
        'You deploy a new version of your API service. Ten minutes later, `kubectl get pods` shows the pod cycling through CrashLoopBackOff. The previous version was stable for weeks. What do you check first?',
      choices: {
        create: [
          {
            choiceText: 'Run `kubectl logs <pod-name> --previous` to see why the last container instance exited',
            isCorrect: true,
            feedbackText:
              'Correct. CrashLoopBackOff means the container is starting and immediately dying, so kubectl restarts it in a loop. `--previous` shows logs from the crashed instance, not the fresh one that hasn\'t failed yet — this is almost always where the actual error (bad config, missing env var, failed health check, unhandled exception on startup) shows up.',
          },
          {
            choiceText: 'Delete the pod so Kubernetes recreates it from the deployment',
            isCorrect: false,
            feedbackText:
              'This just restarts the same crash loop with a new pod name — the underlying cause in the image or config hasn\'t changed, so it will crash again. Deleting pods is a reasonable move for a stuck-but-healthy pod, not a crashing one.',
          },
          {
            choiceText: 'Scale the deployment to 0 replicas and back up to force a clean restart',
            isCorrect: false,
            feedbackText:
              'Same problem as deleting the pod — you\'re restarting the process, not diagnosing it. Scaling down also causes an outage if this is your only replica, which makes the incident worse while telling you nothing new.',
          },
          {
            choiceText: 'Roll back to the previous image tag immediately, then investigate later',
            isCorrect: false,
            feedbackText:
              'Rolling back is often the right operational call to restore service fast, but it doesn\'t answer "what do you check first" — and if you roll back without ever pulling the crash logs, you\'ll hit the same issue on the next deploy with no more information than you have now.',
          },
        ],
      },
    },
  });

  // Incident 2: Database
  await prisma.incident.create({
    data: {
      slug: 'database-connection-pool-exhausted',
      title: 'Database Connection Pool Exhausted',
      category: 'Database',
      difficulty: 'INTERMEDIATE',
      scenarioText:
        'Your API starts returning 500 errors under normal traffic. Logs show "remaining connection slots are reserved" from Postgres. Restarting the API fixes it for about 20 minutes, then it recurs. What\'s the underlying issue?',
      choices: {
        create: [
          {
            choiceText: 'The application isn\'t releasing/closing database connections properly, so the pool fills up over time',
            isCorrect: true,
            feedbackText:
              'Correct. A restart clears the pool instantly, which is why it "fixes" things temporarily — but connections leaking back in at the same rate means the real bug is in the app code (queries without proper connection release, an ORM client not being reused, or a code path that opens a connection but errors out before closing it).',
          },
          {
            choiceText: 'The Postgres server needs more RAM to support more connections',
            isCorrect: false,
            feedbackText:
              'More RAM lets Postgres support a higher max_connections ceiling, but it doesn\'t explain why connections are steadily accumulating in the first place. This treats the symptom — you\'d hit the same wall later, just after a longer delay.',
          },
          {
            choiceText: 'Increase `max_connections` in postgresql.conf',
            isCorrect: false,
            feedbackText:
              'This buys time but doesn\'t fix a leak — if the app is opening connections faster than it closes them, a higher ceiling just means a longer runway before the same exhaustion happens again, and each idle Postgres connection has real memory cost.',
          },
          {
            choiceText: 'Add a load balancer in front of the API to distribute traffic',
            isCorrect: false,
            feedbackText:
              'This doesn\'t address per-connection leakage at all — if anything, more API instances each leaking connections independently would exhaust the pool faster, not slower.',
          },
        ],
      },
    },
  });

  // Incident 3: CI/CD
  await prisma.incident.create({
    data: {
      slug: 'pipeline-passes-tests-breaks-production',
      title: 'Deployment Pipeline Passes Tests But Breaks Production',
      category: 'CI/CD',
      difficulty: 'INTERMEDIATE',
      scenarioText:
        'Your GitHub Actions pipeline runs unit tests, they all pass, and the deploy step succeeds. Five minutes after going live, users report the checkout page is broken. Local testing with `npm run dev` doesn\'t reproduce it. What\'s the most likely gap?',
      choices: {
        create: [
          {
            choiceText: 'The CI environment is missing an environment-specific difference (env vars, build mode, or a service the tests mock but production doesn\'t have)',
            isCorrect: true,
            feedbackText:
              'Correct. "Tests pass but prod breaks, dev doesn\'t reproduce it" is the classic signature of an environment gap — unit tests typically mock external dependencies (payment APIs, feature flags, env-specific config) that behave differently for real in production, and `npm run dev` often runs in a different mode (unminified, different env vars) than the actual production build.',
          },
          {
            choiceText: 'The tests themselves are flaky and need to be rewritten',
            isCorrect: false,
            feedbackText:
              'Flaky tests fail intermittently in CI itself — this scenario describes tests passing consistently while production behaves differently, which points to an environment or config gap rather than test reliability.',
          },
          {
            choiceText: 'The production server needs more CPU or memory',
            isCorrect: false,
            feedbackText:
              'Nothing in the scenario suggests a resource constraint (no slowness, no OOM errors mentioned) — jumping to infrastructure sizing skips checking what actually changed between the environments.',
          },
          {
            choiceText: 'Roll back and re-run the same pipeline again to see if it happens twice',
            isCorrect: false,
            feedbackText:
              'Re-running the identical pipeline against identical code will almost certainly reproduce the identical break, since nothing about the environment gap changes — this burns a deploy cycle without new information.',
          },
        ],
      },
    },
  });

  // Incident 4: Infrastructure
  await prisma.incident.create({
    data: {
      slug: 'disk-space-alert',
      title: 'Disk Space Alert on Production Server',
      category: 'Infrastructure',
      difficulty: 'BEGINNER',
      scenarioText:
        'You get a monitoring alert: disk usage on your production server hit 92%. The app is still running fine. What\'s your first diagnostic step?',
      choices: {
        create: [
          {
            choiceText: 'Run `du -sh /* 2>/dev/null | sort -rh | head -10` to find which directories are consuming the most space',
            isCorrect: true,
            feedbackText:
              'Correct. Before freeing anything, you need to know what\'s actually taking the space — it\'s often log files that were never rotated, old Docker images/containers, or a runaway temp/cache directory. Deleting blindly risks removing something you need; identifying the biggest consumers first makes the fix targeted and safe.',
          },
          {
            choiceText: 'Immediately delete everything in /tmp to free up space',
            isCorrect: false,
            feedbackText:
              '/tmp is a reasonable cleanup target, but doing it "immediately" without checking first means you don\'t actually know if that\'s where the 92% is coming from — if it\'s log files or Docker layers instead, you\'ve done work for no gain and are still at risk.',
          },
          {
            choiceText: 'Provision a larger disk and migrate the server to it',
            isCorrect: false,
            feedbackText:
              'This works but is a slow, disruptive fix for something that\'s often a five-minute cleanup — and if the real cause is something actively growing (like unrotated logs), a bigger disk just delays the same alert rather than resolving it.',
          },
          {
            choiceText: 'Restart the server to clear temporary files',
            isCorrect: false,
            feedbackText:
              'A restart clears very little on Linux by default (RAM-backed tmpfs at most) and does nothing about disk-resident log files, Docker images, or application data — the disk usage will be essentially unchanged after reboot.',
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });