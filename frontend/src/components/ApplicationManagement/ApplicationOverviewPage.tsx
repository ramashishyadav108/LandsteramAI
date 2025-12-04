import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../Dashboard';
import { useTheme } from '../../context/ThemeContext';
import { leadService, ApplicationOverviewStats } from '../../services/lead.service';

const ApplicationOverviewPage: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [stats, setStats] = useState<ApplicationOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await leadService.getApplicationOverviewStats();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching application overview stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statisticsCards = stats ? [
    {
      title: 'TOTAL BORROWERS',
      value: stats.statistics.totalBorrowers.toString(),
      change: `${stats.statistics.growthPercentage > 0 ? '+' : ''}${stats.statistics.growthPercentage}% From Last Month`,
      changePositive: stats.statistics.growthPercentage >= 0,
      bgColor: '#F9FAFB',
    },
    {
      title: 'UNDER ASSESSMENT',
      value: stats.statistics.underAssessment.toString(),
      change: `${stats.statistics.newThisWeek} New This Week`,
      changePositive: true,
      bgColor: '#F9FAFB',
    },
    {
      title: 'HIGH-RISK BORROWERS',
      value: stats.statistics.highRiskBorrowers.toString(),
      change: `${stats.statistics.highRiskChange}% From Last Month`,
      changePositive: stats.statistics.highRiskChange <= 0,
      bgColor: '#F9FAFB',
    },
    {
      title: 'PENDING APPROVALS',
      value: stats.statistics.pendingApprovals.toString(),
      change: 'Needs Attention',
      changePositive: false,
      bgColor: '#F9FAFB',
    },
  ] : [];

  const actionItems = stats ? [
    {
      title: 'Recently Approved Applications',
      description: `${stats.actionItems.recentlyApproved} Applications Were Approved In The Last 48 Hours`,
      bgColor: '#ECFDF5',
      linkText: 'View Details',
    },
    {
      title: 'Missing Documents',
      description: `${stats.actionItems.missingDocs} Applications Need Document Upload`,
      bgColor: '#FFF7ED',
      linkText: 'Review Now',
    },
    {
      title: 'Not Scheduled For Committee',
      description: `${stats.actionItems.notScheduled} Applications Awaiting Schedule`,
      bgColor: '#EFF6FF',
      linkText: 'Schedule Now',
    },
    {
      title: 'Inactive Applications',
      description: `${stats.actionItems.inactiveApplications} Applications Not Updated In 30+ Days`,
      bgColor: '#FEF2F2',
      linkText: 'Follow Up',
    },
  ] : [];

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; bg: string }> = {
      'NEW': { label: 'New', color: '#6B7280', bg: '#F3F4F6' },
      'KNOCKOUT_FAILED': { label: 'Knockout Failed', color: '#DC2626', bg: '#FEE2E2' },
      'MEETING_SCHEDULED': { label: 'Meeting Scheduled', color: '#2563EB', bg: '#DBEAFE' },
      'QUALIFIED': { label: 'Qualified', color: '#059669', bg: '#D1FAE5' },
      'PROPOSAL_SENT': { label: 'Proposal Sent', color: '#7C3AED', bg: '#EDE9FE' },
      'NEGOTIATION': { label: 'In Negotiation', color: '#F59E0B', bg: '#FEF3C7' },
      'WON': { label: 'Won', color: '#10B981', bg: '#D1FAE5' },
      'LOST': { label: 'Lost', color: '#EF4444', bg: '#FEE2E2' },
    };
    return statusMap[status] || statusMap['NEW'];
  };

  const applications = stats?.recentApplications.map((app) => {
    const statusDisplay = getStatusDisplay(app.status);
    return {
      id: app.id,
      companyName: app.companyName,
      description: app.description,
      status: statusDisplay.label,
      statusColor: statusDisplay.color,
      statusBg: statusDisplay.bg,
      reviewStatus: 'Under Review',
      reviewColor: '#1657D9',
      reviewBg: '#EFF6FF',
    };
  }) || [];

  const pipelineData = stats ? [
    { label: 'Not Started', percentage: stats.pipelineHealth.notStarted, color: '#D9D9D9' },
    { label: 'On Track', percentage: stats.pipelineHealth.onTrack, color: '#21945C' },
    { label: 'At Risk', percentage: stats.pipelineHealth.atRisk, color: '#F5A622' },
    { label: 'Delayed', percentage: stats.pipelineHealth.delayed, color: '#DE3A3A' },
    { label: 'Completed', percentage: stats.pipelineHealth.completed, color: '#27BF8D' },
  ] : [];

  const quickAITools = [
    {
      title: 'Upload Documents',
      subtitle: 'Start With Files',
      bgColor: '#F9FAFB',
    },
    {
      title: 'Enter ID',
      subtitle: 'Quick Lookups',
      bgColor: '#F9FAFB',
    },
    {
      title: 'Chat With AI',
      subtitle: 'Ask Questions',
      bgColor: '#F9FAFB',
    },
    {
      title: 'Share With Customer',
      subtitle: 'Invite To Portal',
      bgColor: '#F9FAFB',
    },
  ];

  const aiQuickActions = [
    {
      title: 'Ask AI About Any Borrower',
      bgColor: '#ECFDF5',
    },
    {
      title: 'Generate Summary With AI',
      bgColor: '#ECFDF5',
    },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
          <div className="px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#14BA6D]"></div>
                <p className={`mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Borrower Application Overview">
      <div className={`min-h-screen -m-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
        <div className="px-8 pb-8 pt-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#364050'} strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#364050'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#364050]'}`}>Application Management</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#364050'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-[10px] text-[#14BA6D]">Borrower Application Overview</span>
          </div>

          {/* Page Title
          <h1 className={`text-3xl font-extrabold mb-8 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            Borrower Application Overview
          </h1> */}

          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-6">
            {statisticsCards.map((card, index) => (
              <div
                key={index}
                className={`rounded-[17px] p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E5E7EB]'}`}
              >
                <div className="w-12 h-[51px] bg-[#F9FAFB] rounded-[11px] mb-6"></div>
                <p className={`text-[13px] uppercase mb-5 font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                  {card.title}
                </p>
                <p className={`text-[30px] leading-5 mb-4 font-extrabold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  {card.value}
                </p>
                <p className={`text-[13px] capitalize ${card.changePositive ? 'text-[#14BA6D]' : 'text-[#667085]'}`}>
                  {card.change}
                </p>
              </div>
            ))}
          </div>

          {/* Action Items Section */}
          <div className={`rounded-[14px] p-6 mb-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E3E3E3]'}`}>
            <div className="grid grid-cols-4 gap-6">
              {actionItems.map((item, index) => (
                <div
                  key={index}
                  className={`rounded-[10px] p-6 border ${theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-white border-[#EDEDED]'}`}
                >
                  <div
                    className="w-[45px] h-[44px] rounded-[10px] mb-4"
                    style={{ backgroundColor: item.bgColor }}
                  ></div>
                  <h3 className={`text-[17px] leading-5 capitalize mb-2 font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-[13px] capitalize mb-2 leading-5 ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    {item.description}
                  </p>
                  <button className="text-[13px] capitalize text-[#0070FF] hover:underline">
                    {item.linkText}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Pick Up Where You Left - 2 columns */}
            <div className={`col-span-2 rounded-[18px] p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E9E8E8]'}`}>
              <h2 className={`text-[17px] leading-5 capitalize mb-4 font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                Pick Up Where You Left
              </h2>

              {/* Application Cards */}
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <div
                      key={app.id}
                      className={`rounded-[14px] p-6 border ${theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-white border-[#E3E3E3]'}`}
                    >
                      <div className="flex items-start justify-between mb-0">
                        <h3 className={`text-[17px] leading-5 capitalize font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                          {app.companyName}
                        </h3>
                        <button
                          onClick={() => navigate(`/application-management/${app.id}`)}
                          className="px-4 py-1.5 bg-[#009966] text-white text-[14px] capitalize rounded-[12px] hover:bg-[#007d55]"
                        >
                          Review
                        </button>
                      </div>
                      <p className={`text-[13px] mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                        {app.description}
                      </p>
                      <div className="flex items-center gap-3">
                        <span
                          className="px-4 py-1 rounded-[15px] text-[13px]"
                          style={{ backgroundColor: app.statusBg, color: app.statusColor }}
                        >
                          {app.status}
                        </span>
                        <span
                          className="px-4 py-1 rounded-[15px] text-[13px]"
                          style={{ backgroundColor: app.reviewBg, color: app.reviewColor }}
                        >
                          {app.reviewStatus}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p>No recent applications to display</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pipeline Health - 1 column */}
            <div className={`rounded-[12px] p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E1E1E1]'}`}>
              <h2 className={`text-[17px] leading-5 capitalize mb-4 font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                Pipeline Health
              </h2>

              {/* Donut Chart */}
              <div className="flex items-center justify-center mb-8">
                <div className="relative w-[200px] h-[200px]">
                  {/* SVG Donut Chart */}
                  <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#E5E2E2"
                      strokeWidth="30"
                    />
                    {/* Segments */}
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#D9D9D9"
                      strokeWidth="30"
                      strokeDasharray="100.5 402"
                      strokeDashoffset="0"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#21945C"
                      strokeWidth="30"
                      strokeDasharray="100.5 402"
                      strokeDashoffset="-100.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#F5A622"
                      strokeWidth="30"
                      strokeDasharray="100.5 402"
                      strokeDashoffset="-201"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#DE3A3A"
                      strokeWidth="30"
                      strokeDasharray="100.5 402"
                      strokeDashoffset="-301.5"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#27BF8D"
                      strokeWidth="30"
                      strokeDasharray="100.5 402"
                      strokeDashoffset="-402"
                    />
                  </svg>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {pipelineData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-[15px] h-[15px] rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className={`text-[13px] capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-[#667085]'}`}>
                        {item.label}
                      </span>
                    </div>
                    <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-3 gap-6">
            {/* Quick AI Tools - 2 columns */}
            <div className={`col-span-2 rounded-[18px] p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E9E8E8]'}`}>
              <div className="grid grid-cols-2 gap-4">
                {quickAITools.map((tool, index) => (
                  <div
                    key={index}
                    className={`rounded-[11px] p-6 border flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow ${
                      theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-white border-[#E9E8E8]'
                    }`}
                  >
                    <div
                      className="w-[50px] h-[51px] rounded-[13px]"
                      style={{ backgroundColor: tool.bgColor }}
                    ></div>
                    <div>
                      <h3 className={`text-[17px] leading-5 capitalize mb-1 font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                        {tool.title}
                      </h3>
                      <p className={`text-[13px] capitalize ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                        {tool.subtitle}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick AI Tools Card - 1 column */}
            <div className={`rounded-[18px] p-6 border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#E9E8E8]'}`}>
              <h2 className={`text-[17px] leading-5 capitalize mb-4 font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                Quick AI Tools
              </h2>
              <div className="space-y-4">
                {aiQuickActions.map((action, index) => (
                  <div
                    key={index}
                    className={`rounded-[13px] p-4 border flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow ${
                      theme === 'dark' ? 'bg-gray-750 border-gray-600' : 'bg-white border-[#E9E8E8]'
                    }`}
                  >
                    <div
                      className="w-[40px] h-[40px] rounded-[12px]"
                      style={{ backgroundColor: action.bgColor }}
                    ></div>
                    <p className={`text-[15px] capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>
                      {action.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info Bar */}
          <div className={`mt-6 p-6 rounded-[23px] border ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-[#F3F4F6] border-[#F3F4F6]'}`}>
            <p className={`text-[16px] leading-[20px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
              Last updated 3 days ago • Next action pending: Upload FY23 audited statements,{' '}
              <span className="text-[#0070FF] cursor-pointer hover:underline">View Insights</span>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationOverviewPage;
