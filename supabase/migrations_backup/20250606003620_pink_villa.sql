-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public uploads to listing images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view listing images" ON storage.objects;

-- Enable public uploads to listings bucket for listing images
CREATE POLICY "Allow public uploads to listing images" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'listings'
);

-- Enable public reads of listing images
CREATE POLICY "Allow public to view listing images" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'listings'
);

-- Allow public to delete images
CREATE POLICY "Allow public to delete listing images" ON storage.objects
FOR DELETE TO public
USING (
  bucket_id = 'listings'
);