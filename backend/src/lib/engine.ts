import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreditResult {
  scenario: string;
  probability_of_default: number;
  final_score: number;
  module_breakdown: Record<string, number>;
  details: any[];
}

/**
 * Calculate credit score using values from InputFlatFile table
 * @param appId - Application ID to fetch input values for
 * @param scenarioName - Scenario name (default: "Scenario 0")
 * @param updateInputs - Optional: Update InputFlatFile with new values before calculation
 */
export async function calculateCreditScore(
  appId: string,
  scenarioName: string = "Scenario 0",
  updateInputs?: { var_name: string; value: string }[]
): Promise<CreditResult> {

  // 1. UPDATE INPUT FLAT FILE (if new inputs provided)
  if (updateInputs && updateInputs.length > 0) {
    for (const input of updateInputs) {
      if (!input.var_name || input.var_name.trim() === '') continue;

      await prisma.inputFlatFile.upsert({
        where: {
          appId_var_name: {
            appId: appId,
            var_name: input.var_name.trim()
          }
        },
        update: {
          value: input.value ?? ''
        },
        create: {
          appId: appId,
          var_name: input.var_name.trim(),
          value: input.value ?? ''
        }
      });
    }
  }

  // 2. FETCH CONFIGURATION (Scenario, Variables, Saved Input Values)
  const [scenario, allVars, savedValues] = await Promise.all([
    prisma.scorecardScenario.findUnique({
      where: { name: scenarioName },
      include: { configs: true }
    }),
    prisma.scorecardConfig.findMany({
      include: { bins: true }
    }),
    prisma.inputFlatFile.findMany({
      where: { appId }
    })
  ]);

  if (!scenario) throw new Error(`Scenario '${scenarioName}' not found`);

  // Create lookup maps
  const configMap = scenario.configs.reduce((acc, curr) => {
    acc[curr.module] = { weight: curr.weight, intercept: curr.intercept };
    return acc;
  }, {} as Record<string, { weight: number, intercept: number }>);

  const valueMap = new Map(savedValues.map(v => [v.var_name, v.value]));

  const details = [];
  const moduleScores: Record<string, number> = {};

  // Initialize module scores
  scenario.configs.forEach(c => moduleScores[c.module] = 0);

  // 3. CALCULATE SCORES FOR EACH VARIABLE
  for (const variable of allVars) {
    // Get stored value from InputFlatFile
    const rawValue = valueMap.get(variable.var_name);

    let matchedBin = null;
    let activeFlag = 0;
    let matchedBinId = null;

    // --- BIN LOOKUP LOGIC ---
    if (rawValue !== undefined && rawValue !== null && rawValue !== "") {
      if (variable.type === 'NUMERIC') {
        const numVal = Number(rawValue);

        // Skip if not a valid number
        if (!isNaN(numVal)) {
          matchedBin = variable.bins.find(b =>
            b.min_val !== null && b.max_val !== null &&
            numVal >= b.min_val! && numVal < b.max_val!
          );
        }
      } else {
        // CATEGORICAL
        const strVal = String(rawValue).trim().toUpperCase();
        matchedBin = variable.bins.find(b =>
          b.category_label?.toUpperCase() === strVal
        );
      }
    }

    // Set active flag only if we found a match (not NA bin)
    if (matchedBin) {
      activeFlag = 1;
      matchedBinId = matchedBin.id;
    } else {
      // Fallback to NA bin if no match found, but keep activeFlag = 0
      matchedBin = variable.bins.find(b =>
        b.category_label === 'NA' ||
        b.category_label === 'NULL'
      );
    }

    const woe = matchedBin ? matchedBin.woe : 0;
    const bankValue = variable.coefficient * woe * activeFlag;

    // Add to Module Score if module exists in scenario
    if (moduleScores[variable.module] !== undefined) {
      moduleScores[variable.module] += bankValue;
    }

    // ADD ALL BINS FOR THIS VARIABLE (like Excel shows)
    for (const bin of variable.bins) {
      const isActiveBin = bin.id === matchedBinId;
      const binActiveFlag = isActiveBin ? 1 : 0;
      const binBankValue = variable.coefficient * bin.woe * binActiveFlag;

      details.push({
        Variable_Name: variable.var_name,
        Variable_Value: rawValue ?? "N/A",
        Active_Flag: binActiveFlag,
        Bank: binBankValue,
        WOE: bin.woe,
        Module: variable.module,
        Coefficient: variable.coefficient,
        Type: variable.type,
        Min_Value: bin.min_val,
        Max_Value: bin.max_val,
        Category_Label: bin.category_label,
        Bin_Id: bin.id
      });
    }
  }

  // 4. FINAL WEIGHTED AGGREGATION
  let totalLogOdds = 0;

  for (const [modName, baseScore] of Object.entries(moduleScores)) {
    const config = configMap[modName];

    if (config) {
      // Formula: (Module Sum + Intercept) * Weight
      const weightedScore = (baseScore + config.intercept) * config.weight;
      totalLogOdds += weightedScore;
    }
  }

  // Add Final Calibration
  totalLogOdds += scenario.calibration;

  // Calculate Probability of Default: PD = 1 / (1 + e^(-logOdds))
  const pd = 1 / (1 + Math.exp(-1 * totalLogOdds));

  return {
    scenario: scenarioName,
    probability_of_default: pd,
    final_score: totalLogOdds,
    module_breakdown: moduleScores,
    details: details
  };
}

/**
 * Get all variables grouped by module
 */
export async function getVariablesByModule() {
  const allVars = await prisma.scorecardConfig.findMany({
    include: { bins: true }
  });

  const grouped: Record<string, any[]> = {};

  for (const variable of allVars) {
    if (!grouped[variable.module]) {
      grouped[variable.module] = [];
    }

    grouped[variable.module].push({
      id: variable.id,
      var_name: variable.var_name,
      coefficient: variable.coefficient,
      type: variable.type,
      bins: variable.bins.map(b => ({
        id: b.id,
        min_val: b.min_val,
        max_val: b.max_val,
        category_label: b.category_label,
        woe: b.woe
      }))
    });
  }

  return grouped;
}

/**
 * Get input flat file data for an application
 */
export async function getInputFlatFile(appId: string) {
  return await prisma.inputFlatFile.findMany({
    where: { appId }
  });
}

/**
 * Update or create multiple input flat file entries
 */
export async function bulkUpdateInputFlatFile(
  appId: string,
  inputs: { var_name: string; value: string }[]
) {
  const results = [];

  for (const input of inputs) {
    if (!input.var_name || input.var_name.trim() === '') continue;

    const result = await prisma.inputFlatFile.upsert({
      where: {
        appId_var_name: {
          appId: appId,
          var_name: input.var_name.trim()
        }
      },
      update: {
        value: input.value ?? ''
      },
      create: {
        appId: appId,
        var_name: input.var_name.trim(),
        value: input.value ?? ''
      }
    });

    results.push(result);
  }

  return results;
}

/**
 * Delete all input flat file data for an application
 */
export async function clearInputFlatFile(appId: string) {
  return await prisma.inputFlatFile.deleteMany({
    where: { appId }
  });
}

/**
 * Get all available scenarios
 */
export async function getAllScenarios() {
  return await prisma.scorecardScenario.findMany({
    include: { configs: true }
  });
}
