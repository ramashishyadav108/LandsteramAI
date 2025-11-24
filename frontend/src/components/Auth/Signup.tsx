import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { SignupFormData, SocialProvider, FormChangeHandler, FormSubmitHandler } from '../../types';
import { authService } from '../../services/auth.service';
import './AuthLayout.css';
import './Signup.css';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [registeredEmail, setRegisteredEmail] = useState<string>('');
  const navigate = useNavigate();

  const handleChange: FormChangeHandler = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit: FormSubmitHandler = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await authService.signup({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Check if user needs to verify email
        const message = response.message || '';

        if (message.includes('verify your email')) {
          // Show success message for email verification
          setSuccess('Account created successfully! Please check your email to verify your account.');
          setRegisteredEmail(formData.email);

          // Clear the form
          setFormData({
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
          });
        } else if (response.data) {
          // User is already verified (Google OAuth flow)
          authService.setAccessToken(response.data.accessToken);
          authService.setUser(response.data.user);
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignup = (provider: SocialProvider): void => {
    if (provider === 'google') {
      authService.initiateGoogleLogin();
    } else {
      // TODO: Implement other social login providers
      console.log(`Signup with ${provider} - Not implemented yet`);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-form-header">
        <h2 className="auth-form-title">
          Get Started!
        </h2>
        <p className="auth-form-subtitle">Create Your Account</p>
      </div>

      {error && (
        <div className="signup-error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="signup-success-message">
          <strong>Success!</strong> {success}
          {registeredEmail && (
            <p className="signup-success-email">
              We sent a verification link to <strong>{registeredEmail}</strong>
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Full Name Input */}
        <div className="auth-form-group">
          <label htmlFor="fullName" className="auth-form-label">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            className="auth-form-input"
            required
          />
        </div>

        {/* Email Input */}
        <div className="auth-form-group">
          <label htmlFor="email" className="auth-form-label">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="username@gmail.com"
            className="auth-form-input"
            required
          />
        </div>

        {/* Password Input */}
        <div className="auth-form-group">
          <label htmlFor="password" className="auth-form-label">
            Password
          </label>
          <div className="auth-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="auth-form-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-password-toggle"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="auth-form-group">
          <label htmlFor="confirmPassword" className="auth-form-label">
            Confirm Password
          </label>
          <div className="auth-password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="auth-form-input"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="auth-password-toggle"
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="signup-submit-button"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      {/* Divider */}
      <div className="auth-divider-container">
        <div className="auth-divider-wrapper">
          <div className="auth-divider-line-container">
            <div className="auth-divider-line"></div>
          </div>
          <div className="auth-divider-text-wrapper">
            <span className="auth-divider-text">or continue with</span>
          </div>
        </div>
      </div>

      {/* Social Signup Buttons */}
      <div className="auth-social-buttons">
        <button
          type="button"
          onClick={() => handleSocialSignup('google')}
          className="auth-social-button"
        >
          <svg viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleSocialSignup('github')}
          className="auth-social-button"
        >
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
          </svg>
        </button>

        <button
          type="button"
          onClick={() => handleSocialSignup('facebook')}
          className="auth-social-button"
        >
          <svg fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>
      </div>

      {/* Login Link */}
      <p className="auth-footer-link">
        Already have an account?{' '}
        <Link to="/login">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
