/*
  # Add approval system for listings and highlights

  1. Changes
    - Consolidate neighborhood_highlights table
    - Update listings table
    - Add approval status and admin notes
    - Update RLS policies for admin approval

  2. Security
    - Only admins can approve/reject submissions
    - Submitters can view their own pending items
    - Public can only view approved items
*/

-- Drop existing tables
DROP TABLE IF EXISTS neighborhood_features CASCADE;
DROP TABLE IF EXISTS neighborhood_highlights CASCADE;

-- Create consolidated neighborhood_highlights table
CREATE TABLE IF NOT EXISTS neighborhood_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id text NOT NULL REFERENCES neighborhoods(id),
  type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  submitted_by uuid REFERENCES auth.users(id),
  image_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Update listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected', 'archived')),
ADD COLUMN IF NOT EXISTS admin_notes text;

-- Enable RLS
ALTER TABLE neighborhood_highlights ENABLE ROW LEVEL SECURITY;

-- Neighborhood highlights policies
CREATE POLICY "Public can view approved highlights"
  ON neighborhood_highlights
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view own submissions"
  ON neighborhood_highlights
  FOR SELECT
  USING (auth.uid() = submitted_by);

CREATE POLICY "Users can submit highlights"
  ON neighborhood_highlights
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can manage all highlights"
  ON neighborhood_highlights
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Update listings policies
DROP POLICY IF EXISTS "Public can view published listings" ON listings;
DROP POLICY IF EXISTS "Landlords can manage own listings" ON listings;

CREATE POLICY "Public can view approved listings"
  ON listings
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Landlords can view own listings"
  ON listings
  FOR SELECT
  USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can submit listings"
  ON listings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Admins can manage all listings"
  ON listings
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid()
      AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add updated_at trigger to neighborhood_highlights
CREATE TRIGGER update_neighborhood_highlights_updated_at
  BEFORE UPDATE ON neighborhood_highlights
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();