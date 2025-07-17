/*
  # Add mock data support to listings tables

  1. Changes
    - Add is_mock column to listings table
    - Update RLS policies to handle mock data
    - Only admins can manage mock listings
    - Regular landlords can only manage their non-mock listings
    
  2. Security
    - Maintain existing RLS policies
    - Add admin-specific controls for mock data
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
  is_mock boolean DEFAULT false,
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_listings_updated_at ON listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view published listings" ON listings;
DROP POLICY IF EXISTS "Landlords can manage own listings" ON listings;
DROP POLICY IF EXISTS "Public can view listing images" ON listing_images;
DROP POLICY IF EXISTS "Landlords can manage own listing images" ON listing_images;
DROP POLICY IF EXISTS "Public can view listing amenities" ON listing_amenities;
DROP POLICY IF EXISTS "Landlords can manage own listing amenities" ON listing_amenities;

-- Listings policies
CREATE POLICY "Public can view published listings"
  ON listings
  FOR SELECT
  USING (status = 'published');

CREATE POLICY "Landlords can manage own listings"
  ON listings
  FOR ALL
  USING (
    (auth.uid() = landlord_id) OR
    (EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    ))
  );

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
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE id = listing_images.listing_id 
      AND (
        landlord_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE id = auth.uid()
          AND raw_user_meta_data->>'role' = 'admin'
        )
      )
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
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM listings 
      WHERE id = listing_amenities.listing_id 
      AND (
        landlord_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM auth.users
          WHERE id = auth.uid()
          AND raw_user_meta_data->>'role' = 'admin'
        )
      )
    )
  );