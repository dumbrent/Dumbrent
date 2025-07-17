/*
  # Fix Messages Table Foreign Keys

  1. Changes
    - Add foreign key constraints to link messages table with auth.users table
    - Update RLS policies to use auth.users instead of public.users

  2. Security
    - Maintain existing RLS policies
    - Update policy definitions to work with auth.users table
*/

-- Drop existing foreign keys if they exist
ALTER TABLE IF EXISTS public.messages
DROP CONSTRAINT IF EXISTS messages_sender_id_fkey,
DROP CONSTRAINT IF EXISTS messages_recipient_id_fkey;

-- Add correct foreign key constraints to auth.users
ALTER TABLE public.messages
ADD CONSTRAINT messages_sender_id_fkey
FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT messages_recipient_id_fkey
FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update the messages query in ProfilePage to use auth.users metadata
CREATE OR REPLACE FUNCTION get_user_display_name(user_id uuid)
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT COALESCE(raw_user_meta_data->>'display_name', email)
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;