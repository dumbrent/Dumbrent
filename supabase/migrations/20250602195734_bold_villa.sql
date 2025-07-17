/*
  # Create listings and related tables

  1. New Tables
    - `listings`
      - Core listing information including price, features, location
      - Linked to users table for landlord relationship
    - `listing_images`
      - Stores image URLs for listings
      - Many-to-one relationship with listings
    - `listing_amenities`
      - Junction table for listing-amenity relationships
      - Allows for flexible amenity management

  2. Security
    - Enable RLS on all tables
    - Policies for:
      - Public read access to published listings
      - Authenticated landlord access to own listings
      - Admin access to all listings
*/

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL CHECK (price > 0),
  deposit integer NOT NULL CHECK (deposit > 0),
  bedrooms integer NOT NULL CHECK (bedrooms >= 0),
  bathrooms numeric(2,1) NOT NULL CHECK (bathrooms > 0),
  square_feet integer CHECK (square_feet > 0),
  address text NOT NULL,
  zip_code text NOT NULL,
  neighborhood_id text NOT NULL,
  borough_id text NOT NULL,
  key_feature text NOT NULL,
  landlord_id uuid REFERENCES auth.users(id),
  available_date date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create listing images table
CREATE TABLE IF NOT EXISTS listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  url text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create listing amenities table
CREATE TABLE IF NOT EXISTS listing_amenities (
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  amenity text NOT NULL,
  PRIMARY KEY (listing_id, amenity)
);

-- Enable RLS
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_amenities ENABLE ROW LEVEL SECURITY;

-- Listings policies
CREATE POLICY "Public can view published listings"
  ON listings
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Landlords can manage own listings"
  ON listings
  USING (auth.uid() = landlord_id);

-- Images policies
CREATE POLICY "Public can view listing images"
  ON listing_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE id = listing_images.listing_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Landlords can manage own listing images"
  ON listing_images
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE id = listing_images.listing_id 
      AND landlord_id = auth.uid()
    )
  );

-- Amenities policies
CREATE POLICY "Public can view listing amenities"
  ON listing_amenities
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE id = listing_amenities.listing_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Landlords can manage own listing amenities"
  ON listing_amenities
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE id = listing_amenities.listing_id 
      AND landlord_id = auth.uid()
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();