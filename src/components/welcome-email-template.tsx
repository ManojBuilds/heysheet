import { config } from '@/config';
import {
    Body,
    Button,
    CodeBlock,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Img,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
    Font,
    dracula,
} from '@react-email/components';
import * as React from "react";

const baseUrl = "https://heysheet.vercel.app";

export interface WelcomeEmailProps {
    userName?: string;
}

export const HeySheetWelcomeEmail = ({ userName }: WelcomeEmailProps) => {
    const previewText = `Welcome to HeySheet${userName ? ', ' + userName : ''}! Start building forms and connect to Google Sheets.`;

    return (
        <Html>
            <Head />
            <Font
                fallbackFontFamily="monospace"
                fontFamily="CommitMono"
                fontStyle="normal"
                fontWeight={400}
                webFont={{
                    url: 'https://react.email/fonts/commit-mono/commit-mono-regular.ttf',
                    format: 'truetype',
                }}
            />
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
                                className="mx-auto my-0 rounded scale-200"
                            />
                        </Section>
                        <Heading className="mx-0 my-[18px] p-0 text-center font-semibold text-[22px] text-black">
                            Welcome to HeySheet{userName ? `, ${userName}` : ''}!
                        </Heading>
                        <Text className="text-[15px] text-black leading-[24px] text-center mb-2">
                            Hi {userName || 'there'},<br />
                            I'm <strong>Manoj Kumar</strong>, the creator of HeySheet. I'm thrilled to have you join our community! My goal is to help you turn forms into powerful spreadsheets with as little friction as possible. Here’s a step-by-step guide to get you started:
                        </Text>
                        <Section className="mt-[18px]">
                            <Heading className="text-[16px] font-semibold text-left text-black mb-2">Step 1: Connect Your Google Account</Heading>
                            <Text className="text-[15px] text-black leading-[24px]">
                                After logging in, go to your{' '}
                                <Button
                                    href="https://heysheet.com/dashboard"
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-[14px] font-semibold no-underline ml-1"
                                >
                                    Dashboard
                                </Button>{' '}
                                and click <strong>"Connect Google Account"</strong>. Grant the requested permissions so HeySheet can securely interact with your Google Sheets on your behalf.
                            </Text>
                        </Section>
                        <Section className="mt-[18px]">
                            <Heading className="text-[16px] font-semibold text-left text-black mb-2">Step 2: Create Your First Form</Heading>
                            <Text className="text-[15px] text-black leading-[24px]">
                                In the dashboard, click <strong>"Create Form"</strong>. A modal will open where you can choose a template, select an existing Google Sheet, or let HeySheet create a new one for you. Click <strong>"Save"</strong> to finish.
                            </Text>
                        </Section>
                        <Section className="mt-[18px]">
                            <Heading className="text-[16px] font-semibold text-left text-black mb-2">Step 3: Get Your Form Action URL</Heading>
                            <Text className="text-[15px] text-black leading-[24px]">
                                After creation, you’ll be redirected to the form detail page. Here you’ll find your unique <strong>Form Action URL</strong> (API endpoint) to receive submissions. You can use this in your HTML forms or send POST requests directly.
                            </Text>
                            <Container className="bg-[#f9fafb] rounded py-4 px-1 border border-[#e5e7eb] mt-3">
                                <Text className="text-[14px] text-black font-semibold mb-1">HTML Example:</Text>
                                <CodeBlock
                                    code={`<form action="https://heysheet.com/api/s/YOUR_FORM_ID" method="POST">
  <input type="text" name="name" required />
  <input type="email" name="email" required />
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>`}
                                    language="html"
                                    fontFamily="'CommitMono', monospace"
                                    theme={dracula}
                                />
                                <Text className="text-[14px] text-black font-semibold mt-3 mb-1">cURL Example:</Text>
                                <CodeBlock
                                    code={`curl -X POST https://heysheet.com/api/s/YOUR_FORM_ID \
  -F "name=Manoj" \
  -F "email=stack@x.com" \
  -F "message=hi"`}
                                    language="bash"
                                    fontFamily="'CommitMono', monospace"
                                    theme={dracula}
                                />
                            </Container>
                        </Section>
                        <Section className="mt-[18px]">
                            <Heading className="text-[16px] font-semibold text-left text-black mb-2">Step 4: Use the Form Builder Editor</Heading>
                            <Text className="text-[15px] text-black leading-[24px]">
                                On the form detail page, click <strong>"Form Builder Editor"</strong> to open the drag-and-drop editor in a new tab. Build your form visually, hit <strong>"Save"</strong>, then click the share icon to get a public link. Anyone with the link can submit responses, which will be added as new rows in your Google Sheet.
                            </Text>
                        </Section>
                        <Section className="mt-[18px]">
                            <Heading className="text-[16px] font-semibold text-left text-black mb-2">Step 5: Upload Files (Coming Soon)</Heading>
                            <Text className="text-[15px] text-black leading-[24px]">
                                Soon, you’ll be able to add file upload fields to your forms and have uploaded files saved alongside responses. Stay tuned for updates!
                            </Text>
                        </Section>
                        <Section className="mt-[18px]">
                            <Text className="text-[15px] text-black leading-[24px]">
                                For more help, visit our{' '}
                                <Link href={config.documentationUrl} className="text-blue-600 no-underline font-semibold">documentation</Link>{' '}
                                or reply to this email. I’m here to help you succeed!
                            </Text>
                        </Section>
                        <Hr className="mx-0 my-[26px] w-full border border-[#eaeaea] border-solid" />
                        <Text className="text-[#888] text-[12px] leading-[24px] text-center">
                            Welcome again,<br />
                            <span className="font-semibold text-black">Manoj Kumar</span> — Creator of HeySheet<br />
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

export default HeySheetWelcomeEmail;
