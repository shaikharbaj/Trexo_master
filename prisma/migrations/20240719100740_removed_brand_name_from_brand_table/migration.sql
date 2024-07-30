/*
  Warnings:

  - You are about to drop the column `brand_name` on the `brands` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "brands_brand_name_key";

-- AlterTable
ALTER TABLE "brands" DROP COLUMN "brand_name";
