import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../Dashboard';
import { leadService, Lead } from '../../../services/lead.service';
import { meetingService, Meeting } from '../../../services/meeting.service';
import { ScheduleMeetingModal } from '../../Meetings';
import BasicCustomerInfo from '../BasicCustomerInfo';
import MandatoryDocsCollection from '../MandatoryDocsCollection';
import subtractIcon from '../../../assets/Subtract.png';
import './LeadDetailsPage.css';

type TabType = 'summary' | 'meeting' | 'customer-info' | 'pre-screening' | 'docs-collection';

const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMeetings, setLoadingMeetings] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [showMoreProgress, setShowMoreProgress] = useState(false);
  const [showScheduleMeetingModal, setShowScheduleMeetingModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  useEffect(() => {
    if (lead?.email) {
      fetchMeetings();
    }
  }, [lead?.email]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id!);
      if (response.success && response.data) {
        console.log('Lead data received:', response.data);
        console.log('Phone:', response.data.phone);
        console.log('Email:', response.data.email);
        console.log('Contact Person:', response.data.contactPerson);
        setLead(response.data);
      } else {
        setError('Lead not found');
      }
    } catch (err) {
      setError('Failed to fetch lead details');
    } finally {
      setLoading(false);
    }
  };

  const fetchMeetings = async () => {
    try {
      setLoadingMeetings(true);
      const response = await meetingService.getMyMeetings();
      if (response.success && response.data) {
        // Filter meetings by lead email
        const leadMeetings = response.data.meetings.filter(
          (meeting) => meeting.borrower.email === lead?.email
        );
        setMeetings(leadMeetings);
      }
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    } finally {
      setLoadingMeetings(false);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const handleScheduleMeeting = () => {
    setShowScheduleMeetingModal(true);
  };

  const handleMeetingScheduled = () => {
    setShowScheduleMeetingModal(false);
    fetchMeetings(); // Refresh meetings list
  };

  // Get next upcoming meeting
  const getNextMeeting = () => {
    const now = new Date();
    const upcomingMeetings = meetings
      .filter((m) => new Date(m.startTime) > now && m.status === 'SCHEDULED')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    if (upcomingMeetings.length > 0) {
      const nextMeeting = upcomingMeetings[0];
      return new Date(nextMeeting.startTime).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
    return 'No upcoming meetings';
  };

  // Mock data for the UI - in real app, this would come from API
  const mockData = {
    contacts: ['Contact1', 'Contact2'],
    assignedRM: lead?.assignedRM || 'Rama',
    duplicationResult: 'Passed',
    duplicationMessage: 'New Lead(Not Existing-to-Bank)',
    progressIndicators: [
      { name: 'KYC Check', status: 100 },
      { name: 'Bureau Check', status: 50 },
      { name: 'Sanctions/PEP', status: 50 },
      { name: 'Collateral Review', status: 0 },
    ],
    riskScore: {
      status: 'Need Improvement',
      message: 'Here are few lines on the Risk Score',
      data: [
        { version: 'V0', lead: 50, market: 80 },
        { version: 'V1', lead: 100, market: 120 },
        { version: 'V2', lead: 80, market: 100 },
        { version: 'V3', lead: 150, market: 130 },
        { version: 'V4', lead: 120, market: 110 },
      ],
    },
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'summary', label: 'Summary & De-dupe' },
    { id: 'meeting', label: 'RM Meeting & Notes' },
    { id: 'customer-info', label: 'Basic Customer Info (KYC/KYB)' },
    { id: 'pre-screening', label: 'Pre-Screening & Knockout' },
    { id: 'docs-collection', label: 'Mandatory Docs Collection' },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="lead-detail-screen">
          <div className="loading-state">Loading lead details...</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !lead) {
    return (
      <DashboardLayout>
        <div className="lead-detail-screen">
          <div className="error-state">
            <p>{error || 'Lead not found'}</p>
            <button onClick={() => navigate('/deal-sourcing/create-leads')}>
              Back to Leads
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const leadName = `${lead.firstName} ${lead.middleName || ''} ${lead.lastName || ''}`.trim() || 'Lead Name';

  return (
    <DashboardLayout>
      {/* Breadcrumb - Outside grey area */}
      <div className="breadcrumb-wrapper">
        <div className="breadcrumb">
          <span onClick={() => navigate('/deal-sourcing/create-leads')} className="breadcrumb-link">
            Lead Detail Screen
          </span>
          <span className="breadcrumb-separator">&gt;</span>
          <span className="breadcrumb-current">Lead summary card</span>
        </div>
      </div>

      <div className="lead-detail-screen">
        {/* Tabs */}
        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Container */}
        <div className="main-content-container">
          {/* Lead Header */}
          <div className="lead-header-section">
          <div className="lead-header-left">
            <h1 className="lead-name">{leadName}</h1>
            <p className="lead-company">{lead.companyName || 'Company'}</p>
          </div>
          <div className="lead-header-center">
            <div className="contact-links">
              {lead.contactPerson && (
                <div className="contact-person">
                  <span className="contact-label"></span> {lead.contactPerson}
                </div>
              )}
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="contact-link phone-link" title="Call">
                  📞 {lead.phone}
                </a>
              )}
              {lead.email && (
                <a href={`mailto:${lead.email}`} className="contact-link email-link" title="Email">
                  {lead.email}
                </a>
              )}
              {!lead.phone && !lead.email && !lead.contactPerson && (
                <span className="no-contact-info">No contact info</span>
              )}
            </div>
          </div>
          <div className="lead-header-right">
            <div className="meeting-info">
              <span className="meeting-label">Next Meeting: {getNextMeeting()}</span>
              <span className="activity-label">Last Activity: {getTimeAgo(lead.updatedAt)}</span>
            </div>
            <div className="status-section">
              <div className="curr-status">
                <span className="current-status-label">Current Status</span>
              </div>
              <a href="#" className="view-details-link">View Details</a>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'summary' && (
          <div className="tab-content">
            <div className="content-grid">
              {/* Left Column */}
              <div className="content-left">
                {/* Assigned RM Card */}
                <div className="info-card">
                  <h3 className="card-title">Assigned RM</h3>
                  <div className="info-card-content">
                    <div className="rm-info">
                      <div className="rm-avatar">
                        {mockData.assignedRM.charAt(0).toUpperCase()}
                      </div>
                      <div className="rm-details">
                        <span className="rm-name">{mockData.assignedRM}</span>
                        <span className="rm-role">Contact</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Indicator Card */}
                <div className="info-card">
                  <h3 className="card-title">Progress Indicator</h3>
                  <div className="info-card-content">
                    <div className="progress-table">
                      <div className="progress-header">
                        <span>Tests</span>
                        <span>Status</span>
                      </div>
                      {mockData.progressIndicators.slice(0, showMoreProgress ? undefined : 4).map((indicator, index) => (
                        <div key={index} className="progress-row">
                          <span className="progress-name">{indicator.name}</span>
                          <div className="progress-bar-container">
                            <div
                              className={`progress-bar ${
                                indicator.status === 100 ? 'complete' : 
                                indicator.status >= 50 ? 'in-progress' : 
                                'not-started'
                              }`}
                              style={{ width: `${indicator.status}%` }}
                            />
                          </div>
                          <span className="progress-value">{indicator.status}%</span>
                        </div>
                      ))}
                      <button
                        className={`view-more-btn ${showMoreProgress ? 'expanded' : ''}`}
                        onClick={() => setShowMoreProgress(!showMoreProgress)}
                      >
                        {showMoreProgress ? 'View Less' : 'View More'}
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="content-right">
                {/* AI Duplication Test Results Card */}
                <div className="info-card">
                  <h3 className="card-title">AI Duplication Test Results</h3>
                  <div className="info-card-duplicate">
                    <div className="duplication-result">
                      <span className="result-status passed">{mockData.duplicationResult}</span>
                      <span className="result-message">{mockData.duplicationMessage}</span>
                    </div>
                  </div>
                </div>

                {/* Risk Score Card */}
                <div className="info-card">
                  <h3 className="card-title">Risk Score</h3>
                  <div className="info-card-content">
                    <div className="risk-score-content">
                    <div className="risk-gauge">
                      <div className="gauge-semicircle">
                        <svg viewBox="0 0 220 130" className="gauge-svg-semi">
                          {/* Background arc (light gray) */}
                          <path
                            d="M 20 110 A 90 90 0 0 1 200 110"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="10"
                            strokeLinecap="round"
                          />
                          {/* Progress arc (green) - 75% progress */}
                          <path
                            d="M 20 110 A 90 90 0 0 1 200 110"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="283"
                            strokeDashoffset="70"
                          />
                        </svg>
                        <div className="gauge-icon-container">
                          <div className="gauge-subtract-icon">
                            <img src={subtractIcon} alt="Subtract" className="subtract-img" />
                          </div>
                        </div>
                      </div>
                      <span className="risk-status">{mockData.riskScore.status}</span>
                      <span className="risk-message">{mockData.riskScore.message}</span>
                      <button className="details-btn">Details</button>
                    </div>
                    <div className="risk-chart">
                      <h4 className="chart-title">Risk Score Summary</h4>
                      <div className="chart-legend">
                        <span className="legend-item">
                          <span className="legend-dot lead"></span> Lead
                        </span>
                        <span className="legend-item">
                          <span className="legend-dot market"></span> Market Average
                        </span>
                      </div>
                      <div className="bar-chart">
                        <div className="chart-y-axis">
                          <span>200</span>
                          <span>100</span>
                          <span>0</span>
                        </div>
                        <div className="chart-bars">
                          {mockData.riskScore.data.map((item, index) => (
                            <div key={index} className="bar-group">
                              <div className="bars">
                                <div
                                  className="bar lead-bar"
                                  style={{ height: `${(item.lead / 200) * 100}%` }}
                                  data-value={item.lead}
                                />
                                <div
                                  className="bar market-bar"
                                  style={{ height: `${(item.market / 200) * 100}%` }}
                                  data-value={item.market}
                                />
                              </div>
                              <span className="bar-label">{item.version}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button className="details-btn">Details</button>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meeting' && (
          <div className="tab-content">
            <div className="meeting-content-grid">
              {/* Left Section - Past Meeting Logs */}
              <div className="meeting-left">
                <div className="meeting-logs-card">
                  <h3 className="meeting-section-title">Past Meeting Logs</h3>
                  <div className="meeting-logs-list">
                    {loadingMeetings ? (
                      <div className="loading-state">Loading meetings...</div>
                    ) : meetings.length === 0 ? (
                      <div className="empty-state">No meetings scheduled yet</div>
                    ) : (
                      meetings
                        .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                        .map((meeting) => {
                          const meetingDate = new Date(meeting.startTime);
                          const formattedDate = meetingDate.toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          });
                          const attendees = [
                            meeting.lender.name || meeting.lender.email.split('@')[0],
                            meeting.borrower.name || meeting.borrower.email.split('@')[0],
                          ].join(', ');

                          return (
                            <div key={meeting.id} className="meeting-log-item">
                              <div className="meeting-log-icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                              </div>
                              <div className="meeting-log-details">
                                <div className="meeting-log-date">{formattedDate} | {attendees}</div>
                                <div className="meeting-log-desc">
                                  {meeting.title || 'Meeting'} ({meeting.status})
                                </div>
                              </div>
                              <button className="view-notes-btn" title={meeting.notes || 'No notes'}>
                                View Notes
                              </button>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Actions & Previous Meeting Insides */}
              <div className="meeting-right">
                {/* Action Buttons */}
                <div className="meeting-actions">
                  <button className="new-meeting-btn" onClick={handleScheduleMeeting}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 7l-7 5 7 5V7z"></path>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    New Meeting
                  </button>
                  <button className="schedule-later-btn" onClick={handleScheduleMeeting}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M23 7l-7 5 7 5V7z"></path>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    Schedule for later
                  </button>
                </div>

                {/* Previous Meeting Insides */}
                <div className="previous-meeting-wrapper">
                  <h3 className="previous-meeting-title">Previous Meeting Insides</h3>
                    <div className="previous-meeting-grid">
                      {/* Left Column - Date & Time */}
                      <div className="meeting-info-column">
                        <div className="meeting-info-row">
                          <span className="meeting-info-label">Date & Time</span>
                        </div>
                      </div>

                      {/* Middle Column - Meeting Notes */}
                      <div className="meeting-notes-section">
                        <span className="meeting-notes-title">Meeting Notes</span>
                        <ul className="meeting-notes-list">
                          <li>Text Paragraph 1</li>
                          <li>Text Paragraph 1</li>
                          <li>Text Paragraph 1</li>
                          <li>Text Paragraph 1</li>
                          <li>Text Paragraph 1</li>
                          <li>Text Paragraph 1</li>
                          <li>Text Paragraph 1</li>
                        </ul>
                      </div>

                      {/* Right Column - Joined Members */}
                      <div className="joined-members-column">
                        <span className="joined-members-title">Joined Members</span>
                        <div className="members-list">
                          {[1, 2, 3, 4, 5, 6].map((member) => (
                            <div key={member} className="member-item">
                              <div className="member-avatar"></div>
                              <div className="member-info">
                                <div className="member-name">Name</div>
                                <div className="member-designation">Designation</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
        )}

        {activeTab === 'customer-info' && (
          <div className="tab-content">
            <BasicCustomerInfo leadId={id} />
          </div>
        )}

        {activeTab === 'pre-screening' && (
          <div className="tab-content">
            <div className="coming-soon">
              <p>This section is coming soon.</p>
            </div>
          </div>
        )}

        {activeTab === 'docs-collection' && (
          <div className="tab-content">
            <MandatoryDocsCollection leadId={id} />
          </div>
        )}
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {showScheduleMeetingModal && (
        <ScheduleMeetingModal
          onClose={() => setShowScheduleMeetingModal(false)}
          onMeetingScheduled={handleMeetingScheduled}
          leadEmail={lead?.email || ''}
        />
      )}
    </DashboardLayout>
  );
};

export default LeadDetailsPage;
