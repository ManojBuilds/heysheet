import dodo from "@/lib/dodopayments";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { Webhook, WebhookUnbrandedRequiredHeaders } from "standardwebhooks";

const webhook = new Webhook(process.env.WEBHOOK_SIGNING_SECRET!);

export const POST = async (req: Request) => {
  const headersList = await headers();
  try {
    const rawBody = await req.text();
    const webhookHeaders: WebhookUnbrandedRequiredHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };
    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody);
    const { data, type } = payload;

    console.log("Webhook received:", type);
    console.log("data", data);

    const supabase = await createClient();

    switch (type) {
      case "subscription.active": {
        const {
          subscription_id,
          next_billing_date,
          customer,
          payment_frequency_interval,
          product_id,
        } = data;

        const { email, customer_id } = customer;
        const product = await dodo.products.retrieve(product_id);
        const plan = product.name?.toLowerCase();
        const billing_interval =
          payment_frequency_interval === "Month" ? "monthly" : "annually";

        let userRes = await supabase
          .from("users")
          .select("clerk_user_id, customer_id")
          .eq("customer_id", customer_id)
          .single();

        if (!userRes.data) {
          userRes = await supabase
            .from("users")
            .select("clerk_user_id, customer_id")
            .eq("email", email)
            .single();
        }

        const user = userRes.data;

        if (!user) {
          console.error(
            `User not found for customer_id: ${customer_id} or email: ${email}`,
          );
          break;
        }

        if (!user.customer_id) {
          await supabase
            .from("users")
            .update({ customer_id })
            .eq("clerk_user_id", user.clerk_user_id);
        }

        await supabase.from("subscriptions").upsert(
          {
            user_id: user.clerk_user_id,
            plan,
            status: "active",
            subscription_id,
            customer_id,
            billing_interval,
            next_billing: next_billing_date,
            email,
          },
          { onConflict: "user_id" },
        );

        break;
      }

      case "subscription.renewed": {
        const { subscription_id, next_billing_date } = data;

        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            next_billing: next_billing_date,
          })
          .eq("subscription_id", subscription_id);

        break;
      }
      case "payment.succeeded": {
        const { subscription_id } = data;
        if (subscription_id) {
          await supabase
            .from("subscriptions")
            .update({
              status: "active",
            })
            .eq("subscription_id", subscription_id);
        }
        break;
      }

      case "subscription.cancelled":
      case "subscription.expired": {
        const { subscription_id } = data;

        await supabase
          .from("subscriptions")
          .update({ status: "cancelled" })
          .eq("subscription_id", subscription_id);

        break;
      }

      case "subscription.plan_changed": {
        const { subscription_id, product_id, payment_frequency_interval } =
          data;

        const product = await dodo.products.retrieve(product_id);
        const plan = product.name?.toLowerCase();
        const billing_interval =
          payment_frequency_interval === "Month" ? "monthly" : "annually";

        await supabase
          .from("subscriptions")
          .update({
            plan,
            billing_interval,
          })
          .eq("subscription_id", subscription_id);

        break;
      }

      case "subscription.on_hold": {
        const { subscription_id } = data;
        await supabase
          .from("subscriptions")
          .update({ status: "on_hold" })
          .eq("subscription_id", subscription_id);
        break;
      }

      case "subscription.failed": {
        const { subscription_id } = data;
        await supabase
          .from("subscriptions")
          .update({ status: "failed" })
          .eq("subscription_id", subscription_id);
        break;
      }

      default:
        console.log("Unhandled event:", type);
        break;
    }

    return Response.json(
      { message: "Webhook received successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error processing webhook:", error);
    return Response.json(
      {
        message: "Failed to process webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 200 },
    );
  }
};
