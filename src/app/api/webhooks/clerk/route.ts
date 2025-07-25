import HeySheetWelcomeEmail from "@/components/welcome-email-template";
import { createClient } from "@/lib/supabase/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { render } from "@react-email/components";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`,
    );
    const supabase = await createClient();
    switch (eventType) {
      case "user.created":
        const data = evt.data;
        const newUser = await supabase
          .from("users")
          .insert({
            clerk_user_id: data.id,
            email: data.email_addresses[0].email_address,
          });

        if (newUser.error) {
          console.log("Error creating user:", newUser.error);
          return new Response("Error creating user", { status: 400 });
        }

        const email = data.email_addresses?.[0].email_address;

        const emailTemplate = HeySheetWelcomeEmail({
          userName: data.first_name!,
        });
        const html = await render(emailTemplate)

        void supabase.functions.invoke('send-email', {
          body: {
            from: "Heysheet <welcome@mail.heysheet.in>",
            to: email,
            subject: `Welcome to HeySheet, ${data.first_name}!`,
            html,
          }
        })
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
