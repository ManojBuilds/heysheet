"use client";

import React, { useState } from "react";
import { FormTheme, FormComponent } from "@/types/form-builder";
import { cn } from "@/lib/utils";
import { Upload, Trash } from "lucide-react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { useUppyUploader } from "@/hooks/useUppyUploader";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface FileUploadProps {
  theme: FormTheme;
  component: FormComponent;
  value: string[]; // Controlled
  onChange: (url: string[]) => void; // Controlled
  disabled?: boolean;
  formId: string;
}

const FileUpload = ({
  theme,
  component,
  value,
  onChange,
  disabled = false,
  formId,
}: FileUploadProps) => {
  const {
    allowedTypes = [],
    maxSize = 5,
    numberOfFiles = 1,
  } = component.properties;
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const { upload } = useUppyUploader({
    bucketName: "form-submissions",
    onProgress: (percent) => {
      setUploadProgress(percent);
    },
    onSuccess: (url, fileName) => {
      toast.success(`Uploaded: ${fileName}`);
      setUploadProgress(null);
      onChange([url]);
    },
    onError: (err) => {
      toast.error(`Upload error: ${err.message}`);
      setUploadProgress(null);
      onChange([]);
    },
  });

  const handleDrop = (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (acceptedFiles.length + selectedFiles.length > numberOfFiles) {
      toast.error(
        `You can upload up to ${numberOfFiles} file${numberOfFiles > 1 ? "s" : ""}.`,
      );
      return;
    }

    for (const file of acceptedFiles) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        toast.error(`${file.name} is too large. Max allowed is ${maxSize}MB.`);
        return;
      }

      if (
        allowedTypes.length &&
        !allowedTypes.some((allowedType: string) => {
          if (allowedType.endsWith("/*")) {
            // Allow wildcard match, e.g., image/* matches image/jpeg
            const [allowedMainType] = allowedType.split("/");
            const [fileMainType] = file.type.split("/");
            return allowedMainType === fileMainType;
          }
          return allowedType === file.type;
        })
      ) {
        console.log("allowdTypes", allowedTypes);
        console.log("file.type", file.type);
        toast.error(`${file.name} is not an allowed file type.`);
        return;
      }
    }

    // Upload first valid file (single file upload for now)
    const fileToUpload = acceptedFiles[0];
    const filePath = `form-submissions/${formId}/${component.name}-${fileToUpload.name}`;
    setSelectedFiles([...selectedFiles, fileToUpload]);
    upload(fileToUpload, filePath);
  };

  const removeFile = (indexToRemove: number) => {
    const updated = selectedFiles.filter((_, index) => index !== indexToRemove);
    // onChange(updated);
    setSelectedFiles(updated);
    toast.info("File removed");
  };

  const isImage = (file: File) => file.type.startsWith("image/");

  return (
    <Dropzone
      onDrop={handleDrop}
      accept={
        allowedTypes.length
          ? allowedTypes.reduce(
            (acc: any, type: any) => {
              acc[type] = [];
              return acc;
            },
            {} as Record<string, string[]>,
          )
          : undefined
      }
      maxSize={maxSize * 1024 * 1024}
      multiple={numberOfFiles > 1}
      disabled={disabled}
    >
      {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
        <section
          className="w-full font-normal"
          style={{ fontFamily: theme.font }}
        >
          <div
            {...getRootProps()}
            className={cn(
              "min-h-44 w-full border border-dashed flex flex-col items-center justify-center gap-3 transition-all cursor-pointer px-4 py-6 text-sm",
              "transform duration-300",
              isDragActive ? "scale-[1.02]" : "scale-100",
              disabled && "cursor-not-allowed opacity-50",
              `rounded-${theme.radius}`,
            )}
            style={{
              borderColor: isDragReject
                ? theme.error
                : isDragActive
                  ? theme.primary
                  : theme.border,
              background: isDragActive
                ? theme.muted
                : theme.backgroundSecondary,
              color: theme.textSecondary,
            }}
          >
            <input {...getInputProps()} disabled={disabled} />
            <Upload
              className="w-6 h-6"
              color={isDragReject ? theme.error : theme.textSecondary}
            />
            <p className="text-center">
              Click or drag & drop files here <br />
              <span style={{ fontSize: "0.85rem" }}>
                (Allowed: {allowedTypes.join(", ") || "any"}, Max {maxSize}
                MB, up to {numberOfFiles} file
                {numberOfFiles > 1 ? "s" : ""})
              </span>
            </p>

            {uploadProgress !== null && (
              <div className="w-full mt-2 max-w-sm mx-auto">
                <Progress
                  value={uploadProgress}
                  style={{
                    backgroundColor: theme.muted,
                  }}
                  className={`[&_[data-slot='progress-indicator']]:bg-[${theme.accent}]`}
                  indicatorStyles={{
                    backgroundColor: theme.primary,
                  }}
                />
                <p className="text-right text-xs text-muted-foreground mt-1">
                  {uploadProgress}%
                </p>
              </div>
            )}

            {selectedFiles.length > 0 && (
              <div className="w-full mt-4 text-sm">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className={cn(
                        "flex items-center justify-between gap-3 text-sm p-2",
                        `rounded-${theme.radius}`,
                      )}
                      style={{
                        color: theme.textSecondary,
                        background: theme.muted,
                      }}
                    >
                      <div className="flex items-center gap-2 truncate w-full">
                        {isImage(file) && (
                          <Image
                            width={40}
                            height={40}
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>
                      {!disabled && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                        >
                          <Trash className="w-4 h-4" color={theme.error} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default FileUpload;
