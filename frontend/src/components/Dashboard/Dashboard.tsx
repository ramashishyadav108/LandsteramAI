import React, { useState, useEffect } from 'react';
import DashboardLayout from './DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
import { leadService, Lead } from '../../services/lead.service';
import { meetingService, Meeting } from '../../services/meeting.service';
import dateTIcon from '../../assets/Date_today_duotone.png'
import grpDIcon from '../../assets/Group_duotone_fill.png'
import folDIcon from '../../assets/Folder_del.png'

const Dashboard: React.FC = () => {
  const { theme } = useTheme();
  const [selectedFilter, setSelectedFilter] = useState('ALL TIME');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsResponse, meetingsResponse] = await Promise.all([
        leadService.getAllLeads(),
        meetingService.getMyMeetings()
      ]);

      if (leadsResponse.success && leadsResponse.data) {
        setLeads(leadsResponse.data);
      }
      if (meetingsResponse.success && meetingsResponse.data) {
        setMeetings(meetingsResponse.data.meetings);
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
  const meetingsScheduledCount = meetings.filter(m => m.status === 'SCHEDULED').length;

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

  // Calculate funnel conversion rates
  const conversionToMeetings = totalLeads > 0 ? Math.round((meetingsScheduledCount / totalLeads) * 100) : 0;
  const conversionToApplications = 0; // Not available yet

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

            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <svg className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className={`text-[16px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Funnel Analytics Not Available</p>
                <p className={`text-[13px] mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>This feature is currently under development</p>
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
              {/* Top Label - Knockout Passed (45%) - Dark Green Arc */}
              <div className="absolute top-[15px] left-1/2 -translate-x-1/2 text-center">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>Knockout Passed</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>(45%)</div>
              </div>

              {/* Right Label - Knockout Passed (45%) - Dark Teal Arc */}
              <div className="absolute right-[0px] top-[50%] -translate-y-1/2 text-left">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>Knockout Passed</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>(45%)</div>
              </div>

              {/* Bottom Label - Knockout Passed (45%) - Light Green Arc */}
              <div className="absolute bottom-[15px] left-1/2 -translate-x-1/2 text-center">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>Knockout Passed</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>(45%)</div>
              </div>

              {/* Left Label - New Leads (15%) - Lightest Green Arc */}
              <div className="absolute left-[0px] top-[50%] -translate-y-1/2 text-right">
                <div className={`text-[13px] font-normal whitespace-nowrap ${theme === 'dark' ? 'text-gray-300' : 'text-[#364050]'}`}>New Leads</div>
                <div className={`text-[11px] font-normal ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>(15%)</div>
              </div>

              {/* Donut Chart */}
              <svg className="w-[170px] h-[170px] -rotate-90" viewBox="0 0 200 200">
                {/* Circumference = 2 * π * r = 2 * 3.14159 * 75 ≈ 471.24 */}
                {/* Each segment: 45%, 45%, 45%, 15% but visually it looks like 28.33%, 28.33%, 28.33%, 15% */}
                {/* Let's use: 30%, 30%, 25%, 15% for better visual balance */}
                
                {/* Segment 1: Knockout Passed - Dark Green - Top (30% = 141.37) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#076539" strokeWidth="35"
                  strokeDasharray="141.37 471.24" strokeDashoffset="0"/>

                {/* Segment 2: Knockout Passed - Dark Teal - Right (30% = 141.37) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#2F4C47" strokeWidth="35"
                  strokeDasharray="141.37 471.24" strokeDashoffset="-141.37"/>

                {/* Segment 3: Knockout Passed - Light Green - Bottom (25% = 117.81) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#75B485" strokeWidth="35"
                  strokeDasharray="117.81 471.24" strokeDashoffset="-282.74"/>

                {/* Segment 4: New Leads - Lightest Green - Left (15% = 70.69) */}
                <circle cx="100" cy="100" r="75" fill="none" stroke="#C3EEB5" strokeWidth="35"
                  strokeDasharray="70.69 471.24" strokeDashoffset="-400.55"/>
              </svg>

              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-[95px] h-[95px] rounded-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
                  <span className={`text-[34px] font-semibold leading-none ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{totalLeads}</span>
                  <span className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>Leads</span>
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className={`mt-0 pt-4 border-t flex items-center justify-between ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'}`}>
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <img src={grpDIcon} alt="View New Leads" className="w-5 h-5" />
                <span className={`text-[11px] font-normal ${theme === 'dark' ? 'text-emerald-400' : 'text-[#14BA6D]'}`}>View New Leads</span>
              </div>

              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
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
