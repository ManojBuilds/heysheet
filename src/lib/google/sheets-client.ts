import { createClient } from '@/lib/supabase/client';

// Create a new Google Sheet (client-side version)
export async function createGoogleSheet(
  googleAccountId: string,
  sheetName: string,
  title: string
) {
  // Call our API endpoint to create a sheet
  const response = await fetch('/api/google/sheets/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      googleAccountId,
      sheetName,
      title,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create spreadsheet');
  }
  
  return response.json();
}