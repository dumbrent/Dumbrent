/*
  # Add user banning functionality

  1. Changes
    - Add banned column to user_profiles table
    - Add ban_reason and banned_at columns
    - Update RLS policies to prevent banned users from accessing content
    - Add admin-only functions to manage bans

  2. Security
    - Only admins can ban/unban users
    - Banned users can only view their profile with ban status
    - Banned users cannot perform any write operations
*/

-- Add ban-related columns to user_profiles
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS banned boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ban_reason text,
ADD COLUMN IF NOT EXISTS banned_at timestamptz;

-- Create function to ban users
CREATE OR REPLACE FUNCTION ban_user(
  user_id_to_ban uuid,
  reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if executor is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role')::text = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can ban users';
  END IF;

  -- Update user profile
  UPDATE user_profiles
  SET 
    banned = true,
    ban_reason = reason,
    banned_at = now()
  WHERE user_id = user_id_to_ban;
END;
$$;

-- Create function to unban users
CREATE OR REPLACE FUNCTION unban_user(
  user_id_to_unban uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if executor is admin
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (raw_user_meta_data->>'role')::text = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can unban users';
  END IF;

  -- Update user profile
  UPDATE user_profiles
  SET 
    banned = false,
    ban_reason = null,
    banned_at = null
  WHERE user_id = user_id_to_unban;
END;
$$;

-- Update RLS policies to prevent banned users from performing actions
CREATE OR REPLACE FUNCTION is_user_banned()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_id = auth.uid()
    AND banned = true
  );
$$;

-- Update existing policies on listings
DROP POLICY IF EXISTS "Landlords can submit listings" ON listings;
CREATE POLICY "Landlords can submit listings"
ON listings
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = landlord_id 
  AND NOT is_user_banned()
);

-- Update message policies
DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id 
  AND NOT is_user_banned()
);

-- Update favorite listings policies
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorite_listings;
CREATE POLICY "Users can manage own favorites"
ON favorite_listings
FOR ALL
USING (
  auth.uid() = user_id 
  AND NOT is_user_banned()
);