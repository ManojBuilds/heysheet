"use client";

import { useEffect, useRef, useState } from "react";
import Uppy, { Uppy as UppyInstance, UppyFile } from "@uppy/core";
import Tus from "@uppy/tus";
import { createClient } from "@/lib/supabase/client";

type UseUppyUploaderProps = {
  bucketName: string;
  onProgress: (percent: number) => void;
  onSuccess: (signedUrl: string, fileName: string) => void;
  onError?: (err: Error) => void;
};

export function useUppyUploader({
  bucketName,
  onProgress,
  onSuccess,
  onError,
}: UseUppyUploaderProps) {
  const supabase = createClient();
  const [uppy] = useState(() => new Uppy());
  const projectURL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  useEffect(() => {
    const init = async () => {
      console.log("[Uppy] Initializing uploader");
      uppy
        .use(Tus, {
          id: "file-uploader",
          endpoint: `${projectURL}/storage/v1/upload/resumable`,
          retryDelays: [0, 3000, 5000, 10000, 20000],
          headers: {
            authorization: `Bearer ${anonKey}`,
            "x-upsert": "true",
          },
          chunkSize: 6 * 1024 * 1024,
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          allowedMetaFields: [
            "bucketName",
            "objectName",
            "contentType",
            "cacheControl",
          ],
        })
        .on("file-added", (file) => {
          console.log("[Uppy] File added:", file.name);

          file.meta = {
            ...file.meta,
            bucketName,
            objectName: file.name,
            contentType: file.type,
          };
        })

        .on("upload-progress", (file, progress) => {
          const percent = Math.round(
            (progress.bytesUploaded / (progress.bytesTotal || 100)) * 100,
          );
          onProgress(percent);
        })
        .on("upload-success", async (file) => {
          const fileName = file?.meta.objectName as string;
          console.log("[Uppy] Upload succeeded for:", fileName);

          const { data, error } = await supabase.storage
            .from(bucketName)
            .createSignedUrl(fileName, 60 * 60 * 24 * 365); // 1 year

          if (error) {
            console.error("[Uppy] Failed to create signed URL:", error.message);
            onError?.(error as Error);
          } else if (data?.signedUrl) {
            console.log("[Uppy] Signed URL:", data.signedUrl);
            onSuccess(data.signedUrl, fileName);
          }
        })
        .on("upload-error", (file, error) => {
          console.error("[Uppy] Upload error for", file?.name, error);
          onError?.(error as Error);
        });
    };

    init();
    return () => {
      uppy.destroy();
    };
  }, [bucketName, uppy]);

  const upload = async (file: File, fileName: string) => {
    const { data } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60 * 24 * 365);
    if (data?.signedUrl) {
      onProgress(100);
      onSuccess(data?.signedUrl, fileName);
      return;
    }
    uppy.addFile({
      name: fileName || file.name,
      type: file.type,
      data: file,
      meta: {
        bucketName,
        objectName: fileName || file.name,
        contentType: file.type,
      },
    });

    uppy.upload().catch((err) => {
      console.error("[Uppy] Upload failed:", err);
      onError?.(err);
    });
  };

  return { upload };
}
