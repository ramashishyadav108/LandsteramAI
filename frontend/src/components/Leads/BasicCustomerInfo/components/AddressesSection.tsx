import React from 'react';
import { FormData, ApplicantType } from '../types';
import '../styles/BasicCustomerInfo.css';

interface AddressesSectionProps {
  applicantType: ApplicantType;
  formData: FormData;
  onInputChange: (section: string, field: string, value: string) => void;
}

const AddressesSection: React.FC<AddressesSectionProps> = ({
  applicantType,
  formData,
  onInputChange
}) => {
  return (
    <>
      <h3 className="section-title">Addresses</h3>
      {applicantType === 'Individual' ? (
        <div className="form-grid">
          <div className="form-group">
            <input
              type="text"
              placeholder="Address *"
              className="form-input"
              value={formData.addresses.address}
              onChange={(e) => onInputChange('addresses', 'address', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="City *"
              className="form-input"
              value={formData.addresses.city}
              onChange={(e) => onInputChange('addresses', 'city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="State *"
              className="form-input"
              value={formData.addresses.state}
              onChange={(e) => onInputChange('addresses', 'state', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Pincode *"
              className="form-input"
              value={formData.addresses.pincode}
              onChange={(e) => onInputChange('addresses', 'pincode', e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="form-grid">
          <div className="form-group">
            <input
              type="text"
              placeholder="Registered Address *"
              className="form-input"
              value={formData.addresses.registeredAddress}
              onChange={(e) => onInputChange('addresses', 'registeredAddress', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="City *"
              className="form-input"
              value={formData.addresses.city}
              onChange={(e) => onInputChange('addresses', 'city', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="State *"
              className="form-input"
              value={formData.addresses.state}
              onChange={(e) => onInputChange('addresses', 'state', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Pincode *"
              className="form-input"
              value={formData.addresses.pincode}
              onChange={(e) => onInputChange('addresses', 'pincode', e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AddressesSection;
