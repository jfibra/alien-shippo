CREATE OR REPLACE FUNCTION get_user_addresses(user_id UUID)
RETURNS TABLE (
    id UUID,
    name TEXT,
    street1 TEXT,
    street2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT,
    is_residential BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        addresses.id,
        addresses.name,
        addresses.street1,
        addresses.street2,
        addresses.city,
        addresses.state,
        addresses.zip,
        addresses.country,
        addresses.is_residential
    FROM addresses
    WHERE addresses.user_id = get_user_addresses.user_id
    AND addresses.is_deleted = false
    ORDER BY addresses.is_default DESC, addresses.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION get_user_addresses(UUID) OWNER TO postgres;
