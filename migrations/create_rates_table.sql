-- Create rates table if it doesn't exist
CREATE TABLE IF NOT EXISTS rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id TEXT NOT NULL,
  package_type_id TEXT,
  rate_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  delivery_days INTEGER,
  delivery_date TIMESTAMP WITH TIME ZONE,
  carrier TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to the table
COMMENT ON TABLE rates IS 'Stores shipping rate information for different services and package types';

-- Create index on service_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_rates_service_id ON rates(service_id);

-- Create index on package_type_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_rates_package_type_id ON rates(package_type_id);

-- Create index on carrier for faster lookups
CREATE INDEX IF NOT EXISTS idx_rates_carrier ON rates(carrier);

-- Add RLS policies
ALTER TABLE rates ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to select their own rates
CREATE POLICY select_rates ON rates
  FOR SELECT USING (true);

-- Policy to allow users to insert their own rates
CREATE POLICY insert_rates ON rates
  FOR INSERT WITH CHECK (true);

-- Policy to allow users to update their own rates
CREATE POLICY update_rates ON rates
  FOR UPDATE USING (true);
