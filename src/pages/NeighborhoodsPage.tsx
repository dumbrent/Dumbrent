import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import NeighborhoodCard from '../components/neighborhoods/NeighborhoodCard';
import { neighborhoods, boroughs } from '../data/mockData';
import { Search } from 'lucide-react';

const NeighborhoodsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeBorough, setActiveBorough] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if there's a borough filter in the URL
    const boroughFromUrl = searchParams.get('borough');
    if (boroughFromUrl) {
      setActiveBorough(boroughFromUrl);
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [searchParams]);

  const handleBoroughChange = (boroughId: string) => {
    setActiveBorough(boroughId);
    
    // Update URL parameters
    if (boroughId === 'all') {
      searchParams.delete('borough');
    } else {
      searchParams.set('borough', boroughId);
    }
    setSearchParams(searchParams);
  };

  const filteredNeighborhoods = neighborhoods.filter(neighborhood => {
    const matchesBorough = activeBorough === 'all' || neighborhood.boroughId === activeBorough;
    const matchesSearch = searchQuery === '' || 
      neighborhood.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesBorough && matchesSearch;
  });

  const getBoroughName = (boroughId: string) => {
    const borough = boroughs.find(b => b.id === boroughId);
    return borough ? borough.name : '';
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4f46e5] to-[#4338ca] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explore NYC Neighborhoods
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover the unique character and amenities of New York City's diverse neighborhoods
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search neighborhoods..."
              className="w-full pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4f46e5] text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* Borough Filter */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max">
              <button
                className={`px-4 py-2 rounded-md ${
                  activeBorough === 'all'
                    ? 'bg-[#4f46e5] text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors`}
                onClick={() => handleBoroughChange('all')}
              >
                All Boroughs
              </button>
              
              {boroughs.map(borough => (
                <button
                  key={borough.id}
                  className={`px-4 py-2 rounded-md ${
                    activeBorough === borough.id
                      ? 'bg-[#4f46e5] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } transition-colors`}
                  onClick={() => handleBoroughChange(borough.id)}
                >
                  {borough.name}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-5">
                    <div className="h-6 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-3"></div>
                    <div className="h-16 bg-gray-300 rounded mb-3"></div>
                    <div className="h-6 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNeighborhoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNeighborhoods.map(neighborhood => (
                <NeighborhoodCard 
                  key={neighborhood.id} 
                  neighborhood={neighborhood}
                  borough={getBoroughName(neighborhood.boroughId)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No neighborhoods found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Know Something About Your Neighborhood?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Help us build the most comprehensive neighborhood guide by sharing your local knowledge
          </p>
          <Link 
            to="/submit-highlight" 
            className="inline-block px-6 py-3 bg-[#4f46e5] text-white font-semibold rounded-md hover:bg-[#4f46e5]/90 transition-colors"
          >
            Add a Neighborhood Feature
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default NeighborhoodsPage;