import { useState } from 'react';
import './ScorecardTestPage.css';

interface CreditResult {
  scenario: string;
  probability_of_default: number;
  final_score: number;
  module_breakdown: Record<string, number>;
  details: Array<{
    Variable_Name: string;
    Variable_Value: string;
    Active_Flag: number;
    Bank: number;
    WOE: number;
    Module: string;
  }>;
}

export default function ScorecardTestPage() {
  const [formData, setFormData] = useState({
    scenario: 'Scenario 0',
    RT_CH_TXN_TO_TOT_TXN: '0.04',
    INDUSTRY_CATG_WOE: 'MANUFACTURING',
    AVG_CR_TXN_TO_DEBIT_TXN: '0.5',
    CASH_DB_TXN_TO_OVR_TXN: '0.05',
    BALMARG_M1_M6_CURR_BAL: '0.3',
    COMPANY_CATG_WOE: 'PARTNERSHIP',
    RATIO_EXP_AGE_WOE: '0.05',
  });

  const [result, setResult] = useState<CreditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/scorecard/calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.message || 'Failed to calculate score');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scorecard-container">
      <div className="scorecard-header">
        <h1>Credit Scorecard Testing</h1>
        <p className="subtitle">Test the credit scoring engine with various inputs</p>
      </div>

      <div className="scorecard-content">
        <div className="input-section">
          <h2>Input Parameters</h2>

          <div className="form-group">
            <label>Scenario</label>
            <select name="scenario" value={formData.scenario} onChange={handleChange} className="input-field">
              <option value="Scenario 0">Scenario 0 (Standard)</option>
              <option value="Scenario 1">Scenario 1 (Adjusted Weights)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Industry Category</label>
            <select name="INDUSTRY_CATG_WOE" value={formData.INDUSTRY_CATG_WOE} onChange={handleChange} className="input-field">
              <option value="">Select...</option>
              <option value="MANUFACTURING">Manufacturing</option>
              <option value="TRADING">Trading</option>
              <option value="SERVICES">Services</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Company Category</label>
            <select name="COMPANY_CATG_WOE" value={formData.COMPANY_CATG_WOE} onChange={handleChange} className="input-field">
              <option value="">Select...</option>
              <option value="PARTNERSHIP">Partnership</option>
              <option value="PROPRIETORSHIP">Proprietorship</option>
              <option value="CO'S-PRIVATE">Private Company</option>
              <option value="OTHERS">Others</option>
            </select>
          </div>

          <div className="form-group">
            <label>Transaction Ratio (RT_CH_TXN_TO_TOT_TXN)</label>
            <input
              name="RT_CH_TXN_TO_TOT_TXN"
              type="number"
              step="0.01"
              value={formData.RT_CH_TXN_TO_TOT_TXN}
              onChange={handleChange}
              className="input-field"
              placeholder="0.04"
            />
            <span className="hint">Range: 0.0 - 1.0</span>
          </div>

          <div className="form-group">
            <label>Ratio Experience Age (RATIO_EXP_AGE_WOE)</label>
            <input
              name="RATIO_EXP_AGE_WOE"
              type="number"
              step="0.01"
              value={formData.RATIO_EXP_AGE_WOE}
              onChange={handleChange}
              className="input-field"
              placeholder="0.05"
            />
            <span className="hint">Range: 0.0 - 1.0</span>
          </div>

          <div className="form-group">
            <label>Avg Credit to Debit Ratio (AVG_CR_TXN_TO_DEBIT_TXN)</label>
            <input
              name="AVG_CR_TXN_TO_DEBIT_TXN"
              type="number"
              step="0.01"
              value={formData.AVG_CR_TXN_TO_DEBIT_TXN}
              onChange={handleChange}
              className="input-field"
              placeholder="0.5"
            />
          </div>

          <div className="form-group">
            <label>Cash Debit to Total Txn (CASH_DB_TXN_TO_OVR_TXN)</label>
            <input
              name="CASH_DB_TXN_TO_OVR_TXN"
              type="number"
              step="0.01"
              value={formData.CASH_DB_TXN_TO_OVR_TXN}
              onChange={handleChange}
              className="input-field"
              placeholder="0.05"
            />
          </div>

          <div className="form-group">
            <label>Balance Margin (BALMARG_M1_M6_CURR_BAL)</label>
            <input
              name="BALMARG_M1_M6_CURR_BAL"
              type="number"
              step="0.01"
              value={formData.BALMARG_M1_M6_CURR_BAL}
              onChange={handleChange}
              className="input-field"
              placeholder="0.3"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="calculate-btn"
          >
            {loading ? 'Calculating...' : 'Calculate Credit Score'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="result-section">
            <h2>Results</h2>

            <div className="score-summary">
              <div className="score-card main-score">
                <h3>Probability of Default</h3>
                <div className={`score-value ${result.probability_of_default > 0.5 ? 'high-risk' : 'low-risk'}`}>
                  {(result.probability_of_default * 100).toFixed(2)}%
                </div>
              </div>

              <div className="score-card">
                <h3>Final Score</h3>
                <div className="score-value">
                  {result.final_score.toFixed(4)}
                </div>
              </div>

              <div className="score-card">
                <h3>Scenario</h3>
                <div className="score-value scenario">
                  {result.scenario}
                </div>
              </div>
            </div>

            <div className="module-breakdown">
              <h3>Module Breakdown</h3>
              <div className="module-grid">
                {Object.entries(result.module_breakdown).map(([module, score]) => (
                  <div key={module} className="module-item">
                    <span className="module-name">{module}</span>
                    <span className="module-score">{(score as number).toFixed(4)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-table">
              <h3>Variable Details</h3>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Variable</th>
                      <th>Value</th>
                      <th>Module</th>
                      <th>Active</th>
                      <th>WOE</th>
                      <th>Bank</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.details
                      .filter(row => row.Active_Flag === 1)
                      .map((row, index) => (
                        <tr key={index}>
                          <td className="var-name">{row.Variable_Name}</td>
                          <td>{row.Variable_Value}</td>
                          <td className="module-tag">{row.Module}</td>
                          <td className="text-center">
                            <span className="badge badge-active">{row.Active_Flag}</span>
                          </td>
                          <td className="number">{row.WOE.toFixed(4)}</td>
                          <td className="number">{row.Bank.toFixed(4)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
