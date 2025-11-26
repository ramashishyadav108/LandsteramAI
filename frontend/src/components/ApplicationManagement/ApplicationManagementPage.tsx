import React, { useState } from 'react';
import { DashboardLayout } from '../Dashboard';
import { useTheme } from '../../context/ThemeContext';

interface Borrower {
  id: string;
  name: string;
  stage: string;
  relationshipManager: string;
  riskRating: 'Low' | 'Medium' | 'High';
  lastUpdated: string;
}

const ApplicationManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('ALL TIME');

  // Mock data for the table
  const borrowers: Borrower[] = Array(10).fill(null).map((_, i) => ({
    id: `borrower-${i}`,
    name: 'Bold text column',
    stage: 'Regular text column',
    relationshipManager: 'Regular text column',
    riskRating: i % 3 === 0 ? 'Medium' : 'Low',
    lastUpdated: 'Date'
  }));

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return theme === 'dark' ? 'bg-emerald-900 text-emerald-400' : 'bg-emerald-100 text-emerald-700';
      case 'Medium':
        return theme === 'dark' ? 'bg-yellow-900 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      case 'High':
        return theme === 'dark' ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700';
      default:
        return theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
        {/* Top Section with Breadcrumb and Time Filters */}
        <div className="flex items-center justify-between mb-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>

          {/* Time Filter Buttons */}
          <div className={`flex items-center gap-1 rounded-full border px-2 py-2 ${theme === 'dark' ? 'bg-emerald-900 border-emerald-600' : 'bg-[#ccf5e3] border-[#14BA6D]'}`}>
            {['1M', '6M', '1Y', 'ALL TIME'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-4 py-1 text-[13px] font-medium rounded-full transition-colors ${
                  selectedFilter === filter
                    ? theme === 'dark'
                      ? 'bg-emerald-700 text-emerald-400 font-semibold'
                      : 'bg-[#FFFFFF] text-[#14BA6D] font-semibold'
                    : theme === 'dark'
                    ? 'text-gray-300 hover:text-emerald-400'
                    : 'text-[#364050] hover:text-[#14BA6D]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Total Borrowers */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Total Borrowers</h3>
            <p className={`text-[40px] font-bold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>120</p>
            <div className="flex items-center mt-2">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 2L10 10H2L6 2Z" fill="#14BA6D"/>
              </svg>
              <span className={`text-[15px] ml-1 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>15% from last week</span>
            </div>
          </div>

          {/* Under Assessment */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Under Assessment</h3>
            <p className={`text-[40px] font-bold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>18</p>
            <p className={`text-[15px] ml-1 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>AI/Credit Workflow</p>
            <div className="flex items-center mt-1">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 2L10 10H2L6 2Z" fill="#3B82F6"/>
              </svg>
              <span className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>+ 12% this month</span>
            </div>
          </div>

          {/* High Risk Borrowers */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>High Risk Borrowers</h3>
            <p className={`text-[40px] font-bold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>37</p>
            <p className={`text-[15px] ml-1 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>In Pipeline</p>
            <div className="flex items-center mt-1">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 10L2 2H10L6 10Z" fill="#EF4444"/>
              </svg>
              <span className={`text-[13px] ml-1 ${theme === 'dark' ? 'text-red-400' : 'text-[#EF4444]'}`}>2.6% flagged</span>
            </div>
          </div>

          {/* Pending Approvals */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Pending Approvals</h3>
            <p className={`text-[40px] font-bold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>120</p>
            <p className={`text-[15px] ml-1 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Check Pending</p>
          </div>
        </div>

        {/* Application Pipeline Table */}
        <div className={`rounded-2xl border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
          {/* Table Header */}
          <div className={`flex items-center justify-between p-6 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#EFF0F2]'}`}>
            <h2 className={`text-[17px] font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
              Application Pipeline And Overview
            </h2>
            <div className="flex items-center gap-3">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-[#E5E7EB] text-[#374151] hover:bg-gray-50'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span className="text-[14px]">Delete</span>
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-[#E5E7EB] text-[#374151] hover:bg-gray-50'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                <span className="text-[14px]">Filters</span>
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-[#E5E7EB] text-[#374151] hover:bg-gray-50'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span className="text-[14px]">Export</span>
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${theme === 'dark' ? 'bg-emerald-900 border-emerald-600 text-emerald-400 hover:bg-emerald-800' : 'bg-[#d1fae5] border-[#a7f3d0] text-[#065f46] hover:bg-[#a7f3d0]'}`}>
                <span className="text-[14px] font-medium">Share with RM</span>
              </button>
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${theme === 'dark' ? 'bg-emerald-700 text-white hover:bg-emerald-600' : 'bg-[#14BA6D] text-white hover:bg-[#12a660]'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="text-[14px] font-medium">Add New Borrower</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#EFF0F2]'}`}>
                  <th className={`px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    <div className="flex items-center gap-2">
                      Borrower Name
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </div>
                  </th>
                  <th className={`px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    <div className="flex items-center gap-2">
                      Stage
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </div>
                  </th>
                  <th className={`px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    <div className="flex items-center gap-2">
                      Relationship Manager
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </div>
                  </th>
                  <th className={`px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    <div className="flex items-center gap-2">
                      Risk Rating
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </div>
                  </th>
                  <th className={`px-6 py-4 text-left text-[12px] font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    <div className="flex items-center gap-2">
                      Last Updated
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12l7 7 7-7" />
                      </svg>
                    </div>
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {borrowers.map((borrower, index) => (
                  <tr
                    key={borrower.id}
                    className={`border-b transition-colors ${
                      theme === 'dark'
                        ? 'border-gray-700 hover:bg-gray-700'
                        : 'border-[#F3F4F6] hover:bg-gray-50'
                    }`}
                  >
                    <td className={`px-6 py-4 text-[14px] font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                      {borrower.name}
                    </td>
                    <td className={`px-6 py-4 text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                      {borrower.stage}
                    </td>
                    <td className={`px-6 py-4 text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                      {borrower.relationshipManager}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium ${getRiskBadgeColor(borrower.riskRating)}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {borrower.riskRating}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                      {borrower.lastUpdated}
                    </td>
                    <td className="px-6 py-4">
                      <button className={`p-1 rounded hover:bg-opacity-10 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-[#EFF0F2] bg-[#F9FAFB]'}`}>
            <p className={`text-[13px] text-center ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
              AI processed 42 borrowers this week-5 high risk,12 medium risk flagged,{' '}
              <a href="#" className={`${theme === 'dark' ? 'text-emerald-400' : 'text-[#14BA6D]'} hover:underline`}>
                View Insights
              </a>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationManagementPage;
