import { FormData, ApplicantType, OwnershipDirector } from '../types';

export const validateForm = (
  formData: FormData,
  applicantType: ApplicantType,
  ownershipDirectors: OwnershipDirector[]
): string[] => {
  const errors: string[] = [];

  // Validate Lead & Entity Information
  if (!formData.leadEntity.name.trim()) {
    errors.push(applicantType === 'Individual' ? 'Full Name is required' : 'Business Name is required');
  }
  if (!formData.leadEntity.entityType) {
    errors.push('Entity Type is required');
  }
  if (!formData.leadEntity.industry.trim()) {
    errors.push('Industry is required');
  }
  if (!formData.leadEntity.country.trim()) {
    errors.push('Country is required');
  }

  // Validate Government Registrations
  if (applicantType === 'Individual') {
    if (!formData.govRegistrations.pan.trim()) {
      errors.push('PAN Number is required');
    }
    if (!formData.govRegistrations.aadhaar.trim()) {
      errors.push('Aadhaar Number is required');
    }
  } else {
    if (!formData.govRegistrations.businessPan.trim()) {
      errors.push('Business PAN is required');
    }
  }

  // Validate Contact Details
  if (!formData.contactDetails.contactPerson.trim()) {
    errors.push('Contact Person Name is required');
  }
  if (!formData.contactDetails.phoneNumber.trim()) {
    errors.push('Mobile Number is required');
  }
  if (!formData.contactDetails.email.trim()) {
    errors.push('Email Address is required');
  }

  // Validate Key Person Details (for Business)
  if (applicantType === 'Business') {
    if (!formData.keyPerson.pan.trim()) {
      errors.push('Authorized Person PAN is required');
    }
    if (!formData.keyPerson.dob.trim()) {
      errors.push('Authorized Person DOB is required');
    }
  }

  // Validate Addresses
  if (applicantType === 'Individual') {
    if (!formData.addresses.address.trim()) {
      errors.push('Address is required');
    }
  } else {
    if (!formData.addresses.registeredAddress.trim()) {
      errors.push('Registered Address is required');
    }
  }
  if (!formData.addresses.city.trim()) {
    errors.push('City is required');
  }
  if (!formData.addresses.state.trim()) {
    errors.push('State is required');
  }
  if (!formData.addresses.pincode.trim()) {
    errors.push('Pincode is required');
  }

  // Validate Ownership Directors
  ownershipDirectors.forEach((director, index) => {
    if (!director.name.trim()) {
      errors.push(`Director/Owner ${index + 1}: Name is required`);
    }
    if (!director.pan.trim()) {
      errors.push(`Director/Owner ${index + 1}: PAN is required`);
    }
    if (!director.dob.trim()) {
      errors.push(`Director/Owner ${index + 1}: DOB is required`);
    }
    if (!director.designation.trim()) {
      errors.push(`Director/Owner ${index + 1}: Designation is required`);
    }
  });

  return errors;
};
