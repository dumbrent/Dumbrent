/*
  # Add tenant saved listings functionality
  
  1. Changes
    - Create tenant_saved_listings table
    - Add RLS policies for tenant access
    - Add updated_at trigger
    
  2. Security
    - Only tenants can manage their own saved listings
    - Maintain existing RLS policies
*/

CREATE TABLE IF NOT EXISTS tenant_saved_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES listings(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tenant_saved_listings ENABLE ROW LEVEL SECURITY;

-- Allow tenants to manage their own saved listings
CREATE POLICY "Tenants can manage own saved listings"
ON tenant_saved_listings
FOR ALL
USING (auth.uid() = tenant_id AND NOT is_user_banned())
WITH CHECK (auth.uid() = tenant_id AND NOT is_user_banned());

-- Add updated_at trigger
CREATE TRIGGER update_tenant_saved_listings_updated_at
  BEFORE UPDATE ON tenant_saved_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();