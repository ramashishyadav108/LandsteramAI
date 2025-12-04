import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MandatoryDocsCollection.css';
import downloadCloudIcon from '../../../assets/download-cloud.png';
import filterLinesIcon from '../../../assets/filter-lines.png';
import trashIcon from '../../../assets/trash.png';
import AddDocumentModal from './AddDocumentModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import EditDocumentModal from './EditDocumentModal';
import { documentService, Document } from '../../../services/document.service';

interface MandatoryDocsCollectionProps {
  leadId?: string;
}

const MandatoryDocsCollection: React.FC<MandatoryDocsCollectionProps> = ({ leadId }) => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedDocIds, setSelectedDocIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (leadId) {
      fetchDocuments();
    }
  }, [leadId]);

  const fetchDocuments = async () => {
    if (!leadId) return;

    try {
      setLoading(true);
      setError(null);
      const docs = await documentService.getDocumentsByLeadId(leadId);
      setDocuments(docs);
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDocument = async (data: { documentName: string; documentType: string; file: File | null }) => {
    if (!leadId || !data.file) return;

    try {
      setIsUploading(true);
      await documentService.uploadDocument({
        leadId,
        documentName: data.documentName,
        documentType: data.documentType,
        file: data.file,
      });
      setShowAddModal(false);
      fetchDocuments();
    } catch (err: any) {
      console.error('Error uploading document:', err);
      alert(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreview = (doc: Document) => {
    setSelectedDocument(doc);
    setShowPreviewModal(true);
    setActiveMenuId(null);
  };

  const handleEdit = (doc: Document) => {
    setSelectedDocument(doc);
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleUpdateDocument = async (data: { documentName: string; documentType: string; file: File | null }) => {
    if (!selectedDocument) return;

    try {
      setIsUploading(true);

      // If file is provided, replace the file
      if (data.file) {
        await documentService.replaceDocumentFile(selectedDocument.id, data.file);
      }

      // Update document metadata
      await documentService.updateDocument(selectedDocument.id, {
        documentName: data.documentName,
        documentType: data.documentType,
      });

      setShowEditModal(false);
      setSelectedDocument(null);
      fetchDocuments();
    } catch (err: any) {
      console.error('Error updating document:', err);
      alert(err.message || 'Failed to update document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await documentService.deleteDocument(docId);
      fetchDocuments();
      setActiveMenuId(null);
    } catch (err: any) {
      console.error('Error deleting document:', err);
      alert(err.message || 'Failed to delete document');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDocIds.size === 0) {
      alert('Please select documents to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedDocIds.size} document(s)?`)) {
      return;
    }

    try {
      await Promise.all(Array.from(selectedDocIds).map((id) => documentService.deleteDocument(id)));
      setSelectedDocIds(new Set());
      fetchDocuments();
    } catch (err: any) {
      console.error('Error deleting documents:', err);
      alert(err.message || 'Failed to delete documents');
    }
  };

  const handleUpload = (doc: Document) => {
    setSelectedDocument(doc);
    setShowEditModal(true);
    setActiveMenuId(null);
  };

  const handleExport = () => {
    console.log('Export documents');
    // TODO: Implement export functionality
  };

  const handleShareWithCustomer = () => {
    console.log('Share with customer');
    // TODO: Implement share functionality
  };

  const handleSort = (column: string) => {
    console.log('Sort by:', column);
    // TODO: Implement sorting
  };

  const toggleMenu = (docId: string) => {
    setActiveMenuId(activeMenuId === docId ? null : docId);
  };

  const toggleDocSelection = (docId: string) => {
    const newSelected = new Set(selectedDocIds);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocIds(newSelected);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="mandatory-docs-container">
        <div className="loading-state">Loading documents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mandatory-docs-container">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="mandatory-docs-container">
      <div className="docs-header">
        <h2 className="docs-title">Mandatory Document List</h2>
        <div className="docs-actions">
          <button
            className="docs-action-btn delete-btn"
            onClick={handleBulkDelete}
            disabled={selectedDocIds.size === 0}
          >
            <img src={trashIcon} alt="Delete" className="btn-icon" />
            Delete
          </button>
          <button className="docs-action-btn filters-btn" onClick={() => console.log('Filters')}>
            <img src={filterLinesIcon} alt="Filters" className="btn-icon" />
            Filters
          </button>
          <button className="docs-action-btn export-btn" onClick={handleExport}>
            <img src={downloadCloudIcon} alt="Export" className="btn-icon" />
            Export
          </button>
          <button className="docs-action-btn share-btn" onClick={handleShareWithCustomer}>
            Share with customer
          </button>
          <button className="docs-action-btn add-document-btn" onClick={() => setShowAddModal(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Document
          </button>
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h3>No documents yet</h3>
          <p>Start by adding your first document</p>
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            Add Document
          </button>
        </div>
      ) : (
        <div className="docs-table-container">
          <table className="docs-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedDocIds.size === documents.length && documents.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocIds(new Set(documents.map((d) => d.id)));
                      } else {
                        setSelectedDocIds(new Set());
                      }
                    }}
                  />
                </th>
                <th className="sortable-header" onClick={() => handleSort('documentName')}>
                  <div className="header-content">
                    <span>Document Name</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </th>
                <th className="sortable-header" onClick={() => handleSort('documentType')}>
                  <div className="header-content">
                    <span>Document Type</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </th>
                <th className="sortable-header" onClick={() => handleSort('uploadDate')}>
                  <div className="header-content">
                    <span>Upload Date</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </th>
                <th className="sortable-header" onClick={() => handleSort('status')}>
                  <div className="header-content">
                    <span>Status Badge</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </th>
                <th className="sortable-header">
                  <div className="header-content">
                    <span>Actions</span>
                  </div>
                </th>
                <th className="actions-col"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="checkbox-col">
                    <input
                      type="checkbox"
                      checked={selectedDocIds.has(doc.id)}
                      onChange={() => toggleDocSelection(doc.id)}
                    />
                  </td>
                  <td className="document-name-col">{doc.documentName}</td>
                  <td className="regular-text-col">{doc.documentType}</td>
                  <td className="regular-text-col">{formatDate(doc.uploadedAt)}</td>
                  <td className="status-col">
                    <span className={`status-badge ${doc.status.toLowerCase()}`}>
                      <span className="status-dot"></span>
                      {doc.status}
                    </span>
                  </td>
                  <td className="action-text-col">
                    {doc.status === 'ACTIVE' ? (
                      <button className="action-link preview-link" onClick={() => handlePreview(doc)}>
                        <span>Preview</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    ) : (
                      <button className="action-link upload-link" onClick={() => handleUpload(doc)}>
                        <span>Upload</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </button>
                    )}
                  </td>
                  <td className="menu-col">
                    <div className="menu-wrapper">
                      <button className="menu-btn" onClick={() => toggleMenu(doc.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="1"></circle>
                          <circle cx="12" cy="5" r="1"></circle>
                          <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                      </button>
                      {activeMenuId === doc.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => handleEdit(doc)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(doc.id)} className="delete-item">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="docs-footer">
        <button
          className="move-to-application-btn"
          onClick={() => {
            if (leadId) {
              navigate(`/application-management/${leadId}`);
            } else {
              alert('Lead ID is required to move to application management');
            }
          }}
        >
          Move to Application
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {showAddModal && (
        <AddDocumentModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddDocument}
          isLoading={isUploading}
        />
      )}

      {showPreviewModal && selectedDocument && (
        <DocumentPreviewModal document={selectedDocument} onClose={() => setShowPreviewModal(false)} />
      )}

      {showEditModal && selectedDocument && (
        <EditDocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowEditModal(false);
            setSelectedDocument(null);
          }}
          onSubmit={handleUpdateDocument}
          isLoading={isUploading}
        />
      )}
    </div>
  );
};

export default MandatoryDocsCollection;
