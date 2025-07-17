/*
  # Fix admin access and role checking

  1. Changes
    - Add is_admin helper function
    - Update RLS policies to use the helper function
    - Fix permission issues with users table
*/

-- Create is_admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role')::text = 'admin'
  );
$$;

-- Grant access to auth.users for the is_admin function
GRANT SELECT ON auth.users TO authenticated;

-- Update listings policies
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
CREATE POLICY "Admins can view all listings"
ON listings
FOR SELECT
TO authenticated
USING (is_admin());

-- Update neighborhood_highlights policies
DROP POLICY IF EXISTS "Admins can view all highlights" ON neighborhood_highlights;
CREATE POLICY "Admins can view all highlights"
ON neighborhood_highlights
FOR SELECT
TO authenticated
USING (is_admin());