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
import { Separator } from "./ui/separator";
import SpreadsheetsPicker from "./SpreadsheetsPicker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { SPREADSHEET_TEMPLATES } from "@/lib/spreadsheet-templates";
import { createForm } from "@/actions";
import { useGoogleAccounts } from "@/hooks/use-google-accounts-store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CallbackDoc } from "react-google-drive-picker/dist/typeDefs";
import useSubscription from "@/hooks/useSubscription";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@clerk/nextjs";
import { useUpgradeModalStore } from "@/stores/upgradeModalStore";
import { planLimits } from "@/lib/planLimits";
import { NotionDatabaseSelector } from "./integrations/NotionDatabaseSelector";
import { getNotionAuthUrl } from "@/lib/notion/utils";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";
import useOauthConnection from "@/hooks/useOauthConnection";

const CreateFormModal = () => {
  const supabase = createClient();
  const { userId } = useAuth();
  const { user } = useUser();
  const { data: subscription } = useSubscription();
  const { openUpgradeModal } = useUpgradeModalStore();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { selectedAccount, accounts, setSelectedAccount } = useGoogleAccounts();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [sheet, setSheet] = useState<CallbackDoc | null>(null);
  const [tab, setTab] = useState("google");
  // Notion state
  const [notionAccount, setNotionAccount] = useState<any>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<string>("");
  const [isLoadingNotion, setIsLoadingNotion] = useState(false);
  const [databases, setDatabases] = useState<any[]>([]);

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

  // Notion databases fetch
  useEffect(() => {
    const fetchDatabases = async () => {
      if (!notionAccount?.access_token) return;
      setIsLoadingNotion(true);
      try {
        const res = await fetch("/api/notion/databases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: notionAccount.access_token }),
        });
        const data = await res.json();
        setDatabases(data.databases || []);
      } catch {
        setDatabases([]);
      }
      setIsLoadingNotion(false);
    };
    if (notionAccount?.access_token) fetchDatabases();
  }, [notionAccount]);

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
    if (tab === "notion" && !selectedDatabase) {
      toast.info("Please select a Notion database");
      return;
    }
    if (tab === "google" && !sheet) {
      toast.info("Please select a Google Sheet");
      return;
    }
    // ...existing code for both...
    startTransition(async () => {
      try {
        const result = await createForm({
          title: title.trim(),
          sheetId: tab !== "notion" ? sheet?.id : undefined,
          template: undefined, // handle template if needed
          googleAccountId: tab !== "notion" ? selectedAccount?.id : undefined,
          email: tab !== "notion" ? selectedAccount?.email : undefined,
          notionDatabaseId: tab !== "google" ? selectedDatabase : undefined,
          notionAccountId: tab !== "google" ? notionAccount?.id : undefined,
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

  const handleDialogOpen = () => {
    if (!formCount) return;
    const maxForms =
      planLimits[subscription?.plan as keyof typeof planLimits].maxForms ?? 1;
    const isMaxFormsReached = formCount >= maxForms;
    if (isMaxFormsReached) {
      openUpgradeModal({
        heading: "Upgrade to Add More Forms",
        subHeading:
          "You’ve created the max forms allowed on your plan. Upgrade to continue.",
      });
      return;
    }
  };

  // Notion connect
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger onClick={handleDialogOpen} asChild>
        <Button>
          <Plus />
          Create Form
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Form</DialogTitle>
            <DialogDescription>
              Create a new form to collect data from your users.
            </DialogDescription>
            <DialogDescription>
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
            <Label >
              Where do you want to store submissions?
            </Label>
            <Tabs value={tab} onValueChange={setTab} className="my-4">
              <TabsList className="flex items-center gap-4 justify-between w-full mb-4">
                <TabsTrigger value="notion" asChild>

                  <Button
                    leftIcon={<Image
                      src="/notion.svg"
                      alt="Notion"
                      width={20}
                      height={20}
                    />}

                    variant={'ghost'}
                  >

                    Notion
                  </Button>

                </TabsTrigger>
                <TabsTrigger value="google" asChild>
                  <Button
                    leftIcon={<Image
                      src="/google_sheet.svg"
                      alt="Google Sheets"
                      width={14}
                      height={14}
                    />}

                    variant={'ghost'}
                  >

                    Google Sheets
                  </Button>

                </TabsTrigger>
                <TabsTrigger value="both" asChild>
                  <Button
                    variant={'ghost'}
                    leftIcon={
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
                    }
                  >

                    Both
                  </Button>

                </TabsTrigger>
              </TabsList>
              <TabsContent value="notion" >
                {!notionAccount ? (
                  <Button onClick={handleConnectToNotion} type="button" className="w-full" leftIcon={
                    <Image
                      src="/notion.svg"
                      alt="Notion"
                      width={20}
                      height={20}
                    />
                  }>

                    Connect to Notion
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Label>Notion Database</Label>
                    <NotionDatabaseSelector
                      databases={databases}
                      isLoadingDatabases={isLoadingNotion}
                      selectedDatabase={selectedDatabase}
                      setSelectedDatabase={setSelectedDatabase}
                      setOpenCreateDbDialog={() => { }}
                      updateNotionIntegration={() => { }}
                      isEnabled={true}
                    />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="google">
                {!selectedAccount ? (
                  <Button onClick={handleConnectToGoogle} type="button" className="w-full" leftIcon={
                    <Image
                      src="/google_sheet.svg"
                      alt="Google Sheets"
                      width={14}
                      height={14}
                    />
                  }>

                    Connect to Google Sheets
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Label>Google Sheet</Label>
                    <SpreadsheetsPicker
                      onPicked={(data) => {
                        setSheet(data.docs?.[0] || null);
                        setTitle(data.docs?.[0]?.name || title);
                      }}
                      selectedSheet={sheet}
                    />
                  </div>
                )}
              </TabsContent>
              <TabsContent value="both">
                <div className="space-y-4">
                  {/* Notion */}
                  {!notionAccount ? (
                    <Button onClick={handleConnectToNotion} type="button" className="w-full" leftIcon={
                      <Image
                        src="/notion.svg"
                        alt="Notion"
                        width={20}
                        height={20}
                      />
                    }>

                      Connect to Notion
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Label>Notion Database</Label>
                      <NotionDatabaseSelector
                        databases={databases}
                        isLoadingDatabases={isLoadingNotion}
                        selectedDatabase={selectedDatabase}
                        setSelectedDatabase={setSelectedDatabase}
                        setOpenCreateDbDialog={() => { }}
                        updateNotionIntegration={() => { }}
                        isEnabled={true}
                      />
                    </div>
                  )}
                  {/* Google */}
                  {!selectedAccount ? (

                    <Button onClick={handleConnectToGoogle} type="button" className="w-full" leftIcon={
                      <Image
                        src="/google_sheet.svg"
                        alt="Google Sheets"
                        width={14}
                        height={14}
                      />
                    }>

                      Connect to Google Sheets
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Label>Google Sheet</Label>
                      <SpreadsheetsPicker
                        onPicked={(data) => {
                          setSheet(data.docs?.[0] || null);
                          setTitle(data.docs?.[0]?.name || title);
                        }}
                        selectedSheet={sheet}
                      />
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
