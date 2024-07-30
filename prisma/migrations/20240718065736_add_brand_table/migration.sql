-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "brand_name" VARCHAR(25) NOT NULL,
    "image" VARCHAR(255),
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "brand_associations" DECIMAL(65,30) DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_uuid_key" ON "brands"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "brands_brand_name_key" ON "brands"("brand_name");
