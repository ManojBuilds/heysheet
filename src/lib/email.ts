import {
  HeySheetSubmissionEmail,
  FormSubmissionData,
} from "@/components/email-template";
import { render } from "@react-email/components"
import { createClient } from "./supabase/server";

export async function sendEmail({
  dataToSend,
  toEmail,
  html
}: {
  dataToSend: FormSubmissionData;
  toEmail: string;
  html: string;
}) {
  try {

    const supabase = await createClient()
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: toEmail,
        subject: `New Submission on ${dataToSend.form.name}`,
        html
      }
    })
    if (error) throw error;
    console.log("Email send success:", data);

    return { success: true, message: "Email has been sent successfully" };
  } catch (error: any) {
    console.log("Error while sending email", error);
    return { success: false, message: error.message };
  }
}
