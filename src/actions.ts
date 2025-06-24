"use server";

import { getGoogleAuthUrl } from "./lib/google/auth";
import { createClient } from "./lib/supabase/server";
import { SPREADSHEET_TEMPLATES } from "./lib/spreadsheet-templates";
import { createSheet } from "./lib/google/sheets";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { planLimits } from "./lib/planLimits";
import dodo from "./lib/dodopayments";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10,
);
const formId = nanoid(); // e.g., "rX9azLmQwe"

export const getGoogleConnectUrl = async () => {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
  const state = JSON.stringify({ redirectUrl: "/dashboard" });
  return getGoogleAuthUrl(redirectUri, state);
};

export const handleRemoveGoogleAccount = async (accountId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_accounts")
    .delete()
    .eq("id", accountId)
    .select();
  if (error) throw error;
  revalidatePath("/integrations");
  return data;
};

export const getGoogleAccounts = async (userId: string) => {
  console.log('@getGoogleAccounts', userId)
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_accounts")
    .select("id, email, access_token")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const getFormsByUserId = async (userId: string) => {
  console.log("@getFormsByUserId", userId);
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const createFormHelper = async ({
  title,
  sheetId,
  template,
  googleAccountId,
  spreadsheetId,
  email,
}: {
  title: string;
  sheetId?: string;
  template?: keyof typeof SPREADSHEET_TEMPLATES;
  googleAccountId: string;
  spreadsheetId?: string;
  email: string;
}) => {
  const user = await currentUser();
  if (!user?.id) return { error: "User not authenticated" };

  const supabase = await createClient();

  const templateConfig = template ? SPREADSHEET_TEMPLATES[template] : null;
  const { data: existingSlackAccount } = await supabase
    .from("slack_accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const { data, error } = await supabase
    .from("forms")
    .insert({
      id: formId,
      user_id: user.id,
      title,
      google_account_id: googleAccountId,
      spreadsheet_id: spreadsheetId || sheetId,
      sheet_name: title,
      builder_config: templateConfig?.builderConfig || null,
      template_used: template || null,
      is_active: true,
      notification_email: email,
      email_enabled: false,
      slack_account_id: existingSlackAccount?.id || null,
      slack_channel: null,
      slack_enabled: false,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating form:", error);
    return { error: error.message };
  }

  return { data, error: null };
};

export const createForm = async ({
  title,
  sheetId,
  template,
  googleAccountId,
  email,
}: {
  title: string;
  sheetId?: string;
  template?: keyof typeof SPREADSHEET_TEMPLATES;
  googleAccountId: string;
  email: string;
}) => {
  try {
    let spreadsheetId = sheetId;
    let headers: string[] = [];
    if (!canCreateForm()) {
      return { error: "You have reached the limit for creating forms" };
    }

    if (template) {
      const templateForm = SPREADSHEET_TEMPLATES[template];
      headers = templateForm.headers;
    }

    if (!sheetId) {
      const sheet = await createSheet(googleAccountId, title, headers);
      spreadsheetId = sheet.spreadsheetId as string;
    }

    const result = await createFormHelper({
      title,
      sheetId,
      template,
      googleAccountId,
      spreadsheetId,
      email,
    });

    if (result.error) {
      return { error: result.error };
    }

    return { data: result.data, error: null };
  } catch (error: any) {
    console.error("Error in createForm:", error);
    return { error: error.message };
  }
};
export const updateForm = async (dataToUpdate: any, formId: string) => {
  const supabase = await createClient();
  const user = await currentUser();
  const { data, error } = await supabase
    .from("forms")
    .update(dataToUpdate)
    .eq("id", formId)
    .eq("user_id", user?.id)
    .select();
  if (error) throw error;
  return data;
};

export async function getUserLocationInfo() {
  const ipInfoApiKey = process.env.IP_INFO_API_KEY;
  const url = `https://ipinfo.io/json?token=${ipInfoApiKey}`;
  const res = await fetch(url);
  return await res.json();
}

export const getSubscription = async () => {
  const { userId } = await auth();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select(
      "plan, status, customer_id, subscription_id, next_billing, billing_interval",
    )
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
};

export const canCreateForm = async () => {
  const { userId } = await auth();
  const supabase = await createClient();
  const { plan } = await getSubscription();
  const { data } = await supabase
    .from("forms")
    .select("id")
    .eq("user_id", userId);
  const planLimit = planLimits[plan as keyof typeof planLimits].maxForms ?? 1;

  return (data?.length ?? 0) <= planLimit;
};

export const fetchGoogleFonts = async () => {
  try {
    const API_KEY = process.env.GOOGLE_FONTS_API_KEY;
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${API_KEY}`,
    );
    const data = await response.json();
    return data.items?.slice(0, 100);
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createCustomerPortalSession = async () => {
  await auth.protect();
  const { userId } = await auth();
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("customer_id")
    .eq("user_id", userId)
    .single();

  if (!subscription?.customer_id) {
    throw new Error("No active subscription found.");
  }

  return await dodo.customers.customerPortal.create(subscription.customer_id);
};
