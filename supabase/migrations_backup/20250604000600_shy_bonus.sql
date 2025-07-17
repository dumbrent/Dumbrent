/*
  # Fix user profiles RLS policies
  
  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate RLS policies for user_profiles table
    - Ensure proper access control for users and admins
    
  2. Security
    - Users can manage their own profiles
    - Admins retain full access to all profiles
    - Maintains proper row-level security
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own profile
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO public
USING (auth.uid() = user_id);

-- Allow admins full access
CREATE POLICY "Admins can manage all profiles"
ON user_profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE users.id = auth.uid()
    AND (users.raw_user_meta_data->>'role')::text = 'admin'
  )
);