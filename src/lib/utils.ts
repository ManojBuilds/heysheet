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
  return key;
}

export const ALLOWED_FILE_TYPES = [
  { label: "Images", value: "image/*" },
  { label: "PDF", value: "application/pdf" },
  { label: "Word Documents", value: "application/msword" },
  {
    label: "Word (Docx)",
    value:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  },
  { label: "Excel", value: "application/vnd.ms-excel" },
  {
    label: "Excel (XLSX)",
    value: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  },
  { label: "Text Files", value: "text/plain" },
  { label: "ZIP Archives", value: "application/zip" },
  { label: "RAR Archives", value: "application/x-rar-compressed" },
  { label: "Video", value: "video/*" },
  { label: "Audio", value: "audio/*" },
  { label: "All Files", value: "*" },
];
