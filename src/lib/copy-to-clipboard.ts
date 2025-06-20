import { toast } from "sonner";

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
};