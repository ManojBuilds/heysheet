"use server";
import { google, sheets_v4 } from "googleapis";
import { getAuthenticatedClient } from "./auth";

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


export async function getSheetTabs(
  googleAccountId: string,
  spreadsheetId: string,
) {
  try {
   const sheets = await getSheetsClient(googleAccountId);
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: "sheets.properties",
  });
  // Returns an array of sheet/tab names
  console.log("@getSheetsTabs",response.data)
  return response.data.sheets?.map((sheet) => sheet.properties?.title) || []; 
  } catch (error) {
   console.log('error', error)
   return []
  }
  
}
