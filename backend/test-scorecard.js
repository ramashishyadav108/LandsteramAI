// Test script for scorecard API
const testData = {
  scenario: "Scenario 0",
  RT_CH_TXN_TO_TOT_TXN: "0.04",
  INDUSTRY_CATG_WOE: "MANUFACTURING",
  AVG_CR_TXN_TO_DEBIT_TXN: "0.5",
  CASH_DB_TXN_TO_OVR_TXN: "0.05",
  BALMARG_M1_M6_CURR_BAL: "0.3",
  COMPANY_CATG_WOE: "PARTNERSHIP",
  RATIO_EXP_AGE_WOE: "0.05"
};

fetch('http://localhost:3000/api/scorecard/calculate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
})
  .then(res => res.json())
  .then(data => {
    console.log('✅ API Response:', JSON.stringify(data, null, 2));
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
  });
