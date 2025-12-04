-- CreateTable: InputFlatFile
-- This table stores user-provided variable values for scorecard calculations

CREATE TABLE IF NOT EXISTS "InputFlatFile" (
    "id" SERIAL NOT NULL,
    "appId" TEXT NOT NULL,
    "var_name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InputFlatFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InputFlatFile_appId_var_name_key" ON "InputFlatFile"("appId", "var_name");

-- CreateIndex
CREATE INDEX "InputFlatFile_appId_idx" ON "InputFlatFile"("appId");
