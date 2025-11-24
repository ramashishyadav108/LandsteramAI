import React from 'react';
import signupLoginImg from '../../assets/signup_login.png';
import { AuthLayoutProps } from '../../types';
import './AuthLayout.css';

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-container">
      {/* Left Side - Illustration */}
      <div className="auth-left-side">
        <div className="auth-logo-container">
          <div className="auth-logo-icon">
            LS
          </div>
          <h1 className="auth-logo-text">
            Lend<span className="auth-logo-highlight">Stream.ai</span>
          </h1>
        </div>
        <div className="auth-illustration-wrapper">
          <img
            src={signupLoginImg}
            alt="Authentication Illustration"
            className="auth-illustration-image"
          />
        </div>
      </div>

      {/* Right Side - Form Content */}
      <div className="auth-right-side">
        <div className="auth-form-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
