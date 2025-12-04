import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { documentService, DocumentStats } from '../../services/document.service';

// Import icons
import trashIcon from '../../assets/ApplicationManager/trash-01.png';
import filterIcon from '../../assets/ApplicationManager/filter-lines.png';
import exportIcon from '../../assets/ApplicationManager/download-cloud-02.png';
import aiIcon from '../../assets/ApplicationManager/mark.png';
import plusIcon from '../../assets/ApplicationManager/plus.png';
import arrowDownIcon from '../../assets/ApplicationManager/arrow-down.png';

type DocumentStatus = 'SUBMITTED' | 'NOT_REVIEWED' | 'MISSING' | 'RE_UPLOAD_REQUIRED';

interface DocumentDisplay {
  id: string;
  name: string;
  type: string;
  aiExtracted: string;
  lastUpdated: string;
  status: DocumentStatus;
}

interface DocumentsTabProps {
  leadId: string;
}

export const DocumentsTab: React.FC<DocumentsTabProps> = ({ leadId }) => {
  const { theme } = useTheme();
  const [documents, setDocuments] = useState<DocumentDisplay[]>([]);
  const [stats, setStats] = useState<DocumentStats>({
    totalDocuments: 0,
    completedDocuments: 0,
    missingDocuments: 0,
    actionRequiredCount: 0,
    aiExtractedCount: 0,
    reUploadRequiredCount: 0,
    pendingExtractions: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [selectedDocuments, setSelectedDocuments] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (leadId) {
      fetchDocuments();
      fetchStats();
    }
  }, [leadId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getDocumentsByLeadId(leadId);

      // Map the backend document structure to our display structure
      const mappedDocs: DocumentDisplay[] = response.map(doc => ({
        id: doc.id,
        name: doc.documentName,
        type: doc.documentType,
        aiExtracted: doc.status === 'ACTIVE' ? 'Yes' : 'Pending',
        lastUpdated: formatDate(doc.uploadedAt),
        status: mapBackendStatusToDisplay(doc.status),
      }));

      setDocuments(mappedDocs);

      // Calculate stats from the fetched documents
      calculateStatsFromFetchedDocuments(mappedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      // Fall back to mock data if API fails
      loadMockDocuments();
    } finally {
      setLoading(false);
    }
  };

  const calculateStatsFromFetchedDocuments = (docs: DocumentDisplay[]) => {
    const totalDocuments = docs.length;
    const completedDocuments = docs.filter(doc => doc.status === 'SUBMITTED').length;
    const missingDocuments = docs.filter(doc => doc.status === 'MISSING').length;
    const reUploadRequiredCount = docs.filter(doc => doc.status === 'RE_UPLOAD_REQUIRED').length;
    const aiExtractedCount = docs.filter(doc => doc.aiExtracted === 'Yes').length;
    const pendingExtractions = docs.filter(doc => doc.aiExtracted === 'Pending').length;

    setStats({
      totalDocuments,
      completedDocuments,
      missingDocuments,
      actionRequiredCount: missingDocuments,
      aiExtractedCount,
      reUploadRequiredCount,
      pendingExtractions,
    });
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const statsData = await documentService.getDocumentStats(leadId);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching document stats:', error);
      // Calculate stats from documents if API fails
      calculateStatsFromDocuments();
    } finally {
      setStatsLoading(false);
    }
  };

  const calculateStatsFromDocuments = () => {
    const totalDocuments = documents.length;
    const completedDocuments = documents.filter(doc => doc.status === 'SUBMITTED').length;
    const missingDocuments = documents.filter(doc => doc.status === 'MISSING').length;
    const reUploadRequiredCount = documents.filter(doc => doc.status === 'RE_UPLOAD_REQUIRED').length;
    const aiExtractedCount = documents.filter(doc => doc.aiExtracted === 'Yes').length;
    const pendingExtractions = documents.filter(doc => doc.aiExtracted === 'Pending').length;

    setStats({
      totalDocuments,
      completedDocuments,
      missingDocuments,
      actionRequiredCount: missingDocuments,
      aiExtractedCount,
      reUploadRequiredCount,
      pendingExtractions,
    });
  };

  const mapBackendStatusToDisplay = (status: string): DocumentStatus => {
    switch (status) {
      case 'ACTIVE':
        return 'SUBMITTED';
      case 'PENDING':
        return 'NOT_REVIEWED';
      case 'REJECTED':
        return 'RE_UPLOAD_REQUIRED';
      case 'INACTIVE':
        return 'MISSING';
      default:
        return 'NOT_REVIEWED';
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const loadMockDocuments = () => {
    const mockDocuments: DocumentDisplay[] = [
      { id: '1', name: 'Aadhar Card', type: 'Identity Proof', aiExtracted: 'Yes', lastUpdated: 'Nov 25, 2024', status: 'SUBMITTED' },
      { id: '2', name: 'PAN Card', type: 'Tax Document', aiExtracted: 'Yes', lastUpdated: 'Nov 25, 2024', status: 'SUBMITTED' },
      { id: '3', name: 'Bank Statement', type: 'Financial', aiExtracted: 'Yes', lastUpdated: 'Nov 24, 2024', status: 'SUBMITTED' },
      { id: '4', name: 'GST Certificate', type: 'Tax Document', aiExtracted: 'No', lastUpdated: 'Nov 23, 2024', status: 'NOT_REVIEWED' },
      { id: '5', name: 'ITR FY23', type: 'Tax Document', aiExtracted: 'No', lastUpdated: 'Nov 23, 2024', status: 'NOT_REVIEWED' },
      { id: '6', name: 'Audited Financials FY23', type: 'Financial', aiExtracted: 'Pending', lastUpdated: 'Nov 22, 2024', status: 'MISSING' },
      { id: '7', name: 'Company Registration', type: 'Legal', aiExtracted: 'Pending', lastUpdated: 'Nov 22, 2024', status: 'MISSING' },
      { id: '8', name: 'MOA & AOA', type: 'Legal', aiExtracted: 'Yes', lastUpdated: 'Nov 25, 2024', status: 'SUBMITTED' },
      { id: '9', name: 'Board Resolution', type: 'Legal', aiExtracted: 'Yes', lastUpdated: 'Nov 25, 2024', status: 'SUBMITTED' },
      { id: '10', name: 'Property Documents', type: 'Collateral', aiExtracted: 'No', lastUpdated: 'Nov 20, 2024', status: 'RE_UPLOAD_REQUIRED' },
      { id: '11', name: 'Valuation Report', type: 'Collateral', aiExtracted: 'No', lastUpdated: 'Nov 20, 2024', status: 'RE_UPLOAD_REQUIRED' },
      { id: '12', name: 'Trade License', type: 'Legal', aiExtracted: 'Pending', lastUpdated: 'Nov 19, 2024', status: 'MISSING' },
      { id: '13', name: 'Form 16', type: 'Tax Document', aiExtracted: 'Pending', lastUpdated: 'Nov 19, 2024', status: 'MISSING' },
    ];
    setDocuments(mockDocuments);
    // Calculate stats from mock documents
    calculateStatsFromFetchedDocuments(mockDocuments);
  };

  const toggleDocumentSelection = (docId: string) => {
    const newSelection = new Set(selectedDocuments);
    if (newSelection.has(docId)) {
      newSelection.delete(docId);
    } else {
      newSelection.add(docId);
    }
    setSelectedDocuments(newSelection);
  };

  const toggleAllDocuments = () => {
    if (selectedDocuments.size === documents.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(doc => doc.id)));
    }
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal ${theme === 'dark' ? 'bg-green-900/30 text-green-400' : 'bg-[#ECFDF5] text-[#14BA6D]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-[#14BA6D]'} mr-2`}></span>
            Submitted
          </span>
        );
      case 'NOT_REVIEWED':
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal ${theme === 'dark' ? 'bg-blue-900/30 text-blue-400' : 'bg-[#EEF4FF] text-[#3538CD]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-[#3538CD]'} mr-2`}></span>
            Not Reviewed
          </span>
        );
      case 'MISSING':
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal ${theme === 'dark' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-[#FFFAEB] text-[#B54708]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-yellow-400' : 'bg-[#B54708]'} mr-2`}></span>
            Missing
          </span>
        );
      case 'RE_UPLOAD_REQUIRED':
        return (
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-normal ${theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-[#FEF3F2] text-[#B42318]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-red-400' : 'bg-[#B42318]'} mr-2`}></span>
            Re-upload required
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className={`text-xl ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
          Loading documents...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        {/* Total Documents Card */}
        <div className={`relative rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]'}`}>
          <p className={`text-base font-normal mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            Total Documents
          </p>
          <p className={`text-2xl font-normal leading-[150%] mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {stats.totalDocuments}
          </p>
          <div className={`inline-flex items-center px-3 py-1 rounded-3xl ${theme === 'dark' ? 'bg-green-900/30' : 'bg-[#ECFDF5]'} shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]`}>
            <span className={`text-xs font-normal leading-[150%] ${theme === 'dark' ? 'text-green-400' : 'text-[#14BA6D]'}`}>Complete</span>
          </div>
        </div>

        {/* Missing Documents Card */}
        <div className={`relative rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]'}`}>
          <p className={`text-base font-normal mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            Missing Documents
          </p>
          <p className={`text-2xl font-normal leading-[150%] mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {stats.missingDocuments}
          </p>
          <div className={`inline-flex items-center px-3 py-1 rounded-3xl ${theme === 'dark' ? 'bg-yellow-900/30' : 'bg-[#FFFAEB]'} shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]`}>
            <span className={`text-xs font-normal leading-[150%] ${theme === 'dark' ? 'text-yellow-400' : 'text-[#B54708]'}`}>Action Required</span>
          </div>
        </div>

        {/* AI Extracted Card */}
        <div className={`relative rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]'}`}>
          <p className={`text-base font-normal mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            AI Extracted
          </p>
          <p className={`text-2xl font-normal leading-[150%] mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {stats.aiExtractedCount}
          </p>
          <div className={`text-xs font-normal leading-[150%] ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            {stats.pendingExtractions} Pending Extractions
          </div>
        </div>

        {/* Re-upload Required Card */}
        <div className={`relative rounded-3xl p-6 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]'}`}>
          <p className={`text-base font-normal mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-[#898DA3]'}`}>
            Re-upload Required
          </p>
          <p className={`text-2xl font-normal leading-[150%] mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-black'}`}>
            {stats.reUploadRequiredCount}
          </p>
          <div className={`inline-flex items-center px-3 py-1 rounded-3xl ${theme === 'dark' ? 'bg-red-900/30' : 'bg-[#FEF3F2]'} shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]`}>
            <span className={`text-xs font-normal leading-[150%] ${theme === 'dark' ? 'text-red-400' : 'text-[#B42318]'}`}>Quality Issue</span>
          </div>
        </div>
      </div>

      {/* Document List Table */}
      <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-gray-800 shadow-xl' : 'bg-white shadow-[0px_8.81199px_24.9673px_-7.34333px_rgba(58,77,233,0.15)]'}`}>
        {/* Table Header - Card header */}
        <div className="flex flex-row items-center justify-between pb-4 mb-1">
          {/* Text */}
          <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-[#101828]'}`}>
            Mandatory Document List
          </h3>

          {/* Actions */}
          <div className="flex flex-row items-center gap-2">
            {/* Delete Button */}
            <button
              className={`flex flex-row justify-center items-center rounded-lg border px-4 py-2 gap-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <img src={trashIcon} alt="Delete" className="w-4 h-4" />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-[#344054]'}`}>Delete</span>
            </button>

            {/* Filters Button */}
            <button
              className={`flex flex-row justify-center items-center rounded-lg border px-4 py-2 gap-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <img src={filterIcon} alt="Filters" className="w-4 h-4" />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-[#344054]'}`}>Filters</span>
            </button>

            {/* Export Button */}
            <button
              className={`flex flex-row justify-center items-center rounded-lg border px-4 py-3 gap-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <img src={exportIcon} alt="Export" className="w-4 h-4" />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-[#344054]'}`}>Export</span>
            </button>

            {/* Share with customer Button */}
            <button
              className={`flex flex-row justify-center items-center rounded-lg border-2 border-[#14BA6D] px-4 py-3 gap-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-white hover:bg-green-50'
              }`}
            >
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-[#14BA6D]'}`}>Share with customer</span>
            </button>

            {/* Trigger AI Extraction Button */}
            <button
              className={`flex flex-row justify-center items-center rounded-lg border-2 border-[#14BA6D] px-4 py-3 gap-2 transition-colors ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-white hover:bg-green-50'
              }`}
            >
              <img src={aiIcon} alt="AI Extraction" className="w-4 h-4" />
              <span className={`text-xs font-medium ${theme === 'dark' ? 'text-green-400' : 'text-[#14BA6D]'}`}>Trigger AI Extraction</span>
            </button>

            {/* Request Missing Docs Button */}
            <button
              className="flex flex-row justify-center items-center bg-[#14BA6D] rounded-lg px-4 py-3 gap-2 hover:bg-[#12a860] transition-colors"
            >
              <img src={plusIcon} alt="Request" className="w-4 h-4" />
              <span className="text-xs font-medium text-white">Request Missing Docs</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className={`overflow-x-auto mt-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
          <table className="w-full">
            <thead>
              <tr className={`border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-[#EAECF0]'}`}>
                <th className="text-left py-3 px-4">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.size === documents.length}
                    onChange={toggleAllDocuments}
                    className={`w-4 h-4 rounded text-[#14BA6D] focus:ring-[#14BA6D] ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                  />
                </th>
                <th className={`text-left py-3 px-4 text-xs font-medium uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                  <div className="flex items-center gap-1">
                    Document Name
                    <img src={arrowDownIcon} alt="Sort" className={`w-3 h-3 ${theme === 'dark' ? 'opacity-70' : ''}`} />
                  </div>
                </th>
                <th className={`text-left py-3 px-4 text-xs font-medium uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                  <div className="flex items-center gap-1">
                    Document Type
                    <img src={arrowDownIcon} alt="Sort" className={`w-3 h-3 ${theme === 'dark' ? 'opacity-70' : ''}`} />
                  </div>
                </th>
                <th className={`text-left py-3 px-4 text-xs font-medium uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                  <div className="flex items-center gap-1">
                    AI Extracted
                    <img src={arrowDownIcon} alt="Sort" className={`w-3 h-3 ${theme === 'dark' ? 'opacity-70' : ''}`} />
                  </div>
                </th>
                <th className={`text-left py-3 px-4 text-xs font-medium uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                  <div className="flex items-center gap-1">
                    Last Updated
                    <img src={arrowDownIcon} alt="Sort" className={`w-3 h-3 ${theme === 'dark' ? 'opacity-70' : ''}`} />
                  </div>
                </th>
                <th className={`text-left py-3 px-4 text-xs font-medium uppercase ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                  <div className="flex items-center gap-1">
                    Status Badge
                    <img src={arrowDownIcon} alt="Sort" className={`w-3 h-3 ${theme === 'dark' ? 'opacity-70' : ''}`} />
                  </div>
                </th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  style={theme === 'dark' ? { backgroundColor: '#1f2937' } : {}}
                  className={`border-b transition-colors ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'bg-white border-[#EAECF0] hover:bg-gray-50'}`}
                >
                  <td className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.has(doc.id)}
                      onChange={() => toggleDocumentSelection(doc.id)}
                      className={`w-4 h-4 rounded text-[#14BA6D] focus:ring-[#14BA6D] ${theme === 'dark' ? 'border-gray-600 bg-gray-700' : 'border-gray-300'}`}
                    />
                  </td>
                  <td className={`py-4 px-4 text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-[#101828]'}`}>
                    {doc.name}
                  </td>
                  <td className={`py-4 px-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    {doc.type}
                  </td>
                  <td className={`py-4 px-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    {doc.aiExtracted}
                  </td>
                  <td className={`py-4 px-4 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-[#667085]'}`}>
                    {doc.lastUpdated}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(doc.status)}
                  </td>
                  <td className="py-4 px-4">
                    <button className={`p-1 rounded transition-colors ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={theme === 'dark' ? '#9CA3AF' : '#667085'} strokeWidth="1.5">
                        <circle cx="10" cy="10" r="1" fill="currentColor" />
                        <circle cx="10" cy="5" r="1" fill="currentColor" />
                        <circle cx="10" cy="15" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
