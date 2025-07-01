drop trigger if exists "update_users_updated_at" on "public"."users";

alter table "public"."submissions" drop constraint "check_status";

alter table "public"."users" drop constraint "users_pkey";

drop index if exists "public"."idx_submissions_processed_at";

drop index if exists "public"."idx_users_created_at";

drop index if exists "public"."users_pkey";

create table "public"."subscriptions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" text not null,
    "subscription_id" text not null,
    "customer_id" text not null,
    "plan" text not null,
    "billing_interval" text not null,
    "status" text not null,
    "next_billing" timestamp with time zone,
    "created_at" timestamp with time zone default now()
);


alter table "public"."forms" add column "file_upload" jsonb default '{"enabled": false, "max_files": 1, "allowed_file_types": []}'::jsonb;

alter table "public"."forms" alter column "id" set data type text using "id"::text;

alter table "public"."submissions" drop column "data";

alter table "public"."submissions" drop column "error_message";

alter table "public"."submissions" drop column "processed_at";

alter table "public"."submissions" alter column "form_id" set data type text using "form_id"::text;

alter table "public"."users" drop column "updated_at";

alter table "public"."users" drop column "user_id";

alter table "public"."users" add column "clerk_user_id" text;

alter table "public"."users" add column "customer_id" text;

alter table "public"."users" add column "email" text not null;

alter table "public"."users" add column "id" uuid not null default gen_random_uuid();

CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (id);

CREATE UNIQUE INDEX subscriptions_subscription_id_key ON public.subscriptions USING btree (subscription_id);

CREATE UNIQUE INDEX unique_subscription_per_user ON public.subscriptions USING btree (user_id);

CREATE UNIQUE INDEX users_customer_id_key ON public.users USING btree (customer_id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_billing_interval_check" CHECK ((billing_interval = ANY (ARRAY['monthly'::text, 'annually'::text]))) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_billing_interval_check";

alter table "public"."subscriptions" add constraint "subscriptions_plan_check" CHECK ((plan = ANY (ARRAY['free'::text, 'starter'::text, 'pro'::text]))) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_plan_check";

alter table "public"."subscriptions" add constraint "subscriptions_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'on_hold'::text, 'cancelled'::text, 'expired'::text, 'failed'::text]))) not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_status_check";

alter table "public"."subscriptions" add constraint "subscriptions_subscription_id_key" UNIQUE using index "subscriptions_subscription_id_key";

alter table "public"."users" add constraint "users_customer_id_key" UNIQUE using index "users_customer_id_key";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."submissions" add constraint "check_status" CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'failed'::text, 'completed'::text]))) not valid;

alter table "public"."submissions" validate constraint "check_status";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.dashboard_metrics_range(user_id text, from_date timestamp with time zone, to_date timestamp with time zone)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
  result json;
begin
  select json_build_object(
    'total_forms', (
      select count(*) from forms
      where forms.user_id = dashboard_metrics_range.user_id
    ),
    'active_forms', (
      select count(*) from forms
      where is_active = true and forms.user_id = dashboard_metrics_range.user_id
    ),
    'total_submissions', (
      select count(*) from submissions s
      join forms f on s.form_id = f.id
      where f.user_id = dashboard_metrics_range.user_id
        and s.created_at between from_date and to_date
    ),
    'submissions_over_time', (
      select json_agg(t) from (
        select date(s.created_at) as day, count(*) 
        from submissions s
        join forms f on s.form_id = f.id
        where f.user_id = dashboard_metrics_range.user_id
          and s.created_at between from_date and to_date
        group by day order by day
      ) t
    ),
    'top_forms', (
      select json_agg(t) from (
        select title, submission_count, id 
        from forms 
        where forms.user_id = dashboard_metrics_range.user_id
        order by submission_count desc 
        limit 7
      ) t
    ),
    'browsers', (
      select json_agg(t) from (
        select s.analytics ->> 'browser' as browser, count(*) 
        from submissions s
        join forms f on s.form_id = f.id
        where s.analytics is not null 
          and f.user_id = dashboard_metrics_range.user_id
          and s.created_at between from_date and to_date
        group by browser
      ) t
    ),
    'devices', (
      select json_agg(t) from (
        select s.analytics ->> 'device_type' as device_type, count(*) 
        from submissions s
        join forms f on s.form_id = f.id
        where s.analytics is not null 
          and f.user_id = dashboard_metrics_range.user_id
          and s.created_at between from_date and to_date
        group by device_type
      ) t
    ),
    'countries', (
      select json_agg(t) from (
        select s.analytics ->> 'country' as country, count(*) 
        from submissions s
        join forms f on s.form_id = f.id
        where s.analytics is not null 
          and f.user_id = dashboard_metrics_range.user_id
          and s.created_at between from_date and to_date
        group by country
      ) t
    ),
    'os', (
      select json_agg(t) from (
        select s.analytics ->> 'os' as os, count(*)
        from submissions s
        join forms f on s.form_id = f.id
        where s.analytics is not null
          and f.user_id = dashboard_metrics_range.user_id
          and s.created_at between from_date and to_date
        group by os
      ) t
    )
  ) into result;

  return result;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.form_analytics_range(id text, from_date timestamp with time zone, to_date timestamp with time zone)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_submissions', (
      SELECT COUNT(*) 
      FROM submissions 
      WHERE form_id = form_analytics_range.id 
        AND created_at BETWEEN form_analytics_range.from_date AND form_analytics_range.to_date
    ),

    'submissions_over_time', (
      SELECT json_agg(t) 
      FROM (
        SELECT DATE(created_at) AS day, COUNT(*) 
        FROM submissions 
        WHERE form_id = form_analytics_range.id 
          AND created_at BETWEEN form_analytics_range.from_date AND form_analytics_range.to_date
        GROUP BY day 
        ORDER BY day
      ) t
    ),

    'browsers', (
      SELECT json_agg(t) 
      FROM (
        SELECT analytics ->> 'browser' AS browser, COUNT(*) AS count
        FROM submissions 
        WHERE form_id = form_analytics_range.id 
          AND analytics IS NOT NULL 
          AND created_at BETWEEN form_analytics_range.from_date AND form_analytics_range.to_date
        GROUP BY browser
        ORDER BY count DESC
      ) t
    ),

    'devices', (
      SELECT json_agg(t) 
      FROM (
        SELECT analytics ->> 'device_type' AS device_type, COUNT(*) AS count
        FROM submissions 
        WHERE form_id = form_analytics_range.id 
          AND analytics IS NOT NULL 
          AND created_at BETWEEN form_analytics_range.from_date AND form_analytics_range.to_date
        GROUP BY device_type
        ORDER BY count DESC
      ) t
    ),

    'countries', (
      SELECT json_agg(t) 
      FROM (
        SELECT analytics ->> 'country' AS country, COUNT(*) AS count
        FROM submissions 
        WHERE form_id = form_analytics_range.id 
          AND analytics IS NOT NULL 
          AND created_at BETWEEN form_analytics_range.from_date AND form_analytics_range.to_date
        GROUP BY country
        ORDER BY count DESC
        LIMIT 5
      ) t
    ),

    'os', (
      SELECT json_agg(t) 
      FROM (
        SELECT analytics ->> 'os' AS os, COUNT(*) AS count
        FROM submissions 
        WHERE form_id = form_analytics_range.id 
          AND analytics IS NOT NULL 
          AND created_at BETWEEN form_analytics_range.from_date AND form_analytics_range.to_date
        GROUP BY os
        ORDER BY count DESC
      ) t
    )

  ) INTO result;

  RETURN result;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.dashboard_metrics_range(from_date timestamp with time zone, to_date timestamp with time zone)
 RETURNS json
 LANGUAGE plpgsql
AS $function$
declare
  result json;
begin
  select json_build_object(
    'total_forms', (select count(*) from forms),
    'active_forms', (select count(*) from forms where is_active = true),
    'total_submissions', (select count(*) from submissions where created_at between from_date and to_date),

    'submissions_over_time', (
      select json_agg(t) from (
        select date(created_at) as day, count(*) 
        from submissions 
        where created_at between from_date and to_date
        group by day 
        order by day
      ) t
    ),

    'top_forms', (
      select json_agg(t) from (
        select title, submission_count, id 
        from forms 
        order by submission_count desc 
        limit 7
      ) t
    ),

    'browsers', (
      select json_agg(t) from (
        select analytics ->> 'browser' as browser, count(*) as count
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by browser
        order by count desc
      ) t
    ),

    'devices', (
      select json_agg(t) from (
        select analytics ->> 'device_type' as device_type, count(*) as count
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by device_type
        order by count desc
      ) t
    ),

    'countries', (
      select json_agg(t) from (
        select analytics ->> 'country' as country, count(*) as count
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by country
        order by count desc
        limit 5
      ) t
    ),

    'os', (
      select json_agg(t) from (
        select analytics ->> 'os' as os, count(*) as count
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by os
        order by count desc
      ) t
    )

  ) into result;

  return result;
end;
$function$
;

grant delete on table "public"."subscriptions" to "anon";

grant insert on table "public"."subscriptions" to "anon";

grant references on table "public"."subscriptions" to "anon";

grant select on table "public"."subscriptions" to "anon";

grant trigger on table "public"."subscriptions" to "anon";

grant truncate on table "public"."subscriptions" to "anon";

grant update on table "public"."subscriptions" to "anon";

grant delete on table "public"."subscriptions" to "authenticated";

grant insert on table "public"."subscriptions" to "authenticated";

grant references on table "public"."subscriptions" to "authenticated";

grant select on table "public"."subscriptions" to "authenticated";

grant trigger on table "public"."subscriptions" to "authenticated";

grant truncate on table "public"."subscriptions" to "authenticated";

grant update on table "public"."subscriptions" to "authenticated";

grant delete on table "public"."subscriptions" to "service_role";

grant insert on table "public"."subscriptions" to "service_role";

grant references on table "public"."subscriptions" to "service_role";

grant select on table "public"."subscriptions" to "service_role";

grant trigger on table "public"."subscriptions" to "service_role";

grant truncate on table "public"."subscriptions" to "service_role";

grant update on table "public"."subscriptions" to "service_role";


