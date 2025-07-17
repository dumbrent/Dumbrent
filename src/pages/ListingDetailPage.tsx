import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import SaveListingButton from '../components/ui/SaveListingButton';
import ListingMap from '../components/maps/ListingMap';
import { Listing, NeighborhoodHighlight } from '../types';
import { listings, neighborhoods, boroughs, neighborhoodFeatures, featureTypes } from '../data/mockData';
import { MapPin, Bed, Bath, Square, Calendar, Home, DollarSign, CheckSquare, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ApplicationFormData {
  fullName: string;
  email: string;
  phone: string;
  moveInDate: string;
  message: string;
}

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [neighborhood, setNeighborhood] = useState('');
  const [borough, setBorough] = useState('');
  const [highlights, setHighlights] = useState<NeighborhoodHighlight[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: '',
    email: '',
    phone: '',
    moveInDate: '',
    message: ''
  });

  useEffect(() => {
    checkAuthAndLoadData();
  }, [id]);

  const checkAuthAndLoadData = async () => {
    try {
      // Check authentication
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      // First try to load from database
      let foundListing = null;
      let isFromDatabase = false;

      if (id) {
        try {
          const { data: dbListing, error } = await supabase
            .from('listings')
            .select(`
              *,
              images:listing_images(url),
              amenities:listing_amenities(amenity)
            `)
            .eq('id', id)
            .eq('status', 'published')
            .single();

          if (!error && dbListing) {
            // Transform database listing to match our Listing type
            foundListing = {
              ...dbListing,
              images: dbListing.images?.map((img: any) => img.url) || [],
              amenities: dbListing.amenities?.map((amenity: any) => amenity.amenity) || [],
              available_date: new Date(dbListing.available_date),
              created_at: new Date(dbListing.created_at),
              updated_at: new Date(dbListing.updated_at)
            };
            isFromDatabase = true;
            console.log('Loaded listing from database:', foundListing);
          }
        } catch (error) {
          console.log('Error loading from database, will try mock data:', error);
        }
      }

      // If not found in database, try mock data
      if (!foundListing) {
        foundListing = listings.find(l => l.id === id) || null;
        if (foundListing) {
          console.log('Loaded listing from mock data:', foundListing);
        }
      }
      
      if (foundListing) {
        setListing(foundListing);
        
        const foundNeighborhood = neighborhoods.find(n => n.id === foundListing.neighborhood_id);
        setNeighborhood(foundNeighborhood?.name || '');
        
        const foundBorough = boroughs.find(b => b.id === foundListing.borough_id);
        if (foundBorough) {
          setBorough(foundBorough.name);
        }

        const foundHighlights = neighborhoodFeatures.filter(h => h.neighborhoodId === foundListing.neighborhood_id);
        setHighlights(foundHighlights);

        // Check if user has already applied (only if authenticated and listing exists in database)
        if (session?.user && isFromDatabase) {
          try {
            // Use .maybeSingle() instead of .single() to handle zero rows gracefully
            const { data: existingApplication, error } = await supabase
              .from('applications')
              .select('id, status, created_at')
              .eq('listing_id', id)
              .eq('tenant_id', session.user.id)
              .maybeSingle();

            if (error) {
              console.error('Error checking existing application:', error.message);
            } else if (existingApplication) {
              setHasApplied(true);
              setApplicationStatus(existingApplication.status);
            }
          } catch (error) {
            console.error('Error checking existing application:', error);
          }
        }

        // Pre-fill form with user data if authenticated
        if (session?.user) {
          // Get user profile data
          try {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('display_name')
              .eq('user_id', session.user.id)
              .single();

            setFormData(prev => ({
              ...prev,
              email: session.user.email || '',
              fullName: profile?.display_name || ''
            }));
          } catch (error) {
            console.error('Error loading user profile:', error);
            setFormData(prev => ({
              ...prev,
              email: session.user.email || ''
            }));
          }
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data:', error);
      setIsLoading(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || !listing) {
        throw new Error('User not authenticated or listing not found');
      }

      console.log('Submitting application for listing:', listing.id);
      console.log('Form data:', formData);

      // For real listings, submit to database
      console.log('Submitting real application to database...');
      
      // First, get the landlord_id from the listing
      const { data: dbListing, error: listingError } = await supabase
        .from('listings')
        .select('landlord_id, title, address')
        .eq('id', listing.id)
        .single();

      if (listingError) {
        console.error('Error fetching listing from database:', listingError);
        throw new Error('This listing is not available for applications');
      }

      if (!dbListing) {
        throw new Error('Listing not found in database');
      }

      console.log('Found listing in database:', dbListing);

      // Submit the application
      const { data: applicationData, error } = await supabase
        .from('applications')
        .insert({
          listing_id: listing.id,
          tenant_id: session.user.id,
          landlord_id: dbListing.landlord_id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          move_in_date: formData.moveInDate,
          message: formData.message || null
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        if (error.code === '23505') { // Unique constraint violation
          throw new Error('You have already applied for this listing');
        }
        throw new Error(`Failed to submit application: ${error.message}`);
      }

      console.log('Application submitted successfully:', applicationData);

      // Create a message thread for the application
      const conversationId = crypto.randomUUID();
      
      const messageContent = `New Application for ${dbListing.title}

Applicant: ${formData.fullName}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
Desired Move-in Date: ${new Date(formData.moveInDate).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long', 
  day: 'numeric'
})}

${formData.message ? `Message from applicant:\n${formData.message}` : 'No additional message provided.'}

---
This message was automatically generated from a rental application. You can reply to communicate directly with the applicant.`;

      // Send message to landlord
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: session.user.id,
          recipient_id: dbListing.landlord_id,
          listing_id: listing.id,
          content: messageContent
        });

      if (messageError) {
        console.error('Error creating application message:', messageError);
        // Don't fail the application if message creation fails
      } else {
        console.log('Application message sent to landlord');
      }

      // Send email notification to tenant
      try {
        const emailResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            tenantName: formData.fullName,
            tenantEmail: formData.email,
            listingTitle: dbListing.title,
            listingAddress: dbListing.address,
            moveInDate: formData.moveInDate,
            message: formData.message,
            listingUrl: `${window.location.origin}/listing/${listing.id}`
          }),
        });

        if (emailResponse.ok) {
          console.log('Confirmation email sent successfully');
        } else {
          console.error('Failed to send confirmation email');
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }

      // Show success state
      setApplicationSubmitted(true);
      setHasApplied(true);
      setApplicationStatus('pending');
      setShowApplicationForm(false);
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Provide more specific error message
      let errorMessage = 'Failed to submit application. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('already applied')) {
          errorMessage = 'You have already applied for this listing.';
        } else if (error.message.includes('not available')) {
          errorMessage = 'This listing is no longer available for applications.';
        } else if (error.message.includes('not authenticated')) {
          errorMessage = 'Please log in to submit an application.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' }).replace('.00', '');
  };

  const formatDate = (date: Date | string) => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('en-US', { 
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  // Group highlights by type and get up to 6 random items per category
  const getHighlightsByType = () => {
    const groupedHighlights: Record<string, NeighborhoodHighlight[]> = {};
    
    featureTypes.forEach(type => {
      const typeHighlights = highlights.filter(h => h.type === type);
      if (typeHighlights.length > 0) {
        // Shuffle array and take up to 6 items
        groupedHighlights[type] = typeHighlights
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
      }
    });

    return groupedHighlights;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="h-96 bg-gray-300 rounded-lg animate-pulse mb-8"></div>
          <div className="h-10 bg-gray-300 rounded w-1/3 animate-pulse mb-4"></div>
          <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-64 bg-gray-300 rounded-lg animate-pulse mb-6"></div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-3"></div>
              <div className="h-6 bg-gray-300 rounded animate-pulse mb-3"></div>
            </div>
            <div className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!listing) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Listing Not Found</h2>
          <p className="text-xl text-gray-600 mb-8">The listing you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse All Listings
          </Link>
        </div>
      </Layout>
    );
  }

  const groupedHighlights = getHighlightsByType();

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <Link 
            to="/"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Listings
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">{listing.title}</h1>
          </div>
          
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin className="h-5 w-5 mr-1" />
            <span>{listing.address}, {neighborhood}, {borough}</span>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-blue-600 mr-1" />
              <span className="text-2xl font-bold text-blue-600">{formatPrice(listing.price)}</span>
              <span className="text-gray-500">/month</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Bed className="h-5 w-5 mr-1" />
              <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Bath className="h-5 w-5 mr-1" />
              <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</span>
            </div>
            
            {listing.square_feet && (
              <div className="flex items-center text-gray-700">
                <Square className="h-5 w-5 mr-1" />
                <span>{listing.square_feet.toLocaleString()} sq ft</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-1" />
              <span>Available {formatDate(listing.available_date)}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative h-96 rounded-lg overflow-hidden mb-2">
                <img 
                  src={listing.images[activeImage]} 
                  alt={`${listing.title} - Image ${activeImage + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    className={`h-20 w-32 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                      index === activeImage ? 'border-blue-600' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img 
                      src={image} 
                      alt={`Thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {listing.description}
              </p>
            </div>
            
            {/* Amenities */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {listing.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <CheckSquare className="h-5 w-5 text-blue-600 mr-2" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Neighborhood Highlights */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{neighborhood} Highlights</h2>
              
              {Object.entries(groupedHighlights).map(([type, typeHighlights]) => (
                <div key={type} className="mb-6">
                  <ul className="space-y-3">
                    {typeHighlights.map(highlight => (
                      <li key={highlight.id} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <div>
                          <h4 className="font-medium text-gray-800">{highlight.name}</h4>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Location Map */}
            <div className="mb-8">
              <ListingMap 
                address={listing.address}
                title={listing.title}
              />
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              {applicationSubmitted ? (
                <div className="text-center">
                  <div className="bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
                  <p className="text-gray-600 mb-4">
                    Thank you for your application. You'll receive a confirmation email shortly, and the landlord will review it and get back to you soon.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor('pending')}`}>
                        Pending Review
                      </span>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      You can track your application status in your profile.
                    </p>
                  </div>
                  <Link 
                    to="/profile?tab=applications"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
                  >
                    View My Applications
                  </Link>
                </div>
              ) : hasApplied ? (
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Application Status</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-600 mb-2">You have already applied for this apartment.</p>
                    <p className="text-sm text-gray-600">
                      <strong>Status:</strong> <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(applicationStatus || 'pending')}`}>
                        {applicationStatus ? applicationStatus.charAt(0).toUpperCase() + applicationStatus.slice(1) : 'Pending'}
                      </span>
                    </p>
                  </div>
                  <Link 
                    to="/profile?tab=applications"
                    className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-md hover:bg-gray-200 transition-colors inline-block text-center"
                  >
                    View Application Details
                  </Link>
                </div>
              ) : showApplicationForm ? (
                <form onSubmit={handleApplicationSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Apply for this Apartment</h3>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Phone</label>
                    <input 
                      type="tel" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Move-in Date *</label>
                    <input 
                      type="date" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.moveInDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, moveInDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-1">Message</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      placeholder="Introduce yourself and ask any questions you may have"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="w-full py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Interested in this property?</h3>
                  <p className="text-gray-600 mb-6">
                    Apply now to schedule a viewing or secure this apartment before it's gone!
                  </p>
                  
                  {/* Save Button moved here */}
                  <div className="mb-4">
                    <SaveListingButton listingId={listing.id} size="lg" showText className="w-full justify-center" />
                  </div>
                  
                  {isAuthenticated ? (
                    <button 
                      onClick={() => setShowApplicationForm(true)}
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors mb-4"
                    >
                      Apply for this Apartment
                    </button>
                  ) : (
                    <Link 
                      to="/login"
                      className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors mb-4 inline-block text-center"
                    >
                      Sign In to Apply
                    </Link>
                  )}
                </>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center mb-4">
                  <Home className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-500">Listed on {formatDate(listing.created_at)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Listing ID: {listing.id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ListingDetailPage;