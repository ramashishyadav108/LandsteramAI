import { api } from './api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface Document {
  id: string;
  leadId: string;
  documentName: string;
  documentType: string;
  fileUrl: string;
  filePublicId: string;
  fileSize?: number;
  mimeType?: string;
  status: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface UploadDocumentData {
  leadId: string;
  documentName: string;
  documentType: string;
  file: File;
}

export interface UpdateDocumentData {
  documentName?: string;
  documentType?: string;
  status?: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED';
}

export interface DocumentStats {
  totalDocuments: number;
  completedDocuments: number;
  missingDocuments: number;
  actionRequiredCount: number;
  aiExtractedCount: number;
  reUploadRequiredCount: number;
  pendingExtractions: number;
}

class DocumentService {
  /**
   * Upload a new document
   */
  async uploadDocument(data: UploadDocumentData): Promise<Document> {
    const formData = new FormData();
    formData.append('leadId', data.leadId);
    formData.append('documentName', data.documentName);
    formData.append('documentType', data.documentType);
    formData.append('file', data.file);

    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload document');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get all documents for a lead
   */
  async getDocumentsByLeadId(leadId: string): Promise<Document[]> {
    const response = await api.get<Document[]>(`/api/documents/lead/${leadId}`);
    return response.data || [];
  }

  /**
   * Get a document by ID
   */
  async getDocumentById(id: string): Promise<Document> {
    const response = await api.get<Document>(`/api/documents/${id}`);
    if (!response.data) {
      throw new Error('Document not found');
    }
    return response.data;
  }

  /**
   * Update document metadata
   */
  async updateDocument(id: string, data: UpdateDocumentData): Promise<Document> {
    const response = await api.patch<Document>(`/api/documents/${id}`, data);
    if (!response.data) {
      throw new Error('Failed to update document');
    }
    return response.data;
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string): Promise<void> {
    await api.delete(`/api/documents/${id}`);
  }

  /**
   * Replace document file
   */
  async replaceDocumentFile(id: string, file: File): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');

    const response = await fetch(`${API_BASE_URL}/api/documents/${id}/file`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to replace document file');
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get document statistics for a lead
   */
  async getDocumentStats(leadId: string): Promise<DocumentStats> {
    const response = await api.get<DocumentStats>(`/api/documents/lead/${leadId}/stats`);
    return response.data || {
      totalDocuments: 0,
      completedDocuments: 0,
      missingDocuments: 0,
      actionRequiredCount: 0,
      aiExtractedCount: 0,
      reUploadRequiredCount: 0,
      pendingExtractions: 0,
    };
  }

  /**
   * Trigger AI extraction for a document
   */
  async triggerAIExtraction(documentId: string): Promise<any> {
    const response = await api.post<any>(`/api/documents/${documentId}/extract`, {});
    return response.data;
  }

  /**
   * Request missing documents from customer
   */
  async requestMissingDocuments(leadId: string): Promise<void> {
    await api.post<void>(`/api/documents/lead/${leadId}/request-missing`, {});
  }

  /**
   * Share documents with customer
   */
  async shareWithCustomer(leadId: string, documentIds: string[]): Promise<void> {
    await api.post<void>(`/api/documents/lead/${leadId}/share`, { documentIds });
  }

  /**
   * Download a document
   */
  async downloadDocument(documentId: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document-${documentId}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();
