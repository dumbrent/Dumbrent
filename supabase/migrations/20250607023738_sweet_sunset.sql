/*
  # Add applications table for tenant applications

  1. New Tables
    - `applications`
      - Stores tenant applications for listings
      - Tracks application status and details
      - Prevents duplicate applications per user/listing

  2. Security
    - Enable RLS
    - Users can only see their own applications
    - Landlords can see applications for their listings
    - Admins can see all applications
*/

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  tenant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  landlord_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  move_in_date date NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(listing_id, tenant_id) -- Prevent duplicate applications
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Tenants can view their own applications
CREATE POLICY "Tenants can view own applications"
ON applications
FOR SELECT
TO authenticated
USING (auth.uid() = tenant_id);

-- Tenants can submit applications
CREATE POLICY "Tenants can submit applications"
ON applications
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = tenant_id 
  AND NOT is_user_banned()
);

-- Landlords can view applications for their listings
CREATE POLICY "Landlords can view applications for own listings"
ON applications
FOR SELECT
TO authenticated
USING (auth.uid() = landlord_id);

-- Landlords can update application status
CREATE POLICY "Landlords can update application status"
ON applications
FOR UPDATE
TO authenticated
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications"
ON applications
FOR SELECT
TO authenticated
USING (is_admin());

-- Add updated_at trigger
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();