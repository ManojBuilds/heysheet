import tinycolor from "tinycolor2";

export function generateTheme(
  primary: string,
  font: string,
  radius: string,
  mode: "light" | "dark"
) {
  const base = tinycolor(primary);
  const isLight = mode === "light";
  
  // Normalize primary color with better saturation handling
  const normalizedPrimary = isLight 
    ? base.saturate(20).darken(5).toString() // More vibrant and slightly darker for light mode
    : base.saturate(10).toString();
  
  // Generate complementary and analogous colors for better harmony
  const complement = base.complement();
  const analogous = base.analogous();
  
  // Improved background generation - much darker for dark mode, lighter for light mode
  const background = isLight
    ? tinycolor({ h: base.toHsl().h, s: 99, l: 99 }).toString() // Very light for light mode
    : tinycolor({ h: base.toHsl().h, s: 15, l: 8 }).toString(); // Much darker with more saturation for dark mode
    
  const backgroundSecondary = isLight
    ? tinycolor({ h: base.toHsl().h, s: 8, l: 95 }).toString() // Slightly darker than background
    : tinycolor({ h: base.toHsl().h, s: 18, l: 12 }).toString(); // Lighter than main background for cards/sections
  
  // Enhanced text colors for better readability
  const text = isLight ? "#0a0a0a" : "#f5f5f5";
  const textSecondary = isLight ? "#404040" : "#a3a3a3"; // Better contrast in light mode
  
  // Improved primary hover with better visual feedback
  const primaryHover = isLight
    ? base.saturate(25).darken(12).toString() // More pronounced hover effect
    : base.lighten(8).saturate(5).toString();
  
  // Better accent color using analogous harmony
  const accent = isLight
    ? analogous[1].saturate(15).darken(10).toString() // Darker and more saturated for light mode
    : analogous[2].saturate(15).lighten(15).toString();
  
  // Improved muted colors with better contrast
  const muted = isLight
    ? tinycolor({ h: base.toHsl().h, s: 15, l: 94 }).toString() // Slightly more saturated
    : tinycolor({ h: base.toHsl().h, s: 15, l: 18 }).toString();
  
  // Better border contrast
  const border = isLight
    ? tinycolor({ h: base.toHsl().h, s: 20, l: 85 }).toString() // More visible border
    : tinycolor({ h: base.toHsl().h, s: 25, l: 25 }).toString();
  
  // Improved error color with better contrast in light mode
  const errorHue = (base.toHsl().h + 30) % 360; // Adjusted angle for better harmony
  const error = isLight
    ? tinycolor({ h: 0, s: 80, l: 45 }).toString() // Classic red for light mode
    : tinycolor({ h: errorHue, s: 70, l: 65 }).toString();
  
  // Enhanced foreground colors with better contrast checking
  const primaryForeground = tinycolor.mostReadable(
    normalizedPrimary, 
    ["#000000", "#ffffff", "#f8f9fa"], 
    { includeFallbackColors: true }
  ).toString();
  
  const accentForeground = tinycolor.mostReadable(
    accent, 
    ["#000000", "#ffffff", "#f8f9fa"], 
    { includeFallbackColors: true }
  ).toString();
  
  const mutedForeground = isLight ? "#525252" : "#9ca3af"; // Better contrast for light mode
  
  return {
    primary: normalizedPrimary,
    primaryForeground,
    primaryHover,
    accent,
    accentForeground,
    muted,
    mutedForeground,
    border,
    background,
    backgroundSecondary,
    text,
    textSecondary,
    error,
    font,
    radius,
    mode,
  };
}
