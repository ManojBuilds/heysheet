export const planLimits = {
  free: {
    maxForms: 1,
    maxSubmissions: 100,
    maxFileSizeMB: 0,
    features: {
      slackIntegration: false,
      emailAlerts: false,
      fileUploads: false,
      analytics: false,
      notionIntegration: true,
    },
  },
  starter: {
    maxForms: Infinity,
    maxSubmissions: 50000,
    maxFileSizeMB: 50,
    features: {
      slackIntegration: true,
      emailAlerts: true,
      fileUploads: true,
      analytics: true,
      notionIntegration: true,
    },
  },
  pro: {
    maxForms: Infinity,
    maxSubmissions: 50000,
    maxFileSizeMB: 10,
    features: {
      slackIntegration: true,
      emailAlerts: true,
      fileUploads: true,
      analytics: true,
      notionIntegration: true
    },
  },
} as const;

export const PLANS = [
  {
    name: "Free",
    price: {
      monthly: { price: 0, priceId: "" },
      annually: { price: 0, priceId: "" },
    },
    description: "Perfect for getting started",
    features: [
      "2 Forms",
      "50 Submissions/mo",
      "Drag & Drop Builder",
      "Google Sheets Sync",
      "Notion Integration",
      "Basic Branding",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    price: {
      monthly: {
        price: 8,
        priceId: process.env.NEXT_PUBLIC_STARTER_MONTHLY_ID!,
      },
      annually: {
        price: 6,
        priceId: process.env.NEXT_PUBLIC_STARTER_ANNUAL_ID!,
      },
    },
    description: "Most popular for growing businesses",
    features: [
      "Unlimited Forms",
      "25,000 Submissions/mo",
      "Drag & Drop Builder",
      "Google Sheets Sync",
      "Notion Integration",
      "Custom Branding",
      "File Uploads",
      "Slack & Email Alerts",
      "Basic Analytics",
      "Automatic Redirect",
      "Domain Whitelisting",
    ],
    cta: "Starter",
    popular: true,
  },
  {
    name: "Pro",
    price: {
      monthly: {
        price: 20,
        priceId: process.env.NEXT_PUBLIC_PRO_MONTHLY_ID!,
      },
      annually: {
        price: 18,
        priceId: process.env.NEXT_PUBLIC_PRO_ANNUAL_ID!,
      },
    },
    description: "For power users and teams",
    features: [
      "Unlimited Forms",
      "50,000 Submissions/mo",
      "Drag & Drop Builder",
      "Google Sheets Sync",
      "Notion Integration",
      "Custom Branding",
      "File Uploads",
      "Slack & Email Alerts",
      "Advanced Analytics",
    ],
    cta: "Pro",
    popular: false,
  },
];
