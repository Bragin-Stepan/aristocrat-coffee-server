-- CreateEnum
CREATE TYPE "roles" AS ENUM ('user', 'seller', 'admin', 'developer');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "telegram_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "role" "roles" NOT NULL DEFAULT 'user',
    "phone_number" TEXT DEFAULT '',
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "is_was_premium" BOOLEAN NOT NULL DEFAULT false,
    "photo_url" TEXT,
    "language_code" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegram_id_key" ON "user"("telegram_id");
