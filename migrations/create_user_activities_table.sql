-- Create user_activities table
CREATE TABLE IF NOT EXISTS user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  reference VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS user_activities_user_id_idx ON user_activities(user_id);
CREATE INDEX IF NOT EXISTS user_activities_created_at_idx ON user_activities(created_at);

-- Add RLS policies
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- Policy for users to view their own activity
CREATE POLICY user_activities_select_policy ON user_activities 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create function to log user activities
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_activity_id UUID;
BEGIN
  INSERT INTO user_activities (
    user_id,
    action,
    description,
    reference,
    created_at
  ) VALUES (
    p_user_id,
    p_action,
    p_description,
    p_reference,
    NOW()
  )
  RETURNING id INTO v_activity_id;
  
  RETURN v_activity_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to automatically log activities for key tables
CREATE OR REPLACE FUNCTION create_shipment_activity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_user_activity(
    NEW.user_id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Created Shipment'
      WHEN TG_OP = 'UPDATE' THEN 'Updated Shipment'
      ELSE 'Unknown Action'
    END,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'Created a new shipment to ' || (SELECT city || ', ' || state FROM addresses WHERE id = NEW.to_address_id)
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'Shipment status changed from ' || OLD.status || ' to ' || NEW.status
      ELSE 'Modified shipment details'
    END,
    'ship_' || NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_shipment_activity
AFTER INSERT OR UPDATE ON shipments
FOR EACH ROW EXECUTE FUNCTION create_shipment_activity();

-- Create trigger for transactions
CREATE OR REPLACE FUNCTION create_transaction_activity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_user_activity(
    NEW.user_id,
    'Payment Transaction',
    'Processed a ' || NEW.amount || ' ' || 
    CASE 
      WHEN NEW.status = 'completed' THEN 'payment'
      WHEN NEW.status = 'pending' THEN 'pending payment'
      WHEN NEW.status = 'failed' THEN 'failed payment'
      ELSE NEW.status || ' payment'
    END,
    'txn_' || NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_transaction_activity
AFTER INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION create_transaction_activity();

-- Create trigger for addresses
CREATE OR REPLACE FUNCTION create_address_activity()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM log_user_activity(
    NEW.user_id,
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Added Address'
      WHEN TG_OP = 'UPDATE' THEN 'Updated Address'
      ELSE 'Unknown Action'
    END,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'Added a new address: ' || NEW.name || ' in ' || NEW.city || ', ' || NEW.state
      WHEN TG_OP = 'UPDATE' THEN 'Updated address: ' || NEW.name || ' in ' || NEW.city || ', ' || NEW.state
      ELSE 'Modified address details'
    END,
    'addr_' || NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER log_address_activity
AFTER INSERT OR UPDATE ON addresses
FOR EACH ROW EXECUTE FUNCTION create_address_activity();

-- Insert some sample activities for testing
INSERT INTO user_activities (user_id, action, description, reference, created_at)
SELECT 
  auth.uid(),
  'Account Login',
  'Logged in to account',
  NULL,
  NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid());

INSERT INTO user_activities (user_id, action, description, reference, created_at)
SELECT 
  auth.uid(),
  'Profile Updated',
  'Updated account profile information',
  NULL,
  NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM auth.users WHERE id = auth.uid());
