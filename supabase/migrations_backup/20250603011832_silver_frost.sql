/*
  # Add get_user_role function
  
  1. Changes
    - Add PostgreSQL function to safely get user role
    - Function accessible to authenticated users only
    - Returns user role from metadata
*/

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (
    SELECT (raw_user_meta_data->>'role')::text
    FROM auth.users
    WHERE id = auth.uid()
  );
END;
$$;