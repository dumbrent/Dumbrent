/*
  # Fix user profiles RLS policies

  1. Changes
    - Add RLS policies for user_profiles table to allow:
      - Users to insert their own profile
      - Users to read their own profile
      - Users to update their own profile
      - Admins to manage all profiles

  2. Security
    - Enable RLS on user_profiles table
    - Add policies for CRUD operations
    - Ensure users can only access their own data
    - Allow admin access to all profiles
*/

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON user_profiles;

-- Create comprehensive policies
CREATE POLICY "Users can view own profile"
ON user_profiles FOR SELECT
TO public
USING (
  auth.uid() = user_id
);

CREATE POLICY "Users can update own profile"
ON user_profiles FOR UPDATE
TO public
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON user_profiles FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all profiles"
ON user_profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND (auth.users.raw_user_meta_data->>'role')::text = 'admin'
  )
);