export interface OwnershipDirector {
  id: string;
  name: string;
  pan: string;
  dob: string;
  designation: string;
}

export interface BasicCustomerInfoProps {
  leadId?: string;
}

export interface FormData {
  leadEntity: {
    name: string;
    entityType: string;
    industry: string;
    country: string;
  };
  govRegistrations: {
    pan: string;
    aadhaar: string;
    businessPan: string;
    gstin: string;
    cin: string;
    udyam: string;
  };
  contactDetails: {
    contactPerson: string;
    phoneNumber: string;
    email: string;
  };
  keyPerson: {
    pan: string;
    dob: string;
  };
  addresses: {
    address: string;
    registeredAddress: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export type ApplicantType = 'Individual' | 'Business';
