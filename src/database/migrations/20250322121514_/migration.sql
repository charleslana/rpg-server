/*
  Warnings:

  - You are about to drop the column `user_title_id` on the `tb_title` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,title_id]` on the table `tb_user_title` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title_id` to the `tb_user_title` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tb_title" DROP CONSTRAINT "tb_title_user_title_id_fkey";

-- DropIndex
DROP INDEX "tb_title_user_title_id_key";

-- AlterTable
ALTER TABLE "tb_title" DROP COLUMN "user_title_id";

-- AlterTable
ALTER TABLE "tb_user_title" ADD COLUMN     "title_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_title_user_id_title_id_key" ON "tb_user_title"("user_id", "title_id");

-- AddForeignKey
ALTER TABLE "tb_user_title" ADD CONSTRAINT "tb_user_title_title_id_fkey" FOREIGN KEY ("title_id") REFERENCES "tb_title"("id") ON DELETE CASCADE ON UPDATE CASCADE;
