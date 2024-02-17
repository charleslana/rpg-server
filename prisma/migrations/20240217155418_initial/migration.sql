-- AlterTable
ALTER TABLE "tb_user_character" ADD COLUMN     "attribute_point" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "attribute_point_used" INTEGER NOT NULL DEFAULT 0;
