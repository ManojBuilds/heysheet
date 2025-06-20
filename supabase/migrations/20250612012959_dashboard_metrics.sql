create or replace function dashboard_metrics_range(from_date timestamptz, to_date timestamptz)
returns json as $$
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
        group by day order by day
      ) t
    ),
    'top_forms', (
      select json_agg(t) from (
        select title, submission_count 
        from forms 
        order by submission_count desc 
        limit 7
      ) t
    ),
    'browsers', (
      select json_agg(t) from (
        select analytics ->> 'browser' as browser, count(*) 
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by browser
      ) t
    ),
    'devices', (
      select json_agg(t) from (
        select analytics ->> 'device_type' as device_type, count(*) 
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by device_type
      ) t
    ),
    'countries', (
      select json_agg(t) from (
        select analytics ->> 'country' as country, count(*) 
        from submissions 
        where analytics is not null and created_at between from_date and to_date
        group by country
      ) t
    )
  ) into result;

  return result;
end;
$$ language plpgsql;
