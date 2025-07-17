import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getRedirectUrl } from '../../lib/supabase';
import { saveDraftListing, createListing } from '../../lib/listings';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';

interface PostPaymentAccountCreationProps {
  onSuccess: (listingId: string) => void;
}

const PostPaymentAccountCreation: React.FC<PostPaymentAccountCreationProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'creating' | 'success' | 'error'>('creating');
  const [error, setError] = useState<string | null>(null);
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [landlordProfile, setLandlordProfile] = useState<any>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in and email is confirmed
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at) {
        // User is already logged in and confirmed, submit listing
        await completeListingSubmission();
      } else {
        createAccountAndListing();
      }
    })();
  }, []);

  const handleLandlordSignup = async (email: string, password: string, phone?: string) => {
    setSignupSuccess(null);
    setSignupError(null);
    try {
      const redirectUrl = getRedirectUrl();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'landlord',
            phone: phone || undefined
          },
          emailRedirectTo: redirectUrl
        }
      });
      console.log('SignUp Response:', data);
      if (error) {
        setSignupError(error.message || 'Sign up failed.');
        return;
      }
      setSignupSuccess('✅ Check your email to confirm your account before continuing.');
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : 'Sign up failed.');
    }
  };

  const createAccountAndListing = async () => {
    try {
      console.log('PostPaymentAccountCreation: Starting account creation...');
      // Get the stored listing data
      const pendingListingData = sessionStorage.getItem('pending_listing_data');
      if (!pendingListingData) {
        throw new Error('No pending listing data found. Please submit your listing again.');
      }
      const { formData } = JSON.parse(pendingListingData);
      await handleLandlordSignup(formData.email, formData.password, formData.phone);
      setStep('success');
      setCreatedListingId(null); // No listing yet
    } catch (error) {
      console.error('PostPaymentAccountCreation: Error:', error);
      setStep('error');
      setError(error instanceof Error ? error.message : 'Failed to create account');
    }
  };

  const completeListingSubmission = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const pendingListingData = sessionStorage.getItem('pending_listing_data');
      if (!pendingListingData) throw new Error('No pending listing data found. Please submit your listing again.');
      const { formData } = JSON.parse(pendingListingData);
      // Ensure status is set
      if (!formData.status) {
        formData.status = 'pending';
      }
      // Create the listing
      const listing = await createListing(formData, supabase);
      // Optionally clear the backup
      sessionStorage.removeItem('pending_listing_data');
      // Redirect to payment with the new listing id
      navigate(`/payment?listing_id=${listing.id}`);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Failed to submit listing.';
      setLoginError(errMsg);
      setError(errMsg);
      setStep('error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const checkEmailAndLogin = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      // Get the stored listing data
      const pendingListingData = sessionStorage.getItem('pending_listing_data');
      if (!pendingListingData) {
        setLoginError('No pending listing data found. Please submit your listing again.');
        setIsLoggingIn(false);
        return;
      }
      const { formData } = JSON.parse(pendingListingData);
      const email = formData.email;
      const password = formData.password;
      if (!email || !password) {
        setLoginError('Session expired or missing credentials. Please log in manually to continue.');
        setIsLoggingIn(false);
        return;
      }
      // Try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !signInData.user) {
        setLoginError('Login failed. Please log in manually to continue.');
        setIsLoggingIn(false);
        return;
      }
      // Update user_profiles role to 'listing_owner'
      await supabase
        .from('user_profiles')
        .update({ role: 'listing_owner' })
        .eq('user_id', signInData.user.id);
      // Fetch landlord profile
      const { data: profile, error: profileError } = await supabase
        .from('landlord_profiles')
        .select('*')
        .eq('user_id', signInData.user.id)
        .single();
      if (profileError) {
        setLoginError('Login succeeded, but could not fetch landlord profile.');
        setIsLoggingIn(false);
        return;
      }
      setLandlordProfile(profile);
      // Now complete the listing submission
      await completeListingSubmission();
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (step === 'creating') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#4f46e5]" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting Up Your Account</h2>
        <p className="text-gray-600">Creating your landlord account and listing...</p>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Failed</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/submit-listing')}
            className="px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
          >
            Try Again
          </button>
          <br />
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
        <p className="text-gray-600 mb-6">
          {signupSuccess}
        </p>
        <button
          onClick={checkEmailAndLogin}
          className="px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Logging in...' : 'Continue'}
        </button>
        {loginError && (
          <div className="mt-4 text-red-600">
            {loginError}
            <div className="mt-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition-colors"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default PostPaymentAccountCreation; 