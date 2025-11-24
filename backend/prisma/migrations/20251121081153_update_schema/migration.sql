-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW');

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "calendlyEventUri" TEXT NOT NULL,
    "calendlyEventId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "meetingLink" TEXT,
    "platform" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "lenderId" TEXT NOT NULL,
    "borrowerId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "canceledAt" TIMESTAMP(3),
    "cancelReason" TEXT,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_calendlyEventUri_key" ON "Meeting"("calendlyEventUri");

-- CreateIndex
CREATE UNIQUE INDEX "Meeting_calendlyEventId_key" ON "Meeting"("calendlyEventId");

-- CreateIndex
CREATE INDEX "Meeting_lenderId_idx" ON "Meeting"("lenderId");

-- CreateIndex
CREATE INDEX "Meeting_borrowerId_idx" ON "Meeting"("borrowerId");

-- CreateIndex
CREATE INDEX "Meeting_startTime_idx" ON "Meeting"("startTime");

-- CreateIndex
CREATE INDEX "Meeting_status_idx" ON "Meeting"("status");

-- CreateIndex
CREATE INDEX "Lead_status_idx" ON "Lead"("status");

-- CreateIndex
CREATE INDEX "Lead_source_idx" ON "Lead"("source");

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_lenderId_fkey" FOREIGN KEY ("lenderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_borrowerId_fkey" FOREIGN KEY ("borrowerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
