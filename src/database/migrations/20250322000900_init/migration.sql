-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "CharacterClassEnum" AS ENUM ('attack', 'defense', 'magic', 'support');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('male', 'female');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "banned_time" TIMESTAMP(3),
    "name" VARCHAR(50) NOT NULL,
    "nickname" VARCHAR(20) NOT NULL,
    "gender" "GenderEnum" NOT NULL,
    "avatar" TEXT NOT NULL,
    "character_class" "CharacterClassEnum" NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "gold" INTEGER NOT NULL DEFAULT 200,
    "credit" INTEGER NOT NULL DEFAULT 0,
    "emerald" INTEGER NOT NULL DEFAULT 0,
    "sapphire" INTEGER NOT NULL DEFAULT 0,
    "crystal" INTEGER NOT NULL DEFAULT 0,
    "diamond" INTEGER NOT NULL DEFAULT 0,
    "exp" INTEGER NOT NULL DEFAULT 0,
    "life" INTEGER NOT NULL DEFAULT 100,
    "description" VARCHAR(300),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_role" (
    "id" SERIAL NOT NULL,
    "name" "RoleEnum" NOT NULL DEFAULT 'user',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_attribute" (
    "id" SERIAL NOT NULL,
    "strength" INTEGER NOT NULL DEFAULT 1,
    "defense" INTEGER NOT NULL DEFAULT 1,
    "agility" INTEGER NOT NULL DEFAULT 1,
    "intelligence" INTEGER NOT NULL DEFAULT 1,
    "endurance" INTEGER NOT NULL DEFAULT 1,
    "spend_point" INTEGER NOT NULL DEFAULT 5,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tb_user_attribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_statistic" (
    "id" SERIAL NOT NULL,
    "honor_victories" INTEGER NOT NULL DEFAULT 0,
    "total_battles" INTEGER NOT NULL DEFAULT 0,
    "battles_won" INTEGER NOT NULL DEFAULT 0,
    "battles_lost" INTEGER NOT NULL DEFAULT 0,
    "battles_draw" INTEGER NOT NULL DEFAULT 0,
    "damage_done" INTEGER NOT NULL DEFAULT 0,
    "damage_suffered" INTEGER NOT NULL DEFAULT 0,
    "gold_won" INTEGER NOT NULL DEFAULT 0,
    "gold_lost" INTEGER NOT NULL DEFAULT 0,
    "arena_points" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "tb_user_statistic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_title" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "user_title_id" INTEGER NOT NULL,

    CONSTRAINT "tb_title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_title" (
    "id" SERIAL NOT NULL,
    "equipped" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_title_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_nickname_key" ON "tb_user"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_attribute_user_id_key" ON "tb_user_attribute"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_statistic_user_id_key" ON "tb_user_statistic"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_title_user_title_id_key" ON "tb_title"("user_title_id");

-- AddForeignKey
ALTER TABLE "tb_user_role" ADD CONSTRAINT "tb_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_attribute" ADD CONSTRAINT "tb_user_attribute_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_statistic" ADD CONSTRAINT "tb_user_statistic_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_title" ADD CONSTRAINT "tb_title_user_title_id_fkey" FOREIGN KEY ("user_title_id") REFERENCES "tb_user_title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_title" ADD CONSTRAINT "tb_user_title_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
