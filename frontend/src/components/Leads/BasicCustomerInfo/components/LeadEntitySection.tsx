import React from 'react';
import { FormData, ApplicantType } from '../types';
import '../styles/BasicCustomerInfo.css';

interface LeadEntitySectionProps {
  applicantType: ApplicantType;
  formData: FormData;
  onApplicantTypeChange: (type: ApplicantType) => void;
  onInputChange: (section: string, field: string, value: string) => void;
}

const LeadEntitySection: React.FC<LeadEntitySectionProps> = ({
  applicantType,
  formData,
  onApplicantTypeChange,
  onInputChange
}) => {
  return (
    <>
      <h3 className="section-title">
        Lead & Entity Information
        <span className="info-icon" data-tooltip="Identify whether it's a person or a company">ⓘ</span>
      </h3>
      <div className="form-grid">
        <div className="form-group">
          <select
            className="form-input"
            value={applicantType}
            onChange={(e) => onApplicantTypeChange(e.target.value as ApplicantType)}
          >
            <option value="Individual">Applicant Type: Individual *</option>
            <option value="Business">Applicant Type: Business *</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder={applicantType === 'Individual' ? 'Full Name *' : 'Business Name *'}
            className="form-input"
            value={formData.leadEntity.name}
            onChange={(e) => onInputChange('leadEntity', 'name', e.target.value)}
          />
        </div>
        <div className="form-group">
          <select
            className="form-input"
            value={formData.leadEntity.entityType}
            onChange={(e) => onInputChange('leadEntity', 'entityType', e.target.value)}
          >
            <option value="">Entity Type *</option>
            {applicantType === 'Individual' ? (
              <>
                <option value="Individual">Individual</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </>
            ) : (
              <>
                <option value="Private Limited Company">Private Limited Company</option>
                <option value="Public Limited Company">Public Limited Company</option>
                <option value="Limited Liability Partnership">Limited Liability Partnership</option>
                <option value="Partnership">Partnership</option>
                <option value="One Person Company">One Person Company</option>
                <option value="Hindu Undivided Family">Hindu Undivided Family</option>
                <option value="Trust">Trust</option>
                <option value="Society">Society</option>
                <option value="Association of Persons">Association of Persons</option>
              </>
            )}
          </select>
        </div>
        <div className="form-group">
          <select
            className="form-input"
            value={formData.leadEntity.industry}
            onChange={(e) => onInputChange('leadEntity', 'industry', e.target.value)}
          >
            <option value="">Industry *</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Retail">Retail</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Technology">Technology</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Education">Education</option>
            <option value="Finance">Finance</option>
            <option value="Hospitality">Hospitality</option>
            <option value="Transportation">Transportation</option>
            <option value="Construction">Construction</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <select
            className="form-input"
            value={formData.leadEntity.country}
            onChange={(e) => onInputChange('leadEntity', 'country', e.target.value)}
          >
            <option value="">Country *</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Canada">Canada</option>
            <option value="Australia">Australia</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default LeadEntitySection;
