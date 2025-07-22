CREATE OR REPLACE FUNCTION add_funds(p_user_id UUID, p_amount NUMERIC)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.user_accounts (user_id, balance)
    VALUES (p_user_id, p_amount)
    ON CONFLICT (user_id) DO UPDATE
    SET balance = public.user_accounts.balance + p_amount;
END;
$$ LANGUAGE plpgsql;
