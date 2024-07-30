/*
  Warnings:

  - A unique constraint covering the columns `[short_code]` on the table `states` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "states_short_code_key" ON "states"("short_code");
