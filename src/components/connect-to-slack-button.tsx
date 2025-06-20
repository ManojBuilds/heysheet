"use client";

import { handleSlackAuth } from "@/lib/slack/auth";
import { Button } from "./ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@/lib/supabase/client";
import { sendMessage } from "@/lib/slack/sendMessage";
import { toast } from "sonner";
import {
  addAppToASlackChannel,
  getSlackAccountToken,
  listAllSlackChannel,
} from "@/lib/slack/client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import React, { useEffect, useMemo, useState } from "react";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import Image from "next/image";
import { SlackIcon } from "lucide-react";
import { updateForm } from "@/actions";

// TODO: ADD REMOVE SLACK ACCOUNT FEATURE

export function ConnectToSlackBtn({ form }: { form: any }) {
  const { user } = useUser();
  const supabase = createClient();
  const { data: slackAccount } = useQuery({
    queryKey: ["slack-account"],
    queryFn: getSlackAccountToken,
    enabled: !!user?.id,
  });

  const { data: channels } = useQuery({
    queryKey: ["slack-channels"],
    queryFn: () => listAllSlackChannel(slackAccount?.slack_token),
    enabled: !!user?.id || !!slackAccount?.slack_token,
  });
  const isSlackAccountConnected =
    !!form.slack_account || slackAccount?.slack_token;

  // Search state
  const [search, setSearch] = useState("");

  const activeChannelId = useMemo(() => {
    if (!channels || !form?.slack_channel) return "";
    const activeChannel = channels.find(
      (channel: any) => channel.name === form.slack_channel,
    );
    return activeChannel?.id || "";
  }, [channels, form?.slack_channel]);

  const [selectedChannel, setSelectedChannel] = useState(activeChannelId);

  const [isEnabled, setIsEnabled] = useState(form?.slack_enabled || false);

  useEffect(() => {
    if (activeChannelId) {
      setSelectedChannel(activeChannelId);
    }
  }, [activeChannelId]);

  // Filtered channels
  const filteredChannels = useMemo(() => {
    if (!channels) return [];
    return channels.filter((channel: any) =>
      channel.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [channels, search]);

  const toggleSlackAlert = async (enabled: boolean) => {
    try {
      setIsEnabled(enabled);
      await updateForm({ slack_enabled: enabled }, form.id);
      toast.success(enabled ? "Slack alerts enabled" : "Slack alerts disabled");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setIsEnabled(!enabled);
    }
  };

  const updateSlackNotification = async (
    channel_name: string,
    channel_id: string,
  ) => {
    try {
      await updateForm(
        { slack_channel: channel_name, slack_account_id: slackAccount?.id },
        form.id,
      );
      toast.success("Slack alert setting updated!");
      await addAppToASlackChannel(channel_id, slackAccount?.slack_token);
      sendMessage(channel_id, "Hey I'm heysheet bot!", slackAccount?.slack_token);
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-muted rounded grid place-items-center p-2">
              <Image
                src={"/slack-icon.svg"}
                alt="Slack"
                width={256}
                height={256}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <Label>Slack Alerts</Label>
              <div className="text-sm text-muted-foreground">Choose a channel to receive real-time alerts</div>
            </div>
          </div>
          <Switch
            checked={isEnabled}
            onCheckedChange={toggleSlackAlert}
            aria-label="Toggle Slack alerts"
            disabled={!isSlackAccountConnected}
          />
        </div>

        {isSlackAccountConnected ? (
          <div className="flex items-center gap-2">
            <Select
              value={selectedChannel}
              onValueChange={(value) => {
                setSelectedChannel(value);
                const channel = filteredChannels.find(
                  (c: any) => c.id === value,
                );
                if (channel) {
                  updateSlackNotification(channel.name, channel.id);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Slack channel" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1">
                  <Input
                    type="text"
                    placeholder="Search channels..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                {filteredChannels.length === 0 && (
                  <div className="px-2 py-1 text-sm text-muted-foreground">
                    No channels found
                  </div>
                )}
                {filteredChannels.map((channel: any) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    #{channel.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Badge className="rounded-full">Connected</Badge>
          </div>
        ) : (
          <Button onClick={handleSlackAuth}>
            <SlackIcon />
            Connect to slack
          </Button>
        )}
      </div>
    </div>
  );
}
