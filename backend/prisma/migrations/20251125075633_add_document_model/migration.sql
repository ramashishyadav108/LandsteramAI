-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'REJECTED');

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "documentName" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "filePublicId" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedBy" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Document_leadId_idx" ON "Document"("leadId");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "Document_uploadedBy_idx" ON "Document"("uploadedBy");
