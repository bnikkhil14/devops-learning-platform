-- AlterEnum
ALTER TYPE "ContentType" ADD VALUE 'INCIDENT';

-- CreateTable
CREATE TABLE "Incident" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "scenarioText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentChoice" (
    "id" SERIAL NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "choiceText" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "feedbackText" TEXT NOT NULL,

    CONSTRAINT "IncidentChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserIncidentAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "incidentId" INTEGER NOT NULL,
    "choiceId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserIncidentAttempt_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncidentChoice" ADD CONSTRAINT "IncidentChoice_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIncidentAttempt" ADD CONSTRAINT "UserIncidentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIncidentAttempt" ADD CONSTRAINT "UserIncidentAttempt_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "Incident"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserIncidentAttempt" ADD CONSTRAINT "UserIncidentAttempt_choiceId_fkey" FOREIGN KEY ("choiceId") REFERENCES "IncidentChoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
