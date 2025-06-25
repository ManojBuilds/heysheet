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
