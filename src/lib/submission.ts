export function collectAnalytics(clientInfo: any) {
  return {
    // Geographic Data
    country: clientInfo.location.country,
    city: clientInfo.location.city,
    timezone: clientInfo.location.timezone,
    
    // Traffic Source
    referrer: clientInfo.referer || 'direct',
    
    // Device & Browser
    device_type: detectDeviceType(clientInfo.user_agent),
    browser: detectBrowser(clientInfo.user_agent),
    
    // User Context
    language: clientInfo.language?.split(',')[0] || 'unknown',
    
    // Time
    submitted_at: new Date().toISOString(),
  };
}

export function detectDeviceType(userAgent: string): 'mobile' | 'desktop' | 'tablet' {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

// ...existing code...

export function detectBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('firefox/')) {
    return 'Firefox';
  }
  if (ua.includes('edg/')) {
    return 'Edge';
  }
  if (ua.includes('chrome/') && !ua.includes('chromium/')) {
    return 'Chrome';
  }
  if (ua.includes('safari/') && !ua.includes('chrome/') && !ua.includes('chromium/')) {
    return 'Safari';
  }
  if (ua.includes('opr/') || ua.includes('opera/')) {
    return 'Opera';
  }
  if (ua.includes('chromium/')) {
    return 'Chromium';
  }
  
  return 'Unknown';
}