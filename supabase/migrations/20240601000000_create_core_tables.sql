-- Create core tables for FormSync

-- Google Accounts table - stores OAuth connections to Google
CREATE TABLE google_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  email TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, email)
);

-- Create index on user_id for faster queries
CREATE INDEX google_accounts_user_id_idx ON google_accounts(user_id);

-- Endpoints table - stores form endpoints configuration
CREATE TABLE endpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  
  -- Google Sheet details
  google_account_id UUID REFERENCES google_accounts(id) ON DELETE SET NULL,
  spreadsheet_id TEXT,
  sheet_name TEXT DEFAULT 'Sheet1',
  
  -- Configuration
  create_spreadsheet_if_missing BOOLEAN DEFAULT false,
  header_row BOOLEAN DEFAULT true,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraints
  UNIQUE(user_id, slug)
);

-- Create index on user_id for faster queries
CREATE INDEX endpoints_user_id_idx ON endpoints(user_id);

-- Submissions table - stores form submissions
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint_id UUID NOT NULL REFERENCES endpoints(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending',
  sheet_row_number INTEGER,
  error_message TEXT,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create index on endpoint_id for faster queries
CREATE INDEX submissions_endpoint_id_idx ON submissions(endpoint_id);
-- Create index on status for filtering
CREATE INDEX submissions_status_idx ON submissions(status);
-- Create index on created_at for sorting
CREATE INDEX submissions_created_at_idx ON submissions(created_at DESC);

-- Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE google_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create service role bypass policy for google_accounts
CREATE POLICY "Service role can access all google accounts"
  ON google_accounts
  USING (true);

-- Create policies for google_accounts
CREATE POLICY "Users can view their own Google accounts"
  ON google_accounts FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own Google accounts"
  ON google_accounts FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own Google accounts"
  ON google_accounts FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own Google accounts"
  ON google_accounts FOR DELETE
  USING (auth.uid()::text = user_id);

-- Create service role bypass policy for endpoints
CREATE POLICY "Service role can access all endpoints"
  ON endpoints
  USING (true);

-- Create policies for endpoints
CREATE POLICY "Users can view their own endpoints"
  ON endpoints FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own endpoints"
  ON endpoints FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own endpoints"
  ON endpoints FOR UPDATE
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own endpoints"
  ON endpoints FOR DELETE
  USING (auth.uid()::text = user_id);

-- Create service role bypass policy for submissions
CREATE POLICY "Service role can access all submissions"
  ON submissions
  USING (true);

-- Create policies for submissions
CREATE POLICY "Users can view submissions for their endpoints"
  ON submissions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM endpoints
    WHERE endpoints.id = submissions.endpoint_id
    AND endpoints.user_id = auth.uid()::text
  ));

-- Create function to handle form submissions
CREATE OR REPLACE FUNCTION handle_form_submission(
  endpoint_slug TEXT,
  form_data JSONB,
  client_info JSONB DEFAULT '{}'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  endpoint_record RECORD;
  submission_id UUID;
BEGIN
  -- Find the endpoint
  SELECT * INTO endpoint_record FROM endpoints
  WHERE slug = endpoint_slug AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'Endpoint not found or inactive');
  END IF;
  
  -- Insert the submission
  INSERT INTO submissions (endpoint_id, data, ip_address, user_agent, status)
  VALUES (
    endpoint_record.id,
    form_data,
    client_info->>'ip_address',
    client_info->>'user_agent',
    'pending'
  )
  RETURNING id INTO submission_id;
  
  -- Return success response
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Form submission received',
    'submission_id', submission_id
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Return error response
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Error processing submission: ' || SQLERRM
    );
END;
$$;
