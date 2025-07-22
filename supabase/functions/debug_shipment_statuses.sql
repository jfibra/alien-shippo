CREATE OR REPLACE FUNCTION debug_shipment_statuses()
RETURNS TABLE (shipment_id UUID, current_status TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    shipments.id AS shipment_id,
    shipments.status AS current_status
  FROM shipments;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION debug_shipment_statuses() OWNER TO postgres;
