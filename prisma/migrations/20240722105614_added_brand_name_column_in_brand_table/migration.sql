/*
  Warnings:

  - Added the required column `brand_name` to the `brands` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "brands" ADD COLUMN     "brand_name" VARCHAR(25) NOT NULL;
