/*
  Warnings:

  - Made the column `id_client` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id_subscription_stripe` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "id_client" SET NOT NULL,
ALTER COLUMN "id_subscription_stripe" SET NOT NULL;
