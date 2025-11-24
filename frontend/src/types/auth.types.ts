// Form Data Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  countryCode: string;
  phoneNumber: string;
  otp: string;
}

// Component Props Types
export interface AuthLayoutProps {
  children: React.ReactNode;
}

// Social Provider Type
export type SocialProvider = 'google' | 'github' | 'facebook';

// Event Handler Types
export type FormChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
export type FormSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => void;
export type ButtonClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;
