-- CreateTable
CREATE TABLE "divisions" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "division_name" VARCHAR(25) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "divisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "divisions_uuid_key" ON "divisions"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_division_name_key" ON "divisions"("division_name");

-- CreateIndex
CREATE UNIQUE INDEX "divisions_slug_key" ON "divisions"("slug");
