/*
  Warnings:

  - A unique constraint covering the columns `[iso_code]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "countries_country_name_iso_code_key";

-- DropIndex
DROP INDEX "countries_country_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_code_key" ON "countries"("iso_code");
