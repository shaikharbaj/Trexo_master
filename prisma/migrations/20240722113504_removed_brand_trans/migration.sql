/*
  Warnings:

  - You are about to drop the `brand_trans` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "brand_trans" DROP CONSTRAINT "brand_trans_brand_id_fkey";

-- DropTable
DROP TABLE "brand_trans";
