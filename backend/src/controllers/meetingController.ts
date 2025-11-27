import { Request, Response, NextFunction } from 'express';
import {
  createMeeting,
  getMeetingById,
  getUserMeetings,
  cancelMeeting,
  updateMeetingStatus,
  updateMeetingNotes,
} from '../services/meetingService.js';
import { getKratosAIEventType } from '../services/calendlyService.js';
import { AppError, NotFoundError } from '../middlewares/errorHandler.js';
import { JWTPayload } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { sendSuccess, sendCreated } from '../utils/response.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Schedule a new meeting
 */
export const scheduleMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    const { borrowerId, rmEmail, additionalEmails, startTime, duration, notes } = req.body;

    // Validate required fields
    if (!borrowerId || !startTime || !duration) {
      throw new AppError(
        'Missing required fields: borrowerId, startTime, duration',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Validate duration
    if (duration < 15 || duration > 240) {
      throw new AppError(
        'Duration must be between 15 and 240 minutes',
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Parse and validate start time
    const meetingStartTime = new Date(startTime);
    if (isNaN(meetingStartTime.getTime())) {
      throw new AppError('Invalid start time format', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if start time is in the future
    if (meetingStartTime <= new Date()) {
      throw new AppError('Start time must be in the future', HTTP_STATUS.BAD_REQUEST);
    }

    logger.info('Scheduling meeting', {
      lenderId: userId,
      borrowerId,
      rmEmail,
      additionalEmails,
      startTime: meetingStartTime,
      duration,
    });

    // Create meeting (lender is the current user)
    const meeting = await createMeeting({
      lenderId: userId,
      borrowerId,
      rmEmail,
      additionalEmails,
      startTime: meetingStartTime,
      duration: parseInt(duration),
      notes,
    });

    sendCreated(res, { meeting }, 'Meeting scheduled successfully');
    logger.info('Meeting scheduled successfully', { meetingId: meeting.id });
  } catch (error) {
    logger.error('Failed to schedule meeting', error);
    next(error);
  }
};

/**
 * Get all meetings for the authenticated user
 */
export const getMyMeetings = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    logger.debug('Fetching meetings for user', { userId });

    const meetings = await getUserMeetings(userId);

    sendSuccess(res, { meetings, count: meetings.length });
    logger.debug('Meetings fetched successfully', { userId, count: meetings.length });
  } catch (error) {
    logger.error('Failed to fetch meetings', error);
    next(error);
  }
};

/**
 * Get meeting by ID
 */
export const getMeeting = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;
    const { meetingId } = req.params;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    logger.debug('Fetching meeting', { meetingId });

    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    // Check if user is the lender (borrower is just an email, not a user in the system)
    if (meeting.lenderId !== userId) {
      throw new AppError('You do not have access to this meeting', HTTP_STATUS.FORBIDDEN);
    }

    sendSuccess(res, { meeting });
    logger.debug('Meeting fetched successfully', { meetingId });
  } catch (error) {
    logger.error('Failed to fetch meeting', error);
    next(error);
  }
};

/**
 * Cancel a meeting
 */
export const cancelMeetingById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;
    const { meetingId } = req.params;
    const { cancelReason } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    // Check if user is part of the meeting
    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    // Check if user is the lender (borrower is just an email, not a user in the system)
    if (meeting.lenderId !== userId) {
      throw new AppError('You do not have access to cancel this meeting', HTTP_STATUS.FORBIDDEN);
    }

    logger.info('Canceling meeting', { meetingId, userId });

    const canceledMeeting = await cancelMeeting(meetingId, cancelReason);

    sendSuccess(res, { meeting: canceledMeeting }, 'Meeting canceled successfully');
    logger.info('Meeting canceled successfully', { meetingId });
  } catch (error) {
    logger.error('Failed to cancel meeting', error);
    next(error);
  }
};

/**
 * Update meeting status
 */
export const updateMeetingStatusById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;
    const { meetingId } = req.params;
    const { status } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!status) {
      throw new AppError('Status is required', HTTP_STATUS.BAD_REQUEST);
    }

    const validStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      throw new AppError(
        `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        HTTP_STATUS.BAD_REQUEST
      );
    }

    // Check if user is part of the meeting
    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    // Check if user is the lender (borrower is just an email, not a user in the system)
    if (meeting.lenderId !== userId) {
      throw new AppError(
        'You do not have access to update this meeting',
        HTTP_STATUS.FORBIDDEN
      );
    }

    logger.info('Updating meeting status', { meetingId, status });

    const updatedMeeting = await updateMeetingStatus(meetingId, status);

    sendSuccess(res, { meeting: updatedMeeting }, 'Meeting status updated successfully');
    logger.info('Meeting status updated successfully', { meetingId, status });
  } catch (error) {
    logger.error('Failed to update meeting status', error);
    next(error);
  }
};

/**
 * Update meeting notes
 */
export const updateMeetingNotesById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;
    const { meetingId } = req.params;
    const { notes } = req.body;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (notes === undefined) {
      throw new AppError('Notes field is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user is part of the meeting
    const meeting = await getMeetingById(meetingId);

    if (!meeting) {
      throw new NotFoundError('Meeting not found');
    }

    // Check if user is the lender (borrower is just an email, not a user in the system)
    if (meeting.lenderId !== userId) {
      throw new AppError(
        'You do not have access to update this meeting',
        HTTP_STATUS.FORBIDDEN
      );
    }

    logger.info('Updating meeting notes', { meetingId });

    const updatedMeeting = await updateMeetingNotes(meetingId, notes);

    sendSuccess(res, { meeting: updatedMeeting }, 'Meeting notes updated successfully');
    logger.info('Meeting notes updated successfully', { meetingId });
  } catch (error) {
    logger.error('Failed to update meeting notes', error);
    next(error);
  }
};

/**
 * Get Calendly event types
 */
export const getEventTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req.user as JWTPayload)?.userId;

    if (!userId) {
      throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    logger.debug('Fetching Calendly event types');

    const eventType = await getKratosAIEventType();

    if (!eventType) {
      throw new AppError(
        'KratosAI event type not found in Calendly',
        HTTP_STATUS.NOT_FOUND
      );
    }

    sendSuccess(res, { eventType });
    logger.debug('Event type fetched successfully');
  } catch (error) {
    logger.error('Failed to fetch event types', error);
    next(error);
  }
};
