/*
  # Fix admin permissions for listings and highlights

  1. Changes
    - Update RLS policies for listings and neighborhood_highlights tables
    - Add policies to allow admins to view all submissions
    - Fix permission denied errors for admin dashboard

  2. Security
    - Policies now check user role from JWT claims
    - Maintains existing public and authenticated user policies
    - Ensures proper admin access control
*/

-- Update listings policies for admin access
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
DROP POLICY IF EXISTS "Admins full access to listings" ON listings;

CREATE POLICY "Admins can view all listings"
ON listings
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admins full access to listings"
ON listings
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

-- Update neighborhood_highlights policies for admin access
DROP POLICY IF EXISTS "Admins can view all highlights" ON neighborhood_highlights;
DROP POLICY IF EXISTS "Admins full access to highlights" ON neighborhood_highlights;

CREATE POLICY "Admins can view all highlights"
ON neighborhood_highlights
FOR SELECT
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
);

CREATE POLICY "Admins full access to highlights"
ON neighborhood_highlights
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);