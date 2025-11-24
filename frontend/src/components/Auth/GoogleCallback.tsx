import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const GoogleCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      // Get token and error from URL query parameters
      const token = searchParams.get('token');
      const errorParam = searchParams.get('error');

      if (errorParam) {
        const errorMessage = errorParam === 'missing_code'
          ? 'Authorization code was not received'
          : errorParam === 'authentication_failed'
          ? 'Google authentication failed'
          : decodeURIComponent(errorParam);

        setError(errorMessage);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
        return;
      }

      if (token) {
        try {
          // Store access token
          authService.setAccessToken(token);

          // Fetch user profile using the token
          try {
            const response = await authService.getProfile();
            if (response.success && response.data) {
              authService.setUser(response.data.user);
              // Redirect to dashboard
              navigate('/dashboard');
            } else {
              throw new Error('Failed to fetch user profile');
            }
          } catch (err) {
            // If profile fetch fails, still redirect but without user data
            console.error('Failed to fetch profile:', err);
            navigate('/dashboard');
          }
        } catch (err) {
          setError('Failed to process authentication data');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        }
      } else {
        setError('Missing authentication token');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      {error ? (
        <div>
          <h2 style={{ color: '#c33', marginBottom: '16px' }}>Authentication Failed</h2>
          <p>{error}</p>
          <p style={{ marginTop: '16px', color: '#666' }}>Redirecting to login...</p>
        </div>
      ) : (
        <div>
          <h2 style={{ marginBottom: '16px' }}>Completing Google Sign-In...</h2>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default GoogleCallback;
