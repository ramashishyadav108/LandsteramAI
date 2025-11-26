import React, { useState } from 'react';
import DashboardLayout from './DashboardLayout';
import { useTheme } from '../../context/ThemeContext';
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
  const [selectedFilter, setSelectedFilter] = useState('ALL TIME');

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
            <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>120</p>
            <div className="flex items-center mt-2">
              <svg className="w-6 h-6 rotate-90" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="#14BA6D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={`text-[15px] ml-1 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>15% from last month</span>
            </div>
          </div>

          {/* Leads In Review */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Leads In Review</h3>
            <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>18</p>
            <p className={`text-[15px] mt-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>New and follow up</p>
            <a href="#" className={`text-[15px] inline-block mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-[#197BBD]'}`}>View New Leads</a>
          </div>

          {/* Active Applications */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Active Applications</h3>
            <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>37</p>
            <p className={`text-[15px] mt-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>In Pipeline</p>
            <a href="#" className={`text-[15px] inline-block mt-1 ${theme === 'dark' ? 'text-blue-400' : 'text-[#197BBD]'}`}>View Applications</a>
          </div>

          {/* Leads Pending */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Leads Pending</h3>
            <p className={`text-[40px] font-semibold leading-[150%] ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>120</p>
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
                    <div className="text-[15px] font-semibold text-[#67C900] mt-1">74%</div>
                  </div>
                  <div className={`rounded-2xl border p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 shadow-[0px_2px_12px_rgba(0,0,0,0.3)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
                    <div className={`text-[11px] font-light ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Conversion to Applications</div>
                    <div className="text-[15px] font-semibold text-[#67C900] mt-1">54%</div>
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
                      <span>Leads to Contact(7)</span>
                    </div>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6L15 12L9 18" stroke="#14BA6D" strokeWidth="2"/>
                    </svg>
                  </button>

                  <button className={`w-full flex items-center justify-between text-[12px] transition-colors py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-emerald-400' : 'text-black hover:text-[#14BA6D]'}`}>
                    <div className="flex items-center gap-2">
                      <img src={dellIcon} alt="Leads to Knockout" className="w-5 h-5" />
                      <span>Leads to Knockout(10)</span>
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
                  <span className="relative z-10 text-white text-[20px] font-semibold">74</span>
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
                  <span className="relative z-10 text-white text-[20px] font-semibold">64</span>
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
                  <span className="relative z-10 text-white text-[20px] font-semibold">51</span>
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
                  <span className="relative z-10 text-white text-[20px] font-semibold">30</span>
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
                  <span className="relative z-10 text-white text-[20px] font-semibold">25</span>
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
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>My Leads By Status</h3>

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
                  <span className={`text-[34px] font-semibold leading-none ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>120</span>
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
          </div>
        </div>

        {/* Upcoming Meetings and My Top Priorities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Upcoming Meetings */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Upcoming Meetings</h3>

            <div className="space-y-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-2 ">
                  <div className="flex items-center gap-3">
                    <img src={dateTIcon} alt="Meeting" className="w-6 h-6" />
                    <span className={`text-[12px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Pitch to Nexus Tech</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] italic ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>Date</span>
                    <span className={`text-[10px] italic ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>Time</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Top Priorities */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>My Top Priorities</h3>

            <div className="space-y-1">
              <div className="flex items-start gap-3 py-2">
                <img src={folderUIcon} alt="Priority" className="w-5 h-5 mt-0.5" />
                <span className={`text-[12px] flex-1 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Follow up with Innovate Corp-1ST Meeting</span>
              </div>

              <div className="flex items-start gap-3 py-2">
                <img src={arhPIcon} alt="Calendar" className="w-5 h-5 mt-0.5" />
                <span className={`text-[12px] flex-1 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Review Missing Docs_ Apex Solutions</span>
              </div>

              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-start gap-3 py-2">
                  <img src={msgAltIcon} alt="Contact" className="w-5 h-5 mt-0.5" />
                  <span className={`text-[12px] flex-1 ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Contact New Lead- Global Ventures</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent System Alerts and Applications Pipeline Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent System Alerts */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Recent System Alerts</h3>

            <div className="space-y-0">
              <div className={`flex items-center gap-3 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#d0d2d6]'}`}>
                <img src={userAIcon} alt="New Lead" className="w-6 h-6" />
                <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>New Lead Added From CRM</span>
              </div>

              <div className={`flex items-center gap-3 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#d0d2d6]'}`}>
                <img src={fileDIcon} alt="Failed" className="w-6 h-6" />
                <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Application Failed</span>
              </div>

              <div className={`flex items-center gap-3 py-3 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#d0d2d6]'}`}>
                <img src={fileDSIcon} alt="Missing Documents" className="w-6 h-6" />
                <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Application has missing documents</span>
              </div>

              <div className="flex items-center gap-3 py-3">
                <img src={folDelIcon} alt="Knockout Failed" className="w-6 h-6" />
                <span className={`text-[13px] ${theme === 'dark' ? 'text-gray-300' : 'text-black'}`}>Knockout failed for (Lead Name)</span>
              </div>
            </div>
          </div>

          {/* Applications Pipeline Snapshot */}
          <div className={`rounded-2xl border p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 shadow-[0px_2px_12px_rgba(0,0,0,0.4)]' : 'bg-white border-[#EFF0F2] shadow-[0px_2px_12px_rgba(18,18,18,0.1)]'}`}>
            <h3 className={`text-[17px] font-semibold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Applications Pipeline Snapshot</h3>

            {/* Bar Chart Container */}
            <div className="mb-6">
              <div className="flex items-end justify-center gap-5 px-6">
                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className={`w-full rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-[#E5E7EB]'}`} style={{ height: '80px' }}></div>
                </div>

                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className="w-full bg-[#14BA6D] rounded-lg" style={{ height: '150px' }}></div>
                </div>

                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className={`w-full rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-[#E5E7EB]'}`} style={{ height: '100px' }}></div>
                </div>

                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className="w-full bg-[#14BA6D] rounded-lg" style={{ height: '170px' }}></div>
                </div>

                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className="w-full bg-[#14BA6D] rounded-lg" style={{ height: '140px' }}></div>
                </div>

                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className={`w-full rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-[#E5E7EB]'}`} style={{ height: '90px' }}></div>
                </div>

                <div className="flex flex-col items-center" style={{ width: '50px' }}>
                  <div className={`w-full rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-[#E5E7EB]'}`} style={{ height: '70px' }}></div>
                </div>
              </div>

              {/* Labels below the bars */}
              <div className="flex items-start justify-center gap-5 px-6 mt-2">
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>RM<br/>Reviewer</span>
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>Data Collection</span>
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>RM<br/>Reviewer</span>
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>AI Analysis</span>
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>RM<br/>Reviewer</span>
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>RM<br/>Reviewer</span>
                <span className={`text-[9px] text-center leading-tight ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} style={{ width: '50px' }}>RM<br/>Reviewer</span>
              </div>
            </div>

            {/* Review My Application Link */}
            <div className="flex items-center justify-between pt-4 px-15 cursor-pointer">
              <div>
                <p className={`text-[15px] font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>Review My Application</p>
                <p className={`text-[11px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>Check All your applications here</p>
              </div>
              <svg className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`} viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
