import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { google } from "googleapis";
import { config } from "@/config";

// Google OAuth scopes needed for Sheets API and Drive Picker
const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive.file",
  "email",
  "profile",
];

// Create OAuth2 client
function getOAuth2Client(redirectUri = `${config.appUrl}/api/auth/google/callback`) {
  return new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri,
  );
}

// Generate Google OAuth URL
export async function getGoogleAuthUrl(redirectUri: string, state: string) {
  const oauth2Client = getOAuth2Client(redirectUri);

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
    prompt: "consent",
    state,
  });
}

// awaitExchange code for tokens
export async function getGoogleTokens(code: string, redirectUri: string) {
  const oauth2Client = getOAuth2Client(redirectUri);
  try {
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  } catch (error) {
    console.error("Error getting Google tokens:", error);
    throw error;
  }
}

// Get user info from Google
export async function getGoogleUserInfo(access_token: string) {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token });

    const people = google.people({ version: "v1", auth: oauth2Client });
    const { data } = await people.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos",
    });

    return {
      email: data.emailAddresses?.[0]?.value || "",
      name: data.names?.[0]?.displayName || "",
      picture: data.photos?.[0]?.url || "",
    };
  } catch (error) {
    console.error("Error getting Google user info:", error);
    throw error;
  }
}

// Save Google account to database
export async function saveGoogleAccount(
  userId: string,
  tokenData: any,
  userInfo: any,
) {
  console.log("@Saving google data", { userId, tokenData, userInfo });
  const supabase = await createClient();

  // Check if we already have this account
  const { data: existingAccount } = await supabase
    .from("google_accounts")
    .select("refresh_token")
    .eq("user_id", userId)
    .eq("email", userInfo.email)
    .single();

  // If we already have a refresh token and the new one is empty, keep the old one
  const refreshToken =
    tokenData.refresh_token ||
    (existingAccount ? existingAccount.refresh_token : "");

  const { data, error } = await supabase
    .from("google_accounts")
    .upsert(
      {
        user_id: userId,
        email: userInfo.email,
        access_token: tokenData.access_token,
        refresh_token: refreshToken,
        token_expires_at: tokenData.expiry_date
          ? new Date(tokenData.expiry_date).toISOString()
          : new Date(
            Date.now() + (tokenData.expires_in || 3600) * 1000,
          ).toISOString(),
      },
      {
        onConflict: "user_id,email",
      },
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving Google account:", error);
    throw error;
  }

  return data;
}

// Handle Google OAuth callback
export async function handleGoogleCallback(
  userId: string,
  code: string,
  redirectUri: string,
) {
  try {
    // Exchange code for tokens
    const tokenData = await getGoogleTokens(code, redirectUri);
    console.log("@tokenData", tokenData);

    if (!tokenData.access_token) {
      console.error("No access token received");
      return redirect("/dashboard?error=token_exchange_failed");
    }

    // Get user info
    const userInfo = await getGoogleUserInfo(tokenData.access_token);
    console.log("@userInfo", userInfo);

    if (!userInfo || !userInfo.email) {
      console.error("Failed to get user info or email missing");
      return redirect("/dashboard?error=user_info_failed");
    }

    // Save account to database
    await saveGoogleAccount(userId, tokenData, userInfo);

    // Redirect to dashboard
    // return redirect('/dashboard?google_connected=true');
    return { success: true };
  } catch (error: any) {
    console.error("Error handling Google callback:", error);
    throw error;
  }
}

// Get authenticated OAuth2 client for a user
export async function getAuthenticatedClient(googleAccountId: string) {
  const supabase = await createClient();

  // Get Google account
  const { data: account, error: accountError } = await supabase
    .from("google_accounts")
    .select("*")
    .eq("id", googleAccountId)
    .single();

  if (accountError || !account) {
    throw new Error("Google account not found");
  }

  // Create OAuth2 client
  const oauth2Client = getOAuth2Client();

  // Set credentials
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: new Date(account.token_expires_at).getTime(),
  });

  // Handle token refresh if needed
  oauth2Client.on("tokens", async (tokens) => {
    if (tokens.access_token) {
      // Update the token in the database
      await supabase
        .from("google_accounts")
        .update({
          access_token: tokens.access_token,
          token_expires_at: tokens.expiry_date
            ? new Date(tokens.expiry_date).toISOString()
            : new Date(Date.now() + 3600 * 1000).toISOString(),
        })
        .eq("id", googleAccountId);
    }
  });

  return oauth2Client;
}
