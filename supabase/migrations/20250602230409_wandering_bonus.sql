/*
  # Add neighborhoods and related tables

  1. New Tables
    - `boroughs`
      - Core borough information
    - `neighborhoods`
      - Neighborhood information with borough relationship
    - `neighborhood_features`
      - Features/points of interest for neighborhoods
      - Linked to neighborhoods table

  2. Security
    - Enable RLS on all tables
    - Public read access for all tables
    - Admin write access
*/

-- Create boroughs table
CREATE TABLE IF NOT EXISTS boroughs (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create neighborhoods table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id text PRIMARY KEY,
  name text NOT NULL,
  borough_id text NOT NULL REFERENCES boroughs(id),
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create neighborhood features table
CREATE TABLE IF NOT EXISTS neighborhood_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  neighborhood_id text NOT NULL REFERENCES neighborhoods(id),
  type text NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  added_by uuid REFERENCES auth.users(id),
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE boroughs ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhood_features ENABLE ROW LEVEL SECURITY;

-- Policies for boroughs
CREATE POLICY "Public can view boroughs"
  ON boroughs
  FOR SELECT
  TO public
  USING (true);

-- Policies for neighborhoods
CREATE POLICY "Public can view neighborhoods"
  ON neighborhoods
  FOR SELECT
  TO public
  USING (true);

-- Policies for neighborhood features
CREATE POLICY "Public can view neighborhood features"
  ON neighborhood_features
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can add features"
  ON neighborhood_features
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own features"
  ON neighborhood_features
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = added_by);

-- Add updated_at triggers
CREATE TRIGGER update_boroughs_updated_at
  BEFORE UPDATE ON boroughs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_neighborhoods_updated_at
  BEFORE UPDATE ON neighborhoods
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();