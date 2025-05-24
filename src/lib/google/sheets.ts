"use server";
import { google, sheets_v4 } from "googleapis";
import { getAuthenticatedClient } from "./auth";
import { createClient } from "@/lib/supabase/server";
import { sendEmail } from "../email";
import {
  createFormSubmissionMessage,
  getSlackAccountAndNotificationAndToken,
} from "../slack/client";
import { sendMessage } from "../slack/sendMessage";

// Get Google Sheets client
export async function getSheetsClient(
  googleAccountId: string
): Promise<sheets_v4.Sheets> {
  const auth = await getAuthenticatedClient(googleAccountId);
  return google.sheets({ version: "v4", auth });
}

// Create a new Google Sheet
export async function createSheet(
  googleAccountId: string,
  title: string,
  sheetName: string = "Sheet1"
) {
  console.log({ title, sheetName });
  const sheets = await getSheetsClient(googleAccountId);

  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: title + " By formsync",
      },
      sheets: [
        {
          properties: {
            title: sheetName,
          },
        },
      ],
    },
  });

  return response.data;
}

// Get spreadsheet metadata
export async function getSpreadsheet(
  googleAccountId: string,
  spreadsheetId: string
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
  range: string,
  values: any[][]
) {
  console.log('Adding to sheet')
  const sheets = await getSheetsClient(googleAccountId);
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error appending to sheet:", error);
    throw error;
  }
}

export async function processSubmission(submissionId: string) {
  const supabase = await createClient();

  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select(
      `
    * ,
    endpoint:endpoint_id (
      *,
      google_accounts:google_account_id (*)
    )
  `
    )
    .eq("id", submissionId)
    .single();

  if (submissionError || !submission?.endpoint) {
    throw new Error("Submission or endpoint not found");
  }

  const { endpoint } = submission;
  const formData = submission.data as Record<string, any>;

  if (!formData || Object.keys(formData).length === 0) {
    throw new Error("Submission contains no data");
  }

  try {
    const values = [Object.values(formData)];

    if (endpoint.header_row) {
      const { count } = await supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("endpoint_id", endpoint.id)
        .eq("status", "completed")
        .single();

      if (count === 0) {
        values.unshift(Object.keys(formData));
      }
    }

    const result = await appendToSheet(
      endpoint.google_account_id,
      endpoint.spreadsheet_id,
      "Sheet1",
      values
    );

    const rowNumber = result.updates?.updatedRange?.match(/!A(\d+):/)?.[1];

    const [emailNotif, slackAccount] = await Promise.all([
      supabase
        .from("email_notifications")
        .select("enabled, email")
        .eq("user_id", endpoint.user_id)
        .single(),
      getSlackAccountAndNotificationAndToken(),
    ]);

    await supabase
      .from("submissions")
      .update({
        status: "completed",
        sheet_row_number: rowNumber ? parseInt(rowNumber) : null,
        processed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    if (slackAccount?.enabled && slackAccount.slack_accounts) {
      const messagePayload = await createFormSubmissionMessage({
        endpoint: {
          name: endpoint.name,
          spreadsheet_id: endpoint.spreadsheet_id,
        },
        submission: {
          created_at: submission.created_at,
          data: submission.data,
          id: submission.id,
        },
        analytics: { ...submission },
      });
      sendMessage(slackAccount.slack_channel, messagePayload).catch(
        console.error
      );
    }

    if (emailNotif.data?.enabled && emailNotif.data?.email) {
      sendEmail({
        data: submission.data,
        toEmail: emailNotif.data.email,
      }).catch(console.error);
    }

    return { success: true, rowNumber };
  } catch (error: any) {
    console.error("Error processing submission:", error);
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
  spreadsheetId: string
) {
  const sheets = await getSheetsClient(googleAccountId);
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties",
  });
  // Returns an array of sheet/tab names
  return response.data.sheets?.map((sheet) => sheet.properties?.title) || [];
}
