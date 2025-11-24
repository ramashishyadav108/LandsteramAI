import { Router } from 'express';
import {
  scheduleMeeting,
  getMyMeetings,
  getMeeting,
  cancelMeetingById,
  updateMeetingStatusById,
  getEventTypes,
} from '../controllers/meetingController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Schedule a new meeting
router.post('/schedule', scheduleMeeting);

// Get all meetings for authenticated user
router.get('/', getMyMeetings);

// Get Calendly event types
router.get('/event-types', getEventTypes);

// Get specific meeting by ID
router.get('/:meetingId', getMeeting);

// Cancel a meeting
router.post('/:meetingId/cancel', cancelMeetingById);

// Update meeting status
router.patch('/:meetingId/status', updateMeetingStatusById);

export default router;
