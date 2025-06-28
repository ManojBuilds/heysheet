import HeySheetWelcomeEmail from "@/components/welcome-email-template";
import { createClient } from "@/lib/supabase/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    const supabase = await createClient();
    switch (eventType) {
      case "user.created":
        // create a new user
        const data = evt.data;
        const { data: createdUser, error } = await supabase
          .from("users")
          .insert({
            clerk_user_id: data.id,
            email: data.email_addresses[0].email_address,
          });

        if (error) {
          console.log("Error creating user:", error);
          return new Response("Error creating user", { status: 400 });
        }
        console.log("User created:", createdUser);
        const email = data.email_addresses?.[0].email_address;
        // const email = "ms8460149@gmail.com";
        const emailTemplate = HeySheetWelcomeEmail({
          userName: data.first_name!,
        });
        const { data: emailData, error: emailError } = await resend.emails.send(
          {
            from: "Heysheet <onboarding@resend.dev>",
            to: [email],
            subject: `Welcome to HeySheet, ${data.first_name}!`,
            react: emailTemplate,
          },
        );
        console.log({ emailData });
        console.log({ emailError });

        break;

      default:
        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
