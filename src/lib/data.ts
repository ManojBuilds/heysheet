import { createClient } from "./supabase/server";

export const getDashboardStats = async ({
  userId,
  fromDate,
  toDate,
}: { userId: string, fromDate: string, toDate: string }) => {
  const supabase = await createClient();

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("id, is_active, submission_count, created_at")
    .eq("user_id", userId)
    .gte("created_at", fromDate)
    .lte("created_at", toDate);

  if (formsError) throw new Error(`Error fetching forms: ${formsError.message}`);

  const totalForms = forms?.length || 0;
  const activeForms = forms?.filter(f => f.is_active).length || 0;
  const totalSubmissions = forms?.reduce((sum, f) => sum + (f.submission_count || 0), 0) || 0;

  return { totalForms, activeForms, totalSubmissions };
};

export const getTopForms = async ({
  userId,
  fromDate,
  toDate,
}: { userId: string, fromDate: string, toDate: string }) => {
  const supabase = await createClient();

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("id, title, submission_count, created_at")
    .eq("user_id", userId)
    .gte("created_at", fromDate)
    .lte("created_at", toDate);

  if (formsError) throw new Error(`Error fetching forms: ${formsError.message}`);

  const topForms = (forms || [])
    .sort((a, b) => (b.submission_count || 0) - (a.submission_count || 0))
    .slice(0, 7)
    .map(f => ({
      id: f.id,
      title: f.title,
      submissionCount: f.submission_count || 0,
    }));

  return topForms;
};

export const getSubmissionsOverTime = async ({ userId, fromDate, toDate }: { userId: string, fromDate: string, toDate: string }) => {
  const supabase = await createClient();

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("id")
    .eq("user_id", userId);

  if (formsError) throw new Error(`Error fetching forms: ${formsError.message}`);

  const formIds = forms?.map(f => f.id) || [];
  if (formIds.length === 0) return [];

  const { data, error } = await supabase
    .from("submissions")
    .select("created_at")
    .in("form_id", formIds)
    .gte("created_at", fromDate)
    .lte("created_at", toDate);

  if (error) throw new Error(`Error fetching submissions: ${error.message}`);

  const counts: Record<string, number> = {};
  (data || []).forEach((row: any) => {
    const day = row.created_at.slice(0, 10); // YYYY-MM-DD
    counts[day] = (counts[day] || 0) + 1;
  });

  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, count]) => ({ day, count }));
};

export const getAllAnalyticsGroups = async ({
  userId,
  fromDate,
  toDate,
}: {
  userId: string;
  fromDate: string;
  toDate: string;
}) => {
  const supabase = await createClient();

  const { data: forms, error: formsError } = await supabase
    .from("forms")
    .select("id")
    .eq("user_id", userId);

  if (formsError) throw new Error(`Error fetching forms: ${formsError.message}`);

  const formIds = forms?.map((f) => f.id) || [];
  if (formIds.length === 0) {
    return {
      os: [],
      browser: [],
      device_type: [],
      country: [],
    };
  }

  const { data, error } = await supabase
    .from("submissions")
    .select("analytics")
    .in("form_id", formIds)
    .gte("created_at", fromDate)
    .lte("created_at", toDate)
    .not("analytics", "is", null);

  if (error) throw new Error(`Error fetching submissions: ${error.message}`);

  const result = {
    os: {} as Record<string, number>,
    browser: {} as Record<string, number>,
    device_type: {} as Record<string, number>,
    country: {} as Record<string, number>,
  };

  (data || []).forEach((row: any) => {
    const analytics = row.analytics || {};
    (["os", "browser", "device_type", "country"] as const).forEach((key) => {
      const value = analytics[key];
      if (value) {
        result[key][value] = (result[key][value] || 0) + 1;
      }
    });
  });

  return {
    os: Object.entries(result.os).map(([os, count]) => ({ key: os, value: count })),
    browser: Object.entries(result.browser).map(([browser, count]) => ({ key: browser, value: count })),
    device_type: Object.entries(result.device_type).map(([device_type, count]) => ({ key: device_type, value: count })),
    country: Object.entries(result.country).map(([country, count]) => ({ key: country, value: count })),
  };
};
