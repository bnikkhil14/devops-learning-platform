/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Incident` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Incident` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Incident_slug_key" ON "Incident"("slug");
