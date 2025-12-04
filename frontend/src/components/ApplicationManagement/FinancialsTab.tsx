import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

interface FinancialsTabProps {
  leadId: string;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ leadId }) => {
  const { theme } = useTheme();
  const [maximizedChart, setMaximizedChart] = useState<'revenue' | 'cashflow' | null>(null);

  // Mock data - will be replaced with actual API calls
  const financialMetrics = {
    revenue: { value: 'N/A', trend: 'N/A', status: 'stable' },
    ebitdaMargin: { value: 'N/A', status: 'stable' },
    dscr: { value: 'N/A', status: 'acceptable' },
    totalDebt: { value: 'N/A', status: 'high' },
  };

  const tableColumns = [
    { key: 'year', label: 'Year' },
    { key: 'revenue', label: 'Revenue\n(₹ Cr)' },
    { key: 'ebitda', label: 'EBITDA\n(₹ Cr)' },
    { key: 'ebitdaPercent', label: 'EBITDA\n%' },
    { key: 'pat', label: 'PAT\n(₹ Cr)' },
    { key: 'cashflow', label: 'CashFlow\n(₹ Cr)' },
    { key: 'debtEbitda', label: 'Debt/ EBITDA' },
    { key: 'dscr', label: 'DSCR' },
    { key: 'liquidityDays', label: 'Liquidity Days' },
  ];

  // Mock table data - 13 rows
  const tableData = Array(13).fill(null).map(() => ({
    year: 'N/A',
    revenue: 'N/A',
    ebitda: 'N/A',
    ebitdaPercent: 'N/A',
    pat: 'N/A',
    cashflow: 'N/A',
    debtEbitda: 'N/A',
    dscr: 'N/A',
    liquidityDays: 'N/A',
  }));

  const downloadButtons = [
    { label: 'Download Extracted Excel', color: 'green', icon: '📄' },
    { label: 'Download Raw Files', color: 'white', icon: '⬇' },
    { label: 'View Mapping Summary', color: 'white', icon: '📋' },
  ];

  return (
    <div>
      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Revenue Card */}
        <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
          <h3 className={`text-base mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            Revenue (FY23)
          </h3>
          <p className={`text-2xl font-normal mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {financialMetrics.revenue.value}
          </p>
          <div className="inline-block px-4 py-1 bg-[#ECFDF5] rounded-full">
            <span className="text-xs text-[#14BA6D]">{financialMetrics.revenue.trend}</span>
          </div>
        </div>

        {/* EBITDA Margin Card */}
        <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
          <h3 className={`text-base mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            EBITDA Margin
          </h3>
          <p className={`text-2xl font-normal mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {financialMetrics.ebitdaMargin.value}
          </p>
          <div className="inline-block px-4 py-1 bg-[#ECFDF5] rounded-full">
            <span className="text-xs text-[#14BA6D]">Stable</span>
          </div>
        </div>

        {/* DSCR Card */}
        <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
          <h3 className={`text-base mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            DSCR
          </h3>
          <p className={`text-2xl font-normal mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {financialMetrics.dscr.value}
          </p>
          <div className="inline-block px-4 py-1 bg-[#FEFCE8] rounded-full">
            <span className="text-xs text-[#BC7A52]">Acceptable</span>
          </div>
        </div>

        {/* Total Debt Card */}
        <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
          <h3 className={`text-base mb-3 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            Total Debt
          </h3>
          <p className={`text-2xl font-normal mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {financialMetrics.totalDebt.value}
          </p>
          <div className="inline-block px-4 py-1 bg-[#FFE1E1] rounded-full">
            <span className="text-xs text-[#A60404]">Leverage High</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Revenue & EBITDA Trend Chart */}
        <div className={`rounded-3xl p-8 relative ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_11px_32px_-9px_rgba(58,77,233,0.15)]'}`}>
          <button 
            onClick={() => setMaximizedChart('revenue')}
            className="p-2 hover:bg-gray-100 rounded absolute top-8 right-8 z-10"
          >
            <img src="/src/assets/ApplicationManager/Full_alt.png" alt="Maximize" className="w-5 h-5" />
          </button>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} text-center`}>
              Revenue & EBITDA Trend
            </h3>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50 text-center`}>
              (Last 5 years)
            </p>
          </div>

          {/* Chart Placeholder */}
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No data available
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                Chart will display when financial data is provided
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3549F8]"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>EBITDA</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF7E5C]"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>Revenue</span>
            </div>
          </div>
        </div>

        {/* CashFlow Projection Chart */}
        <div className={`rounded-3xl p-8 relative ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_11px_31px_-9px_rgba(58,77,233,0.15)]'}`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              CashFlow Projection Sceneraios
            </h3>
            <button 
              onClick={() => setMaximizedChart('cashflow')}
              className="p-2 hover:bg-gray-100 rounded absolute top-8 right-8 z-10"
            >
              <img src="/src/assets/ApplicationManager/Full_alt.png" alt="Maximize" className="w-5 h-5" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#14BA6D]"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>Base Case</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#FF915F]"></div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>Downside</span>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="h-72 flex items-center justify-center">
            <div className="text-center">
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No data available
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                Chart will display when cash flow projections are provided
              </p>
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-around mt-4">
            {['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].map((quarter) => (
              <span key={quarter} className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>
                {quarter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Data Table */}
      <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_42px_121px_-35px_rgba(58,77,233,0.15)]'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
          Financial Data Table
        </h3>

        {/* Table Container with Scroll */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-[#FCFCFD]'} border-b ${theme === 'dark' ? 'border-gray-600' : 'border-[#EAECF0]'}`}>
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-8 py-4 text-left text-xs font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-[#667085]'}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="whitespace-pre-line">{column.label}</span>
                      {column.key === 'year' && (
                        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M19 12l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#EAECF0]'} ${
                    theme === 'dark' ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                  }`}
                >
                  {tableColumns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-8 py-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}
                    >
                      {row[column.key as keyof typeof row]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Download Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button className="px-6 py-3 bg-[#079669] text-white rounded-xl flex items-center gap-2 hover:bg-[#068159] transition-colors">
            <span className="text-base">📄</span>
            <span className="text-xs">Download Extracted Excel</span>
          </button>

          <button className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors`}>
            <span className="text-base">⬇</span>
            <span className="text-xs">Download Raw Files</span>
          </button>

          <button className={`px-6 py-3 ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-white text-gray-700'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors`}>
            <span className="text-base">📋</span>
            <span className="text-xs">View Mapping Summary</span>
          </button>
        </div>

        {/* AI Generated Observations */}
        <div className="mt-8 p-6 bg-[#ECFDF5] border border-[#ECFDF5] rounded-3xl">
          <div className="flex items-start gap-3 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14BA6D" strokeWidth="2" className="shrink-0 mt-1">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <div>
              <h4 className="text-base font-normal text-black mb-3">📊 AI Generated Observations</h4>
              <ul className="space-y-2">
                <li className="text-sm leading-relaxed text-[#667085]">
                  • Recommend approval of ₹2.4 Cr term loan subject to enhanced monitoring covenants and quaterly reporting requirements.
                </li>
                <li className="text-sm leading-relaxed text-[#667085]">
                  • Recommend approval of ₹2.4 Cr term loan subject to enhanced monitoring covenants and quaterly reporting requirements.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 p-6 bg-[#ECFDF5] border border-[#ECFDF5] rounded-3xl">
        <div className="flex items-center gap-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#14BA6D" strokeWidth="2" className="shrink-0 transform rotate-180">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="8" r="1" fill="#14BA6D" />
            <path d="M12 12v4" />
          </svg>
          <p className="text-sm leading-relaxed text-[#667085]">
            AI Processed 42 documents this week- 9 flagged, 6 missing.{' '}
            <span className="text-[#14BA6D] cursor-pointer hover:underline">View Insights</span>
          </p>
        </div>
      </div>

      {/* Maximized Chart Modal */}
      {maximizedChart && (
        <div 
          className="fixed inset-0 left-60 z-50 flex items-center justify-center p-12 backdrop-blur-sm bg-black/30"
          onClick={() => setMaximizedChart(null)}
        >
          <div 
            className={`w-full h-full max-w-5xl max-h-[75vh] rounded-3xl p-8 relative shadow-2xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setMaximizedChart(null)}
              className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded z-10"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Revenue Chart Maximized */}
            {maximizedChart === 'revenue' && (
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h3 className={`text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'} text-center`}>
                    Revenue & EBITDA Trend
                  </h3>
                  <p className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50 text-center`}>
                    (Last 5 years)
                  </p>
                </div>

                {/* Chart Placeholder */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No data available
                    </p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                      Chart will display when financial data is provided
                    </p>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 mt-8">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#3549F8]"></div>
                    <span className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>EBITDA</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FF7E5C]"></div>
                    <span className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>Revenue</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cashflow Chart Maximized */}
            {maximizedChart === 'cashflow' && (
              <div className="h-full flex flex-col">
                <div className="mb-8">
                  <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-black'} text-center`}>
                    CashFlow Projection Sceneraios
                  </h3>
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#14BA6D]"></div>
                    <span className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>Base Case</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FF915F]"></div>
                    <span className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>Downside</span>
                  </div>
                </div>

                {/* Chart Placeholder */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      No data available
                    </p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                      Chart will display when cash flow projections are provided
                    </p>
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-around mt-8">
                  {['Q1', 'Q2', 'Q3', 'Q4', 'Q5'].map((quarter) => (
                    <span key={quarter} className={`text-base ${theme === 'dark' ? 'text-gray-400' : 'text-black'} opacity-50`}>
                      {quarter}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
