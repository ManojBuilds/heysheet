export type GoogleAccount = {
  id: string;
  user_id: string;
  email: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  created_at: string;
  updated_at: string;
};

export type Endpoint = {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  google_account_id: string | null;
  spreadsheet_id: string | null;
  sheet_name: string;
  create_spreadsheet_if_missing: boolean;
  header_row: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Submission = {
  id: string;
  endpoint_id: string;
  data: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  sheet_row_number: number | null;
  error_message: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  processed_at: string | null;
};

export type Database = {
  google_accounts: GoogleAccount;
  endpoints: Endpoint;
  submissions: Submission;
};