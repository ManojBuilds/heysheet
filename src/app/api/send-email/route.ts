import { EmailTemplate } from "@/components/email-template";
import { NextRequest } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { data: submittedData, toEmail } = await req.json();
    console.log(
      `Sending email to ${toEmail} with this data: ${JSON.stringify(submittedData)}`,
    );
    const emailTemplate = await EmailTemplate({ data: submittedData });
    const { data, error } = await resend.emails.send({
      from: "Heysheet <onboarding@resend.dev>",
      to: [toEmail],
      subject: "New Submission",
      react: emailTemplate,
    });

    if (error) {
      console.log("ERR", error);
      return Response.json({ error }, { status: 500 });
    }

    console.log("success", data);
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json({ error }, { status: 500 });
  }
}
