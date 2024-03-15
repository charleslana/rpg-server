/*
  Warnings:

  - You are about to drop the column `diamond` on the `tb_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tb_user" DROP COLUMN "diamond",
ADD COLUMN     "experience" INTEGER NOT NULL DEFAULT 25,
ADD COLUMN     "ruby" INTEGER NOT NULL DEFAULT 100;
