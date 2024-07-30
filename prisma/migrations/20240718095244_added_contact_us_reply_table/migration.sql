-- CreateTable
CREATE TABLE "contact_us_replies" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "contact_us_id" INTEGER NOT NULL,
    "user_message" TEXT NOT NULL,
    "replied_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "contact_us_replies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_us_replies_uuid_key" ON "contact_us_replies"("uuid");

-- AddForeignKey
ALTER TABLE "contact_us_replies" ADD CONSTRAINT "contact_us_replies_contact_us_id_fkey" FOREIGN KEY ("contact_us_id") REFERENCES "contact_us"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
