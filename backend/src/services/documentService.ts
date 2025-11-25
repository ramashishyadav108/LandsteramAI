import prisma from '../config/db.js';
import cloudinary from '../config/cloudinary.config.js';

export const documentService = {
  // Create a new document
  async createDocument(data: {
    leadId: string;
    documentName: string;
    documentType: string;
    fileUrl: string;
    filePublicId: string;
    fileSize?: number;
    mimeType?: string;
    uploadedBy: string;
    status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';
  }) {
    return await prisma.document.create({
      data: {
        ...data,
        status: data.status || 'ACTIVE',
      },
    });
  },

  // Get all documents for a lead
  async getDocumentsByLeadId(leadId: string) {
    return await prisma.document.findMany({
      where: { leadId },
      orderBy: { uploadedAt: 'desc' },
    });
  },

  // Get a document by ID
  async getDocumentById(id: string) {
    return await prisma.document.findUnique({
      where: { id },
    });
  },

  // Update a document
  async updateDocument(
    id: string,
    data: {
      documentName?: string;
      documentType?: string;
      status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';
    }
  ) {
    return await prisma.document.update({
      where: { id },
      data,
    });
  },

  // Delete a document (also removes from Cloudinary)
  async deleteDocument(id: string) {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(document.filePublicId, {
        resource_type: 'raw',
      });
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    return await prisma.document.delete({
      where: { id },
    });
  },

  // Update document status
  async updateDocumentStatus(
    id: string,
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED'
  ) {
    return await prisma.document.update({
      where: { id },
      data: { status },
    });
  },

  // Replace document file (upload new file and delete old one)
  async replaceDocumentFile(
    id: string,
    newFileUrl: string,
    newFilePublicId: string,
    newFileSize?: number,
    newMimeType?: string
  ) {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Delete old file from Cloudinary
    try {
      await cloudinary.uploader.destroy(document.filePublicId, {
        resource_type: 'raw',
      });
    } catch (error) {
      console.error('Error deleting old file from Cloudinary:', error);
    }

    // Update document with new file info
    return await prisma.document.update({
      where: { id },
      data: {
        fileUrl: newFileUrl,
        filePublicId: newFilePublicId,
        fileSize: newFileSize,
        mimeType: newMimeType,
        status: 'ACTIVE',
      },
    });
  },
};
