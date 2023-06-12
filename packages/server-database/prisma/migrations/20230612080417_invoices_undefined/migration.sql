-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('draft', 'finalised', 'sent', 'paid');

-- CreateTable
CREATE TABLE "invoices" (
    "name" TEXT NOT NULL,
    "amount" INTEGER DEFAULT 0,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'draft',
    "number" TEXT,
    "finalised_date" TIMESTAMP(3),
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);
