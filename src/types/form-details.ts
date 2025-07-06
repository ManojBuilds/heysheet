export interface FormDetails {
  id: string;
  user_id: string;
  title: string;
  builder_config: {
    pages: {
      id: string;
      title: string;
    }[];
    theme: {
      font: string;
      mode: string;
      text: string;
      error: string;
      muted: string;
      accent: string;
      border: string;
      radius: string;
      primary: string;
      background: string;
      primaryHover: string;
      textSecondary: string;
      mutedForeground: string;
      accentForeground: string;
      primaryForeground: string;
      backgroundSecondary: string;
    };
    components: any[]; 
    active_page: string;
    success_page: {
      title: string;
      description: string;
      customContent: string;
    };
  };
  google_account_id: string;
  spreadsheet_id: string | null;
  sheet_name: string;
  notification_email: string;
  email_enabled: boolean;
  slack_enabled: boolean;
  slack_account_id: string | null;
  slack_channel: string | null;
  redirect_url: string | null;
  domains: string[] | null;
  submission_count: number;
  last_submission_at: string;
  is_active: boolean;
  is_archived: boolean;
  template_used: string;
  created_at: string;
  updated_at: string;
  file_upload: {
    enabled: boolean;
    max_files: number;
    allowed_file_types: string[];
  };
  slack_account: {
    id: string;
    user_id: string;
    created_at: string;
    slack_token: string;
    slack_channel: string;
    slack_team_id: string;
  } | null;
}

export interface GoogleAccount {
  id: string;
  email: string;
  access_token: string;
}
export interface SlackAccount {
  id: string,
  user_id: string,
  slack_token: string,
  slack_team_id: string,
  slack_channel: string,
  created_at: string
}

export interface NotionAccount {
  id: string;
  user_id: string;
  access_token: string;
  workspace_id: string;
  workspace_name: string;
  workspace_icon: string | null;
  owner_id: string | null;
  owner_type: string;
  created_at: string;
}



