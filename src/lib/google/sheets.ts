"use server";
import { google, sheets_v4 } from "googleapis";
import { getAuthenticatedClient } from "./auth";
import { createClient } from "@/lib/supabase/server";

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

// Append values to a sheet
export async function appendToSheet(
  googleAccountId: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
) {
  console.log("@range", range);
  console.log("@values", values);
  const sheets = await getSheetsClient(googleAccountId);
  console.log(
    "sheets",
    (await sheets.spreadsheets.get({ spreadsheetId })).data.sheets
  );

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      // range: `Check if it is working2 By formsync!A1`,// HarSheet1!A1:B2d-coded range for name, email, message
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

// Process a form submission to Google Sheets
export async function processSubmission(submissionId: string) {
  const supabase = await createClient();

  // Get submission with endpoint details
  const { data: submission, error: submissionError } = await supabase
    .from("submissions")
    .select(
      `
      *,
      endpoints:endpoint_id (
        *,
        google_accounts:google_account_id (*)
      )
    `
    )
    .eq("id", submissionId)
    .single();

  if (submissionError || !submission) {
    throw new Error(
      `Submission not found: ${submissionError?.message || "No data returned"}`
    );
  }

  const endpoint = submission.endpoints;
  if (!endpoint) {
    throw new Error("Endpoint not found for this submission");
  }

  // Update submission status
  await supabase
    .from("submissions")
    .update({ status: "processing" })
    .eq("id", submissionId);

  try {
    // Check if we need to create a spreadsheet
    if (!endpoint.spreadsheet_id && endpoint.create_spreadsheet_if_missing) {
      const newSheet = await createSheet(
        endpoint.google_account_id,
        `${endpoint.name} - FormSync`,
        endpoint.sheet_name || "Sheet1" // Provide default if sheet_name is undefined
      );

      // Update endpoint with new spreadsheet ID
      await supabase
        .from("endpoints")
        .update({ spreadsheet_id: newSheet.spreadsheetId })
        .eq("id", endpoint.id);

      endpoint.spreadsheet_id = newSheet.spreadsheetId;
    }

    if (!endpoint.spreadsheet_id) {
      throw new Error(
        "No spreadsheet ID and create_spreadsheet_if_missing is false"
      );
    }

    // Convert submission data to array format for sheets
    const formData = submission.data as Record<string, any>;
    if (!formData || Object.keys(formData).length === 0) {
      throw new Error("Submission contains no data");
    }

    const values = [Object.values(formData)];

    // Determine if we need to add a header row
    if (endpoint.header_row) {
      const { count, error: countError } = await supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("endpoint_id", endpoint.id)
        .eq("status", "completed");

      if (countError) {
        throw new Error(
          `Error checking submission count: ${countError.message}`
        );
      }
      console.log("@endpoint", endpoint);

      if (count === 0) {
        // This is the first submission, add header row
        await appendToSheet(
          endpoint.google_account_id,
          endpoint.spreadsheet_id,
          endpoint.sheet_name || "Sheet1",
          [Object.keys(formData)]
        );
      }
    }

    // Append data to sheet
    const result = await appendToSheet(
      endpoint.google_account_id,
      endpoint.spreadsheet_id,
      endpoint.sheet_name || "Sheet1",
      values
    );

    // Extract row number from result
    const updatedRange = result.updates?.updatedRange;
    const match = updatedRange?.match(/!A(\d+):/);
    const rowNumber = match ? parseInt(match[1]) : null;

    // Update submission as completed
    await supabase
      .from("submissions")
      .update({
        status: "completed",
        sheet_row_number: rowNumber,
        processed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    return { success: true, rowNumber };
  } catch (error: any) {
    // Update submission as failed
    await supabase
      .from("submissions")
      .update({
        status: "failed",
        error_message: error.message || "Unknown error occurred",
        processed_at: new Date().toISOString(),
      })
      .eq("id", submissionId);

    throw error;
  }
}

export async function getExistingSheets(googleAccountId: string) {
  // Use Google Drive API to list all spreadsheets accessible to the user (owned by or shared with)
  const drive = google.drive({
    version: "v3",
    auth: await getAuthenticatedClient(googleAccountId),
  });

  // The query below lists all spreadsheets the user has access to (owned by or shared with, not just created via API)
  const res = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed=false",
    fields: "files(id, name, createdTime, modifiedTime, owners, permissions, sharedWithMeTime)",
    pageSize: 1000,
    orderBy: "modifiedTime desc",
    corpora: "user",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
  });

  // If you want to include files shared with the user, you can also query corpora: 'user' and 'drive'
  // For most use cases, 'user' will include owned and shared files

  return res.data.files || [];
}
