"use server";

import { auth } from "@clerk/nextjs/server";
import { createClient } from "../supabase/server";
import { revalidatePath } from "next/cache";

export async function handleSlackAuth() {
  try {
    const { userId } = await auth();
    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    const redirectUrl = process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL;
    return `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,channels:read,channels:manage,channels:join&redirect_uri=${redirectUrl}&state=${userId}`;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function handleRemoveSlackAccount(accountId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("slack_accounts")
    .delete()
    .eq("id", accountId)
    .select();
  if (error) throw error;
  revalidatePath("/integrations");
  return data;
}
