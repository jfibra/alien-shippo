-- Create notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  
  -- Add indexes for better performance
  CONSTRAINT notifications_type_check CHECK (type IN ('shipment', 'payment', 'account', 'system'))
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);

-- Create index on is_read for faster filtering
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Add RLS policies
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY notifications_select_policy ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Users can only update their own notifications
CREATE POLICY notifications_update_policy ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Only authenticated users can insert notifications
CREATE POLICY notifications_insert_policy ON notifications
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
