import React from 'react';
import { ListingPreview as ListingPreviewType } from '../../types';
import { MapPin, Bed, Bath, Square, Calendar, DollarSign, Mail, Phone, Loader2 } from 'lucide-react';

interface ListingPreviewProps {
  preview: ListingPreviewType;
  onEdit: () => void;
  onPublish: () => void;
  isSubmitting?: boolean;
}

const ListingPreview: React.FC<ListingPreviewProps> = ({ preview, onEdit, onPublish, isSubmitting = false }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Preview Your Listing</h2>
        
        {/* Images */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            {preview.listing.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Property image ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Title and Price */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{preview.listing.title}</h3>
          <div className="flex items-center text-[#4f46e5] text-xl font-bold">
            <DollarSign className="h-6 w-6" />
            {formatPrice(preview.listing.price)}/month
          </div>
          <div className="text-gray-600 mt-1">
            Security Deposit: {formatPrice(preview.listing.deposit)}
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center">
            <Bed className="h-5 w-5 text-gray-500 mr-2" />
            <span>{preview.listing.bedrooms} {preview.listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
          </div>
          <div className="flex items-center">
            <Bath className="h-5 w-5 text-gray-500 mr-2" />
            <span>{preview.listing.bathrooms} {preview.listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
          </div>
          <div className="flex items-center">
            <Square className="h-5 w-5 text-gray-500 mr-2" />
            <span>{preview.listing.square_feet} sq ft</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
            <span>Available {formatDate(preview.listing.available_date)}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Description</h4>
          <p className="text-gray-700 whitespace-pre-line">{preview.listing.description}</p>
        </div>

        {/* Amenities */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-2">Amenities</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {preview.listing.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <span className="w-2 h-2 bg-[#4f46e5] rounded-full mr-2"></span>
                <span className="text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-medium">Display Name:</span> {preview.landlord.displayName}
            </p>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">{preview.landlord.email}</span>
            </div>
            {preview.landlord.phone && (
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{preview.landlord.phone}</span>
              </div>
            )}
            <p className="text-gray-700">
              <span className="font-medium">Preferred Contact Method:</span>{' '}
              {preview.landlord.preferredContact}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onEdit}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 border border-[#4f46e5] text-[#4f46e5] font-semibold rounded-md hover:bg-[#4f46e5]/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Edit Listing
          </button>
          <button
            onClick={onPublish}
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating Listing...
              </>
            ) : (
              'Continue to Payment'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingPreview;