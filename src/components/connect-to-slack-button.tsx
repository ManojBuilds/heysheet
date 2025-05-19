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
  getSlackAccountAndNotificationAndToken,
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

export function ConnectToSlackBtn() {
  const { user } = useUser();
  const supabase = createClient();
  const {} = useMutation({
    mutationFn: async () => {
      await fetch("/api/slack/send-message");
    },
    onError: (e) => toast.error(e.message),
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["slack-account", user?.id],
    queryFn: getSlackAccountAndNotificationAndToken,
    enabled: !!user?.id,
  });
  const { data: channels } = useQuery({
    queryKey: ["slack-channels"],
    queryFn: listAllSlackChannel,
    enabled: !!user?.id,
  });
  const isSlackAccountConnected = data?.slack_accounts?.id;

  // Search state
  const [search, setSearch] = useState("");

  const activeChannelId = useMemo(() => {
    if (!channels || !data?.slack_channel) return "";
    const activeChannel = channels.find(
      (channel: any) => channel.name === data.slack_channel
    );
    return activeChannel?.id || "";
  }, [channels, data?.slack_channel]);

  const [selectedChannel, setSelectedChannel] = useState(activeChannelId);

  const [isEnabled, setIsEnabled] = useState(data?.enabled || false);

  useEffect(() => {
    if (activeChannelId) {
      setSelectedChannel(activeChannelId);
    }
  }, [activeChannelId]);

  useEffect(() => {
    if (data?.enabled) {
      setIsEnabled(data.enabled);
    }
  }, [data?.enabled]);

  // Filtered channels
  const filteredChannels = useMemo(() => {
    if (!channels) return [];
    return channels.filter((channel: any) =>
      channel.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [channels, search]);
  console.log(data);

  const toggleSlackAlert = async (enabled: boolean) => {
    setIsEnabled(enabled);
    const { error } = await supabase
      .from("slack_notifications")
      .update({ enabled })
      .eq("id", data?.id)
      .eq("user_id", user?.id);

    if (error) {
      toast.error("Failed to update notification settings");
      setIsEnabled(!enabled); // revert on error
      return;
    }

    toast.success(enabled ? "Slack alerts enabled" : "Slack alerts disabled");
  };

  const updateSlackNotification = async (
    channel_name: string,
    channel_id: string
  ) => {
    const { data: updatedData, error } = await supabase
      .from("slack_notifications")
      .update({ slack_channel: channel_name, enabled: true })
      .eq("id", data?.id)
      .eq("user_id", user?.id)
      .select("*")
      .single();
    if (error) {
      console.log(error);
      toast.error(error.message);
      return;
    }

    toast.success("Slack alert setting updated!");
    await addAppToASlackChannel(channel_id);
    sendMessage(channel_id, "Hey I'm heysheet bot!");
  };

  return (
    <>
      {isSlackAccountConnected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Slack Notifications</Label>
              <div className="text-sm text-muted-foreground">
                Receive alerts in your Slack channel
              </div>
            </div>
            <Switch
              checked={isEnabled}
              onCheckedChange={toggleSlackAlert}
              aria-label="Toggle Slack alerts"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedChannel}
              onValueChange={(value) => {
                const channel = filteredChannels.find(
                  (c: any) => c.id === value
                );
                if (channel) {
                  updateSlackNotification(channel.name, channel.id);
                }
              }}
            >
              <SelectTrigger className="w-[240px]">
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

            <Badge>Connected</Badge>
          </div>
        </div>
      ) : (
        <Button onClick={handleSlackAuth}>Connect to slack</Button>
      )}
    </>
  );
}
