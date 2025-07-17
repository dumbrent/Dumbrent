/*
  # Fix listing submission policies

  1. Changes
    - Update RLS policies to allow authenticated users to submit listings
    - Fix landlord_id assignment in listing creation
    - Ensure proper permissions for listing owners

  2. Security
    - Maintain existing security model
    - Allow authenticated users to create listings
    - Ensure users can only manage their own listings
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Landlords can submit listings" ON listings;
DROP POLICY IF EXISTS "Landlords can view own listings" ON listings;

-- Create new policies for listing submission
CREATE POLICY "Authenticated users can submit listings"
ON listings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = landlord_id 
  AND NOT is_user_banned()
);

CREATE POLICY "Landlords can view own listings"
ON listings
FOR SELECT
TO authenticated
USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update own listings"
ON listings
FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);