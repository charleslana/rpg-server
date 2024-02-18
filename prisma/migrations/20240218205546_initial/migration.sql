-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "CharacterClassEnum" AS ENUM ('melee', 'ranged');

-- CreateTable
CREATE TABLE "tb_user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "gold" INTEGER NOT NULL DEFAULT 5000,
    "diamond" INTEGER NOT NULL DEFAULT 0,
    "banned_time" TIMESTAMP(3),
    "auth_token" TEXT,
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
CREATE TABLE "tb_character" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "character_class" "CharacterClassEnum" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_user_character" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "strength" INTEGER NOT NULL DEFAULT 1,
    "intelligence" INTEGER NOT NULL DEFAULT 1,
    "dexterity" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "attribute_point" INTEGER NOT NULL DEFAULT 0,
    "attribute_point_used" INTEGER NOT NULL DEFAULT 0,
    "slot" INTEGER,
    "user_id" INTEGER NOT NULL,
    "character_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tb_user_character_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_email_key" ON "tb_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tb_user_name_key" ON "tb_user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_character_name_key" ON "tb_character"("name");

-- AddForeignKey
ALTER TABLE "tb_user_role" ADD CONSTRAINT "tb_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "tb_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_user_character" ADD CONSTRAINT "tb_user_character_character_id_fkey" FOREIGN KEY ("character_id") REFERENCES "tb_character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
