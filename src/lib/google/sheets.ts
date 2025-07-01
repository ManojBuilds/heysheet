"use server";
import { google, sheets_v4 } from "googleapis";
import { getAuthenticatedClient } from "./auth";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "../email";
import { createFormSubmissionMessage } from "../slack/client";
import { sendMessage } from "../slack/sendMessage";
import { FormSubmissionData } from "@/components/email-template";
import { appendToNotionDatabase, listNotionPages, createNotionDatabase } from "../notion/server";
import { planLimits } from "../planLimits";

// Get Google Sheets client
export async function getSheetsClient(
  googleAccountId: string,
): Promise<sheets_v4.Sheets> {
  const auth = await getAuthenticatedClient(googleAccountId);
  return google.sheets({ version: "v4", auth });
}

// Create a new Google Sheet
export async function createSheet(
  googleAccountId: string,
  userSpreadsheetTitle: string,
  headers: string[],
) {
  console.log("@createSheet", googleAccountId, userSpreadsheetTitle);
  const sheets = await getSheetsClient(googleAccountId);
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: userSpreadsheetTitle,
      },
      sheets: [
        {
          properties: {
            title: userSpreadsheetTitle,
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: headers?.map((header) => ({
                    userEnteredValue: { stringValue: header },
                  })),
                },
              ],
            },
          ],
        },
      ],
    },
  });

  return response.data;
}

// Get spreadsheet metadata
export async function getSpreadsheet(
  googleAccountId: string,
  spreadsheetId: string,
) {
  const sheets = await getSheetsClient(googleAccountId);

  const response = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  return response.data;
}

export async function appendToSheet(
  googleAccountId: string,
  spreadsheetId: string,
  sheetName: string,
  incomingData: Record<string, any>,
) {
  console.log("@appendToSheet", {
    googleAccountId,
    spreadsheetId,
    sheetName,
    incomingData,
  });
  const sheets = await getSheetsClient(googleAccountId);

  // Ensure sheet exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  const sheetExists = spreadsheet.data.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName,
  );

  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: { title: sheetName },
            },
          },
        ],
      },
    });

    // Add headers (first row)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [Object.keys(incomingData)],
      },
    });
  }

  // Get current headers from first row
  const headersRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`,
  });

  const currentHeaders: string[] = headersRes.data.values?.[0] || [];

  // Normalize function for header comparison
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_");

  // Build normalizedHeaderMap: normalized → actual
  const normalizedHeaderMap: Record<string, string> = {};
  for (const header of currentHeaders) {
    normalizedHeaderMap[normalize(header)] = header;
  }

  // Identify and append any missing headers
  const newKeys = Object.keys(incomingData);
  const missingKeys = newKeys.filter(
    (key) => !(normalize(key) in normalizedHeaderMap),
  );

  if (missingKeys.length > 0) {
    for (const key of missingKeys) {
      currentHeaders.push(key);
      normalizedHeaderMap[normalize(key)] = key;
    }

    // Update the sheet header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!1:1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [currentHeaders],
      },
    });
  }

  // Generate row aligned to currentHeaders order
  const row = currentHeaders.map((header) => {
    const normalized = normalize(header);
    const matchedKey = Object.keys(incomingData).find(
      (key) => normalize(key) === normalized,
    );
    return matchedKey ? incomingData[matchedKey] : "";
  });

  // Append new row to the sheet
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
  console.log("@endGetResponse: ", response.data);

  return response.data;
}

export async function processSubmission(
  submissionId: string,
  formData: object,
) {
  const supabase = await createClient();

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select(
      `
      *,
      form:forms (
        *,
        slack_account:slack_accounts (*),
        notion_account:notion_accounts (*)
      )
    `,
    )
    .eq("id", submissionId)
    .single();

  if (submissionError || !submission?.form) {
    console.error("Submission or form not found", submissionError);
    throw new Error("Submission or form not found");
  }

  const { form } = submission;

  if (!formData || Object.keys(formData).length === 0) {
    throw new Error("Submission contains no data");
  }

  console.log("@submission", submission);

  // ✅ Fetch user subscription plan
  const { data: subscriptionData } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("clerk_user_id", form.user_id)
    .single();

  const plan = subscriptionData?.plan || "free";
  const limits = planLimits[plan as keyof typeof planLimits];

  try {
    // ✅ Append to Google Sheet (always allowed)
    await appendToSheet(
      form.google_account_id,
      form.spreadsheet_id,
      form.sheet_name,
      formData,
    );
    console.log("✅ Added to Google Sheet");

    const messageData: FormSubmissionData = {
      form: {
        name: form.title,
        spreadsheet_id: form.spreadsheet_id,
      },
      submission: {
        created_at: submission.created_at,
        data: formData,
        id: submission.id,
      },
      analytics: {
        referrer: submission.referrer,
        country: submission.analytics.country,
        city: submission.analytics.city,
        timezone: submission.analytics.timezone,
        deviceType: submission.analytics.device_type,
        browser: submission.analytics.browser,
        language: submission.analytics.language,
        processed_at: submission.created_at,
        created_at: submission.created_at,
      },
    };

    // ✅ Send Slack notification (only if plan allows + properly configured)
    if (
      limits.features.slackIntegration &&
      form.slack_enabled &&
      form.slack_channel &&
      form.slack_account
    ) {
      console.log("📤 Sending Slack message...", messageData);
      const messagePayload = await createFormSubmissionMessage(messageData);
      await sendMessage(
        form.slack_channel,
        messagePayload,
        form.slack_account.slack_token,
      ).catch(console.error);
    }

    // ✅ Send Email notification (only if plan allows + configured)
    if (
      limits.features.emailAlerts &&
      form.email_enabled &&
      form.notification_email
    ) {
      console.log("📤 Sending Email...", messageData);
      await sendEmail({
        dataToSend: messageData,
        toEmail: form.notification_email,
      }).catch(console.error);
    }

    // ✅ Append to Notion database (only if plan allows + properly configured)
    if (
      limits.features.notionIntegration &&
      form.notion_enabled &&
      form.notion_account
    ) {
      let targetNotionDatabaseId = form.notion_database_id;

      if (!targetNotionDatabaseId) {
        console.log("Attempting to create new Notion database...");
        try {
          const notionAccessToken = form.notion_account.access_token;
          const notionPages = await listNotionPages(notionAccessToken);

          if (notionPages.length === 0) {
            console.warn("No Notion pages found to create a new database under.");
            return;
          }

          const parentPageId = notionPages[0].id;
          const newDbTitle = `Form Submissions - ${form.title}`;
          const newDb = await createNotionDatabase(
            notionAccessToken,
            parentPageId,
            newDbTitle,
            {
              Name: { title: {} },
            },
          );
          targetNotionDatabaseId = newDb.id;

          const { error: updateError } = await supabase
            .from("forms")
            .update({ notion_database_id: targetNotionDatabaseId })
            .eq("id", form.id);

          if (updateError) {
            console.error(
              "Error updating form with new Notion database ID:",
              updateError,
            );
          }
          console.log(
            `✅ Created new Notion database: ${newDbTitle} (${targetNotionDatabaseId})`,
          );
        } catch (createDbError) {
          console.error("❌ Error creating new Notion database:", createDbError);
          return;
        }
      }

      if (targetNotionDatabaseId) {
        console.log("📤 Appending to Notion database...");
        await appendToNotionDatabase(
          form.notion_account.access_token,
          targetNotionDatabaseId,
          formData,
        ).catch(console.error);
      }
    }

    console.log("✅ Submission processed successfully");
    return { success: true };
  } catch (error: any) {
    console.error("❌ Error processing submission:", error);
    throw error;
  }
}

export async function getExistingSheets(googleAccountId: string) {
  // Use Google Drive API to list all spreadsheets accessible to the user
  const drive = google.drive({
    version: "v3",
    auth: await getAuthenticatedClient(googleAccountId),
  });

  try {
    // Simpler query that should include all spreadsheets regardless of creation method
    const res = await drive.files.list({
      q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=true",
      fields:
        "nextPageToken, files(id, name, createdTime, modifiedTime, owners, permissions, sharedWithMeTime)",
      pageSize: 1000,
      orderBy: "modifiedTime desc",
      // Using 'allDrives' ensures we get files from all possible sources
      spaces: "drive",
      corpora: "allDrives",
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    console.log(`Found ${res.data.files?.length || 0} spreadsheets`);
    return res.data.files || [];
  } catch (error) {
    console.error("Error fetching spreadsheets:", error);
    throw error;
  }
}

export async function getSheetTabs(
  googleAccountId: string,
  spreadsheetId: string,
) {
  const sheets = await getSheetsClient(googleAccountId);
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties",
  });
  // Returns an array of sheet/tab names
  return response.data.sheets?.map((sheet) => sheet.properties?.title) || [];
}
