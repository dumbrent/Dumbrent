import { supabase } from './supabase';

export interface ApplicationData {
  listingId: string;
  fullName: string;
  email: string;
  phone?: string;
  moveInDate: string;
  message?: string;
}

export const submitApplication = async (applicationData: ApplicationData) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Get the landlord_id from the listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('landlord_id, title, address')
      .eq('id', applicationData.listingId)
      .single();

    if (listingError) throw listingError;
    if (!listing) throw new Error('Listing not found');

    // Insert the application
    const { data, error } = await supabase
      .from('applications')
      .insert({
        listing_id: applicationData.listingId,
        tenant_id: user.id,
        landlord_id: listing.landlord_id,
        full_name: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone || null,
        move_in_date: applicationData.moveInDate,
        message: applicationData.message || null
      })
      .select()
      .single();

    if (error) throw error;

    // Create a message thread for the application
    const conversationId = crypto.randomUUID();
    
    // Create the application message content
    const messageContent = `New Application for ${listing.title}

Applicant: ${applicationData.fullName}
Email: ${applicationData.email}
${applicationData.phone ? `Phone: ${applicationData.phone}` : ''}
Desired Move-in Date: ${new Date(applicationData.moveInDate).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long', 
  day: 'numeric'
})}

${applicationData.message ? `Message from applicant:\n${applicationData.message}` : 'No additional message provided.'}

---
This message was automatically generated from a rental application. You can reply to communicate directly with the applicant.`;

    // Send message to landlord
    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        recipient_id: listing.landlord_id,
        listing_id: applicationData.listingId,
        content: messageContent
      });

    if (messageError) {
      console.error('Error creating application message:', messageError);
      // Don't fail the application if message creation fails
    }

    // Send confirmation email to tenant
    try {
      await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-application-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          tenantName: applicationData.fullName,
          tenantEmail: applicationData.email,
          listingTitle: listing.title,
          listingAddress: listing.address,
          moveInDate: applicationData.moveInDate,
          message: applicationData.message,
          listingUrl: `${window.location.origin}/listing/${applicationData.listingId}`
        }),
      });
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the application if email fails
    }

    return data;
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
};

export const checkExistingApplication = async (listingId: string) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('applications')
      .select('id, status, created_at')
      .eq('listing_id', listingId)
      .eq('tenant_id', user.id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error checking existing application:', error);
    throw error;
  }
};

export const getUserApplications = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    console.log('Fetching applications for user:', user.id);

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        listings (
          id,
          title,
          address,
          price,
          neighborhood_id,
          borough_id,
          images:listing_images (
            url
          )
        )
      `)
      .eq('tenant_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error fetching applications:', error);
      throw error;
    }

    console.log('Applications data from database:', data);
    return data;
  } catch (error) {
    console.error('Error fetching user applications:', error);
    throw error;
  }
};