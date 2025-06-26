// src/lib/processFileUpload.ts
import { randomUUID } from "node:crypto";

export interface UploadConfig {
  enabled?: boolean;
  max_files?: number;
  allowed_file_types?: string[];
}

export interface PlanLimit {
  maxFileSizeMB: number;
}

export async function processFileUploads({
  entries,
  uploadConfig,
  planLimit,
  formId,
  supabase,
}: {
  entries: [string, FormDataEntryValue][];
  uploadConfig: UploadConfig;
  planLimit: PlanLimit;
  formId: string;
  supabase: any;
}): Promise<Record<string, any>> {
  const formDataObj: Record<string, any> = {};
  let fileCount = 0;

  await Promise.all(
    entries.map(async ([key, value]) => {
      if (value instanceof File) {
        if (!uploadConfig.enabled)
          throw new Error("File uploads are disabled for this form.");

        fileCount++;
        if (fileCount > (uploadConfig.max_files ?? Infinity)) {
          throw new Error(
            `You can only upload ${uploadConfig.max_files} file(s).`,
          );
        }

        if (
          uploadConfig.allowed_file_types?.length &&
          !uploadConfig.allowed_file_types.some((allowedType) => {
            if (allowedType.endsWith('/*')) {
              // Allow wildcard match, e.g., image/* matches image/jpeg
              const [allowedMainType] = allowedType.split('/');
              const [fileMainType] = value.type.split('/');
              return allowedMainType === fileMainType;
            }
            return allowedType === value.type;
          })
        ) {
          throw new Error(`File type ${value.type} not allowed.`);
        }

        const fileSizeMB = value.size / (1024 * 1024);
        if (fileSizeMB > planLimit.maxFileSizeMB) {
          throw new Error(
            `File too large. Max is ${planLimit.maxFileSizeMB}MB.`,
          );
        }

        const filePath = `form-submissions/${formId}/${key}-${value.name}-${randomUUID()}`;
        const formDataToUploadFile = new FormData();
        formDataToUploadFile.append(key, value);
        formDataToUploadFile.append("path", filePath);
        const { data } = await supabase.functions.invoke("upload-files", {
          body: formDataToUploadFile,
        });
        formDataObj[key] = data?.url;
      } else {
        formDataObj[key] = value;
      }
    })
  );
  return formDataObj;
}
