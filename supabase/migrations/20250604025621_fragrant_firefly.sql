/*
  # Fix messages table relationships and queries

  1. Changes
    - Add indexes for better query performance
    - Update message queries to properly join with user_profiles
    - Fix conversation grouping
    
  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);

-- Create a function to get messages with user information
CREATE OR REPLACE FUNCTION get_message_with_user_info(msg messages)
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT json_build_object(
    'id', msg.id,
    'conversation_id', msg.conversation_id,
    'content', msg.content,
    'created_at', msg.created_at,
    'read_at', msg.read_at,
    'sender', (
      SELECT json_build_object(
        'id', u.id,
        'display_name', up.display_name
      )
      FROM auth.users u
      JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = msg.sender_id
    ),
    'recipient', (
      SELECT json_build_object(
        'id', u.id,
        'display_name', up.display_name
      )
      FROM auth.users u
      JOIN user_profiles up ON up.user_id = u.id
      WHERE u.id = msg.recipient_id
    )
  );
$$;