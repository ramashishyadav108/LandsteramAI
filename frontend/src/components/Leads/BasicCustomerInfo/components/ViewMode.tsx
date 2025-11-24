import React from 'react';
import { FormData, ApplicantType, OwnershipDirector } from '../types';
import '../styles/BasicCustomerInfo.css';

interface ViewModeProps {
  formData: FormData;
  applicantType: ApplicantType;
  ownershipDirectors: OwnershipDirector[];
  onEdit: () => void;
}

const ViewMode: React.FC<ViewModeProps> = ({
  formData,
  applicantType,
  ownershipDirectors,
  onEdit
}) => {
  return (
    <div className="basic-customer-info">
      <div className="form-container">
        {/* Header with Edit Button */}
        <div className="view-header">
          <h2 className="view-title">Customer Basic Information</h2>
          <button className="edit-button" onClick={onEdit}>
            Edit Details
          </button>
        </div>

        {/* Lead & Entity Information */}
        <div className="view-section">
          <h3 className="view-section-title">
            Lead & Entity Information
          </h3>
          <div className="view-grid">
            <div>
              <div className="view-label">Applicant Type</div>
              <div className="view-value">{applicantType}</div>
            </div>
            <div>
              <div className="view-label">
                {applicantType === 'Individual' ? 'Full Name' : 'Business Name'}
              </div>
              <div className="view-value">{formData.leadEntity.name || '-'}</div>
            </div>
            <div>
              <div className="view-label">Entity Type</div>
              <div className="view-value">{formData.leadEntity.entityType || '-'}</div>
            </div>
            <div>
              <div className="view-label">Industry</div>
              <div className="view-value">{formData.leadEntity.industry || '-'}</div>
            </div>
            <div>
              <div className="view-label">Country</div>
              <div className="view-value">{formData.leadEntity.country || '-'}</div>
            </div>
          </div>
        </div>

        {/* Government Registrations */}
        <div className="view-section">
          <h3 className="view-section-title">
            Government Registrations
          </h3>
          <div className="view-grid">
            {applicantType === 'Individual' ? (
              <>
                <div>
                  <div className="view-label">PAN Number</div>
                  <div className="view-value">{formData.govRegistrations.pan || '-'}</div>
                </div>
                <div>
                  <div className="view-label">Aadhaar Number</div>
                  <div className="view-value">{formData.govRegistrations.aadhaar || '-'}</div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="view-label">Business PAN</div>
                  <div className="view-value">{formData.govRegistrations.businessPan || '-'}</div>
                </div>
                <div>
                  <div className="view-label">GSTIN</div>
                  <div className="view-value">{formData.govRegistrations.gstin || '-'}</div>
                </div>
                <div>
                  <div className="view-label">CIN / LLPIN</div>
                  <div className="view-value">{formData.govRegistrations.cin || '-'}</div>
                </div>
                <div>
                  <div className="view-label">Udyam Number</div>
                  <div className="view-value">{formData.govRegistrations.udyam || '-'}</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div className="view-section">
          <h3 className="view-section-title">
            Contact Details
          </h3>
          <div className="view-grid">
            <div>
              <div className="view-label">Contact Person</div>
              <div className="view-value">{formData.contactDetails.contactPerson || '-'}</div>
            </div>
            <div>
              <div className="view-label">Mobile Number</div>
              <div className="view-value">{formData.contactDetails.phoneNumber || '-'}</div>
            </div>
            <div>
              <div className="view-label">Email Address</div>
              <div className="view-value">{formData.contactDetails.email || '-'}</div>
            </div>
          </div>
        </div>

        {/* Key Person Details (for Business) */}
        {applicantType === 'Business' && (
          <div className="view-section">
            <h3 className="view-section-title">
              Key Person Details
            </h3>
            <div className="view-grid">
              <div>
                <div className="view-label">Authorized Person PAN</div>
                <div className="view-value">{formData.keyPerson.pan || '-'}</div>
              </div>
              <div>
                <div className="view-label">Authorized Person DOB</div>
                <div className="view-value">{formData.keyPerson.dob || '-'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Addresses */}
        <div className="view-section">
          <h3 className="view-section-title">
            Addresses
          </h3>
          <div className="view-grid">
            <div>
              <div className="view-label">
                {applicantType === 'Individual' ? 'Address' : 'Registered Address'}
              </div>
              <div className="view-value">
                {applicantType === 'Individual' ? formData.addresses.address || '-' : formData.addresses.registeredAddress || '-'}
              </div>
            </div>
            <div>
              <div className="view-label">City</div>
              <div className="view-value">{formData.addresses.city || '-'}</div>
            </div>
            <div>
              <div className="view-label">State</div>
              <div className="view-value">{formData.addresses.state || '-'}</div>
            </div>
            <div>
              <div className="view-label">Pincode</div>
              <div className="view-value">{formData.addresses.pincode || '-'}</div>
            </div>
          </div>
        </div>

        {/* Ownership/Directors */}
        {ownershipDirectors.length > 0 && (
          <div className="view-section">
            <h3 className="view-section-title">
              Ownership/Directors
            </h3>
            {ownershipDirectors.map((director) => (
              <div key={director.id} className="director-card">
                <div className="view-grid">
                  <div>
                    <div className="view-label">Name</div>
                    <div className="view-value">{director.name || '-'}</div>
                  </div>
                  <div>
                    <div className="view-label">PAN</div>
                    <div className="view-value">{director.pan || '-'}</div>
                  </div>
                  <div>
                    <div className="view-label">DOB</div>
                    <div className="view-value">{director.dob || '-'}</div>
                  </div>
                  <div>
                    <div className="view-label">Designation</div>
                    <div className="view-value">{director.designation || '-'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewMode;
