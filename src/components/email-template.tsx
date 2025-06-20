import * as React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
  Font,
} from "@react-email/components";

export interface FormSubmissionData {
  form: {
    name: string;
    spreadsheet_id: string;
  };
  submission: {
    data: Record<string, any>;
    created_at: string;
    id: string;
  };
  analytics?: {
    referrer?: string;
    country?: string;
    city?: string;
    timezone?: string;
    deviceType?: string;
    browser?: string;
    language?: string;
    processed_at?: string;
    created_at?: string;
  };
}

export const EmailTemplate = ({ data }: { data: FormSubmissionData }) => {
  const { form, submission, analytics } = data;

  const infoRow = (label: string, value?: string | number) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "start",
        borderBottom: "1px solid #e5e7eb",
        padding: "6px 0",
        fontSize: "14px",
        gap: "24px", // <- key spacing
      }}
    >
      <span style={{ color: "#6b7280", minWidth: "120px", flexShrink: 0 }}>
        {label}
      </span>
      <span style={{ color: "#111827", textAlign: "right", flex: 1 }}>
        {value || "—"}
      </span>
    </div>
  );

  return (
    <Html>
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>New submission received on {form.name}</Preview>
      <Body
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Container
          style={{ maxWidth: "600px", margin: "0 auto", padding: "24px" }}
        >
          <Text
            style={{ fontSize: "20px", fontWeight: "bold", color: "#22c55e" }}
          >
            📥 New Form Submission
          </Text>
          <Text style={{ fontSize: "14px", color: "#444" }}>
            You’ve received a new submission on <strong>{form.name}</strong>.
          </Text>

          <Hr />

          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
              📝 Submission Details
            </Text>
            <div style={{ marginTop: "8px" }}>
              {Object.entries(submission.data).map(([key, value]) =>
                infoRow(key, String(value)),
              )}
            </div>
          </Section>

          <Section style={{ marginTop: "24px" }}>
            <Text style={{ fontSize: "16px", fontWeight: "bold" }}>
              📊 Analytics
            </Text>
            <div style={{ marginTop: "8px" }}>
              {infoRow("Source", analytics?.referrer || "Direct")}
              {infoRow("Country", analytics?.country)}
              {infoRow("City", analytics?.city)}
              {infoRow("Timezone", analytics?.timezone)}
              {infoRow("Device Type", analytics?.deviceType)}
              {infoRow("Browser", analytics?.browser)}
              {infoRow("Language", analytics?.language)}
              {infoRow(
                "Processed At",
                analytics?.processed_at || analytics?.created_at,
              )}
            </div>
          </Section>

          <Section
            style={{ marginTop: "24px", fontSize: "14px", color: "#444" }}
          >
            <Text>
              🆔 <strong>Submission ID:</strong> {submission.id}
            </Text>
            <Text>
              🔗{" "}
              <Link
                href={`https://docs.google.com/spreadsheets/d/${form.spreadsheet_id}`}
                style={{ color: "#3b82f6", textDecoration: "underline" }}
              >
                View in Google Sheets
              </Link>
            </Text>
            <Text>
              ⏰ <strong>Submitted At:</strong>{" "}
              {new Date(submission.created_at).toLocaleString()}
            </Text>
          </Section>

          <Hr />

          <Text
            style={{
              textAlign: "center",
              fontSize: "12px",
              color: "#888",
              marginTop: "32px",
            }}
          >
            Powered by{" "}
            <Link
              href={process.env.NEXT_PUBLIC_APP_URL || "https://heysheet.in"}
              style={{ color: "#3b82f6", fontWeight: "500" }}
            >
              HeySheet
            </Link>{" "}
            — Turn forms into powerful spreadsheets.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailTemplate;
