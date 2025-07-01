export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          active: boolean
          created_at: string | null
          id: string
          key: string
          name: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string | null
          id?: string
          key: string
          name: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string | null
          id?: string
          key?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      email_notifications: {
        Row: {
          created_at: string | null
          email: string
          enabled: boolean
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          enabled?: boolean
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          enabled?: boolean
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      endpoints: {
        Row: {
          create_spreadsheet_if_missing: boolean | null
          created_at: string | null
          description: string | null
          google_account_id: string | null
          header_row: boolean | null
          id: string
          is_active: boolean | null
          name: string
          sheet_name: string | null
          slug: string
          spreadsheet_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          create_spreadsheet_if_missing?: boolean | null
          created_at?: string | null
          description?: string | null
          google_account_id?: string | null
          header_row?: boolean | null
          id?: string
          is_active?: boolean | null
          name: string
          sheet_name?: string | null
          slug: string
          spreadsheet_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          create_spreadsheet_if_missing?: boolean | null
          created_at?: string | null
          description?: string | null
          google_account_id?: string | null
          header_row?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string
          sheet_name?: string | null
          slug?: string
          spreadsheet_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "endpoints_google_account_id_fkey"
            columns: ["google_account_id"]
            isOneToOne: false
            referencedRelation: "google_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          active_page: string
          components: Json[]
          created_at: string
          endpoint_id: string
          id: string
          pages: Json[]
          success_page: Json
          theme: Json
          title: string
          updated_at: string
          notion_account_id: string | null
          notion_database_id: string | null
          notion_enabled: boolean | null
        }
        Insert: {
          active_page?: string
          components?: Json[]
          created_at?: string
          endpoint_id: string
          id?: string
          pages?: Json[]
          success_page?: Json
          theme?: Json
          title?: string
          updated_at?: string
          notion_account_id?: string | null
          notion_database_id?: string | null
          notion_enabled?: boolean | null
        }
        Update: {
          active_page?: string
          components?: Json[]
          created_at?: string
          endpoint_id?: string
          id?: string
          pages?: Json[]
          success_page?: Json
          theme?: Json
          title?: string
          updated_at?: string
          notion_account_id?: string | null
          notion_database_id?: string | null
          notion_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_endpoint"
            columns: ["endpoint_id"]
            isOneToOne: true
            referencedRelation: "endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: true
            referencedRelation: "endpoints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_notion_account_id_fkey"
            columns: ["notion_account_id"]
            isOneToOne: false
            referencedRelation: "notion_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notion_accounts: {
        Row: {
          id: string
          user_id: string
          access_token: string
          workspace_id: string
          workspace_name: string | null
          workspace_icon: string | null
          owner_id: string | null
          owner_type: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          workspace_id: string
          workspace_name?: string | null
          workspace_icon?: string | null
          owner_id?: string | null
          owner_type?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          workspace_id?: string
          workspace_name?: string | null
          workspace_icon?: string | null
          owner_id?: string | null
          owner_type?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notion_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      google_accounts: {
        Row: {
          access_token: string
          created_at: string | null
          email: string
          id: string
          refresh_token: string
          token_expires_at: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          email: string
          id?: string
          refresh_token: string
          token_expires_at: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          email?: string
          id?: string
          refresh_token?: string
          token_expires_at?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      slack_accounts: {
        Row: {
          created_at: string | null
          id: string
          slack_channel: string | null
          slack_team_id: string
          slack_token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          slack_channel?: string | null
          slack_team_id: string
          slack_token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          slack_channel?: string | null
          slack_team_id?: string
          slack_token?: string
          user_id?: string
        }
        Relationships: []
      }
      slack_notifications: {
        Row: {
          created_at: string | null
          enabled: boolean
          id: string
          slack_account_id: string | null
          slack_channel: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          slack_account_id?: string | null
          slack_channel: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          enabled?: boolean
          id?: string
          slack_account_id?: string | null
          slack_channel?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "slack_notifications_slack_account_id_fkey"
            columns: ["slack_account_id"]
            isOneToOne: false
            referencedRelation: "slack_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          data: Json
          device_type: string | null
          endpoint_id: string
          error_message: string | null
          id: string
          language: string | null
          processed_at: string | null
          referrer: string | null
          sheet_row_number: number | null
          status: string
          timezone: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          data: Json
          device_type?: string | null
          endpoint_id: string
          error_message?: string | null
          id?: string
          language?: string | null
          processed_at?: string | null
          referrer?: string | null
          sheet_row_number?: number | null
          status?: string
          timezone?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          data?: Json
          device_type?: string | null
          endpoint_id?: string
          error_message?: string | null
          id?: string
          language?: string | null
          processed_at?: string | null
          referrer?: string | null
          sheet_row_number?: number | null
          status?: string
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_default_theme: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      handle_form_submission: {
        Args: { endpoint_slug: string; form_data: Json; client_info?: Json }
        Returns: Json
      }
      upsert_form: {
        Args:
          | {
              p_endpoint_id: string
              p_title: string
              p_theme: Json
              p_components: Json[]
              p_pages: Json[]
              p_active_page: string
            }
          | {
              p_endpoint_id: string
              p_title: string
              p_theme: Json
              p_components: Json[]
              p_pages: Json[]
              p_active_page: string
              p_success_page: Json
            }
        Returns: string
      }
    }
    Enums: {
      form_component_type:
        | "short-text"
        | "long-text"
        | "multiple-choice"
        | "single-choice"
        | "dropdown"
        | "email"
        | "phone"
        | "number"
        | "date"
        | "rating"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      form_component_type: [
        "short-text",
        "long-text",
        "multiple-choice",
        "single-choice",
        "dropdown",
        "email",
        "phone",
        "number",
        "date",
        "rating",
      ],
    },
  },
} as const

