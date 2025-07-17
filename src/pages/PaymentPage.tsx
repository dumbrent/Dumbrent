import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SubscriptionPaywall from '../components/listings/SubscriptionPaywall';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Loader2 } from 'lucide-react';

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const listingId = searchParams.get('listing_id');

  useEffect(() => {
    if (!listingId) {
      setError('No listing ID provided');
      setLoading(false);
      return;
    }

    loadListing();
  }, [listingId]);

  const loadListing = async () => {
    try {
      console.log('PaymentPage: Checking for session...');
      
      // Get session with a simple approach
      const { data: { session } } = await supabase.auth.getSession();
      
      console.log('PaymentPage: Session check result:', session ? 'Session found' : 'No session');
      console.log('PaymentPage: Session details:', session);
      
      // Handle temporary listing case (from listing submission)
      if (listingId === 'temp') {
        console.log('PaymentPage: Handling temporary listing from listing submission...');
        
        const pendingListingData = sessionStorage.getItem('pending_listing_data');
        if (!pendingListingData) {
          throw new Error('No pending listing data found. Please submit your listing again.');
        }
        
        const { formData, preview } = JSON.parse(pendingListingData);
        
        // Create a temporary listing object for the payment page
        setListing({
          id: 'temp',
          title: preview?.listing.title || formData.title,
          landlord_id: 'temp'
        });
        
        return;
      }
      
      if (!session) {
        console.log('PaymentPage: No session found, showing error');
        setError('You need to be logged in to access this page. Please sign in and try again.');
        setLoading(false);
        return;
      }

      console.log('PaymentPage: Session found:', session.user.email);
      console.log('PaymentPage: Loading listing with ID:', listingId);
      
      const { data, error: listingError } = await supabase
        .from('listings')
        .select('id, title, landlord_id')
        .eq('id', listingId)
        .eq('landlord_id', session.user.id)
        .single();

      if (listingError) {
        console.error('PaymentPage: Listing error:', listingError);
        if (listingError.code === 'PGRST116') {
          throw new Error('Listing not found. It may have been deleted or you may not have permission to access it.');
        }
        throw new Error('Failed to load listing. Please try again.');
      }

      console.log('PaymentPage: Listing loaded successfully:', data);
      setListing(data);
    } catch (err) {
      console.error('Error loading listing:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/submit-listing');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#4f46e5]" />
              <p className="text-gray-600">Loading payment options...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Listing not found'}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
              >
                Sign In
              </button>
              <br />
              <button
                onClick={() => navigate('/submit-listing')}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Listing Submission
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <button 
            onClick={handleCancel}
            className="inline-flex items-center text-[#4f46e5] hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Listing
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <SubscriptionPaywall
          listingId={listing.id}
          listingTitle={listing.title}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default PaymentPage;