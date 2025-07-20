"use client";

import { Loader } from "lucide-react";
import { ConnectToSlackBtn } from "../connect-to-slack-button";
import { ConnectToNotionButton } from "../ConnectToNotionButton";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {  useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import { updateForm } from "@/actions";
import { useUpgradeModalStore } from "@/stores/upgradeModalStore";
import { BlurPaidFeatureCard } from "../BlurPaidFeatureCard";
import { SubscriptionData } from "@/types";

const ConfigureIntegration = ({ data, subscription }: { data: any, subscription?: SubscriptionData }) => {
  const queryClient = useQueryClient();
  const [isEmailAlertEnabled, setIsEmailAlertEnabled] = useState(
    data.email_enabled,
  );
  const [email, setEmail] = useState(data.notification_email || "");
  const openUpgradeModal = useUpgradeModalStore(
    (state) => state.openUpgradeModal,
  );

  const upsertEmailAlertMutation = useMutation({
    mutationFn: ({
      notification_email,
      email_enabled,
    }: {
      notification_email: string;
      email_enabled: boolean;
    }) => updateForm({ notification_email, email_enabled }, data.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-alert"] });
      toast.success("Alert settings updated");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const isFreePlan = !subscription || subscription.plan === "free";

  const handleUpgradeClick = () => {
    openUpgradeModal({
      heading: "Upgrade to Unlock Alerts",
      subHeading:
        "Slack & Email notifications are only available on Starter and Pro plans. Upgrade now to get real-time alerts.",
      cta: "Upgrade Now",
    });
  };

  return (
    <Card className="relative">
      <CardHeader className="border-b">
        <CardTitle>Alerts & Notifications</CardTitle>
        <CardDescription>
          Get notified via Slack or email whenever someone fills out your form.
        </CardDescription>
      </CardHeader>

      <CardContent
        className={`transition-all space-y-6 ${isFreePlan ? "opacity-50 pointer-events-none select-none" : ""
          }`}
      >
        <ConnectToSlackBtn form={data} />
        <ConnectToNotionButton form={data} />

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-12 h-12 bg-muted rounded grid place-items-center">
              <Image
                src="/gmail.svg"
                alt="Gmail"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <Label>Email Alerts</Label>
              <div className="text-sm text-muted-foreground">
                Get updates straight to your inbox
              </div>
            </div>
          </div>
          <Switch
            id="email-alerts"
            checked={isEmailAlertEnabled}
            onCheckedChange={(checked) => {
              setIsEmailAlertEnabled(checked);
              upsertEmailAlertMutation.mutate({
                email_enabled: checked,
                notification_email: email,
              });
            }}
            disabled={upsertEmailAlertMutation.isPending}
            aria-label="Toggle Email Alert"
          />
        </div>

        <form className="my-4 flex flex-col md:flex-row md:items-center gap-2">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mk@gmail.com"
            type="email"
            required
          />
          <Button
            onClick={(e) => {
              e.preventDefault();
              upsertEmailAlertMutation.mutate({
                email_enabled: isEmailAlertEnabled,
                notification_email: email,
              });
            }}
            type="submit"
            disabled={upsertEmailAlertMutation.isPending}
          >
            {upsertEmailAlertMutation.isPending && (
              <Loader size={16} className="animate-spin mr-2" />
            )}
            Save Changes
          </Button>
        </form>
      </CardContent>
        <BlurPaidFeatureCard
          title="Unlock Alerts & Notifications"
          description="Available only on Starter and Pro plans."
          features={[
            "Slack Alerts",
            "Email Notifications",
            "Real-time updates for form submissions",
          ]}
          subscription={subscription}
        />
    </Card>
  );
};

export default ConfigureIntegration;
