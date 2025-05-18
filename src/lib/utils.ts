import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const generatedApiKeys = new Set<string>();

export function generateApiKey() {
  // Example: sk- followed by 32 random alphanumeric characters
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key: string;
  do {
    key = "sk-";
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (generatedApiKeys.has(key));
  generatedApiKeys.add(key);
  console.log('apikey generated',key)
  return key;
}
