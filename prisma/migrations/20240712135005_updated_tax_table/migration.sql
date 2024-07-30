/*
  Warnings:

  - You are about to drop the column `constant` on the `taxes` table. All the data in the column will be lost.
  - You are about to drop the column `left_operand` on the `taxes` table. All the data in the column will be lost.
  - You are about to drop the column `operator` on the `taxes` table. All the data in the column will be lost.
  - You are about to drop the column `right_operand` on the `taxes` table. All the data in the column will be lost.
  - You are about to drop the column `tax_services` on the `taxes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "taxes" DROP COLUMN "constant",
DROP COLUMN "left_operand",
DROP COLUMN "operator",
DROP COLUMN "right_operand",
DROP COLUMN "tax_services";

-- DropEnum
DROP TYPE "TaxServiceType";
