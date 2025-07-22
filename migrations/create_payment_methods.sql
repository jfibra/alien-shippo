-- Create payment_methods table if it doesn't exist
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  card_last4 TEXT NOT NULL,
  card_brand TEXT NOT NULL,
  billing_address_id UUID REFERENCES addresses(id) ON DELETE SET NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS payment_methods_user_id_idx ON payment_methods(user_id);

-- Create RLS policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own payment methods
CREATE POLICY payment_methods_select_policy ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own payment methods
CREATE POLICY payment_methods_insert_policy ON payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own payment methods
CREATE POLICY payment_methods_update_policy ON payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own payment methods
CREATE POLICY payment_methods_delete_policy ON payment_methods
  FOR DELETE USING (auth.uid() = user_id);
