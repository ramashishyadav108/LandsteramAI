import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { ForgotPasswordFormData, FormChangeHandler, FormSubmitHandler } from '../../types';
import './AuthLayout.css';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<number>(1); // 1: Phone number, 2: OTP
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    countryCode: '+91',
    phoneNumber: '',
    otp: '',
  });

  const handleChange: FormChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGetOTP: FormSubmitHandler = (e) => {
    e.preventDefault();
    // TODO: Add API call to send OTP
    console.log('Sending OTP to:', formData.countryCode + formData.phoneNumber);
    setStep(2);
  };

  const handleVerifyOTP: FormSubmitHandler = (e) => {
    e.preventDefault();
    // TODO: Add API call to verify OTP
    console.log('Verifying OTP:', formData.otp);
  };

  const handleResendOTP = (): void => {
    // TODO: Add API call to resend OTP
    console.log('Resending OTP');
  };

  return (
    <AuthLayout>
      <div className="forgot-password-container">
        <div className="auth-form-header">
          <h2 className="auth-form-title">
            Forgot Password
          </h2>
          <p className="auth-password-subtitle">
            Don't worry! It happens. Please enter phone number associated with your account
          </p>
        </div>

      {step === 1 ? (
        // Step 1: Enter Phone Number
        <form onSubmit={handleGetOTP} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="phoneNumber" className="auth-form-label">
              Enter Your Mobile Number
            </label>
            <div className="forgot-phone-input-wrapper">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="forgot-country-code"
              >
                <option value="+91">+91</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+86">+86</option>
              </select>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="455-485-5484"
                className="auth-form-input forgot-phone-input"
                required
              />
              <button
                type="button"
                className="forgot-verify-icon"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7 10L9 12L13 8M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Get OTP Button */}
          <button
            type="submit"
            className="forgot-submit-button"
          >
            Get OTP
          </button>
        </form>
      ) : (
        // Step 2: Enter OTP
        <form onSubmit={handleVerifyOTP} className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="otp" className="pass-form-label">
              Enter OTP
            </label>
            <p className="forgot-otp-hint">
              An 4-digit OTP has been sent to<br />
              <strong>458-485-6466</strong>
            </p>
            <div className="forgot-otp-inputs">
              <input
                type="text"
                maxLength={1}
                className="forgot-otp-box"
                autoFocus
              />
              <input
                type="text"
                maxLength={1}
                className="forgot-otp-box"
              />
              <input
                type="text"
                maxLength={1}
                className="forgot-otp-box"
              />
              <input
                type="text"
                maxLength={1}
                className="forgot-otp-box"
              />
            </div>
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="forgot-submit-button"
          >
            Verify
          </button>

          {/* Resend OTP */}
          <div className="forgot-resend-wrapper">
            <button
              type="button"
              onClick={handleResendOTP}
              className="forgot-resend-button"
            >
              Resend OTP
            </button>
            <span className="forgot-resend-time">(00:30)</span>
          </div>
        </form>
      )}

      {/* Back to Login Link */}
      <p className="auth-footer-link">
        Remember your password?{' '}
        <Link to="/login">
          Back to Login
        </Link>
      </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
