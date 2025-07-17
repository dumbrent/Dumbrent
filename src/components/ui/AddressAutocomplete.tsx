import React, { useState, useRef, useEffect } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getZipCode,
} from 'use-places-autocomplete';

interface AddressAutocompleteProps {
  onSelect: (address: string, zipCode: string) => void;
  onInputChange?: (address: string) => void;
  value: string;
  className?: string;
  placeholder?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onSelect,
  onInputChange,
  value,
  className = '',
  placeholder = 'Enter an address'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: 'us' },
      bounds: {
        north: 40.917577,
        south: 40.477399,
        east: -73.700272,
        west: -74.259090
      }
    },
    debounce: 300,
    defaultValue: value
  });

  useEffect(() => {
    if (value !== inputValue) {
      setValue(value, false);
    }
  }, [value, setValue, inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsOpen(true);
    
    if (onInputChange) {
      onInputChange(newValue);
    }
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    setIsOpen(false);
    clearSuggestions();

    try {
      console.log('Selected address:', address); // Debug log
      const results = await getGeocode({ address });
      console.log('Geocode results:', results); // Debug log
      
      if (results && results.length > 0) {
        const zipCode = await getZipCode(results[0], false);
        console.log('Extracted zip code:', zipCode); // Debug log
        
        if (zipCode) {
          onSelect(address, zipCode);
        } else {
          // Fallback: try to extract zip code from address
          const zipMatch = address.match(/\b\d{5}\b/);
          const fallbackZip = zipMatch ? zipMatch[0] : '';
          console.log('Using fallback zip code:', fallbackZip); // Debug log
          onSelect(address, fallbackZip);
        }
      } else {
        console.warn('No geocode results found for address:', address);
        // Fallback: try to extract zip code from address
        const zipMatch = address.match(/\b\d{5}\b/);
        const fallbackZip = zipMatch ? zipMatch[0] : '';
        onSelect(address, fallbackZip);
      }
    } catch (error) {
      console.error('Error in address selection:', error);
      // Fallback: try to extract zip code from address
      const zipMatch = address.match(/\b\d{5}\b/);
      const fallbackZip = zipMatch ? zipMatch[0] : '';
      onSelect(address, fallbackZip);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        onFocus={() => setIsOpen(true)}
        disabled={!ready}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a1b4b] ${className}`}
        placeholder={placeholder}
        autoComplete="off"
      />
      {isOpen && status === "OK" && (
        <div className="absolute z-50 w-full mt-1 bg-white shadow-lg rounded-md py-2 max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <div
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressAutocomplete;