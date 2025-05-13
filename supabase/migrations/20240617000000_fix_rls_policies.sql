-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can access all google accounts" ON google_accounts;
DROP POLICY IF EXISTS "Service role can access all endpoints" ON endpoints;
DROP POLICY IF EXISTS "Service role can access all submissions" ON submissions;

-- Create service role bypass policy for google_accounts
CREATE POLICY "Service role can access all google accounts"
  ON google_accounts
  USING (true);

-- Create service role bypass policy for endpoints
CREATE POLICY "Service role can access all endpoints"
  ON endpoints
  USING (true);

-- Create service role bypass policy for submissions
CREATE POLICY "Service role can access all submissions"
  ON submissions
  USING (true);