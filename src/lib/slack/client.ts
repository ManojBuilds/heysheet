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
  if(!token) return []
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
  const submissionFields = Object.entries(data.submission.data).map(
    ([key, value]) => {
      const stringValue = String(value);
      const truncatedValue =
        stringValue.length > 100
          ? stringValue.substring(0, 97) + "..."
          : stringValue;
      return {
        type: "mrkdwn",
        text: `*${key}:*\n${truncatedValue}`,
      };
    }
  );

  const analyticsFields = [
    { label: "Source", value: data.analytics?.referrer, icon: "🌐" },
    { label: "Country", value: data.analytics?.country, icon: "🏳️" },
    { label: "City", value: data.analytics?.city, icon: "🏙️" },
    { label: "Timezone", value: data.analytics?.timezone, icon: "🕰️" },
    { label: "Device", value: data.analytics?.deviceType, icon: "📱" },
    { label: "Browser", value: data.analytics?.browser, icon: "🌍" },
    { label: "Language", value: data.analytics?.language, icon: "🗣️" },
  ]
    .filter(
      (item) => item.value && item.value !== "Unknown" && item.value !== "Direct"
    )
    .map((item) => ({
      type: "mrkdwn",
      text: `${item.icon} *${item.label}:*\n${item.value}`,
    }));

  const blocks: any[] = [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: `📥 New Submission for ${data.form.name}`,
        emoji: true,
      },
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Received on <!date^${Math.floor(
            new Date(data.submission.created_at).getTime() / 1000
          )}^{date_long_pretty} at {time}|${data.submission.created_at}>`,
        },
      ],
    },
    {
      type: "divider",
    },
  ];

  if (submissionFields.length > 0) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📝 Submission Details*",
      },
    });
    if (submissionFields.length <= 10) {
      blocks.push({
        type: "section",
        fields: submissionFields,
      });
    } else {
      const text = Object.entries(data.submission.data)
        .map(([key, value]) => `• *${key}:* ${value}`)
        .join("\n");
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: text,
        },
      });
    }
  }

  if (analyticsFields.length > 0) {
    blocks.push({ type: "divider" });
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📊 Analytics*",
      },
      fields: analyticsFields,
    });
  }

  blocks.push({ type: "divider" });

  blocks.push(
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "View in Google Sheets",
            emoji: true,
          },
          style: "primary",
          url: `https://docs.google.com/spreadsheets/d/${data.form.spreadsheet_id}`,
          action_id: `view_in_sheets_${data.submission.id}`,
        },
      ],
    },
    {
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `Submission ID: \`${data.submission.id}\``,
        },
      ],
    }
  );

  return { blocks };
}
