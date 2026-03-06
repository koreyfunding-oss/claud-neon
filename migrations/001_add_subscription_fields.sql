-- Supabase Migration: Add subscription fields to profiles table
-- Run this in Supabase SQL Editor

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_id VARCHAR UNIQUE,
ADD COLUMN IF NOT EXISTS square_customer_id VARCHAR UNIQUE,
ADD COLUMN IF NOT EXISTS subscription_renewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR DEFAULT 'trial';

CREATE INDEX IF NOT EXISTS idx_profiles_subscription_id ON profiles(subscription_id);
CREATE INDEX IF NOT EXISTS idx_profiles_square_customer_id ON profiles(square_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
