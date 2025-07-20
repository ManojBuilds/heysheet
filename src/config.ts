export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  landingPageUrl:
    process.env.NEXT_PUBLIC_LANDING_PAGE_URL || "https://heysheet.in",
  documentationUrl:
    process.env.NEXT_PUBLIC_DOCUMENTATION_URL || "https://docs.heysheet.in",
  afterSignOutUrl: process.env.NEXT_PUBLIC_AFTER_SIGN_OUT_URL || "/",
};
