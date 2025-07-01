"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import { updateForm } from "@/actions";
import { Switch } from "@/components/ui/switch";
import { getNotionAuthUrl } from "@/lib/notion/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createNotionDatabase,
  listNotionDatabases,
  listNotionPages,
  createNotionPage,
} from "@/lib/notion/server";
import { ExternalLinkIcon } from "lucide-react";

export function ConnectToNotionButton({ form }: { form: any }) {
  const { user } = useUser();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const [notionAccount, setNotionAccount] = useState<any>(null);
  const [selectedDatabase, setSelectedDatabase] = useState(
    form?.notion_database_id || "",
  );
  const [isEnabled, setIsEnabled] = useState(form?.notion_enabled || false);
  const [openCreateDbDialog, setOpenCreateDbDialog] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [newDbName, setNewDbName] = useState("");
  const [openCreatePageDialog, setOpenCreatePageDialog] = useState(false);
  const [newPageName, setNewPageName] = useState("");

  const { data: notionAccounts, isLoading: isLoadingNotionAccounts } = useQuery(
    {
      queryKey: ["notion-accounts", user?.id],
      queryFn: async () => {
        if (!user?.id) return [];
        const { data, error } = await supabase
          .from("notion_accounts")
          .select("*")
          .eq("user_id", user.id);
        if (error) throw error;
        return data;
      },
      enabled: !!user?.id,
    },
  );

  useEffect(() => {
    if (notionAccounts && notionAccounts.length > 0) {
      setNotionAccount(notionAccounts[0]);
    }
  }, [notionAccounts]);

  const { data: databases, isLoading: isLoadingDatabases } = useQuery({
    queryKey: ["notion-databases", notionAccount?.access_token],
    queryFn: () => listNotionDatabases(notionAccount.access_token),
    enabled: !!notionAccount?.access_token,
  });

  const { data: pages, isLoading: isLoadingPages } = useQuery({
    queryKey: ["notion-pages", notionAccount?.access_token],
    queryFn: () => listNotionPages(notionAccount.access_token),
    enabled: !!notionAccount?.access_token && openCreateDbDialog,
  });

  const { mutate: createDatabase, isPending: isCreatingDatabase } = useMutation(
    {
      mutationFn: () => {
        if (!selectedPageId || !newDbName) {
          throw new Error("Page and database name are required.");
        }
        return createNotionDatabase(
          notionAccount.access_token,
          selectedPageId,
          newDbName,
          {},
        );
      },
      onSuccess: (newDb) => {
        toast.success(`Database created successfully!`);
        queryClient.invalidateQueries({
          queryKey: ["notion-databases", notionAccount?.access_token],
        });
        setSelectedDatabase(newDb.id);
        updateNotionIntegration(newDb.id, true);
        setIsEnabled(true);
        setOpenCreateDbDialog(false);
        setNewDbName("");
        setSelectedPageId(null);
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
    },
  );

  const { mutate: createPage, isPending: isCreatingPage } = useMutation({
    mutationFn: () => {
      if (!newPageName) {
        throw new Error("Page name is required.");
      }
      return createNotionPage(notionAccount.access_token, newPageName);
    },
    onSuccess: (newPage) => {
      toast.success(`Page created successfully!`);
      queryClient.invalidateQueries({
        queryKey: ["notion-pages", notionAccount?.access_token],
      });
      setSelectedPageId(newPage.id);
      setOpenCreatePageDialog(false);
      setNewPageName("");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const isNotionAccountConnected = !!notionAccount;

  const handleConnectToNotion = async () => {
    try {
      const redirectUrl = window.location.href;
      const url = await getNotionAuthUrl(redirectUrl, user?.id as string);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateNotionIntegration = async (
    databaseId: string,
    enabled: boolean,
  ) => {
    try {
      await updateForm(
        {
          notion_database_id: databaseId,
          notion_enabled: enabled,
          notion_account_id: notionAccount?.id,
        },
        form.id,
      );
      toast.success("Notion integration updated!");
    } catch (e: any) {
      toast.error(e.message);
      throw e;
    }
  };

  const toggleNotionAlert = async (checked: boolean) => {
    setIsEnabled(checked);
    await updateNotionIntegration(selectedDatabase, checked);
  };

  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 bg-muted rounded grid place-items-center p-2">
              <Image
                src={"/notion.svg"}
                alt="Notion"
                width={256}
                height={256}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-0.5">
              <Label>Notion Integration</Label>
              <div className="text-sm text-muted-foreground">
                Connect to Notion to send form submissions to a database
              </div>
            </div>
          </div>

          <Switch
            checked={isEnabled}
            onCheckedChange={toggleNotionAlert}
            aria-label="Toggle Notion integration"
            disabled={!isNotionAccountConnected || !selectedDatabase}
          />
        </div>
        {isNotionAccountConnected ? (
          <div className="flex items-center gap-2">
            <Select
              value={selectedDatabase}
              onValueChange={(value) => {
                if (value === "create-new") {
                  setOpenCreateDbDialog(true);
                } else {
                  setSelectedDatabase(value);
                  updateNotionIntegration(value, isEnabled);
                }
              }}
              disabled={isLoadingDatabases}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a Notion database" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {isLoadingDatabases ? (
                  <SelectItem value="loading" disabled>
                    Loading databases...
                  </SelectItem>
                ) : databases && databases.length > 0 ? (
                  databases.map((db: any) => (
                    <SelectItem key={db.id} value={db.id}>
                      {db.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-dbs" disabled>
                    No databases found.
                  </SelectItem>
                )}
                {!isLoadingDatabases && (
                  <SelectItem value="create-new">
                    + Create new database
                  </SelectItem>
                )}
                {isLoadingDatabases === false &&
                  databases &&
                  databases.length === 0 && (
                    <div className="text-xs text-muted-foreground p-2">
                      Make sure Notion integration has access to databases.
                    </div>
                  )}
              </SelectContent>
            </Select>
            {selectedDatabase && isEnabled && (
              <Button
                variant="secondary"
                leftIcon={<ExternalLinkIcon />}
                onClick={() =>
                  window.open(
                    `https://www.notion.so/${selectedDatabase.replace(/-/g, "")}`,
                    "_blank",
                  )
                }
              >
                Open Notion Database
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={handleConnectToNotion}>
            <Image
              src={"/notion.svg"}
              alt="Notion"
              width={20}
              height={20}
              className="mr-2"
            />
            Connect to Notion
          </Button>
        )}
      </div>
      <Dialog open={openCreateDbDialog} onOpenChange={setOpenCreateDbDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Notion Database</DialogTitle>
            <DialogDescription>
              This will create a new database in your Notion workspace. Select a
              parent page for the new database.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Parent Page</Label>
              {isLoadingPages ? (
                <p>Loading pages...</p>
              ) : pages && pages.length > 0 ? (
                <Select
                  onValueChange={setSelectedPageId}
                  value={selectedPageId || ""}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a page" />
                  </SelectTrigger>
                  <SelectContent>
                    {pages.map((page) => (
                      <SelectItem key={page.id} value={page.id}>
                        {page.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                  <p>No pages found.</p>
                  <p>
                    Please create a page in Notion first and ensure you've given
                    access to it.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setOpenCreatePageDialog(true)}
                  >
                    Or create a new page
                  </Button>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="db-name">Database Name</Label>
              <Input
                id="db-name"
                value={newDbName}
                onChange={(e) => setNewDbName(e.target.value)}
                placeholder="e.g. My New Form Submissions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCreateDbDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createDatabase()}
              disabled={!selectedPageId || !newDbName || isCreatingDatabase}
            >
              {isCreatingDatabase ? "Creating..." : "Create Database"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openCreatePageDialog}
        onOpenChange={setOpenCreatePageDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Notion Page</DialogTitle>
            <DialogDescription>
              This will create a new page in your Notion workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="page-name">Page Name</Label>
            <Input
              id="page-name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="e.g. My New Page"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCreatePageDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => createPage()}
              disabled={!newPageName || isCreatingPage}
            >
              {isCreatingPage ? "Creating..." : "Create Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
