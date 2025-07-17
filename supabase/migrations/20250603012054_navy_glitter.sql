/*
  # Fix admin access and role checking

  1. Changes
    - Add get_user_role function for secure role checking
    - Update RLS policies to use the new function
    - Ensure proper access control for admin dashboard

  2. Security
    - Function runs with SECURITY DEFINER to access auth schema
    - Proper search_path set to prevent search path injection
*/

-- Create function to safely get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role')::text
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$;

-- Update RLS policies to use the new function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT get_user_role() = 'admin';
$$;

-- Update listings policies
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
DROP POLICY IF EXISTS "Admins full access to listings" ON listings;

CREATE POLICY "Admins can view all listings"
ON listings
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins full access to listings"
ON listings
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Update neighborhood_highlights policies
DROP POLICY IF EXISTS "Admins can view all highlights" ON neighborhood_highlights;
DROP POLICY IF EXISTS "Admins full access to highlights" ON neighborhood_highlights;

CREATE POLICY "Admins can view all highlights"
ON neighborhood_highlights
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins full access to highlights"
ON neighborhood_highlights
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());