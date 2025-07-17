import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ListingGrid from '../components/listings/ListingGrid';
import FilterSidebar from '../components/ui/FilterSidebar';
import { FilterOptions, Listing } from '../types';
import { listings, boroughs, createTestListing } from '../data/mockData';
import { Filter, X, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getActiveListings } from '../lib/listings';

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [filteredListings, setFilteredListings] = useState<Listing[]>(listings);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [dbListings, setDbListings] = useState<Listing[]>([]);
  const [showCreateTestButton, setShowCreateTestButton] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);
  const [testListingId, setTestListingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setShowCreateTestButton(!!session);
    };
    
    checkAuth();
    loadListings();
  }, []);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      // Load active listings from database
      const activeListings = await getActiveListings();
      setDbListings(activeListings);
      
      // Combine with mock listings
      const allListings = [...activeListings, ...listings];
      setFilteredListings(sortListings(allListings, sortBy));
    } catch (error) {
      console.error('Error loading listings:', error);
      // Fallback to mock data if database query fails
      setFilteredListings(sortListings(listings, sortBy));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestListing = async () => {
    setIsCreatingTest(true);
    try {
      const listingId = await createTestListing();
      if (listingId) {
        setTestListingId(listingId);
        // Reload listings to include the new test listing
        await loadListings();
        alert('Test listing created successfully! You can now apply to this listing to test the application system.');
      } else {
        alert('Failed to create test listing. Please try again.');
      }
    } catch (error) {
      console.error('Error creating test listing:', error);
      alert('Error creating test listing: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsCreatingTest(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = [...dbListings, ...listings];

    if (filters.minPrice) {
      result = result.filter(listing => listing.price >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      result = result.filter(listing => listing.price <= filters.maxPrice!);
    }

    if (filters.bedrooms !== undefined) {
      result = result.filter(listing => listing.bedrooms === filters.bedrooms);
    }

    if (filters.bathrooms !== undefined) {
      result = result.filter(listing => listing.bathrooms === filters.bathrooms);
    }

    if (filters.boroughId) {
      result = result.filter(listing => listing.borough_id === filters.boroughId);
    }

    if (filters.neighborhoodId) {
      result = result.filter(listing => listing.neighborhood_id === filters.neighborhoodId);
    }

    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter(listing => 
        filters.amenities!.every(amenity => listing.amenities.includes(amenity))
      );
    }

    // Apply sorting
    result = sortListings(result, sortBy);

    setFilteredListings(result);
  }, [filters, sortBy, dbListings]);

  const sortListings = (listingsToSort: Listing[], sortType: string): Listing[] => {
    const sorted = [...listingsToSort];
    
    switch (sortType) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect NYC Apartment
            </h1>
            <p className="text-xl mb-8">
              Discover rental listings with detailed neighborhood insights across all five boroughs
            </p>
            <div className="flex justify-center gap-4">
              <a 
                href="#listings" 
                className="px-6 py-3 bg-white text-[#4f46e5] font-semibold rounded-md hover:bg-gray-100 transition-colors"
              >
                View Listings
              </a>
              <Link 
                to="/neighborhoods"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
              >
                Explore Neighborhoods
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section id="listings" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Listings</h2>
            
            <div className="flex items-center gap-2">
              {showCreateTestButton && (
                <button
                  onClick={handleCreateTestListing}
                  disabled={isCreatingTest}
                  className="md:flex items-center px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors hidden"
                >
                  {isCreatingTest ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Create Test Listing
                    </>
                  )}
                </button>
              )}
              
              {testListingId && (
                <Link 
                  to={`/listing/${testListingId}`}
                  className="md:flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors hidden"
                >
                  View Test Listing
                </Link>
              )}
              
              <button
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-700"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <FilterSidebar 
              filters={filters}
              onFilterChange={setFilters}
              className="hidden md:block md:w-80 flex-shrink-0 sticky top-24 self-start"
            />
            
            {/* Mobile Filters Overlay */}
            {showMobileFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden">
                <div className="bg-white h-full w-4/5 max-w-sm overflow-auto animate-slide-in-right">
                  <FilterSidebar 
                    filters={filters}
                    onFilterChange={setFilters}
                    isMobile={true}
                    onClose={() => setShowMobileFilters(false)}
                  />
                </div>
              </div>
            )}
            
            {/* Listings */}
            <div className="flex-1">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">
                  {filteredListings.length} {filteredListings.length === 1 ? 'listing' : 'listings'} found
                </p>
                
                <div className="flex items-center">
                  <label className="mr-2 text-gray-700">Sort by:</label>
                  <select 
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5]"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              <ListingGrid listings={filteredListings} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#4f46e5] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Are You a Landlord?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            List your property on Dumb Rent and connect with qualified tenants looking for their next home.
          </p>
          <a 
            href="/submit-listing" 
            className="inline-block px-6 py-3 bg-white text-[#4f46e5] font-semibold rounded-md hover:bg-gray-100 transition-colors"
          >
            Submit a Listing
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;