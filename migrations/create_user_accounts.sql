-- Create user_accounts table to track shipping balances
CREATE TABLE IF NOT EXISTS user_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'USD',
  last_deposit_date TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_accounts_user_id ON user_accounts(user_id);

-- Create function to add funds to a user account
CREATE OR REPLACE FUNCTION add_funds(
  user_id_param UUID,
  amount_param DECIMAL,
  currency_param TEXT DEFAULT 'USD'
)
RETURNS VOID AS $$
BEGIN
  -- Check if user account exists
  IF EXISTS (SELECT 1 FROM user_accounts WHERE user_id = user_id_param) THEN
    -- Update existing account
    UPDATE user_accounts
    SET 
      balance = balance + amount_param,
      last_deposit_date = NOW(),
      last_updated = NOW()
    WHERE user_id = user_id_param;
  ELSE
    -- Create new account
    INSERT INTO user_accounts (user_id, balance, currency, last_deposit_date)
    VALUES (user_id_param, amount_param, currency_param, NOW());
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create function to deduct funds from a user account
CREATE OR REPLACE FUNCTION deduct_funds(
  user_id_param UUID,
  amount_param DECIMAL,
  currency_param TEXT DEFAULT 'USD'
)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance
  FROM user_accounts
  WHERE user_id = user_id_param;
  
  -- Check if sufficient funds
  IF current_balance IS NULL OR current_balance < amount_param THEN
    RETURN FALSE;
  END IF;
  
  -- Update balance
  UPDATE user_accounts
  SET 
    balance = balance - amount_param,
    last_updated = NOW()
  WHERE user_id = user_id_param;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to get user balance
CREATE OR REPLACE FUNCTION get_user_balance(user_id_param UUID)
RETURNS TABLE (balance DECIMAL, currency TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT ua.balance, ua.currency
  FROM user_accounts ua
  WHERE ua.user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;
