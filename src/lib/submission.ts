export function collectAnalytics(clientInfo: any) {
  return {
    // Geographic Data
    country: clientInfo.location.country,
    city: clientInfo.location.city,
    timezone: clientInfo.location.timezone,

    // Traffic Source
    referrer: clientInfo.referrer || "direct",

    // Device & Browser
    device_type: detectDeviceType(clientInfo.user_agent),
    browser: detectBrowser(clientInfo.user_agent),
    os: detectOS(clientInfo.user_agent),

    // User Context
    language: clientInfo.language?.split(",")[0] || "unknown",

    // Time
    submitted_at: new Date().toISOString(),
  };
}

export function detectDeviceType(
  userAgent: string
): "mobile" | "desktop" | "tablet" {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

// ...existing code...

export function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("firefox/")) {
    return "Firefox";
  }
  if (ua.includes("edg/")) {
    return "Edge";
  }
  if (ua.includes("chrome/") && !ua.includes("chromium/")) {
    return "Chrome";
  }
  if (
    ua.includes("safari/") &&
    !ua.includes("chrome/") &&
    !ua.includes("chromium/")
  ) {
    return "Safari";
  }
  if (ua.includes("opr/") || ua.includes("opera/")) {
    return "Opera";
  }
  if (ua.includes("chromium/")) {
    return "Chromium";
  }

  return "Unknown";
}
export function detectOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();

  if (ua.includes("windows nt")) return "Windows";
  if (ua.includes("macintosh") || ua.includes("mac os x")) return "macOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod"))
    return "iOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("cros")) return "ChromeOS";

  return "Unknown";
}
