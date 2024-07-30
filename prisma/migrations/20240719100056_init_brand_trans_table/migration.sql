-- CreateTable
CREATE TABLE "brand_trans" (
    "id" SERIAL NOT NULL,
    "brand_id" INTEGER NOT NULL,
    "brand_name" VARCHAR(25) NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "brand_trans_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "brand_trans" ADD CONSTRAINT "brand_trans_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
