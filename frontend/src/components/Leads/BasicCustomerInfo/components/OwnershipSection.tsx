import React from 'react';
import { OwnershipDirector } from '../types';
import addSquareIcon from '../../../../assets/Add_square_light.png';
import '../styles/BasicCustomerInfo.css';

interface OwnershipSectionProps {
  ownershipDirectors: OwnershipDirector[];
  onDirectorChange: (index: number, field: keyof OwnershipDirector, value: string) => void;
  onAddDirector: () => void;
}

const OwnershipSection: React.FC<OwnershipSectionProps> = ({
  ownershipDirectors,
  onDirectorChange,
  onAddDirector
}) => {
  return (
    <>
      <h3 className="section-title">
        Ownership
        <span className="info-icon" data-tooltip="For business loans and mandatory for sanctions screening">ⓘ</span>
      </h3>

      {ownershipDirectors.map((director, index) => (
        <div key={director.id} className="form-grid ownership-row">
          <div className="form-group">
            <input
              type="text"
              placeholder="Director / Partner / Owner Name *"
              className="form-input"
              value={director.name}
              onChange={(e) => onDirectorChange(index, 'name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Director/Owner PAN *"
              className="form-input"
              value={director.pan}
              onChange={(e) => onDirectorChange(index, 'pan', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Director/Owner DOB *"
              className="form-input"
              value={director.dob}
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = 'text';
                }
              }}
              onChange={(e) => onDirectorChange(index, 'dob', e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Designation *"
              className="form-input"
              value={director.designation}
              onChange={(e) => onDirectorChange(index, 'designation', e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="form-grid">
        <div className="form-group">
          <button className="add-person-btn" onClick={onAddDirector}>
            <img src={addSquareIcon} alt="Add" className="add-icon" />
            Add Director/Owner
          </button>
        </div>
      </div>
    </>
  );
};

export default OwnershipSection;
