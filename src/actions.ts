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
import { config } from "./config";
import { cache } from "react";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  10,
);

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

export const handleRemoveNotionAccount = async (accountId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notion_accounts")
    .delete()
    .eq("id", accountId)
    .select();
  if (error) throw error;
  revalidatePath("/integrations");
  return data;
};

export const getGoogleAccounts = async (userId: string) => {
  console.log("@getGoogleAccounts", userId);
  if (!userId) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("google_accounts")
    .select("id, email, access_token, refresh_token, token_expires_at")
    .eq("user_id", userId);
  if (error) throw error;
  return data || [];
};

export const updateGoogleAccountInDb = async (accountId: string, dataToUpdate: Record<string, any>) => {
  if (!accountId || !dataToUpdate) return;
  const [{ userId }, supabase] = await Promise.all([
    auth(),
    createClient()
  ])
  await supabase
    .from("google_accounts")
    .update("id, email, access_token, refresh_token, token_expires_at")
    .eq("user_id", userId).eq('id', accountId)
}

export const getFormsByUserId = async (userId: string, from = 0, to = 9) => {
  if (!userId) return { forms: [], totalCount: 0 };
  const supabase = await createClient();
  const { data, error, count } = await supabase
    .from("forms")
    .select("id, title, sheet_name, created_at, is_active, submission_count", {
      count: "exact",
    })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { forms: data || [], totalCount: count || 0 };
};

export const createFormHelper = async ({
  title,
  sheetId,
  template,
  googleAccountId,
  spreadsheetId,
  email,
  notionDatabaseId,
  notionAccountId,
  sheetName,
}: {
  title: string;
  sheetId?: string;
  template?: keyof typeof SPREADSHEET_TEMPLATES;
  googleAccountId?: string;
  spreadsheetId?: string;
  email?: string;
  notionDatabaseId?: string;
  notionAccountId?: string;
  sheetName?: string;
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
      id: nanoid(),
      user_id: user.id,
      title,
      google_account_id: googleAccountId,
      spreadsheet_id: spreadsheetId || sheetId,
      sheet_name: sheetName || title,
      builder_config: templateConfig?.builderConfig || null,
      template_used: template || null,
      is_active: true,
      notification_email: email,
      email_enabled: false,
      slack_account_id: existingSlackAccount?.id || null,
      slack_channel: null,
      slack_enabled: false,
      notion_database_id: notionDatabaseId,
      notion_account_id: notionAccountId,
      notion_enabled: !!notionDatabaseId,
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
  notionDatabaseId,
  notionAccountId,
  sheetName,
}: {
  title: string;
  sheetId?: string;
  template?: keyof typeof SPREADSHEET_TEMPLATES;
  googleAccountId?: string;
  email?: string;
  notionDatabaseId?: string;
  notionAccountId?: string;
  sheetName?: string;
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

    if (!sheetId && googleAccountId) {
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
      notionDatabaseId,
      notionAccountId,
      sheetName,
    });

    if (result.error) {
      return { error: result.error };
    }
    revalidatePath('/dashboard')

    return { data: result.data, error: null };
  } catch (error: any) {
    console.error("Error in createForm:", error);
    return { error: error.message };
  }
};
export const updateForm = async (dataToUpdate: any, formId: string) => {
  const supabase = await createClient();
  const user = await currentUser();

  const { webhook_enabled, ...formDataToUpdate } = dataToUpdate;

  // Update forms table
  const { data, error } = await supabase
    .from("forms")
    .update({ ...formDataToUpdate, webhook_enabled })
    .eq("id", formId)
    .eq("user_id", user?.id)
    .select();

  if (error) throw error;

  return data;
};

export const updateWebhookSettings = async ({
  formId,
  enabled,
  url,
  secret,
}: {
  formId: string;
  enabled: boolean;
  url: string;
  secret: string;
}) => {
  const supabase = await createClient();
  const user = await currentUser();

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  if (enabled) {
    console.log("Creating webhook");
    // If webhook is enabled, upsert the webhook details
    const { error: upsertError } = await supabase.from("webhooks").upsert(
      {
        form_id: formId,
        url: url,
        secret: secret,
      },
      { onConflict: "form_id" },
    );

    if (upsertError) {
      console.error("Error upserting webhook:", upsertError);
      throw upsertError;
    }
  } else {
    console.log("Deleting webhook");
    // If webhook is disabled, delete the webhook details
    const { error: deleteError } = await supabase
      .from("webhooks")
      .delete()
      .eq("form_id", formId);

    if (deleteError) {
      console.error("Error deleting webhook:", deleteError);
      throw deleteError;
    }
  }

  // Revalidate path to reflect changes in UI
  revalidatePath(`/forms/${formId}`);
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
      "plan, status, customer_id, next_billing, billing_interval, subscription_id",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.log('@getSubscription', error)
  }

  if (data) {
    return data;
  }
  return {
    plan: "free",
    status: "active",
    next_billing: "",
    customer_id: "",
    billing_interval: "monthly",
    subscription_id: "",
  };
};

export const canCreateForm = async () => {
  const [{ userId }, supabase, { plan }] = await Promise.all([
    auth(), createClient(), getSubscription()
  ])
  const { data } = await supabase
    .from("forms")
    .select("id")
    .eq("user_id", userId);
  const planLimit = planLimits[plan as keyof typeof planLimits].maxForms ?? 1;

  return (data?.length ?? 0) <= planLimit;
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

export const createDodopaymentsCheckoutSession = async ({
  email,
  name,
  productId,
}: {
  email: string;
  name: string;
  productId: string;
}) => {
  try {
    let customerId;
    const supabase = await createClient();
    const { data } = await supabase
      .from("subscription")
      .select("customer_id")
      .eq("email", email)
      .maybeSingle();
    if (data?.customer_id) {
      customerId = data?.customer_id;
    } else {
      const newCustomer = await dodo.customers.create({
        name,
        email,
      });
      if (!newCustomer.customer_id) {
        return { success: false, message: "Failed to create customer" };
      }
      customerId = newCustomer.customer_id;
    }
    const subscription = await dodo.subscriptions.create({
      billing: {
        city: "",
        country: "IN",
        state: "state",
        street: "street",
        zipcode: "89789",
      },
      customer: { customer_id: customerId },
      product_id: productId,
      payment_link: true,
      return_url: `${config.appUrl}/dashboard`,
      quantity: 1,
    });
    console.log(subscription);
    if (!subscription.payment_link) {
      throw new Error("Failed to create payment link");
    }
    return { success: true, link: subscription.payment_link };
  } catch (error: any) {
    console.log(error);
    return { success: false, message: error.message };
  }
};
