/*
  # Fix get_my_messages function

  1. New Functions
    - `get_my_messages()` - Returns messages for the authenticated user with proper joins
  
  2. Security
    - Function uses RLS and auth.uid() for security
    - Only returns messages where user is sender or recipient
  
  3. Changes
    - Fixes ambiguous column reference error by properly qualifying table columns
    - Returns formatted message data with sender, recipient, and listing information
*/

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS get_my_messages();

-- Create the corrected get_my_messages function
CREATE OR REPLACE FUNCTION get_my_messages()
RETURNS TABLE (
  id uuid,
  content text,
  created_at timestamptz,
  read_at timestamptz,
  conversation_id uuid,
  listing_id uuid,
  sender jsonb,
  recipient jsonb,
  listing jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    m.id,
    m.content,
    m.created_at,
    m.read_at,
    m.conversation_id,
    m.listing_id,
    jsonb_build_object(
      'id', sender_profile.user_id,
      'display_name', sender_profile.display_name
    ) as sender,
    jsonb_build_object(
      'id', recipient_profile.user_id,
      'display_name', recipient_profile.display_name
    ) as recipient,
    CASE 
      WHEN l.id IS NOT NULL THEN
        jsonb_build_object(
          'id', l.id,
          'title', l.title
        )
      ELSE NULL
    END as listing
  FROM messages m
  LEFT JOIN user_profiles sender_profile ON sender_profile.user_id = m.sender_id
  LEFT JOIN user_profiles recipient_profile ON recipient_profile.user_id = m.recipient_id
  LEFT JOIN listings l ON l.id = m.listing_id
  WHERE (m.sender_id = auth.uid() OR m.recipient_id = auth.uid())
  ORDER BY m.created_at DESC;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_my_messages() TO authenticated;