import { supabase } from './supabase';
import { ListingFormData } from '../types';

export const createListing = async (formData: ListingFormData, customSupabase?: any) => {
  try {
    const client = customSupabase || supabase;
    // Get the current authenticated user
    const { data: { user }, error: userError } = await client.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('User not authenticated');

    // Ensure all required fields are present and correctly formatted
    const requiredFields = [
      'title', 'description', 'price', 'deposit', 'bedrooms', 'bathrooms', 'address',
      'zipCode', 'neighborhoodId', 'boroughId', 'keyFeature', 'availableDate', 'status'
    ];
    for (const field of requiredFields) {
      if (
        formData[field as keyof ListingFormData] === undefined ||
        formData[field as keyof ListingFormData] === null ||
        (typeof formData[field as keyof ListingFormData] === 'string' && (formData[field as keyof ListingFormData] as string).trim() === '')
      ) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Format available_date as YYYY-MM-DD string
    let availableDateStr: string;
    if (formData.availableDate instanceof Date) {
      availableDateStr = formData.availableDate.toISOString().split('T')[0];
    } else if (typeof formData.availableDate === 'string') {
      // Try to parse and reformat if needed
      const d = new Date(formData.availableDate);
      if (!isNaN(d.getTime())) {
        availableDateStr = d.toISOString().split('T')[0];
      } else {
        throw new Error('Invalid available_date format');
      }
    } else {
      throw new Error('Invalid available_date type');
    }

    // Ensure bathrooms is a number
    const bathrooms = Number(formData.bathrooms);
    if (isNaN(bathrooms)) {
      throw new Error('Invalid bathrooms value');
    }
    // Ensure bedrooms is a number
    const bedrooms = Number(formData.bedrooms);
    if (isNaN(bedrooms)) {
      throw new Error('Invalid bedrooms value');
    }
    // Ensure price is a number
    const price = Number(formData.price);
    if (isNaN(price)) {
      throw new Error('Invalid price value');
    }
    // Ensure deposit is a number
    const deposit = Number(formData.deposit);
    if (isNaN(deposit)) {
      throw new Error('Invalid deposit value');
    }
    // Ensure square_feet is a number if present
    let squareFeet = undefined;
    if (formData.squareFeet !== undefined && formData.squareFeet !== null && (typeof formData.squareFeet !== 'string' || formData.squareFeet !== '')) {
      squareFeet = Number(formData.squareFeet);
      if (isNaN(squareFeet)) {
        throw new Error('Invalid square_feet value');
      }
    }
    // Prepare payload
    const payload = {
      title: formData.title,
      description: formData.description,
      price: price,
      deposit: deposit,
      bedrooms: bedrooms,
      bathrooms: bathrooms,
      square_feet: squareFeet,
      address: formData.address,
      zip_code: formData.zipCode,
      neighborhood_id: formData.neighborhoodId,
      borough_id: formData.boroughId,
      key_feature: formData.keyFeature,
      available_date: availableDateStr,
      status: formData.status || 'pending',
      landlord_id: user.id // Add the landlord_id from the authenticated user
    };

    // Validate landlord_id is present and a valid UUID
    if (!user.id || typeof user.id !== 'string' || !/^[0-9a-fA-F-]{36}$/.test(user.id)) {
      throw new Error('Invalid or missing landlord_id (user.id)');
    }
    // Validate available_date is a valid YYYY-MM-DD string
    if (!/^\d{4}-\d{2}-\d{2}$/.test(availableDateStr)) {
      throw new Error('Invalid available_date format, must be YYYY-MM-DD');
    }
    // Log all required fields and their values
    console.log('createListing required fields:', {
      title: formData.title,
      description: formData.description,
      price,
      deposit,
      bedrooms,
      bathrooms,
      address: formData.address,
      zip_code: formData.zipCode,
      neighborhood_id: formData.neighborhoodId,
      borough_id: formData.boroughId,
      key_feature: formData.keyFeature,
      available_date: availableDateStr,
      status: formData.status || 'pending',
      landlord_id: user.id
    });
    // Debug log the payload
    console.log('createListing payload (final):', payload);

    // Start a transaction
    const { data: listing, error: listingError } = await client
      .from('listings')
      .insert(payload)
      .select()
      .single();

    if (listingError) {
      console.error('Supabase insert error:', listingError, 'Payload:', payload);
      throw listingError;
    }

    // Insert images
    const { error: imagesError } = await client
      .from('listing_images')
      .insert(
        formData.images.map((url, index) => ({
          listing_id: listing.id,
          url,
          position: index
        }))
      );

    if (imagesError) throw imagesError;

    // Insert amenities
    const { error: amenitiesError } = await client
      .from('listing_amenities')
      .insert(
        formData.amenities.map(amenity => ({
          listing_id: listing.id,
          amenity
        }))
      );

    if (amenitiesError) throw amenitiesError;

    return listing;
  } catch (error) {
    console.error('Error creating listing:', error);
    throw error;
  }
};

export const createListingOwnerSignup = async (email: string, password: string, displayName: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'listing_owner',
          display_name: displayName
        }
      }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating listing owner account:', error);
    throw error;
  }
};

export const saveDraftListing = async (formData: ListingFormData, customSupabase?: any) => {
  try {
    const client = customSupabase || supabase;
    const { data: { user } } = await client.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const listing = await createListing({
      ...formData,
      status: 'draft'
    }, client);

    return listing;
  } catch (error) {
    console.error('Error saving draft listing:', error);
    throw error;
  }
};

export const publishListing = async (listingId: string) => {
  const { data, error } = await supabase
    .from('listings')
    .update({ status: 'published' })
    .eq('id', listingId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getActiveListings = async (filters = {}) => {
  try {
    // Get current date for subscription check
    const today = new Date().toISOString().split('T')[0];

    // First, get the listing IDs that have active subscriptions
    const { data: activeSubscriptions, error: subscriptionError } = await supabase
      .from('listing_subscriptions')
      .select('listing_id')
      .eq('status', 'active')
      .gte('end_date', today);

    if (subscriptionError) throw subscriptionError;

    // Extract the listing IDs into an array
    const activeListingIds = activeSubscriptions?.map(sub => sub.listing_id) || [];

    // If no active subscriptions, return empty array
    if (activeListingIds.length === 0) {
      return [];
    }

    // Start with the base query
    let query = supabase
      .from('listings')
      .select(`
        *,
        images:listing_images(url),
        amenities:listing_amenities(amenity)
      `)
      .eq('status', 'published')
      .in('id', activeListingIds);

    // Apply filters if provided
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) throw error;

    // Transform database listings to match our Listing type
    return data.map(dbListing => ({
      ...dbListing,
      images: dbListing.images?.map((img: any) => img.url) || [],
      amenities: dbListing.amenities?.map((amenity: any) => amenity.amenity) || [],
      available_date: new Date(dbListing.available_date),
      created_at: new Date(dbListing.created_at),
      updated_at: new Date(dbListing.updated_at)
    }));
  } catch (error) {
    console.error('Error fetching active listings:', error);
    throw error;
  }
};