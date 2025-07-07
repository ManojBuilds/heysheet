"use client";
import {
  getGoogleConnectUrl,
  handleRemoveGoogleAccount,
  handleRemoveNotionAccount,
} from "@/actions";
import IntegrationCard from "@/components/integrations/Integration-card";
import { handleRemoveSlackAccount, handleSlackAuth } from "@/lib/slack/auth";
import {
  GoogleAccount,
  SlackAccount,
  NotionAccount,
} from "@/types/form-details";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { getNotionAuthUrl } from "@/lib/notion/utils";

export const IntegrationsListClient = ({
  slackAccount,
  googleAccount,
  notionAccount,
}: {
  googleAccount: GoogleAccount;
  slackAccount: SlackAccount;
  notionAccount: NotionAccount;
}) => {
  const { userId } = useAuth();
  const removeSlackAccountMutation = useMutation({
    mutationFn: () => handleRemoveSlackAccount(slackAccount.id),
  });
  const removeGoogleAccountMutation = useMutation({
    mutationFn: () => handleRemoveGoogleAccount(googleAccount.id),
  });

  const removeNotionAccountMutation = useMutation({
    mutationFn: () => handleRemoveNotionAccount(notionAccount.id),
  });

  const handleGoogleAction = async () => {
    const link = await getGoogleConnectUrl();
    if (link) {
      window.location.href = link;
    }
  };

  const handleSlackAction = async () => {
    const link = await handleSlackAuth();
    if (link) {
      window.location.href = link;
    }
  };

  const handleNotionAction = async () => {
    try {
      const redirectUrl = `/integrations`;
      const url = await getNotionAuthUrl(redirectUrl, userId as string);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <IntegrationCard
        title="Slack"
        iconImgSrc="/slack.png"
        isConnected={!!slackAccount?.id}
        handleAction={
          slackAccount?.id
            ? removeSlackAccountMutation.mutate
            : handleSlackAction
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
            : handleGoogleAction
        }
        isLoading={removeGoogleAccountMutation.isPending}
      />
      <IntegrationCard
        title="Notion"
        iconImgSrc="/notion.svg"
        isConnected={!!notionAccount?.id}
        handleAction={
          notionAccount?.id
            ? removeNotionAccountMutation.mutate
            : handleNotionAction
        }
        isLoading={removeNotionAccountMutation.isPending}
      />
    </div>
  );
};