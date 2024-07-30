/*
  Warnings:

  - A unique constraint covering the columns `[country_name,iso_code]` on the table `countries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "countries_country_name_iso_code_key" ON "countries"("country_name", "iso_code");
