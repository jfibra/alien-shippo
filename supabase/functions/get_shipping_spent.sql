CREATE OR REPLACE FUNCTION get_shipping_spent(user_id UUID)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    SELECT COALESCE(SUM(cost), 0)
    FROM shipments
    WHERE shipments.user_id = get_shipping_spent.user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_shipping_spent(UUID) OWNER TO postgres;
