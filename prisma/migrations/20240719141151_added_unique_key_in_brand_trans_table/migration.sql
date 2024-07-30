/*
  Warnings:

  - A unique constraint covering the columns `[brand_name,lang]` on the table `brand_trans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "brand_trans_brand_name_lang_key" ON "brand_trans"("brand_name", "lang");
