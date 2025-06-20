"use client";
import {
  handleAddNewGoogleAccount,
  handleRemoveGoogleAccount,
} from "@/actions";
import IntegrationCard from "@/components/integrations/Integration-card";
import { handleRemoveSlackAccount, handleSlackAuth } from "@/lib/slack/auth";
import { GoogleAccount, SlackAccount } from "@/types/form-details";
import { useMutation } from "@tanstack/react-query";

export const IntegrationsList = ({ slackAccount, googleAccount }: {googleAccount: GoogleAccount, slackAccount: SlackAccount}) => {
  const removeSlackAccountMutation = useMutation({
    mutationFn: () => handleRemoveSlackAccount(slackAccount.id),
  });
  const removeGoogleAccountMutation = useMutation({
    mutationFn: () => handleRemoveGoogleAccount(googleAccount.id),
  });

  return (
    <div className="space-y-4 mt-6">
      <IntegrationCard
        title="Slack"
        iconImgSrc="/slack.png"
        isConnected={!!slackAccount?.id}
        handleAction={
          slackAccount?.id ? removeSlackAccountMutation.mutate : handleSlackAuth
        }
        isLoading={removeSlackAccountMutation.isPending}
      />
      <IntegrationCard
        title="Google Sheets"
        iconImgSrc="/google-sheets.png"
        isConnected={!!googleAccount?.id}
        handleAction={
          googleAccount?.id
            ? removeGoogleAccountMutation.mutate
            : handleAddNewGoogleAccount
        }
        isLoading={removeGoogleAccountMutation.isPending}
      />
    </div>
  );
};
