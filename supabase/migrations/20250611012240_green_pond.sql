/*
  # Add Stripe integration fields

  1. Changes
    - Add stripe_session_id to listing_subscriptions table
    - Add plan_type to track monthly vs quarterly plans
    - Update subscription tracking for Stripe integration

  2. Security
    - Maintain existing RLS policies
    - Add fields for better subscription management
*/

-- Add Stripe-related fields to listing_subscriptions
ALTER TABLE listing_subscriptions 
ADD COLUMN IF NOT EXISTS stripe_session_id text,
ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'quarterly'));

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_listing_subscriptions_stripe_session 
ON listing_subscriptions(stripe_session_id);

-- Update the amount_paid column to be more flexible
ALTER TABLE listing_subscriptions 
ALTER COLUMN amount_paid TYPE numeric(10,2);