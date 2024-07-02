/*
  Warnings:

  - Made the column `stripe_subscription_name` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionName" AS ENUM ('NOOB', 'CASUAL', 'PRO');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "stripe_subscription_name" SET NOT NULL,
ALTER COLUMN "stripe_subscription_name" DROP DEFAULT;
