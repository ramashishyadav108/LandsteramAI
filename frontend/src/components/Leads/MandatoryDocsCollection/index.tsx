import React, { useState } from 'react';
import './MandatoryDocsCollection.css';
import downloadCloudIcon from '../../../assets/download-cloud.png';
import filterLinesIcon from '../../../assets/filter-lines.png';
import trashIcon from '../../../assets/trash.png';

interface Document {
  id: number;
  documentName: string;
  documentType: string;
  uploadDate: string;
  status: 'active' | 'inactive';
}

interface MandatoryDocsCollectionProps {
  leadId?: string;
}

const MandatoryDocsCollection: React.FC<MandatoryDocsCollectionProps> = ({ }) => {
  const [documents] = useState<Document[]>([
    { id: 1, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 2, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 3, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'inactive' },
    { id: 4, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 5, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'inactive' },
    { id: 6, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 7, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 8, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'inactive' },
    { id: 9, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 10, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 11, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'inactive' },
    { id: 12, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'active' },
    { id: 13, documentName: 'Bold text column', documentType: 'Regular text column', uploadDate: 'Regular text column', status: 'inactive' },
  ]);

  const handleDelete = () => {
    console.log('Delete documents');
  };

  const handleExport = () => {
    console.log('Export documents');
  };

  const handleShareWithCustomer = () => {
    console.log('Share with customer');
  };

  const handleAddNewDocument = () => {
    console.log('Add new document');
  };

  const handleUpload = (id: number) => {
    console.log('Upload document:', id);
  };

  const handlePreview = (id: number) => {
    console.log('Preview document:', id);
  };

  const handleSort = (column: string) => {
    console.log('Sort by:', column);
  };

  return (
    <div className="mandatory-docs-container">
      <div className="docs-header">
        <h2 className="docs-title">Mandatory Document List</h2>
        <div className="docs-actions">
          <button
            className="docs-action-btn delete-btn"
            onClick={handleDelete}
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
          <button className="docs-action-btn add-document-btn" onClick={handleAddNewDocument}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add New Document
          </button>
        </div>
      </div>

      <div className="docs-table-container">
        <table className="docs-table">
          <thead>
            <tr>
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
              <th className="sortable-header" onClick={() => handleSort('column')}>
                <div className="header-content">
                  <span>Column heading</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </th>
              <th className="actions-col"></th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td className="document-name-col">{doc.documentName}</td>
                <td className="regular-text-col">{doc.documentType}</td>
                <td className="regular-text-col">{doc.uploadDate}</td>
                <td className="status-col">
                  <span className={`status-badge ${doc.status}`}>
                    <span className="status-dot"></span>
                    {doc.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="action-text-col">
                  {doc.status === 'active' ? (
                    <button className="action-link preview-link" onClick={() => handlePreview(doc.id)}>
                      <span>Preview</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  ) : (
                    <button className="action-link upload-link" onClick={() => handleUpload(doc.id)}>
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
                  <button className="menu-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="12" cy="5" r="1"></circle>
                      <circle cx="12" cy="19" r="1"></circle>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="docs-footer">
        <button className="move-to-application-btn">
          Move to Application
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MandatoryDocsCollection;
