import { google } from "npm:googleapis@100.0.0";
import { createClient } from 'jsr:@supabase/supabase-js@2';
function getOAuth2Client(redirectUri) {
  return new google.auth.OAuth2(Deno.env.get('NEXT_PUBLIC_GOOGLE_CLIENT_ID'), Deno.env.get('GOOGLE_CLIENT_SECRET'), redirectUri);
}
export async function getAuthenticatedClient(googleAccountId) {
  const supabase = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '');
  // Get Google account
  const { data: account, error: accountError } = await supabase.from("google_accounts").select("*").eq("id", googleAccountId).single();
  if (accountError || !account) {
    throw new Error("Google account not found");
  }
  // Create OAuth2 client
  const oauth2Client = getOAuth2Client();
  // Set credentials
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: new Date(account.token_expires_at).getTime()
  });
  // Handle token refresh if needed
  oauth2Client.on("tokens", async (tokens)=>{
    if (tokens.access_token) {
      // Update the token in the database
      await supabase.from("google_accounts").update({
        access_token: tokens.access_token,
        token_expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : new Date(Date.now() + 3600 * 1000).toISOString()
      }).eq("id", googleAccountId);
    }
  });
  return oauth2Client;
}
// Get Google Sheets client
export async function getSheetsClient(googleAccountId) {
  const auth = await getAuthenticatedClient(googleAccountId);
  return google.sheets({
    version: "v4",
    auth
  });
}
export async function appendToSheet(googleAccountId, spreadsheetId, sheetName, incomingData) {
  console.log("@appendToSheet", {
    googleAccountId,
    spreadsheetId,
    sheetName,
    incomingData
  });
  const sheets = await getSheetsClient(googleAccountId);
  // Ensure sheet exists
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId
  });
  const sheetExists = spreadsheet.data.sheets?.some((sheet)=>sheet.properties?.title === sheetName);
  if (!sheetExists) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }
        ]
      }
    });
    // Add headers (first row)
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          Object.keys(incomingData)
        ]
      }
    });
  }
  // Get current headers from first row
  const headersRes = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!1:1`
  });
  const currentHeaders = headersRes.data.values?.[0] || [];
  // Normalize function for header comparison
  const normalize = (str)=>str.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
  // Build normalizedHeaderMap: normalized → actual
  const normalizedHeaderMap = {};
  for (const header of currentHeaders){
    normalizedHeaderMap[normalize(header)] = header;
  }
  // Identify and append any missing headers
  const newKeys = Object.keys(incomingData);
  const missingKeys = newKeys.filter((key)=>!(normalize(key) in normalizedHeaderMap));
  if (missingKeys.length > 0) {
    for (const key of missingKeys){
      currentHeaders.push(key);
      normalizedHeaderMap[normalize(key)] = key;
    }
    // Update the sheet header row
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!1:1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          currentHeaders
        ]
      }
    });
  }
  // Generate row aligned to currentHeaders order
  const row = currentHeaders.map((header)=>{
    const normalized = normalize(header);
    const matchedKey = Object.keys(incomingData).find((key)=>normalize(key) === normalized);
    return matchedKey ? incomingData[matchedKey] : "";
  });
  // Append new row to the sheet
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: sheetName,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        row
      ]
    }
  });
  console.log("@endGetResponse: ", response.data);
  return response.data;
}
