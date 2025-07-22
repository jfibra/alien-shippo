-- Check if the addresses table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'addresses'
    ) THEN
        -- Create the addresses table if it doesn't exist
        CREATE TABLE public.addresses (
            id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
            name text NOT NULL,
            recipient_name text NOT NULL,
            company_name text,
            address_lines text NOT NULL,
            city text NOT NULL,
            state text NOT NULL,
            postal_code text NOT NULL,
            country text NOT NULL,
            email text,
            is_residential boolean DEFAULT true,
            address_type text NOT NULL,
            is_default boolean DEFAULT false,
            created_at timestamp with time zone DEFAULT now() NOT NULL
        );
    ELSE
        -- Add any missing columns to the existing table
        
        -- Check and add name column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'name'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN name text;
        END IF;
        
        -- Check and add recipient_name column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'recipient_name'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN recipient_name text;
        END IF;
        
        -- Check and add company_name column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'company_name'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN company_name text;
        END IF;
        
        -- Check and add address_lines column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'address_lines'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN address_lines text;
        END IF;
        
        -- Check and add is_residential column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'is_residential'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN is_residential boolean DEFAULT true;
        END IF;
        
        -- Check and add is_default column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'is_default'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN is_default boolean DEFAULT false;
        END IF;
        
        -- Check and add email column if it doesn't exist
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'addresses' 
            AND column_name = 'email'
        ) THEN
            ALTER TABLE public.addresses ADD COLUMN email text;
        END IF;
    END IF;
END
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS addresses_is_default_idx ON public.addresses(is_default);
CREATE INDEX IF NOT EXISTS addresses_address_type_idx ON public.addresses(address_type);

-- Add RLS policies
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own addresses
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'addresses' 
        AND policyname = 'users_can_view_own_addresses'
    ) THEN
        CREATE POLICY users_can_view_own_addresses ON public.addresses
            FOR SELECT
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'addresses' 
        AND policyname = 'users_can_insert_own_addresses'
    ) THEN
        CREATE POLICY users_can_insert_own_addresses ON public.addresses
            FOR INSERT
            WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'addresses' 
        AND policyname = 'users_can_update_own_addresses'
    ) THEN
        CREATE POLICY users_can_update_own_addresses ON public.addresses
            FOR UPDATE
            USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM pg_policies 
        WHERE tablename = 'addresses' 
        AND policyname = 'users_can_delete_own_addresses'
    ) THEN
        CREATE POLICY users_can_delete_own_addresses ON public.addresses
            FOR DELETE
            USING (auth.uid() = user_id);
    END IF;
END
$$;

-- Add a comment to the table
COMMENT ON TABLE public.addresses IS 'Stores user shipping, billing, and return addresses';
