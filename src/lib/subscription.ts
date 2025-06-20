'use server'

import { createClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";

export const getUserSubscription = async () => {
    await auth.protect();
    const { userId } = await auth();
    const supabase = await createClient();

    const [userRes, subRes] = await Promise.all([
        supabase
            .from("users")
            .select("paddle_customer_id")
            .eq("clerk_user_id", userId)
            .single(),
        supabase
            .from("subscriptions")
            .select("plan, status, current_period_end, paddle_id")
            .eq("clerk_user_id", userId)
            .single(),
    ]);

    if (userRes.error || !userRes.data?.paddle_customer_id) {
        throw new Error("No Paddle customer ID found.");
    }

    if (subRes.error || !subRes.data) {
        throw new Error("No active subscription found.");
    }

    return {
        paddle_customer_id: userRes.data.paddle_customer_id,
        ...subRes.data,
    };
};
