import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Listing } from '../../types';
import { Calendar, DollarSign, Eye, Archive, AlertTriangle, CheckCircle } from 'lucide-react';
import SubscriptionBadge from '../ui/SubscriptionBadge';

interface ListingManagementProps {
  listings: Listing[];
  onListingUpdate: () => void;
}

const ListingManagement: React.FC<ListingManagementProps> = ({ listings, onListingUpdate }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, [listings]);

  const loadSubscriptions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getSession();
      if (!user) return;

      const { data, error } = await supabase
        .from('listing_subscriptions')
        .select('*')
        .eq('owner_id', user.id);

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const getSubscriptionForListing = (listingId: string) => {
    return subscriptions.find(sub => sub.listing_id === listingId);
  };

  const handleArchiveListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to archive this listing? This will remove it from public view and cancel any active subscription.')) {
      return;
    }

    setLoading(true);
    try {
      // Update listing status to archived
      const { error: listingError } = await supabase
        .from('listings')
        .update({ status: 'archived' })
        .eq('id', listingId);

      if (listingError) throw listingError;

      // Cancel subscription if active
      const subscription = getSubscriptionForListing(listingId);
      if (subscription && subscription.status === 'active') {
        const { error: subError } = await supabase
          .from('listing_subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscription.id);

        if (subError) throw subError;
      }

      alert('Listing archived successfully');
      onListingUpdate();
    } catch (error) {
      console.error('Error archiving listing:', error);
      alert('Failed to archive listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReactivateListing = async (listingId: string) => {
    if (!confirm('Reactivating this listing will require a new subscription payment. Continue?')) {
      return;
    }

    // Redirect to payment page
    window.location.href = `/payment?listing_id=${listingId}`;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'text-green-600 bg-green-100';
      case 'archived':
        return 'text-gray-600 bg-gray-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {listings.map((listing) => {
        const subscription = getSubscriptionForListing(listing.id);
        
        return (
          <div key={listing.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex">
              {/* Image */}
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={listing.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{listing.title}</h3>
                    <p className="text-gray-600 mb-2">{listing.address}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formatPrice(listing.price)}/month
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Available {new Date(listing.available_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(listing.status)}`}>
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </span>
                    
                    {listing.status === 'published' && (
                      <div className="mt-2">
                        <SubscriptionBadge listingId={listing.id} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Subscription Info */}
                {listing.status === 'published' && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-800">Subscription Status</h4>
                        <SubscriptionBadge listingId={listing.id} showDetails={true} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`/listing/${listing.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Listing
                  </a>

                  {listing.status === 'published' ? (
                    <button
                      onClick={() => handleArchiveListing(listing.id)}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </button>
                  ) : listing.status === 'archived' ? (
                    <button
                      onClick={() => handleReactivateListing(listing.id)}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Reactivate
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {listings.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No listings found</h3>
          <p className="text-gray-600">Create your first listing to get started.</p>
        </div>
      )}
    </div>
  );
};

export default ListingManagement;