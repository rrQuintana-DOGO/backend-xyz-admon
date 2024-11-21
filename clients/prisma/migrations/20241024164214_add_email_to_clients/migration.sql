/*
  Warnings:

  - Added the required column `email` to the `clients` table without a default value. This is not possible if the table is not empty.
  - Made the column `id_ext` on table `clients` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ALTER COLUMN "id_ext" SET NOT NULL;
