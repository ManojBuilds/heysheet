export async function sendEmail({
  data,
  toEmail,
}: {
  data: Record<string, any>;
  toEmail: string;
}) {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_APP_URL + "/api/send-email",
      {
        method: "POST",
        body: JSON.stringify({ data, toEmail }),
      }
    );
    if (res.status === 500) {
      return {
        success: false,
        message: "Something went wrong while sending email",
      };
    }
    return { success: true, message: "Email has been sent successfully" };
  } catch (error: any) {
    console.log("Error while sending email", error);
    return { success: false, message: error.message };
  }
}
