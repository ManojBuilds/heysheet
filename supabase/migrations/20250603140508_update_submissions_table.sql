
-- Drop the existing submissions table completely
DROP TABLE IF EXISTS public.submissions;

-- Create the new submissions table
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm JSONB, -- UTM parameters (source, medium, campaign, etc.)
  analytics JSONB, -- Additional analytics like geolocation, device info, etc.
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  processed_at TIMESTAMPTZ
);

-- Create indexes for performance
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_processed_at ON submissions(processed_at);
CREATE INDEX idx_submissions_ip_address ON submissions(ip_address);

-- Optional: Add a constraint for valid status values
ALTER TABLE submissions ADD CONSTRAINT check_status 
  CHECK (status IN ('pending', 'processed', 'failed', 'archived'));

-- Optional: Create a trigger to update form submission count
CREATE OR REPLACE FUNCTION update_form_submission_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE forms 
    SET submission_count = submission_count + 1,
        last_submission_at = NEW.created_at
    WHERE id = NEW.form_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE forms 
    SET submission_count = submission_count - 1
    WHERE id = OLD.form_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_form_submission_count
  AFTER INSERT OR DELETE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_form_submission_count();
