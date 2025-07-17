-- Drop existing policies
DROP POLICY IF EXISTS "Allow public uploads to listing images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view listing images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to delete listing images" ON storage.objects;
DROP POLICY IF EXISTS "Public Access to Listings" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Users Upload to Listings" ON storage.objects;
DROP POLICY IF EXISTS "Users Delete Own Listings Images" ON storage.objects;

-- Create a single comprehensive policy for the listings bucket
CREATE POLICY "listings_bucket_policy" ON storage.objects
FOR ALL TO public
USING (bucket_id = 'listings')
WITH CHECK (bucket_id = 'listings');