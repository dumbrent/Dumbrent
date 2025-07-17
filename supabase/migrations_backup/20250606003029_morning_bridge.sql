-- Enable public uploads to listings bucket for listing images
CREATE POLICY "Allow public uploads to listing images" ON storage.objects
FOR INSERT TO public
WITH CHECK (
  bucket_id = 'listings' AND 
  name LIKE 'listing-images/%'
);

-- Enable public reads of listing images
CREATE POLICY "Allow public to view listing images" ON storage.objects
FOR SELECT TO public
USING (
  bucket_id = 'listings' AND 
  name LIKE 'listing-images/%'
);