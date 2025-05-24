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
    const data = await res.json();
    if (!data.ok) {
        console.error("Failed to send message to Slack:", data.error);
        throw new Error(data.error || "Failed to send message to Slack");
    }
    return data;
}