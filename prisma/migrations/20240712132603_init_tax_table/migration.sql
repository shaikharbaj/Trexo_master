-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('Tax', 'Fee_And_Charges');

-- CreateEnum
CREATE TYPE "TaxValueType" AS ENUM ('Fixed', 'Percent');

-- CreateEnum
CREATE TYPE "TaxServiceType" AS ENUM ('Package', 'Buyer_Fee', 'RSD', 'SELLER_INVOICE');

-- CreateTable
CREATE TABLE "taxes" (
    "id" SERIAL NOT NULL,
    "tax_name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "tax_type" "TaxType" NOT NULL,
    "tax_services" "TaxServiceType"[],
    "value_type" "TaxValueType" NOT NULL,
    "tax_value" DECIMAL(65,2) NOT NULL,
    "left_operand" TEXT,
    "operator" TEXT,
    "right_operand" TEXT,
    "constant" JSONB[],
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "taxes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "taxes_tax_name_key" ON "taxes"("tax_name");
