-- Add email column to addresses table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'addresses' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.addresses ADD COLUMN email TEXT;
        
        -- Add a comment to the column
        COMMENT ON COLUMN public.addresses.email IS 'Email address associated with this shipping/billing address';
    END IF;
END
$$;
