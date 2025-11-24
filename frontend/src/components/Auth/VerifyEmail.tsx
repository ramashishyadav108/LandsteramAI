import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { authService } from '../../services/auth.service';
import './AuthLayout.css';
import './VerifyEmail.css';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(5);
  const hasVerifiedRef = useRef<boolean>(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
      return;
    }

    // Prevent double verification in React StrictMode
    if (hasVerifiedRef.current) {
      return;
    }

    hasVerifiedRef.current = true;
    verifyEmailToken(token);
  }, [searchParams]);

  useEffect(() => {
    if (status === 'success' && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === 'success' && countdown === 0) {
      navigate('/login');
    }
  }, [status, countdown, navigate]);

  const verifyEmailToken = async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);

      if (response.success) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
      } else {
        setStatus('error');
        setMessage(response.message || 'Email verification failed.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An error occurred during verification. The link may have expired.');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="verify-email-content">
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
            <h2 className="verify-title">Verifying Your Email</h2>
            <p className="verify-message">Please wait while we verify your email address...</p>
          </div>
        );

      case 'success':
        return (
          <div className="verify-email-content success">
            <div className="icon-container success-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="verify-title">Email Verified!</h2>
            <p className="verify-message">{message}</p>
            <p className="countdown-message">
              Redirecting to login in {countdown} second{countdown !== 1 ? 's' : ''}...
            </p>
            <button
              className="auth-button"
              onClick={() => navigate('/login')}
            >
              Go to Login Now
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="verify-email-content error">
            <div className="icon-container error-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h2 className="verify-title">Verification Failed</h2>
            <p className="verify-message">{message}</p>
            <div className="button-group">
              <button
                className="auth-button"
                onClick={() => navigate('/login')}
              >
                Go to Login
              </button>
              <button
                className="auth-button secondary"
                onClick={() => navigate('/signup')}
              >
                Sign Up Again
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <AuthLayout>
      <div className="verify-email-container">
        {renderContent()}
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;
