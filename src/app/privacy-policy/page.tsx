import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-gray-500">Last updated: June 17, 2025</p>

        <section className="mt-6 space-y-4">
          <p>
            HeySheet ("we", "our", or "us") respects your privacy and is
            committed to protecting your personal data. This Privacy Policy
            explains how we collect, use, and protect your information when you
            use our services through our website.
          </p>

          <h2 className="text-xl font-semibold mt-6">1. About HeySheet</h2>
          <p>
            HeySheet is a no-code form backend service that allows users to
            collect form submissions and integrate them with services like
            Google Sheets, Slack, and Email. It offers additional features such
            as analytics and is an alternative to SheetMonkey. Future
            integrations include Notion and Airtable.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            2. Information We Collect
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Account Information:</strong> We use Clerk for
              authentication, which may collect your email, IP address, and
              session metadata.
            </li>
            <li>
              <strong>Third-Party Authorization:</strong> We request permission
              to access your Google Drive for picking and creating spreadsheets.
            </li>
            <li>
              <strong>Form Submissions:</strong> We do not store submission data
              in our database. Files (if uploaded via form) are stored in
              Supabase Storage.
            </li>
            <li>
              <strong>Integrations:</strong> With your permission, we send
              notifications to selected Slack channels and emails on form
              submission.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">
            3. How We Use Your Data
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>To authenticate users via Clerk securely</li>
            <li>
              To perform actions on third-party services (e.g., send Slack
              messages, create spreadsheets)
            </li>
            <li>To store uploaded files in Supabase Storage</li>
            <li>To analyze usage and improve our platform</li>
            <li>To send alerts or communicate with users when necessary</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">
            4. Sharing and Disclosure
          </h2>
          <p>
            We do not sell or rent your personal data. We may share information
            with:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Services you explicitly authorize (e.g., Google Drive, Slack)
            </li>
            <li>Third-party providers like Clerk and Supabase</li>
            <li>Authorities if required to comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold mt-6">5. Data Security</h2>
          <p>
            Your data is transmitted over secure HTTPS. We use Clerk for
            authentication and store uploaded files securely in Supabase
            Storage. Access to your data is limited to the scope of permissions
            you grant.
          </p>

          <h2 className="text-xl font-semibold mt-6">6. Cookies</h2>
          <p>
            We may use cookies or similar technologies to keep you logged in and
            to analyze platform usage. You can control cookie behavior in your
            browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-6">7. Children’s Privacy</h2>
          <p>
            Our services are not directed to children under the age of 13. We do
            not knowingly collect personal data from children.
          </p>

          <h2 className="text-xl font-semibold mt-6">
            8. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy as our product evolves. We will
            notify users of any significant changes via email or in-app
            notification.
          </p>

          {/* <h2 className="text-xl font-semibold mt-6">9. Contact Us</h2> */}
          {/* <p> */}
          {/*   If you have any questions about this Privacy Policy, please contact us */}
          {/*   at: */}
          {/* </p> */}
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
