-- Create activity_logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS activity_logs_user_id_idx ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS activity_logs_action_idx ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS activity_logs_created_at_idx ON public.activity_logs(created_at);
CREATE INDEX IF NOT EXISTS activity_logs_target_table_target_id_idx ON public.activity_logs(details->>'target_table', details->>'target_id');

-- Add RLS policies
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own activity logs
CREATE POLICY "Users can view their own activity logs." ON public.activity_logs 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own activity logs
CREATE POLICY "Users can insert their own activity logs." ON public.activity_logs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for admins to view all activity logs (assuming a 'is_admin()' function exists)
-- You'll need to create this function or modify this policy based on your admin identification method
-- CREATE POLICY activity_logs_admin_select_policy ON public.activity_logs 
--   FOR SELECT 
--   USING (is_admin());

-- Create support_tickets table for the support page
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'open',
  admin_notes TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS support_tickets_user_id_idx ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS support_tickets_status_idx ON support_tickets(status);
CREATE INDEX IF NOT EXISTS support_tickets_created_at_idx ON support_tickets(created_at);

-- Add RLS policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own support tickets
CREATE POLICY support_tickets_select_policy ON support_tickets 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own support tickets
CREATE POLICY support_tickets_insert_policy ON support_tickets 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create function to log activities
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  target_table_name TEXT;
  target_record_id UUID;
  meta_data JSONB;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
  END IF;
  
  -- Get table name
  target_table_name := TG_TABLE_NAME;
  
  -- Get record ID (assuming 'id' is the primary key)
  IF TG_OP = 'DELETE' THEN
    target_record_id := OLD.id;
  ELSE
    target_record_id := NEW.id;
  END IF;
  
  -- Create metadata based on operation
  IF TG_OP = 'INSERT' THEN
    meta_data := jsonb_build_object(
      'target_table', target_table_name,
      'target_id', target_record_id,
      'data', to_jsonb(NEW)
    );
  ELSIF TG_OP = 'UPDATE' THEN
    meta_data := jsonb_build_object(
      'target_table', target_table_name,
      'target_id', target_record_id,
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW),
      'changes', (SELECT jsonb_object_agg(key, value)
                 FROM jsonb_each(to_jsonb(NEW))
                 WHERE to_jsonb(NEW) -> key <> to_jsonb(OLD) -> key)
    );
  ELSIF TG_OP = 'DELETE' THEN
    meta_data := jsonb_build_object(
      'target_table', target_table_name,
      'target_id', target_record_id,
      'data', to_jsonb(OLD)
    );
  END IF;
  
  -- Insert activity log
  -- Note: We're using the user_id from the record if available, otherwise null
  -- In practice, you might want to use auth.uid() or a more reliable method
  INSERT INTO public.activity_logs (
    user_id,
    action,
    details,
    created_at
  ) VALUES (
    CASE 
      WHEN TG_OP = 'DELETE' THEN 
        CASE WHEN OLD.user_id IS NOT NULL THEN OLD.user_id ELSE auth.uid() END
      ELSE 
        CASE WHEN NEW.user_id IS NOT NULL THEN NEW.user_id ELSE auth.uid() END
    END,
    action_type || '_' || target_table_name,
    meta_data,
    NOW()
  );
  
  -- Return the appropriate record based on operation
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Example of how to add the trigger to tables (uncomment and modify as needed)
-- CREATE TRIGGER log_shipments_activity
-- AFTER INSERT OR UPDATE OR DELETE ON shipments
-- FOR EACH ROW EXECUTE FUNCTION log_activity();

-- CREATE TRIGGER log_addresses_activity
-- AFTER INSERT OR UPDATE OR DELETE ON addresses
-- FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Add triggers for key tables
CREATE TRIGGER log_shipments_activity
AFTER INSERT OR UPDATE OR DELETE ON shipments
FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_addresses_activity
AFTER INSERT OR UPDATE OR DELETE ON addresses
FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_transactions_activity
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_user_accounts_activity
AFTER INSERT OR UPDATE OR DELETE ON user_accounts
FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_payment_methods_activity
AFTER INSERT OR UPDATE OR DELETE ON payment_methods
FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER log_support_tickets_activity
AFTER INSERT OR UPDATE OR DELETE ON support_tickets
FOR EACH ROW EXECUTE FUNCTION log_activity();

-- Create a function to manually log activities
CREATE OR REPLACE FUNCTION manually_log_activity(
  p_user_id UUID,
  p_action TEXT,
  p_target_table TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_meta JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    details,
    created_at
  ) VALUES (
    p_user_id,
    p_action,
    jsonb_build_object(
      'target_table', p_target_table,
      'target_id', p_target_id,
      'data', p_meta
    ),
    NOW()
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
