/*
  Warnings:

  - Added the required column `slot` to the `tb_user_character` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tb_user_character" ADD COLUMN     "slot" INTEGER NOT NULL;
