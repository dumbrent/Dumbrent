import { supabase } from './supabase';

// Utility function to validate UUID format
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const saveListingForTenant = async (listingId: string, notes?: string) => {
  try {
    // Validate UUID format before making database call
    if (!isValidUUID(listingId)) {
      throw new Error('Invalid listing ID format');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tenant_saved_listings')
      .insert({
        tenant_id: user.id,
        listing_id: listingId,
        notes: notes || ''
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving listing:', error);
    throw error;
  }
};

export const unsaveListingForTenant = async (listingId: string) => {
  try {
    // Validate UUID format before making database call
    if (!isValidUUID(listingId)) {
      throw new Error('Invalid listing ID format');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('tenant_saved_listings')
      .delete()
      .eq('tenant_id', user.id)
      .eq('listing_id', listingId);

    if (error) throw error;
  } catch (error) {
    console.error('Error unsaving listing:', error);
    throw error;
  }
};

export const checkIfListingIsSaved = async (listingId: string): Promise<boolean> => {
  try {
    // Return false immediately if UUID format is invalid
    if (!isValidUUID(listingId)) {
      return false;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('tenant_saved_listings')
      .select('id')
      .eq('tenant_id', user.id)
      .eq('listing_id', listingId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking if listing is saved:', error);
    return false;
  }
};

export const getTenantSavedListings = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('tenant_saved_listings')
      .select(`
        id,
        notes,
        created_at,
        listings (
          id,
          title,
          description,
          price,
          address,
          bedrooms,
          bathrooms,
          square_feet,
          neighborhood_id,
          borough_id,
          available_date,
          images:listing_images (
            url
          )
        )
      `)
      .eq('tenant_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching saved listings:', error);
    throw error;
  }
};

export const updateSavedListingNotes = async (savedListingId: string, notes: string) => {
  try {
    // Validate UUID format before making database call
    if (!isValidUUID(savedListingId)) {
      throw new Error('Invalid saved listing ID format');
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('tenant_saved_listings')
      .update({ notes })
      .eq('id', savedListingId)
      .eq('tenant_id', user.id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating saved listing notes:', error);
    throw error;
  }
};