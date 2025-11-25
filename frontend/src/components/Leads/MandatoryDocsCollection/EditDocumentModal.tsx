import React, { useState, useEffect } from 'react';
import './AddDocumentModal.css';
import { Document } from '../../../services/document.service';

interface EditDocumentModalProps {
  document: Document;
  onClose: () => void;
  onSubmit: (data: { documentName: string; documentType: string; file: File | null }) => void;
  isLoading?: boolean;
}

const DOCUMENT_TYPES = [
  'Aadhaar Card',
  'PAN Card',
  'GST Certificate',
  'Bank Statement',
  'Income Tax Returns',
  'Business Registration',
  'Address Proof',
  'Photograph',
  'Other',
];

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({ document, onClose, onSubmit, isLoading }) => {
  const [documentName, setDocumentName] = useState(document.documentName);
  const [documentType, setDocumentType] = useState(document.documentType);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setDocumentName(document.documentName);
    setDocumentType(document.documentType);
  }, [document]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!documentName.trim()) {
      newErrors.documentName = 'Document name is required';
    }

    if (!documentType) {
      newErrors.documentType = 'Document type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({ documentName, documentType, file });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrors({ ...errors, file: '' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setErrors({ ...errors, file: '' });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-document-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Document</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="documentName">
              Document Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="documentName"
              value={documentName}
              onChange={(e) => {
                setDocumentName(e.target.value);
                setErrors({ ...errors, documentName: '' });
              }}
              placeholder="Enter document name"
              className={errors.documentName ? 'error' : ''}
            />
            {errors.documentName && <span className="error-message">{errors.documentName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="documentType">
              Document Type <span className="required">*</span>
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={(e) => {
                setDocumentType(e.target.value);
                setErrors({ ...errors, documentType: '' });
              }}
              className={errors.documentType ? 'error' : ''}
            >
              <option value="">Select document type</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.documentType && <span className="error-message">{errors.documentType}</span>}
          </div>

          <div className="form-group">
            <label>
              Replace File <span style={{ color: '#6b7280', fontWeight: 'normal' }}>(Optional)</span>
            </label>
            <div
              className={`file-upload-area ${isDragging ? 'dragging' : ''} ${errors.file ? 'error' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <p className="upload-text">Drag and drop your file here, or</p>
                  <label htmlFor="fileInput" className="browse-btn">
                    Browse Files
                  </label>
                  <input
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                    style={{ display: 'none' }}
                  />
                  <p className="file-info">Leave empty to keep the current file</p>
                </>
              ) : (
                <div className="file-selected">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <div className="file-details">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{formatFileSize(file.size)}</p>
                  </div>
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={() => setFile(null)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {errors.file && <span className="error-message">{errors.file}</span>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDocumentModal;
