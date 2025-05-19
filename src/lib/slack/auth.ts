"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function handleSlackAuth() {
  try {
    const {userId} = await auth()
    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    const redirectUrl = process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL;
const URL = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write,channels:read,channels:manage,channels:join&redirect_uri=${redirectUrl}&state=${userId}`;
redirect(URL)
  } catch (error) {
    console.log(error);
    throw error;
  }
}



