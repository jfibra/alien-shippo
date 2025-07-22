CREATE TABLE public.contact_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT,
    email TEXT,
    subject TEXT,
    message TEXT,
    submitted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'new'
);

-- No RLS needed for contact messages as they're handled by server-side code
