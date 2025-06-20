import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

// pages/terms.tsx
export default function TermsOfService() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
        <p className="text-gray-500">Effective Date: June 17, 2025</p>

        <section className="mt-6 space-y-4">
          <p>
            These Terms of Service ("Terms") govern your use of HeySheet ("we",
            "our", or "us"). By accessing or using our service, you agree to be
            bound by these Terms. If you do not agree, do not use HeySheet.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. Use of Service</h2>
          <p>
            HeySheet provides a backend for forms with features like analytics,
            file uploads, and third-party integrations. You may use the service
            only in compliance with these Terms and all applicable laws.
          </p>

          <h2 className="text-xl font-semibold mt-6">2. User Accounts</h2>
          <p>
            To access certain features, you must create an account using a
            supported authentication method (e.g., Google via Clerk). You are
            responsible for safeguarding your credentials and all activity under
            your account.
          </p>

          <h2 className="text-xl font-semibold mt-6">3. Submitted Data</h2>
          <p>
            We do not store form submission data in our database. File uploads
            (if used) are stored in Supabase Storage. You are solely responsible
            for the content submitted through your forms and must ensure you
            have permission to collect such data.
          </p>

          <h2 className="text-xl font-semibold mt-6">4. Integrations</h2>
          <p>
            HeySheet allows integration with services like Google Sheets, Slack,
            and Email. You must authorize these integrations and grant only the
            necessary permissions. We will never access or act on your behalf
            outside the scope of your authorization.
          </p>

          <h2 className="text-xl font-semibold mt-6">5. Acceptable Use</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>No illegal or abusive behavior</li>
            <li>No collection of sensitive personal data without consent</li>
            <li>No interference with service availability or performance</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">6. Termination</h2>
          <p>
            We may suspend or terminate your access to HeySheet at any time if
            you violate these Terms or for any reason at our discretion. You may
            stop using the service at any time.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Disclaimer</h2>
          <p>
            HeySheet is provided "as is" without warranties of any kind. We do
            not guarantee uninterrupted or error-free service.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            8. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, HeySheet shall not be liable
            for any indirect, incidental, or consequential damages resulting
            from your use of the service.
          </p>

          <h2 className="text-xl font-semibold mt-6">9. Changes to Terms</h2>
          <p>
            We reserve the right to update these Terms at any time. Continued
            use of HeySheet after changes means you accept the updated Terms.
          </p>

          {/* <h2 className="text-xl font-semibold mt-6">10. Contact Us</h2> */}
          {/* <p>For questions or concerns about these Terms, contact us at:</p> */}
          {/* <ul className="list-none mt-2 space-y-1"> */}
          {/*   <li>Email: your@email.com</li> */}
          {/*   <li>Website: https://heysheet.com</li> */}
          {/* </ul> */}
        </section>
      </div>
      <Footer />
    </>
  );
}
