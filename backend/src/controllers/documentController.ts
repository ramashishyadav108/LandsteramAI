import { Request, Response } from 'express';
import { documentService } from '../services/documentService.js';

export const documentController = {
  // Upload a new document
  async uploadDocument(req: Request, res: Response) {
    try {
      const { leadId, documentName, documentType } = req.body;
      const userId = (req as any).user?.userId;

      if (!leadId || !documentName || !documentType) {
        return res.status(400).json({
          success: false,
          message: 'Lead ID, document name, and document type are required',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File is required',
        });
      }

      const file = req.file as any;

      const document = await documentService.createDocument({
        leadId,
        documentName,
        documentType,
        fileUrl: file.path,
        filePublicId: file.filename,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
        status: 'ACTIVE',
      });

      return res.status(201).json({
        success: true,
        message: 'Document uploaded successfully',
        data: document,
      });
    } catch (error: any) {
      console.error('Error uploading document:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload document',
      });
    }
  },

  // Get all documents for a lead
  async getDocumentsByLeadId(req: Request, res: Response) {
    try {
      const { leadId } = req.params;

      const documents = await documentService.getDocumentsByLeadId(leadId);

      return res.status(200).json({
        success: true,
        data: documents,
      });
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch documents',
      });
    }
  },

  // Get a document by ID
  async getDocumentById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const document = await documentService.getDocumentById(id);

      if (!document) {
        return res.status(404).json({
          success: false,
          message: 'Document not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: document,
      });
    } catch (error: any) {
      console.error('Error fetching document:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch document',
      });
    }
  },

  // Update document metadata
  async updateDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { documentName, documentType, status } = req.body;

      const document = await documentService.updateDocument(id, {
        documentName,
        documentType,
        status,
      });

      return res.status(200).json({
        success: true,
        message: 'Document updated successfully',
        data: document,
      });
    } catch (error: any) {
      console.error('Error updating document:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to update document',
      });
    }
  },

  // Delete a document
  async deleteDocument(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await documentService.deleteDocument(id);

      return res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    } catch (error: any) {
      console.error('Error deleting document:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete document',
      });
    }
  },

  // Replace document file
  async replaceDocumentFile(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'File is required',
        });
      }

      const file = req.file as any;

      const document = await documentService.replaceDocumentFile(
        id,
        file.path,
        file.filename,
        file.size,
        file.mimetype
      );

      return res.status(200).json({
        success: true,
        message: 'Document file replaced successfully',
        data: document,
      });
    } catch (error: any) {
      console.error('Error replacing document file:', error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Failed to replace document file',
      });
    }
  },
};
