import { updateWebhookSettings, updateForm } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { Loader2, SaveIcon, Webhook } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const WebhookSettings = ({
  formId,
  initialWebhookEnabled,
  initialWebhookUrl,
  initialWebhookSecret,
}: {
  formId: string;
  initialWebhookEnabled: boolean;
  initialWebhookUrl: string;
  initialWebhookSecret: string;
}) => {
  const [webhookEnabled, setWebhookEnabled] = useState(initialWebhookEnabled);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [webhookSecret, setWebhookSecret] = useState(initialWebhookSecret);

  const updateWebhookMutation = useMutation({
    mutationFn: async ({
      url,
      secret,
      enabled,
    }: {
      url: string;
      secret: string;
      enabled: boolean;
    }) => {
      updateWebhookSettings({ formId, url, secret, enabled });
      updateForm({ webhook_enabled: enabled }, formId);
    },
    onSuccess: () => {
      toast.success("Webhook settings updated successfully");
    },
    onError: (e) => {
      console.error(e);
      toast.error("Failed to update webhook settings");
    },
  });

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Webhook />
          Webhook Integration
        </CardTitle>
        <CardDescription>
          Configure a webhook to receive real-time form submissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="webhook-toggle">Enable Webhook</Label>
          <Switch
            id="webhook-toggle"
            checked={webhookEnabled}
            onCheckedChange={setWebhookEnabled}
          />
        </div>

        {webhookEnabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-webhook-endpoint.com/"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Webhook Secret (Optional)</Label>
              <Input
                id="webhook-secret"
                type="password"
                placeholder="Enter a secret for signature verification"
                value={webhookSecret}
                onChange={(e) => setWebhookSecret(e.target.value)}
              />
              <p className="text-muted-foreground text-sm">
                A secret is used to sign the webhook payload, allowing you to
                verify its authenticity.
              </p>
            </div>
            <Button
              onClick={() =>
                updateWebhookMutation.mutate({
                  url: webhookUrl,
                  secret: webhookSecret,
                  enabled: webhookEnabled,
                })
              }
              disabled={updateWebhookMutation.isPending}
            >
              {updateWebhookMutation.isPending ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <SaveIcon className="w-4 h-4" />
              )}
              Save Webhook Settings
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
