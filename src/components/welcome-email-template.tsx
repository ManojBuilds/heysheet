import {
  Body,
  Button,
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
} from "@react-email/components";

export interface WelcomeEmailProps {
  userName?: string;
}

export const HeySheetWelcomeEmail = ({
  userName = "there",
}: WelcomeEmailProps) => {
  const previewText = `Welcome to Heysheet! Get started with a 1-min demo.`;
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "";

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
                alt="Heysheet Logo"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Welcome to <strong>Heysheet</strong>
            </Heading>

            <Text className="text-[14px] leading-[24px] text-black">
              Hello {userName},
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              Thanks for joining Heysheet — the simplest way to connect forms
              with Google Sheets and Notion. Here's a quick 1-minute demo to
              help you get started:
            </Text>

            {/* Embedded video */}
            <Section className="mt-[22px] mb-[22px] text-center">
              <video
                width="100%"
                style={{ borderRadius: "8px" }}
                autoPlay
                controls
              >
                <source src={'https://ik.imagekit.io/q3ksr5fk3/demo.mp4'} type="video/mp4" />
                Your browser does not support the video tag. You can watch it{" "}
                <Link
                  href={'https://ik.imagekit.io/q3ksr5fk3/demo.mp4?updatedAt=1752807187723'}
                  className="text-yellow-600"
                >
                  here
                </Link>
                .
              </video>
            </Section>

            <Section className="mb-[32px] mt-[32px] text-center">
              <Button
                href="https://app.heysheet.in/dashboard"
                className="rounded bg-[#000000] px-5 py-3 text-center text-[12px] font-semibold text-white no-underline"
              >
                Go to your Dashboard
              </Button>
            </Section>

            <Text className="text-[14px] leading-[24px] text-black">
              or copy and paste this URL into your browser:{" "}
              <Link
                href="https://app.heysheet.in/dashboard"
                className="text-blue-600 no-underline"
              >
                https://app.heysheet.in/dashboard
              </Link>
            </Text>

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
              If you have any questions, just reply to this email. We're here to
              help!
              <br />
              <br />— Manoj Kumar, Creator of Heysheet
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default HeySheetWelcomeEmail;
