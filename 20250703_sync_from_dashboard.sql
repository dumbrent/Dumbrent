-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY NOT NULL,
  email TEXT,
  raw_user_meta_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create function to handle new auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, raw_user_meta_data)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data);
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users to insert into public.users
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policy: Allow users to read their own data
CREATE POLICY "Users can view own metadata"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create RLS policy: Enable read access for users and admin
CREATE POLICY "Enable read access for users"
ON public.users
FOR SELECT
TO authenticated
USING (
  (auth.uid() = id)
  OR (COALESCE(auth.jwt() ->> 'role', '') = 'admin')
);

-- Create RLS policy: Enable update for users and admin
CREATE POLICY "Enable update for users"
ON public.users
FOR UPDATE
TO authenticated
USING (
  (auth.uid() = id)
  OR (COALESCE(auth.jwt() ->> 'role', '') = 'admin')
)
WITH CHECK (
  (auth.uid() = id)
  OR (COALESCE(auth.jwt() ->> 'role', '') = 'admin')
);
