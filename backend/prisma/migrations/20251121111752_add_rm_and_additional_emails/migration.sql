-- AlterTable
ALTER TABLE "Meeting" ADD COLUMN     "additionalEmails" TEXT[],
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "rmEmail" TEXT;
