-- Update user role to admin
UPDATE user_profiles 
SET role = 'admin'
WHERE user_id = '1803e9c6-dcd8-4d0d-a6b4-75a2efd6d69e';

-- Ensure admin role is also in auth.users metadata
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || jsonb_build_object('role', 'admin')
WHERE id = '1803e9c6-dcd8-4d0d-a6b4-75a2efd6d69e';