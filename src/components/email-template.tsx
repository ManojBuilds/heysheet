import { config } from "@/config";
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
} from "@react-email/components";

export interface FormSubmissionData {
  form: {
    name: string;
    spreadsheet_id: string;
    id: string;
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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const HeySheetSubmissionEmail = ({
  data,
}: {
  data: FormSubmissionData;
}) => {
  const { form, submission, analytics } = data;
  const previewText = `New submission for ${form.name}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Container className="mx-auto my-[40px] max-w-[465px] rounded border border-solid border-[#eaeaea] p-[20px]">
            <Section className="mt-[22px] text-center">
              <Img
                src={'https://ik.imagekit.io/q3ksr5fk3/ChatGPT%20Image%20Jul%2022,%202025,%2008_07_21%20AM_11zon.png?updatedAt=1753151943258'}
                width="40"
                height="37"
                alt="HeySheet Logo"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              New Form Submission
            </Heading>

            <Text className="text-center text-[14px] leading-[24px] text-black">
              You received a new submission for <strong><Link href={`${config.appUrl}/forms/${form.id}`}></Link>{form.name}</strong>.
            </Text>

            <Section className="mt-[28px]">
              <Heading className="mb-2 text-left text-[17px] font-semibold text-black">
                Submission Details
              </Heading>
              <div className="rounded border border-solid border-[#eaeaea] bg-[#f9fafb] p-4">
                {Object.entries(submission.data).map(([key, value]) => (
                  <Row
                    key={key}
                    className="border-b border-[#e5e7eb] py-1 text-[15px] last:border-0"
                  >
                    <Column className="min-w-[120px] pr-2 font-medium text-[#6b7280]">
                      {key}
                    </Column>
                    <Column className="text-right text-[#111827]">
                      {String(value) || "—"}
                    </Column>
                  </Row>
                ))}
              </div>
            </Section>

            {analytics && (
              <Section className="mt-[28px]">
                <Heading className="mb-2 text-left text-[17px] font-semibold text-black">
                  Analytics
                </Heading>
                <div className="rounded border border-solid border-[#eaeaea] bg-[#f3f4f6] p-4">
                  {Object.entries(analytics).map(([key, value]) => (
                    <Row
                      key={key}
                      className="border-b border-[#e5e7eb] py-1 text-[15px] last:border-0"
                    >
                      <Column className="min-w-[120px] pr-2 font-medium text-[#6b7280]">
                        {key}
                      </Column>
                      <Column className="text-right text-[#111827]">
                        {String(value) || "—"}
                      </Column>
                    </Row>
                  ))}
                </div>
              </Section>
            )}

            <Section className="mt-[28px]">
              <Button
                href={`https://docs.google.com/spreadsheets/d/${form.spreadsheet_id}`}
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              >
                View in Google Sheets
              </Button>
            </Section>

            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Section className="text-center text-[12px] leading-[24px] text-[#666666]">
              <Link href="https://app.heysheet.in" className="text-blue-600">
                Dashboard
              </Link>
              <span className="text-[#666666]"> | </span>
              <Link href="https://docs.heysheet.in" className="text-blue-600">
                Docs
              </Link>
              <span className="text-[#666666]"> | </span>
              <Link
                href="https://twitter.com/ManojBuilds"
                className="text-blue-600"
              >
                @ManojBuilds
              </Link>
            </Section>

            <Text className="text-center text-[12px] leading-[24px] text-[#666666]">
              Powered by Heysheet
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default HeySheetSubmissionEmail;
