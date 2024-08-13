/*
  Warnings:

  - You are about to drop the column `created_at_pt_br` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at_pt_br` on the `users` table. All the data in the column will be lost.
  - The `created_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at_pt_br",
DROP COLUMN "updated_at_pt_br",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
DROP COLUMN "created_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "updated_at",
ADD COLUMN     "updated_at" TIMESTAMP(3);
