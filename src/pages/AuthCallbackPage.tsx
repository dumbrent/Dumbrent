import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Layout from '../components/layout/Layout';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent duplicate processing
    if (hasProcessed.current) return;
    hasProcessed.current = true;
    
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      const code = searchParams.get('code');
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      // Check for hash fragment format (implicit flow)
      const hash = window.location.hash.substring(1); // Remove the # symbol
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token');
      const tokenType = hashParams.get('type');

      // Comprehensive logging for debugging
      console.log('=== Auth Callback Debug Info ===');
      console.log('Auth callback params:', { code, token, type, error, errorDescription });
      console.log('Hash params:', { accessToken: !!accessToken, tokenType });
      console.log('Current URL:', window.location.href);
      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Supabase Anon Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
      console.log('Supabase Anon Key length:', import.meta.env.VITE_SUPABASE_ANON_KEY?.length);
      
      // Debug sessionStorage
      const pendingListingData = sessionStorage.getItem('pending_listing_data');
      console.log('Pending listing data exists:', !!pendingListingData);
      if (pendingListingData) {
        try {
          const parsed = JSON.parse(pendingListingData);
          console.log('Pending listing data parsed:', parsed);
        } catch (e) {
          console.error('Error parsing pending listing data:', e);
        }
      }
      
      // Debug current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Current session exists:', !!currentSession);
      if (currentSession) {
        console.log('Current session user:', currentSession.user.email);
        console.log('Current session user metadata:', currentSession.user.user_metadata);
        console.log('Current session user role:', currentSession.user.user_metadata?.role);
      }
      console.log('================================');

      // Handle auth errors from URL parameters
      if (error) {
        console.error('Auth error from URL:', error, errorDescription);
        setStatus('error');
        setMessage(errorDescription || 'Authentication failed');
        return;
      }

      // Handle hash fragment format (implicit flow success)
      if (accessToken && tokenType === 'signup') {
        console.log('Processing hash fragment verification...');
        try {
          // Set the session manually with the access token
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || ''
          });

          if (sessionError) {
            console.error('Session setting error:', sessionError);
            setStatus('error');
            setMessage(`Verification failed: ${sessionError.message}`);
            return;
          }

          if (data.session) {
            console.log('Session created successfully via hash fragment:', data.session.user.email);
            
            // Check if this was a listing submission verification
            const userRole = data.session.user.user_metadata?.role;
            
            if (pendingListingData && userRole === 'listing_owner') {
              console.log('Detected listing submission verification, redirecting to profile...');
              setStatus('success');
              setMessage('Email verified successfully! Redirecting to your profile...');
              
              setTimeout(() => {
                // Clear the stored data
                sessionStorage.removeItem('pending_listing_data');
                // Redirect to profile page
                navigate('/profile', { replace: true });
              }, 2000);
              return;
            }
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to your profile...');
            
            setTimeout(() => {
              navigate('/profile', { replace: true });
            }, 2000);
          }
        } catch (hashErr) {
          console.error('Hash fragment verification failed:', hashErr);
          setStatus('error');
          setMessage('Verification failed. Please try signing up again.');
          return;
        }
      }

      // Handle token-based verification (PKCE flow)
      if (token && type === 'signup') {
        console.log('Processing token-based verification...');
        try {
          const { data, error: tokenError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (tokenError) {
            console.error('Token verification error:', tokenError);
            setStatus('error');
            setMessage(`Verification failed: ${tokenError.message}`);
            return;
          }

          if (data.session) {
            console.log('Session created successfully via token:', data.session.user.email);
            
            // Check if this was a listing submission verification
            const userRole = data.session.user.user_metadata?.role;
            
            if (pendingListingData && userRole === 'listing_owner') {
              console.log('Detected listing submission verification, redirecting to profile...');
              setStatus('success');
              setMessage('Email verified successfully! Redirecting to your profile...');
              
              setTimeout(() => {
                // Clear the stored data
                sessionStorage.removeItem('pending_listing_data');
                // Redirect to profile page
                navigate('/profile', { replace: true });
              }, 2000);
              return;
            }
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to your profile...');
            
            setTimeout(() => {
              navigate('/profile', { replace: true });
            }, 2000);
          }
        } catch (tokenErr) {
          console.error('Token verification failed:', tokenErr);
          setStatus('error');
          setMessage('Token verification failed. Please try signing up again.');
          return;
        }
      }

      // Handle code-based verification (standard flow)
      if (code) {
        console.log('Processing code-based verification...');
        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Exchange error details:', {
              message: exchangeError.message,
              status: exchangeError.status,
              name: exchangeError.name,
              details: exchangeError
            });

            // Handle 400 errors or reused/expired codes by checking existing session
            if (exchangeError.status === 400 || 
                exchangeError.message.includes('reused') || 
                exchangeError.message.includes('expired') ||
                exchangeError.message.includes('invalid')) {
              
              console.log('Code exchange failed with 400/reused/expired error. Checking for existing session...');
              
              const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
              
              if (sessionError) {
                console.error('Session check error:', sessionError);
                setStatus('error');
                setMessage('Verification failed. Please try signing up again.');
                return;
              }

              if (sessionData.session) {
                console.log('User already has an active session:', sessionData.session.user.email);
                setStatus('success');
                setMessage('You are already signed in! Redirecting to your profile...');
                
                setTimeout(() => {
                  navigate('/profile', { replace: true });
                }, 2000);
                return;
              } else {
                console.log('No existing session found');
                setStatus('error');
                setMessage('Verification link has expired or is invalid. Please request a new verification email.');
                return;
              }
            }

            // Handle other exchange errors
            setStatus('error');
            setMessage(`Verification failed: ${exchangeError.message}`);
            return;
          }

          // Handle successful code exchange
          if (data.session) {
            console.log('Session created successfully via code:', data.session.user.email);
            
            // Check if this was a listing submission verification
            const userRole = data.session.user.user_metadata?.role;
            
            if (pendingListingData && userRole === 'listing_owner') {
              console.log('Detected listing submission verification, redirecting to profile...');
              setStatus('success');
              setMessage('Email verified successfully! Redirecting to your profile...');
              
              setTimeout(() => {
                // Clear the stored data
                sessionStorage.removeItem('pending_listing_data');
                // Redirect to profile page
                navigate('/profile', { replace: true });
              }, 2000);
              return;
            }
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to your profile...');
            
            setTimeout(() => {
              navigate('/profile', { replace: true });
            }, 2000);
          } else {
            console.error('No session created after successful exchange');
            setStatus('error');
            setMessage('Verification completed but no session was created. Please try logging in.');
          }
        } catch (codeErr) {
          console.error('Code exchange error:', codeErr);
          setStatus('error');
          setMessage('Code verification failed. Please try signing up again.');
          return;
        }
      }

      // If none of the verification methods worked
      if (!code && !token && !accessToken) {
        // Check for existing session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('Session check error:', sessionError);
          setStatus('error');
          setMessage('No verification information found. Please check your email and try again.');
          return;
        }
        if (sessionData.session) {
          console.log('User already has an active session:', sessionData.session.user.email);
          
          // Check if this was a listing submission verification
          const userRole = sessionData.session.user.user_metadata?.role;
          
          if (pendingListingData && userRole === 'listing_owner') {
            console.log('Detected listing submission verification, redirecting to profile...');
            setStatus('success');
            setMessage('Email verified successfully! Redirecting to your profile...');
            
            setTimeout(() => {
              // Clear the stored data
              sessionStorage.removeItem('pending_listing_data');
              // Redirect to profile page
              navigate('/profile', { replace: true });
            }, 2000);
            return;
          }
          setStatus('success');
          setMessage('You are already signed in! Redirecting to your profile...');
          setTimeout(() => {
            navigate('/profile', { replace: true });
          }, 2000);
        }
        console.error('No verification code, token, or access token found in URL');
        setStatus('error');
        setMessage('No verification information found. Please check your email and try again.');
        return;
      }

    } catch (err) {
      console.error('Auth callback error:', err);
      setStatus('error');
      setMessage('An unexpected error occurred during verification');
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#4f46e5]" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying your email...</h2>
              <p className="text-gray-600">Please wait while we confirm your account.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
              <p className="text-gray-600 mb-4">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h2>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                  className="w-full px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
              >
                Go to Login
              </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition-colors"
                >
                  Try Signing Up Again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthCallbackPage;