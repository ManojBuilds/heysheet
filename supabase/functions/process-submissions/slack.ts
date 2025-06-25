import { FormSubmissionData, SlackMessage } from "./types.ts";

export async function createFormSubmissionMessage(data: FormSubmissionData) {
    const formattedData = Object.entries(data.submission.data)
        .map(
            ([key, value]) =>
                `• *${key}:* ${value}`
        )
        .join('\n');

    return {
        blocks: [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: "📥 New Form Submission Received",
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `🗂️ *Form:*\n${data.form.name}`
                    },
                    {
                        type: "mrkdwn",
                        text: `⏰ *Submitted At:*\n<!date^${Math.floor(new Date(data.submission.created_at).getTime() / 1000)}^{date_short} at {time}|${data.submission.created_at}>`
                    }
                ]
            },
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "📝 *Submission Details:*\n" + formattedData
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `🌐 *Source:*\n${data.analytics?.referrer || 'Direct'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `🏳️ *Country:*\n${data.analytics?.country || 'Unknown'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `🏙️ *City:*\n${data.analytics?.city || 'Unknown'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `🕰️ *Timezone:*\n${data.analytics?.timezone || 'Unknown'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `📱 *Device Type:*\n${data.analytics?.deviceType || 'Unknown'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `🌍 *Browser:*\n${data.analytics?.browser || 'Unknown'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `🗣️ *Language:*\n${data.analytics?.language || 'Unknown'}`
                    },
                    {
                        type: "mrkdwn",
                        text: `✅ *Processed At:*\n${data.analytics?.processed_at || data.analytics?.created_at || 'Unknown'}`
                    }
                ]
            },
            {
                type: "context",
                elements: [
                    {
                        type: "mrkdwn",
                        text: `🔗 <https://docs.google.com/spreadsheets/d/${data.form.spreadsheet_id}|View in Google Sheets> &nbsp;•&nbsp; 🆔 Submission ID: \`${data.submission.id}\``
                    }
                ]
            },
            {
                type: "divider"
            }
        ]
    };
}


export async function sendMessage(
    channel: string,
    message: SlackMessage,
    slackToken: string,
) {
    const payload =
        typeof message === "string"
            ? { channel, text: message }
            : { channel, ...message };
    console.log("Sending Slack message:", { channel, payload });
    const res = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${slackToken}`,
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
