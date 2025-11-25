import { Router } from 'express';
import { documentController } from '../controllers/documentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.config.js';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Upload a new document
router.post('/upload', upload.single('file'), documentController.uploadDocument);

// Get all documents for a lead
router.get('/lead/:leadId', documentController.getDocumentsByLeadId);

// Get a document by ID
router.get('/:id', documentController.getDocumentById);

// Update document metadata
router.patch('/:id', documentController.updateDocument);

// Replace document file
router.patch('/:id/file', upload.single('file'), documentController.replaceDocumentFile);

// Delete a document
router.delete('/:id', documentController.deleteDocument);

export default router;
