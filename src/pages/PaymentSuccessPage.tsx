import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PostPaymentAccountCreation from '../components/listings/PostPaymentAccountCreation';
import { CheckCircle, ArrowLeft } from 'lucide-react';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [createdListingId, setCreatedListingId] = useState<string | null>(null);
  
  const listingId = searchParams.get('listing_id');
  const sessionId = searchParams.get('session_id');

  const handleAccountCreationSuccess = (listingId: string) => {
    setCreatedListingId(listingId);
  };

  // If this was a temp listing (from listing submission), show account creation
  if (listingId === 'temp') {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <PostPaymentAccountCreation onSuccess={handleAccountCreationSuccess} />
        </div>
      </Layout>
    );
  }

  // For existing listings, show success message
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Your listing subscription has been activated. Your listing is now live and visible to potential tenants.
          </p>

          {sessionId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-700 text-sm">
                <strong>Session ID:</strong> {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {listingId && listingId !== 'temp' && (
              <button
                onClick={() => navigate(`/listing/${listingId}`)}
                className="w-full px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
              >
                View Your Listing
              </button>
            )}
            
            <button
              onClick={() => navigate('/profile')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
            >
              Go to Profile
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 inline mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PaymentSuccessPage;