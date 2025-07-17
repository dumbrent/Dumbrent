import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

// Validate Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key is missing. Payment functionality will be disabled.');
}

if (stripePublishableKey && !stripePublishableKey.startsWith('pk_')) {
  console.warn('Invalid Stripe publishable key format. Key should start with "pk_".');
}

let stripePromise: Promise<any> | null = null;

// Only initialize Stripe if we have a valid key
if (stripePublishableKey && stripePublishableKey.startsWith('pk_')) {
  try {
    stripePromise = loadStripe(stripePublishableKey, {
      // Add options to help with loading issues
      apiVersion: '2023-10-16',
    }).catch(error => {
      console.warn('Stripe.js failed to load. Payment functionality will be disabled.', error.message);
      // Return null instead of throwing to prevent app crashes
      return null;
    });
  } catch (error) {
    console.warn('Failed to initialize Stripe:', error);
    stripePromise = Promise.resolve(null);
  }
} else {
  stripePromise = Promise.resolve(null);
}

export interface CreateSubscriptionParams {
  listingId: string;
  planType: 'monthly' | 'quarterly';
  successUrl?: string;
  cancelUrl?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  description: string;
  features: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 100,
    duration: 30,
    description: 'Get your listing live with monthly recurring billing',
    features: [
      'Listing published for 30 days',
      'Automatic renewal every 30 days',
      'Full listing management',
      'Application tracking',
      'Direct tenant communication',
      'Cancel anytime'
    ]
  },
  {
    id: 'quarterly',
    name: 'Quarterly Plan',
    price: 175,
    duration: 90,
    description: 'Save with our 3-month recurring plan',
    features: [
      'Listing published for 90 days',
      'Automatic renewal every 90 days',
      'Full listing management',
      'Application tracking',
      'Direct tenant communication',
      'Cancel anytime',
      'Better value than monthly'
    ]
  }
];

export const createSubscription = async (params: CreateSubscriptionParams) => {
  try {
    // Check if Stripe is available
    if (!stripePublishableKey) {
      throw new Error('Payment system is not configured. Please contact support.');
    }

    // Get the current user's session
    const { data: { session } } = await supabase.auth.getSession();
    
    // For temp listings (new listing submissions), allow guest payments
    if (params.listingId === 'temp') {
      console.log('Stripe: Creating guest subscription for temp listing');
      
      // Get user email from sessionStorage
      const pendingListingData = sessionStorage.getItem('pending_listing_data');
      if (!pendingListingData) {
        throw new Error('No pending listing data found. Please submit your listing again.');
      }
      
      const { formData } = JSON.parse(pendingListingData);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          listingId: params.listingId,
          planType: params.planType,
          successUrl: params.successUrl || `${window.location.origin}/payment-success`,
          cancelUrl: params.cancelUrl || `${window.location.origin}/submit-listing`,
          guestEmail: formData.email,
          guestName: formData.displayName
        }),
      });

      console.log('Stripe: Response status:', response.status);
      console.log('Stripe: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Stripe function error:', errorData);
        console.error('Stripe: Request body sent:', {
          listingId: params.listingId,
          planType: params.planType,
          guestEmail: formData.email,
          guestName: formData.displayName
        });
        throw new Error(errorData.error || 'Failed to create subscription');
      }

      const { sessionId } = await response.json();
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Payment system failed to load. Please refresh the page and try again.');
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw new Error(error.message);
      }
      
      return;
    }
    
    // For existing listings, require authentication
    if (!session) {
      throw new Error('User not authenticated');
    }

    console.log('Stripe: Creating subscription with session token');

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-subscription`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        listingId: params.listingId,
        planType: params.planType,
        successUrl: params.successUrl || `${window.location.origin}/payment-success`,
        cancelUrl: params.cancelUrl || `${window.location.origin}/submit-listing`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stripe function error:', errorData);
      
      // Handle specific Stripe errors
      if (errorData.error && errorData.error.includes('payment mode')) {
        throw new Error('Payment configuration error. Please contact support.');
      }
      
      throw new Error(errorData.error || 'Failed to create subscription');
    }

    const { sessionId } = await response.json();
    
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Payment system failed to load. Please refresh the page and try again.');
    }

    const { error } = await stripe.redirectToCheckout({
      sessionId,
    });

    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

export const getSubscriptionStatus = async (listingId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/subscription-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ listingId }),
    });

    if (!response.ok) {
      throw new Error('Failed to get subscription status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting subscription status:', error);
    throw error;
  }
};

export { stripePromise };