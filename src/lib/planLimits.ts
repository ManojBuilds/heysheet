export const planLimits = {
  free: {
    maxForms: 2,
    maxSubmissions: 200,
    maxFileSizeMB: 0,
    features: {
      slackIntegration: false,
      emailAlerts: true,
      fileUploads: false,
      analytics: true,
      notionIntegration: false,
    },
  },
  pro: {
    maxForms: Infinity,
    maxSubmissions: 5000,
    maxFileSizeMB: 50,
    features: {
      slackIntegration: true,
      emailAlerts: true,
      fileUploads: true,
      analytics: true,
      notionIntegration: true,
    },
  },
  business: {
    maxForms: Infinity,
    maxSubmissions: 50000,
    maxFileSizeMB: 100,
    features: {
      slackIntegration: true,
      emailAlerts: true,
      fileUploads: true,
      analytics: true,
      notionIntegration: true,
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
    features: [
      "200 submissions/month",
      "4x more than Formspree's free plan",
      "2 forms (2x vs SheetMonkey's 1 form limit)",
      "Google Sheets integration",
      "Basic email notifications",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
    originalPrice: null,
    badge: "Most Generous Free Plan",
  },
  {
    name: "Pro",
    price: {
      monthly: {
        price: 12,
        priceId: process.env.NEXT_PUBLIC_STARTER_MONTHLY_ID!,
      },
      annually: {
        price: 8,
        priceId: process.env.NEXT_PUBLIC_STARTER_ANNUAL_ID!,
      },
    },
    features: [
      "5,000 submissions/month",
      "Google Sheets + Notion integration",
      "File uploads",
      "Slack notifications + webhooks",
      "Priority email support",
      "Advanced spam protection",
      " Drag & drop form builder (coming soon)",
    ],
    cta: "Start Pro Trial",
    popular: true,
    originalPrice: {
      monthly: 12,
      annually: 144,
      annualSaving: 48,
    },
    badge: "Best Value",
  },
  {
    name: "Business",
    price: {
      monthly: { price: 29, priceId: process.env.NEXT_PUBLIC_PRO_MONTHLY_ID! },
      annually: { price: 20, priceId: process.env.NEXT_PUBLIC_PRO_ANNUAL_ID! },
    },
    features: [
      "50,000 submissions/month",
      "Everything in Pro",
      "Advanced analytics & insights",
      "Custom integrations via webhooks",
      "White-label form endpoints",
      "Priority phone support",
      "SLA uptime guarantee",
      "Custom domain support",
      " Advanced form builder with logic (coming soon)",
    ],
    cta: "Start Business Trial",
    popular: false,
    originalPrice: {
      monthly: 29,
      annually: 248,
      annualSaving: 108,
    },
    badge: "For High Volume",
  },
];
