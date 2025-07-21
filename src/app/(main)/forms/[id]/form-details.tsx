"use client";
import { BellIcon, FileSpreadsheetIcon } from "lucide-react";
import CodeSnippet from "./CodeSnippet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ConfigureIntegration from "@/components/integrations/configure-integrations";
import { FormSettings } from "./FormSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DeleteFormButton from "./delete-form-button";
import { DomainManager } from "./DomainManager";
import FileUploadSettings from "@/components/FileUploadSettings";
import { updateForm } from "@/actions";
import { FormDetails as IFormDetails } from "@/types/form-details";
import CodeBlock from "@/components/code-block";
import { useGoogleAccounts } from "@/hooks/useGoogleAccount";
import AllowGooglePermissions from "@/components/AllowGooglePermissions";
import SpreadsheetsPicker from "@/components/SpreadsheetsPicker";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createSheet } from "@/lib/google/sheets";
import { useRouter } from "nextjs-toploader/app";
import { WebhookSettings } from "@/components/integrations/WebhookSettings";
import { SubscriptionData } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

type Spreadsheet = {
  id: string;
  name: string;
  url: string;
};

export const FormDetails = ({
  data,
  endpointUrl,
  appUrl,
  id,
  initialWebhookEnabled,
  initialWebhookUrl,
  initialWebhookSecret,
  subscription,
}: {
  data: IFormDetails;
  endpointUrl: string;
  appUrl: string;
  id: string;
  initialWebhookEnabled: boolean;
  initialWebhookUrl: string;
  initialWebhookSecret: string;
  subscription?: SubscriptionData
}) => {
  const { selectedAccount } = useGoogleAccounts();
  const [isPending, startTransition] = useTransition();
  const [newSpreadsheetTitle, setNewSpreadsheetTitle] = useState("");
  const [sheetName, setSheetName] = useState("");
  const router = useRouter();

  const [selectedSpreadsheet, setSelectedSpreadsheet] = useState<Spreadsheet | null>(
    data.spreadsheet_id
      ? {
        id: data.spreadsheet_id,
        name: data.sheet_name || "Unnamed Sheet",
        url: `https://docs.google.com/spreadsheets/d/${data.spreadsheet_id}`,
      }
      : null,
  );

  const formEmbeddingCode = `<iframe 
src="${process.env.NEXT_PUBLIC_APP_URL}/f/${id}"
width="100%"
height="400"
title="Heysheet Form Embed"
loading="lazy"
></iframe>
`;

  const handleConnectSpreadsheet = async (
    spreadsheetId: string,
    sheetName: string,
    spreadsheetUrl: string,
  ) => {
    startTransition(async () => {
      try {
        await updateForm(
          {
            spreadsheet_id: spreadsheetId,
            sheet_name: sheetName,
            google_account_id: selectedAccount?.id,
          },
          id,
        );
        setSelectedSpreadsheet({
          id: spreadsheetId,
          name: sheetName,
          url: spreadsheetUrl,
        });
        toast.success("Spreadsheet connected successfully!");
        router.refresh();
      } catch (error) {
        toast.error("Failed to connect spreadsheet");
      }
    });
  };

  const handleClearSelection = async () => {
    startTransition(async () => {
      try {
        await updateForm(
          {
            spreadsheet_id: null,
            sheet_name: null,
            google_account_id: null,
          },
          id,
        );
        setSelectedSpreadsheet(null);
        toast.success("Spreadsheet connection cleared!");
        router.refresh();
      } catch (error) {
        toast.error("Failed to clear spreadsheet connection");
      }
    });
  };

  const handleCreateNewSpreadsheet = async (title: string) => {
    if (!selectedAccount?.id || !title.trim()) return;

    startTransition(async () => {
      try {
        const sheet = await createSheet(selectedAccount.id, title, [
          "Name",
          "Email",
          "Message",
        ]);
        await updateForm(
          {
            spreadsheet_id: sheet.spreadsheetId,
            sheet_name: title,
            google_account_id: selectedAccount.id,
          },
          id,
        );
        setSelectedSpreadsheet({
          id: sheet.spreadsheetId as string,
          name: title,
          url: `https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}`,
        });
        toast.success("New spreadsheet created and connected!");
        setNewSpreadsheetTitle("");
        router.refresh();
      } catch (error) {
        toast.error("Failed to create spreadsheet");
      }
    });
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{data.title}</h1>
        <p className="text-muted-foreground flex items-center gap-1">
          <BellIcon className="w-4 h-4" />
          {data.submission_count === 0
            ? "No submissions yet"
            : `${data.submission_count} Responses Collected`}
        </p>
        <p className="text-sm text-muted-foreground">
          Manage your form settings, connected spreadsheet, and integration
          options.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Connected spreadsheet</CardTitle>
          <CardDescription>
            Manage your Google Sheets connection below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!selectedAccount ? (
            <AllowGooglePermissions />
          ) : selectedSpreadsheet ? (
            <a
              href={selectedSpreadsheet.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button leftIcon={<FileSpreadsheetIcon className="w-5 h-5" />}>
                Open {selectedSpreadsheet.name} Spreadsheet
              </Button>
            </a>
          ) : isPending ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">
                  Select an existing spreadsheet:
                </p>
                <SpreadsheetsPicker
                  onPick={(spreadsheet) => {
                    if (spreadsheet) {
                      handleConnectSpreadsheet(
                        spreadsheet.id,
                        sheetName || spreadsheet.name,
                        spreadsheet.url,
                      );
                    }
                  }}
                  disabled={isPending}
                  onSheetNamePick={(val) => {
                    setSheetName(val);
                  }}
                  selectedSheet={selectedSpreadsheet}
                  onClearSelection={handleClearSelection}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">
                  Or create a new spreadsheet:
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter spreadsheet name"
                    value={newSpreadsheetTitle}
                    onChange={(e) => setNewSpreadsheetTitle(e.target.value)}
                    disabled={isPending}
                  />
                  <Button
                    onClick={() =>
                      handleCreateNewSpreadsheet(newSpreadsheetTitle)
                    }
                    disabled={isPending || !newSpreadsheetTitle.trim()}
                  >
                    {isPending ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <FormSettings
        endpointUrl={endpointUrl}
        formBuilderUrl={`${appUrl}/form-builder/${id}`}
        sharablePublicUrl={`${appUrl}/f/${id}`}
        formId={id}
        redirectUrl={data.redirect_url ?? ""}
      />
      <WebhookSettings
        formId={id}
        initialWebhookEnabled={initialWebhookEnabled}
        initialWebhookUrl={initialWebhookUrl}
        initialWebhookSecret={initialWebhookSecret}
      />
      <FileUploadSettings
        form={{
          id: id,
          file_upload_enabled: data.file_upload.enabled,
          file_upload_max_files: data.file_upload.max_files,
          file_upload_allowed_types: data.file_upload.allowed_file_types,
        }}
        onSave={async (config) => {
          await updateForm(
            {
              file_upload: {
                enabled: config.file_upload_enabled,
                max_files: config.file_upload_max_files,
                allowed_file_types: config.file_upload_allowed_types,
              },
            },
            id,
          );
        }}
        subscription={subscription}
      />

      <DomainManager domains={data.domains} formId={id} />

      <ConfigureIntegration data={data} subscription={subscription} />
      <CodeSnippet endpointUrl={endpointUrl} />
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Embed Your Form Anywhere</CardTitle>
          <CardDescription>
            Easily embed this form into your website by copying and pasting the
            code below. It’s responsive, lightweight, and works out of the box.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={formEmbeddingCode} lang="html" />
        </CardContent>
      </Card>
      <DeleteFormButton id={id} isActive={data.is_active} />
    </div>
  );
};
