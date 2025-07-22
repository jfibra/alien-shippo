-- Function to create a notification
CREATE OR REPLACE FUNCTION create_notification(
  user_id_param UUID,
  title_param TEXT,
  message_param TEXT,
  type_param TEXT
) RETURNS UUID AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (user_id_param, title_param, message_param, type_param)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to create a notification when a shipment is created
CREATE OR REPLACE FUNCTION create_shipment_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_notification(
    NEW.user_id,
    'New Shipment Created',
    'Your shipment has been created successfully. Tracking number: ' || COALESCE(NEW.tracking_number, 'Pending'),
    'shipment'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on shipments table
DROP TRIGGER IF EXISTS shipment_created_notification_trigger ON shipments;
CREATE TRIGGER shipment_created_notification_trigger
AFTER INSERT ON shipments
FOR EACH ROW
EXECUTE FUNCTION create_shipment_notification();

-- Trigger function to create a notification when a shipment status changes
CREATE OR REPLACE FUNCTION shipment_status_change_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    PERFORM create_notification(
      NEW.user_id,
      'Shipment Status Updated',
      'Your shipment status has changed to: ' || NEW.status,
      'shipment'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on shipments table for status changes
DROP TRIGGER IF EXISTS shipment_status_notification_trigger ON shipments;
CREATE TRIGGER shipment_status_notification_trigger
AFTER UPDATE ON shipments
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status)
EXECUTE FUNCTION shipment_status_change_notification();

-- Trigger function to create a notification when funds are added
CREATE OR REPLACE FUNCTION funds_added_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.balance > OLD.balance THEN
    PERFORM create_notification(
      NEW.user_id,
      'Funds Added',
      'Your account has been credited with $' || (NEW.balance - OLD.balance)::NUMERIC::TEXT || ' ' || NEW.currency,
      'payment'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on user_accounts table
DROP TRIGGER IF EXISTS funds_added_notification_trigger ON user_accounts;
CREATE TRIGGER funds_added_notification_trigger
AFTER UPDATE ON user_accounts
FOR EACH ROW
WHEN (NEW.balance > OLD.balance)
EXECUTE FUNCTION funds_added_notification();
