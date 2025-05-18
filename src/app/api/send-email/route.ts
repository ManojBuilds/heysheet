import { EmailTemplate } from "@/components/email-template";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { data: submittedData, toEmail } = await req.json();
    console.log(`Sending email to ${toEmail} with this data: ${submittedData}`);
    const emailTemplate = await EmailTemplate({ data: submittedData });
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [toEmail],
      subject: "New Submission",
      react: emailTemplate,
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
