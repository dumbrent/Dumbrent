/*
  # Rename Features to Highlights

  Updates terminology from "Neighborhood Features" to "Neighborhood Highlights"
  
  1. Changes
    - Rename table from neighborhood_features to neighborhood_highlights
    - Update policies to use new table name
    - Migrate existing data
*/

-- Rename the table
ALTER TABLE IF EXISTS neighborhood_features 
RENAME TO neighborhood_highlights;

-- Update policies
ALTER POLICY "Public can view neighborhood features" 
ON neighborhood_highlights
RENAME TO "Public can view neighborhood highlights";

ALTER POLICY "Authenticated users can add features"
ON neighborhood_highlights 
RENAME TO "Authenticated users can add highlights";

ALTER POLICY "Users can update own features"
ON neighborhood_highlights
RENAME TO "Users can update own highlights";