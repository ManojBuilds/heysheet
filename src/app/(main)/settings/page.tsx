"use client";
import React, { useEffect, useState } from "react";
import { Copy, Trash2, Check, X, Loader } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import ApiKeyCreationModal from "@/components/ApiKeyCreationModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import {
  deleteApiKey,
  getApiKeys,
  getEmailAlert,
  updateApiKey,
  updateEmailAlert,
  upsertEmailAlert,
} from "@/lib/settings";
import { toast } from "sonner";
import { ConnectToSlackBtn } from "@/components/connect-to-slack-button";


export default function SettingsPage() {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { data, isLoading, error } = useQuery({
    queryKey: ["api-keys", user?.id],
    queryFn: () => getApiKeys(user?.id || ""),
    enabled: !!user?.id,
  });
  console.log(data, isLoading, error);
  const { data: emailAlertData } = useQuery({
    queryKey: ["email-alert"],
    queryFn: () => getEmailAlert(user?.id || ""),
    enabled: !!user?.id,
  });
  const deleteApiKeyMutation = useMutation({
    mutationFn: (id: string) => deleteApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: () => {
      toast.error("Failed to delete api key");
    },
  });
  const updateApiKeyMutation = useMutation({
    mutationFn: ({
      id,
      name,
      key,
      active,
    }: {
      id: string;
      name: string;
      key: string;
      active: boolean;
    }) => updateApiKey(id, name, key, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api-keys"] });
    },
    onError: () => {
      toast.error("Failed to updated api key");
    },
  });

  const upsertEmailAlertMutation = useMutation({
    mutationFn: ({
      userId,
      email,
      enabled,
    }: {
      userId: string;
      email: string;
      enabled: boolean;
    }) => upsertEmailAlert({ userId, email, enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["email-alert"] });
      toast.success("Alert setting successfully");
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const [slackConnected, setSlackConnected] = useState(false);
  const [isEmailAlertEnabled, setIsEmailAlertEnabled] = useState(false);
  const [email, setEmail] = useState("");

  console.log({ emailAlertData });
  useEffect(() => {
    if (emailAlertData) {
      setEmail(emailAlertData.email);
      setIsEmailAlertEnabled(emailAlertData.enabled);
    }
  }, [emailAlertData]);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1 p-8 container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="max-w-2xl space-y-8">
          {/* API Keys Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">API Keys</h2>
              <ApiKeyCreationModal />
            </div>

            {/* Table of API keys */}
            <Table className="mt-6">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell>{key.name}</TableCell>
                    <TableCell>
                      <span className="font-mono">{key.key}</span>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={key.active}
                        disabled={updateApiKeyMutation.isPending}
                        onCheckedChange={() =>
                          updateApiKeyMutation.mutate({
                            id: key.id,
                            name: key.name,
                            key: key.key,
                            active: !key.active,
                          })
                        }
                      />
                      <span className="ml-2">
                        {key.active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell>{key.created_at.split("T")[0]}</TableCell>
                    <TableCell>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteApiKeyMutation.mutate(key.id)}
                        disabled={deleteApiKeyMutation.isPending}
                      >
                        {deleteApiKeyMutation.isPending ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
          <Separator />
          {/* Alert Notification Settings */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Alert Notifications</h2>
            <ConnectToSlackBtn />
            <div className="flex items-center justify-between mt-4">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <div className="text-sm text-muted-foreground">
                  Receive alerts in directly to your email
                </div>
              </div>

              <Switch
                id="email-alerts"
                checked={isEmailAlertEnabled}
                onCheckedChange={(checked) => {
                  setIsEmailAlertEnabled(checked);
                  upsertEmailAlertMutation.mutate({
                    userId: user?.id || "",
                    email,
                    enabled: checked,
                  });
                }}
                disabled={upsertEmailAlertMutation.isPending}
                aria-label="Toggle Email Alert"
              />
            </div>

            <form className="my-4 flex items-center gap-2">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mk@gmail.com"
                type="email"
                required
                className="max-w-sm"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  upsertEmailAlertMutation.mutate({
                    userId: user?.id || "",
                    email,
                    enabled: isEmailAlertEnabled,
                  });
                }}
                type="submit"
                disabled={upsertEmailAlertMutation.isPending}
              >
                {upsertEmailAlertMutation.isPending && (
                  <Loader size={16} className="animate-spin mr-2" />
                )}
                Save
              </Button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}
