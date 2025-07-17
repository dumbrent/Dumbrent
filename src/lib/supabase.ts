import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing Supabase URL. Check your VITE_SUPABASE_URL environment variable.');
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase Anon Key. Check your VITE_SUPABASE_ANON_KEY environment variable.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please check your VITE_SUPABASE_URL environment variable.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false,
    detectSessionInUrl: true,
    storageKey: 'supabase.auth.token',
    flowType: 'implicit',
    debug: import.meta.env.DEV,
  },
  global: {
    fetch: async (...args) => {
      try {
        const response = await fetch(...args);
        
        // If the response is not ok, check if it's a network error
        if (!response.ok) {
          // Check if it's a 404 or similar error that suggests the URL is wrong
          if (response.status === 404) {
            console.error('Supabase project not found. Please verify your VITE_SUPABASE_URL is correct.');
            throw new Error('Supabase project not found. Please check your project URL configuration.');
          }
          
          // For other HTTP errors, provide more context
          console.error(`Supabase HTTP error: ${response.status} ${response.statusText}`);
          throw new Error(`Supabase request failed: ${response.status} ${response.statusText}`);
        }
        
        return response;
      } catch (err: any) {
        // Handle network errors more gracefully
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          console.error('Network error connecting to Supabase. Please check your internet connection and Supabase URL.');
          throw new Error('Unable to connect to Supabase. Please check your internet connection.');
        }
        
        // Handle CORS errors
        if (err.message.includes('CORS')) {
          console.error('CORS error with Supabase. Please check your project configuration.');
          throw new Error('Cross-origin request blocked. Please check your Supabase project settings.');
        }
        
        // Re-throw the error if it's already been processed
        if (err.message.includes('Supabase')) {
          throw err;
        }
        
        console.error('Supabase fetch error:', err);
        throw new Error(`Failed to connect to Supabase: ${err.message}`);
      }
    }
  }
});

// Add error handling for fetch operations
export const handleSupabaseError = (error: unknown) => {
  if (error instanceof Error) {
    console.error('Supabase operation failed:', error.message);
    throw new Error(`Database operation failed: ${error.message}`);
  }
  throw error;
};

// Helper function to construct proper redirect URLs
export const getRedirectUrl = (path: string = '/auth/callback') => {
  // Use the current origin (protocol + hostname + port)
  const origin = window.location.origin;
  
  // Ensure the path starts with /
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  
  // Combine URL and path
  const fullUrl = `${origin}${path}`;
  
  console.log('Constructed redirect URL:', fullUrl);
  console.log('Current origin:', origin);
  console.log('Path:', path);
  
  return fullUrl;
};

// Utility function to completely clear authentication state
export const clearAuthState = async () => {
  try {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all Supabase-related storage
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.expires_at');
    localStorage.removeItem('supabase.auth.refresh_token');
    localStorage.removeItem('supabase.auth.access_token');
    
    // Clear session storage as well
    sessionStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.expires_at');
    sessionStorage.removeItem('supabase.auth.refresh_token');
    sessionStorage.removeItem('supabase.auth.access_token');
    
    // Clear any other potential storage keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('supabase')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Authentication state cleared successfully');
  } catch (error) {
    console.error('Error clearing authentication state:', error);
  }
};

// Function to get a fresh Supabase client instance
export const getFreshSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // Don't persist session for fresh client
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: 'supabase.auth.token.fresh',
      flowType: 'implicit',
      debug: import.meta.env.DEV,
    }
  });
};