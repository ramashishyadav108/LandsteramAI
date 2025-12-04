import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '../Dashboard';
import { useTheme } from '../../context/ThemeContext';
import { leadService, Lead } from '../../services/lead.service';
import { DocumentsTab } from './DocumentsTab';
import { FinancialsTab } from './FinancialsTab';
import { AIAnalysisTab } from './AIAnalysisTab';
import markIcon from '../../assets/ApplicationManager/mark.png';
import fileDockIcon from '../../assets/ApplicationManager/File_dock_light.png';
import timeIcon from '../../assets/ApplicationManager/Time_duotone_line.png';
import infoIcon from '../../assets/ApplicationManager/Info_light.png';

const ApplicationManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const { leadId } = useParams<{ leadId: string }>();
  const [activeTab, setActiveTab] = useState('Overview');
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (leadId) {
      fetchLeadData();
    }
  }, [leadId]);

  const fetchLeadData = async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await leadService.getLeadById(leadId);
      if (response.success && response.data) {
        setLead(response.data);
      } else {
        setError('Failed to load lead data');
      }
    } catch (err: any) {
      console.error('Error fetching lead:', err);
      setError(err.message || 'Failed to fetch lead data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['Overview', 'Documents', 'Financials', 'AI Analysis', 'Credit Memo'];

  const getRiskLevel = (priority: string): string => {
    switch (priority) {
      case 'HIGH':
      case 'URGENT':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return 'Medium';
    }
  };

  const calculateProgress = (status: string): number => {
    switch (status) {
      case 'NEW':
        return 15;
      case 'KNOCKOUT_FAILED':
        return 25;
      case 'MEETING_SCHEDULED':
        return 40;
      case 'QUALIFIED':
        return 57;
      case 'PROPOSAL_SENT':
        return 70;
      case 'NEGOTIATION':
        return 85;
      case 'WON':
        return 100;
      case 'LOST':
        return 0;
      default:
        return 15;
    }
  };

  const formatCurrency = (amount?: number): string => {
    if (!amount) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
          <div className="text-center">
            <div className={`text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Loading application data...</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !lead) {
    return (
      <DashboardLayout>
        <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
          <div className="text-center">
            <div className={`text-xl mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
              {error || 'Lead not found'}
            </div>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[#14BA6D] text-white rounded-lg hover:bg-[#12a660]"
            >
              Go Back
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const progress = calculateProgress(lead.status);
  const riskLevel = getRiskLevel(lead.leadPriority);
  const leadName = lead.companyName || `${lead.firstName} ${lead.lastName || ''}`.trim();
  const displayName = leadName || 'Unknown Lead';

  return (
    <DashboardLayout pageTitle="AI Analysis">
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-[#F9FAFB]'}`}>
        {/* Content Area */}
        <div className="px-8 pb-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 mb-8 pt-6">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#6B7280]'}`}>Application Management</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#6B7280'} strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <span className="text-sm text-[#14BA6D] font-medium">Borrower Application Overview</span>
          </div>

          {/* Lead Info Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-[27px] font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>{displayName}</h2>
              <p className="text-[#14BA6D] font-medium text-lg">{lead.companyName || 'Individual'}</p>
            </div>
            <div className="flex items-center gap-40">
              <div>
                <p className={`text-[15px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'} text-center`}>Application ID:LS-ID-{lead.id.slice(-5)}</p>
              </div>
              <div className="flex items-center gap-40">
                <div>
                  <p className={`px-4 py-1.5 text-[15px] rounded-[15px] bg-[#ECFEF6] border border-[#D8FBE9] text-[#14BA6D] font-normal text-center`}>{lead.status.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <p className={`text-[15px] ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'} text-center`}>Application Progress:</p>
                    <span className={`text-[15px] font-normal text-[#14BA6D] text-center`}>{progress}%</span>
                  </div>
                  <div className="w-56 bg-[#ECFEF6] border border-[#D8FBE9] h-3 rounded-[15px]">
                    <div className="bg-[#14BA6D] border border-[#D8FBE9] h-3 rounded-[15px]" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-8`}>
            <div className="flex gap-12">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-[21px] font-normal relative cursor-pointer transition-colors ${
                    activeTab === tab
                      ? theme === 'dark'
                        ? 'text-emerald-400'
                        : 'text-[#14BA6D]'
                      : theme === 'dark'
                      ? 'text-gray-400 hover:text-gray-300'
                      : 'text-[#667085] hover:text-[#14BA6D]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#14BA6D]"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'Documents' ? (
            <DocumentsTab leadId={leadId!} />
          ) : activeTab === 'Financials' ? (
            <FinancialsTab leadId={leadId!} />
          ) : activeTab === 'AI Analysis' ? (
            <AIAnalysisTab />
          ) : activeTab === 'Overview' ? (
            /* Main Content Grid */
            <div className="grid grid-cols-3 gap-6">
            {/* Left Column - 2 columns width */}
            <div className="col-span-2 space-y-6">
              {/* Business Overview Card */}
              <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Business Overview
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Legal Name</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>
                      {lead.companyName || `${lead.firstName} ${lead.lastName || ''}`.trim() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Industry</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.industry || 'Not Specified'}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Lead Type</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.leadType || 'Not Specified'}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Deal Value</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{formatCurrency(lead.dealValue)}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Lead Source</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.source.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Lead Priority</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.leadPriority}</p>
                  </div>
                </div>
              </div>

              {/* Loan Request Details Card */}
              <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Loan Request Details
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Requested Amount</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{formatCurrency(lead.dealValue)}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Loan Type</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>Term Loan</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Purpose</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.notes || 'Working Capital Expansion'}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Tenor</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>5 Years</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Interest Rate</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>12.5% p.a.</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Security Offered</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>First Charge on Receivable</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Application Date</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{formatDate(lead.createdAt)}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Expected disbursement</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>Dec 20, 2025</p>
                  </div>
                </div>
              </div>

              {/* Contact Information Card */}
              <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Contact Information
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Primary Contact</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>
                      {lead.contactPerson || `${lead.firstName} ${lead.lastName || ''}`.trim() || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Designation</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>CEO & Founder</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Email</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Phone</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{lead.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Office Address</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>Not Available</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Secondary Contact</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>Not Available</p>
                  </div>
                </div>
              </div>

              {/* Relationship Manager Card */}
              <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Relationship Manager
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="grid grid-cols-2 gap-x-16 gap-y-6">
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>RM Name</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>
                      {lead.assignedRMDetails?.name || lead.assignedRMsList?.[0]?.name || 'Not Assigned'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Department</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>Commercial Lending</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Email</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>
                      {lead.assignedRMDetails?.email || lead.assignedRMsList?.[0]?.email || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Phone</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>Not Available</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Assigned Date</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>{formatDate(lead.createdAt)}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'} mb-2`}>Portfolio Size</p>
                    <p className={`text-base ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>12 Active Accounts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Risk Indicators Card */}
              <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Risk Indicators
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Credit Risk</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-[#FFF3C3] text-[#946B00] border border-[#EFF0F2]">
                      {riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Sector Risk</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-[#D4F8D0] text-[#14BA6D] border border-[#D4F8D0]">
                      Low
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Operational Risk</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-[#FFF3C3] text-[#946B00] border border-[#EFF0F2]">
                      {riskLevel}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Compliance Risk</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-[#D4F8D0] text-[#14BA6D] border border-[#D4F8D0]">
                      Low
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Financial Risk</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-[#FFF3C3] text-[#946B00] border border-[#EFF0F2]">
                      {riskLevel}
                    </span>
                  </div>
                </div>

                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} my-6`}></div>

                <div className="flex items-center justify-between">
                  <span className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Overall Risk Rating</span>
                  <span className="text-lg text-[#F54A5A] font-normal">{riskLevel}</span>
                </div>
              </div>

              {/* Key Financial Metrics Card */}
              <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Key Financial Metrics
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>DSCR</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>1.42x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Debt-to-Equity</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>1.42x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Current Ratio</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>1.42x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>EBITDA Margin</span>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>1.42x</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Revenue Growth</span>
                    <span className="text-sm text-[#14BA6D]">+7% YoY</span>
                  </div>
                </div>
              </div>

              {/* Activity Timeline Card */}
              <div className={`rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8px_25px_-7px_rgba(58,77,233,0.15)]'}`}>
                <h3 className={`text-[17px] font-normal mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
                  Activity Timeline
                </h3>
                <div className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-[#E5E7EB]'} mb-6`}></div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6">
                      <img src={markIcon} alt="Completed" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Application Submitted</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-[#667085]'}`}>{formatDate(lead.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6">
                      <img src={fileDockIcon} alt="Documents" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Documents Uploaded</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-[#667085]'}`}>{formatDate(lead.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6">
                      <img src={markIcon} alt="Completed" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>AI analysis Completed</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-[#667085]'}`}>{formatDate(lead.updatedAt)}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6">
                      <img src={timeIcon} alt="In Progress" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Under Credit Review</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-[#667085]'}`}>In Progress</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6">
                      <img src={infoIcon} alt="Pending" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-[#364153]'}`}>Additional Documents</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-[#667085]'}`}>Pending</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Actions Card */}
              <div className="rounded-3xl p-6 bg-[#ECFDF5] border border-[#A4F4CF]">
                <h3 className="text-base font-normal mb-4 text-[#004F3B]">
                  Next Actions
                </h3>
                <ul className="space-y-2 text-sm leading-[200%] text-[#004F3B]">
                  <li>• Upload FY23 Audited Financial Statements</li>
                  <li>• Complete Credit Committee Review</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Coming Soon Section */
          <div className="flex flex-col items-center justify-center py-20">
              <div className={`rounded-full p-6 mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={theme === 'dark' ? '#10B981' : '#14BA6D'} strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                Coming Soon
              </h2>
              <p className={`text-xl mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {activeTab} section is under development
              </p>
              <p className={`text-base ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                We're working hard to bring you this feature. Stay tuned!
              </p>
            </div>
          )}

          {/* Footer Info Bar - Only show for Overview tab */}
          {activeTab === 'Overview' && (
            <div className="mt-8 p-6 bg-[#F3F4F6] border border-[#F3F4F6] rounded-3xl">
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                Last updated {formatDate(lead.updatedAt)} • Next action pending: Upload FY23 audited statements,{' '}
                <span className="text-[#14BA6D] cursor-pointer hover:underline">View Insights</span>
              </p>
            </div>
          )}
          {/* Footer Info Bar - Hide for Financials tab as it has its own footer */}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplicationManagementPage;
