import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import { leadService, Lead, FunnelStats } from '../../services/lead.service';
import { meetingService, Meeting } from '../../services/meeting.service';
import { useNavigate } from 'react-router-dom';
import notbookIcon from '../../assets/notebook_duotone_line.png';
import msgIcon from '../../assets/Message_light.png'
import dellIcon from '../../assets/dell_square.png'
import grpDIcon from '../../assets/Group_duotone_fill.png'
import folDIcon from '../../assets/Folder_del.png'
import dateTIcon from '../../assets/Date_today_duotone.png'
import folderUIcon from '../../assets/folder-up.png'
import arhPIcon from '../../assets/Arhive_plane_light.png'
import msgAltIcon from '../../assets/Message_alt_duotone.png'
import userAIcon from '../../assets/User_add_alt_duotone.png'
import fileDIcon from '../../assets/File_dock_light.png'
import fileDSIcon from '../../assets/File_dock_search_light.png'
import folDelIcon from '../../assets/Folder_deli.png'

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('ALL TIME');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [funnelStats, setFunnelStats] = useState<FunnelStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsResponse, meetingsResponse, funnelResponse] = await Promise.all([
        leadService.getAllLeads(),
        meetingService.getMyMeetings(),
        leadService.getFunnelStats()
      ]);

      if (leadsResponse.success && leadsResponse.data) {
        setLeads(leadsResponse.data);
      }
      if (meetingsResponse.success && meetingsResponse.data) {
        setMeetings(meetingsResponse.data.meetings);
      }
      if (funnelResponse.success && funnelResponse.data) {
        setFunnelStats(funnelResponse.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const totalLeads = leads.length;
  const leadsInReview = leads.filter(l => l.status === 'NEW' || l.status === 'QUALIFIED').length;
  const leadsPending = leads.filter(l => l.status === 'NEW').length;
  const knockoutPassedLeads = leads.filter(l => l.status !== 'KNOCKOUT_FAILED' && l.status !== 'NEW').length;
  const upcomingMeetingsCount = meetings.filter(m => m.status === 'SCHEDULED').length;

  // Get upcoming meetings
  const upcomingMeetings = meetings
    .filter(m => new Date(m.startTime) > new Date() && m.status === 'SCHEDULED')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 8);

  // Calculate lead status percentages for donut chart
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getPercentage = (status: string) => {
    if (totalLeads === 0) return 0;
    return Math.round(((statusCounts[status] || 0) / totalLeads) * 100);
  };

  // Calculate donut chart segments dynamically
  const newLeadsCount = statusCounts['NEW'] || 0;
  const knockoutPassedCountChart = leads.filter(l =>
    l.status !== 'KNOCKOUT_FAILED' && l.status !== 'NEW' && l.status !== 'WON'
  ).length;
  const meetingsScheduledCountChart = statusCounts['MEETING_SCHEDULED'] || 0;
  const applicationPassedCountChart = statusCounts['WON'] || 0;

  const newLeadsPercent = totalLeads > 0 ? Math.round((newLeadsCount / totalLeads) * 100) : 0;
  const knockoutPassedPercent = totalLeads > 0 ? Math.round((knockoutPassedCountChart / totalLeads) * 100) : 0;
  const meetingsScheduledPercent = totalLeads > 0 ? Math.round((meetingsScheduledCountChart / totalLeads) * 100) : 0;
  const applicationPassedPercent = totalLeads > 0 ? Math.round((applicationPassedCountChart / totalLeads) * 100) : 0;

  // Calculate SVG circle segments (circumference = 2 * π * r = 2 * 3.14159 * 75 ≈ 471.24)
  const circumference = 471.24;
  const newLeadsDash = (newLeadsPercent / 100) * circumference;
  const knockoutPassedDash = (knockoutPassedPercent / 100) * circumference;
  const meetingsScheduledDash = (meetingsScheduledPercent / 100) * circumference;
  const applicationPassedDash = (applicationPassedPercent / 100) * circumference;

  // Calculate cumulative offsets for each segment
  const newLeadsOffset = 0;
  const knockoutPassedOffset = -newLeadsDash;
  const meetingsScheduledOffset = -(newLeadsDash + knockoutPassedDash);
  const applicationPassedOffset = -(newLeadsDash + knockoutPassedDash + meetingsScheduledDash);

  // Get funnel data from API or use defaults
  const funnelData = funnelStats?.funnel || {
    leadsCreated: 0,
    knockoutPassed: 0,
    meetingsScheduled: 0,
    applicationInitiated: 0,
    applicationPassed: 0,
  };

  const conversionData = funnelStats?.conversions || {
    toMeetings: 0,
    toApplications: 0,
  };

  const actionItemsData = funnelStats?.actionItems || {
    leadsToContact: 0,
    leadsToKnockout: 0,
  };

  return (
    <DashboardLayout>
      <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
        {/* Top Section with Home Icon and Time Filters */}
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
          {/* Total Leads Created */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Total Leads Created</h3>
            {loading ? (
              <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>...</p>
            ) : (
              <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{totalLeads}</p>
            )}
            <div className="flex items-center mt-2">
              <span className={`text-[13px] italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Growth data not available</span>
            </div>
          </div>

          {/* Leads In Review */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Leads In Review</h3>
            {loading ? (
              <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>...</p>
            ) : (
              <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{leadsInReview}</p>
            )}
            <p className={`text-[15px] mt-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>New and follow up</p>
            <a href="/deal-sourcing/create-leads" className={`text-[15px] inline-block mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-[#197BBD]'}`}>View New Leads</a>
          </div>

          {/* Active Applications */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Active Applications</h3>
            <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>N/A</p>
            <p className={`text-[13px] mt-2 italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Feature not yet available</p>
          </div>

          {/* Leads Pending */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Leads Pending</h3>
            {loading ? (
              <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>...</p>
            ) : (
              <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{leadsPending}</p>
            )}
            <p className={`text-[15px] mt-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Check Pending</p>
          </div>
        </div>

        {/* Deal Sourcing Funnel and My Leads By Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Deal sourcing Funnel */}
          <div className={`lg:col-span-2 rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Deal sourcing Funnel</h3>

            <div className="grid grid-cols-[1fr_2fr_1fr] gap-6">
              {/* Left Column - Conversion Metrics & Action Links */}
              <div className="flex flex-col justify-between">
                {/* Conversion Metrics */}
                <div className="space-y-3">
                  <div className={`rounded-2xl border p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 shadow-[0px_2px_12px_rgba(0,0,0,0.3)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
                    <div className={`text-[11px] font-light ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Conversion to Meetings</div>
                    <div className="text-[15px] font-semibold text-[#67C900] mt-1">{conversionData.toMeetings}%</div>
                  </div>
                  <div className={`rounded-2xl border p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 shadow-[0px_2px_12px_rgba(0,0,0,0.3)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
                    <div className={`text-[11px] font-light ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Conversion to Applications</div>
                    <div className="text-[15px] font-semibold text-[#67C900] mt-1">{conversionData.toApplications}%</div>
                  </div>
                </div>

                {/* Action Links */}
                <div className="space-y-3 mt-6">
                  <button className={`w-full flex items-center justify-between text-[12px] transition-colors py-2 border-b ${theme === 'dark' ? 'text-gray-300 hover:text-emerald-400 border-gray-600' : 'text-black hover:text-[#14BA6D] border-[#AEAEAE]'}`}>
                    <div className="flex items-center gap-2">
                      <img src={notbookIcon} alt="View Funnel" className="w-5 h-5" />
                      <span>View Funnel Details</span>
                    </div>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6L15 12L9 18" stroke="#14BA6D" strokeWidth="2"/>
                    </svg>
                  </button>

                  <button className={`w-full flex items-center justify-between text-[12px] transition-colors py-2 border-b ${theme === 'dark' ? 'text-gray-300 hover:text-emerald-400 border-gray-600' : 'text-black hover:text-[#14BA6D] border-[#AEAEAE]'}`}>
                    <div className="flex items-center gap-2">
                      <img src={msgIcon} alt="Leads to Contact" className="w-5 h-5" />
                      <span>Leads to Contact({actionItemsData.leadsToContact})</span>
                    </div>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6L15 12L9 18" stroke="#14BA6D" strokeWidth="2"/>
                    </svg>
                  </button>

                  <button className={`w-full flex items-center justify-between text-[12px] transition-colors py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-emerald-400' : 'text-black hover:text-[#14BA6D]'}`}>
                    <div className="flex items-center gap-2">
                      <img src={dellIcon} alt="Leads to Knockout" className="w-5 h-5" />
                      <span>Leads to Knockout({actionItemsData.leadsToKnockout})</span>
                    </div>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6L15 12L9 18" stroke="#14BA6D" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Middle Column - Funnel Visualization */}
              <div className="flex flex-col items-center justify-center gap-3">
                {/* Level 1 - Leads Created - Trapezoid with rounded corners */}
                <div className="relative w-full h-[52px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 52" preserveAspectRatio="none">
                    <path
                      d="M 14 4
                        L 86 4
                        Q 92 4 92 10
                        L 88 42
                        Q 88 50 80 50
                        L 20 50
                        Q 12 50 12 42
                        L 8 10
                        Q 8 4 14 4
                        Z"
                      fill="#68B9BA"
                    />
                  </svg>
                  <span className="relative z-10 text-white text-[20px] font-semibold">{funnelData.leadsCreated}</span>
                </div>

                {/* Level 2 - Knockout Passed - Trapezoid with rounded corners */}
                <div className="relative w-[80%] h-[49px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 49" preserveAspectRatio="none">
                    <path
                      d="M 14 4
                        L 86 4
                        Q 92 4 92 10
                        L 88 42
                        Q 88 50 80 50
                        L 20 50
                        Q 12 50 12 42
                        L 8 10
                        Q 8 4 14 4
                        Z"
                      fill="#74BB83"
                    />
                  </svg>
                  <span className="relative z-10 text-white text-[20px] font-semibold">{funnelData.knockoutPassed}</span>
                </div>

                {/* Level 3 - Meetings Scheduled - Trapezoid with rounded corners */}
                <div className="relative w-[60%] h-[48px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 48" preserveAspectRatio="none">
                    <path
                      d="M 14 4
                        L 86 4
                        Q 92 4 92 10
                        L 88 42
                        Q 88 50 80 50
                        L 20 50
                        Q 12 50 12 42
                        L 8 10
                        Q 8 4 14 4
                        Z"
                      fill="#73BC84"
                    />
                  </svg>
                  <span className="relative z-10 text-white text-[20px] font-semibold">{funnelData.meetingsScheduled}</span>
                </div>

                {/* Level 4 - Application Initiated - Trapezoid with rounded corners */}
                <div className="relative w-[42%] h-[50px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <path
                      d="M 14 4
                        L 86 4
                        Q 92 4 92 10
                        L 88 42
                        Q 88 50 80 50
                        L 20 50
                        Q 12 50 12 42
                        L 8 10
                        Q 8 4 14 4
                        Z"
                      fill="#42817F"
                    />
                  </svg>
                  <span className="relative z-10 text-white text-[20px] font-semibold">{funnelData.applicationInitiated}</span>
                </div>

                {/* Level 5 - Application Passed - Trapezoid with rounded corners */}
                <div className="relative w-[23%] h-[46px] flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 46" preserveAspectRatio="none">
                    <path
                      d="M 14 4
                        L 86 4
                        Q 92 4 92 10
                        L 88 42
                        Q 88 50 80 50
                        L 20 50
                        Q 12 50 12 42
                        L 8 10
                        Q 8 4 14 4
                        Z"
                      fill="#5D84AA"
                    />
                  </svg>
                  <span className="relative z-10 text-white text-[20px] font-semibold">{funnelData.applicationPassed}</span>
                </div>
              </div>

              {/* Right Column - Labels */}
              <div className="flex flex-col justify-center gap-2">
                <div className="h-[52px] flex items-center">
                  <span className={`text-[15px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Leads Created</span>
                </div>
                <div className="h-[49px] flex items-center">
                  <span className={`text-[15px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Knockout Passed</span>
                </div>
                <div className="h-[48px] flex items-center">
                  <span className={`text-[15px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Meetings Scheduled</span>
                </div>
                <div className="h-[50px] flex items-center">
                  <span className={`text-[15px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Application Initiated</span>
                </div>
                <div className="h-[46px] flex items-center">
                  <span className={`text-[15px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Application Passed</span>
                </div>
              </div>
            </div>
          </div>

          {/* My Leads By Status - Donut Chart */}

          {/* My Leads By Status - Donut Chart */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>My Leads By Status</h3>

            {loading || totalLeads === 0 ? (
              <div className="flex items-center justify-center min-h-[320px]">
                <div className="text-center">
                  <svg className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className={`text-[16px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {loading ? 'Loading...' : 'No Leads Data'}
                  </p>
                  <p className={`text-[13px] mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {loading ? 'Fetching lead statistics' : 'Create your first lead to see statistics'}
                  </p>
                </div>
              </div>
            ) : (
            <>
            {/* Donut Chart with Labels */}
            <div className="relative w-full h-[320px] flex items-center justify-center mb-6">
              {/* Donut Chart */}
              <svg className="w-[170px] h-[170px] -rotate-90" viewBox="0 0 200 200">
                {/* Segment 1: New Leads - Left (Lightest Green) - Starting at 0 */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#C3EEB5" strokeWidth="35"
                  strokeDasharray={`${newLeadsDash} ${circumference}`} strokeDashoffset={newLeadsOffset}/>

                {/* Segment 2: Meetings Scheduled - Top (Dark Green) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#076539" strokeWidth="35"
                  strokeDasharray={`${meetingsScheduledDash} ${circumference}`} strokeDashoffset={meetingsScheduledOffset}/>

                {/* Segment 3: Knockout Passed - Right (Dark Teal) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#2F4C47" strokeWidth="35"
                  strokeDasharray={`${knockoutPassedDash} ${circumference}`} strokeDashoffset={knockoutPassedOffset}/>

                {/* Segment 4: Application Passed - Bottom (Light Green) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#75B485" strokeWidth="35"
                  strokeDasharray={`${applicationPassedDash} ${circumference}`} strokeDashoffset={applicationPassedOffset}/>
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-[95px] h-[95px] rounded-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                  <span className={`text-[34px] font-semibold leading-none ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{totalLeads}</span>
                  <span className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>Leads</span>
                </div>
              </div>

              {/* Labels positioned around the donut - Always show all 4 labels */}
              {/* Top Label - Meetings Scheduled (Dark Green) */}
              <div className="absolute top-[15px] left-1/2 -translate-x-1/2 text-center">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>Meetings Scheduled</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>({meetingsScheduledPercent}%)</div>
              </div>

              {/* Right Label - Knockout Passed (Dark Teal) */}
              <div className="absolute right-0 top-[50%] -translate-y-1/2 text-left">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>Knockout Passed</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>({knockoutPassedPercent}%)</div>
              </div>

              {/* Bottom Label - Application Passed (Light Green) */}
              <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 text-center">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>Application Passed</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>({applicationPassedPercent}%)</div>
              </div>

              {/* Left Label - New Leads (Lightest Green) */}
              <div className="absolute left-0 top-[50%] -translate-y-1/2 text-right">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>New Leads</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>({newLeadsPercent}%)</div>
              </div>
            </div>

            {/* Action Links */}
            <div className={`mt-0 pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/deal-sourcing/create-leads')}
              >
                <img src={grpDIcon} alt="View New Leads" className="w-5 h-5" />
                <span className={`text-[11px] font-normal ${theme === 'dark' ? 'text-emerald-400' : 'text-[#14BA6D]'}`}>View New Leads</span>
              </div>

              <div
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigate('/deal-sourcing/create-leads')}
              >
                <img src={folDIcon} alt="View Failed Leads" className="w-5 h-5" />
                <span className={`text-[11px] font-normal ${theme === 'dark' ? 'text-emerald-400' : 'text-[#14BA6D]'}`}>View Failed Leads</span>
              </div>
            </div>
            </>
            )}
          </div>
        </div>

        {/* Upcoming Meetings and My Top Priorities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Upcoming Meetings */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Upcoming Meetings</h3>

            <div className="space-y-1">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Loading meetings...</span>
                </div>
              ) : upcomingMeetings.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <svg className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className={`text-[14px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>No upcoming meetings</p>
                  </div>
                </div>
              ) : (
                upcomingMeetings.map((meeting) => {
                  const meetingDate = new Date(meeting.startTime);
                  const formattedDate = meetingDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  const formattedTime = meetingDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                  return (
                    <div key={meeting.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img src={dateTIcon} alt="Meeting" className="w-6 h-6" />
                        <span className={`text-[12px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>
                          {meeting.title || 'Meeting'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>{formattedDate}</span>
                        <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>{formattedTime}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* My Top Priorities */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>My Top Priorities</h3>

            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <p className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Priorities Not Available</p>
                <p className={`text-[12px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>This feature is currently under development</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent System Alerts and Applications Pipeline Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent System Alerts */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Recent System Alerts</h3>

            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <p className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Alerts Not Available</p>
                <p className={`text-[12px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>This feature is currently under development</p>
              </div>
            </div>
          </div>

          {/* Applications Pipeline Snapshot */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Applications Pipeline Snapshot</h3>

            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <svg className={`w-12 h-12 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pipeline Not Available</p>
                <p className={`text-[12px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Application tracking feature is under development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
