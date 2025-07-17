/*
  # Fix Messages Table Foreign Key Relationships

  1. Changes
    - Drop existing policies that depend on the columns
    - Drop existing foreign key constraints
    - Add foreign key constraints
    - Recreate the policies
    
  2. Security
    - Maintain existing security model
    - Users can view their own messages
    - Users can send messages
*/

-- Drop existing policies that depend on the columns
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;

-- Drop existing foreign key constraints if they exist
ALTER TABLE messages
  DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
  DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;

-- Add foreign key constraints
ALTER TABLE messages
  ADD CONSTRAINT messages_sender_id_fkey 
  FOREIGN KEY (sender_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE messages
  ADD CONSTRAINT messages_recipient_id_fkey 
  FOREIGN KEY (recipient_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- Recreate the policies
CREATE POLICY "Users can view own messages"
  ON messages
  FOR SELECT
  USING (
    auth.uid() IN (sender_id, recipient_id) OR
    EXISTS (
      SELECT 1 FROM listings
      WHERE id = listing_id
      AND landlord_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);