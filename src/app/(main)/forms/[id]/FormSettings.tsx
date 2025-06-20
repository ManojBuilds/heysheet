"use client";

import { updateForm } from "@/actions";
import { CopyToClipboard } from "@/components/CopyToClipboard";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { copyToClipboard } from "@/lib/copy-to-clipboard";
import { useMutation } from "@tanstack/react-query";
import { Settings, SaveIcon, Loader2, Copy, Wrench, Globe } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export const FormSettings = ({
  endpointUrl,
  sharablePublicUrl,
  formBuilderUrl,
  redirectUrl,
  formId,
}: {
  endpointUrl: string;
  sharablePublicUrl: string;
  formBuilderUrl: string;
  redirectUrl: string;
  formId: string;
}) => {
  const [url, setUrl] = useState(redirectUrl);
  const updateFormMutation = useMutation({
    mutationFn: async ({ url }: { url: string }) =>
      updateForm({ redirect_url: url }, formId),
    onSuccess: () => {
      toast.success("Redirect URL updated successfully");
    },
    onError: (e) => {
      console.log(e);
      toast.error("Failed to update Redirect URL");
    },
  });
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 ">
          <Settings />
          Form Configuration
        </CardTitle>
        <CardDescription>
          Customize your form endpoints and sharing preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Submission Endpoint</Label>
          <p className="text-muted-foreground text-sm">
            Use this in your form’s action attribute to submit responses.
          </p>
          <div className="flex items-stretch gap-2">
            <Button
              variant={"outline"}
              onClick={() => copyToClipboard(endpointUrl)}
              className="font-mono"
            >
              {endpointUrl}
            </Button>
            <CopyToClipboard text={endpointUrl}/>
          </div>
        </div>
        <div className="space-y-2">
          <Label><Globe className="w-4 h-4"/>Public Form URL</Label>
          <p className="text-muted-foreground text-sm">
            Share this link to let users fill out your form.
          </p>
          <div className="flex items-stretch gap-2">
            <a
              href={sharablePublicUrl}
              className={buttonVariants({
                variant: "outline",
                className: "font-mono",
              })}
              target="_blank"
            >
              {sharablePublicUrl}
            </a>

            <CopyToClipboard text={sharablePublicUrl}/>
          </div>
        </div>

        <div className="space-y-2">
          <Label><Wrench className="w-4 h-4"/>Form Builder Editor</Label>
          <p className="text-muted-foreground text-sm">
            Edit this form visually using the drag-and-drop builder.
          </p>
          <div className="flex items-stretch gap-2">
            <Link
              href={formBuilderUrl}
              className={buttonVariants({
                variant: "outline",
                className: "font-mono",
              })}
              target="_blank"
            >
              {formBuilderUrl}
            </Link>
            
            <CopyToClipboard text={formBuilderUrl}/>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Redirect After Submit</Label>
          <p className="text-muted-foreground text-sm">
            Users will be redirected here after submitting the form.
          </p>
          <div className="flex items-center gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              placeholder="https://yourwebsite.com/onboarding"
              className="font-mono"
            />
            <Button
              onClick={() => updateFormMutation.mutate({ url })}
              disabled={url === "" || updateFormMutation.isPending}
            >
              {updateFormMutation.isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <SaveIcon className="w-4 h-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
