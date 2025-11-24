import React from 'react';
import { FormData } from '../types';
import '../styles/BasicCustomerInfo.css';

interface ContactDetailsSectionProps {
  formData: FormData;
  onInputChange: (section: string, field: string, value: string) => void;
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <>
      <h3 className="section-title">
        Contact Details
        <span className="info-icon" data-tooltip="Works for both individuals and companies">ⓘ</span>
      </h3>
      <div className="form-grid">
        <div className="form-group">
          <input
            type="text"
            placeholder="Contact Person Name *"
            className="form-input"
            value={formData.contactDetails.contactPerson}
            onChange={(e) => onInputChange('contactDetails', 'contactPerson', e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Mobile Number *"
            className="form-input"
            value={formData.contactDetails.phoneNumber}
            onChange={(e) => onInputChange('contactDetails', 'phoneNumber', e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address *"
            className="form-input"
            value={formData.contactDetails.email}
            onChange={(e) => onInputChange('contactDetails', 'email', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default ContactDetailsSection;
