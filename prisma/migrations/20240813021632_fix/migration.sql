/*
  Warnings:

  - You are about to drop the column `stripe_updated_at_pt_br` on the `users` table. All the data in the column will be lost.
  - The `stripe_updated_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "games" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "stripe_updated_at_pt_br",
DROP COLUMN "stripe_updated_at",
ADD COLUMN     "stripe_updated_at" TIMESTAMP(3);
