import { Router } from 'express';
import * as leadController from '../controllers/leadController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validate } from '../utils/validate.js';
import { z } from 'zod';

const router = Router();

// Validation schemas
const createLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  contactPerson: z.string().optional(),
  companyName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'LINKEDIN', 'COLD_CALL', 'EMAIL_CAMPAIGN', 'TRADE_SHOW', 'PARTNER', 'OTHER']).optional(),
  sourceDetails: z.string().optional(),
  leadType: z.enum(['INDIVIDUAL', 'BUSINESS', 'CORPORATE', 'GOVERNMENT']).optional(),
  leadPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['NEW', 'KNOCKOUT_FAILED', 'MEETING_SCHEDULED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  industry: z.string().optional(),
  dealValue: z.number().positive().optional(),
  notes: z.string().optional(),
  assignedRM: z.string().optional(),
});

const updateLeadSchema = z.object({
  firstName: z.string().min(1).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  contactPerson: z.string().optional(),
  companyName: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  source: z.enum(['WEBSITE', 'REFERRAL', 'LINKEDIN', 'COLD_CALL', 'EMAIL_CAMPAIGN', 'TRADE_SHOW', 'PARTNER', 'OTHER']).optional(),
  sourceDetails: z.string().optional(),
  leadType: z.enum(['INDIVIDUAL', 'BUSINESS', 'CORPORATE', 'GOVERNMENT']).optional(),
  leadPriority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['NEW', 'KNOCKOUT_FAILED', 'MEETING_SCHEDULED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST']).optional(),
  industry: z.string().optional(),
  dealValue: z.number().positive().optional(),
  notes: z.string().optional(),
  assignedRM: z.string().optional(),
});

const assignRMSchema = z.object({
  assignedRM: z.string().min(1, 'Assigned RM user ID is required'),
});

const addRMSchema = z.object({
  rmUserId: z.string().min(1, 'RM user ID is required'),
});

// All routes require authentication
router.use(authenticateToken);

// Routes
router.post('/', validate(createLeadSchema), leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/my-leads', leadController.getMyLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/:id', leadController.getLead);
router.put('/:id', validate(updateLeadSchema), leadController.updateLead);
router.put('/:id/assign-rm', validate(assignRMSchema), leadController.assignRM);
router.post('/:id/add-rm', validate(addRMSchema), leadController.addRM);
router.delete('/:id/remove-rm/:rmUserId', leadController.removeRM);
router.delete('/:id', leadController.deleteLead);

export default router;
