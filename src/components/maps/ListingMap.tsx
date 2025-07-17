import React, { useEffect, useRef, useState } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

interface ListingMapProps {
  zipCode?: string;
  address?: string;
  title?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const ListingMap: React.FC<ListingMapProps> = ({ zipCode, address, title }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    if (!address && !zipCode) {
      setError('No address or zip code provided');
      setIsLoading(false);
      return;
    }
    initializeMap();
  }, [address, zipCode]);

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!window.google || !window.google.maps) {
        setError('Google Maps failed to load. Please refresh the page.');
        setIsLoading(false);
        return;
      }

      const geocoder = new window.google.maps.Geocoder();
      const geocodeAddress = address || (zipCode ? `${zipCode}, New York, NY, USA` : '');
      if (!geocodeAddress) {
        setError('No address or zip code provided');
        setIsLoading(false);
        return;
      }
      geocoder.geocode(
        { address: geocodeAddress },
        (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            createMap(location);
          } else {
            console.error('Geocoding failed:', status);
            setError('Unable to locate this address on the map');
            setIsLoading(false);
          }
        }
      );
    } catch (err) {
      console.error('Map initialization error:', err);
      setError('Failed to initialize map');
      setIsLoading(false);
    }
  };

  const createMap = (location: any) => {
    if (!mapRef.current) return;

    try {
      // Create the map
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: location,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          },
          {
            featureType: 'transit',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      // Add a circle to show the general area (radius of about 0.5 miles)
      const circle = new window.google.maps.Circle({
        strokeColor: '#4f46e5',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#4f46e5',
        fillOpacity: 0.15,
        map: map,
        center: location,
        radius: 800 // 800 meters (approximately 0.5 miles)
      });

      // Add a marker at the center
      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: title || `Property in ${zipCode}`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#4f46e5" stroke="white" stroke-width="3"/>
              <path d="M16 8C13.2386 8 11 10.2386 11 13C11 17 16 23 16 23S21 17 21 13C21 10.2386 18.7614 8 16 8ZM16 15C14.8954 15 14 14.1046 14 13C14 11.8954 14.8954 11 16 11C17.1046 11 18 11.8954 18 13C18 14.1046 17.1046 15 16 15Z" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      // Create info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
              ${title || 'Property Location'}
            </h4>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">
              ${address || `Located in ${zipCode}`}
            </p>
            <p style="margin: 0; color: #9ca3af; font-size: 11px;">
              Approximate location within ${zipCode}
            </p>
          </div>
        `
      });

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      setMapInstance(map);
      setIsLoading(false);
    } catch (err) {
      console.error('Error creating map:', err);
      setError('Failed to create map');
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Map Unavailable</h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <MapPin className="h-6 w-6 text-[#4f46e5] mr-3" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">Location</h3>
            <p className="text-gray-600">
              {address ? address : zipCode ? `General area in ${zipCode}` : 'No location provided'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4f46e5] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full h-96"
          style={{ minHeight: '384px' }}
        />
        
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
          <p className="text-xs text-gray-600">
            <MapPin className="h-3 w-3 inline mr-1" />
            Approximate location for privacy
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          The exact address will be shared after your application is approved
        </p>
      </div>
    </div>
  );
};

export default ListingMap;