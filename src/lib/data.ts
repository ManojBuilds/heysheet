import { createClient } from "./supabase/server";

export const getDashboardStats = async ({
  userId,
  fromDate,
  toDate,
  formId,
}: { userId: string; fromDate: string; toDate: string; formId?: string }) => {
  const supabase = await createClient();

  let query = supabase
    .from("forms")
    .select("id, is_active, submission_count, created_at")
    .eq("user_id", userId);
  if (formId) {
    query = query.eq("id", formId);
  }
  query = query.gte("created_at", fromDate).lte("created_at", toDate);

  const { count: totalForms, error: countError } = await supabase
    .from("forms")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", fromDate)
    .lte("created_at", toDate);

  if (countError) return { totalForms: 0, activeForms: 0, totalSubmissions: 0 };

  const { data: forms, error: formsError } = await query;

  if (formsError) return { totalForms: 0, activeForms: 0, totalSubmissions: 0 };

  const activeForms = forms?.filter(f => f.is_active).length || 0;
  const totalSubmissions = forms?.reduce((sum, f) => sum + (f.submission_count || 0), 0) || 0;

  return { totalForms: totalForms || 0, activeForms, totalSubmissions };
};

export const getTopForms = async ({
  userId,
  fromDate,
  toDate,
  formId,
}: { userId: string; fromDate: string; toDate: string; formId?: string }) => {
  const supabase = await createClient();

  let query = supabase
    .from("forms")
    .select("id, title, submission_count, created_at")
    .eq("user_id", userId)
    .order("submission_count", { ascending: false })
    .limit(7);
  if (formId) {
    query = query.eq("id", formId);
  }
  query = query.gte("created_at", fromDate).lte("created_at", toDate);

  const { data: forms, error: formsError } = await query;

  if (formsError) return [];

  const topForms = (forms || [])
    .map(f => ({
      id: f.id,
      title: f.title,
      submissionCount: f.submission_count || 0,
    }));

  return topForms;
};

export const getSubmissionsOverTime = async ({ userId, fromDate, toDate, formId }: { userId: string; fromDate: string; toDate: string; formId?: string }) => {
  const supabase = await createClient();

  let query = supabase
    .from("submissions")
    .select("created_at, form_id")
    .gte("created_at", fromDate)
    .lte("created_at", toDate);

  if (formId) {
    query = query.eq("form_id", formId);
  } else {
    // If no formId, filter by forms belonging to the user
    const { data: userForms, error: userFormsError } = await supabase
      .from("forms")
      .select("id")
      .eq("user_id", userId);

    if (userFormsError) return [];
    const formIds = userForms?.map(f => f.id) || [];
    if (formIds.length === 0) return [];
    query = query.in("form_id", formIds);
  }

  const { data, error } = await query;

  if (error) return [];

  const counts: Record<string, number> = {};
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.toISOString().slice(0, 10);
    counts[day] = 0;
  }

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
  formId,
}: {
  userId: string;
  fromDate: string;
  toDate: string;
  formId?: string;
}) => {
  const supabase = await createClient();

  let query = supabase
    .from("submissions")
    .select("analytics")
    .gte("created_at", fromDate)
    .lte("created_at", toDate)
    .not("analytics", "is", null);

  if (formId) {
    query = query.eq("form_id", formId);
  } else {
    const { data: userForms, error: userFormsError } = await supabase
      .from("forms")
      .select("id")
      .eq("user_id", userId);
    if (userFormsError) return ({
      os: [],
      browser: [],
      device_type: [],
      country: [],
    })
    const formIds = userForms?.map((f) => f.id) || [];
    if (formIds.length === 0) {
      return {
        os: [],
        browser: [],
        device_type: [],
        country: [],
      };
    }
    query = query.in("form_id", formIds);
  }

  const { data, error } = await query;

  if (error) return ({
    os: [],
    browser: [],
    device_type: [],
    country: [],
  });

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
