import { Router } from 'express';
import * as leadController from '../controllers/leadController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Routes - validation is now handled on the frontend
router.post('/', leadController.createLead);
router.get('/', leadController.getAllLeads);
router.get('/my-leads', leadController.getMyLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/:id', leadController.getLead);
router.put('/:id', leadController.updateLead);
router.put('/:id/assign-rm', leadController.assignRM);
router.post('/:id/add-rm', leadController.addRM);
router.delete('/:id/remove-rm/:rmUserId', leadController.removeRM);
router.delete('/:id', leadController.deleteLead);

export default router;
