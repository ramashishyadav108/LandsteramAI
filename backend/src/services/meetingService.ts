import prisma from '../config/db.js';
import { logger } from '../utils/logger.js';
import { AppError, NotFoundError } from '../middlewares/errorHandler.js';
import { HTTP_STATUS } from '../constants/index.js';
import {
  createCalendlyMeeting,
  cancelCalendlyEvent,
  getKratosAIEventType,
} from './calendlyService.js';
import {
  sendMeetingInvitationToBorrower,
  sendMeetingNotificationToRM,
  sendMeetingNotificationToLender,
} from './mailService.js';

interface CreateMeetingData {
  lenderId: string;
  borrowerId: string; // Borrower email
  rmEmail?: string; // Optional RM email
  additionalEmails?: string[]; // Additional emails to notify
  startTime: Date;
  duration: number;
  notes?: string;
}

interface MeetingWithUsers {
  id: string;
  calendlyEventUri: string;
  calendlyEventId: string;
  title: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  meetingLink: string | null;
  platform: string | null;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  lenderId: string;
  borrowerId: string;
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

/**
 * Create a new meeting and schedule it in Calendly
 */
export async function createMeeting(data: CreateMeetingData): Promise<MeetingWithUsers> {
  try {
    logger.info('Creating meeting', {
      lenderId: data.lenderId,
      borrowerId: data.borrowerId,
      startTime: data.startTime,
    });

    // Verify lender exists
    const lender = await prisma.user.findUnique({ where: { id: data.lenderId } });

    if (!lender) {
      throw new NotFoundError('Lender not found');
    }

    // Note: borrowerId is accepted as-is without validation

    // Get the KratosAI event type
    const eventType = await getKratosAIEventType();

    if (!eventType) {
      throw new AppError(
        'KratosAI event type not found in Calendly. Please create it first.',
        HTTP_STATUS.SERVICE_UNAVAILABLE
      );
    }

    // Calculate end time
    const endTime = new Date(data.startTime.getTime() + data.duration * 60000);

    // Format start time in ISO 8601
    const startTimeISO = data.startTime.toISOString();

    // Create meeting in Calendly
    // Note: Calendly API has limitations. We create a scheduling link instead
    const calendlyResponse = await createCalendlyMeeting({
      eventTypeUri: eventType.uri,
      startTime: startTimeISO,
      invitees: [
        { email: lender.email, name: lender.name || undefined },
        { email: data.borrowerId, name: undefined }, // borrowerId is the email directly
      ],
    });

    // For now, we'll use a placeholder since Calendly doesn't support direct scheduling
    // In a real implementation, you would:
    // 1. Create a one-off scheduling link
    // 2. Send it to both parties
    // 3. Use webhooks to capture when the meeting is actually scheduled

    // Create meeting in database
    const meeting = await prisma.meeting.create({
      data: {
        calendlyEventUri: calendlyResponse.resource.uri || `temp-${Date.now()}`,
        calendlyEventId: calendlyResponse.resource.uri?.split('/').pop() || `temp-${Date.now()}`,
        title: `Meeting between ${lender.name || lender.email} and ${data.borrowerId}`,
        startTime: data.startTime,
        endTime: endTime,
        duration: data.duration,
        meetingLink: calendlyResponse.resource.booking_url || null, // Store the booking URL (will be updated after confirmation)
        platform: 'calendly',
        status: 'SCHEDULED',
        lenderId: data.lenderId,
        borrowerId: data.borrowerId,
        rmEmail: data.rmEmail || null,
        additionalEmails: data.additionalEmails || [],
        notes: data.notes || null,
      },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    logger.info('Meeting created successfully', { meetingId: meeting.id });

    // Send meeting invitation and notifications
    if (calendlyResponse.resource.booking_url) {
      // 1. Send invitation with scheduling link to borrower
      const borrowerEmailSent = await sendMeetingInvitationToBorrower(
        data.borrowerId,
        lender.name || lender.email,
        calendlyResponse.resource.booking_url,
        data.startTime,
        data.duration
      );

      if (borrowerEmailSent) {
        logger.info('Meeting invitation email sent to borrower', {
          borrowerEmail: data.borrowerId,
          meetingId: meeting.id
        });
      } else {
        logger.warn('Failed to send meeting invitation email to borrower', {
          borrowerEmail: data.borrowerId,
          meetingId: meeting.id
        });
      }

      // 2. Send notification to RM (if provided) - without scheduling link
      if (data.rmEmail) {
        const rmEmailSent = await sendMeetingNotificationToRM(
          data.rmEmail,
          lender.name || lender.email,
          data.borrowerId,
          data.startTime,
          data.duration
        );

        if (rmEmailSent) {
          logger.info('Meeting notification email sent to RM', {
            rmEmail: data.rmEmail,
            meetingId: meeting.id
          });
        } else {
          logger.warn('Failed to send meeting notification email to RM', {
            rmEmail: data.rmEmail,
            meetingId: meeting.id
          });
        }
      }

      // 3. Send notification to lender (who created the meeting) - without scheduling link
      const lenderEmailSent = await sendMeetingNotificationToLender(
        lender.email,
        lender.name || lender.email,
        data.borrowerId,
        data.startTime,
        data.duration
      );

      if (lenderEmailSent) {
        logger.info('Meeting notification email sent to lender', {
          lenderEmail: lender.email,
          meetingId: meeting.id
        });
      } else {
        logger.warn('Failed to send meeting notification email to lender', {
          lenderEmail: lender.email,
          meetingId: meeting.id
        });
      }
    }

    // Return meeting with borrower info constructed from borrowerId (which is an email)
    return {
      ...meeting,
      borrower: {
        id: data.borrowerId,
        name: null,
        email: data.borrowerId,
      },
    };
  } catch (error) {
    logger.error('Failed to create meeting', error);
    throw error;
  }
}

/**
 * Get meeting by ID
 */
export async function getMeetingById(meetingId: string): Promise<MeetingWithUsers | null> {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    if (!meeting) {
      return null;
    }

    // Return meeting with borrower info constructed from borrowerId (which is an email)
    return {
      ...meeting,
      borrower: {
        id: meeting.borrowerId,
        name: null,
        email: meeting.borrowerId,
      },
    };
  } catch (error) {
    logger.error('Failed to get meeting', error);
    throw error;
  }
}

/**
 * Get all meetings for a user (as lender or borrower)
 */
export async function getUserMeetings(userId: string): Promise<MeetingWithUsers[]> {
  try {
    const meetings = await prisma.meeting.findMany({
      where: {
        lenderId: userId,
      },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    // Return meetings with borrower info constructed from borrowerId (which is an email)
    return meetings.map((meeting) => ({
      ...meeting,
      borrower: {
        id: meeting.borrowerId,
        name: null,
        email: meeting.borrowerId,
      },
    }));
  } catch (error) {
    logger.error('Failed to get user meetings', error);
    throw error;
  }
}

/**
 * Cancel a meeting
 */
export async function cancelMeeting(
  meetingId: string,
  cancelReason?: string
): Promise<MeetingWithUsers> {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: { id: meetingId },
    });

    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    if (meeting.status === 'CANCELED') {
      throw new AppError('Meeting is already canceled', HTTP_STATUS.BAD_REQUEST);
    }

    // Cancel in Calendly
    try {
      await cancelCalendlyEvent(meeting.calendlyEventUri, cancelReason);
    } catch (error) {
      logger.warn('Failed to cancel meeting in Calendly, continuing with database update', error);
    }

    // Update meeting status in database
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        status: 'CANCELED',
        canceledAt: new Date(),
        cancelReason: cancelReason || null,
      },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    logger.info('Meeting canceled successfully', { meetingId });

    // Return meeting with borrower info constructed from borrowerId (which is an email)
    return {
      ...updatedMeeting,
      borrower: {
        id: updatedMeeting.borrowerId,
        name: null,
        email: updatedMeeting.borrowerId,
      },
    };
  } catch (error) {
    logger.error('Failed to cancel meeting', error);
    throw error;
  }
}

/**
 * Update meeting status
 */
export async function updateMeetingStatus(
  meetingId: string,
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW'
): Promise<MeetingWithUsers> {
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { status },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    logger.info('Meeting status updated', { meetingId, status });

    // Return meeting with borrower info constructed from borrowerId (which is an email)
    return {
      ...updatedMeeting,
      borrower: {
        id: updatedMeeting.borrowerId,
        name: null,
        email: updatedMeeting.borrowerId,
      },
    };
  } catch (error) {
    logger.error('Failed to update meeting status', error);
    throw error;
  }
}

/**
 * Update meeting notes
 */
export async function updateMeetingNotes(
  meetingId: string,
  notes: string
): Promise<MeetingWithUsers> {
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { notes },
      include: {
        lender: {
          select: {
            id: true,
            name: true,
            email: true,
            picture: true,
          },
        },
      },
    });

    logger.info('Meeting notes updated', { meetingId });

    // Return meeting with borrower info constructed from borrowerId (which is an email)
    return {
      ...updatedMeeting,
      borrower: {
        id: updatedMeeting.borrowerId,
        name: null,
        email: updatedMeeting.borrowerId,
      },
    };
  } catch (error) {
    logger.error('Failed to update meeting notes', error);
    throw error;
  }
}
