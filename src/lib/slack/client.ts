"use server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "../supabase/server";

interface FormSubmissionData {
  endpoint: {
    name: string;
    spreadsheet_id: string;
  };
  submission: {
    data: Record<string, any>;
    created_at: string;
    id: string;
  };
  analytics?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
    country?: string;
  };
}

export async function addAppToASlackChannel(channel: string) {
  console.log('channel', channel)
  const slackData = await getSlackAccountAndNotificationAndToken();
  const token = await slackData.slack_accounts.slack_token;

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

export async function listAllSlackChannel() {
  const slackData = await getSlackAccountAndNotificationAndToken();
  const token = await slackData.slack_accounts.slack_token;

  const response = await fetch("https://slack.com/api/conversations.list", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error || "Failed to list channels");
  }

  return data.channels;
}

export async function getSlackAccountAndNotificationAndToken() {
  const supabase = await createClient();
  const { userId } = await auth();
  const { data, error } = await supabase
    .from("slack_notifications")
    .select("*, slack_accounts(*)")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function createFormSubmissionMessage() {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📝 New Form Submission",
          emoji: true
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Form:*\nContact Form"
          },
          {
            type: "mrkdwn",
            text: "*Submitted At:*\n<!date^1703980800^{date_short} at {time}|December 31, 2023 12:00 PM>"
          }
        ]
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Submission Details:*\n• *Name:* John Doe\n• *Email:* john@example.com\n• *Message:* Hello, I'd like to learn more about your services."
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: "*Source:*\nContact Page"
          },
          {
            type: "mrkdwn",
            text: "*IP Location:*\nNew York, USA"
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `View in <https://docs.google.com/spreadsheets/d/your-sheet-id|Google Sheets> • Submission ID: \`sub_abc123\``
          }
        ]
      },
      {
        type: "divider"
      }
    ]
  };
}

// export function createFormSubmissionMessage(data: FormSubmissionData) {
//   const formattedData = Object.entries(data.submission.data)
//     .map(([key, value]) => `• *${key}:* ${value}`)
//     .join('\n');

//   return {
//     blocks: [
//       {
//         type: "header",
//         text: {
//           type: "plain_text",
//           text: "🎯 New Form Submission Received",
//           emoji: true
//         }
//       },
//       {
//         type: "section",
//         fields: [
//           {
//             type: "mrkdwn",
//             text: `*Form:*\n${data.endpoint.name}`
//           },
//           {
//             type: "mrkdwn",
//             text: `*Submitted:*\n<!date^${Math.floor(new Date(data.submission.created_at).getTime() / 1000)}^{date_short} at {time}|${data.submission.created_at}>`
//           }
//         ]
//       },
//       {
//         type: "section",
//         text: {
//           type: "mrkdwn",
//           text: "*Submission Details:*\n" + formattedData
//         }
//       },
//       {
//         type: "section",
//         fields: [
//           {
//             type: "mrkdwn",
//             text: `*Location:*\n${data.analytics?.country || 'Unknown'}`
//           },
//           {
//             type: "mrkdwn",
//             text: `*Source:*\n${data.analytics?.referrer || 'Direct'}`
//           }
//         ]
//       },
//       {
//         type: "context",
//         elements: [
//           {
//             type: "mrkdwn",
//             text: `ID: \`${data.submission.id}\` • View in <https://docs.google.com/spreadsheets/d/${data.endpoint.spreadsheet_id}|Google Sheets>`
//           }
//         ]
//       },
//       {
//         type: "divider"
//       }
//     ]
//   };
// }
