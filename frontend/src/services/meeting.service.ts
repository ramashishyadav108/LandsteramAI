import { api, ApiResponse } from './api';

export interface Meeting {
  id: string;
  calendlyEventUri: string;
  calendlyEventId: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  meetingLink: string | null;
  platform: string | null;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';
  notes: string | null;
  rmEmail: string | null;
  additionalEmails: string[];
  createdAt: string;
  updatedAt: string;
  lender: {
    id: string;
    name: string | null;
    email: string;
  };
  borrower: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface CreateMeetingData {
  borrowerId: string; // Borrower email
  rmEmail?: string; // Optional RM email
  additionalEmails?: string[]; // Additional emails to notify
  startTime: string; // ISO 8601 format
  duration: number; // in minutes
  notes?: string;
}

class MeetingService {
  /**
   * Schedule a new meeting
   */
  async scheduleMeeting(data: CreateMeetingData): Promise<ApiResponse<{ meeting: Meeting }>> {
    return api.post('/api/meetings/schedule', data);
  }

  /**
   * Get all meetings for the authenticated user
   */
  async getMyMeetings(): Promise<ApiResponse<{ meetings: Meeting[]; count: number }>> {
    return api.get('/api/meetings');
  }

  /**
   * Get a specific meeting by ID
   */
  async getMeetingById(meetingId: string): Promise<ApiResponse<{ meeting: Meeting }>> {
    return api.get(`/api/meetings/${meetingId}`);
  }

  /**
   * Cancel a meeting
   */
  async cancelMeeting(meetingId: string, cancelReason?: string): Promise<ApiResponse<{ meeting: Meeting }>> {
    return api.post(`/api/meetings/${meetingId}/cancel`, { cancelReason });
  }

  /**
   * Update meeting status
   */
  async updateMeetingStatus(
    meetingId: string,
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW'
  ): Promise<ApiResponse<{ meeting: Meeting }>> {
    return api.patch(`/api/meetings/${meetingId}/status`, { status });
  }

  /**
   * Update meeting notes
   */
  async updateMeetingNotes(meetingId: string, notes: string): Promise<ApiResponse<{ meeting: Meeting }>> {
    return api.patch(`/api/meetings/${meetingId}/notes`, { notes });
  }

  /**
   * Get Calendly event types
   */
  async getEventTypes(): Promise<ApiResponse<any>> {
    return api.get('/api/meetings/event-types');
  }
}

export const meetingService = new MeetingService();
