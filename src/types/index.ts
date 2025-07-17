export type Borough = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
};

export type Neighborhood = {
  id: string;
  name: string;
  boroughId: string;
  description: string;
  imageUrl: string;
};

export type NeighborhoodHighlight = {
  id: string;
  neighborhoodId: string;
  type: string;
  name: string;
  description: string;
  addedBy: string;
  imageUrl?: string;
  createdAt: Date;
};

export type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  square_feet: number;
  address: string;
  neighborhood_id: string;
  borough_id: string;
  key_feature: string;
  amenities: string[];
  images: string[];
  landlord_id: string;
  available_date: Date;
  created_at: Date;
  updated_at: Date;
  featured?: boolean;
  status: 'draft' | 'pending' | 'published' | 'archived';
};

export type User = {
  id: string;
  displayName: string;
  email: string;
  role: 'tenant' | 'listing_owner' | 'admin';
  createdAt: Date;
};

export type Application = {
  id: string;
  listingId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  moveInDate: Date;
  message: string;
  createdAt: Date;
};

export type FilterOptions = {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minSquareFeet?: number;
  maxSquareFeet?: number;
  boroughId?: string;
  neighborhoodId?: string;
  amenities?: string[];
  availableDate?: Date;
};

export type ListingFormData = {
  title: string;
  price: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet?: number;
  address: string;
  boroughId: string;
  neighborhoodId: string;
  keyFeature: string;
  zipCode: string;
  description: string;
  amenities: string[];
  images: string[];
  displayName: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  preferredContact: 'email' | 'phone' | 'text';
  phone?: string;
  availableDate: Date;
  agreeToTerms: boolean;
  notificationConsent: boolean;
  status?: 'draft' | 'pending' | 'published' | 'archived';
};

export type ListingPreview = {
  listing: Listing;
  landlord: {
    displayName: string;
    email: string;
    preferredContact: string;
    phone?: string;
  };
};

export type SubscriptionPlan = {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
};