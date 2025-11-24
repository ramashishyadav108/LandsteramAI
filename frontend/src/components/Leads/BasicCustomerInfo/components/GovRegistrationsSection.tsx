import React from 'react';
import { FormData, ApplicantType } from '../types';
import '../styles/BasicCustomerInfo.css';

interface GovRegistrationsSectionProps {
  applicantType: ApplicantType;
  formData: FormData;
  onInputChange: (section: string, field: string, value: string) => void;
}

const GovRegistrationsSection: React.FC<GovRegistrationsSectionProps> = ({
  applicantType,
  formData,
  onInputChange
}) => {
  return (
    <>
      <h3 className="section-title">
        Government Registrations
        <span className="info-icon" data-tooltip="Tax IDs and government-issued registration numbers">ⓘ</span>
      </h3>
      <div className="form-grid">
        {applicantType === 'Individual' ? (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="PAN Number *"
                className="form-input"
                value={formData.govRegistrations.pan}
                onChange={(e) => onInputChange('govRegistrations', 'pan', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Aadhaar Number *"
                className="form-input"
                value={formData.govRegistrations.aadhaar}
                onChange={(e) => onInputChange('govRegistrations', 'aadhaar', e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <input
                type="text"
                placeholder="Business PAN *"
                className="form-input"
                value={formData.govRegistrations.businessPan}
                onChange={(e) => onInputChange('govRegistrations', 'businessPan', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="GSTIN"
                className="form-input"
                value={formData.govRegistrations.gstin}
                onChange={(e) => onInputChange('govRegistrations', 'gstin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="CIN / LLPIN"
                className="form-input"
                value={formData.govRegistrations.cin}
                onChange={(e) => onInputChange('govRegistrations', 'cin', e.target.value)}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Udyam Number"
                className="form-input"
                value={formData.govRegistrations.udyam}
                onChange={(e) => onInputChange('govRegistrations', 'udyam', e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default GovRegistrationsSection;
