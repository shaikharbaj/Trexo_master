-- CreateTable
CREATE TABLE "contact_us" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "email" VARCHAR(25) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "user_message" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "replied_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "contact_us_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_us_uuid_key" ON "contact_us"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "contact_us_email_key" ON "contact_us"("email");