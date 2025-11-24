import { useState, useEffect } from 'react';
import { FormData, ApplicantType, OwnershipDirector } from '../types';
import { customerService } from '../../../../services/customer.service';

const initialFormData: FormData = {
  leadEntity: { name: '', entityType: '', industry: '', country: '' },
  govRegistrations: { pan: '', aadhaar: '', businessPan: '', gstin: '', cin: '', udyam: '' },
  contactDetails: { contactPerson: '', phoneNumber: '', email: '' },
  keyPerson: { pan: '', dob: '' },
  addresses: { address: '', registeredAddress: '', city: '', state: '', pincode: '' }
};

export const useBasicCustomerInfo = (leadId?: string) => {
  const [applicantType, setApplicantType] = useState<ApplicantType>('Individual');
  const [ownershipDirectors, setOwnershipDirectors] = useState<OwnershipDirector[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [viewMode, setViewMode] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    const loadExistingData = async () => {
      if (!leadId) return;

      try {
        setLoadingData(true);
        console.log('Loading existing data for leadId:', leadId);
        const response = await customerService.getBasicInfo(leadId);

        if (response.success && response.data) {
          const data = response.data;
          console.log('Loaded existing data:', data);

          // Set applicant type
          setApplicantType(data.applicantType === 'INDIVIDUAL' ? 'Individual' : 'Business');

          // Set form data
          setFormData({
            leadEntity: {
              name: data.name || '',
              entityType: data.entityType || '',
              industry: data.industry || '',
              country: data.country || ''
            },
            govRegistrations: {
              pan: data.pan || '',
              aadhaar: data.aadhaar || '',
              businessPan: data.businessPan || '',
              gstin: data.gstin || '',
              cin: data.cin || '',
              udyam: data.udyam || ''
            },
            contactDetails: {
              contactPerson: data.contactPerson || '',
              phoneNumber: data.phoneNumber || '',
              email: data.email || ''
            },
            keyPerson: {
              pan: data.keyPersonPan || '',
              dob: data.keyPersonDob ? new Date(data.keyPersonDob).toISOString().split('T')[0] : ''
            },
            addresses: {
              address: data.address || '',
              registeredAddress: data.registeredAddress || '',
              city: data.city || '',
              state: data.state || '',
              pincode: data.pincode || ''
            }
          });

          // Set ownership directors if they exist
          if (data.ownershipDirectors && Array.isArray(data.ownershipDirectors)) {
            setOwnershipDirectors(
              data.ownershipDirectors.map((director: any) => ({
                id: director.id || Date.now().toString(),
                name: director.name || '',
                pan: director.pan || '',
                dob: director.dob ? new Date(director.dob).toISOString().split('T')[0] : '',
                designation: director.designation || ''
              }))
            );
          }

          // Mark that we have existing data and switch to view mode
          setHasExistingData(true);
          setViewMode(true);
        }
      } catch (err: any) {
        // If no data exists yet (404), that's okay - it's a new record
        if (err.message && !err.message.includes('not found')) {
          console.error('Error loading existing data:', err);
        }
        setHasExistingData(false);
        setViewMode(false);
      } finally {
        setLoadingData(false);
      }
    };

    loadExistingData();
  }, [leadId]);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value
      }
    }));
  };

  const addOwnershipDirector = () => {
    const newDirector: OwnershipDirector = {
      id: Date.now().toString(),
      name: '',
      pan: '',
      dob: '',
      designation: ''
    };
    setOwnershipDirectors([...ownershipDirectors, newDirector]);
  };

  const handleDirectorChange = (index: number, field: keyof OwnershipDirector, value: string) => {
    const newDirectors = [...ownershipDirectors];
    newDirectors[index][field] = value;
    setOwnershipDirectors(newDirectors);
  };

  const handleClearData = () => {
    setOwnershipDirectors([]);
    setFormData(initialFormData);
    setError('');
    setSuccessMessage('');
  };

  return {
    applicantType,
    setApplicantType,
    ownershipDirectors,
    formData,
    loading,
    setLoading,
    loadingData,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    viewMode,
    setViewMode,
    hasExistingData,
    handleInputChange,
    addOwnershipDirector,
    handleDirectorChange,
    handleClearData
  };
};
