import React, { useState } from 'react';
import { FilterOptions } from '../../types';
import { boroughs, neighborhoods, amenities } from '../../data/mockData';
import { X, ChevronDown, ChevronUp, Filter } from 'lucide-react';

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  filters, 
  onFilterChange, 
  className = '',
  isMobile = false,
  onClose
}) => {
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rooms: true,
    location: true,
    amenities: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleBedroomsChange = (value: number | undefined) => {
    onFilterChange({
      ...filters,
      bedrooms: value,
    });
  };

  const handleBathroomsChange = (value: number | undefined) => {
    onFilterChange({
      ...filters,
      bathrooms: value,
    });
  };

  const handleBoroughChange = (boroughId: string | undefined) => {
    onFilterChange({
      ...filters,
      boroughId,
      neighborhoodId: undefined,
    });
  };

  const handleNeighborhoodChange = (neighborhoodId: string | undefined) => {
    onFilterChange({
      ...filters,
      neighborhoodId,
    });
  };

  const handleAmenityChange = (amenity: string) => {
    const currentAmenities = filters.amenities || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    onFilterChange({
      ...filters,
      amenities: updatedAmenities,
    });
  };

  const resetFilters = () => {
    onFilterChange({});
  };

  const filteredNeighborhoods = filters.boroughId
    ? neighborhoods.filter(n => n.boroughId === filters.boroughId)
    : neighborhoods;

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof expandedSections }) => (
    <button
      className="flex justify-between items-center w-full text-left mb-3"
      onClick={() => toggleSection(section)}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {expandedSections[section] ? (
        <ChevronUp className="h-5 w-5 text-gray-500" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );

  const priceOptions = [
    { value: '', label: 'No min' },
    { value: '1000', label: '$1,000' },
    { value: '2000', label: '$2,000' },
    { value: '3000', label: '$3,000' },
    { value: '4000', label: '$4,000' },
    { value: '5000', label: '$5,000' },
  ];

  const maxPriceOptions = [
    { value: '', label: 'No max' },
    { value: '2000', label: '$2,000' },
    { value: '3000', label: '$3,000' },
    { value: '4000', label: '$4,000' },
    { value: '5000', label: '$5,000' },
    { value: '7500', label: '$7,500' },
    { value: '10000', label: '$10,000' },
  ];

  const bedroomOptions = [
    { value: 0, label: 'Studio' },
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4' },
    { value: 5, label: '5+' },
  ];

  const bathroomOptions = [
    { value: 1, label: '1' },
    { value: 2, label: '2' },
    { value: 3, label: '3' },
    { value: 4, label: '4+' },
  ];

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {isMobile && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-[#1a1b4b]" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
        >
          Reset All Filters
        </button>
      </div>

      {/* Price Section */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <SectionHeader title="Price Range" section="price" />
        
        {expandedSections.price && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                value={filters.minPrice || ''}
                onChange={(e) => handlePriceChange(
                  e.target.value ? parseInt(e.target.value) : undefined,
                  filters.maxPrice
                )}
              >
                {priceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                value={filters.maxPrice || ''}
                onChange={(e) => handlePriceChange(
                  filters.minPrice,
                  e.target.value ? parseInt(e.target.value) : undefined
                )}
              >
                {maxPriceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Rooms Section */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <SectionHeader title="Bedrooms & Bathrooms" section="rooms" />
        
        {expandedSections.rooms && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Bedrooms</label>
              <div className="flex space-x-2">
                {bedroomOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`flex-1 py-2 rounded-md border ${
                      filters.bedrooms === option.value
                        ? 'bg-[#1a1b4b] text-white border-[#1a1b4b]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => handleBedroomsChange(filters.bedrooms === option.value ? undefined : option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-2">Bathrooms</label>
              <div className="flex space-x-2">
                {bathroomOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`flex-1 py-2 rounded-md border ${
                      filters.bathrooms === option.value
                        ? 'bg-[#1a1b4b] text-white border-[#1a1b4b]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                    onClick={() => handleBathroomsChange(filters.bathrooms === option.value ? undefined : option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="mb-6 border-b border-gray-200 pb-6">
        <SectionHeader title="Location" section="location" />
        
        {expandedSections.location && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Borough</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                value={filters.boroughId || ''}
                onChange={(e) => handleBoroughChange(e.target.value || undefined)}
              >
                <option value="">All Boroughs</option>
                {boroughs.map((borough) => (
                  <option key={borough.id} value={borough.id}>
                    {borough.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Neighborhood</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1b4b]"
                value={filters.neighborhoodId || ''}
                onChange={(e) => handleNeighborhoodChange(e.target.value || undefined)}
              >
                <option value="">All Neighborhoods</option>
                {filteredNeighborhoods.map((neighborhood) => (
                  <option key={neighborhood.id} value={neighborhood.id}>
                    {neighborhood.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Amenities Section */}
      <div className="mb-6">
        <SectionHeader title="Amenities" section="amenities" />
        
        {expandedSections.amenities && (
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${amenity}`}
                  checked={(filters.amenities || []).includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="h-4 w-4 text-[#1a1b4b] rounded focus:ring-[#1a1b4b]"
                />
                <label
                  htmlFor={`amenity-${amenity}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;