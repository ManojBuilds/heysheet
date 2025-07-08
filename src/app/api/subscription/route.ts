
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select(
        "plan, status, customer_id, next_billing, billing_interval, subscription_id",
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching subscription:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data) {
      return NextResponse.json(data, { status: 200 });
    }

    // If no subscription found, return a default "free" plan
    return NextResponse.json(
      {
        plan: "free",
        status: "active",
        next_billing: "",
        customer_id: "",
        billing_interval: "monthly",
        subscription_id: "",
      },
      { status: 200 },
    );
  } catch (e) {
    console.error("Unexpected error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
