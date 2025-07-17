/*
  # Fix recursive RLS policies for users table

  1. Changes
    - Remove recursive admin policies that were causing infinite loops
    - Replace with simplified policies that avoid recursion
    - Maintain same security model but with optimized implementation

  2. Security
    - Users can still only read/update their own data
    - Admins can still manage all users
    - Policies are now more efficient and avoid recursion
*/

-- Drop existing policies to replace them
DROP POLICY IF EXISTS "Admins can read all user data" ON users;
DROP POLICY IF EXISTS "Admins can update any user metadata" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own metadata" ON users;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for users" ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR 
    (SELECT COALESCE((auth.jwt() ->> 'role'::text), '') = 'admin')
  );

CREATE POLICY "Enable update for users" ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = id OR 
    (SELECT COALESCE((auth.jwt() ->> 'role'::text), '') = 'admin')
  )
  WITH CHECK (
    auth.uid() = id OR 
    (SELECT COALESCE((auth.jwt() ->> 'role'::text), '') = 'admin')
  );