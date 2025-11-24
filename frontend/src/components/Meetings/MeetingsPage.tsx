import React, { useState, useEffect } from 'react';
import { meetingService, Meeting } from '../../services/meeting.service';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import './MeetingsPage.css';

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await meetingService.getMyMeetings();

      if (response.success && response.data) {
        setMeetings(response.data.meetings);
      } else {
        setError(response.message || 'Failed to fetch meetings');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleClick = () => {
    setShowScheduleModal(true);
  };

  const handleMeetingScheduled = () => {
    setShowScheduleModal(false);
    fetchMeetings();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'status-scheduled';
      case 'COMPLETED':
        return 'status-completed';
      case 'CANCELED':
        return 'status-canceled';
      case 'NO_SHOW':
        return 'status-no-show';
      default:
        return '';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ');
  };

  return (
    <div className="meetings-page">
      <div className="meetings-header">
        <div className="header-content">
          <h1>Meetings</h1>
          <p>Schedule and manage your meetings with borrowers</p>
        </div>
        <button className="schedule-meeting-btn" onClick={handleScheduleClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Schedule Meeting
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchMeetings}>Retry</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading meetings...</p>
        </div>
      ) : meetings.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h2>No meetings yet</h2>
          <p>Schedule your first meeting with a borrower</p>
          <button className="schedule-btn-empty" onClick={handleScheduleClick}>
            Schedule Meeting
          </button>
        </div>
      ) : (
        <div className="meetings-grid">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="meeting-card">
              <div className="meeting-card-header">
                <h3>{meeting.title}</h3>
                <span className={`meeting-status ${getStatusColor(meeting.status)}`}>
                  {formatStatus(meeting.status)}
                </span>
              </div>

              <div className="meeting-details">
                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>{formatDateTime(meeting.startTime)}</span>
                </div>

                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{meeting.duration} minutes</span>
                </div>

                <div className="detail-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{meeting.borrower.name || meeting.borrower.email}</span>
                </div>

                {meeting.meetingLink && (
                  <div className="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                      Join Meeting
                    </a>
                  </div>
                )}

                {meeting.notes && (
                  <div className="meeting-notes">
                    <strong>Notes:</strong> {meeting.notes}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showScheduleModal && (
        <ScheduleMeetingModal
          onClose={() => setShowScheduleModal(false)}
          onMeetingScheduled={handleMeetingScheduled}
        />
      )}
    </div>
  );
};

export default MeetingsPage;
