import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ListingCard from '../components/listings/ListingCard';
import NeighborhoodHighlightCard from '../components/neighborhoods/NeighborhoodHighlightCard';
import { Neighborhood, Listing, NeighborhoodHighlight } from '../types';
import { neighborhoods, boroughs, listings, neighborhoodFeatures } from '../data/mockData';
import { MapPin, Building, Plus, ArrowLeft, Clock, ShoppingBag, Ticket, Train, Crown, Utensils, Music, Store, Coffee, Dumbbell, TreePine, School, Landmark } from 'lucide-react';

interface HighlightTypeTab {
  type: string;
  label: string;
  icon: React.ReactNode;
}

const NeighborhoodPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [neighborhood, setNeighborhood] = useState<Neighborhood | null>(null);
  const [borough, setBorough] = useState('');
  const [neighborhoodListings, setNeighborhoodListings] = useState<Listing[]>([]);
  const [highlights, setHighlights] = useState<NeighborhoodHighlight[]>([]);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundNeighborhood = neighborhoods.find(n => n.id === id);
      
      if (foundNeighborhood) {
        setNeighborhood(foundNeighborhood);
        
        const foundBorough = boroughs.find(b => b.id === foundNeighborhood.boroughId);
        setBorough(foundBorough?.name || '');
        
        const filteredListings = listings.filter(l => l.neighborhood_id === id);
        setNeighborhoodListings(filteredListings);
        
        const filteredHighlights = neighborhoodFeatures.filter(f => f.neighborhoodId === id);
        setHighlights(filteredHighlights);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [id]);

  const highlightTypeTabs: HighlightTypeTab[][] = [
    [
      { type: 'all', label: 'All', icon: <MapPin className="h-5 w-5" /> },
      { type: 'restaurants-bars', label: 'Restaurants & Bars', icon: <Utensils className="h-5 w-5" /> },
      { type: 'gyms-fitness', label: 'Gyms & Fitness', icon: <Dumbbell className="h-5 w-5" /> },
      { type: 'happy-hours-brunches', label: 'Happy Hours & Brunches', icon: <Clock className="h-5 w-5" /> }
    ],
    [
      { type: 'shopping-grocery', label: 'Shopping & Grocery', icon: <Store className="h-5 w-5" /> },
      { type: 'museums-art-entertainment', label: 'Arts & Entertainment', icon: <Music className="h-5 w-5" /> },
      { type: 'schools-universities', label: 'Schools', icon: <School className="h-5 w-5" /> },
      { type: 'parks-landmark', label: 'Parks & Landmarks', icon: <TreePine className="h-5 w-5" /> }
    ],
    [
      { type: 'transportation', label: 'Transportation', icon: <Train className="h-5 w-5" /> },
      { type: 'luxury', label: 'Luxury', icon: <Crown className="h-5 w-5" /> },
      { type: 'culture', label: 'Culture', icon: <Landmark className="h-5 w-5" /> }
    ]
  ];

  const filteredHighlights = activeTab === 'all' 
    ? highlights 
    : highlights.filter(highlight => highlight.type === activeTab);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="h-96 bg-gray-300 rounded-lg animate-pulse mb-8"></div>
          <div className="h-10 bg-gray-300 rounded w-1/3 animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-gray-300 h-64 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (!neighborhood) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Neighborhood Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">The neighborhood you're looking for doesn't exist.</p>
          <Link 
            to="/neighborhoods"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Neighborhoods
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Image */}
      <div className="relative h-96">
        <img 
          src={neighborhood?.imageUrl} 
          alt={neighborhood?.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Link 
              to="/neighborhoods"
              className="inline-flex items-center text-white mb-4 hover:underline"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Neighborhoods
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{neighborhood?.name}</h1>
            <div className="flex items-center text-white/90">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{borough}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Neighborhood Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About {neighborhood?.name}</h2>
          <div className="max-w-4xl">
            <p className="text-lg text-gray-700 mb-6">{neighborhood?.description}</p>
            <p className="text-lg text-gray-700">
              {neighborhood?.name} is a vibrant neighborhood located in {borough}, New York City. It offers a diverse mix of cultural attractions, dining options, and residential areas, making it an ideal place to live and explore.
            </p>
          </div>
        </div>
      </section>

      {/* Available Listings */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Available Listings</h2>
            <Link 
              to="/"
              className="text-[#4f46e5] hover:text-[#4f46e5]/90 font-medium"
            >
              View All Listings
            </Link>
          </div>
          
          {neighborhoodListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {neighborhoodListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No listings available</h3>
              <p className="text-gray-600 mb-6">There are currently no available listings in {neighborhood?.name}.</p>
              <Link 
                to="/"
                className="px-6 py-2 bg-[#4f46e5] text-white font-medium rounded-md hover:bg-[#4f46e5]/90 transition-colors"
              >
                Browse Other Areas
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Neighborhood Highlights */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Neighborhood Highlights</h2>
            <Link 
              to="/submit-highlight"
              className="inline-flex items-center text-[#4f46e5] hover:text-[#4f46e5]/90 font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Highlight
            </Link>
          </div>
          
          {/* Highlight Type Tabs */}
          <div className="mb-8">
            <div className="flex flex-col gap-2">
              {highlightTypeTabs.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {row.map(tab => (
                    <button
                      key={tab.type}
                      className={`px-4 py-2 rounded-md flex items-center justify-center ${
                        activeTab === tab.type
                          ? 'bg-[#4f46e5] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } transition-colors`}
                      onClick={() => setActiveTab(tab.type)}
                    >
                      {React.cloneElement(tab.icon as React.ReactElement, {
                        className: `h-5 w-5 ${activeTab === tab.type ? 'text-white' : 'text-gray-500'} mr-2`
                      })}
                      {tab.label}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {filteredHighlights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHighlights.map(highlight => (
                <NeighborhoodHighlightCard key={highlight.id} highlight={highlight} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No highlights yet</h3>
              <p className="text-gray-600 mb-6">
                Be the first to add a {activeTab !== 'all' ? highlightTypeTabs.flat().find(tab => tab.type === activeTab)?.label : 'highlight'} to {neighborhood?.name}!
              </p>
              <Link 
                to="/submit-highlight"
                className="px-6 py-2 bg-[#4f46e5] text-white font-medium rounded-md hover:bg-[#4f46e5]/90 transition-colors"
              >
                Add Neighborhood Highlight
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default NeighborhoodPage;