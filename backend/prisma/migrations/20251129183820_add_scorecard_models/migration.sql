-- CreateTable
CREATE TABLE "ScorecardConfig" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "var_name" TEXT NOT NULL,
    "coefficient" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ScorecardConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScorecardBin" (
    "id" SERIAL NOT NULL,
    "config_id" INTEGER NOT NULL,
    "min_val" DOUBLE PRECISION,
    "max_val" DOUBLE PRECISION,
    "category_label" TEXT,
    "woe" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "ScorecardBin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScorecardScenario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "calibration" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "ScorecardScenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScorecardModuleConfig" (
    "id" SERIAL NOT NULL,
    "scenarioId" INTEGER NOT NULL,
    "module" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "intercept" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "ScorecardModuleConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScorecardConfig_var_name_key" ON "ScorecardConfig"("var_name");

-- CreateIndex
CREATE UNIQUE INDEX "ScorecardScenario_name_key" ON "ScorecardScenario"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ScorecardModuleConfig_scenarioId_module_key" ON "ScorecardModuleConfig"("scenarioId", "module");

-- AddForeignKey
ALTER TABLE "ScorecardBin" ADD CONSTRAINT "ScorecardBin_config_id_fkey" FOREIGN KEY ("config_id") REFERENCES "ScorecardConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScorecardModuleConfig" ADD CONSTRAINT "ScorecardModuleConfig_scenarioId_fkey" FOREIGN KEY ("scenarioId") REFERENCES "ScorecardScenario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
