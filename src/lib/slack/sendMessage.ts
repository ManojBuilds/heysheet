'use server'

import { getSlackAccountAndNotificationAndToken } from "./client";

type SlackMessage = string | {
  blocks: any[];
  [key: string]: any;
};

export async function sendMessage(channel: string, message: SlackMessage) {
    const slackAccount = await getSlackAccountAndNotificationAndToken()
    
    const payload = typeof message === 'string' 
        ? { channel, text: message }
        : { channel, ...message };

    console.log("Sending Slack message:", { channel, payload });
    
    const res = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Bearer ${slackAccount.slack_accounts.slack_token}`,
        },
        body: JSON.stringify(payload),
    });

    console.log("Slack API response status:", res.status);
    const data = await res.json();
    console.log("Slack API response data:", data);

    if (!data.ok) {
        console.error("Failed to send message to Slack:", data.error);
        throw new Error(data.error || "Failed to send message to Slack");
    }
    return data;
}

// If you need to call this from the frontend, create an API route (e.g., /api/send-slack-message)
// and call that API route from your frontend instead of calling Slack directly.