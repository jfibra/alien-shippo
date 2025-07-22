CREATE OR REPLACE FUNCTION deduct_funds(
  user_id_param UUID,
  amount_param DECIMAL,
  currency_param VARCHAR
) RETURNS VOID AS $$
DECLARE
  current_balance DECIMAL;
BEGIN
  -- Get current balance
  SELECT balance INTO current_balance
  FROM user_accounts
  WHERE user_id = user_id_param;
  
  -- Check if sufficient funds
  IF current_balance < amount_param THEN
    RAISE EXCEPTION 'Insufficient funds';
  END IF;
  
  -- Update balance
  UPDATE public.user_accounts
  SET balance = balance - amount_param
  WHERE user_id = user_id_param;
END;
$$ LANGUAGE plpgsql;
