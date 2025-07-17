import React from 'react';
import { Link } from 'react-router-dom';
import { Listing } from '../../types';
import { MapPin, Bed, Bath, Square, Calendar } from 'lucide-react';
import { neighborhoods } from '../../data/mockData';
import SaveListingButton from '../ui/SaveListingButton';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNeighborhoodName = (neighborhoodId: string) => {
    const neighborhood = neighborhoods.find(n => n.id === neighborhoodId);
    return neighborhood ? neighborhood.name : '';
  };

  // Shuffle amenities array and take first 3
  const shuffledAmenities = [...listing.amenities]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 relative">
      {/* Save Button */}
      <div className="absolute top-3 right-3 z-10">
        <SaveListingButton listingId={listing.id} size="md" />
      </div>

      <div className="relative h-56 overflow-hidden">
        <div className="absolute top-0 left-0 bg-[#4f46e5] text-white px-4 py-2 z-10">
          {formatPrice(listing.price)}/mo
        </div>
        <Link to={`/listing/${listing.id}`}>
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </Link>
      </div>
      
      <div className="p-5">
        <Link to={`/listing/${listing.id}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 hover:text-[#4f46e5] transition-colors">
            {listing.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-500 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <p className="text-sm">{listing.address}, {getNeighborhoodName(listing.neighborhood_id)}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center text-gray-700">
            <Bed className="h-4 w-4 mr-1" />
            <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <Bath className="h-4 w-4 mr-1" />
            <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
          </div>
          
          {listing.square_feet && (
            <div className="flex items-center text-gray-700">
              <Square className="h-4 w-4 mr-1" />
              <span>{listing.square_feet} sq ft</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-gray-600 mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="text-sm">Available {formatDate(listing.available_date)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {shuffledAmenities.map((amenity, index) => (
            <span 
              key={index} 
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs"
            >
              {amenity}
            </span>
          ))}
          {listing.amenities.length > 3 && (
            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
              +{listing.amenities.length - 3} more
            </span>
          )}
        </div>
        
        <Link 
          to={`/listing/${listing.id}`}
          className="block w-full text-center bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white py-2 rounded-md transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ListingCard;