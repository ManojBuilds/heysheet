import { EmailTemplate, FormSubmissionData } from "@/components/email-template";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  dataToSend,
  toEmail,
}: {
  dataToSend: FormSubmissionData;
  toEmail: string;
}) {
  try {
    const emailTemplate = EmailTemplate({ data: dataToSend });
    const { data, error } = await resend.emails.send({
      from: "Heysheet <onboarding@resend.dev>",
      to: [toEmail],
      subject: `📥 New Submission on ${dataToSend.form.name}`,
      react: emailTemplate,
    });
    if (error) throw error;
    console.log("Email send success:", data, dataToSend);

    return { success: true, message: "Email has been sent successfully" };
  } catch (error: any) {
    console.log("Error while sending email", error);
    return { success: false, message: error.message };
  }
}
