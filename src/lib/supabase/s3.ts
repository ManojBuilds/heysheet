import { createClient } from "./server";

export async function uploadFile(bucketName: string, filePath: string, file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const supabase = await createClient()

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, buffer, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error("Upload failed:", error.message);
    throw error;
  }

  console.log("File uploaded:", filePath);
}
