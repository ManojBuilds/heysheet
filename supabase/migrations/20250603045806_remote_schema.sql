

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."form_component_type" AS ENUM (
    'short-text',
    'long-text',
    'multiple-choice',
    'single-choice',
    'dropdown',
    'email',
    'phone',
    'number',
    'date',
    'rating'
);


ALTER TYPE "public"."form_component_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_default_theme"() RETURNS "jsonb"
    LANGUAGE "sql" IMMUTABLE
    AS $$
  SELECT '{
    "id": "default",
    "name": "Default Theme",
    "primaryColor": "#0066ff",
    "backgroundColor": "#ffffff",
    "textColor": "#000000"
  }'::jsonb;
$$;


ALTER FUNCTION "public"."get_default_theme"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_form_submission"("endpoint_slug" "text", "form_data" "jsonb", "client_info" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
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
  
  -- Insert the submission with individual columns
  INSERT INTO submissions (
    endpoint_id,
    data,
    country,
    city,
    timezone,
    referrer,
    device_type,
    browser,
    language,
    status
  )
  VALUES (
    endpoint_record.id,
    form_data,
    client_info->>'country',
    client_info->>'city',
    client_info->>'timezone',
    client_info->>'referrer',
    client_info->>'device_type',
    client_info->>'browser',
    client_info->>'language',
    'pending'
  )
  RETURNING id INTO submission_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Form submission received',
    'submission_id', submission_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'message', 'Error processing submission: ' || SQLERRM
    );
END;
$$;


ALTER FUNCTION "public"."handle_form_submission"("endpoint_slug" "text", "form_data" "jsonb", "client_info" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  v_form_id UUID;
BEGIN
  -- Insert or update the form
  INSERT INTO forms (
    endpoint_id,
    title,
    theme,
    components,
    pages,
    active_page
  ) VALUES (
    p_endpoint_id,
    p_title,
    p_theme,
    p_components,
    p_pages,
    p_active_page
  )
  ON CONFLICT (endpoint_id) DO UPDATE SET
    title = EXCLUDED.title,
    theme = EXCLUDED.theme,
    components = EXCLUDED.components,
    pages = EXCLUDED.pages,
    active_page = EXCLUDED.active_page,
    updated_at = NOW()
  RETURNING id INTO v_form_id;

  RETURN v_form_id;
END;
$$;


ALTER FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text", "p_success_page" "jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    v_form_id UUID;
BEGIN
    -- Insert or update the form
    INSERT INTO forms (
        endpoint_id,
        title,
        theme,
        components,
        pages,
        active_page,
        success_page  -- Include the new parameter in the insert statement
    ) VALUES (
        p_endpoint_id,
        p_title,
        p_theme,
        p_components,
        p_pages,
        p_active_page,
        p_success_page  -- Include the new parameter in the insert statement
    )
    ON CONFLICT (endpoint_id) DO UPDATE SET
        title = EXCLUDED.title,
        theme = EXCLUDED.theme,
        components = EXCLUDED.components,
        pages = EXCLUDED.pages,
        active_page = EXCLUDED.active_page,
        success_page = EXCLUDED.success_page,  -- Update the success_page on conflict
        updated_at = NOW()
    RETURNING id INTO v_form_id;

    RETURN v_form_id;
END;
$$;


ALTER FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text", "p_success_page" "jsonb") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."api_keys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "key" "text" NOT NULL,
    "active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."api_keys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."email_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."endpoints" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "google_account_id" "uuid",
    "spreadsheet_id" "text",
    "sheet_name" "text" DEFAULT 'Sheet1'::"text",
    "create_spreadsheet_if_missing" boolean DEFAULT false,
    "header_row" boolean DEFAULT true,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."endpoints" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."forms" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "endpoint_id" "uuid" NOT NULL,
    "title" "text" DEFAULT 'Untitled Form'::"text" NOT NULL,
    "theme" "jsonb" DEFAULT "public"."get_default_theme"() NOT NULL,
    "components" "jsonb"[] DEFAULT ARRAY[]::"jsonb"[] NOT NULL,
    "pages" "jsonb"[] DEFAULT ARRAY['{"id": "page-1", "title": "Page 1"}'::"jsonb"] NOT NULL,
    "active_page" "text" DEFAULT 'page-1'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "success_page" "jsonb" DEFAULT '{"title": "Thanks for your submission!", "description": "Your response has been recorded.", "customContent": null}'::"jsonb" NOT NULL
);


ALTER TABLE "public"."forms" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."google_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "access_token" "text" NOT NULL,
    "refresh_token" "text" NOT NULL,
    "token_expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."google_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."slack_accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "slack_token" "text" NOT NULL,
    "slack_team_id" "text" NOT NULL,
    "slack_channel" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."slack_accounts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."slack_notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "slack_channel" "text" NOT NULL,
    "enabled" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "slack_account_id" "uuid"
);


ALTER TABLE "public"."slack_notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "endpoint_id" "uuid" NOT NULL,
    "data" "jsonb" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "sheet_row_number" integer,
    "error_message" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "processed_at" timestamp with time zone,
    "country" "text",
    "city" "text",
    "timezone" "text",
    "referrer" "text",
    "device_type" "text",
    "browser" "text",
    "language" "text"
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


ALTER TABLE ONLY "public"."api_keys"
    ADD CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_notifications"
    ADD CONSTRAINT "email_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_notifications"
    ADD CONSTRAINT "email_notifications_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."endpoints"
    ADD CONSTRAINT "endpoints_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."endpoints"
    ADD CONSTRAINT "endpoints_user_id_slug_key" UNIQUE ("user_id", "slug");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."google_accounts"
    ADD CONSTRAINT "google_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."google_accounts"
    ADD CONSTRAINT "google_accounts_user_id_email_key" UNIQUE ("user_id", "email");



ALTER TABLE ONLY "public"."slack_accounts"
    ADD CONSTRAINT "slack_accounts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."slack_notifications"
    ADD CONSTRAINT "slack_notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "unique_endpoint_form" UNIQUE ("endpoint_id");



CREATE INDEX "endpoints_user_id_idx" ON "public"."endpoints" USING "btree" ("user_id");



CREATE INDEX "google_accounts_user_id_idx" ON "public"."google_accounts" USING "btree" ("user_id");



CREATE INDEX "slack_notifications_slack_account_id_idx" ON "public"."slack_notifications" USING "btree" ("slack_account_id");



CREATE INDEX "submissions_created_at_idx" ON "public"."submissions" USING "btree" ("created_at" DESC);



CREATE INDEX "submissions_endpoint_id_idx" ON "public"."submissions" USING "btree" ("endpoint_id");



CREATE INDEX "submissions_status_idx" ON "public"."submissions" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "set_forms_updated_at" BEFORE UPDATE ON "public"."forms" FOR EACH ROW EXECUTE FUNCTION "public"."update_timestamp"();



ALTER TABLE ONLY "public"."endpoints"
    ADD CONSTRAINT "endpoints_google_account_id_fkey" FOREIGN KEY ("google_account_id") REFERENCES "public"."google_accounts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "fk_endpoint" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoints"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "forms_endpoint_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoints"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."slack_notifications"
    ADD CONSTRAINT "slack_notifications_slack_account_id_fkey" FOREIGN KEY ("slack_account_id") REFERENCES "public"."slack_accounts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_endpoint_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "public"."endpoints"("id") ON DELETE CASCADE;



CREATE POLICY "Enable all operations for authenticated users" ON "public"."forms" USING (("auth"."role"() = 'authenticated'::"text")) WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Service role can access all endpoints" ON "public"."endpoints" USING (true);



CREATE POLICY "Service role can access all google accounts" ON "public"."google_accounts" USING (true);



CREATE POLICY "Service role can access all submissions" ON "public"."submissions" USING (true);



CREATE POLICY "Users can delete their own Google accounts" ON "public"."google_accounts" FOR DELETE USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can delete their own endpoints" ON "public"."endpoints" FOR DELETE USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can insert their own API keys" ON "public"."api_keys" FOR INSERT TO "authenticated" WITH CHECK (((( SELECT "auth"."uid"() AS "uid"))::"text" = "user_id"));



CREATE POLICY "Users can insert their own Google accounts" ON "public"."google_accounts" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can insert their own endpoints" ON "public"."endpoints" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can update their own Google accounts" ON "public"."google_accounts" FOR UPDATE USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can update their own endpoints" ON "public"."endpoints" FOR UPDATE USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view submissions for their endpoints" ON "public"."submissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."endpoints"
  WHERE (("endpoints"."id" = "submissions"."endpoint_id") AND ("endpoints"."user_id" = ("auth"."uid"())::"text")))));



CREATE POLICY "Users can view their own Google accounts" ON "public"."google_accounts" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



CREATE POLICY "Users can view their own endpoints" ON "public"."endpoints" FOR SELECT USING ((("auth"."uid"())::"text" = "user_id"));



ALTER TABLE "public"."api_keys" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "api_keys_delete_policy" ON "public"."api_keys" FOR DELETE USING (true);



CREATE POLICY "api_keys_insert_policy" ON "public"."api_keys" FOR INSERT WITH CHECK (true);



CREATE POLICY "api_keys_select_policy" ON "public"."api_keys" FOR SELECT USING (true);



CREATE POLICY "api_keys_update_policy" ON "public"."api_keys" FOR UPDATE USING (true) WITH CHECK (true);



ALTER TABLE "public"."email_notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "email_notifications_delete_policy" ON "public"."email_notifications" FOR DELETE USING (true);



CREATE POLICY "email_notifications_insert_policy" ON "public"."email_notifications" FOR INSERT WITH CHECK (true);



CREATE POLICY "email_notifications_select_policy" ON "public"."email_notifications" FOR SELECT USING (true);



CREATE POLICY "email_notifications_update_policy" ON "public"."email_notifications" FOR UPDATE USING (true) WITH CHECK (true);



ALTER TABLE "public"."endpoints" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."google_accounts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."slack_accounts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "slack_accounts_delete_policy" ON "public"."slack_accounts" FOR DELETE USING (true);



CREATE POLICY "slack_accounts_insert_policy" ON "public"."slack_accounts" FOR INSERT WITH CHECK (true);



CREATE POLICY "slack_accounts_select_policy" ON "public"."slack_accounts" FOR SELECT USING (true);



CREATE POLICY "slack_accounts_update_policy" ON "public"."slack_accounts" FOR UPDATE USING (true) WITH CHECK (true);



ALTER TABLE "public"."slack_notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "slack_notifications_delete_policy" ON "public"."slack_notifications" FOR DELETE USING (true);



CREATE POLICY "slack_notifications_insert_policy" ON "public"."slack_notifications" FOR INSERT WITH CHECK (true);



CREATE POLICY "slack_notifications_select_policy" ON "public"."slack_notifications" FOR SELECT USING (true);



CREATE POLICY "slack_notifications_update_policy" ON "public"."slack_notifications" FOR UPDATE USING (true) WITH CHECK (true);



ALTER TABLE "public"."submissions" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."get_default_theme"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_default_theme"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_default_theme"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_form_submission"("endpoint_slug" "text", "form_data" "jsonb", "client_info" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."handle_form_submission"("endpoint_slug" "text", "form_data" "jsonb", "client_info" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_form_submission"("endpoint_slug" "text", "form_data" "jsonb", "client_info" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text", "p_success_page" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text", "p_success_page" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_form"("p_endpoint_id" "uuid", "p_title" "text", "p_theme" "jsonb", "p_components" "jsonb"[], "p_pages" "jsonb"[], "p_active_page" "text", "p_success_page" "jsonb") TO "service_role";


















GRANT ALL ON TABLE "public"."api_keys" TO "anon";
GRANT ALL ON TABLE "public"."api_keys" TO "authenticated";
GRANT ALL ON TABLE "public"."api_keys" TO "service_role";



GRANT ALL ON TABLE "public"."email_notifications" TO "anon";
GRANT ALL ON TABLE "public"."email_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."email_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."endpoints" TO "anon";
GRANT ALL ON TABLE "public"."endpoints" TO "authenticated";
GRANT ALL ON TABLE "public"."endpoints" TO "service_role";



GRANT ALL ON TABLE "public"."forms" TO "anon";
GRANT ALL ON TABLE "public"."forms" TO "authenticated";
GRANT ALL ON TABLE "public"."forms" TO "service_role";



GRANT ALL ON TABLE "public"."google_accounts" TO "anon";
GRANT ALL ON TABLE "public"."google_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."google_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."slack_accounts" TO "anon";
GRANT ALL ON TABLE "public"."slack_accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."slack_accounts" TO "service_role";



GRANT ALL ON TABLE "public"."slack_notifications" TO "anon";
GRANT ALL ON TABLE "public"."slack_notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."slack_notifications" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
