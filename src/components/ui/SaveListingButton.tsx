import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { saveListingForTenant, unsaveListingForTenant, checkIfListingIsSaved } from '../../lib/savedListings';
import { isMockListingId } from '../../data/mockData';

interface SaveListingButtonProps {
  listingId: string;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SaveListingButton: React.FC<SaveListingButtonProps> = ({ 
  listingId, 
  className = '', 
  showText = false,
  size = 'md'
}) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMockListing, setIsMockListing] = useState(false);

  useEffect(() => {
    // Check if this is a mock listing
    const mockListing = isMockListingId(listingId);
    setIsMockListing(mockListing);
    
    // Only check auth and saved status for real listings
    if (!mockListing) {
      checkAuthAndSavedStatus();
    } else {
      // For mock listings, just check authentication
      checkAuthentication();
    }
  }, [listingId]);

  const checkAuthentication = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    } catch (error) {
      console.error('Error checking authentication:', error);
    }
  };

  const checkAuthAndSavedStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        const saved = await checkIfListingIsSaved(listingId);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error('Error checking auth and saved status:', error);
    }
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Prevent saving mock listings
    if (isMockListing) {
      alert('This is a demo listing and cannot be saved. Please browse real listings to use the save feature.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSaved) {
        await unsaveListingForTenant(listingId);
        setIsSaved(false);
      } else {
        await saveListingForTenant(listingId);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save status:', error);
      alert('Failed to update saved status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base'
  };

  // For mock listings, show a disabled state
  const isDisabled = isMockListing || isLoading;
  const buttonTitle = isMockListing 
    ? 'Demo listing - saving not available' 
    : (isSaved ? 'Remove from saved' : 'Save listing');

  return (
    <button
      onClick={handleSaveToggle}
      disabled={isDisabled}
      className={`
        ${showText ? 'flex items-center' : buttonSizeClasses[size]} 
        ${showText ? 'px-4 py-2' : 'rounded-full'} 
        transition-all 
        duration-200 
        ${isSaved 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
        }
        ${isDisabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-110'
        }
        ${showText ? 'rounded-md border border-gray-300' : ''}
        ${isMockListing ? 'opacity-60' : ''}
        ${className}
      `}
      title={buttonTitle}
    >
      <Heart 
        className={`${sizeClasses[size]} ${isSaved ? 'fill-current' : ''} ${showText ? 'mr-2' : ''}`} 
      />
      {showText && (
        <span className={`font-medium ${textSizeClasses[size]}`}>
          {isMockListing ? 'Demo Listing' : (isSaved ? 'Saved' : 'Save Listing')}
        </span>
      )}
    </button>
  );
};

export default SaveListingButton;