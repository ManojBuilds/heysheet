-- Drop the existing forms table completely
DROP TABLE IF EXISTS public.forms;

-- Create the new forms table with updated structure
CREATE TABLE forms (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id TEXT NOT NULL,  -- Clerk user ID

  title TEXT NOT NULL,

  -- All drag & drop form builder config
  builder_config JSONB, -- contains { components, pages, active_page, theme, ... }

  -- Spreadsheet connection
  google_account_id UUID REFERENCES google_accounts(id) ON DELETE SET NULL,
  spreadsheet_id TEXT,
  sheet_name TEXT,

  -- Notifications
  notification_email TEXT,
  email_enabled BOOLEAN DEFAULT FALSE,
  slack_enabled BOOLEAN DEFAULT FALSE,
  slack_account_id UUID REFERENCES slack_accounts(id) ON DELETE SET NULL,
  slack_channel TEXT,

  -- Post-submission
  redirect_url TEXT,

  -- Submission stats
  submission_count INT DEFAULT 0,
  last_submission_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_archived BOOLEAN DEFAULT FALSE,
  template_used TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_forms_user_id ON forms(user_id);
CREATE INDEX idx_forms_created_at ON forms(created_at);
CREATE INDEX idx_forms_is_active ON forms(is_active);
CREATE INDEX idx_forms_is_archived ON forms(is_archived);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_forms_updated_at 
    BEFORE UPDATE ON forms 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();