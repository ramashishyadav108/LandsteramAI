import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import refresh2Icon from '../../assets/ApplicationManager/Refresh_2.png';
import fileDockLight2Icon from '../../assets/ApplicationManager/File_dock_light_2.png';

export const AIAnalysisTab: React.FC = () => {
  const { theme } = useTheme();

  const riskFlags = [
    { severity: 'High', color: '#FFE1E1', textColor: '#C23713', description: 'EBITDA variance unusually high YoY (-12% decline detected)' },
    { severity: 'High', color: '#FFE1E1', textColor: '#C23713', description: 'DSCR below industry standard (1.4x vs 2.1x benchmark)' },
    { severity: 'Medium', color: '#FFF3C3', textColor: '#B06B00', description: 'Working capital ratio declining over past 2 quarters' },
    { severity: 'Medium', color: '#FFF3C3', textColor: '#B06B00', description: 'Revenue concentration: Top 3 customers represent 68% of revenue' },
    { severity: 'Low', color: '#D4F8D0', textColor: '#007F3E', description: 'Historical payment performance is consistent' },
  ];

  const insights = [
    {
      title: 'Revenue Insights',
      description: 'Revenue shows a 7% YoY growth, which is below the industry average of 10%. The growth is primarily driven by volume increases rather than pricing power. Q3 and Q4 show seasonal weakness that should be factored into cash flow projections',
      highlighted: true,
    },
    {
      title: 'Profitability Insights',
      description: '',
      highlighted: false,
    },
    {
      title: 'Profitability Insights',
      description: '',
      highlighted: false,
    },
    {
      title: 'Profitability Insights',
      description: '',
      highlighted: false,
    },
    {
      title: 'Profitability Insights',
      description: '',
      highlighted: false,
    },
  ];

  const benchmarkMetrics = [
    { name: 'Revenue Growth', borrower: '7%', industry: '10%' },
    { name: 'Revenue Growth', borrower: '7%', industry: '10%' },
    { name: 'Revenue Growth', borrower: '7%', industry: '10%' },
    { name: 'Revenue Growth', borrower: '7%', industry: '10%' },
    { name: 'Revenue Growth', borrower: '7%', industry: '10%' },
  ];

  return (
    <div className="space-y-6">
      {/* AI Credit Analysis Card */}
      <div className={`rounded-[17px] p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_42px_121px_-35px_rgba(58,77,233,0.15)]'}`}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 bg-[#ECFDF5] rounded-[10px] flex-shrink-0"></div>
          <div className="flex-1">
            <h3 className={`text-lg font-medium mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              AI Credit Analysis
            </h3>
            <p className={`text-[15px] font-light ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
              AI extracted and analyzed all submitted documents, generating risk flags, insights, and benchmarking ratios.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button className={`px-6 py-2.5 rounded-[11px] border flex items-center gap-2 text-[15px] ${theme === 'dark' ? 'bg-gray-750 border-gray-600 text-gray-300' : 'bg-white border-[#D1D5DC] text-[#36415E]'}`}>
            <img src={refresh2Icon} alt="Refresh" className="w-6 h-6" />
            Run Analysis Again
          </button>
          <button className={`px-6 py-2.5 rounded-[11px] flex items-center gap-2 text-[15px] ${theme === 'dark' ? 'bg-gray-750 text-gray-300' : 'bg-[#F3F4F6] text-[#36415E]'}`}>
            <img src={fileDockLight2Icon} alt="File" className="w-6 h-6" />
            View Extraction Logs
          </button>
        </div>
      </div>

      {/* Risk Flags Identified Card */}
      <div className={`rounded-[17px] p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_42px_121px_-35px_rgba(58,77,233,0.15)]'}`}>
        <h3 className={`text-[15px] font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
          Risk Flag Identified
        </h3>

        <div className="space-y-4">
          {riskFlags.map((flag, index) => (
            <div key={index} className="flex items-start gap-4">
              <span
                className="px-3 py-1 text-[13px] rounded-[12.5px] flex-shrink-0"
                style={{ backgroundColor: flag.color, color: flag.textColor }}
              >
                {flag.severity}
              </span>
              <p className={`text-[14px] font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-[#667085]'}`}>
                {flag.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* AI-Generated Insights - 2 columns */}
        <div className={`col-span-2 rounded-[17px] p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_42px_121px_-35px_rgba(58,77,233,0.15)]'}`}>
          <h3 className={`text-[15px] font-normal mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            AI-Generated Insights
          </h3>

          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={`rounded-[9px] p-4 border ${
                  insight.highlighted
                    ? theme === 'dark'
                      ? 'bg-gray-750 border-[#10B981]'
                      : 'bg-white border-[#B8F7DA]'
                    : theme === 'dark'
                    ? 'bg-gray-750 border-gray-600'
                    : 'bg-white border-[#E7E9ED]'
                }`}
              >
                <h4 className={`text-[13px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  {insight.title}
                </h4>
                {insight.description && (
                  <p className={`text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    {insight.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Industry Benchmark Comparison - 1 column */}
        <div className={`rounded-[17px] p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_42px_121px_-35px_rgba(58,77,233,0.15)]'}`}>
          <h3 className={`text-[15px] font-normal mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            Industry Benchmark Comparison
          </h3>

          <div className="space-y-6">
            {benchmarkMetrics.map((metric, index) => (
              <div key={index}>
                <h4 className={`text-[14px] mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-[#667085]'}`}>
                  {metric.name}
                </h4>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                      Borrower:
                    </span>
                    <span className="text-[14px] text-[#E50000]">{metric.borrower}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[12px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                      Industry:
                    </span>
                    <span className={`text-[14px] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                      {metric.industry}
                    </span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-[#FAFAFB] h-1.5 rounded-[3px]">
                  <div className="bg-[#FB2C36] h-1.5 rounded-l-[3px]" style={{ width: '45%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ask AI Section */}
      <div className={`rounded-[15px] p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
        <h3 className={`text-[15px] font-normal mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
          Ask AI
        </h3>
        <p className={`text-[13px] mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
          Ask questions like: "Show last year's EBITDA trend", "Generate downside case cashflow", "Summarize borrower performance."
        </p>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Ask a question..."
            className={`flex-1 px-4 py-3 rounded-[11px] border text-[13px] ${
              theme === 'dark'
                ? 'bg-gray-750 border-gray-600 text-gray-100 placeholder-gray-500'
                : 'bg-white border-[#DEE1E6] text-gray-900 placeholder-[#667085]'
            }`}
          />
          <button className="px-6 py-3 bg-[#009966] rounded-[11px] flex items-center justify-center hover:bg-[#007d55]">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path d="M12 4l8 8-8 8M20 12H4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Overall Credit Score Section */}
      <div className={`rounded-[15px] p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
        <div className="flex items-start gap-8">
          {/* Score Display */}
          <div className="flex items-end gap-2">
            <span className="text-[35px] font-normal text-[#FF0505]">62</span>
            <span className="text-[25px] font-normal text-[#AEAEAE] mb-1">/100</span>
          </div>

          {/* Score Details */}
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className={`text-[15px] font-normal ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                Overall Credit Score
              </h3>
              <span className="px-4 py-1 text-[13px] rounded-[14px] bg-[#FFF7ED] text-[#CA3526]">
                Moderate Risk
              </span>
            </div>
            <p className={`text-[13px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
              The borrower demonstrates adequate financial health with some areas of concern. Revenue growth and profitability metrics are below industry standards, while debt servicing capacity meets minimum requirements. Recommend additional monitoring and potential covenant adjustments.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info Bar */}
      <div className={`p-6 rounded-[23px] border flex items-center gap-3 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-[#ECFDF5] border-[#ECFDF5]'}`}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 transform rotate-180">
          <circle cx="12" cy="12" r="10" stroke="#14BA6D" strokeWidth="1" />
          <circle cx="12" cy="16" r="1" fill="#14BA6D" />
          <path d="M12 8v4" stroke="#14BA6D" strokeWidth="1" strokeLinecap="round" />
        </svg>
        <p className={`text-[20px] leading-[23px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
          AI Processed 42 documents this week- 9 flagged, 6 missing.{' '}
          <span className="text-[#14BA6D] cursor-pointer hover:underline">View Insights</span>
        </p>
      </div>
    </div>
  );
};
