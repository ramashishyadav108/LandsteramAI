import { Router } from 'express';
import { handleCalendlyWebhook } from '../controllers/webhookController.js';

const router = Router();

/**
 * Calendly webhook endpoint
 * This endpoint does NOT require authentication as it's called by Calendly
 */
router.post('/calendly', handleCalendlyWebhook);

export default router;
