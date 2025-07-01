-- Create notion_accounts table
CREATE TABLE notion_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    access_token TEXT NOT NULL,
    workspace_id TEXT NOT NULL,
    workspace_name TEXT,
    workspace_icon TEXT,
    owner_id TEXT,
    owner_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remove RLS policies for notion_accounts table
ALTER TABLE notion_accounts DISABLE ROW LEVEL SECURITY;

-- Remove policies referencing auth.uid() since Supabase Auth is not used
-- You may add custom RLS policies here if needed, or leave RLS enabled for future use

-- Add notion_account_id to forms table
ALTER TABLE forms
ADD COLUMN notion_account_id UUID REFERENCES notion_accounts(id);

-- Add notion_database_id to forms table
ALTER TABLE forms
ADD COLUMN notion_database_id TEXT;

-- Add notion_enabled to forms table
ALTER TABLE forms
ADD COLUMN notion_enabled BOOLEAN DEFAULT FALSE;
