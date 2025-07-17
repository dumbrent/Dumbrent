-- Create landlord_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.landlord_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    email TEXT,
    phone TEXT
);

-- Create the function to insert landlord profile after email confirmation
CREATE OR REPLACE FUNCTION public.create_landlord_profile()
RETURNS TRIGGER AS $$
BEGIN
    -- Only insert if not already present
    IF NOT EXISTS (
        SELECT 1 FROM public.landlord_profiles WHERE user_id = NEW.id
    ) THEN
        INSERT INTO public.landlord_profiles (user_id, email, phone)
        VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists (for idempotency)
DROP TRIGGER IF EXISTS trg_create_landlord_profile ON auth.users;

-- Create the trigger: after email_confirmed_at changes from NULL to NOT NULL
CREATE TRIGGER trg_create_landlord_profile
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (
    OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL
)
EXECUTE FUNCTION public.create_landlord_profile(); 