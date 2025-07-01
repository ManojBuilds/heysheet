"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn, ALLOWED_FILE_TYPES } from "@/lib/utils";
import useSubscription from "@/hooks/useSubscription";
import { planLimits } from "@/lib/planLimits";
import { BlurPaidFeatureCard } from "./BlurPaidFeatureCard";

interface FileUploadSettingsProps {
  form: {
    id: string;
    file_upload_enabled?: boolean;
    file_upload_max_files?: number;
    file_upload_allowed_types?: string[];
  };
  onSave: (config: {
    file_upload_enabled: boolean;
    file_upload_max_size: number;
    file_upload_max_files: number;
    file_upload_allowed_types: string[];
  }) => Promise<void> | void;
}

const FileUploadSettings = ({ form, onSave }: FileUploadSettingsProps) => {
  const { data: subscription } = useSubscription();
  const router = useRouter();
  const isFreePlan = subscription?.plan === "free";

  const planMaxFileSize =
    planLimits[(subscription?.plan as keyof typeof planLimits) || "free"]
      .maxFileSizeMB;
  console.log("planMaxFileSize", planMaxFileSize);

  const [enabled, setEnabled] = useState(form.file_upload_enabled ?? false);
  const [maxFiles, setMaxFiles] = useState(form.file_upload_max_files ?? 1);
  const [allowedTypes, setAllowedTypes] = useState<string[]>(
    form.file_upload_allowed_types ?? [],
  );
  const [loading, setLoading] = useState(false);

  const toggleFileType = (type: string) => {
    setAllowedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave({
        file_upload_enabled: enabled,
        file_upload_max_size: planMaxFileSize,
        file_upload_max_files: maxFiles,
        file_upload_allowed_types: allowedTypes,
      });
      toast.success("File upload settings saved.");
    } catch (e) {
      toast.error("Failed to save file upload settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle>File Upload</CardTitle>
        <CardDescription>
          Let users upload files in their submissions. Available only in paid
          plans.
        </CardDescription>
      </CardHeader>

      <BlurPaidFeatureCard
        title="Unlock File Upload"
        description="This feature is only available on Starter and Pro plans."
        features={[
          "Allow up to 100MB file uploads",
          "Accept PDFs, Images, Docs",
          "Secure file handling",
        ]}
      />

      <CardContent
        className={cn("space-y-6 transition-all duration-300", {
          "pointer-events-none opacity-60": isFreePlan,
        })}
      >
        <div className="flex items-center justify-between">
          <Label>Enable file upload</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Allowed file types</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {ALLOWED_FILE_TYPES.map((file) => (
              <div key={file.value} className="flex items-center gap-2">
                <Checkbox
                  id={file.value}
                  checked={allowedTypes.includes(file.value)}
                  onCheckedChange={() => toggleFileType(file.value)}
                />
                <Label htmlFor={file.value}>{file.label}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="max-files">Max number of files</Label>
          <Input
            id="max-files"
            type="number"
            min={1}
            max={5}
            value={maxFiles}
            onChange={(e) => setMaxFiles(Number(e.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Max file size per file</Label>
          <Input disabled value={`${planMaxFileSize} MB`} readOnly />
        </div>

        <Button onClick={handleSave} disabled={loading}>
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FileUploadSettings;
