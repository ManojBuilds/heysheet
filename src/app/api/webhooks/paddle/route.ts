import { EventName, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const paddle = new Paddle(process.env.PADDLE_API_KEY!);

export const POST = async (req: Request) => {
    const signature = req.headers.get("paddle-signature") || "";
    const rawRequestBody = await req.text();
    const secretKey = process.env.PADDLE_WEBHOOK_SECRET_KEY || "";

    const supabase = await createClient();

    try {
        if (!signature || !rawRequestBody) {
            console.log("Missing signature or body");
            return NextResponse.json({ status: "bad request" }, { status: 400 });
        }

        const eventData = await paddle.webhooks.unmarshal(
            rawRequestBody,
            secretKey,
            signature
        );



        switch (eventData.eventType) {
            case EventName.SubscriptionActivated: {
                console.log('SUBSCRIPTION ACTIVATED');
                const userId = (eventData.data.customData as { user_id?: string })?.user_id
                const { error: userUpdateError } = await supabase
                    .from("users")
                    .update({ paddle_customer_id: eventData.data.customerId })
                    .eq("clerk_user_id", userId);

                if (userUpdateError) {
                    console.error("Error updating user:", userUpdateError.message);
                }

                const { error: subUpsertError } = await supabase
                    .from("subscriptions")
                    .upsert(
                        {
                            clerk_user_id: userId,
                            plan: eventData.data.items?.[0]?.product?.name?.toLowerCase(),
                            status: eventData.data.status,
                            paddle_id: eventData.data.id,
                            current_period_end: eventData.data.nextBilledAt,
                            updated_at: new Date(),
                        },
                        { onConflict: "clerk_user_id" }
                    );

                if (subUpsertError) {
                    console.error("Error upserting subscription:", subUpsertError.message);
                }

                break;
            }

            case EventName.SubscriptionCanceled: {
                console.log('SUBSCRIPTION CANCELLED')

                const userId = (eventData.data.customData as { user_id?: string })?.user_id
                if (!userId) break;

                const { error } = await supabase
                    .from("subscriptions")
                    .update({
                        plan: "free",
                        status: "active",
                        paddle_id: null,
                        current_period_end: null,
                        updated_at: new Date(),
                    })
                    .eq("clerk_user_id", userId);

                if (error) console.error("Error cancelling subscription:", error.message);

                break;
            }

            case EventName.SubscriptionPaused: {
                console.log('SUBSCRIPTION PAUSED')

                const userId = (eventData.data.customData as { user_id?: string })?.user_id

                if (!userId) break;

                const { error } = await supabase
                    .from("subscriptions")
                    .update({
                        status: "paused",
                        updated_at: new Date(),
                    })
                    .eq("clerk_user_id", userId);

                if (error) console.error("Error pausing subscription:", error.message);

                break;
            }

            case EventName.SubscriptionResumed: {
                console.log('SUBSCRIPTION RESUMED')

                const userId = (eventData.data.customData as { user_id?: string })?.user_id

                if (!userId) break;

                const { error } = await supabase
                    .from("subscriptions")
                    .update({
                        status: "active",
                        updated_at: new Date(),
                    })
                    .eq("clerk_user_id", userId);

                if (error) console.error("Error resuming subscription:", error.message);

                break;
            }

            case EventName.SubscriptionUpdated: {
                console.log('SUBSCRIPTION UPDATED')
                const userId = (eventData.data.customData as { user_id?: string })?.user_id

                if (!userId) break;

                const { error } = await supabase
                    .from("subscriptions")
                    .update({
                        plan: eventData.data.items?.[0]?.product?.name?.toLowerCase(),
                        current_period_end: eventData.data.nextBilledAt,
                        updated_at: new Date(),
                    })
                    .eq("clerk_user_id", userId);

                if (error) console.error("Error updating subscription:", error.message);

                break;
            }

            case EventName.TransactionCompleted: {
                console.log(`Transaction completed`);
                break;
            }

            case EventName.TransactionPaymentFailed: {
                console.log(`Transaction failed`);
                break;
            }

            default:
                console.log(`Unhandled Paddle event: ${eventData.eventType}`);
        }
    } catch (e) {
        console.error("Webhook Error:", e);
        return NextResponse.json({ status: "error" }, { status: 500 });
    }

    return NextResponse.json({ status: "ok" });
};
