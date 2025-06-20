-- Drop the specified tables completely
DROP TABLE IF EXISTS public.slack_notifications;
DROP TABLE IF EXISTS public.endpoints;
DROP TABLE IF EXISTS public.api_keys;
DROP TABLE IF EXISTS public.email_notifications;

-- Optional: Also drop any related functions or triggers if they exist
-- DROP FUNCTION IF EXISTS function_name();
-- DROP TRIGGER IF EXISTS trigger_name ON table_name;