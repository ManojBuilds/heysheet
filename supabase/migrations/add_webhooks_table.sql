
-- Create webhooks table
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_id UUID REFERENCES forms(id) ON DELETE CASCADE NOT NULL,
    url TEXT NOT NULL,
    secret TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add webhook_enabled column to forms table
ALTER TABLE forms
ADD COLUMN webhook_enabled BOOLEAN DEFAULT FALSE;

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_webhooks_updated_at
BEFORE UPDATE ON webhooks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
