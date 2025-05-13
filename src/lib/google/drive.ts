import { google, drive_v3 } from 'googleapis';
import { getAuthenticatedClient } from './auth';

// Get Google Drive client
export async function getDriveClient(googleAccountId: string): Promise<drive_v3.Drive> {
  const auth = await getAuthenticatedClient(googleAccountId);
  return google.drive({ version: 'v3', auth });
}

// Share a spreadsheet with a specific user
export async function shareSpreadsheet(
  googleAccountId: string,
  fileId: string,
  emailAddress: string,
  role: 'reader' | 'writer' | 'commenter' | 'owner' = 'writer'
) {
  const drive = await getDriveClient(googleAccountId);
  
  const response = await drive.permissions.create({
    fileId,
    requestBody: {
      type: 'user',
      role,
      emailAddress,
    },
    fields: 'id',
  });
  
  return response.data;
}

// Get file metadata
export async function getFileMetadata(googleAccountId: string, fileId: string) {
  const drive = await getDriveClient(googleAccountId);
  
  const response = await drive.files.get({
    fileId,
    fields: 'id,name,webViewLink,owners,permissions',
  });
  
  return response.data;
}

// List user's spreadsheets
export async function listSpreadsheets(googleAccountId: string) {
  const drive = await getDriveClient(googleAccountId);
  
  const response = await drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet'",
    fields: 'files(id,name,webViewLink,createdTime)',
    orderBy: 'createdTime desc',
  });
  
  return response.data.files || [];
}