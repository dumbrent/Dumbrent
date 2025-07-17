/*
  # Add saved listings for admins

  1. New Tables
    - `admin_saved_listings`
      - Stores listings saved by admins for quick access
      - Includes notes and flags for review

  2. Security
    - Enable RLS
    - Only admins can access this table
*/

CREATE TABLE IF NOT EXISTS admin_saved_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  notes text,
  flagged boolean DEFAULT false,
  flag_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_saved_listings ENABLE ROW LEVEL SECURITY;

-- Only allow admins to access this table
CREATE POLICY "Admins can manage saved listings"
ON admin_saved_listings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role')::text = 'admin'
  )
);

-- Add updated_at trigger
CREATE TRIGGER update_admin_saved_listings_updated_at
  BEFORE UPDATE ON admin_saved_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();