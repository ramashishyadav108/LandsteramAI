import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing scorecard data
  console.log('Clearing existing scorecard data...');
  await prisma.scorecardModuleConfig.deleteMany();
  await prisma.scorecardScenario.deleteMany();
  await prisma.scorecardBin.deleteMany();
  await prisma.scorecardConfig.deleteMany();

  // Insert Variables (77 Total)
  console.log('Inserting scorecard variables...');
  const variables = [
    { id: 1, module: 'Application', var_name: 'RATIO_EXP_AGE_WOE', coefficient: -2.0704088, type: 'NUMERIC' },
    { id: 2, module: 'Application', var_name: 'INDUSTRY_CATG_WOE', coefficient: -0.8335912, type: 'CATEGORICAL' },
    { id: 3, module: 'Application', var_name: 'COLLATERAL_TYPE_DRV_WOE', coefficient: -0.9627465, type: 'CATEGORICAL' },
    { id: 4, module: 'Application', var_name: 'COMPANY_CATG_WOE', coefficient: -1.0774083, type: 'CATEGORICAL' },
    { id: 5, module: 'Application', var_name: 'CUST_VINTAGE_MEAN_WOE', coefficient: -1.1287911, type: 'NUMERIC' },
    { id: 6, module: 'Bureau Commercial', var_name: 'wctl_util_3mo_max_woe', coefficient: -1.0469705, type: 'NUMERIC' },
    { id: 7, module: 'Bureau Commercial', var_name: 'MAX_dpd_15mo_max1_woe', coefficient: -0.7052159, type: 'NUMERIC' },
    { id: 8, module: 'Bureau Commercial', var_name: 'MIN_msince2_DPD_0+ woe', coefficient: -0.6993027, type: 'NUMERIC' },
    { id: 9, module: 'Bureau Commercial', var_name: 'MAX_relationship_months woe', coefficient: -2.2392974, type: 'NUMERIC' },
    { id: 10, module: 'Bureau Commercial', var_name: 'new_sec_acc_6mo_woe', coefficient: -0.9757448, type: 'NUMERIC' },
    { id: 11, module: 'Bureau Individual', var_name: 'mi_mf_dpdR_msince1_060+_woe', coefficient: -1.8889165, type: 'NUMERIC' },
    { id: 12, module: 'Bureau Individual', var_name: 'Ac_rlen_mean_woe', coefficient: -0.7473817, type: 'NUMERIC' },
    { id: 13, module: 'Bureau Individual', var_name: 'Mc_enq_12mo_woe', coefficient: -1.0442629, type: 'NUMERIC' },
    { id: 14, module: 'Bureau Individual', var_name: 'mi_enqmsince_sec_woe', coefficient: -0.5225601, type: 'NUMERIC' },
    { id: 15, module: 'Bureau Individual', var_name: 'Mc_util1_max_sq_woe', coefficient: -1.0556773, type: 'NUMERIC' },
    { id: 16, module: 'Bureau Individual', var_name: 'IN_util_dpd_recency_6mo_90plus_woe', coefficient: -1.0029961, type: 'NUMERIC' },
    { id: 17, module: 'Bureau Individual', var_name: 'IN_secured_acct_ratio_woe', coefficient: -1.0054407, type: 'NUMERIC' },
    { id: 18, module: 'Cash Flow', var_name: 'RT_CH_TXN_TO_TOT_TXN', coefficient: 0.15, type: 'NUMERIC' },
    { id: 19, module: 'Cash Flow', var_name: 'AVG_CR_TXN_TO_DEBIT_TXN', coefficient: 0.15, type: 'NUMERIC' },
    { id: 20, module: 'Cash Flow', var_name: 'CASH_DB_TXN_TO_OVR_TXN', coefficient: 0.2, type: 'NUMERIC' },
    { id: 21, module: 'Cash Flow', var_name: 'BALMARG_M1_M6_CURR_BAL', coefficient: 0.15, type: 'NUMERIC' },
    { id: 22, module: 'Cash Flow', var_name: 'AVG_MOM_GROWTH_CURR_BAL', coefficient: 0.1, type: 'NUMERIC' },
    { id: 23, module: 'Cash Flow', var_name: 'TOT_BOUNCES(I/W+O/W)_L6M', coefficient: 0.15, type: 'NUMERIC' },
    { id: 24, module: 'Cash Flow', var_name: 'AVG_RATIO_(CR/DT)_L6M', coefficient: 0.1, type: 'NUMERIC' },
    { id: 25, module: 'Financial', var_name: 'rt_atnw to_total_bank_borrowings_Latest_woe', coefficient: -0.78914, type: 'NUMERIC' },
    { id: 26, module: 'Financial', var_name: 'DSCR_Latest_woe', coefficient: -0.493728, type: 'NUMERIC' },
    { id: 27, module: 'Financial', var_name: 'rt_revenue_to_wc_Latest_woe', coefficient: -0.508657, type: 'NUMERIC' },
    { id: 28, module: 'Financial', var_name: 'rt_toi_to_net_sales_Latest_woe', coefficient: -0.698046, type: 'NUMERIC' },
    { id: 29, module: 'Financial', var_name: 'QUICK_RATIO_Latest_industryScaled_woe', coefficient: -0.642275, type: 'CATEGORICAL' },
    { id: 30, module: 'Financial', var_name: 'rt_cash_and_bank_balance_to_total_assets_woe', coefficient: -0.420713, type: 'NUMERIC' },
    { id: 31, module: 'Financial', var_name: 'inventory_days_latest_woe', coefficient: -0.473057, type: 'NUMERIC' },
    { id: 32, module: 'Internal Deposit', var_name: 'BALMAG_M1 M6_CURR_BAL_woe', coefficient: -0.8990312, type: 'NUMERIC' },
    { id: 33, module: 'Internal Deposit', var_name: 'RATIO_M1_M3 CASH_DR CNT_DR CNT_woe', coefficient: -1.4478949, type: 'NUMERIC' },
    { id: 34, module: 'Internal Deposit', var_name: 'STDev_M2_M4_MoM_Growth_MON_MAX_BAL_woe', coefficient: -0.8526208, type: 'NUMERIC' },
    { id: 35, module: 'Internal Deposit', var_name: 'MT75PERC_WD_COUNT_ M1_M9_CURR_BAL_woe', coefficient: -1.138042, type: 'NUMERIC' },
    { id: 36, module: 'Internal Deposit', var_name: 'AVG_M2_M7_MoM_Growth_MON_DR_CNT_Woe', coefficient: -0.9627996, type: 'NUMERIC' },
    { id: 37, module: 'Internal Deposit', var_name: 'AVG_RATIO_M1_M6_CR_AMT_DR_AMT_woe', coefficient: -0.4268153, type: 'NUMERIC' },
    { id: 38, module: 'Base Survey', var_name: 'BO5', coefficient: 0.064, type: 'CATEGORICAL' },
    { id: 39, module: 'Base Survey', var_name: 'BO28', coefficient: 0.05, type: 'CATEGORICAL' },
    { id: 40, module: 'Base Survey', var_name: 'BO37', coefficient: 0.049, type: 'CATEGORICAL' },
    { id: 41, module: 'Base Survey', var_name: 'OM8', coefficient: 0.05, type: 'CATEGORICAL' },
    { id: 42, module: 'Base Survey', var_name: 'BS01', coefficient: 0.0263473324954102, type: 'CATEGORICAL' },
    { id: 43, module: 'Base Survey', var_name: 'BP01', coefficient: 0.029, type: 'CATEGORICAL' },
    { id: 44, module: 'Base Survey', var_name: 'BP05', coefficient: 0.031, type: 'CATEGORICAL' },
    { id: 45, module: 'Base Survey', var_name: 'F01', coefficient: 0.028, type: 'CATEGORICAL' },
    { id: 46, module: 'Base Survey', var_name: 'F06', coefficient: 0.017, type: 'CATEGORICAL' },
    { id: 47, module: 'Base Survey', var_name: 'F18', coefficient: 0.056, type: 'CATEGORICAL' },
    { id: 48, module: 'Base Survey', var_name: 'F02', coefficient: 0.044, type: 'CATEGORICAL' },
    { id: 49, module: 'Base Survey', var_name: 'F22', coefficient: 0.039, type: 'CATEGORICAL' },
    { id: 50, module: 'Base Survey', var_name: 'F20', coefficient: 0.055, type: 'CATEGORICAL' },
    { id: 51, module: 'Base Survey', var_name: 'F12', coefficient: 0.055, type: 'CATEGORICAL' },
    { id: 52, module: 'Base Survey', var_name: 'F40', coefficient: 0.042, type: 'CATEGORICAL' },
    { id: 53, module: 'Base Survey', var_name: 'C17', coefficient: 0.029, type: 'CATEGORICAL' },
    { id: 54, module: 'Base Survey', var_name: 'C07', coefficient: 0.03, type: 'CATEGORICAL' },
    { id: 55, module: 'Base Survey', var_name: 'C14', coefficient: 0.022, type: 'CATEGORICAL' },
    { id: 56, module: 'Base Survey', var_name: 'C19', coefficient: 0.033, type: 'CATEGORICAL' },
    { id: 57, module: 'Base Survey', var_name: 'CR05', coefficient: 0.034, type: 'CATEGORICAL' },
    { id: 58, module: 'Base Survey', var_name: 'CR14', coefficient: 0.059, type: 'CATEGORICAL' },
    { id: 59, module: 'Base Survey', var_name: 'CR02', coefficient: 0.037, type: 'CATEGORICAL' },
    { id: 60, module: 'Base Survey', var_name: 'I1', coefficient: 0.047, type: 'CATEGORICAL' },
    { id: 61, module: 'Base Survey', var_name: 'I8', coefficient: 0.075, type: 'CATEGORICAL' },
    { id: 62, module: 'Industry Survey Manufacturing', var_name: 'IM4', coefficient: 0.17194175, type: 'CATEGORICAL' },
    { id: 63, module: 'Industry Survey Manufacturing', var_name: 'IM9', coefficient: 0.08673152, type: 'CATEGORICAL' },
    { id: 64, module: 'Industry Survey Manufacturing', var_name: 'IM!4', coefficient: 0.20029329, type: 'CATEGORICAL' },
    { id: 65, module: 'Industry Survey Manufacturing', var_name: 'IM15', coefficient: 0.19088611, type: 'CATEGORICAL' },
    { id: 66, module: 'Industry Survey Manufacturing', var_name: 'IM16', coefficient: 0.18943313, type: 'CATEGORICAL' },
    { id: 67, module: 'Industry Survey Manufacturing', var_name: 'IM17', coefficient: 0.16071421, type: 'CATEGORICAL' },
    { id: 68, module: 'Industry Survey Services', var_name: 'IS2', coefficient: 0.4, type: 'CATEGORICAL' },
    { id: 69, module: 'Industry Survey Services', var_name: 'IS4', coefficient: 0.21, type: 'CATEGORICAL' },
    { id: 70, module: 'Industry Survey Services', var_name: 'IS6', coefficient: 0.22, type: 'CATEGORICAL' },
    { id: 71, module: 'Industry Survey Services', var_name: 'IS7', coefficient: 0.18, type: 'CATEGORICAL' },
    { id: 72, module: 'Industry Survey Trading', var_name: 'IT4', coefficient: 0.271, type: 'CATEGORICAL' },
    { id: 73, module: 'Industry Survey Trading', var_name: 'IT5', coefficient: 0.1, type: 'CATEGORICAL' },
    { id: 74, module: 'Industry Survey Trading', var_name: 'IT6', coefficient: 0.15, type: 'CATEGORICAL' },
    { id: 75, module: 'Industry Survey Trading', var_name: 'IT8', coefficient: 0.14, type: 'CATEGORICAL' },
    { id: 76, module: 'Industry Survey Trading', var_name: 'IT9', coefficient: 0.2, type: 'CATEGORICAL' },
    { id: 77, module: 'Industry Survey Trading', var_name: 'IT10', coefficient: 0.14, type: 'CATEGORICAL' },
  ];

  for (const variable of variables) {
    await prisma.scorecardConfig.create({ data: variable });
  }

  console.log('Inserting scorecard bins...');
  const bins = [
    // Variable 1 bins
    { config_id: 1, min_val: 0.0, max_val: 0.02, category_label: null, woe: -0.069 },
    { config_id: 1, min_val: 0.02, max_val: 0.09, category_label: null, woe: -0.0429 },
    { config_id: 1, min_val: 0.09, max_val: 0.3, category_label: null, woe: -0.0035 },
    { config_id: 1, min_val: 0.3, max_val: 1e+99, category_label: null, woe: 0.0845 },
    { config_id: 1, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },

    // Variable 2 bins (INDUSTRY_CATG_WOE)
    { config_id: 2, min_val: null, max_val: null, category_label: 'TRADING', woe: 0.2917 },
    { config_id: 2, min_val: null, max_val: null, category_label: 'MANUFACTURING', woe: -0.2048 },
    { config_id: 2, min_val: null, max_val: null, category_label: 'SERVICES', woe: 0.3661 },
    { config_id: 2, min_val: null, max_val: null, category_label: 'OTHERS', woe: 0.299 },
    { config_id: 2, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },

    // Variable 4 bins (COMPANY_CATG_WOE)
    { config_id: 4, min_val: null, max_val: null, category_label: 'PARTNERSHIP', woe: 0.3382 },
    { config_id: 4, min_val: null, max_val: null, category_label: 'PROPRIETORSHIP', woe: -0.0863 },
    { config_id: 4, min_val: null, max_val: null, category_label: "CO'S-PRIVATE", woe: -0.1191 },
    { config_id: 4, min_val: null, max_val: null, category_label: 'OTHERS', woe: -0.1053 },
    { config_id: 4, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },

    // Variable 18 bins (RT_CH_TXN_TO_TOT_TXN)
    { config_id: 18, min_val: -1e+99, max_val: 0.015075, category_label: null, woe: 0.036483005 },
    { config_id: 18, min_val: 0.015075, max_val: 0.069164, category_label: null, woe: 0.058593918 },
    { config_id: 18, min_val: 0.069164, max_val: 0.150901, category_label: null, woe: 0.072597496 },
    { config_id: 18, min_val: 0.150901, max_val: 1e+99, category_label: null, woe: 0.09839356 },
    { config_id: 18, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },

    // Variable 19 bins (AVG_CR_TXN_TO_DEBIT_TXN)
    { config_id: 19, min_val: -1e+99, max_val: 0.33, category_label: null, woe: 0.038694097 },
    { config_id: 19, min_val: 0.33, max_val: 0.53, category_label: null, woe: 0.03611449 },
    { config_id: 19, min_val: 0.53, max_val: 1.75, category_label: null, woe: 0.031323792 },
    { config_id: 19, min_val: 1.75, max_val: 1e+99, category_label: null, woe: 0.007370304 },
    { config_id: 19, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },

    // Variable 20 bins (CASH_DB_TXN_TO_OVR_TXN)
    { config_id: 20, min_val: -1e+99, max_val: 0.03, category_label: null, woe: 0.029455278 },
    { config_id: 20, min_val: 0.03, max_val: 0.1, category_label: null, woe: 0.035513368 },
    { config_id: 20, min_val: 0.1, max_val: 1e+99, category_label: null, woe: 0.047421831 },
    { config_id: 20, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },

    // Variable 21 bins (BALMARG_M1_M6_CURR_BAL)
    { config_id: 21, min_val: -1e+99, max_val: 0.25, category_label: null, woe: 0.035306655 },
    { config_id: 21, min_val: 0.25, max_val: 0.5, category_label: null, woe: 0.018540538 },
    { config_id: 21, min_val: 0.5, max_val: 1e+99, category_label: null, woe: 0.007044928 },
    { config_id: 21, min_val: null, max_val: null, category_label: 'NA', woe: 0.0 },
  ];

  for (const bin of bins) {
    await prisma.scorecardBin.create({ data: bin });
  }

  // Insert Scenarios
  console.log('Inserting scenarios...');

  const scenario0 = await prisma.scorecardScenario.create({
    data: {
      id: 1,
      name: 'Scenario 0',
      calibration: -1.0754,
    },
  });

  const scenario1 = await prisma.scorecardScenario.create({
    data: {
      id: 2,
      name: 'Scenario 1',
      calibration: -0.9101,
    },
  });

  // Insert Module Configs for Scenario 0
  console.log('Inserting module configs for Scenario 0...');
  const scenario0Configs = [
    { scenarioId: 1, module: 'Application', weight: 0.10, intercept: -2.4053 },
    { scenarioId: 1, module: 'Bureau Commercial', weight: 0.25, intercept: -2.1279 },
    { scenarioId: 1, module: 'Bureau Individual', weight: 0.25, intercept: -2.3207 },
    { scenarioId: 1, module: 'Internal Deposit', weight: 0.075, intercept: -1.9105 },
    { scenarioId: 1, module: 'Cash Flow', weight: 0.075, intercept: 0.0 },
    { scenarioId: 1, module: 'Financial', weight: 0.0, intercept: -2.4238 },
    { scenarioId: 1, module: 'Industry Survey Trading', weight: 0.30, intercept: 0.0 },
    { scenarioId: 1, module: 'Industry Survey Manufacturing', weight: 0.30, intercept: 0.0 },
    { scenarioId: 1, module: 'Industry Survey Services', weight: 0.30, intercept: 0.0 },
    { scenarioId: 1, module: 'Base Survey', weight: 0.30, intercept: 0.0 },
  ];

  for (const config of scenario0Configs) {
    await prisma.scorecardModuleConfig.create({ data: config });
  }

  // Insert Module Configs for Scenario 1
  console.log('Inserting module configs for Scenario 1...');
  const scenario1Configs = [
    { scenarioId: 2, module: 'Application', weight: 0.15, intercept: -2.4053 },
    { scenarioId: 2, module: 'Bureau Commercial', weight: 0.15, intercept: -2.1279 },
    { scenarioId: 2, module: 'Bureau Individual', weight: 0.15, intercept: -2.3207 },
    { scenarioId: 2, module: 'Internal Deposit', weight: 0.075, intercept: -1.9105 },
    { scenarioId: 2, module: 'Cash Flow', weight: 0.075, intercept: 0.0 },
    { scenarioId: 2, module: 'Financial', weight: 0.0, intercept: -2.4238 },
    { scenarioId: 2, module: 'Industry Survey Trading', weight: 0.30, intercept: 0.0 },
    { scenarioId: 2, module: 'Industry Survey Manufacturing', weight: 0.30, intercept: 0.0 },
    { scenarioId: 2, module: 'Industry Survey Services', weight: 0.30, intercept: 0.0 },
    { scenarioId: 2, module: 'Base Survey', weight: 0.30, intercept: 0.0 },
  ];

  for (const config of scenario1Configs) {
    await prisma.scorecardModuleConfig.create({ data: config });
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
