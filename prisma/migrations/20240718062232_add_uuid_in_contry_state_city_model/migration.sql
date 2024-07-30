/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `cities` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `countries` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `states` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `cities` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `countries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `states` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "cities" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "countries" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "states" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cities_uuid_key" ON "cities"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "countries_uuid_key" ON "countries"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "states_uuid_key" ON "states"("uuid");
