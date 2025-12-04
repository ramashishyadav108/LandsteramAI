import React, { useState, useEffect } from 'react';
import './ScorecardCalculator.css';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

interface Variable {
  id: number;
  var_name: string;
  coefficient: number;
  type: string;
  bins: Bin[];
}

interface Bin {
  id: number;
  min_val: number | null;
  max_val: number | null;
  category_label: string | null;
  woe: number;
}

interface CalculationDetail {
  Variable_Name: string;
  Variable_Value: string;
  Active_Flag: number;
  Bank: number;
  WOE: number;
  Module: string;
  Coefficient: number;
  Type: string;
  Min_Value?: number | null;
  Max_Value?: number | null;
  Category_Label?: string | null;
  Bin_Id?: number;
}

interface CalculationResult {
  scenario: string;
  probability_of_default: number;
  final_score: number;
  module_breakdown: Record<string, number>;
  details: CalculationDetail[];
}

const ScorecardCalculator: React.FC = () => {
  const [appId, setAppId] = useState('APP-001');
  const [scenario, setScenario] = useState('Scenario 0');
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [variablesByModule, setVariablesByModule] = useState<Record<string, Variable[]>>({});
  const [inputData, setInputData] = useState<Record<string, string>>({});
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('Input Flat File');
  const [activeModuleTab, setActiveModuleTab] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingVariables, setLoadingVariables] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch scenarios and variables on mount
  useEffect(() => {
    fetchScenarios();
    fetchVariables();
  }, []);

  // Fetch input data when appId changes
  useEffect(() => {
    if (appId) {
      fetchInputData();
    }
  }, [appId]);

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scorecard/scenarios`);
      if (!response.ok) throw new Error('Failed to fetch scenarios');
      const data = await response.json();
      setScenarios(data);
      console.log('Scenarios loaded:', data);
    } catch (err: any) {
      console.error('Error fetching scenarios:', err);
      setError(`Failed to load scenarios: ${err.message}`);
    }
  };

  const fetchVariables = async () => {
    try {
      setLoadingVariables(true);
      const response = await fetch(`${API_URL}/api/scorecard/variables`);
      if (!response.ok) throw new Error('Failed to fetch variables');
      const data = await response.json();
      setVariablesByModule(data);
      console.log('Variables loaded:', Object.keys(data).length, 'modules');
      console.log('Modules:', Object.keys(data));
    } catch (err: any) {
      console.error('Error fetching variables:', err);
      setError(`Failed to load variables: ${err.message}`);
    } finally {
      setLoadingVariables(false);
    }
  };

  const fetchInputData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/scorecard/input-flat-file/${appId}`);
      if (!response.ok) throw new Error('Failed to fetch input data');
      const data = await response.json();

      const inputMap: Record<string, string> = {};
      data.forEach((entry: any) => {
        inputMap[entry.var_name] = entry.value;
      });
      setInputData(inputMap);
      console.log('Input data loaded:', Object.keys(inputMap).length, 'variables');
    } catch (err: any) {
      console.error('Error fetching input data:', err);
      // Don't show error for empty input data
      if (!err.message.includes('404')) {
        setError(`Failed to load input data: ${err.message}`);
      }
    }
  };

  const handleInputChange = (varName: string, value: string) => {
    setInputData(prev => ({
      ...prev,
      [varName]: value
    }));
  };

  const saveInputData = async () => {
    try {
      setLoading(true);
      setError(null);

      const inputs = Object.entries(inputData)
        .filter(([_, value]) => value && value.trim() !== '')
        .map(([var_name, value]) => ({ var_name, value }));

      console.log('Saving inputs:', inputs.length, 'variables');

      const response = await fetch(`${API_URL}/api/scorecard/input-flat-file`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, inputs })
      });

      if (!response.ok) {
        throw new Error('Failed to save input data');
      }

      const result = await response.json();
      console.log('Saved:', result);
      alert(`Input data saved successfully! ${result.count} variables saved.`);
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Calculating score for app:', appId, 'scenario:', scenario);

      // First, save any input data that has been entered
      const inputs = Object.entries(inputData)
        .filter(([_, value]) => value && value.trim() !== '')
        .map(([var_name, value]) => ({ var_name, value }));

      if (inputs.length > 0) {
        console.log('Auto-saving inputs before calculation:', inputs.length, 'variables');
        const saveResponse = await fetch(`${API_URL}/api/scorecard/input-flat-file`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ appId, inputs })
        });

        if (!saveResponse.ok) {
          throw new Error('Failed to save input data before calculation');
        }
        console.log('Inputs saved successfully');
      }

      // Now calculate the score
      const response = await fetch(`${API_URL}/api/scorecard/calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, scenario })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to calculate score');
      }

      const data = await response.json();
      console.log('Calculation result:', data);
      setCalculationResult(data);
      
      // Set the first module as active when results are loaded
      const firstModule = Object.keys(data.module_breakdown)[0];
      if (firstModule) {
        setActiveModuleTab(firstModule);
      }
      
      setActiveTab('Results');
      alert('Calculation completed successfully!');
    } catch (err: any) {
      setError(err.message);
      alert(`Calculation Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (!confirm('Are you sure you want to clear all input data?')) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/scorecard/input-flat-file/${appId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to clear data');

      setInputData({});
      setCalculationResult(null);
      alert('Input data cleared successfully!');
    } catch (err: any) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderInputFlatFile = () => {
    // Get all variable names from all modules
    const allVarNames = Object.keys(variablesByModule).flatMap(
      module => variablesByModule[module].map(v => v.var_name)
    );

    console.log('Rendering Input Flat File with', allVarNames.length, 'variables');

    if (loadingVariables) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading variables...</p>
        </div>
      );
    }

    if (allVarNames.length === 0) {
      return (
        <div className="error-state">
          <h3>⚠️ No Variables Found</h3>
          <p>Please ensure the scorecard data is seeded in the database.</p>
          <p><strong>Run:</strong> <code>cd backend && npx ts-node prisma/seed.ts</code></p>
        </div>
      );
    }

    return (
      <div className="input-flat-file-section">
        <div className="section-header">
          <h3>Input Flat File</h3>
          <p>Enter values for variables. Found <strong>{allVarNames.length} variables</strong> across <strong>{Object.keys(variablesByModule).length} modules</strong>.</p>
        </div>

        <div className="input-grid">
          {allVarNames.map(varName => {
            // Find which module this variable belongs to
            let varModule = '';
            let varType = '';
            for (const [module, vars] of Object.entries(variablesByModule)) {
              const found = vars.find(v => v.var_name === varName);
              if (found) {
                varModule = module;
                varType = found.type;
                break;
              }
            }

            return (
              <div key={varName} className="input-field">
                <label>
                  <span className="var-name-label">{varName}</span>
                  <span className={`type-badge-small ${varType.toLowerCase()}`}>
                    {varType}
                  </span>
                  <span className="module-badge-small">{varModule}</span>
                </label>
                <input
                  type="text"
                  value={inputData[varName] || ''}
                  onChange={(e) => handleInputChange(varName, e.target.value)}
                  placeholder={varType === 'NUMERIC' ? 'Enter number...' : 'Enter category...'}
                />
              </div>
            );
          })}
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={saveInputData} disabled={loading}>
            {loading ? 'Saving...' : 'Save Input Data'}
          </button>
          <button className="btn-secondary" onClick={clearData} disabled={loading}>
            Clear All Data
          </button>
          <button className="btn-calculate-inline" onClick={calculateScore} disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Score'}
          </button>
        </div>
      </div>
    );
  };

  const renderModuleTab = (moduleName: string) => {
    const moduleDetails = calculationResult?.details.filter(d => d.Module === moduleName) || [];
    const moduleScore = calculationResult?.module_breakdown[moduleName] || 0;

    return (
      <div className="module-tab-content">
        <div className="module-header">
          <h3>{moduleName}</h3>
          {calculationResult && (
            <div className="module-score">
              Module Score: <strong>{moduleScore.toFixed(6)}</strong>
            </div>
          )}
        </div>

        {!calculationResult && (
          <div className="info-message">
            <p>💡 Enter values in the <strong>Input Flat File</strong> tab, then click <strong>Calculate Score</strong> to see Active Flag, WOE, and Bank values.</p>
          </div>
        )}

        <div className="variables-table-container">
          <table className="variables-table">
            <thead>
              <tr>
                <th>Variable Name</th>
                <th>Type</th>
                <th>Coefficient</th>
                <th>Variable Value</th>
                <th>Min Value</th>
                <th>Max Value</th>
                <th>Active Flag</th>
                <th>WOE</th>
                <th>Bank Value</th>
              </tr>
            </thead>
            <tbody>
              {moduleDetails.map((detail, idx) => (
                <tr key={idx} className={detail.Active_Flag === 1 ? 'active-row' : ''}>
                  <td className="var-name">{detail.Variable_Name}</td>
                  <td>
                    <span className={`type-badge ${detail.Type.toLowerCase()}`}>
                      {detail.Type}
                    </span>
                  </td>
                  <td>{detail.Coefficient.toFixed(4)}</td>
                  <td className="var-value">{detail.Variable_Value}</td>
                  <td className="text-right">{(detail as any).Min_Value !== null && (detail as any).Min_Value !== undefined ? (detail as any).Min_Value.toExponential(2) : '-'}</td>
                  <td className="text-right">{(detail as any).Max_Value !== null && (detail as any).Max_Value !== undefined ? (detail as any).Max_Value.toExponential(2) : '-'}</td>
                  <td className="text-center">
                    <span className={`flag-badge ${detail.Active_Flag ? 'active' : 'inactive'}`}>
                      {detail.Active_Flag}
                    </span>
                  </td>
                  <td className="text-right">{detail.WOE.toFixed(4)}</td>
                  <td className="text-right bank-value">{detail.Bank.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!calculationResult) {
      return (
        <div className="no-results">
          <h3>No calculation results yet</h3>
          <p>Please enter values in the Input Flat File tab and click "Calculate Score"</p>
        </div>
      );
    }

    const pdPercentage = (calculationResult.probability_of_default * 100).toFixed(4);
    const isHighRisk = calculationResult.probability_of_default > 0.5;

    // Get unique modules from calculation results
    const resultModules = Object.keys(calculationResult.module_breakdown);
    
    return (
      <div className="results-section">
      {/* //   <div className="results-header">
      //     <h2>Calculation Results</h2>
      //     <div className="scenario-badge">Scenario: {calculationResult.scenario}</div>
      //   </div>

      //   <div className="results-summary">
      //     <div className={`result-card pd-card ${isHighRisk ? 'high-risk' : 'low-risk'}`}>
      //       <h4>Probability of Default</h4>
      //       <div className="result-value">{pdPercentage}%</div>
      //       <div className="result-label">{isHighRisk ? 'High Risk' : 'Low Risk'}</div>
      //     </div>

      //     <div className="result-card">
      //       <h4>Final Score (Log Odds)</h4>
      //       <div className="result-value">{calculationResult.final_score.toFixed(6)}</div>
      //     </div>
      //   </div>

      //   <div className="module-breakdown">
      //     <h3>Module Breakdown</h3>
      //     <div className="module-grid">
      //       {Object.entries(calculationResult.module_breakdown).map(([module, score]) => (
      //         <div key={module} className="module-card">
      //           <div className="module-name">{module}</div>
      //           <div className="module-score-value">{score.toFixed(6)}</div>
      //         </div>
      //       ))}
      //     </div>
      //   </div> */}

        <div className="detailed-results">
          <h3>Detailed Variable Results by Module</h3>
          
          {/* Module Tabs */}
          <div className="module-tabs">
            {resultModules.map(module => (
              <button
                key={module}
                className={`module-tab-button ${activeModuleTab === module ? 'active' : ''}`}
                onClick={() => setActiveModuleTab(module)}
              >
                {module}
              </button>
            ))}
          </div>

          {/* Module Content */}
          <div className="module-tab-content-wrapper">
            {resultModules.map(module => (
              activeModuleTab === module && (
                <div key={module} className="module-results-content">
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Variable</th>                
                        <th>Module</th>
                        <th>Value</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Active</th>
                        <th>WOE</th>
                        <th>Coefficient</th>
                        <th>Bank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.details
                        .filter(detail => detail.Module === module)
                        .map((detail, idx) => (
                          <tr key={idx} className={detail.Active_Flag === 1 ? 'active-row' : ''}>
                            <td className="var-name">{detail.Variable_Name}</td>
                            <td>{detail.Module}</td>
                            <td>{detail.Variable_Value}</td>
                            <td className="text-right">{(detail as any).Min_Value !== null && (detail as any).Min_Value !== undefined ? (detail as any).Min_Value.toExponential(2) : '-'}</td>
                            <td className="text-right">{(detail as any).Max_Value !== null && (detail as any).Max_Value !== undefined ? (detail as any).Max_Value.toExponential(2) : '-'}</td>
                            <td className="text-center">
                              <span className={`flag-badge ${detail.Active_Flag ? 'active' : 'inactive'}`}>{detail.Active_Flag}</span>
                            </td>
                            <td className="text-right">{detail.WOE.toFixed(4)}</td>
                            <td className="text-right">{detail.Coefficient.toFixed(4)}</td>
                            <td className="text-right bank-value">{detail.Bank.toFixed(6)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    );
  };

  const modules = Object.keys(variablesByModule);
  const tabs = ['Input Flat File', ...modules, 'Results'];

  return (
    <div className="scorecard-calculator">
      <div className="calculator-header">
        <h1>Scorecard Calculator</h1>
        <p>Enter variable values and calculate credit scores across multiple modules</p>
      </div>

      <div className="calculator-controls">
        <div className="control-group">
          <label>Application ID</label>
          <input
            type="text"
            value={appId}
            onChange={(e) => setAppId(e.target.value)}
            placeholder="e.g., APP-001"
          />
        </div>

        <div className="control-group">
          <label>Scenario</label>
          <select value={scenario} onChange={(e) => setScenario(e.target.value)}>
            {scenarios.length > 0 ? (
              scenarios.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))
            ) : (
              <>
                <option value="Scenario 0">Scenario 0</option>
                <option value="Scenario 1">Scenario 1</option>
              </>
            )}
          </select>
        </div>

        <button
          className="btn-calculate"
          onClick={calculateScore}
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Calculate Score'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={() => setError(null)} className="close-error">×</button>
        </div>
      )}

      <div className="tabs-container">
        <div className="tabs-header">
          {tabs.map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab === 'Input Flat File' && !loadingVariables && (
                <span className="tab-count">({Object.keys(variablesByModule).flatMap(m => variablesByModule[m]).length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="tabs-content">
          {activeTab === 'Input Flat File' && renderInputFlatFile()}
          {activeTab === 'Results' && renderResults()}
          {modules.includes(activeTab) && renderModuleTab(activeTab)}
        </div>
      </div>
    </div>
  );
};

export default ScorecardCalculator;
