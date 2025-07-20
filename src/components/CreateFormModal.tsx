"use client";

import { FormEvent, useState, useTransition } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, PlusIcon } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import SpreadsheetsPicker from "./SpreadsheetsPicker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { SPREADSHEET_TEMPLATES } from "@/lib/spreadsheet-templates";
import { createForm } from "@/actions";
import { useGoogleAccounts } from "@/hooks/useGoogleAccount";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import useSubscription from "@/hooks/useSubscription";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NotionDatabaseDialog } from "./integrations/NotionDatabaseDialog";
import { NotionPageDialog } from "./integrations/NotionPageDialog";
import {
  createNotionDatabase,
  listNotionDatabases,
  listNotionPages,
  createNotionPage,
} from "@/lib/notion/server";
import { NOTION_DATABASE_TEMPLATES } from "@/lib/notion-database-templates";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { useUpgradeModalStore } from "@/stores/upgradeModalStore";
import { planLimits } from "@/lib/planLimits";
import { NotionDatabaseSelector } from "./integrations/NotionDatabaseSelector";
import { getNotionAuthUrl } from "@/lib/notion/utils";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

const CreateFormModal = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const { user } = useUser();
  const { data: subscription } = useSubscription();
  const { openUpgradeModal } = useUpgradeModalStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedAccount } = useGoogleAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sheet, setSheet] = useState<{
    id: string;
    name: string;
    url: string;
  } | null>(null);
  const [tab, setTab] = useState("google");
  // Notion state
  const [notionAccount, setNotionAccount] = useState<any>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [openCreateDbDialog, setOpenCreateDbDialog] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [newDbName, setNewDbName] = useState("");
  const [openCreatePageDialog, setOpenCreatePageDialog] = useState(false);
  const [newPageName, setNewPageName] = useState("");
  const [newDbTemplate, setNewDbTemplate] = useState("none");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [sheetName, setSheetName] = useState("");

  const queryClient = useQueryClient();

  const { data: formCount } = useQuery({
    queryKey: ["forms"],
    queryFn: async () => {
      const { error, count, data } = await supabase
        .from("forms")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return data?.length;
    },
    enabled: !!userId,
  });

  // Notion account fetch
  const { data: notionAccounts } = useQuery({
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
  });
  useEffect(() => {
    if (notionAccounts && notionAccounts.length > 0) {
      setNotionAccount(notionAccounts[0]);
    }
  }, [notionAccounts]);

  const { data: databases, isLoading: isLoadingDatabases } = useQuery({
    queryKey: ["notion-databases", notionAccount?.access_token],
    queryFn: () => {
      console.log("fetching databases", notionAccount.access_token);
      return listNotionDatabases(notionAccount.access_token);
    },
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
        if (
          newDbTemplate &&
          newDbTemplate !== "none" &&
          NOTION_DATABASE_TEMPLATES[
          newDbTemplate as keyof typeof NOTION_DATABASE_TEMPLATES
          ]
        ) {
          templateConfig =
            NOTION_DATABASE_TEMPLATES[
              newDbTemplate as keyof typeof NOTION_DATABASE_TEMPLATES
            ].properties;
        } else {
          templateConfig = {
            name: { title: {} },
            email: { email: {} },
            message: { rich_text: {} },
          };
        }
        return createNotionDatabase(
          notionAccount.access_token,
          selectedPageId,
          newDbName,
          templateConfig,
        );
      },
      onSuccess: (newDb) => {
        console.log("newDatabase", newDb);
        toast.success(`Database created successfully!`);
        queryClient.setQueryData(
          ["notion-databases", notionAccount?.access_token],
          (old: any[] | undefined) => (old ? [...old, newDb] : [newDb]),
        );
        setSelectedDatabase(newDb.id);
        queryClient.invalidateQueries({
          queryKey: ["notion-databases", notionAccount?.access_token],
          refetchType: "none",
        });
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.info("Please enter a form title");
      return;
    }
    // Validation for tab
    if (tab === "google" && !selectedAccount) {
      toast.info("No Google account selected");
      return;
    }
    if (tab === "notion" && !notionAccount) {
      toast.info("No Notion account connected");
      return;
    }
    startTransition(async () => {
      try {
        const result = await createForm({
          title: title.trim(),
          sheetId: tab !== "notion" ? sheet?.id : undefined,
          template:
            (selectedTemplate as keyof typeof SPREADSHEET_TEMPLATES) ||
            undefined,
          googleAccountId: tab !== "notion" ? selectedAccount?.id : undefined,
          email: tab !== "notion" ? selectedAccount?.email : undefined,
          notionDatabaseId: tab !== "google" ? selectedDatabase : undefined,
          notionAccountId: tab !== "google" ? notionAccount?.id : undefined,
          sheetName,
        });
        if (result?.error) {
          toast.error(`Error creating form: ${result.error}`);
        } else {
          setIsOpen(false);
          setTitle("");
          setSheet(null);
          setSelectedDatabase("");
          router.push(`/forms/${result.data.id}`);
        }
      } catch (error) {
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleDialogOpen = (open: boolean) => {
    const maxForms =
      planLimits[subscription?.plan as keyof typeof planLimits]?.maxForms ?? 1;
    const isMaxFormsReached = formCount && (formCount >= maxForms);
    if (isMaxFormsReached) {
      openUpgradeModal({
        heading: "Upgrade to Add More Forms",
        subHeading:
          "You’ve created the max forms allowed on your plan. Upgrade to continue.",
      });
      return;
    }
    setIsOpen(open)
  };

  const handleConnectToNotion = async () => {
    try {
      const redirectUrl = window.location.href;
      const url = await getNotionAuthUrl(redirectUrl, user?.id as string);
      if (url) window.location.href = url;
    } catch { }
  };

  // Google connect
  const handleConnectToGoogle = async () => {
    const { getGoogleConnectUrl } = await import("@/actions");
    const link = await getGoogleConnectUrl();
    if (link) window.location.href = link;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          <span className="hidden sm:inline-flex">Create Form</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Form</DialogTitle>
            <DialogDescription>
              Create a new form to collect data from your users.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Mailing List"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <Label>Where do you want to store submissions?</Label>
            <Tabs value={tab} onValueChange={setTab} className="my-4">
              <TabsList className="flex items-center gap-2 justify-between w-full mb-4">
                <TabsTrigger value="notion" asChild>
                  <Button
                    leftIcon={
                      <Image
                        src="/notion.svg"
                        alt="Notion"
                        width={20}
                        height={20}
                      />
                    }
                    variant={"ghost"}
                  >
                    Notion
                  </Button>
                </TabsTrigger>
                <TabsTrigger value="google" asChild>
                  <Button
                    leftIcon={
                      <Image
                        src="/google_sheet.svg"
                        alt="Google Sheets"
                        width={14}
                        height={14}
                      />
                    }
                    variant={"ghost"}
                  >
                    Google Sheets
                  </Button>
                </TabsTrigger>
                <TabsTrigger value="both" asChild>
                  <Button variant={"ghost"}>
                    <div className="flex items-center gap-2">
                      <Image
                        src="/notion.svg"
                        alt="Notion"
                        width={20}
                        height={20}
                      />
                      <PlusIcon />
                      <Image
                        src="/google_sheet.svg"
                        alt="Google Sheets"
                        width={14}
                        height={14}
                      />
                    </div>
                    <span className="hidden lg:inline-flex">Both</span>
                  </Button>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notion">
                {!notionAccount ? (
                  <Button
                    onClick={handleConnectToNotion}
                    type="button"
                    className="w-full"
                    leftIcon={
                      <Image
                        src="/notion.svg"
                        alt="Notion"
                        width={20}
                        height={20}
                      />
                    }
                  >
                    Connect to Notion
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Label>Notion Database</Label>
                    <NotionDatabaseSelector
                      databases={databases || []}
                      isLoadingDatabases={isLoadingDatabases}
                      selectedDatabase={selectedDatabase}
                      setSelectedDatabase={setSelectedDatabase}
                      setOpenCreateDbDialog={setOpenCreateDbDialog}
                      updateNotionIntegration={() => { }}
                      isEnabled={true}
                    />
                  </div>
                )}
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
              </TabsContent>
              <TabsContent value="google">
                {!selectedAccount ? (
                  <Button
                    onClick={handleConnectToGoogle}
                    type="button"
                    className="w-full"
                    leftIcon={
                      <Image
                        src="/google_sheet.svg"
                        alt="Google Sheets"
                        width={14}
                        height={14}
                      />
                    }
                  >
                    Connect to Google Sheets
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Label>Choose one option</Label>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Template</Label>
                      <Select
                        value={selectedTemplate || "none"}
                        onValueChange={(val) => {
                          const newTemplate = val === "none" ? "" : val;
                          setSelectedTemplate(newTemplate);
                          if (newTemplate) {
                            setSheet(null);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a template (optional)" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="none">No template</SelectItem>
                          {Object.keys(SPREADSHEET_TEMPLATES).map((key) => (
                            <SelectItem key={key} value={key}>
                              {key}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">
                        Or select an existing spreadsheet
                      </Label>

                      <SpreadsheetsPicker
                        onPick={(spreadsheet: {
                          id: string;
                          name: string;
                          url: string;
                        }) => {
                          setSheet(spreadsheet);
                          setTitle(spreadsheet.name || title);
                          if (spreadsheet) {
                            setSelectedTemplate("");
                          }
                          setIsOpen(true); // Re-open the modal after picking a spreadsheet
                        }}
                        onSheetNamePick={(sheet) => {
                          setSheetName(sheet);
                        }}
                        disabled={!!selectedTemplate}
                        onOpenPicker={() => setIsOpen(false)}
                        selectedSheet={sheet}
                        onClearSelection={() => setSheet(null)}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="both">
                <div className="space-y-4">
                  {/* Notion */}
                  {!notionAccount ? (
                    <Button
                      onClick={handleConnectToNotion}
                      type="button"
                      className="w-full"
                      leftIcon={
                        <Image
                          src="/notion.svg"
                          alt="Notion"
                          width={20}
                          height={20}
                        />
                      }
                    >
                      Connect to Notion
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Label>Notion Database</Label>
                      <NotionDatabaseSelector
                        databases={databases || []}
                        isLoadingDatabases={isLoadingDatabases}
                        selectedDatabase={selectedDatabase}
                        setSelectedDatabase={setSelectedDatabase}
                        setOpenCreateDbDialog={setOpenCreateDbDialog}
                        updateNotionIntegration={() => { }}
                        isEnabled={true}
                      />
                    </div>
                  )}
                  {/* Google */}
                  {!selectedAccount ? (
                    <Button
                      onClick={handleConnectToGoogle}
                      type="button"
                      className="w-full"
                      leftIcon={
                        <Image
                          src="/google_sheet.svg"
                          alt="Google Sheets"
                          width={14}
                          height={14}
                        />
                      }
                    >
                      Connect to Google
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Label>Choose one option for Google Sheets</Label>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Template</Label>
                        <Select
                          value={selectedTemplate || "none"}
                          onValueChange={(val) => {
                            const newTemplate = val === "none" ? "" : val;
                            setSelectedTemplate(newTemplate);
                            // Clear existing sheet selection when template is selected
                            if (newTemplate) {
                              setSheet(null);
                            }
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a template (optional)" />
                          </SelectTrigger>
                          <SelectContent className="w-full">
                            <SelectItem value="none">No template</SelectItem>
                            {Object.keys(SPREADSHEET_TEMPLATES).map((key) => (
                              <SelectItem key={key} value={key}>
                                {key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Or select an existing spreadsheet
                        </Label>
                        <SpreadsheetsPicker
                          onPick={(spreadsheet: {
                            id: string;
                            name: string;
                            url: string;
                          }) => {
                            setSheet(spreadsheet);
                            setTitle(spreadsheet.name || title);
                            if (spreadsheet) {
                              setSelectedTemplate("");
                            }
                            setIsOpen(true);
                          }}
                          onSheetNamePick={(sheet) => setSheetName(sheet)}
                          disabled={!!selectedTemplate}
                          onOpenPicker={() => setIsOpen(false)}
                          selectedSheet={sheet}
                          onClearSelection={() => setSheet(null)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateFormModal;
