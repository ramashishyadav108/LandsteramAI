-- Add missing columns to InputFlatFile table
ALTER TABLE "InputFlatFile"
ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing rows to have proper timestamps if they're missing
UPDATE "InputFlatFile"
SET "createdAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
WHERE "createdAt" IS NULL OR "updatedAt" IS NULL;
