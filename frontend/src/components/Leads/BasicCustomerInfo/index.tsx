import React from 'react';
import { BasicCustomerInfoProps } from './types';
import { useBasicCustomerInfo } from './hooks';
import { validateForm } from './utils';
import {
  ViewMode,
  LeadEntitySection,
  GovRegistrationsSection,
  ContactDetailsSection,
  KeyPersonSection,
  AddressesSection,
  OwnershipSection
} from './components';
import { customerService } from '../../../services/customer.service';
import './styles/BasicCustomerInfo.css';

const BasicCustomerInfo: React.FC<BasicCustomerInfoProps> = ({ leadId }) => {
  const {
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
  } = useBasicCustomerInfo(leadId);

  const handleSaveBasicInformation = async () => {
    setError('');
    setSuccessMessage('');

    // Validate form
    const validationErrors = validateForm(formData, applicantType, ownershipDirectors);
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    try {
      setLoading(true);

      const dataToSave = {
        leadId: leadId!,
        applicantType: (applicantType === 'Individual' ? 'INDIVIDUAL' : 'BUSINESS') as 'INDIVIDUAL' | 'BUSINESS',

        // Lead Entity
        name: formData.leadEntity.name,
        entityType: formData.leadEntity.entityType,
        industry: formData.leadEntity.industry,
        country: formData.leadEntity.country || undefined,

        // Government Registrations
        ...(applicantType === 'Individual' ? {
          pan: formData.govRegistrations.pan || undefined,
          aadhaar: formData.govRegistrations.aadhaar || undefined,
        } : {
          businessPan: formData.govRegistrations.businessPan || undefined,
          gstin: formData.govRegistrations.gstin || undefined,
          cin: formData.govRegistrations.cin || undefined,
          udyam: formData.govRegistrations.udyam || undefined,
        }),

        // Contact Details
        contactPerson: formData.contactDetails.contactPerson || undefined,
        phoneNumber: formData.contactDetails.phoneNumber || undefined,
        email: formData.contactDetails.email || undefined,

        // Key Person (Business only)
        ...(applicantType === 'Business' && {
          keyPersonPan: formData.keyPerson.pan || undefined,
          keyPersonDob: formData.keyPerson.dob || undefined,
        }),

        // Addresses
        ...(applicantType === 'Individual' ? {
          address: formData.addresses.address || undefined,
        } : {
          registeredAddress: formData.addresses.registeredAddress || undefined,
        }),
        city: formData.addresses.city || undefined,
        state: formData.addresses.state || undefined,
        pincode: formData.addresses.pincode || undefined,

        // Ownership Directors
        ownershipDirectors: ownershipDirectors.length > 0 ? ownershipDirectors.map(director => ({
          name: director.name,
          pan: director.pan,
          dob: director.dob || undefined,
          designation: director.designation
        })) : undefined
      };

      console.log('Data to save:', JSON.stringify(dataToSave, null, 2));

      const response = await customerService.saveBasicInfo(dataToSave);

      console.log('Response:', response);

      if (response.success) {
        setSuccessMessage('Basic information saved successfully!');
        console.log('Saved data:', response.data);
        // Switch to view mode after successful save
        setViewMode(true);
      }
    } catch (err: any) {
      console.error('Error saving basic information:', err);

      let errorMessage = 'Failed to save basic information. Please try again.';

      if (err.errors && Array.isArray(err.errors)) {
        errorMessage = err.errors.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render view mode when data exists
  if (viewMode && hasExistingData) {
    return (
      <ViewMode
        formData={formData}
        applicantType={applicantType}
        ownershipDirectors={ownershipDirectors}
        onEdit={() => setViewMode(false)}
      />
    );
  }

  // Render edit/create form
  return (
    <div className="basic-customer-info">
      <div className="form-container">
        {loadingData && (
          <div style={{
            padding: '12px',
            backgroundColor: '#e3f2fd',
            color: '#1976d2',
            borderRadius: '4px',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Loading existing data...
          </div>
        )}

        <LeadEntitySection
          applicantType={applicantType}
          formData={formData}
          onApplicantTypeChange={setApplicantType}
          onInputChange={handleInputChange}
        />

        <GovRegistrationsSection
          applicantType={applicantType}
          formData={formData}
          onInputChange={handleInputChange}
        />

        <ContactDetailsSection
          formData={formData}
          onInputChange={handleInputChange}
        />

        <KeyPersonSection
          applicantType={applicantType}
          formData={formData}
          onInputChange={handleInputChange}
        />

        <AddressesSection
          applicantType={applicantType}
          formData={formData}
          onInputChange={handleInputChange}
        />

        <OwnershipSection
          ownershipDirectors={ownershipDirectors}
          onDirectorChange={handleDirectorChange}
          onAddDirector={addOwnershipDirector}
        />

        {/* Error and Success Messages */}
        {error && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#fee2e2',
            color: '#991b1b',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #fecaca'
          }}>
            <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>
              ⚠️ Please fix the following errors:
            </div>
            <ul style={{
              margin: '0',
              paddingLeft: '20px',
              fontSize: '13px',
              lineHeight: '1.6'
            }}>
              {error.split(', ').map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}
        {successMessage && (
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#d1fae5',
            color: '#065f46',
            borderRadius: '6px',
            marginBottom: '16px',
            border: '1px solid #a7f3d0',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            ✅ {successMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="form-actions">
          <button className="btn-clear" onClick={handleClearData} disabled={loading}>
            Clear Data
          </button>
          <button className="btn-save" onClick={handleSaveBasicInformation} disabled={loading}>
            {loading ? 'Saving...' : 'Save Basic Information'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicCustomerInfo;
