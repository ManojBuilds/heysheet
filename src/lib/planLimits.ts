export const planLimits = {
  free: {
    maxForms: 1,
    maxSubmissions: 1,
    maxFileSizeMB: 0,
    features: {
      slackIntegration: false,
      emailAlerts: false,
      fileUploads: false,
      analytics: false,
    },
  },
  starter: {
    maxForms: Infinity,
    maxSubmissions: 3000,
    maxFileSizeMB: 10,
    features: {
      slackIntegration: true,
      emailAlerts: true,
      fileUploads: true,
      analytics: true,
    },
  },
  pro: {
    maxForms: Infinity,
    maxSubmissions: 100,
    maxFileSizeMB: 10,
    features: {
      slackIntegration: true,
      emailAlerts: true,
      fileUploads: true,
      analytics: true,
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
      "Basic Branding",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    price: {
      monthly: {
        price: 9,
        priceId: process.env.NEXT_PUBLIC_STARTER_MONTHLY_ID!,
      },
      annually: {
        price: 7,
        priceId: process.env.NEXT_PUBLIC_STARTER_ANNUAL_ID!,
      },
    },
    description: "Most popular for growing businesses",
    features: [
      "Unlimited Forms",
      "5,000 Submissions/mo",
      "Drag & Drop Builder",
      "Google Sheets Sync",
      "Custom Branding",
      "File Uploads up to (50MB) per file",
      "Slack & Email Alerts",
      "Basic Analytics",
      "Priority Support",
    ],
    cta: "Starter",
    popular: true,
  },
  {
    name: "Pro",
    price: {
      monthly: {
        price: 24,
        priceId: process.env.NEXT_PUBLIC_PRO_MONTHLY_ID!,
      },
      annually: {
        price: 19,
        priceId: process.env.NEXT_PUBLIC_PRO_ANNUAL_ID!,
      },
    },
    description: "For power users and teams",
    features: [
      "Unlimited Forms",
      "10,000 Submissions/mo",
      "Drag & Drop Builder",
      "Google Sheets Sync",
      "Custom Branding",
      "File Uploads up to (100MB) per file",
      "Slack & Email Alerts",
      "Advanced Analytics",
      "Priority Support",
      // "Advanced Logic & Workflows",
      // "Team Collaboration",
      // "Custom Domain",
      // "API Access",
    ],
    cta: "Pro",
    popular: false,
  },
];
