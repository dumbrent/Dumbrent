/*
  # Update admin policies for listings and highlights

  1. Changes
    - Drop existing policies
    - Create new admin policies with updated names
    - Ensure proper role checking
    
  2. Security
    - Maintain RLS
    - Add admin-specific controls
*/

-- Drop existing admin policies if they exist
DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage all highlights" ON neighborhood_highlights;
DROP POLICY IF EXISTS "Admins can manage listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage highlights" ON neighborhood_highlights;

-- Create admin policy for listings with unique name
CREATE POLICY "Admins full access to listings"
ON listings
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);

-- Create admin policy for neighborhood highlights with unique name
CREATE POLICY "Admins full access to highlights"
ON neighborhood_highlights
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);