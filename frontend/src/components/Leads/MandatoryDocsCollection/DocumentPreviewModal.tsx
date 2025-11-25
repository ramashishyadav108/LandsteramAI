import React, { useState } from 'react';
import './DocumentPreviewModal.css';

interface DocumentPreviewModalProps {
  document: {
    id: string;
    documentName: string;
    documentType: string;
    fileUrl: string;
    mimeType?: string;
    uploadedAt: string;
  };
  onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({ document, onClose }) => {
  const isImage = document.mimeType?.startsWith('image/');
  const isPDF = document.mimeType === 'application/pdf';
  const [viewerType, setViewerType] = useState<'direct' | 'google' | 'download'>('google');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    window.open(document.fileUrl, '_blank');
  };

  // For PDFs, use Google Docs Viewer for better compatibility
  const getPDFViewerUrl = (url: string) => {
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };

  const handlePDFError = () => {
    if (viewerType === 'direct') {
      // Try Google Docs Viewer as fallback
      setViewerType('google');
    } else if (viewerType === 'google') {
      // If Google viewer also fails, show download option
      setViewerType('download');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{document.documentName}</h2>
            <p className="document-meta">
              {document.documentType} • Uploaded on {formatDate(document.uploadedAt)}
            </p>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={handleDownload} title="Download">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
            <button className="icon-btn" onClick={onClose} title="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="modal-body preview-body">
          {isImage && (
            <div className="image-preview">
              <img src={document.fileUrl} alt={document.documentName} />
            </div>
          )}

          {isPDF && (
            <div className="pdf-preview">
              {viewerType === 'download' ? (
                <div className="file-preview-placeholder">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <p className="placeholder-text">Unable to preview PDF</p>
                  <p className="placeholder-subtext">Click the button below to download and view the document</p>
                  <button className="btn-primary" onClick={handleDownload}>
                    Download PDF
                  </button>
                </div>
              ) : (
                <iframe
                  key={viewerType}
                  src={viewerType === 'google' ? getPDFViewerUrl(document.fileUrl) : document.fileUrl}
                  title={document.documentName}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  onError={handlePDFError}
                />
              )}
            </div>
          )}

          {!isImage && !isPDF && (
            <div className="file-preview-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <p className="placeholder-text">Preview not available for this file type</p>
              <button className="btn-primary" onClick={handleDownload}>
                Download to View
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
