"use server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "../supabase/server";

interface FormSubmissionData {
  form: {
    name: string;
    spreadsheet_id: string;
  };
  submission: {
    data: Record<string, any>;
    created_at: string;
    id: string;
  };
  analytics?: {
    referrer?: string;
    country?: string;
    city?: string;
    timezone?: string;
    deviceType?: string;
    browser?: string;
    language?: string;
    processed_at?: string;
    created_at?: string;
  };
}

export async function addAppToASlackChannel(channel: string, token: string) {
  console.log("channel", channel);
  const response = await fetch("https://slack.com/api/conversations.join", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ channel }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || "Failed to join channel");
  }

  return data;
}

export async function listAllSlackChannel(token: string) {
  console.log("@listAllSlackChannel", token);
  const response = await fetch("https://slack.com/api/conversations.list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();

  if (!data.ok) {
    console.log(data);
    throw new Error(data.error || "Failed to list channels");
  }
  return data.channels;
}

export async function getSlackAccountToken() {
  const supabase = await createClient();
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("slack_accounts")
    .select("id, slack_token")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function createFormSubmissionMessage(data: FormSubmissionData) {
  const formattedData = Object.entries(data.submission.data)
    .map(([key, value]) => `• *${key}:* ${value}`)
    .join("\n");

  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📥 New Form Submission Received",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `🗂️ *Form:*\n${data.form.name}`,
          },
          {
            type: "mrkdwn",
            text: `⏰ *Submitted At:*\n<!date^${Math.floor(new Date(data.submission.created_at).getTime() / 1000)}^{date_short} at {time}|${data.submission.created_at}>`,
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "📝 *Submission Details:*\n" + formattedData,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `🌐 *Source:*\n${data.analytics?.referrer || "Direct"}`,
          },
          {
            type: "mrkdwn",
            text: `🏳️ *Country:*\n${data.analytics?.country || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `🏙️ *City:*\n${data.analytics?.city || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `🕰️ *Timezone:*\n${data.analytics?.timezone || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `📱 *Device Type:*\n${data.analytics?.deviceType || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `🌍 *Browser:*\n${data.analytics?.browser || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `🗣️ *Language:*\n${data.analytics?.language || "Unknown"}`,
          },
          {
            type: "mrkdwn",
            text: `✅ *Processed At:*\n${data.analytics?.processed_at || data.analytics?.created_at || "Unknown"}`,
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `🔗 <https://docs.google.com/spreadsheets/d/${data.form.spreadsheet_id}|View in Google Sheets> &nbsp;•&nbsp; 🆔 Submission ID: \`${data.submission.id}\``,
          },
        ],
      },
      {
        type: "divider",
      },
    ],
  };
}
