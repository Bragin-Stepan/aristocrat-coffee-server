/*
  Warnings:

  - You are about to drop the column `order` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "order",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "order",
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;
