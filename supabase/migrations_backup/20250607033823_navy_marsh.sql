/*
  # Fix messages relationships with secure function approach

  1. Changes
    - Create a secure function to get messages with user information
    - Function handles all the complex joins internally
    - Maintains proper security by checking user permissions
    - Returns properly formatted JSON structure

  2. Security
    - Function runs with SECURITY DEFINER to access all tables
    - Built-in permission checks ensure users only see their own messages
    - Landlords can see messages related to their listings
*/

-- Create a secure function to get messages with user profiles
CREATE OR REPLACE FUNCTION get_user_messages(user_id uuid)
RETURNS TABLE (
  id uuid,
  conversation_id uuid,
  content text,
  created_at timestamptz,
  read_at timestamptz,
  sender_id uuid,
  recipient_id uuid,
  listing_id uuid,
  sender json,
  recipient json,
  listing json
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the requesting user has permission to view messages
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Access denied: You can only view your own messages';
  END IF;

  RETURN QUERY
  SELECT 
    m.id,
    m.conversation_id,
    m.content,
    m.created_at,
    m.read_at,
    m.sender_id,
    m.recipient_id,
    m.listing_id,
    -- Sender information
    json_build_object(
      'id', s.id,
      'user_profiles', CASE 
        WHEN sp.display_name IS NOT NULL THEN
          json_build_object('display_name', sp.display_name)
        ELSE NULL
      END
    ) as sender,
    -- Recipient information
    json_build_object(
      'id', r.id,
      'user_profiles', CASE 
        WHEN rp.display_name IS NOT NULL THEN
          json_build_object('display_name', rp.display_name)
        ELSE NULL
      END
    ) as recipient,
    -- Listing information
    CASE 
      WHEN m.listing_id IS NOT NULL AND l.id IS NOT NULL THEN
        json_build_object(
          'id', l.id,
          'title', l.title
        )
      ELSE NULL
    END as listing
  FROM messages m
  LEFT JOIN auth.users s ON s.id = m.sender_id
  LEFT JOIN user_profiles sp ON sp.user_id = m.sender_id
  LEFT JOIN auth.users r ON r.id = m.recipient_id
  LEFT JOIN user_profiles rp ON rp.user_id = m.recipient_id
  LEFT JOIN listings l ON l.id = m.listing_id
  WHERE 
    -- User can see messages they sent or received
    (m.sender_id = user_id OR m.recipient_id = user_id)
    OR
    -- Landlords can see messages related to their listings
    EXISTS (
      SELECT 1 FROM listings ll
      WHERE ll.id = m.listing_id
      AND ll.landlord_id = user_id
    )
  ORDER BY m.created_at DESC
  LIMIT 50;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_messages(uuid) TO authenticated;

-- Create a simpler function for the frontend to call
CREATE OR REPLACE FUNCTION get_my_messages()
RETURNS TABLE (
  id uuid,
  conversation_id uuid,
  content text,
  created_at timestamptz,
  read_at timestamptz,
  sender_id uuid,
  recipient_id uuid,
  listing_id uuid,
  sender json,
  recipient json,
  listing json
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM get_user_messages(auth.uid());
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_my_messages() TO authenticated;