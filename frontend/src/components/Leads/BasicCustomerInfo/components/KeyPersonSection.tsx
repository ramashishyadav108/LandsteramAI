import React from 'react';
import { FormData, ApplicantType } from '../types';
import '../styles/BasicCustomerInfo.css';

interface KeyPersonSectionProps {
  applicantType: ApplicantType;
  formData: FormData;
  onInputChange: (section: string, field: string, value: string) => void;
}

const KeyPersonSection: React.FC<KeyPersonSectionProps> = ({
  applicantType,
  formData,
  onInputChange
}) => {
  if (applicantType !== 'Business') return null;

  return (
    <>
      <h3 className="section-title">
        Key Person Details
        <span className="info-icon" data-tooltip="Needed for credit + KYC of owners">ⓘ</span>
      </h3>
      <div className="form-grid">
        <div className="form-group">
          <input
            type="text"
            placeholder="Authorized Person PAN *"
            className="form-input"
            value={formData.keyPerson.pan}
            onChange={(e) => onInputChange('keyPerson', 'pan', e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Authorized Person DOB *"
            className="form-input"
            value={formData.keyPerson.dob}
            onFocus={(e) => e.target.type = 'date'}
            onBlur={(e) => {
              if (!e.target.value) {
                e.target.type = 'text';
              }
            }}
            onChange={(e) => onInputChange('keyPerson', 'dob', e.target.value)}
          />
        </div>
      </div>
    </>
  );
};

export default KeyPersonSection;
