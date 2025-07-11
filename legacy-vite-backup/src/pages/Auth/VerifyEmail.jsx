import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [message, setMessage] = useState('');
  
  // Email might be passed from the registration flow
  const email = location.state?.email || '';
  const customMessage = location.state?.message || '';
  
  // Check for token in URL for automatic verification
  useEffect(() => {
    const checkVerification = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        try {
          // This would depend on your Supabase setup
          // This is a simplified example
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'email',
          });
          
          if (error) {
            throw error;
          }
          
          setVerificationStatus('success');
          setMessage('Your email has been verified successfully!');
          
          // Redirect to login after a delay
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } catch (error) {
          console.error('Verification error:', error.message);
          setVerificationStatus('error');
          setMessage(error.message || 'Verification failed. Please try again.');
        }
      }
    };
    
    checkVerification();
  }, [location, navigate]);
  
  // Resend verification email
  const handleResendVerification = async () => {
    if (!email) {
      setMessage('Please go back to the sign-up page and try again.');
      return;
    }
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      
      if (error) throw error;
      
      setMessage('Verification email has been resent. Please check your inbox.');
    } catch (error) {
      console.error('Resend error:', error.message);
      setMessage(error.message || 'Failed to resend verification email.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Email Verification</h1>
          <p>
            {customMessage || 'Please verify your email address to complete your registration.'}
          </p>
        </div>

        <div className={`verification-status ${verificationStatus}`}>
          {verificationStatus === 'pending' && (
            <div className="pending-message">
              <div className="icon">📩</div>
              <p>Waiting for email verification...</p>
              {email && (
                <p className="email-sent-to">
                  We've sent a verification link to <strong>{email}</strong>
                </p>
              )}
            </div>
          )}
          
          {verificationStatus === 'success' && (
            <div className="success-message">
              <div className="icon">✅</div>
              <p>{message}</p>
              <p>Redirecting you to login...</p>
            </div>
          )}
          
          {verificationStatus === 'error' && (
            <div className="error-message">
              <div className="icon">❌</div>
              <p>{message}</p>
            </div>
          )}
          
          {message && verificationStatus === 'pending' && (
            <div className="info-message">
              <p>{message}</p>
            </div>
          )}
        </div>

        <div className="verification-actions">
          {verificationStatus !== 'success' && (
            <>
              <button
                onClick={handleResendVerification}
                className="btn btn-secondary"
                disabled={!email}
              >
                Resend Verification Email
              </button>
              
              <p className="or-divider">or</p>
              
              <Link to="/login" className="btn btn-outline">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;