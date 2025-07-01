"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { updateForm } from "@/actions";
import { Switch } from "@/components/ui/switch";
import { getNotionAuthUrl } from "@/lib/notion/utils";
import {
  createNotionDatabase,
  listNotionDatabases,
  listNotionPages,
  createNotionPage,
} from "@/lib/notion/server";
import { NotionDatabaseDialog } from "@/components/integrations/NotionDatabaseDialog";
import { NotionPageDialog } from "@/components/integrations/NotionPageDialog";
import { NotionDatabaseSelector } from "@/components/integrations/NotionDatabaseSelector";
import { NOTION_DATABASE_TEMPLATES } from "@/lib/notion-database-templates";

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
  const [newDbTemplate, setNewDbTemplate] = useState("none");

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
        let templateConfig = {};
        if (newDbTemplate && newDbTemplate !== "none" && NOTION_DATABASE_TEMPLATES[newDbTemplate as keyof typeof NOTION_DATABASE_TEMPLATES]) {
          templateConfig = NOTION_DATABASE_TEMPLATES[newDbTemplate as keyof typeof NOTION_DATABASE_TEMPLATES].properties;
        }
        return createNotionDatabase(
          notionAccount.access_token,
          selectedPageId,
          newDbName,
          templateConfig,
        );
      },
      onSuccess: (newDb) => {
        toast.success(`Database created successfully!`);
        setSelectedDatabase(newDb.id);
        queryClient.invalidateQueries({
          queryKey: ["notion-databases", notionAccount?.access_token],
        });
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
          <NotionDatabaseSelector
            databases={databases || []}
            isLoadingDatabases={isLoadingDatabases}
            selectedDatabase={selectedDatabase}
            setSelectedDatabase={setSelectedDatabase}
            setOpenCreateDbDialog={setOpenCreateDbDialog}
            updateNotionIntegration={updateNotionIntegration}
            isEnabled={isEnabled}
          />
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
      <NotionDatabaseDialog
        open={openCreateDbDialog}
        onOpenChange={setOpenCreateDbDialog}
        isLoadingPages={isLoadingPages}
        pages={pages || []}
        selectedPageId={selectedPageId}
        setSelectedPageId={setSelectedPageId}
        newDbName={newDbName}
        setNewDbName={setNewDbName}
        isCreatingDatabase={isCreatingDatabase}
        createDatabase={createDatabase}
        setOpenCreatePageDialog={setOpenCreatePageDialog}
        newDbTemplate={newDbTemplate}
        setNewDbTemplate={setNewDbTemplate}
      />
      <NotionPageDialog
        open={openCreatePageDialog}
        onOpenChange={setOpenCreatePageDialog}
        newPageName={newPageName}
        setNewPageName={setNewPageName}
        isCreatingPage={isCreatingPage}
        createPage={createPage}
      />
    </div>
  );
}
