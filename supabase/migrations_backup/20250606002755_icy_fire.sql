-- Create listings bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listings',
  'listings',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to listing images
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Public Access" ON storage.objects;
  CREATE POLICY "Public Access to Listings"
    ON storage.objects FOR SELECT
    TO public
    USING (bucket_id = 'listings');
END $$;

-- Allow authenticated users to upload images
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
  CREATE POLICY "Authenticated Users Upload to Listings"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
      bucket_id = 'listings' AND
      (LOWER(storage.extension(name)) IN ('png', 'jpg', 'jpeg', 'gif', 'webp'))
    );
END $$;

-- Allow users to delete their own uploads
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;
  CREATE POLICY "Users Delete Own Listings Images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (auth.uid() = owner);
END $$;