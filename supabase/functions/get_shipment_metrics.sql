CREATE OR REPLACE FUNCTION get_shipment_metrics(start_date DATE, end_date DATE)
RETURNS TABLE (
    total_shipments BIGINT,
    total_revenue NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT AS total_shipments,
        COALESCE(SUM(cost), 0)::NUMERIC AS total_revenue
    FROM shipments
    WHERE created_at BETWEEN start_date AND end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_shipment_metrics(DATE, DATE) OWNER TO postgres;
