/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `modules` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "modules_slug_key" ON "modules"("slug");
