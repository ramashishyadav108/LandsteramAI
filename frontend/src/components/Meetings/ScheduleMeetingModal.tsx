import React, { useState } from 'react';
import { meetingService, CreateMeetingData } from '../../services/meeting.service';
import './ScheduleMeetingModal.css';

interface ScheduleMeetingModalProps {
  onClose: () => void;
  onMeetingScheduled: () => void;
  leadEmail?: string; // Optional lead email to pre-fill borrower field
}

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
  onClose,
  onMeetingScheduled,
  leadEmail
}) => {
  const [formData, setFormData] = useState<CreateMeetingData>({
    borrowerId: leadEmail || '',
    rmEmail: '',
    additionalEmails: [],
    startTime: '',
    duration: 30,
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) : value,
    }));
  };

  const handleAddEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!emailRegex.test(newEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (formData.additionalEmails?.includes(newEmail)) {
      setError('This email is already added');
      return;
    }

    setFormData(prev => ({
      ...prev,
      additionalEmails: [...(prev.additionalEmails || []), newEmail],
    }));
    setNewEmail('');
    setError('');
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      additionalEmails: prev.additionalEmails?.filter(email => email !== emailToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.borrowerId.trim()) {
      setError('Borrower email is required');
      return;
    }

    // Validate email format for borrower
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.borrowerId)) {
      setError('Please enter a valid borrower email address');
      return;
    }

    // Validate RM email if provided
    if (formData.rmEmail && !emailRegex.test(formData.rmEmail)) {
      setError('Please enter a valid RM email address');
      return;
    }

    // Validate additional emails
    if (formData.additionalEmails && formData.additionalEmails.length > 0) {
      for (const email of formData.additionalEmails) {
        if (!emailRegex.test(email)) {
          setError(`Invalid email address: ${email}`);
          return;
        }
      }
    }

    if (!formData.startTime) {
      setError('Meeting date and time is required');
      return;
    }

    // Check if start time is in the future
    const meetingDate = new Date(formData.startTime);
    if (meetingDate <= new Date()) {
      setError('Meeting time must be in the future');
      return;
    }

    if (formData.duration < 15 || formData.duration > 240) {
      setError('Duration must be between 15 and 240 minutes');
      return;
    }

    try {
      setLoading(true);

      // Convert to ISO 8601 format
      const startTimeISO = new Date(formData.startTime).toISOString();

      const response = await meetingService.scheduleMeeting({
        ...formData,
        startTime: startTimeISO,
      });

      if (response.success) {
        onMeetingScheduled();
      } else {
        setError(response.message || 'Failed to schedule meeting');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get min datetime for input (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // Add 5 minutes buffer
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content schedule-meeting-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Schedule New Meeting</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form schedule-meeting-form">
          {error && <div className="modal-error">{error}</div>}

          <div className="form-section">
            {/* Row 1: Borrower Email and Lender Email */}
            <div className="form-row two-col">
              <div className="form-group">
                <label htmlFor="borrowerId">
                  Borrower Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="borrowerId"
                  name="borrowerId"
                  value={formData.borrowerId}
                  onChange={handleChange}
                  placeholder="borrower@example.com"
                  required
                />
                <small className="form-help">
                  Borrower will receive the meeting invitation
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="rmEmail">
                  RM Email (Optional)
                </label>
                <input
                  type="email"
                  id="rmEmail"
                  name="rmEmail"
                  value={formData.rmEmail}
                  onChange={handleChange}
                  placeholder="rm@example.com"
                />
                <small className="form-help">
                  RM will be notified about the meeting
                </small>
              </div>
            </div>

            {/* Row: Additional Emails */}
            <div className="form-group full-width">
              <label>Additional Emails (Optional)</label>
              <div className="email-input-group">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEmail();
                    }
                  }}
                  placeholder="additional@example.com"
                  className="email-input"
                />
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="add-email-btn"
                >
                  + Add Email
                </button>
              </div>
              <small className="form-help">
                Add additional people to notify when the meeting is confirmed
              </small>

              {formData.additionalEmails && formData.additionalEmails.length > 0 && (
                <div className="added-emails">
                  {formData.additionalEmails.map((email, index) => (
                    <div key={index} className="email-tag">
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="remove-email-btn"
                        aria-label="Remove email"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Row 2: Date & Time and Duration */}
            <div className="form-row two-col">
              <div className="form-group">
                <label htmlFor="startTime">
                  Meeting Date & Time <span className="required">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  min={getMinDateTime()}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">
                  Duration (minutes) <span className="required">*</span>
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
            </div>

            {/* Row 3: Notes */}
            <div className="form-group full-width">
              <label htmlFor="notes">Meeting Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes or agenda for this meeting..."
                rows={4}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Scheduling...' : 'Schedule Meeting'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleMeetingModal;
