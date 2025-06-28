import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

import * as React from "react";

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

const baseUrl = "https://heysheet.vercel.app";

export const HeySheetSubmissionEmail = ({ data }: { data: FormSubmissionData }) => {
  const { form, submission, analytics } = data;
  const previewText = `New submission received on ${form.name}`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-[#f8fafc] px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-[40px] max-w-[540px] rounded border border-[#eaeaea] border-solid p-[24px] bg-white">
            <Section className="mt-[12px] mb-[24px] text-center">
              <Img
                src={`${baseUrl}/logo.png`}
                width="48"
                height="48"
                alt="HeySheet Logo"
                className="mx-auto my-0 rounded"
              />
            </Section>
            <Heading className="mx-0 my-[18px] p-0 text-center font-semibold text-[22px] text-black">
              New Form Submission
            </Heading>
            <Text className="text-[15px] text-black leading-[24px] text-center">
              You’ve received a new submission on <strong>{form.name}</strong>.
            </Text>
            <Section className="mt-[28px]">
              <Heading className="text-[17px] font-semibold text-left text-black mb-2">Submission Details</Heading>
              <Container className="bg-[#f9fafb] rounded p-4 border border-[#e5e7eb]">
                {Object.entries(submission.data).map(([key, value]) => (
                  <Row key={key} className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                    <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">{key}</Column>
                    <Column className="text-[#111827] text-right">{String(value) || "—"}</Column>
                  </Row>
                ))}
              </Container>
            </Section>
            <Section className="mt-[28px]">
              <Heading className="text-[17px] font-semibold text-left text-black mb-2">Analytics</Heading>
              <Container className="bg-[#f3f4f6] rounded p-4 border border-[#e5e7eb]">
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Source</Column>
                  <Column className="text-[#111827] text-right">{analytics?.referrer || "Direct"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Country</Column>
                  <Column className="text-[#111827] text-right">{analytics?.country || "—"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">City</Column>
                  <Column className="text-[#111827] text-right">{analytics?.city || "—"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Timezone</Column>
                  <Column className="text-[#111827] text-right">{analytics?.timezone || "—"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Device Type</Column>
                  <Column className="text-[#111827] text-right">{analytics?.deviceType || "—"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Browser</Column>
                  <Column className="text-[#111827] text-right">{analytics?.browser || "—"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Language</Column>
                  <Column className="text-[#111827] text-right">{analytics?.language || "—"}</Column>
                </Row>
                <Row className="py-1 text-[15px] border-b border-[#e5e7eb] last:border-0">
                  <Column className="text-[#6b7280] min-w-[120px] pr-2 font-medium">Processed At</Column>
                  <Column className="text-[#111827] text-right">{analytics?.processed_at || analytics?.created_at || "—"}</Column>
                </Row>
              </Container>
            </Section>
            <Section className="mt-[28px]">
              <Text className="text-[14px] text-black leading-[24px]">
                <strong>Submission ID:</strong> {submission.id}
              </Text>
              <Text className="text-[14px] text-black leading-[24px]">
                <Link
                  href={`https://docs.google.com/spreadsheets/d/${form.spreadsheet_id}`}
                  className="text-blue-600 no-underline"
                >
                  View in Google Sheets
                </Link>
              </Text>
              <Text className="text-[14px] text-black leading-[24px]">
                <strong>Submitted At:</strong> {new Date(submission.created_at).toLocaleString()}
              </Text>
            </Section>
            <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
            <Text className="text-[#888] text-[12px] leading-[24px] text-center">
              Powered by
              <Link
                href={baseUrl}
                className="text-blue-600 no-underline font-semibold ml-1"
              >
                HeySheet
              </Link>
              — Turn forms into powerful spreadsheets.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default HeySheetSubmissionEmail;
