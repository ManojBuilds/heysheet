import { NextResponse } from "next/server";
import { Paddle } from "@paddle/paddle-node-sdk";
import { createClient } from "@/lib/supabase/server"; // or however you get user info
import { auth } from "@clerk/nextjs/server";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export const GET = async (req: Request) => {
    try {
        await auth.protect()
        const { userId } = await auth()
        const supabase = await createClient();
        const { data: user, error } = await supabase
            .from("users")
            .select("paddle_customer_id")
            .eq("clerk_user_id", userId)
            .single();
        console.log('error', error)
        if (!user?.paddle_customer_id) {
            return NextResponse.json({ error: "Paddle customer ID not found" }, { status: 404 });
        }
        const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("paddle_id")
            .eq("clerk_user_id", userId)
            .single();
        console.log('subError', subError)

        console.log(user, subscription)

        const session = await paddle.customerPortalSessions.create(user.paddle_customer_id, subscription?.paddle_id )
        console.log('session',session)
        return NextResponse.json({ url: session.urls.general.overview }, {status: 200});
    } catch (error: any) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

};
