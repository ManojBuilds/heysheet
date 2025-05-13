import { createClient } from "@/lib/supabase/server";
import { createSheet } from "@/lib/google/sheets";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { googleAccountId, sheetName, title } = await request.json();

    if (!googleAccountId || !sheetName || !title) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify that the Google account belongs to the user
    const supabase = await createClient();
    const { data: account, error: accountError } = await supabase
      .from("google_accounts")
      .select("*")
      .eq("id", googleAccountId)
      .eq("user_id", userId)
      .single();

    if (accountError || !account) {
      return NextResponse.json(
        { message: "Google account not found or not authorized" },
        { status: 403 }
      );
    }

    // Create the Google Sheet
    const sheet = await createSheet(googleAccountId, sheetName, title);

    return NextResponse.json(sheet);
  } catch (error: any) {
    console.error("Error creating Google Sheet:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create Google Sheet" },
      { status: 500 }
    );
  }
}
