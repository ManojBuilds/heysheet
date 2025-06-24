import { currentUser } from "@clerk/nextjs/server";
import { getFormsByUserId, getGoogleAccounts } from "@/actions";
import FormsPageClient from "./forms-client";
import { getGoogleAuthUrl } from "@/lib/google/auth";

export const metadata = {
  title: "Forms - HeySheet",
  description: "Manage your forms and Google Sheets integrations.",
};

export default async function FormsPage() {
  const user = await currentUser();
  const userId = user?.id || "";
  const [googleAccountsData, forms] = await Promise.all([
    getGoogleAccounts(userId),
    getFormsByUserId(userId),
  ]);
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;
  const state = JSON.stringify({ redirectUrl: "/dashboard" });
  const googleAuthUrl = getGoogleAuthUrl(redirectUri, state);

  return (
    <FormsPageClient
      userName={user?.firstName || ""}
      forms={forms}
      googleAccountsData={googleAccountsData}
      googleAuthUrl={googleAuthUrl}
    />
  );
}
