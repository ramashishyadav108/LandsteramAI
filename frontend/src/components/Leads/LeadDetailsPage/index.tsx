import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../Dashboard';
import { leadService, Lead } from '../../../services/lead.service';
import { meetingService, Meeting } from '../../../services/meeting.service';
import { ScheduleMeetingModal } from '../../Meetings';
import BasicCustomerInfo from '../BasicCustomerInfo';
import MandatoryDocsCollection from '../MandatoryDocsCollection';
import AssignRMModal from '../AssignRMModal';
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
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [showAllMeetings, setShowAllMeetings] = useState(false);
  const [showAllPastMeetings, setShowAllPastMeetings] = useState(false);
  const [showAssignRMModal, setShowAssignRMModal] = useState(false);

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

  const handleViewNotes = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setNotesInput(meeting.notes || '');
    setIsEditingNotes(false); // Start in view mode
    setShowNotesModal(true);
  };

  const handleCloseNotesModal = () => {
    setShowNotesModal(false);
    setSelectedMeeting(null);
    setNotesInput('');
    setIsEditingNotes(false);
  };

  const handleEditNotes = () => {
    setIsEditingNotes(true);
  };

  const handleCancelEdit = () => {
    if (selectedMeeting) {
      setNotesInput(selectedMeeting.notes || '');
    }
    setIsEditingNotes(false);
  };

  const handleSaveNotes = async () => {
    if (!selectedMeeting) return;

    try {
      const response = await meetingService.updateMeetingNotes(selectedMeeting.id, notesInput);
      if (response.success) {
        // Update the meetings list with the new notes
        const updatedMeetings = meetings.map(m =>
          m.id === selectedMeeting.id ? { ...m, notes: notesInput } : m
        );
        setMeetings(updatedMeetings);
        setSelectedMeeting({ ...selectedMeeting, notes: notesInput });
        setIsEditingNotes(false); // Exit edit mode after saving
      }
    } catch (err) {
      console.error('Failed to update notes:', err);
      alert('Failed to update notes. Please try again.');
    }
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

  const handleAssignRM = async (userId: string) => {
    if (!id) return;
    
    try {
      const response = await leadService.addRM(id, userId);
      if (response.success && response.data) {
        setLead(response.data);
      }
    } catch (error) {
      console.error('Failed to add RM:', error);
      throw error;
    }
  };

  const handleRemoveRM = async (rmUserId: string) => {
    if (!id) return;
    
    try {
      const response = await leadService.removeRM(id, rmUserId);
      if (response.success && response.data) {
        setLead(response.data);
      }
    } catch (error) {
      console.error('Failed to remove RM:', error);
      throw error;
    }
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
                  <div className="rm-card-header">
                    <h3 className="card-title">Assigned RM</h3>
                    <button 
                      className="manage-rm-btn-top"
                      onClick={() => setShowAssignRMModal(true)}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <line x1="19" y1="8" x2="19" y2="14"></line>
                        <line x1="22" y1="11" x2="16" y2="11"></line>
                      </svg>
                      Manage RM
                    </button>
                  </div>
                  <div className="info-card-content">
                    {lead?.assignedRMsList && lead.assignedRMsList.length > 0 ? (
                      <div className="rm-grid-container">
                        {lead.assignedRMsList.map((rm) => (
                          <div key={rm.id} className="rm-item-card-simple">
                            <div className="rm-avatar-simple">
                              {rm.picture ? (
                                <img
                                  src={rm.picture}
                                  alt={rm.name || rm.email}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    borderRadius: '50%',
                                  }}
                                />
                              ) : (
                                rm.name?.charAt(0).toUpperCase() || rm.email.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div className="rm-item-details-simple">
                              <span className="rm-item-name-simple">{rm.name || rm.email}</span>
                              <span className="rm-item-contact">Contact</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-rm-assigned">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <line x1="19" y1="8" x2="19" y2="14"></line>
                          <line x1="22" y1="11" x2="16" y2="11"></line>
                        </svg>
                        <p>No RM assigned yet</p>
                      </div>
                    )}
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
                      <>
                        {meetings
                          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                          .slice(0, showAllPastMeetings ? undefined : 5)
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
                                <button
                                  className="view-notes-btn"
                                  onClick={() => handleViewNotes(meeting)}
                                >
                                  View
                                </button>
                              </div>
                            );
                          })}
                        
                        {/* Show More/Show Less Button */}
                        {meetings.length > 5 && (
                          <div className="show-more-container">
                            <button
                              className="show-more-btn"
                              onClick={() => setShowAllPastMeetings(!showAllPastMeetings)}
                            >
                              {showAllPastMeetings ? 'Show Less' : 'Show More'}
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ transform: showAllPastMeetings ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Actions & Previous Meeting Insights */}
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

                {/* Previous Meeting Insights */}
                <div className="previous-meeting-wrapper">
                  <h3 className="previous-meeting-title">Previous Meeting Insights</h3>
                  {meetings.length === 0 ? (
                    <div className="empty-state" style={{ padding: '40px', textAlign: 'center' }}>
                      No previous meetings to display
                    </div>
                  ) : (
                    <>
                      <div className="previous-meeting-table">
                        {/* Header Row */}
                        <div className="previous-meeting-header">
                          <div className="header-cell date-header">Date & Time</div>
                          <div className="header-cell notes-header">Meeting Notes</div>
                          <div className="header-cell members-header">Joined Members</div>
                        </div>

                        {/* Content with Rows */}
                        <div className="previous-meeting-rows">
                          {meetings
                            .filter(m => new Date(m.startTime) < new Date())
                            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                            .slice(0, showAllMeetings ? undefined : 5)
                            .map((meeting) => {
                            const meetingDate = new Date(meeting.startTime);
                            const formattedDate = meetingDate.toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            });
                            const formattedTime = meetingDate.toLocaleString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            });

                            const notesList = meeting.notes
                              ? meeting.notes.split('\n').filter(note => note.trim().length > 0)
                              : [];

                            // Get attendees - include lender, borrower, RM, and additional emails
                            const attendees = [
                              {
                                name: meeting.lender.name || meeting.lender.email.split('@')[0],
                                designation: 'Lender',
                                email: meeting.lender.email,
                                picture: meeting.lender.picture
                              },
                              {
                                name: meeting.borrower.name || meeting.borrower.email.split('@')[0],
                                designation: 'Borrower',
                                email: meeting.borrower.email,
                                picture: meeting.borrower.picture
                              },
                            ];

                            // Add RM if present
                            if (meeting.rmEmail) {
                              attendees.push({
                                name: meeting.rmEmail.split('@')[0],
                                designation: 'RM',
                                email: meeting.rmEmail,
                                picture: undefined
                              });
                            }

                            // Add additional emails if present
                            if (meeting.additionalEmails && Array.isArray(meeting.additionalEmails)) {
                              meeting.additionalEmails.forEach((email: string) => {
                                attendees.push({
                                  name: email.split('@')[0],
                                  designation: 'Guest',
                                  email: email,
                                  picture: undefined
                                });
                              });
                            }

                            return (
                              <React.Fragment key={meeting.id}>
                                {/* Date & Time Cell */}
                                <div className="row-cell date-cell">
                                  <div className="date-value">{formattedDate}</div>
                                  <div className="time-value">{formattedTime}</div>
                                </div>

                                {/* Notes Cell */}
                                <div className="row-cell notes-cell">
                                  {notesList.length > 0 ? (
                                    <ul className="notes-list">
                                      {notesList.map((note, i) => (
                                        <li key={i}>{note}</li>
                                      ))}
                                    </ul>
                                  ) : (
                                    <div className="no-notes-text">No notes available</div>
                                  )}
                                </div>

                                {/* Members Cell */}
                                <div className="row-cell members-cell">
                                  <div className="members-grid">
                                    {attendees.map((member, i) => (
                                      <div key={i} className="member-item">
                                        <div className="member-avatar">
                                          {member.picture ? (
                                            <img
                                              src={member.picture}
                                              alt={member.name}
                                              style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                borderRadius: '50%',
                                              }}
                                            />
                                          ) : (
                                            member.name.charAt(0).toUpperCase()
                                          )}
                                        </div>
                                        <div className="member-info">
                                          <div className="member-name">{member.name}</div>
                                          <div className="member-designation">{member.designation}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </React.Fragment>
                            );
                          })}
                        </div>

                        {/* Show More/Show Less Button */}
                        {meetings.filter(m => new Date(m.startTime) < new Date()).length > 5 && (
                          <div className="show-more-container">
                            <button
                              className="show-more-btn"
                              onClick={() => setShowAllMeetings(!showAllMeetings)}
                            >
                              {showAllMeetings ? 'Show Less' : 'Show More'}
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ transform: showAllMeetings ? 'rotate(180deg)' : 'rotate(0deg)' }}
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
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

      {/* Notes Modal */}
      {showNotesModal && selectedMeeting && (
        <div className="modal-overlay" onClick={handleCloseNotesModal}>
          <div className="notes-modal" onClick={(e) => e.stopPropagation()}>
            <div className="notes-modal-header">
              <h3>Meeting Notes</h3>
              <button className="close-modal-btn" onClick={handleCloseNotesModal}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="notes-modal-body">
              <div className="notes-meeting-info">
                <p className="notes-meeting-title">{selectedMeeting.title}</p>
                <p className="notes-meeting-date">
                  {new Date(selectedMeeting.startTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {isEditingNotes ? (
                <textarea
                  className="notes-textarea"
                  placeholder="Enter meeting notes here... (One note per line for bullet points)"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={10}
                  autoFocus
                />
              ) : (
                <div className="notes-display">
                  {selectedMeeting.notes ? (
                    <div className="notes-content">
                      {selectedMeeting.notes.split('\n').filter(note => note.trim().length > 0).map((note, i) => (
                        <div key={i} className="note-item">
                          <span className="note-bullet">•</span>
                          <span className="note-text">{note}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-notes-placeholder">
                      No notes added yet. Click "Add Notes" to create notes for this meeting.
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="notes-modal-footer">
              {isEditingNotes ? (
                <>
                  <button className="cancel-notes-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="save-notes-btn" onClick={handleSaveNotes}>
                    Save Notes
                  </button>
                </>
              ) : (
                <>
                  <button className="cancel-notes-btn" onClick={handleCloseNotesModal}>
                    Close
                  </button>
                  <button className="save-notes-btn" onClick={handleEditNotes}>
                    {selectedMeeting.notes ? 'Edit Notes' : 'Add Notes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Assign RM Modal */}
      {showAssignRMModal && (
        <AssignRMModal
          onClose={() => setShowAssignRMModal(false)}
          onAssign={handleAssignRM}
          onRemove={handleRemoveRM}
          assignedRMIds={lead?.assignedRMs || []}
        />
      )}
    </DashboardLayout>
  );
};

export default LeadDetailsPage;
